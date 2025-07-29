import React, { useState, useEffect } from 'react';
import { initialProducts, initialOrders, initialUsers } from './data/mockData';
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

function App() {
    const [view, setView] = useState('shop');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState(initialProducts);
    const [cartItems, setCartItems] = useState([]);
    const [orders, setOrders] = useState(initialOrders);
    const [users, setUsers] = useState(initialUsers);
    const [currentUser, setCurrentUser] = useState(null);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [checkoutTotal, setCheckoutTotal] = useState(0);
    const [notification, setNotification] = useState('');

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
        const productInStock = products.find(p => p.id === productToAdd.id);
        if (!productInStock || productInStock.stock <= 0) {
            setNotification('This item is out of stock.');
            return;
        }
        setCartItems(prevItems => {
            const itemInCart = prevItems.find(item => item.id === productToAdd.id);
            if (itemInCart) {
                if (itemInCart.quantity >= productInStock.stock) {
                    setNotification('Cannot add more than available stock.');
                    return prevItems;
                }
                return prevItems.map(item =>
                    item.id === productToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            setNotification(`${productToAdd.name} added to cart!`);
            return [...prevItems, { ...productToAdd, quantity: 1 }];
        });
    };
    
    const handleUpdateCartQuantity = (productId, newQuantity) => {
        const productInStock = products.find(p => p.id === productId);
        if (newQuantity <= 0) {
            handleRemoveFromCart(productId);
            return;
        }
        if (newQuantity > productInStock.stock) {
            setNotification(`Only ${productInStock.stock} items available.`);
            setCartItems(prevItems => prevItems.map(item =>
                item.id === productId ? { ...item, quantity: productInStock.stock } : item
            ));
            return;
        }
        setCartItems(prevItems => prevItems.map(item =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
        ));
    };

    const handleRemoveFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
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

    const handlePlaceOrder = ({ customerDetails, paymentMethod }) => {
        const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const taxAmount = cartItems.reduce((sum, item) => item.taxable ? sum + (item.price * item.quantity * TAX_RATE) : sum, 0);
        
        const newOrder = {
            id: Date.now(),
            userId: currentUser.id, // Link order to current user
            orderId: `ORD-${Date.now().toString().slice(-6)}`,
            items: cartItems.map(item => ({ productId: item.id, name: item.name, quantity: item.quantity, price: item.price, taxable: item.taxable })),
            subtotal,
            taxAmount,
            totalAmount: subtotal + taxAmount,
            customerDetails: customerDetails || { name: currentUser.name, address: 'On File', phone: 'On File' },
            paymentMethod,
            paymentStatus: paymentMethod === 'stripe' ? 'Paid' : 'Pending',
            orderStatus: 'Pending',
            deliveryDate: new Date(new Date().setDate(new Date().getDate() + 1))
        };
        
        setOrders(prevOrders => [newOrder, ...prevOrders]);

        setProducts(prevProducts => {
            const updatedProducts = [...prevProducts];
            cartItems.forEach(cartItem => {
                const productIndex = updatedProducts.findIndex(p => p.id === cartItem.id);
                if (productIndex !== -1) {
                    updatedProducts[productIndex].stock -= cartItem.quantity;
                }
            });
            return updatedProducts;
        });
        
        setCartItems([]);
        setIsCheckoutModalOpen(false);
        setNotification('Order placed successfully! Thank you!');
        setView('shop');
        // NOTE: This is where you would make a fetch call to your backend to trigger the admin email.
        // fetch('/api/new-order', { method: 'POST', body: JSON.stringify({ orderDetails: newOrder }) });
        // NOTE: This is where you make a fetch call to your backend to trigger the admin email.
        fetch('http://localhost:5001/api/new-order', { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderDetails: newOrder }) 
            });
    };

    const handleLogin = ({ email, password }) => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            setCurrentUser(user);
            setView('shop');
            setNotification(`Welcome back, ${user.name}!`);
            return true;
        }
        return false;
    };

    const handleRegister = ({ name, email, password }) => {
        if (users.some(u => u.email === email)) {
            return false; // User already exists
        }
        const newUser = { id: `user${users.length + 1}`, name, email, password, isAdmin: false };
        setUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
        setView('shop');
        setNotification(`Welcome, ${name}! Your account has been created.`);
        return true;
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setView('shop');
        setNotification('You have been logged out.');
    };

    const handleSaveProduct = (productData) => {
        setProducts(prev => {
            const parsedData = {
                ...productData,
                price: parseFloat(productData.price),
                stock: parseInt(productData.stock),
                lowStockThreshold: parseInt(productData.lowStockThreshold),
                taxable: !!productData.taxable
            };
            if (productData.id) {
                // This is an existing product, so we map and update it
                return prev.map(p => p.id === productData.id ? parsedData : p);
            }
            // This is a new product, so we add it to the array
            const newProduct = { ...parsedData, id: Date.now() };
            return [newProduct, ...prev];
        });
        setNotification(productData.id ? 'Product updated successfully!' : 'Product added successfully!');
    };

    const handleDeleteProduct = (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setProducts(prev => prev.filter(p => p.id !== productId));
            setNotification('Product deleted.');
        }
    };
    
    const handleUpdateOrderStatus = (orderId, newStatus) => {
        let updatedOrder = null;
        setOrders(prev => prev.map(o => {
            if (o.id === orderId) {
                updatedOrder = { ...o, orderStatus: newStatus };
                return updatedOrder;
            }
            return o;
        }));
        setNotification(`Order #${updatedOrder.orderId} marked as ${newStatus}.`);

        if (newStatus === 'Fulfilled' && updatedOrder) {
            const customer = users.find(u => u.id === updatedOrder.userId);
            if (customer) {
                // NOTE: This is where you would make a fetch call to your backend to trigger the customer email.
                // fetch('/api/order-fulfilled', { method: 'POST', body: JSON.stringify({ orderDetails: updatedOrder, customerEmail: customer.email }) });
                console.log(`Simulating fulfillment email to ${customer.email}`);
            }
        }
    };

    const renderView = () => {
        switch (view) {
            case 'cart': return <CartView cartItems={cartItems} onUpdateQuantity={handleUpdateCartQuantity} onRemoveItem={handleRemoveFromCart} onCheckout={handleCheckout} />;
            case 'admin': 
                return currentUser?.isAdmin ? 
                    <AdminDashboard products={products} orders={orders} onSaveProduct={handleSaveProduct} onDeleteProduct={handleDeleteProduct} onUpdateOrderStatus={handleUpdateOrderStatus} onLogout={handleLogout} /> : 
                    <ProductList products={products} onAddToCart={handleAddToCart} onViewProduct={handleViewProduct} />; // Redirect non-admins to shop
            case 'productDetail': return <ProductDetailPage product={selectedProduct} onAddToCart={handleAddToCart} onNavigate={handleNavigate} />;
            case 'login': return <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
            case 'register': return <RegisterPage onRegister={handleRegister} onNavigate={handleNavigate} />;
            case 'account': return currentUser ? <AccountPage currentUser={currentUser} orders={orders} /> : <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
            case 'shop': default: return <ProductList products={products} onAddToCart={handleAddToCart} onViewProduct={handleViewProduct} />;
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
