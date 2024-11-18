import { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/supplies.css";
import {CustomerNavbar } from "../../components/Navbars";

const Supplies = () => {
  const [supplies, setSupplies] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchSupplies = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://post-backend-2f54f7162fc4.herokuapp.com/supplies/supplies"
        );
        setSupplies(response.data);
      } catch (error) {
        setError("Failed to load supplies. Please try again.");
        console.error("Error fetching supplies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplies();
  }, []);

  const addToCart = (supply) => {
    const existingItem = cart.find((item) => item.supplyID === supply.supplyID);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.supplyID === supply.supplyID
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...supply, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.supplyID !== id));
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + item.pricePerUnit * item.quantity,
      0
    );
  };

  const handlePurchase = async () => {
    setShowConfirm(false);
    try {
      const response = await axios.post(
        "https://post-backend-2f54f7162fc4.herokuapp.com/purchase",
        { cart }
      );
      if (response.data.success) {
        setSuccessMessage("Purchase completed successfully!");
        setCart([]);
      } else {
        setError("Failed to complete purchase. Please try again.");
      }
    } catch (error) {
      setError("Error processing purchase. Please try again.");
      console.error("Purchase error:", error);
    }
  };

  return (
    <div className="container">
      <CustomerNavbar />
      <h1>Supplies</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table className="supplies-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Quantity</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {supplies.map((supply) => (
            <tr key={supply.supplyID}>
              <td>{supply.name}</td>
              <td>${supply.pricePerUnit.toFixed(2)}</td>
              <td>{supply.quantity}</td>
              <td>
                <button
                  onClick={() => addToCart(supply)}
                  disabled={
                    cart.some((item) => item.supplyID === supply.supplyID) ||
                    supply.quantity <= 0
                  }
                >
                  Add to Cart
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Cart Section */}
      <h2>Cart</h2>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.supplyID}>
                  <td>{item.name}</td>
                  <td>${item.pricePerUnit.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.pricePerUnit * item.quantity).toFixed(2)}</td>
                  <td>
                    <button onClick={() => removeFromCart(item.supplyID)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Display Total Amount */}
          <h3>Total Amount: ${calculateTotal().toFixed(2)}</h3>

          {/* Confirm Purchase Modal */}
          {showConfirm ? (
            <div className="confirm-purchase">
              <p>Are you sure you want to complete the purchase?</p>
              <button onClick={handlePurchase}>Yes</button>
              <button onClick={() => setShowConfirm(false)}>No</button>
            </div>
          ) : (
            <button
              className="purchase-button"
              onClick={() => setShowConfirm(true)}
            >
              Complete Purchase
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Supplies;
