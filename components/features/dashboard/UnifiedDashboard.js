import React, { useState } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { DashboardStats } from './widgets/DashboardStats';
import { DashboardCharts } from './charts/DashboardCharts';
import { RecentActivity } from './widgets/RecentActivity';
import { QuickActions } from './widgets/QuickActions';
import { MarketWidget } from './widgets/MarketWidget';
import { useDashboard } from '../../../hooks/useDashboard';

export default function UnifiedDashboard() {
  const [selectedView, setSelectedView] = useState('overview');
  const { stats, loading, error } = useDashboard();

  const views = [
    { id: 'overview', label: '🏠 Visão Geral' },
    { id: 'analytics', label: '📊 Analytics' },
    { id: 'market', label: '📈 Mercado' }
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        views={views}
        selectedView={selectedView}
        onViewChange={setSelectedView}
      />

      <DashboardStats stats={stats} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardCharts view={selectedView} />
        </div>

        <div className="space-y-6">
          <RecentActivity />
          <QuickActions />
          <MarketWidget />
        </div>
      </div>
    </div>
  );
}
