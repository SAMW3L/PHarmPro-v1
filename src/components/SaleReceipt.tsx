import React from 'react';
import { Medicine } from '../types';

interface SaleReceiptProps {
  items: Array<{ medicine: Medicine; quantity: number }>;
  total: number;
  transactionId: string;
  date: string;
}

export default function SaleReceipt({ items, total, transactionId, date }: SaleReceiptProps) {
  return (
    <div className="bg-white p-6 max-w-md mx-auto" id="receipt">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold">PharmaCare</h2>
        <p className="text-sm text-gray-600">Tabata Street</p>
        <p className="text-sm text-gray-600">Phone: +255 613 004 338</p>
      </div>

      <div className="mb-4">
        <p className="text-sm">Transaction ID: {transactionId}</p>
        <p className="text-sm">Date: {date}</p>
      </div>

      <div className="border-t border-b border-gray-200 py-4 mb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Item</th>
              <th className="text-center py-2">Qty</th>
              <th className="text-right py-2">Price</th>
              <th className="text-right py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.medicine.id}>
                <td className="py-2">{item.medicine.name}</td>
                <td className="text-center py-2">{item.quantity}</td>
                <td className="text-right py-2">Tsh.{item.medicine.price.toFixed(2)}</td>
                <td className="text-right py-2">
                  Tsh.{(item.quantity * item.medicine.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-right mb-6">
        <p className="text-lg font-bold">Total: Tsh.{total.toFixed(2)}</p>
      </div>

      <div className=" text-sm text-gray-600">
        <p><b>Prescription</b></p>
        <p>Dosage:</p>
        <p>.</p>
        <p>.</p>
        
        <p>.................................................................................................</p>
      </div>

      <div className="text-center text-sm text-gray-600">
        <p>Thank you for your purchase!</p>
        <p>Please keep this receipt for your records.</p>
      </div>
    </div>
  );
}