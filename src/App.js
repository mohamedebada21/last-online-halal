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
import Icon from './components/ui/Icon';

const API_URL = 'https://halal-fresh-backend.onrender.com/api'; // Your backend server URL

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
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            setNotification(error.message);
        }
    }, [currentUser]); // Dependency on currentUser

    // Effect to fetch orders when the view changes to a page that needs them
    useEffect(() => {
        if (currentUser && (view === 'account' || view === 'admin')) {
            fetchOrders();
        }
    }, [currentUser, view, fetchOrders]);

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

    const handlePlaceOrder = async () => {
        const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const taxAmount = cartItems.reduce((sum, item) => item.taxable ? sum + (item.price * item.quantity * TAX_RATE) : sum, 0);
        const total = subtotal + taxAmount;
        
        const orderData = {
            userId: currentUser.id,
            items: cartItems.map(item => ({ productId: item._id, name: item.name, quantity: item.quantity, price: item.price })),
            totalAmount: total,
            subtotal: subtotal,
            taxAmount: taxAmount,
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
            
            // Navigate to the account page. The useEffect hook will then
            // automatically fetch the latest orders, including the one just placed.
            setView('account');

        } catch (error) {
            setNotification(error.message);
        }
    };
    
    const handleDeleteProduct = () => {
        setNotification('Delete functionality requires a DELETE /api/products/:id endpoint.');
    };
    
    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`${API_URL}/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderStatus: newStatus }),
            });
            if (!response.ok) throw new Error('Failed to update order status');
            const updatedOrder = await response.json();
            setOrders(prevOrders => 
                prevOrders.map(o => o._id === updatedOrder._id ? updatedOrder : o)
            );
            setNotification(`Order #${updatedOrder._id.slice(-6).toUpperCase()} marked as ${newStatus}.`);
        } catch (error) {
            setNotification(error.message);
        }
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
            <footer className="text-center py-10 mt-16 border-t border-gray-200">
                <div className="flex justify-center items-center space-x-6 mb-4">
                    <a href="tel:+16462297473" className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition">
                        <Icon name="phone" className="w-5 h-5" />
                        <span>+1 (646) 229-7473</span>
                    </a>
                    <a href="mailto:halalonlinestore101@gmail.com" className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition">
                        <Icon name="mail" className="w-5 h-5" />
                        <span>halalonlinestore101@gmail.com</span>
                    </a>
                </div>
                <p className="text-gray-500">&copy; {new Date().getFullYear()} HalalFresh. Built with 💚.</p>
            </footer>
        </div>
    );
}

export default App;