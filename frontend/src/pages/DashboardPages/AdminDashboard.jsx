import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { adminGetStats } from '@/redux/slice/admin/admin.slice';
import {
  Users,
  FileText,
  TrendingUp,
  Activity,
  BarChart3,
  PieChart,
  UserCheck,
  Calendar,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, statsLoading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(adminGetStats());
  }, [dispatch]);

  if (statsLoading) {
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
              <p className="text-lg font-semibold">Error loading dashboard</p>
              <p className="text-sm mt-2">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const overviewCards = [
    {
      title: 'Total Users',
      value: stats?.overview?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
      change: stats?.overview?.usersToday ? `+${stats.overview.usersToday} today` : null
    },
    {
      title: 'Total Designs',
      value: stats?.overview?.totalDesigns || 0,
      icon: FileText,
      color: 'bg-green-500',
      change: stats?.overview?.designsToday ? `+${stats.overview.designsToday} today` : null
    },
    {
      title: 'Recent Activity',
      value: stats?.overview?.recentActivities || 0,
      icon: Activity,
      color: 'bg-purple-500',
      change: 'Last 24 hours'
    },
    {
      title: 'Active Users',
      value: stats?.topActiveUsers?.length || 0,
      icon: UserCheck,
      color: 'bg-orange-500',
      change: 'Top contributors'
    }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your platform's performance and user activity
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {overviewCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold">{card.value}</p>
                    {card.change && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {card.change}
                      </p>
                    )}
                  </div>
                  <div className={`p-3 rounded-full ${card.color}`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link to="/dashboard/admin/users">
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/dashboard/admin/moderation">
              <Shield className="mr-2 h-4 w-4" />
              Moderation
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Roles Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              User Roles Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.userRoles && stats.userRoles.length > 0 ? (
              <div className="space-y-3">
                {stats.userRoles.map((role, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {role._id || 'user'}
                      </Badge>
                    </div>
                    <span className="font-semibold">{role.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No role data available
              </p>
            )}
          </CardContent>
        </Card>

        {/* Top Active Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.topActiveUsers && stats.topActiveUsers.length > 0 ? (
              <div className="space-y-3">
                {stats.topActiveUsers.map((user, index) => (
                  <div key={user._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {user.designCount} designs
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No active users data available
              </p>
            )}
          </CardContent>
        </Card>

        {/* Activity Trends (Last 7 Days) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Activity Trends (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.activityTrends && stats.activityTrends.length > 0 ? (
              <div className="space-y-4">
                {stats.activityTrends.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {new Date(day.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min((day.activities / Math.max(...stats.activityTrends.map(d => d.activities))) * 100, 100)}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold w-8 text-right">
                        {day.activities}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No activity trend data available
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;