import React from "react";
import { FaTimes, FaShieldAlt, FaShippingFast } from "react-icons/fa";

const PolicyModal = ({ type, onClose }) => {
  const content = {
    shipping: {
      title: "Shipping Policy",
      icon: <FaShippingFast size={32} />, // Size adjust kia
      text: (
        <ul className="policy-list">
          <li>
            <strong>Delivery Time:</strong> Standard delivery takes 3-5 working
            days across Pakistan.
          </li>
          <li>
            <strong>Delivery Charges:</strong> Delivery Charges are not included
            in the price. Delivery Charges are based on your location.
          </li>
          <li>
            <strong>Logistics:</strong> We use our dedicated logistics team for
            delivery, to ensure safe handling of furniture.
          </li>
        </ul>
      ),
    },
    returns: {
      title: "Returns & Exchange",
      icon: <FaShieldAlt size={32} />, // Size adjust kia
      text: (
        <ul className="policy-list">
          <li>
            <strong>7-Day Warranty:</strong> If the item is damaged upon
            arrival, we replace it for free.
          </li>
          <li>
            <strong>Conditions:</strong> The item must be unused and in original
            packaging.
          </li>
          <li>
            <strong>No Cash Refund:</strong> We currently offer exchanges or
            store credit only.
          </li>
        </ul>
      ),
    },
  };

  const data = content[type] || content.shipping;

  return (
    <div className="modal-overlay fade-in">
      {/* Main Card */}
      <div className="policy-modal-card">
        {/* Close Button (Ab card ke andar hai) */}
        <button onClick={onClose} className="btn-close-absolute">
          <FaTimes />
        </button>

        {/* Icon Header */}
        <div className="policy-header">
          <div className="policy-icon-badge">{data.icon}</div>
          <h3 className="brand-font">{data.title}</h3>
        </div>

        {/* Body Content */}
        <div className="policy-body">{data.text}</div>

        {/* Footer Button */}
        <button onClick={onClose} className="btn-gold-pill">
          Understood
        </button>
      </div>
    </div>
  );
};

export default PolicyModal;
