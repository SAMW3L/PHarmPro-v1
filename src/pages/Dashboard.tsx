import React from 'react';
import Layout from '../components/Layout';
import { Package, FileText, AlertTriangle, Clock } from 'lucide-react';
import { DashboardStats } from '../types';

export default function Dashboard() {
  const [stats, setStats] = React.useState<DashboardStats>({
    totalSales: 0,
    lowStockItems: 0,
    expiringItems: 0,
    pendingPrescriptions: 0,
    todaysSales: 0,
    monthlyRevenue: 0,
    topSellingMedicines: []
  });

  const quickStats = [
    { icon: Package, label: 'Low Stock Items', value: stats.lowStockItems, color: 'text-yellow-600' },
    { icon: AlertTriangle, label: 'Expiring Items', value: stats.expiringItems, color: 'text-red-600' },
    { icon: FileText, label: 'Pending Prescriptions', value: stats.pendingPrescriptions, color: 'text-blue-600' },
    { icon: Clock, label: "Today's Sales", value: `$${stats.todaysSales.toFixed(2)}`, color: 'text-green-600' }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Monthly Revenue</h2>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Chart will be implemented here
          </div>
        </div>

        {/* Top Selling Medicines */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Top Selling Medicines</h2>
            {stats.topSellingMedicines.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Medicine
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity Sold
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.topSellingMedicines.map((medicine, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {medicine.medicineName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {medicine.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${medicine.revenue.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No data available</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}