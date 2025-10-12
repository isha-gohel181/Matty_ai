import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import { User } from "../models/user.model.js";
import { Design } from "../models/design.model.js";
import { Template } from "../models/template.model.js";
import { Favorite } from "../models/favorite.model.js";
import { ActivityLog } from "../models/activityLog.model.js";

const getUserAnalytics = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Get user's designs count
        const userDesignsCount = await Design.countDocuments({ user: userId });

        // Get user's favorite templates count
        const userFavoritesCount = await Favorite.countDocuments({ user: userId });

        // Get user's activity count (last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const userActivities = await ActivityLog.aggregate([
            { $match: { user: userId } },
            { $unwind: "$activities" },
            { $match: { "activities.createdAt": { $gte: thirtyDaysAgo } } },
            { $group: { _id: null, count: { $sum: 1 } } }
        ]);

        // Get user's designs created in last 7 days
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentDesigns = await Design.find({
            user: userId,
            createdAt: { $gte: sevenDaysAgo }
        }).countDocuments();

        // Get most used templates by user
        const mostUsedTemplates = await Design.aggregate([
            { $match: { user: userId, template: { $exists: true, $ne: null } } },
            { $group: { _id: "$template", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "templates",
                    localField: "_id",
                    foreignField: "_id",
                    as: "template"
                }
            },
            { $unwind: "$template" },
            {
                $project: {
                    _id: "$template._id",
                    title: "$template.title",
                    thumbnailUrl: "$template.thumbnailUrl",
                    usageCount: "$count"
                }
            }
        ]);

        // Get user's design activity over last 7 days
        const designActivity = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);

            const dayDesigns = await Design.countDocuments({
                user: userId,
                createdAt: {
                    $gte: date,
                    $lt: nextDay
                }
            });

            designActivity.push({
                date: date.toISOString().split('T')[0],
                designs: dayDesigns
            });
        }

        // Get popular categories based on user's favorites
        const popularCategories = await Favorite.aggregate([
            { $match: { user: userId } },
            {
                $lookup: {
                    from: "templates",
                    localField: "template",
                    foreignField: "_id",
                    as: "template"
                }
            },
            { $unwind: "$template" },
            { $group: { _id: "$template.category", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // Get total templates available
        const totalTemplates = await Template.countDocuments();

        // Get user's rank among all users (by design count)
        const userRank = await Design.aggregate([
            { $group: { _id: "$user", designCount: { $sum: 1 } } },
            { $sort: { designCount: -1 } },
            {
                $group: {
                    _id: null,
                    users: { $push: { user: "$_id", designCount: "$designCount" } }
                }
            },
            {
                $project: {
                    users: 1,
                    userRank: {
                        $indexOfArray: ["$users.user", userId]
                    }
                }
            }
        ]);

        const rank = userRank.length > 0 ? userRank[0].userRank + 1 : null;

        const analytics = {
            overview: {
                totalDesigns: userDesignsCount,
                totalFavorites: userFavoritesCount,
                recentActivity: userActivities.length > 0 ? userActivities[0].count : 0,
                recentDesigns: recentDesigns,
                userRank: rank,
                totalTemplates: totalTemplates
            },
            mostUsedTemplates,
            designActivity,
            popularCategories
        };

        res.status(200).json({
            success: true,
            analytics,
            message: "User analytics retrieved successfully"
        });
    } catch (error) {
        console.error("Error getting user analytics:", error);
        return next(new ErrorHandler("Failed to retrieve user analytics", 500));
    }
});

export {
    getUserAnalytics
};