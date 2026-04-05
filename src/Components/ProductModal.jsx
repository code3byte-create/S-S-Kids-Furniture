import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaStar,
  FaCheckCircle,
  FaMinus,
  FaPlus,
  FaShoppingCart,
} from "react-icons/fa";

const ProductModal = ({ product, onClose, addToCart }) => {
  const [modalQty, setModalQty] = useState(1);
  const [mainImage, setMainImage] = useState(product?.img);

  // --- NEW: Gallery Logic (Safe Check) ---
  // Agar 'images' array hai aur usme items hain to wo use karo, warna single 'img'
  const galleryImages =
    product?.images && product.images.length > 0
      ? product.images
      : [product?.img];

  useEffect(() => {
    // Jab product change ho, image reset karo
    setMainImage(product?.img);
    setModalQty(1);
  }, [product]);

  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle-bar"></div>
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes size={20} />
        </button>

        <div className="modal-img-section">
          {/* Main Image */}
          <img src={mainImage} alt={product.name} className="modal-main-img" />

          {/* Thumbnails (Dynamic) */}
          <div className="modal-thumbnails">
            {galleryImages.map((imgSrc, index) => (
              <img
                key={index}
                src={imgSrc}
                onClick={() => setMainImage(imgSrc)}
                className={`thumb-img ${mainImage === imgSrc ? "active" : ""}`}
                alt={`thumb-${index}`}
              />
            ))}
          </div>
        </div>

        <div className="modal-info-section">
          <span className="modal-category">{product.category}</span>
          <h2
            className="modal-title brand-font"
            style={{ color: "var(--text-main)" }}
          >
            {product.name}
          </h2>

          {/* Rating Stars (Static for design) */}
          <div
            className="d-flex text-warning mb-2"
            style={{ fontSize: "0.9rem" }}
          >
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>

          <div className="modal-price">
            Rs. {Number(product.price).toLocaleString()}
          </div>

          {/* --- UPDATED: DYNAMIC DESCRIPTION --- */}
          {/* Admin panel 'description' bhej raha hai, agar wo na ho to old 'desc' dikhaye */}
          <p className="modal-description">
            {product.description || product.desc || "No description available."}
          </p>

          {/* Features */}
          <div className="action-group glass-footer">
            <div className="qty-box">
              <button
                className="btn p-0"
                onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                style={{ color: "var(--text-main)" }}
              >
                <FaMinus size={12} />
              </button>
              <span
                className="fw-bold fs-5"
                style={{ color: "var(--text-main)" }}
              >
                {modalQty}
              </span>
              <button
                className="btn p-0"
                onClick={() => setModalQty(modalQty + 1)}
                style={{ color: "var(--text-main)" }}
              >
                <FaPlus size={12} />
              </button>
            </div>
            <button
              onClick={() => addToCart(product, modalQty)}
              className="btn btn-premium-modal rounded-pill gap-2 d-flex justify-content-center align-items-center"
            >
              Add to Cart <FaShoppingCart />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
