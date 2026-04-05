import React, { useState } from "react";
import { db } from "../firebase"; // Path check kar len (../firebase)
import { addDoc, collection } from "firebase/firestore";
import Swal from "sweetalert2";
import OrderSuccessModal from "./OrderSuccessModal"; // ✅ Import Your Modal
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
  FaEnvelope,
  FaStickyNote,
  FaTruck,
  FaMoneyBillWave,
  FaCheckCircle,
  FaUniversity,
  FaMobileAlt,
  FaCreditCard,
  FaUpload,
  FaMailBulk,
} from "react-icons/fa";

const Checkout = ({ cartItems = [], subtotal = 0, onBack, onPlaceOrder }) => {
  // --- STATES ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [transactionId, setTransactionId] = useState("");
  const [proofImage, setProofImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // ✅ MODAL CONTROLS
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [finalOrderId, setFinalOrderId] = useState(""); // Is variable me ID store hogi

  // --- CALCULATIONS ---
  const safeSubtotal = Number(String(subtotal).replace(/,/g, "")) || 0;
  const advancePercentage = 0.3;
  const advanceAmount = Math.round(safeSubtotal * advancePercentage);
  const remainingAmount = safeSubtotal - advanceAmount;

  // --- ACCOUNT DATA ---
  const accountDetails = {
    "Bank Transfer": {
      title: "Faizi Kids Furniture",
      number: "PK36MEZN0000000123456789",
      bank: "Meezan Bank",
      icon: <FaUniversity className="text-warning me-2" />,
    },
    JazzCash: {
      title: "Faiz-Ul-Hassan",
      number: "0321-1234567",
      bank: "JazzCash",
      icon: <FaMobileAlt className="text-danger me-2" />,
    },
    EasyPaisa: {
      title: "Faiz-Ul-Hassan",
      number: "0345-1234567",
      bank: "EasyPaisa",
      icon: <FaMobileAlt className="text-success me-2" />,
    },
    SadaPay: {
      title: "Faiz-Ul-Hassan",
      number: "0321-1234567",
      bank: "SadaPay",
      icon: <FaCreditCard className="text-info me-2" />,
    },
  };

  // --- HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const uploadProofToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "faizi_mughal");
    data.append("cloud_name", "dzvcqhk9x");
    try {
      setIsUploading(true);
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dzvcqhk9x/image/upload",
        { method: "POST", body: data }
      );
      const uploadedImage = await res.json();
      setIsUploading(false);
      return uploadedImage.secure_url || null;
    } catch (error) {
      console.error("Upload Error:", error);
      setIsUploading(false);
      return null;
    }
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;
    if (!formData.name.trim()) {
      newErrors.name = "Required";
      isValid = false;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Required";
      isValid = false;
    }
    if (!formData.address.trim()) {
      newErrors.address = "Required";
      isValid = false;
    }
    if (!formData.city.trim()) {
      newErrors.city = "Required";
      isValid = false;
    }
    if (!transactionId) {
      Swal.fire({
        icon: "warning",
        title: "Transaction ID Missing",
        confirmButtonColor: "#d4a017",
      });
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  // ================================================================
  // 🔒 THE FINAL LOGIC (MODAL INTEGRATION)
  // ================================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // 1️⃣ GENERATE ID (LOCKED)
    const LOCKED_ID = `ORD-${Date.now()}`;
    console.log("🔒 GENERATED LOCKED ID:", LOCKED_ID); // Check Console

    const allProductNames = cartItems.map((item) => item.name).join(", ");

    // 2️⃣ SEND EMAIL (With LOCKED_ID)
    try {
      const n8nWebhook = "http://localhost:5678/webhook/new-order";
      const finalUrl = `${n8nWebhook}?name=${encodeURIComponent(
        formData.name
      )}&email=${encodeURIComponent(
        formData.email
      )}&product=${encodeURIComponent(
        allProductNames
      )}&price=${safeSubtotal}&orderId=${LOCKED_ID}&phone=${encodeURIComponent(
        formData.phone
      )}&address=${encodeURIComponent(
        formData.address
      )}&city=${encodeURIComponent(formData.city)}`;
      const img = new Image();
      img.src = finalUrl;
    } catch (err) {
      console.log("Email skipped");
    }

    // 3️⃣ SAVE TO DB (With LOCKED_ID)
    let finalProofUrl = "N/A";
    if (proofImage) {
      finalProofUrl = (await uploadProofToCloudinary(proofImage)) || "N/A";
    }

    try {
      const orderDataToSave = {
        ...formData,
        orderId: LOCKED_ID, // ✅ 100% SAME ID
        cartItems: cartItems,
        paymentInfo: {
          method: paymentMethod,
          totalAmount: safeSubtotal,
          advancePaid: advanceAmount,
          remainingBalance: remainingAmount,
          transactionId: transactionId,
          proofScreenshot: finalProofUrl,
          status: "Advance Verification Pending",
        },
        orderDate: new Date().toLocaleString(),
        phone: formData.phone,
      };

      await addDoc(collection(db, "orders"), orderDataToSave);
      console.log("✅ Database Saved with:", LOCKED_ID);

      // 4️⃣ SHOW MODAL (With LOCKED_ID)
      setFinalOrderId(LOCKED_ID); // ✅ State me ID set ki
      setShowSuccessModal(true); // ✅ Modal Open kia
      console.log("✅ Opening Modal with:", LOCKED_ID);
    } catch (error) {
      console.error("Critical Error:", error);
      Swal.fire({ icon: "error", title: "Order Failed", text: "Try again." });
    }
  };

  // --- HANDLE MODAL CLOSE ---
  const handleCloseModal = () => {
    setShowSuccessModal(false);
    // Modal band hone ke baad Parent ko batao (taake wo Cart clear kare)
    // Ye zaroori he ke ye Modal band hone ke baad ho.
    if (onPlaceOrder) {
      onPlaceOrder();
      window.location.reload(); // Refresh page to clear everything
    }
  };

  return (
    <>
      {/* ✅ CUSTOM MODAL RENDER HERE */}
      {showSuccessModal && (
        <OrderSuccessModal orderId={finalOrderId} onClose={handleCloseModal} />
      )}

      <div className="checkout-container fade-in">
        <div className="container">
          <div className="d-flex align-items-center mb-4 pt-3">
            <h2
              className="mb-0 brand-font"
              style={{ color: "var(--text-main)" }}
            >
              Secure <span style={{ color: "#D4A017" }}>Checkout</span>
            </h2>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-4 align-items-start">
              {/* LEFT COLUMN */}
              <div className="col-lg-8">
                <div className="checkout-card mb-4 p-3">
                  <h4 className="card-title">
                    <FaTruck className="text-warning me-2" /> Shipping Details
                  </h4>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label-sm">Full Name *</label>
                      <div
                        className={`input-group-custom ${
                          errors.name ? "error-group" : ""
                        }`}
                      >
                        <FaUser className="input-icon-overlay" />
                        <input
                          type="text"
                          name="name"
                          className="form-input-premium"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      {errors.name && (
                        <div className="text-danger small">{errors.name}</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label-sm">Phone *</label>
                      <div
                        className={`input-group-custom ${
                          errors.phone ? "error-group" : ""
                        }`}
                      >
                        <FaPhone className="input-icon-overlay" />
                        <input
                          type="tel"
                          name="phone"
                          className="form-input-premium"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                      {errors.phone && (
                        <div className="text-danger small">{errors.phone}</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label-sm">Email (Optional)</label>
                      <div className="input-group-custom">
                        <FaEnvelope className="input-icon-overlay" />
                        <input
                          type="email"
                          name="email"
                          className="form-input-premium"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label-sm">City *</label>
                      <div
                        className={`input-group-custom ${
                          errors.city ? "error-group" : ""
                        }`}
                      >
                        <FaCity className="input-icon-overlay" />
                        <input
                          type="text"
                          name="city"
                          className="form-input-premium"
                          value={formData.city}
                          onChange={handleChange}
                        />
                      </div>
                      {errors.city && (
                        <div className="text-danger small">{errors.city}</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label-sm">Postal Code</label>
                      <div className="input-group-custom">
                        <FaMailBulk className="input-icon-overlay" />
                        <input
                          type="text"
                          name="postalCode"
                          className="form-input-premium"
                          value={formData.postalCode}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label-sm">Address *</label>
                      <div
                        className={`input-group-custom ${
                          errors.address ? "error-group" : ""
                        }`}
                      >
                        <FaMapMarkerAlt className="input-icon-overlay icon-top" />
                        <textarea
                          name="address"
                          className="form-input-premium"
                          rows="2"
                          value={formData.address}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                      {errors.address && (
                        <div className="text-danger small">
                          {errors.address}
                        </div>
                      )}
                    </div>
                    <div className="col-12">
                      <label className="form-label-sm">Notes</label>
                      <div className="input-group-custom">
                        <FaStickyNote className="input-icon-overlay icon-top" />
                        <textarea
                          name="notes"
                          className="form-input-premium"
                          rows="2"
                          value={formData.notes}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="checkout-card p-3">
                  <h4 className="card-title">
                    <FaMoneyBillWave className="text-warning me-2" /> Payment
                  </h4>
                  <div className="d-flex gap-2 flex-wrap mb-4">
                    {Object.keys(accountDetails).map((method) => (
                      <button
                        key={method}
                        type="button"
                        className={`payment-tab-btn ${
                          paymentMethod === method ? "active" : ""
                        }`}
                        onClick={() => setPaymentMethod(method)}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                  <div className="account-details-box mb-3">
                    <strong>{accountDetails[paymentMethod].bank}</strong>
                    <br />
                    Title: {accountDetails[paymentMethod].title}
                    <br />
                    Account:{" "}
                    <span className="account-number-highlight">
                      {accountDetails[paymentMethod].number}
                    </span>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label-sm">Transaction ID *</label>
                      <div className="input-group-custom">
                        <FaCheckCircle className="input-icon-overlay" />
                        <input
                          type="text"
                          className="form-input-premium"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label-sm">Screenshot</label>
                      <div className="input-group-custom">
                        <FaUpload className="input-icon-overlay" />
                        <input
                          type="file"
                          className="form-input-premium"
                          style={{ paddingTop: "12px" }}
                          onChange={(e) => setProofImage(e.target.files[0])}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="col-lg-4">
                <div className="checkout-card summary-sticky p-3">
                  <h4 className="card-title">Summary</h4>
                  {cartItems.map((item) => (
                    <div key={item.id} className="checkout-item-row">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="img-thumb"
                      />
                      <div className="flex-grow-1">
                        <small className="fw-bold">{item.name}</small>
                        <br />
                        <small className="text-muted">x{item.qty}</small>
                      </div>
                      <small className="fw-bold">
                        Rs. {item.price * item.qty}
                      </small>
                    </div>
                  ))}
                  <hr />
                  <div className="d-flex justify-content-between">
                    <strong>Total</strong>
                    <strong className="text-warning">
                      Rs. {safeSubtotal.toLocaleString()}
                    </strong>
                  </div>
                  <button
                    className="btn-gold-checkout w-100 mt-3"
                    type="submit"
                    disabled={isUploading}
                  >
                    {isUploading ? "Processing..." : "Place Order"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Checkout;
