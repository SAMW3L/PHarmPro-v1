import React from 'react';
import Layout from '../../components/Layout';
import { Plus, Search } from 'lucide-react';
import { Prescription } from '../../types';

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = React.useState<Prescription[]>([
    {
      id: '1',
      prescriptionNumber: 'RX123456',
      patientName: 'John Doe',
      patientId: 'P123',
      doctorName: 'Dr. Smith',
      date: '2024-03-15',
      status: 'pending',
      items: [
        {
          medicineId: '1',
          medicineName: 'Paracetamol 500mg',
          quantity: 20,
          dosage: '1 tablet',
          frequency: 'twice daily',
          duration: '10 days',
          instructions: 'Take after meals',
          price: 5.99,
          subtotal: 119.80
        }
      ],
      total: 119.80,
      paymentStatus: 'pending'
    }
  ]);

  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.prescriptionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: Prescription['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Prescriptions</h1>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Plus className="h-5 w-5 mr-2" />
            New Prescription
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search prescriptions..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Prescriptions Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prescription #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPrescriptions.map((prescription) => (
                  <tr key={prescription.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {prescription.prescriptionNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {prescription.patientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {prescription.doctorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {prescription.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(prescription.status)}`}>
                        {prescription.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">View</button>
                      <button className="text-blue-600 hover:text-blue-800 mr-3">Process</button>
                      <button className="text-red-600 hover:text-red-800">Cancel</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}