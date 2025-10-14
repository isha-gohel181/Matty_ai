import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Crown, Zap, Palette, FileText, AlertCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import api from '@/utils/api';
import { toast } from 'sonner';

const UsageStats = () => {
  const navigate = useNavigate();
  const [usageData, setUsageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsageData();
  }, []);

  const fetchUsageData = async () => {
    try {
      const response = await api.get('/api/v1/payment/usage');
      setUsageData(response.data.usageStats);
    } catch (error) {
      console.error('Error fetching usage data:', error);
      toast.error('Failed to load usage statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPremium = usageData?.isPremium;
  const plan = usageData?.subscriptionPlan;
  const endDate = usageData?.subscriptionEndDate ? new Date(usageData.subscriptionEndDate) : null;

  // Usage statistics
  const usageStats = [
    {
      icon: Zap,
      label: "AI Suggestions",
      used: usageData?.currentUsage?.aiSuggestions || 0,
      limit: isPremium ? 'unlimited' : (usageData?.limits?.aiSuggestions || 5),
      color: "text-blue-500"
    },
    {
      icon: Palette,
      label: "Color Palettes",
      used: usageData?.currentUsage?.colorPalettes || 0,
      limit: isPremium ? 'unlimited' : (usageData?.limits?.colorPalettes || 3),
      color: "text-purple-500"
    },
    {
      icon: FileText,
      label: "Templates",
      used: 0, // This would need to be tracked separately
      limit: isPremium ? 'unlimited' : (usageData?.limits?.templates || 10),
      color: "text-green-500"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className={`h-5 w-5 ${isPremium ? 'text-yellow-500' : 'text-gray-400'}`} />
            Subscription Status
          </CardTitle>
          <CardDescription>
            {isPremium ? `Active ${plan} plan` : 'Free plan active'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPremium ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Plan:</span>
                <span className="text-sm capitalize">{plan}</span>
              </div>
              {endDate && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Expires:</span>
                  <span className="text-sm">{endDate.toLocaleDateString()}</span>
                </div>
              )}
              <div className="text-green-600 text-sm font-medium">
                ✓ Unlimited access to all features
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">Upgrade to unlock unlimited access</span>
              </div>
              <Button
                onClick={() => navigate('/dashboard/payment?plan=pro-monthly')}
                className="w-full"
                size="sm"
              >
                Upgrade to Pro
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      {!isPremium && (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Usage</CardTitle>
            <CardDescription>Track your free tier limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {usageStats.map((stat, index) => {
              const Icon = stat.icon;
              const percentage = stat.limit === 'unlimited' ? 0 : (stat.used / stat.limit) * 100;

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                      <span className="text-sm font-medium">{stat.label}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {stat.used} / {stat.limit}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  {percentage > 80 && (
                    <p className="text-xs text-amber-600">
                      Running low on {stat.label.toLowerCase()}
                    </p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!isPremium && (
            <Button
              onClick={() => navigate('/dashboard/payment?plan=pro-monthly')}
              className="w-full"
              variant="default"
            >
              Upgrade Account
            </Button>
          )}
          <Button
            onClick={() => navigate('/dashboard/profile')}
            variant="outline"
            className="w-full"
          >
            Manage Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsageStats;