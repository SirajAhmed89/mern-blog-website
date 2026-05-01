import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: number;
  trend?: { value: number; isPositive: boolean };
  color?: 'primary' | 'success' | 'warning' | 'info';
}

const colorMap = {
  primary: 'bg-primary-50 text-primary-600',
  success: 'bg-success-50 text-success-600',
  warning: 'bg-warning-50 text-warning-600',
  info: 'bg-info-50 text-info-600',
};

export default function StatCard({ title, value, icon, change, trend, color = 'primary' }: StatCardProps) {
  // Use trend if provided, otherwise fall back to change
  const displayChange = trend?.value ?? change;
  const isPositive = trend?.isPositive ?? (change !== undefined ? change >= 0 : true);

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorMap[color]}`}>{icon}</div>
        {displayChange !== undefined && (
          <span className={`text-sm font-medium ${isPositive ? 'text-success-600' : 'text-error-600'}`}>
            {isPositive ? '+' : ''}{displayChange}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-neutral-900 mb-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      <p className="text-sm text-neutral-500">{title}</p>
    </div>
  );
}
