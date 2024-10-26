import React from 'react';
import Layout from '../../components/Layout';
import { Search, ShoppingCart, Plus, Minus, Trash2, Printer } from 'lucide-react';
import { Medicine } from '../../types';
import SaleReceipt from '../../components/SaleReceipt';

export default function SalesPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [cart, setCart] = React.useState<Array<{ medicine: Medicine; quantity: number }>>([]);
  const [showReceipt, setShowReceipt] = React.useState(false);
  const [currentSale, setCurrentSale] = React.useState<{
    items: Array<{ medicine: Medicine; quantity: number }>;
    total: number;
    transactionId: string;
    date: string;
  } | null>(null);
  const [successMessage, setSuccessMessage] = React.useState('');

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

  const addToCart = (medicine: Medicine) => {
    setCart(prev => {
      const existing = prev.find(item => item.medicine.id === medicine.id);
      if (existing) {
        return prev.map(item =>
          item.medicine.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { medicine, quantity: 1 }];
    });
  };

  const updateQuantity = (medicineId: string, change: number) => {
    setCart(prev => prev.map(item => {
      if (item.medicine.id === medicineId) {
        const newQuantity = Math.max(0, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const total = cart.reduce((sum, item) => sum + (item.medicine.price * item.quantity), 0);

  const handleCompleteSale = () => {
    const sale = {
      items: [...cart],
      total,
      transactionId: `SALE-${Date.now()}`,
      date: new Date().toLocaleString()
    };

    // Update stock levels
    setMedicines(prev =>
      prev.map(medicine => {
        const saleItem = cart.find(item => item.medicine.id === medicine.id);
        if (saleItem) {
          return {
            ...medicine,
            stock: medicine.stock - saleItem.quantity
          };
        }
        return medicine;
      })
    );

    setCurrentSale(sale);
    setShowReceipt(true);
    setSuccessMessage('Sale completed successfully!');
    setCart([]);

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const handlePrintReceipt = () => {
    const receiptWindow = window.open('', '_blank');
    if (receiptWindow && currentSale) {
      receiptWindow.document.write(`
        <html>
          <head>
            <title>Sale Receipt</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .receipt { max-width: 400px; margin: 0 auto; }
              table { width: 100%; border-collapse: collapse; }
              th, td { padding: 8px; text-align: left; }
              .total { font-weight: bold; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="receipt">
              ${document.getElementById('receipt')?.innerHTML}
            </div>
          </body>
        </html>
      `);
      receiptWindow.document.close();
      receiptWindow.print();
    }
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Sales</h1>
          </div>

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              {successMessage}
            </div>
          )}

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medicines.map(medicine => (
              <div key={medicine.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{medicine.name}</h3>
                    <p className="text-sm text-gray-500">{medicine.genericName}</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">Tsh.{medicine.price}</p>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Stock: {medicine.stock}</span>
                  <button
                    onClick={() => addToCart(medicine)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    disabled={medicine.stock === 0}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg h-fit">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingCart className="h-6 w-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Cart</h2>
          </div>

          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.medicine.id} className="flex justify-between items-center py-2 border-b">
                <div>
                  <h3 className="font-medium text-gray-900">{item.medicine.name}</h3>
                  <p className="text-sm text-gray-500">Tsh.{item.medicine.price} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.medicine.id, -1)}
                    className="p-1 rounded-md hover:bg-gray-100"
                  >
                    <Minus className="h-4 w-4 text-gray-600" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.medicine.id, 1)}
                    className="p-1 rounded-md hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => updateQuantity(item.medicine.id, -item.quantity)}
                    className="p-1 rounded-md hover:bg-gray-100 ml-2"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>Tsh.{total.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCompleteSale}
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={cart.length === 0}
              >
                Complete Sale
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && currentSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <SaleReceipt {...currentSale} />
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowReceipt(false)}
                  className="px-4 py-2 text-sm font-medium text-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  Close
                </button>
                <button
                  onClick={handlePrintReceipt}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}