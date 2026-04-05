import React, { useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import {
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaIdCard,
  FaArrowLeft,
  FaPhone,
  FaWhatsapp
} from "react-icons/fa";

// Firebase Database instance
const db = getFirestore();

const OrderTracking = () => {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState(""); // CHANGED: Email -> Phone
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();

    // Validation
    if (!orderId.trim() || !phone.trim()) {
      setError("Please enter both Order ID and Phone Number.");
      return;
    }

    setLoading(true);
    setError("");
    setOrderData(null);

    try {
      // 1. Firebase Query: Order ID dhoondo
      const q = query(
        collection(db, "orders"),
        where("orderId", "==", orderId.trim())
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data();

        // 2. SECURITY CHECK: Phone Number Match (Pakistani Context)
        // Hum check karenge ke database wala phone aur user ka input same hai ya nahi
        if (docData.phone && docData.phone.trim() === phone.trim()) {
          setOrderData(docData);
        } else {
          setError("Order found, but Phone Number does not match.");
        }
      } else {
        setError("Order ID not found. Please check your details.");
      }
    } catch (err) {
      console.error("Tracking Error:", err);
      setError("Network error. Please try again later.");
    }
    setLoading(false);
  };

  // Helper for Timeline Steps
  const getProgressStep = (status) => {
    if (status === "Pending") return 1;
    if (status === "Shipped") return 2;
    if (status === "Delivered") return 3;
    return 0; // Cancelled
  };

  const currentStep = orderData ? getProgressStep(orderData.status) : 0;

  return (
    <div className="tracking-page fade-in">
      <div className="container py-4">
        {/* Back Button REMOVED (Navbar is enough) */}

        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* --- SEARCH CARD (Sirf tab dikhega jab Result na ho) --- */}
            {!orderData && (
              <div className="tracking-card mb-4 fade-in">
                <div className="text-center mb-4">
                  <h2 className="tracking-title">
                    Track Your <span className="text-gold">Order</span>
                  </h2>
                  <p className="tracking-subtitle">
                    Enter your Order ID & Phone Number to see details.
                  </p>
                </div>

                <form onSubmit={handleTrack}>
                  {/* ... Inputs wese hi rahenge ... */}
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="input-group-custom">
                        <FaIdCard className="input-icon-overlay" />
                        <input
                          type="text"
                          className="form-input-premium"
                          placeholder="e.g. ORD-173..."
                          value={orderId}
                          onChange={(e) => setOrderId(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group-custom">
                        <FaPhone className="input-icon-overlay" />
                        <input
                          type="tel"
                          className="form-input-premium"
                          placeholder="0300-1234567"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <button
                        disabled={loading}
                        className="btn-gold-checkout w-100 py-3 mt-2"
                      >
                        {loading ? "Verifying..." : "Track My Order"}
                      </button>
                    </div>
                  </div>
                </form>
                {error && (
                  <div className="alert alert-danger mt-3">
                    <FaTimesCircle /> {error}
                  </div>
                )}
              </div>
            )}

            {/* --- RESULT CARD --- */}
            {orderData && (
              <div className="tracking-card result-card fade-in">
                {/* "Track Another" Button (Wapis Search lane ke liye) */}
                <button
                  onClick={() => setOrderData(null)}
                  className="btn btn-sm btn-outline-secondary mb-4"
                  style={{ borderRadius: "20px" }}
                >
                  <FaArrowLeft /> Track Another Order
                </button>

                {/* Header */}
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 pb-3 border-bottom border-secondary border-opacity-10">
                  <div>
                    <h4 className="mb-1 text-dark-responsive fw-bold">
                      Order #{orderData.orderId}
                    </h4>
                    <span className="tracking-subtitle">
                      Placed on: {orderData.date}
                    </span>
                  </div>
                  <span
                    className={`badge-status ${orderData.status} mt-2 mt-md-0`}
                  >
                    {orderData.status}
                  </span>
                </div>

                {/* Timeline (Wese hi rahega) */}
                {orderData.status !== "Cancelled" && (
                  <div className="timeline-wrapper">
                    {/* ... Timeline Steps Code ... */}
                    <div
                      className={`timeline-step ${
                        currentStep >= 1 ? "active" : ""
                      }`}
                    >
                      <div className="circle">
                        <FaClock />
                      </div>
                      <p>Pending</p>
                    </div>
                    <div
                      className={`timeline-line ${
                        currentStep >= 2 ? "filled" : ""
                      }`}
                    ></div>
                    <div
                      className={`timeline-step ${
                        currentStep >= 2 ? "active" : ""
                      }`}
                    >
                      <div className="circle">
                        <FaTruck />
                      </div>
                      <p>Shipped</p>
                    </div>
                    <div
                      className={`timeline-line ${
                        currentStep >= 3 ? "filled" : ""
                      }`}
                    ></div>
                    <div
                      className={`timeline-step ${
                        currentStep >= 3 ? "active" : ""
                      }`}
                    >
                      <div className="circle">
                        <FaCheckCircle />
                      </div>
                      <p>Delivered</p>
                    </div>
                  </div>
                )}

                {/* Items Section */}
                <div className="order-details-box mt-5">
                  {/* REMOVED "Order Details" Heading */}

                  {orderData.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="d-flex gap-3 align-items-center mb-3"
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        className="img-thumb-small"
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-0 small fw-bold text-dark-responsive">
                          {item.name}
                        </h6>
                        <small className="tracking-subtitle">
                          Qty: {item.qty}
                        </small>
                      </div>
                      <div className="fw-bold text-gold">
                        Rs. {item.price.toLocaleString()}
                      </div>
                    </div>
                  ))}

                  <div className="d-flex justify-content-between mt-4 pt-3 border-top border-secondary border-opacity-10">
                    <span className="fw-bold text-dark-responsive">
                      Total Amount
                    </span>
                    <span className="fw-bold text-gold fs-5">
                      Rs. {orderData.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  {/* Tracking Card ke andar kahin bhi (e.g., Result ke neechay) */}

                  <div className="text-center mt-4 pt-3 border-top">
                    <small className="text-muted d-block mb-2">
                      Having trouble with your order?
                    </small>
                    <a
                      href="https://wa.me/933240407989?text=Hi, I need help with my Order"
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-outline-success rounded-pill px-4"
                    >
                      <FaWhatsapp className="me-2" /> Chat with Support
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
