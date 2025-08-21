'use client';

import { DashboardStats } from '@/types/dashboard';
import { formatPrice, formatPercentage } from '@/lib/utils/stationUtils';
import  Card  from '@/components/ui/Card';

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const {
    total,
    pricing,
    breakdown
  } = stats;

  const statsData = [
    {
      title: 'Total Stations',
      value: total.stations.toString(),
      subtitle: `${total.filtered} filtered`,
      icon: '⛽',
      color: 'blue'
    },
    {
      title: 'Avg Diesel Price',
      value: formatPrice(pricing.avgDieselPrice),
      subtitle: 'Per liter',
      icon: '🚗',
      color: 'green'
    },
    {
      title: 'Avg Gasoline 95',
      value: formatPrice(pricing.avgGasoline95Price),
      subtitle: 'Per liter',
      icon: '⛽',
      color: 'yellow'
    },
    {
      title: 'Brands',
      value: breakdown.brands.toString(),
      subtitle: 'Different brands',
      icon: '🏢',
      color: 'purple'
    },
    {
      title: 'With Shops',
      value: breakdown.stationsWithShops.toString(),
      subtitle: formatPercentage(breakdown.stationsWithShops, total.filtered),
      icon: '🛒',
      color: 'indigo'
    },
    {
      title: 'Common Fuel',
      value: breakdown.mostCommonFuelType || 'N/A',
      subtitle: 'Most offered',
      icon: '⛽',
      color: 'pink'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      pink: 'bg-pink-50 text-pink-700 border-pink-200'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {statsData.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center text-lg
                  ${getColorClasses(stat.color)}
                `}>
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500">
                    {stat.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}