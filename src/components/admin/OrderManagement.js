import React from 'react';

const OrderManagement = ({ orders, onUpdateOrderStatus }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/80">
        <h3 className="text-xl font-bold text-gray-800 mb-5">Order Fulfillment</h3>
        <div className="space-y-4">
            {orders.sort((a, b) => b.id - a.id).map(order => (
                <div key={order.id} className="bg-gray-50/70 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-md text-gray-900">{order.orderId}</p>
                            <p className="text-sm text-gray-500">{order.customerDetails.name} - {order.customerDetails.address}</p>
                            <p className="text-sm text-gray-500">Delivery: {order.deliveryDate.toLocaleDateString()}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                           <p className="font-bold text-lg text-green-600">${order.totalAmount.toFixed(2)}</p>
                           <p className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{order.paymentMethod.toUpperCase()} - {order.paymentStatus || 'Pending'}</p>
                        </div>
                    </div>
                    <div className="mt-4 border-t pt-3">
                        <p className="text-xs font-bold uppercase text-gray-500 mb-2">Order Summary</p>
                        <ul className="text-sm space-y-1 text-gray-600">
                            {order.items.map(item => (
                                <li key={item.productId}><span className="font-semibold">{item.quantity}x</span> {item.name}</li>
                            ))}
                        </ul>
                        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-dashed">
                           Subtotal: ${order.subtotal.toFixed(2)} | Tax: ${order.taxAmount.toFixed(2)}
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end items-center space-x-4">
                        <span className={`px-3 py-1 text-sm font-bold rounded-full ${order.orderStatus === 'Fulfilled' ? 'bg-green-200 text-green-900' : 'bg-yellow-200 text-yellow-900'}`}>{order.orderStatus}</span>
                        {order.orderStatus === 'Pending' && (
                            <button onClick={() => onUpdateOrderStatus(order.id, 'Fulfilled')} className="bg-blue-500 text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition shadow-sm">
                                Mark as Fulfilled
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
);
export default OrderManagement;