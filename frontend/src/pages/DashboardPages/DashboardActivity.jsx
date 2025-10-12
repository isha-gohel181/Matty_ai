import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyActivityLogs } from '@/redux/slice/activity/activity.slice';
import {
  Upload,
  Trash2,
  Edit,
  LogIn,
  LogOut,
  UserPlus,
  Clock,
  Activity as ActivityIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const DashboardActivity = () => {
  const dispatch = useDispatch();
  const { myActivities, myActivitiesLoading, error } = useSelector((state) => state.activityLog);

  useEffect(() => {
    dispatch(getMyActivityLogs());
  }, [dispatch]);

  const getActivityIcon = (action) => {
    switch (action) {
      case 'upload':
        return <Upload className="h-4 w-4 text-blue-500" />;
      case 'delete':
        return <Trash2 className="h-4 w-4 text-red-500" />;
      case 'update':
        return <Edit className="h-4 w-4 text-yellow-500" />;
      case 'login':
        return <LogIn className="h-4 w-4 text-green-500" />;
      case 'logout':
        return <LogOut className="h-4 w-4 text-gray-500" />;
      case 'register':
        return <UserPlus className="h-4 w-4 text-purple-500" />;
      default:
        return <ActivityIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityColor = (action) => {
    switch (action) {
      case 'upload':
        return 'bg-blue-100 text-blue-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      case 'update':
        return 'bg-yellow-100 text-yellow-800';
      case 'login':
        return 'bg-green-100 text-green-800';
      case 'logout':
        return 'bg-gray-100 text-gray-800';
      case 'register':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return diffInDays === 1 ? 'Yesterday' : `${diffInDays} days ago`;
    }
  };

  if (myActivitiesLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p className="text-lg font-semibold">Error loading activities</p>
              <p className="text-sm mt-2">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Activity Log</h1>
        <p className="text-muted-foreground">
          Track your recent activities and actions on the platform
        </p>
      </div>

      {myActivities.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <ActivityIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No activities yet
              </h3>
              <p className="text-gray-500">
                Your activity log will appear here once you start using the platform
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {myActivities.map((activity, index) => (
            <motion.div
              key={`${activity._id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="p-2 bg-gray-50 rounded-full">
                        {getActivityIcon(activity.action)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant="secondary"
                          className={getActivityColor(activity.action)}
                        >
                          {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}
                        </Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatTimestamp(activity.createdAt)}
                        </div>
                      </div>

                      <p className="text-foreground font-medium mb-1">
                        {activity.description || `${activity.action} action performed`}
                      </p>

                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">IP:</span> {activity.ipAddress || 'N/A'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {myActivities.length > 0 && (
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Showing last {myActivities.length} activities
        </div>
      )}
    </div>
  );
};

export default DashboardActivity;