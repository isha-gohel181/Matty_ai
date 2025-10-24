import React from 'react';
import UsageStats from '@/components/Dashboard/UsageStats';

const UsagePage = () => {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Usage Statistics</h1>
      <UsageStats />
    </div>
  );
};

export default UsagePage;