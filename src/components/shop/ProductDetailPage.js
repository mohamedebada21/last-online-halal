import React from 'react';

const ProductDetailPage = ({ product, onAddToCart, onNavigate }) => {
    const isOutOfStock = product.stock === 0;

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-5xl mx-auto">
            <button onClick={() => onNavigate('shop')} className="text-green-600 font-semibold mb-6 hover:underline">
                &larr; Back to all products
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div>
                    <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-auto rounded-xl object-cover shadow-md"
                        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x600/cccccc/FFFFFF?text=Image+Not+Found'; }}
                    />
                </div>
                <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase">{product.category}</span>
                    <h1 className="text-4xl font-extrabold text-gray-900 mt-2">{product.name}</h1>
                    <p className="text-4xl font-black text-green-600 mt-4">
                        ${product.price.toFixed(2)}
                        <span className="text-lg font-semibold text-gray-500"> / {product.unit}</span>
                    </p>
                    <p className="text-gray-600 mt-6 text-base leading-relaxed">{product.description}</p>
                    
                    <div className="mt-8">
                        <button 
                            onClick={() => onAddToCart(product)}
                            disabled={isOutOfStock}
                            className={`w-full py-4 rounded-lg font-bold text-lg text-white transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${isOutOfStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 focus:ring-red-500 transform hover:scale-105'}`}
                        >
                            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;