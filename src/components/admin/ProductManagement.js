import React, { useState } from 'react';
import Icon from '../ui/Icon';
import Modal from '../ui/Modal';

const ProductForm = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState(product);
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

    return (
        <Modal onClose={onCancel} title={product.id ? 'Edit Product' : 'Add New Product'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" className="w-full p-3 border border-gray-300 rounded-lg" required />
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-3 border border-gray-300 rounded-lg" required />
                <div className="grid grid-cols-2 gap-4">
                    <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="w-full p-3 border border-gray-300 rounded-lg" required />
                    <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} placeholder="Price" className="w-full p-3 border border-gray-300 rounded-lg" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="Stock" className="w-full p-3 border border-gray-300 rounded-lg" required />
                    <input name="lowStockThreshold" type="number" value={formData.lowStockThreshold} onChange={handleChange} placeholder="Low Stock Threshold" className="w-full p-3 border border-gray-300 rounded-lg" required />
                </div>
                <input name="unit" value={formData.unit} onChange={handleChange} placeholder="Unit (e.g., kg, each, bunch)" className="w-full p-3 border border-gray-300 rounded-lg" required />
                <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Image URL" className="w-full p-3 border border-gray-300 rounded-lg" />
                <div className="flex items-center">
                    <input id="taxable" name="taxable" type="checkbox" checked={formData.taxable} onChange={handleChange} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                    <label htmlFor="taxable" className="ml-2 block text-sm text-gray-900">This product is taxable</label>
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                    <button type="button" onClick={onCancel} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold transition">Cancel</button>
                    <button type="submit" className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-bold transition">Save Product</button>
                </div>
            </form>
        </Modal>
    );
};

const ProductManagement = ({ products, onSaveProduct, onDeleteProduct }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const handleOpenModal = (product = null) => {
        setEditingProduct(product || { name: '', description: '', category: '', price: '', stock: '', lowStockThreshold: '', imageUrl: '', unit: 'each', taxable: false });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleSave = (productData) => {
        onSaveProduct(productData);
        handleCloseModal();
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/80">
            <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-gray-800">Product Management</h3>
                <button onClick={() => handleOpenModal()} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors shadow-sm">
                    <Icon name="plus" className="w-5 h-5" />
                    <span>Add Product</span>
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Price</th>
                            <th scope="col" className="px-6 py-3 text-center">Stock</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {products.map(p => (
                            <tr key={p.id} className="bg-white hover:bg-gray-50/50 transition">
                                <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                                <td className="px-6 py-4">${p.price.toFixed(2)} / {p.unit}</td>
                                <td className="px-6 py-4 text-center">{p.stock}</td>
                                <td className="px-6 py-4 flex justify-center space-x-3">
                                    <button onClick={() => handleOpenModal(p)} className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 transition"><Icon name="edit" className="w-5 h-5"/></button>
                                    <button onClick={() => onDeleteProduct(p.id)} className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition"><Icon name="trash" className="w-5 h-5"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <ProductForm product={editingProduct} onSave={handleSave} onCancel={handleCloseModal} />}
        </div>
    );
};
export default ProductManagement;