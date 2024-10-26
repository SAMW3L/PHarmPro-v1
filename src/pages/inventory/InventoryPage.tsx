import React from 'react';
import Layout from '../../components/Layout';
import { Plus, Search, AlertTriangle } from 'lucide-react';
import { Medicine } from '../../types';
import AddEditMedicineModal from '../../components/modals/AddEditMedicineModal';

export default function InventoryPage() {
  const [medicines, setMedicines] = React.useState<Medicine[]>([
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

  const [searchTerm, setSearchTerm] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedMedicine, setSelectedMedicine] = React.useState<Medicine | undefined>();

  const handleAddMedicine = (medicine: Partial<Medicine>) => {
    const newMedicine = {
      ...medicine,
      id: Date.now().toString()
    } as Medicine;
    
    setMedicines(prev => [...prev, newMedicine]);
  };

  const handleEditMedicine = (medicine: Partial<Medicine>) => {
    setMedicines(prev =>
      prev.map(m => (m.id === selectedMedicine?.id ? { ...m, ...medicine } : m))
    );
  };

  const handleDeleteMedicine = (id: string) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      setMedicines(prev => prev.filter(m => m.id !== id));
    }
  };

  const openEditModal = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsModalOpen(true);
  };

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>
          <button 
            onClick={() => {
              setSelectedMedicine(undefined);
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Medicine
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search medicines..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medicine
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMedicines.map((medicine) => (
                  <tr key={medicine.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{medicine.name}</div>
                        <div className="text-sm text-gray-500">{medicine.genericName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {medicine.stock <= medicine.reorderLevel && (
                          <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                        )}
                        <span className={`text-sm ${medicine.stock <= medicine.reorderLevel ? 'text-yellow-600' : 'text-gray-900'}`}>
                          {medicine.stock}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {medicine.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {medicine.expiryDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${medicine.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button 
                        onClick={() => openEditModal(medicine)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteMedicine(medicine.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddEditMedicineModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMedicine(undefined);
        }}
        onSave={selectedMedicine ? handleEditMedicine : handleAddMedicine}
        medicine={selectedMedicine}
      />
    </Layout>
  );
}