import React from 'react';
import Icon from '../ui/Icon';

const Header = ({ onNavigate, cartCount, currentUser, onLogout }) => (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-40 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <div className="text-3xl font-bold text-gray-800 cursor-pointer" onClick={() => onNavigate('shop')}>
                    Halal <span className="text-green-600">Online Store</span><span className="text-red-500">🍉</span>
                </div>
                <nav className="flex items-center space-x-2 sm:space-x-4">
                    <button onClick={() => onNavigate('shop')} className="flex items-center space-x-2 text-gray-500 hover:text-green-600 font-semibold transition-colors px-3 py-2 rounded-lg hover:bg-green-50">
                        <Icon name="shop" className="w-5 h-5" />
                        <span className="hidden sm:inline">Shop</span>
                    </button>
                    <button onClick={() => onNavigate('cart')} className="flex items-center space-x-2 text-gray-500 hover:text-green-600 font-semibold transition-colors relative px-3 py-2 rounded-lg hover:bg-green-50">
                        <Icon name="cart" className="w-5 h-5" />
                        <span className="hidden sm:inline">Cart</span>
                        {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">{cartCount}</span>}
                    </button>
                    
                    {currentUser?.isAdmin && (
                        <button onClick={() => onNavigate('admin')} className="flex items-center space-x-2 text-gray-500 hover:text-green-600 font-semibold transition-colors px-3 py-2 rounded-lg hover:bg-green-50">
                            <Icon name="admin" className="w-5 h-5" />
                            <span className="hidden sm:inline">Admin</span>
                        </button>
                    )}

                    <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

                    {currentUser ? (
                        <>
                            <button onClick={() => onNavigate('account')} className="flex items-center space-x-2 text-gray-500 hover:text-green-600 font-semibold transition-colors px-3 py-2 rounded-lg hover:bg-green-50">
                                <Icon name="user" className="w-5 h-5" />
                                <span className="hidden sm:inline">My Account</span>
                            </button>
                            <button onClick={onLogout} className="flex items-center space-x-2 text-gray-500 hover:text-red-500 font-semibold transition-colors px-3 py-2 rounded-lg hover:bg-red-50">
                                <Icon name="logout" className="w-5 h-5" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => onNavigate('login')} className="font-semibold text-gray-600 hover:text-green-700 transition px-4 py-2 rounded-lg hover:bg-gray-100">Login</button>
                            <button onClick={() => onNavigate('register')} className="font-semibold text-white bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded-lg shadow-sm">Register</button>
                        </>
                    )}
                </nav>
            </div>
        </div>
    </header>
);
export default Header;