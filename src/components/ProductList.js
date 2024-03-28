import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../api';
import { useNavigate } from 'react-router-dom';
import {FaSearch, FaShoppingCart } from 'react-icons/fa';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const { products: productsData } = await fetchProducts();
        setProducts(productsData || []);
        setSearchResults(productsData || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products');
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  const addToCart = (product) => {
    console.log("Add to cart clicked");
    
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItemIndex = cartItems.findIndex((item) => item.id === product.id);
    
    if (existingItemIndex !== -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity++;
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    } else {
      const newCartItem = { ...product, quantity: 1 };
      localStorage.setItem('cartItems', JSON.stringify([...cartItems, newCartItem]));
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    console.log("products",products);
    const results = products.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm, products]);

  return (
    <div className="product-list-container">
      <h2>Products</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="&#128269; Search by name or category"
          value={searchTerm}
          onChange={handleSearchChange}
        />
         <button className="cartbtn" onClick={() => navigate('/cart')}>
         <span className="icon"><FaShoppingCart /></span>
  <span className="text">Cart</span>
      </button>
      </div>
      <div className="product-grid">
        {searchResults.map((product) => (
          <div className="product-item" key={product.id}>
            <img src={product.thumbnail} alt={product.title} />
            <div className="product-details">
              <h3 className="product-title">{product.title}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price">${product.price} (Discount % : {product.discountPercentage}) </p>
              <p className='product-rating'>Rating: {product.rating} </p> 
              <div className="product-actions">
                <button onClick={() => addToCart(product)}>Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;