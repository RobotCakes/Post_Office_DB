import { useState, useEffect } from "react";
import axios from 'axios';
import "../../styles/supplies.css";

const Supplies = () => {
  const [supplies, setSupplies] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSupplies = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://post-backend-2f54f7162fc4.herokuapp.com/supplies/supplies');
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
    const existingItem = cart.find(item => item.id === supply.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === supply.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...supply, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  return (
    <div className="container">
      <h1>Supplies</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <table className="supplies-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {supplies.map(supply => (
            <tr key={supply.id}>
              <td>{supply.name}</td>
              <td>${supply.pricePerUnit.toFixed(2)}</td>
              <td>{supply.quantity}</td>
              <td>
                <button 
                  onClick={() => addToCart(supply)} 
                  disabled={cart.some(item => item.id === supply.id) || supply.quantity <= 0}
                >
                  Add to Cart
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table className="cart-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {cart.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>${item.pricePerUnit.toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td>
                  <button onClick={() => removeFromCart(item.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Supplies;
