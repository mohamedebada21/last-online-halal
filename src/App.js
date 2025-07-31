// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import { TAX_RATE } from './config';
import Header from './components/layout/Header';
import ProductList from './components/shop/ProductList';
import ProductDetailPage from './components/shop/ProductDetailPage';
import CartView from './components/cart/CartView';
import CheckoutModal from './components/checkout/CheckoutModal';
import AdminDashboard from './components/admin/AdminDashboard';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import AccountPage from './components/account/AccountPage';

const API_URL = 'http://localhost:5001/api'; // Your backend server URL

function App() {
    const [view, setView] = useState('shop');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [checkoutTotal, setCheckoutTotal] = useState(0);
    const [notification, setNotification] = useState('');

    // Fetch initial products from the backend when the app loads
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/products`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setNotification('Could not load products from the server.');
            }
        };
        fetchProducts();
    }, []);

    // Create a memoized fetchOrders function that can be called on demand
    const fetchOrders = useCallback(async () => {
        if (!currentUser) {
            setOrders([]);
            return;
        }
        try {
            const endpoint = currentUser.isAdmin ? `${API_URL}/orders` : `${API_URL}/orders/${currentUser.id}`;
            const response = await fetch(endpoint);
            if (!response.ok) throw new Error('Could not fetch orders.');
            const data = await response.json();
            setOrders(data);
            setNotification('Orders refreshed!');
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            setNotification(error.message);
        }
    }, [currentUser]); // Dependency on currentUser

    // Effect to fetch orders when the user logs in
    useEffect(() => {
        if (currentUser) {
            fetchOrders();
        }
    }, [currentUser, fetchOrders]);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleNavigate = (newView) => {
        setView(newView);
        setSelectedProduct(null);
    };

    const handleViewProduct = (product) => {
        setSelectedProduct(product);
        setView('productDetail');
    };

    const handleAddToCart = (productToAdd) => {
        // ... (logic is unchanged)
    };
    
    const handleUpdateCartQuantity = (productId, newQuantity) => {
        // ... (logic is unchanged)
    };

    const handleRemoveFromCart = (productId) => {
        // ... (logic is unchanged)
    };

    const handleCheckout = (total) => {
        if (!currentUser) {
            setNotification('Please log in to proceed to checkout.');
            setView('login');
            return;
        }
        if (cartItems.length > 0) {
            setCheckoutTotal(total);
            setIsCheckoutModalOpen(true);
        }
    };

    const handleRegister = async ({ name, email, password }) => {
        // ... (logic is unchanged)
    };

    const handleLogin = async ({ email, password }) => {
        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Login failed');
            }
            const { token, user } = await response.json();
            localStorage.setItem('token', token);
            setCurrentUser(user);
            setNotification(`Welcome back, ${user.name}!`);
            setView('shop');
            return true;
        } catch (error) {
            setNotification(error.message);
            return false;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setCurrentUser(null);
        setView('shop');
        setNotification('You have been logged out.');
    };

    const handleSaveProduct = async (productData) => {
        // ... (logic is unchanged)
    };

    const handlePlaceOrder = async () => {
        const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const taxAmount = cartItems.reduce((sum, item) => item.taxable ? sum + (item.price * item.quantity * TAX_RATE) : sum, 0);
        const total = subtotal + taxAmount;
        
        const orderData = {
            userId: currentUser.id,
            items: cartItems.map(item => ({ productId: item._id, name: item.name, quantity: item.quantity, price: item.price })),
            totalAmount: total,
        };

        try {
            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });
            if (!response.ok) throw new Error('Failed to place order');
            
            setNotification(`Order placed successfully!`);
            setCartItems([]);
            setIsCheckoutModalOpen(false);
            
            // After placing the order, fetch the latest orders and navigate to the account page
            await fetchOrders();
            setView('account');

        } catch (error) {
            setNotification(error.message);
        }
    };
    
    const handleDeleteProduct = () => {
        setNotification('Delete functionality requires a DELETE /api/products/:id endpoint.');
    };
    
    const handleUpdateOrderStatus = () => {
        setNotification('Order status updates require a PUT /api/orders/:id endpoint.');
    };

    const renderView = () => {
        switch (view) {
            case 'cart':
                return <CartView cartItems={cartItems} onUpdateQuantity={handleUpdateCartQuantity} onRemoveItem={handleRemoveFromCart} onCheckout={handleCheckout} />;
            case 'admin':
                return currentUser?.isAdmin ? 
                    <AdminDashboard products={products} orders={orders} onSaveProduct={handleSaveProduct} onDeleteProduct={handleDeleteProduct} onUpdateOrderStatus={handleUpdateOrderStatus} onLogout={handleLogout} onFetchOrders={fetchOrders} /> : 
                    <ProductList products={products} onAddToCart={handleAddToCart} onViewProduct={handleViewProduct} />;
            case 'productDetail':
                return <ProductDetailPage product={selectedProduct} onAddToCart={handleAddToCart} onNavigate={handleNavigate} />;
            case 'login':
                return <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
            case 'register':
                return <RegisterPage onRegister={handleRegister} onNavigate={handleNavigate} />;
            case 'account':
                return currentUser ? <AccountPage currentUser={currentUser} orders={orders} /> : <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
            case 'shop':
            default:
                return <ProductList products={products} onAddToCart={handleAddToCart} onViewProduct={handleViewProduct} />;
        }
    };

    return (
        <div className="text-gray-800">
            <Header onNavigate={handleNavigate} cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} currentUser={currentUser} onLogout={handleLogout} />
            {notification && <div className="fixed top-20 right-5 bg-green-600 text-white py-3 px-6 rounded-lg shadow-2xl z-50 animate-fade-in-out">{notification}</div>}
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">{renderView()}</main>
            {isCheckoutModalOpen && <CheckoutModal onClose={() => setIsCheckoutModalOpen(false)} onPlaceOrder={handlePlaceOrder} total={checkoutTotal} />}
            <footer className="text-center py-10 mt-16 border-t border-gray-200"><p className="text-gray-500">&copy; {new Date().getFullYear()} HalalFresh. Built with 💚.</p></footer>
        </div>
    );
}

export default App;