import React from 'react';
import { TAX_RATE } from '../../config';
import Icon from '../ui/Icon';

const CartView = ({ cartItems, onUpdateQuantity, onRemoveItem, onCheckout }) => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxAmount = cartItems.reduce((sum, item) => {
        if (item.taxable) {
            return sum + (item.price * item.quantity * TAX_RATE);
        }
        return sum;
    }, 0);
    const total = subtotal + taxAmount;

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-4">Your Shopping Cart</h2>
            {cartItems.length === 0 ? (
                <div className="text-center py-12">
                    <Icon name="cart" className="w-16 h-16 mx-auto text-gray-300" />
                    <p className="text-gray-500 mt-4 text-lg">Your cart is empty.</p>
                    <p className="text-gray-400">Looks like you haven't added anything to your cart yet.</p>
                </div>
            ) : (
                <div>
                    <div className="divide-y divide-gray-200">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between py-4 gap-4">
                                <div className="flex items-center space-x-4 flex-grow">
                                    <img src={item.imageUrl.replace('600x600', '400x400')} alt={item.name} className="w-20 h-20 rounded-lg object-cover shadow-sm" />
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                                        <p className="text-gray-500">${item.price.toFixed(2)} / {item.unit}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 sm:space-x-6">
                                    <div className="flex items-center border rounded-lg">
                                        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-xl font-bold text-gray-600 hover:bg-gray-100 rounded-l-lg transition">-</button>
                                        <span className="px-5 py-1 text-gray-800 font-semibold">{item.quantity}</span>
                                        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-xl font-bold text-gray-600 hover:bg-gray-100 rounded-r-lg transition">+</button>
                                    </div>
                                    <p className="font-bold w-24 text-right text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                                    <button onClick={() => onRemoveItem(item.id)} className="text-gray-400 hover:text-red-500 transition p-1 rounded-full hover:bg-gray-100">
                                        <Icon name="trash" className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 pt-6 border-t-2 border-dashed">
                        <div className="space-y-2 text-right">
                            <div className="flex justify-between items-center">
                                <p className="text-gray-500">Subtotal</p>
                                <p className="font-semibold text-gray-800">${subtotal.toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-gray-500">Taxes ({ (TAX_RATE * 100).toFixed(2) }%)</p>
                                <p className="font-semibold text-gray-800">${taxAmount.toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between items-center pt-2 mt-2 border-t">
                                <p className="text-xl font-bold text-gray-900">Total Amount</p>
                                <p className="text-2xl font-extrabold text-green-600">${total.toFixed(2)}</p>
                            </div>
                        </div>
                         <div className="mt-6 flex justify-end">
                            <button onClick={() => onCheckout(total)} className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-10 rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default CartView;
