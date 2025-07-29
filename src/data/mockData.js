// In a real app, passwords would be securely hashed, not stored in plain text.
export const initialUsers = [
    { id: 'user1', name: 'Admin User', email: 'mabada0000@gmail.com', password: 'Wa7edabokteer!', isAdmin: true },
    { id: 'user2', name: 'Aisha Khan', email: 'aisha@example.com', password: 'password123', isAdmin: false },
];

export const initialProducts = [
  { id: 1, name: 'Organic Watermelon', description: 'Fresh, seedless, and juicy. Perfect for summer.', category: 'Fruits', price: 5.99, stock: 100, lowStockThreshold: 10, imageUrl: 'https://placehold.co/600x600/27A659/FFFFFF?text=Watermelon', unit: 'each', taxable: true },
  { id: 2, name: 'Halal Chicken Breast', description: '1kg pack of free-range, zabihah halal chicken.', category: 'Meats', price: 12.50, stock: 50, lowStockThreshold: 10, imageUrl: 'https://placehold.co/600x600/F23D4C/FFFFFF?text=Chicken', unit: 'kg', taxable: false },
  // ... other products
];

export const initialOrders = [
    { id: 101, userId: 'user2', orderId: 'ORD-12345', items: [{ productId: 1, name: 'Organic Watermelon', quantity: 2, price: 5.99, taxable: true }], subtotal: 11.98, taxAmount: 1.06, totalAmount: 13.04, customerDetails: { name: 'Aisha Khan', phone: '555-123-4567', address: '123 Green St, Meadowlands' }, paymentMethod: 'cod', orderStatus: 'Fulfilled', deliveryDate: new Date(new Date().setDate(new Date().getDate() - 5)) },
];
