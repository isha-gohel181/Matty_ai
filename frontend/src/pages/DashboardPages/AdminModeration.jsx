import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllActivityLogs, clearUserLogs } from '@/redux/slice/activity/activity.slice';
import {
  Shield,
  Search,
  Eye,
  Ban,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  FileText,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { motion } from 'framer-motion';

const AdminModeration = () => {
  const dispatch = useDispatch();
  const { allActivityLogs, allActivitiesLoading, error } = useSelector((state) => state.activityLog);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [clearLogsDialogOpen, setClearLogsDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllActivityLogs());
  }, [dispatch]);

  const getActivityIcon = (action) => {
    switch (action) {
      case 'upload':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'delete':
        return <Trash2 className="h-4 w-4 text-red-500" />;
      case 'update':
        return <FileText className="h-4 w-4 text-yellow-500" />;
      case 'login':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'logout':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      case 'register':
        return <User className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
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

  const handleClearUserLogs = (user) => {
    setSelectedUser(user);
    setClearLogsDialogOpen(true);
  };

  const confirmClearLogs = () => {
    if (selectedUser) {
      dispatch(clearUserLogs(selectedUser._id));
      setClearLogsDialogOpen(false);
      setSelectedUser(null);
    }
  };

  // Flatten all activities for moderation view
  const allActivities = allActivityLogs?.flatMap(log =>
    log.activities?.map(activity => ({
      ...activity,
      user: log.user
    })) || []
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];

  const filteredActivities = allActivities.filter(activity =>
    activity.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group activities by user for user management view
  const activitiesByUser = allActivityLogs?.map(log => ({
    user: log.user,
    activities: log.activities || [],
    totalActivities: log.activities?.length || 0,
    lastActivity: log.activities?.[0]?.createdAt || null
  })) || [];

  const filteredUsers = activitiesByUser.filter(userData =>
    userData.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    userData.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (allActivitiesLoading) {
    return (
      <div className="p-4 md:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-8">
        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p className="text-lg font-semibold">Error loading moderation data</p>
              <p className="text-sm mt-2">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Content Moderation</h1>
        <p className="text-muted-foreground">
          Monitor user activities, moderate content, and manage platform security
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search activities, users, or actions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="activities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="activities">All Activities</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>

        <TabsContent value="activities" className="space-y-4">
          {filteredActivities.length === 0 ? (
            <Card>
              <CardContent className="p-12">
                <div className="text-center">
                  <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No activities found
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm ? 'Try adjusting your search terms' : 'Activities will appear here as users interact with the platform'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredActivities.map((activity, index) => (
              <motion.div
                key={`${activity._id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="p-2 bg-gray-50 rounded-full">
                            {getActivityIcon(activity.action)}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={activity.user?.avatar?.secure_url} alt={activity.user?.fullName} />
                              <AvatarFallback className="text-xs">
                                {activity.user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{activity.user?.fullName}</p>
                              <p className="text-xs text-muted-foreground">{activity.user?.email}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getActivityColor(activity.action)} variant="secondary">
                              {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}
                            </Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimestamp(activity.createdAt)}
                            </span>
                          </div>

                          <p className="text-gray-900 text-sm">
                            {activity.description || `${activity.action} action performed`}
                          </p>

                          {activity.ipAddress && (
                            <p className="text-xs text-muted-foreground mt-1">
                              IP: {activity.ipAddress}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {activity.action === 'upload' && (
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Ban className="h-4 w-4 mr-1" />
                            Flag
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          {filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="p-12">
                <div className="text-center">
                  <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No users found
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm ? 'Try adjusting your search terms' : 'Users will appear here once they register'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredUsers.map((userData, index) => (
              <motion.div
                key={userData.user._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={userData.user.avatar?.secure_url} alt={userData.user.fullName} />
                          <AvatarFallback>
                            {userData.user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <h3 className="font-semibold text-lg">{userData.user.fullName}</h3>
                          <p className="text-sm text-muted-foreground">{userData.user.email}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              {userData.totalActivities} activities
                            </span>
                            {userData.lastActivity && (
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                Last active {formatTimestamp(userData.lastActivity)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Profile
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleClearUserLogs(userData.user)}
                          className="text-orange-600 hover:text-orange-700"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Clear Logs
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Ban className="h-4 w-4 mr-1" />
                          Suspend
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Clear Logs Confirmation Dialog */}
      <AlertDialog open={clearLogsDialogOpen} onOpenChange={setClearLogsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear User Activity Logs</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to clear all activity logs for <strong>{selectedUser?.fullName}</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmClearLogs}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Clear Logs
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminModeration;