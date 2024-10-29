import React from 'react';
import Layout from '../components/Layout';
import { Package, FileText, AlertTriangle, Clock } from 'lucide-react';
import { DashboardStats } from '../types';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [stats, setStats] = React.useState<DashboardStats>({
    totalSales: 0,
    lowStockItems: 0,
    expiringItems: 0,
    totalTransactions: 0,
    todaysSales: 0,
    monthlyRevenue: 0,
    topSellingMedicines: []
  });

  const quickStats = [
    { icon: Package, label: 'Low Stock Items', value: stats.lowStockItems, color: 'text-yellow-600' },
    { icon: AlertTriangle, label: 'Expiring Items', value: stats.expiringItems, color: 'text-red-600' },
    { icon: FileText, label: 'Total Transactions', value: stats.totalTransactions, color: 'text-blue-600' },
    { icon: Clock, label: "Today's Sales", value: `Tsh.${stats.todaysSales.toFixed(2)}`, color: 'text-green-600' }
  ];

  // Monthly revenue data
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Cash Sales',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1
      },
      {
        label: 'Insurance Claims',
        data: [8000, 12000, 10000, 15000, 18000, 20000],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Revenue Breakdown',
        font: {
          size: 16
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Revenue (Tsh)',
          font: {
            size: 14
          }
        }
      }
    }
  };

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
                  <p className="text-base font-medium text-gray-600">{stat.label}</p>
                  <p className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Monthly Revenue</h2>
          <div className="h-[400px]">
            <Bar data={revenueData} options={options} />
          </div>
        </div>

        {/* Top Selling Medicines */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Top Selling Medicines</h2>
            {stats.topSellingMedicines.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                        Medicine
                      </th>
                      <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                        Quantity Sold
                      </th>
                      <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.topSellingMedicines.map((medicine, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                          {medicine.medicineName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
                          {medicine.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
                          Tsh.{medicine.revenue.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4 text-lg">No data available</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}