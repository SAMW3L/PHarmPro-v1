import React from 'react';
import Layout from '../../components/Layout';
import { Calendar, Download, TrendingUp, Package, AlertTriangle, Users, DollarSign, FileSpreadsheet, UserCircle } from 'lucide-react';
import { Medicine, Sale, User } from '../../types';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Title } from 'chart.js';
import SaleReceipt from '../../components/SaleReceipt';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = React.useState('sales');
  const [dateRange, setDateRange] = React.useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [selectedSale, setSelectedSale] = React.useState<Sale | null>(null);
  const [showReceipt, setShowReceipt] = React.useState(false);
  const [salesData, setSalesData] = React.useState<Sale[]>([]);
  const [medicines, setMedicines] = React.useState<Medicine[]>([]);

  React.useEffect(() => {
    // Fetch medicines data
    const fetchMedicines = async () => {
      try {
        const response = await fetch('/api/medicines');
        const data = await response.json();
        setMedicines(data);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      }
    };

    // Fetch sales data
    const fetchSales = async () => {
      try {
        const response = await fetch(`/api/sales?start=${dateRange.start}&end=${dateRange.end}`);
        const data = await response.json();
        setSalesData(data);
      } catch (error) {
        console.error('Error fetching sales:', error);
      }
    };

    fetchMedicines();
    fetchSales();
  }, [dateRange]);

  const reports = [
    { id: 'sales', name: 'Sales Report', icon: TrendingUp },
    { id: 'inventory', name: 'Inventory Report', icon: Package },
    { id: 'expiring', name: 'Expiring Items Report', icon: AlertTriangle },
    { id: 'collections', name: 'Employee Collections', icon: Users },
    { id: 'reorder', name: 'Reorder Level Report', icon: DollarSign },
    { id: 'customers', name: 'Customer Report', icon: UserCircle }
  ];

  const handlePrintReceipt = (sale: Sale) => {
    setSelectedSale(sale);
    setShowReceipt(true);
    setTimeout(() => {
      const receiptElement = document.getElementById('receipt');
      if (receiptElement) {
        const printWindow = window.open('', '', 'width=800,height=600');
        if (printWindow) {
          printWindow.document.write(receiptElement.outerHTML);
          printWindow.document.close();
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        }
      }
      setShowReceipt(false);
    }, 100);
  };

  const getReportData = () => {
    switch (selectedReport) {
      case 'sales':
        return {
          title: 'Sales Report',
          data: [],
          columns: ['Date', 'Customer', 'Phone Number', 'Items', 'Total', 'Payment Method', 'Status']
        };
      case 'inventory':
        return {
          title: 'Inventory Report',
          data: [],
          columns: ['Name', 'Stock', 'Category', 'Expiry Date', 'Price']
        };
      case 'expiring':
        return {
          title: 'Expiring Items Report',
          data: [],
          columns: ['Name', 'Expiry Date', 'Stock', 'Location']
        };
      case 'collections':
        return {
          title: 'Employee Collection Report',
          data: [],
          columns: ['Employee Name', 'Number of Customer', 'Total Amount']
        };
      case 'reorder':
        return {
          title: 'Out Of Stock Medicine Report',
          data: [],
          columns: ['Item Name', 'Initial Balance', 'Current Balance', 'Item Category', 'Item Price']
        };
      case 'customers':
        return {
          title: 'Customer Report',
          data: [],
          columns: ['Receipt No', 'Date', 'Customer Name', 'Phone Number', 'Items', 'Total Amount', 'Payment Method', 'Served By', 'Actions']
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
    a.download = `${selectedReport}-report.xls`;
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

      {showReceipt && selectedSale && (
        <div className="hidden">
          <SaleReceipt
            items={selectedSale.items.map(item => ({
              medicine: medicines.find(m => m.id === item.medicineId)!,
              quantity: item.quantity
            }))}
            total={selectedSale.total}
            date={selectedSale.date}
            paymentMethod={selectedSale.paymentMethod}
            customerName={selectedSale.customerName}
            customerPhone={selectedSale.customerPhone}
          />
        </div>
      )}
    </Layout>
  );
}