import React from 'react';
import Icon from '../ui/Icon';

const OrderManagement = ({ orders, onUpdateOrderStatus, onFetchOrders }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/80">
        <div className="flex justify-between items-center mb-5">
            <h3 className="text-xl font-bold text-gray-800">Order Fulfillment</h3>
            <button onClick={onFetchOrders} className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-gray-300 transition-colors shadow-sm">
                <Icon name="refresh" className="w-5 h-5" />
                <span>Refresh Orders</span>
            </button>
        </div>
        <div className="space-y-4">
            {orders.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No orders found.</p>
            ) : (
                orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(order => (
                    <div key={order._id} className="bg-gray-50/70 rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-md text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</p>
                                <p className="text-sm text-gray-500">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                               <p className="font-bold text-lg text-green-600">${order.totalAmount.toFixed(2)}</p>
                               <p className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block ${order.orderStatus === 'Fulfilled' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{order.orderStatus}</p>
                            </div>
                        </div>
                        <div className="mt-4 border-t pt-3">
                            <ul className="text-sm space-y-1 text-gray-600">
                                {order.items.map(item => (
                                    <li key={item._id}><span className="font-semibold">{item.quantity}x</span> {item.name}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-4 flex justify-end items-center space-x-4">
                            {order.orderStatus === 'Pending' && (
                                <button onClick={() => onUpdateOrderStatus(order._id, 'Fulfilled')} className="bg-blue-500 text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition shadow-sm">
                                    Mark as Fulfilled
                                </button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
);
export default OrderManagement;