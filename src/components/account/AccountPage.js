import React from 'react';

const AccountPage = ({ currentUser, orders }) => {
    const userOrders = orders.filter(order => order.userId === currentUser.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-extrabold text-gray-800">My Account</h1>
                <p className="text-lg text-gray-500 mt-1">Welcome back, {currentUser.name}!</p>

                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">Your Order History</h2>
                    {userOrders.length === 0 ? (
                        <p className="text-gray-500">You haven't placed any orders yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {userOrders.map(order => (
                                <div key={order._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
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
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default AccountPage;