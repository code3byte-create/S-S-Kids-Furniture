import React, { useState } from "react";
import { FaCheckCircle, FaTimes, FaCopy, FaCheck } from "react-icons/fa";

const OrderSuccessModal = ({ orderId, onClose }) => {
  const [showToast, setShowToast] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(orderId);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    // zIndex 9999: Taake ye kisi aur popup ke neeche na chup jaye
    <div
      className="modal-overlay fade-in"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        className="modal-content success-modal text-center p-5"
        style={{
          background: "#fff",
          borderRadius: "15px",
          maxWidth: "400px",
          width: "90%",
          position: "relative",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn-close-modal"
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            border: "none",
            background: "transparent",
            fontSize: "20px",
            cursor: "pointer",
            color: "#888",
          }}
        >
          <FaTimes />
        </button>

        {/* Success Icon */}
        <div className="success-icon-container mb-4">
          <FaCheckCircle
            className="text-success bounce-animation"
            size={80}
            color="#28a745"
          />
        </div>

        <h2 className="brand-font mb-3" style={{ color: "#001f3f" }}>
          Order Placed <span style={{ color: "#D4A017" }}>Successfully!</span>
        </h2>
        <p className="text-muted">
          Thank you for shopping with Faizi Kids. Your order has been received.
        </p>

        {/* Order ID Box */}
        <div
          className="order-id-box my-4"
          style={{
            background: "#f8f9fa",
            padding: "15px",
            borderRadius: "10px",
            border: "1px dashed #D4A017",
          }}
        >
          <p
            className="mb-1 small text-uppercase fw-bold text-muted"
            style={{ fontSize: "12px" }}
          >
            Your Tracking ID
          </p>
          <div className="d-flex justify-content-center align-items-center gap-3">
            <h3
              className="m-0 fw-bold tracking-id-text"
              style={{ color: "#001f3f", wordBreak: "break-all" }}
            >
              {orderId}
            </h3>

            <button
              onClick={copyToClipboard}
              className="btn-icon-copy"
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: showToast ? "#28a745" : "#888",
                fontSize: "18px",
              }}
              title="Copy ID"
            >
              {showToast ? <FaCheck /> : <FaCopy />}
            </button>
          </div>
          <small
            className="text-danger mt-2 d-block"
            style={{ fontSize: "11px" }}
          >
            * Please save this ID to track your order.
          </small>
        </div>

        <button
          onClick={onClose}
          className="btn-gold w-100 py-3 rounded-pill fw-bold shadow-sm"
          style={{
            background: "#D4A017",
            color: "#fff",
            border: "none",
            fontSize: "16px",
          }}
        >
          Continue Shopping
        </button>

        {/* Toast Notification */}
        {showToast && (
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#333",
              color: "#fff",
              padding: "8px 15px",
              borderRadius: "20px",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <FaCheckCircle color="#D4A017" /> Copied!
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSuccessModal;
