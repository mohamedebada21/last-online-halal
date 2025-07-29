import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products, onAddToCart, onViewProduct }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onViewProduct={onViewProduct} />
        ))}
    </div>
);
export default ProductList;