import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCartItems);
  }, []);

  const handleQuantityChange = (itemId, newQuantity) => {
    const updatedCartItems = cartItems.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCartItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  const handleIncrement = (itemId) => {
    const updatedCartItems = cartItems.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCartItems(updatedCartItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  const handleDecrement = (itemId) => {
    const updatedCartItems = cartItems.map(item => {
      if (item.id === itemId && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setCartItems(updatedCartItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  const removeCartItem = (itemId) => {
    const updatedCartItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCartItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  const calculateSubtotal = () => {
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    return { totalQuantity, totalPrice };
  };

  const { totalQuantity, totalPrice } = calculateSubtotal();

  return (
    <div className="cart-container">
      <h2>Cart</h2>
      <div className="cart-items-container">
      <ul>
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => (
            <li key={item.id}>
              <div className="cartproduct-details">
                <img src={item.thumbnail} alt={item.title} />
                <div className='cartproduct'>
                  <h3>{item.title}</h3>
                  <p>Price: ${item.price}</p>
                </div>
              </div>
              <div className="quantity-controls">
                <button className="decrement-btn" onClick={() => handleDecrement(item.id)}>-</button>
                <input
                  type="number"
                  className="quantity-input"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                />
                <button className="increment-btn" onClick={() => handleIncrement(item.id)}>+</button>
                <button className="remove-btn" onClick={() => removeCartItem(item.id)}>Remove</button>
                <p className="subtotal">Subtotal ({item.quantity} item): ${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </li>
          ))
        ) : (
          <li>No items in cart</li>
        )}
      </ul>
      </div>
      <div className="subtotal-container"> 
        <p>Total Quantity: {totalQuantity}</p>
        <p>Total Price: ${totalPrice}</p>
      </div>
      <button className="productbtn" onClick={() => navigate('/')}>Back to ProductList</button>
    </div>
  );
};

export default Cart;
