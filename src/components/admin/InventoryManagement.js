import React from 'react';

const InventoryManagement = ({ products }) => (
     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/80">
        <h3 className="text-xl font-bold text-gray-800 mb-5">Inventory Overview</h3>
        <div className="overflow-hidden">
            <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Product</th>
                        <th scope="col" className="px-6 py-3 text-center">Stock Level</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {products.sort((a,b) => a.stock - b.stock).map(p => {
                        const isLowStock = p.stock > 0 && p.stock <= p.lowStockThreshold;
                        const isOutOfStock = p.stock === 0;
                        let statusClasses = 'bg-green-100 text-green-800';
                        let statusText = 'In Stock';
                        if (isLowStock) { statusClasses = 'bg-yellow-100 text-yellow-800'; statusText = 'Low Stock'; }
                        if (isOutOfStock) { statusClasses = 'bg-red-100 text-red-800'; statusText = 'Out of Stock'; }

                        return (
                            <tr key={p.id} className="bg-white hover:bg-gray-50/50 transition">
                                <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                                <td className="px-6 py-4 text-center font-mono font-bold text-lg">{p.stock}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${statusClasses}`}>{statusText}</span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </div>
);
export default InventoryManagement;