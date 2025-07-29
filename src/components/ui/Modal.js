import React from 'react';
import Icon from './Icon';

const Modal = ({ children, onClose, title }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md m-4 transform transition-all duration-300 scale-95 opacity-0 animate-scale-in">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
                    <Icon name="close" className="w-6 h-6"/>
                </button>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    </div>
);
export default Modal;