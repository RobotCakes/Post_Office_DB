import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/payment.css";

const Payment = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Determine where to go back after payment
  const previousPage = location.state?.from || "/";

  const handlePayment = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!cardNumber || !expiryDate || !cvv) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      // Mock payment processing
      setSuccessMessage("Payment successful!");
      setTimeout(() => {
        navigate(previousPage); // Navigate to the previous page after success
      }, 2000);
    } catch (error) {
      setError("Payment failed. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1>Payment Page</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <form onSubmit={handlePayment} className="payment-form">
        <div className="form-group">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="Enter your card number"
          />
        </div>
        <div className="form-group">
          <label htmlFor="expiryDate">Expiry Date</label>
          <input
            type="text"
            id="expiryDate"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            placeholder="MM/YY"
          />
        </div>
        <div className="form-group">
          <label htmlFor="cvv">CVV</label>
          <input
            type="text"
            id="cvv"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            placeholder="Enter CVV"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit Payment
        </button>
      </form>
    </div>
  );
};

export default Payment;
