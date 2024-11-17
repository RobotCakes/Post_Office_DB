import React, { useState } from "react";
import "../../styles/supplies.css";

const suppliesData = [
  { id: 1, name: "Stamps", price: 0.55 },
  { id: 2, name: "Packing Tape", price: 2.99 },
  { id: 3, name: "Envelopes", price: 1.99 },
  { id: 4, name: "Postcards", price: 0.99 },
  { id: 5, name: "Pens", price: 1.5 },
  { id: 6, name: "Pencils", price: 0.99 },
  { id: 7, name: "Notepads", price: 3.99 },
  { id: 8, name: "Paper (Letter Size)", price: 4.99 },
  { id: 9, name: "Greeting Cards", price: 2.49 },
];

const Supplies = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [purchaseMessage, setPurchaseMessage] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredSupplies = suppliesData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) =>
      prevCart.filter((cartItem) => cartItem.id !== itemId)
    );
  };

  const totalCost = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handlePurchase = () => {
    if (cart.length === 0) {
      setPurchaseMessage("Your cart is empty. Please add items to purchase.");
      return;
    }

    // Example: Send cart data to a backend (this is just a placeholder)
    console.log("Purchasing items:", cart);

    // Clear the cart and show confirmation message
    setCart([]);
    setPurchaseMessage("Thank you for your purchase! Your order has been placed.");
  };

  return (
    <div className="supplies-container">
      <h1>Available Supplies</h1>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search supplies..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="supplies-search"
      />

      {/* Supplies List */}
      <div className="supplies-list">
        {filteredSupplies.map((supply) => (
          <div key={supply.id} className="supply-item">
            <h3>{supply.name}</h3>
            <p>${supply.price.toFixed(2)}</p>
            <button className="btn" onClick={() => addToCart(supply)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart Section */}
      <div className="cart-container">
        <h2>Shopping Cart</h2>
        {cart.length > 0 ? (
          <>
            <ul className="cart-list">
              {cart.map((item) => (
                <li key={item.id} className="cart-item">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                  <button
                    className="btn-remove"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <p className="total-cost">Total: ${totalCost.toFixed(2)}</p>
            <button className="btn-purchase" onClick={handlePurchase}>
              Purchase
            </button>
          </>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>

      {/* Purchase Confirmation */}
      {purchaseMessage && <p className="purchase-message">{purchaseMessage}</p>}
    </div>
  );
};

export default Supplies;
