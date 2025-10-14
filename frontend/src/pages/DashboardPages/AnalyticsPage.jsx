import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserAnalytics } from "@/redux/slice/analytics/analytics.slice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  TrendingUp,
  FileText,
  Heart,
  Activity,
  Trophy,
  Calendar,
  Target
} from "lucide-react";
import { motion } from "framer-motion";

const AnalyticsPage = () => {
  const dispatch = useDispatch();
  const { analytics, loading } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(getUserAnalytics());
  }, [dispatch]);

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading analytics...</p>
      </div>
    );
  }

  const { overview, mostUsedTemplates, designActivity, popularCategories } = analytics;

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold">Analytics Dashboard</h1>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Designs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.totalDesigns}</div>
              <p className="text-xs text-muted-foreground">
                Designs you've created
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favorites</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.totalFavorites}</div>
              <p className="text-xs text-muted-foreground">
                Templates you love
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.recentActivity}</div>
              <p className="text-xs text-muted-foreground">
                Actions in last 30 days
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Rank</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#{overview.userRank || 'N/A'}</div>
              <p className="text-xs text-muted-foreground">
                Among all creators
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Design Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Design Activity (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {designActivity.map((day, index) => (
                  <div key={day.date} className="flex items-center gap-3">
                    <div className="w-16 text-sm text-muted-foreground">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className="flex-1">
                      <Progress
                        value={(day.designs / Math.max(...designActivity.map(d => d.designs))) * 100}
                        className="h-2"
                      />
                    </div>
                    <div className="w-8 text-sm font-medium">{day.designs}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Most Used Templates */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Most Used Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mostUsedTemplates.length > 0 ? (
                <div className="space-y-4">
                  {mostUsedTemplates.map((template, index) => (
                    <div key={template._id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={template.thumbnailUrl?.secure_url}
                          alt={template.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{template.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Used {template.usageCount} times
                        </p>
                      </div>
                      <Badge variant="secondary">#{index + 1}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No template usage data yet
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Popular Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Your Favorite Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            {popularCategories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {popularCategories.map((category, index) => (
                  <Badge key={category._id || index} variant="outline" className="px-3 py-1">
                    {category._id || 'General'} ({category.count})
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Start favoriting templates to see your preferences
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Designs Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{overview.recentDesigns}</div>
                <p className="text-sm text-muted-foreground">Designs this week</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{overview.totalTemplates}</div>
                <p className="text-sm text-muted-foreground">Templates available</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {overview.totalDesigns > 0 ? Math.round((overview.totalFavorites / overview.totalDesigns) * 100) : 0}%
                </div>
                <p className="text-sm text-muted-foreground">Favorite ratio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;