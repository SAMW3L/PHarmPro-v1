import React from 'react';
import Layout from '../../components/Layout';
import { Plus, Search, AlertTriangle, Upload, Info } from 'lucide-react';
import { Medicine } from '../../types';
import AddEditMedicineModal from '../../components/modals/AddEditMedicineModal';
import { read, utils } from 'xlsx';

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
      price: 50.00,
      reorderLevel: 100,
      stock: 26,
      batchNumber: 'BAT123',
      expiryDate: '2025-12-31',
      location: 'Shelf A1',
      supplier: 'MedSupply Inc'
    }
  ]);

  const [searchTerm, setSearchTerm] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedMedicine, setSelectedMedicine] = React.useState<Medicine | undefined>();
  const [showUploadInfo, setShowUploadInfo] = React.useState(false);

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target?.result;
          const workbook = read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = utils.sheet_to_json(worksheet, { raw: false });

          // Convert column headers to lowercase for case-insensitive comparison
          const firstRow = jsonData[0] as any;
          const headers = Object.keys(firstRow).map(key => key.toLowerCase());

          // Check for required columns (case-insensitive)
          const requiredColumns = ['name', 'price', 'stock', 'category', 'expirydate'];
          const missingColumns = requiredColumns.filter(col => 
            !headers.includes(col.toLowerCase())
          );

          if (missingColumns.length > 0) {
            alert(`Error: Missing required columns: ${missingColumns.join(', ')}\n\nPlease ensure your Excel file has these column headers (case-insensitive).`);
            return;
          }

          const newMedicines = jsonData.map((item: any) => {
            // Find the actual column name in the original case
            const getName = (searchKey: string) => {
              const key = Object.keys(item).find(k => k.toLowerCase() === searchKey.toLowerCase());
              return key ? item[key] : '';
            };

            return {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              name: getName('name'),
              barcode: getName('barcode')?.toString() || '',
              genericName: getName('genericname') || '',
              manufacturer: getName('manufacturer') || '',
              category: getName('category'),
              dosageForm: getName('dosageform') || '',
              strength: getName('strength') || '',
              price: Number(getName('price')),
              reorderLevel: Number(getName('reorderlevel')) || 0,
              stock: Number(getName('stock')),
              batchNumber: getName('batchnumber')?.toString() || '',
              expiryDate: getName('expirydate'),
              location: getName('location') || '',
              supplier: getName('supplier') || ''
            };
          });

          // Validate data types and required values
          const invalidEntries = newMedicines.filter(med => 
            typeof med.name !== 'string' || med.name.trim() === '' ||
            isNaN(med.price) || med.price <= 0 ||
            isNaN(med.stock) || med.stock < 0 ||
            typeof med.category !== 'string' || med.category.trim() === '' ||
            !med.expiryDate || !/^\d{4}-\d{2}-\d{2}$/.test(med.expiryDate)
          );

          if (invalidEntries.length > 0) {
            alert(`Error: ${invalidEntries.length} entries have invalid or missing required data. Please check your Excel file and ensure all required fields have valid values.`);
            return;
          }

          setMedicines(prev => [...prev, ...newMedicines]);
          alert(`Successfully imported ${newMedicines.length} medicines`);
        };
        reader.readAsBinaryString(file);
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file. Please check the file format and try again.');
      }
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
          <div className="flex gap-8">
            <div className="relative flex items-center gap-4">
              <label className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer">
                <Upload className="h-5 w-5 mr-2" />
                Upload Excel
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
              <button
                className="flex items-center p-2.5 bg-blue-100 rounded-md hover:bg-blue-200"
                onClick={() => setShowUploadInfo(!showUploadInfo)}
              >
                <Info className="h-6 w-6 text-blue-600" />
              </button>
              {showUploadInfo && (
                <div className="absolute top-full left-0 mt-2 p-4 bg-white shadow-lg rounded-md w-80 z-50 text-sm">
                  <h3 className="font-bold mb-2">Required Excel Columns Before Upload:</h3>
                  <ul className="list-disc pl-4 space-y-1 text-red-600">
                    <li>name (text) - Medicine name</li>
                    <li>price (number) - Price greater than 0</li>
                    <li>stock (number) - Current stock quantity</li>
                    <li>category (text) - Medicine category</li>
                    <li>expiryDate (YYYY-MM-DD) - Expiry date</li>
                  </ul>
                  <h3 className="font-bold mt-4 mb-2">Optional Columns:</h3>
                  <ul className="list-disc pl-4 space-y-1 text-gray-600">
                    <li>barcode - Barcode number</li>
                    <li>genericName - Generic name</li>
                    <li>manufacturer - Manufacturer name</li>
                    <li>dosageForm - Form of dosage</li>
                    <li>strength - Medicine strength</li>
                    <li>reorderLevel - Reorder level</li>
                    <li>batchNumber - Batch number</li>
                    <li>location - Storage location</li>
                    <li>supplier - Supplier name</li>
                  </ul>
                </div>
              )}
            </div>
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
                      Tsh.{medicine.price.toFixed(2)}
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