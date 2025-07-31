import React, { useState } from 'react';
import OrderManagement from './OrderManagement';
import InventoryManagement from './InventoryManagement';
import ProductManagement from './ProductManagement';

const AdminDashboard = ({ products, orders, onSaveProduct, onDeleteProduct, onUpdateOrderStatus, onLogout, onFetchOrders }) => {
    const [activeTab, setActiveTab] = useState('products');

    const renderContent = () => {
        switch (activeTab) {
            case 'orders': return <OrderManagement orders={orders} onUpdateOrderStatus={onUpdateOrderStatus} onFetchOrders={onFetchOrders} />;
            case 'inventory': return <InventoryManagement products={products} />;
            case 'products': default: return <ProductManagement products={products} onSaveProduct={onSaveProduct} onDeleteProduct={onDeleteProduct} />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-800">Admin Dashboard</h2>
                    <p className="text-gray-500 mt-1">Manage your store's products, orders, and inventory.</p>
                </div>
                <button onClick={onLogout} className="mt-4 md:mt-0 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition shadow-sm">Logout</button>
            </div>
            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="lg:w-1/4">
                    <nav className="flex flex-row lg:flex-col space-x-1 lg:space-x-0 lg:space-y-1 bg-gray-100 p-2 rounded-xl">
                        <button onClick={() => setActiveTab('products')} className={`w-full text-left px-4 py-2.5 rounded-lg font-semibold transition text-sm ${activeTab === 'products' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-600 hover:bg-white/60 hover:text-green-700'}`}>Products</button>
                        <button onClick={() => setActiveTab('orders')} className={`w-full text-left px-4 py-2.5 rounded-lg font-semibold transition text-sm ${activeTab === 'orders' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-600 hover:bg-white/60 hover:text-green-700'}`}>Orders</button>
                        <button onClick={() => setActiveTab('inventory')} className={`w-full text-left px-4 py-2.5 rounded-lg font-semibold transition text-sm ${activeTab === 'inventory' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-600 hover:bg-white/60 hover:text-green-700'}`}>Inventory</button>
                    </nav>
                </aside>
                <main className="flex-1">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};
export default AdminDashboard;