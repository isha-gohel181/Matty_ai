// adminChangeUserRole → promote/demote users (role: user/admin)

// adminStats → quick dashboard (e.g., total users, active today, uploads count)

import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
import crypto from "crypto"

import { User } from "../models/user.model.js";
import { Design } from "../models/design.model.js";
import { ActivityLog } from "../models/activityLog.model.js";
import { destroyOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.utils.js";


// *================================================================================
const getAllUsers = asyncHandler(async (req, res, next) => {
    const allUsers = await User.find({})

    if (!allUsers) {
        return next(new ErrorHandler("No user find, please check the database for more info", 404))
    }

    return res.status(200).json({
        success: true,
        users: allUsers,
        message: "Found successfully"
    })
});

// *Single user
const getOneUser = asyncHandler(async (req, res, next) => {
    const { userId } = req.params?.id
    console.log(req.params)
    const user = await User.findOne(userId)

    if (!user) {
        return next(new ErrorHandler("No user exist/found, please check the id for debud info", 404))
    }

    return res.status(200).json({
        success: true,
        user,
        message: "User Found successfully"
    })
})



// *Update Profile
const adminUpdateUserProfile = asyncHandler(async (req, res, next) => {
    const userId = req.params?.id
    const { fullName, email, phone, gender, social_links = {} } = req.body
    console.log("req.body[registerUser]:\n", req.body)

    const requiredFields = [email, phone]
    // console.log("requiredFields", requiredFields)

    const checkFields = { email, phone }
    // console.log("Check Fields", checkFields)

    // *Required Fields_____________________________________________
    if (!fullName || !email || !phone) {
        console.error("emptyError")
        return next(new ErrorHandler("All Fields are required", 400))
    }


    // *Check for an existing User__________________________________________________
    const existingUser = await User.findOne({
        _id: { $ne: userId }, // Exclude the current user
        $or: Object.entries(checkFields).map(([key, value]) => ({ [key]: value }))
    })

    if (existingUser) {
        const duplicateField = Object.keys(checkFields).find(key => existingUser[key].toString().toLowerCase() === checkFields[key].toString().toLowerCase())
        // console.log("duplicateFiels:\n", duplicateField, checkFields[duplicateField], existingUser[duplicateField])
        return res.status(400).json({
            success: false,
            message: `User already exist with the same ${duplicateField}: "${checkFields[duplicateField]}"\nPlease try unique one!`,
            duplicateField
        })
        // return next(new ErrorHandler(`User already exist with the same ${duplicateField}: "${checkFields[duplicateField]}"\nPlease try unique one!`, 400))
    }

    try {
        Object.entries(social_links).forEach(([platform, url]) => {
            if (url) {
                try {
                    // Ensure URL is valid
                    const parsed = new URL(url);

                    // 1. Protocol must be HTTPS
                    if (parsed.protocol !== "https:") {
                        throw new Error(`${platform} link must start with https://`);
                    }

                    // 2. Hostname must contain platform domain (except for website)
                    if (platform !== "website" && !parsed.hostname.includes(`${platform}.com`)) {
                        throw new Error(`${platform} link must be a valid ${platform}.com domain`);
                    }

                } catch (e) {
                    throw new Error(`${platform} link is invalid. Please enter a valid full https link.`);
                }
            }
        });

    } catch (error) {
        console.log(error)
        return res.status(403).json({
            error: "You must provide full links with http(s) included"
        });
    }




    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { fullName, email, phone, gender, social_links },
        { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!updatedUser) {
        return next(new ErrorHandler("User not found", 404));
    }

    return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: updatedUser
    });


})


// *Update Profile User
const adminUpdateUserAvatar = asyncHandler(async (req, res, next) => {
    console.log("reques.files: ", req.file?.path)
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        return next(new ErrorHandler("Avatar File is Missing", 401))
    }

    const user = await User.findById(req?.params?.id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // *Delete the previous file
    // ----------------------------------------------------------------
    const previousAvatar = user.avatar?.public_id;
    console.log("previousAvatar", previousAvatar)

    if (previousAvatar) {
        const deleteAvatarResponse = await destroyOnCloudinary(previousAvatar);
        console.log("deletedAvatarr:response--", deleteAvatarResponse);
    } else {
        console.log("No previous avatr found")
    }
    // ----------------------------------------------------------------


    // *UPLOADING NEW AVATAR
    const newAvatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("Previous URL: ", newAvatar)

    if (!newAvatar || !newAvatar.url || !newAvatar.public_id) {
        return next(new ErrorHandler("Error while uploading avatar!", 500));
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.params?.id,
        {
            $set: {
                "avatar.public_id": newAvatar.public_id,
                "avatar.secure_url": newAvatar.secure_url,
            },
        },
        { new: true }
    ).select("-password")

    console.log("NEW URL: ", newAvatar);
    console.log("NEW URL: ", updatedUser.avatar);
    console.log("Updated User Avatar URL:", updatedUser.avatar.secure_url);

    return res
        .status(200)
        .json({
            success: true,
            user: updatedUser,
            message: "Avatar Updated Successfully!"
        })
})


// *Delete User
const adminDeleteUser = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.params?.id;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User Not Found", 404))

        }

        // *Delete the previous file
        // ----------------------------------------------------------------
        const userAvatar = user.avatar?.public_id;
        console.log("userAvatar", userAvatar)

        if (userAvatar) {
            const deleteAvatarResponse = await destroyOnCloudinary(userAvatar);
            console.log("deletedAvatarr:response--", deleteAvatarResponse);
        } else {
            console.log("No avatr found")
        }



        // Delete the user
        await User.findByIdAndDelete(userId);
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return next(new ErrorHandler("Internal Server Error", 500))
    }
});


const getAdminStats = asyncHandler(async (req, res, next) => {
    try {
        // Get total users count
        const totalUsers = await User.countDocuments();

        // Get total designs count
        const totalDesigns = await Design.countDocuments();

        // Get users registered today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const usersToday = await User.countDocuments({
            createdAt: { $gte: today }
        });

        // Get designs created today
        const designsToday = await Design.countDocuments({
            createdAt: { $gte: today }
        });

        // Get recent activities (last 24 hours)
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentActivities = await ActivityLog.aggregate([
            { $unwind: "$activities" },
            { $match: { "activities.createdAt": { $gte: yesterday } } },
            { $group: { _id: null, count: { $sum: 1 } } }
        ]);

        // Get user role distribution
        const userRoles = await User.aggregate([
            { $group: { _id: "$role", count: { $sum: 1 } } }
        ]);

        // Get top active users (most designs)
        const topActiveUsers = await Design.aggregate([
            { $group: { _id: "$user", designCount: { $sum: 1 } } },
            { $sort: { designCount: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $project: {
                    _id: "$user._id",
                    fullName: "$user.fullName",
                    email: "$user.email",
                    designCount: 1
                }
            }
        ]);

        // Get activity trends (last 7 days)
        const activityTrends = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);

            const dayActivities = await ActivityLog.aggregate([
                { $unwind: "$activities" },
                {
                    $match: {
                        "activities.createdAt": {
                            $gte: date,
                            $lt: nextDay
                        }
                    }
                },
                { $group: { _id: null, count: { $sum: 1 } } }
            ]);

            activityTrends.push({
                date: date.toISOString().split('T')[0],
                activities: dayActivities.length > 0 ? dayActivities[0].count : 0
            });
        }

        const stats = {
            overview: {
                totalUsers,
                totalDesigns,
                usersToday,
                designsToday,
                recentActivities: recentActivities.length > 0 ? recentActivities[0].count : 0
            },
            userRoles,
            topActiveUsers,
            activityTrends
        };

        res.status(200).json({
            success: true,
            stats,
            message: "Admin statistics retrieved successfully"
        });
    } catch (error) {
        console.error("Error getting admin stats:", error);
        return next(new ErrorHandler("Failed to retrieve admin statistics", 500));
    }
});


export {
    getAllUsers,
    getOneUser,
    adminUpdateUserProfile,
    adminUpdateUserAvatar,
    adminDeleteUser,
    getAdminStats
}