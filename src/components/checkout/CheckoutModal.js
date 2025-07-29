import React, { useState } from 'react';
import Modal from '../ui/Modal';

const CheckoutModal = ({ onClose, onPlaceOrder, total }) => {
    const [customerDetails, setCustomerDetails] = useState({ name: '', phone: '', address: '' });
    const [paymentMethod, setPaymentMethod] = useState('cod');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (customerDetails.name && customerDetails.phone && customerDetails.address) {
            onPlaceOrder({ customerDetails, paymentMethod });
        } else {
            alert('Please fill in all delivery details.');
        }
    };

    return (
        <Modal onClose={onClose} title="Complete Your Order">
            <form onSubmit={handleSubmit}>
                <h4 className="text-lg font-bold mb-4 text-gray-700">1. Delivery Details</h4>
                <div className="space-y-4">
                    <input type="text" name="name" placeholder="Full Name" value={customerDetails.name} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition" required />
                    <input type="tel" name="phone" placeholder="Phone Number" value={customerDetails.phone} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition" required />
                    <input type="text" name="address" placeholder="Delivery Address" value={customerDetails.address} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition" required />
                </div>

                <h4 className="text-lg font-bold mt-8 mb-4 text-gray-700">2. Payment Method</h4>
                <div className="space-y-3">
                    <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${paymentMethod === 'cod' ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}>
                        <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300" />
                        <span className="ml-3 font-semibold text-gray-800">Cash on Delivery (COD)</span>
                    </label>
                    <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${paymentMethod === 'stripe' ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}>
                        <input type="radio" name="paymentMethod" value="stripe" checked={paymentMethod === 'stripe'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300" />
                        <span className="ml-3 font-semibold text-gray-800">Credit/Debit Card (Stripe)</span>
                        <span className="ml-auto text-sm text-gray-500">(Not implemented)</span>
                    </label>
                </div>

                <div className="mt-8">
                    <button type="submit" className="w-full bg-green-600 text-white font-bold py-3.5 px-8 rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Place Order for ${total.toFixed(2)}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
export default CheckoutModal;