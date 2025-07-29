import React from 'react';

const ProductCard = ({ product, onAddToCart, onViewProduct }) => {
    const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;
    const isOutOfStock = product.stock === 0;

    return (
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden transform hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col">
            <div onClick={() => onViewProduct(product)} className="relative cursor-pointer">
                <img src={product.imageUrl.replace('400x400', '600x600')} alt={product.name} className="w-full h-48 object-cover" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x400/cccccc/FFFFFF?text=Image+Not+Found'; }}/>
                {isLowStock && !isOutOfStock && <span className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2.5 py-1 rounded-full">Low Stock</span>}
                {isOutOfStock && <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">Out of Stock</span>}
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <h3 onClick={() => onViewProduct(product)} className="text-lg font-bold text-gray-800 truncate cursor-pointer hover:text-green-600 transition">{product.name}</h3>
                <p className="text-gray-500 text-sm mt-1 flex-grow h-10">{product.description}</p>
                <div className="flex justify-between items-center mt-4">
                    <p className="text-2xl font-black text-green-600">${product.price.toFixed(2)}<span className="text-sm font-semibold text-gray-500"> / {product.unit}</span></p>
                    <button 
                        onClick={() => onAddToCart(product)}
                        disabled={isOutOfStock}
                        className={`px-5 py-2.5 rounded-lg font-bold text-sm text-white transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${isOutOfStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 focus:ring-red-500 transform hover:scale-105'}`}
                    >
                        {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ProductCard;