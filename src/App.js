// src/App.js
import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/products`);
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setNotification('Could not load products from the server.');
            }
        };
        fetchProducts();
    }, []);

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
        const productInStock = products.find(p => p._id === productToAdd._id);
        if (!productInStock || productInStock.stock <= 0) {
            setNotification('This item is out of stock.');
            return;
        }
        setCartItems(prevItems => {
            const itemInCart = prevItems.find(item => item._id === productToAdd._id);
            if (itemInCart) {
                if (itemInCart.quantity >= productInStock.stock) {
                    setNotification('Cannot add more than available stock.');
                    return prevItems;
                }
                return prevItems.map(item =>
                    item._id === productToAdd._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            setNotification(`${productToAdd.name} added to cart!`);
            return [...prevItems, { ...productToAdd, quantity: 1 }];
        });
    };
    
    const handleUpdateCartQuantity = (productId, newQuantity) => {
        const productInStock = products.find(p => p._id === productId);
        if (newQuantity <= 0) {
            handleRemoveFromCart(productId);
            return;
        }
        if (newQuantity > productInStock.stock) {
            setNotification(`Only ${productInStock.stock} items available.`);
            setCartItems(prevItems => prevItems.map(item =>
                item._id === productId ? { ...item, quantity: productInStock.stock } : item
            ));
            return;
        }
        setCartItems(prevItems => prevItems.map(item =>
            item._id === productId ? { ...item, quantity: newQuantity } : item
        ));
    };

    const handleRemoveFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
        setNotification('Item removed from cart.');
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
        try {
            const response = await fetch(`${API_URL}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Registration failed');
            }
            setNotification('Registration successful! Please log in.');
            setView('login');
            return true;
        } catch (error) {
            setNotification(error.message);
            return false;
        }
    };

    const handleLogin = async ({ email, password }) => {
        setNotification('Login functionality requires a full auth backend with JWT.');
        return false; 
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setView('shop');
        setNotification('You have been logged out.');
    };

    const handleSaveProduct = async (productData) => {
        // This is a simplified version. A real app would have separate POST/PUT routes.
        try {
            const response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });
            if (!response.ok) throw new Error('Failed to save product');
            const newProduct = await response.json();
            setProducts(prev => [newProduct, ...prev.filter(p => p._id !== newProduct._id)]);
            setNotification('Product saved successfully!');
        } catch (error) {
            setNotification(error.message);
        }
    };
    
    const handlePlaceOrder = () => {
        setNotification('Placing orders requires a full backend implementation.');
    };
    
    const handleDeleteProduct = () => {};
    const handleUpdateOrderStatus = () => {};

    const renderView = () => {
        switch (view) {
            case 'cart':
                return <CartView cartItems={cartItems} onUpdateQuantity={handleUpdateCartQuantity} onRemoveItem={handleRemoveFromCart} onCheckout={handleCheckout} />;
            case 'admin':
                return currentUser?.isAdmin ? 
                    <AdminDashboard products={products} orders={orders} onSaveProduct={handleSaveProduct} onDeleteProduct={handleDeleteProduct} onUpdateOrderStatus={handleUpdateOrderStatus} onLogout={handleLogout} /> : 
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
            <Header onNavigate={handleNavigate} cartCount={cartItems.length} currentUser={currentUser} onLogout={handleLogout} />
            {notification && <div className="fixed top-20 right-5 bg-green-600 text-white py-3 px-6 rounded-lg shadow-2xl z-50 animate-fade-in-out">{notification}</div>}
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">{renderView()}</main>
            {isCheckoutModalOpen && <CheckoutModal onClose={() => setIsCheckoutModalOpen(false)} onPlaceOrder={handlePlaceOrder} total={checkoutTotal} />}
            <footer className="text-center py-10 mt-16 border-t border-gray-200"><p className="text-gray-500">&copy; {new Date().getFullYear()} HalalFresh. Built with 💚.</p></footer>
        </div>
    );
}

export default App;