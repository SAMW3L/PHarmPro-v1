import React from 'react';
import Layout from '../../components/Layout';
import { Calendar, Download, TrendingUp, Package, AlertTriangle, Users, DollarSign, FileSpreadsheet } from 'lucide-react';
import { Medicine, Sale, User } from '../../types';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = React.useState('sales');
  const [dateRange, setDateRange] = React.useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  // Mock data for reports
  const [salesData] = React.useState<Sale[]>([
    {
      id: '1',
      date: '2024-03-15',
      items: [
        {
          medicineId: '1',
          quantity: 2,
          price: 5.99,
          subtotal: 11.98,
          batchNumber: 'BAT123'
        }
      ],
      total: 11.98,
      paymentMethod: 'cash',
      customerName: 'John Doe',
      soldBy: 'Jane Smith',
      status: 'completed'
    }
  ]);

  const [medicines] = React.useState<Medicine[]>([
    {
      id: '1',
      name: 'Paracetamol 500mg',
      barcode: '123456789',
      genericName: 'Acetaminophen',
      manufacturer: 'PharmaCo',
      category: 'Pain Relief',
      dosageForm: 'Tablet',
      strength: '500mg',
      price: 5.99,
      reorderLevel: 100,
      stock: 85,
      batchNumber: 'BAT123',
      expiryDate: '2024-12-31',
      location: 'Shelf A1',
      supplier: 'MedSupply Inc'
    }
  ]);

  const reports = [
    { id: 'sales', name: 'Sales Report', icon: TrendingUp },
    { id: 'inventory', name: 'Inventory Report', icon: Package },
    { id: 'expiring', name: 'Expiring Items Report', icon: AlertTriangle },
    { id: 'collections', name: 'Employee Collections', icon: Users },
    { id: 'reorder', name: 'Reorder Level Report', icon: DollarSign }
  ];

  const getReportData = () => {
    switch (selectedReport) {
      case 'sales':
        return {
          title: 'Sales Report',
          data: salesData.filter(sale => 
            sale.date >= dateRange.start && sale.date <= dateRange.end
          ).map(sale => ({
            Date: sale.date,
            Customer: sale.customerName,
            Items: sale.items.length,
            Total: `Tsh.${sale.total.toFixed(2)}`,
            'Payment Method': sale.paymentMethod,
            Status: sale.status
          })),
          columns: ['Date', 'Customer', 'Items', 'Total', 'Payment Method', 'Status']
        };
      case 'inventory':
        return {
          title: 'Inventory Report',
          data: medicines.map(med => ({
            Name: med.name,
            Stock: med.stock,
            Category: med.category,
            'Expiry Date': med.expiryDate,
            Price: `Tsh.${med.price.toFixed(2)}`
          })),
          columns: ['Name', 'Stock', 'Category', 'Expiry Date', 'Price']
        };
      case 'expiring':
        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
        return {
          title: 'Expiring Items Report',
          data: medicines
            .filter(med => new Date(med.expiryDate) <= threeMonthsFromNow)
            .map(med => ({
              Name: med.name,
              'Expiry Date': med.expiryDate,
              Stock: med.stock,
              Location: med.location
            })),
          columns: ['Name', 'Expiry Date', 'Stock', 'Location']
        };
      default:
        return {
          title: 'No Data',
          data: [],
          columns: []
        };
    }
  };

  const handleExportPDF = () => {
    const reportData = getReportData();
    const doc = new jsPDF();

    // Add header
    doc.setFontSize(18);
    doc.text('PharmaCare', 105, 15, { align: 'center' });
    doc.setFontSize(14);
    doc.text(reportData.title, 105, 25, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Period: ${dateRange.start} to ${dateRange.end}`, 105, 35, { align: 'center' });

    // Add table
    (doc as any).autoTable({
      head: [reportData.columns],
      body: reportData.data.map(item => Object.values(item)),
      startY: 45,
      theme: 'grid',
      styles: {
        fontSize: 12,
        cellPadding: 5
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 12,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });

    // Add footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }

    doc.save(`${selectedReport}-report.pdf`);
  };

  const handleExportExcel = () => {
    const reportData = getReportData();
    const csvContent = [
      reportData.columns.join(','),
      ...reportData.data.map(item => Object.values(item).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedReport}-report.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const reportData = getReportData();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
          <div className="flex gap-2">
            <button 
              onClick={handleExportPDF}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Download className="h-5 w-5 mr-2" />
              Export PDF
            </button>
            <button 
              onClick={handleExportExcel}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <FileSpreadsheet className="h-5 w-5 mr-2" />
              Export Excel
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Report Selection */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Report Type</h2>
            <div className="bg-white rounded-lg shadow divide-y">
              {reports.map(report => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center ${
                    selectedReport === report.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <report.icon className="h-5 w-5 mr-2" />
                  {report.name}
                </button>
              ))}
            </div>
          </div>

          {/* Report Content */}
          <div className="md:col-span-3 bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <div className="mt-1 relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <div className="mt-1 relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="border rounded-lg">
              <div className="px-4 py-3 border-b bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">{reportData.title}</h3>
              </div>
              <div className="p-4">
                {reportData.data.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          {reportData.columns.map((column, index) => (
                            <th
                              key={index}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reportData.data.map((item, index) => (
                          <tr key={index}>
                            {Object.values(item).map((value, i) => (
                              <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No data available for the selected criteria</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}