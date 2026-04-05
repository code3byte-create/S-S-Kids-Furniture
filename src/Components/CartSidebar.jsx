import React from "react";
import {
  FaTimes,
  FaShoppingCart,
  FaMinus,
  FaPlus,
  FaTrash,
  FaArrowRight,
} from "react-icons/fa";

const CartSidebar = ({
  isOpen,
  setIsOpen,
  cartItems,
  updateQty,
  removeFromCart,
  subtotal,
  onCheckout,
}) => {
  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(false)}
      ></div>
      <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h3>Your Cart ({cartItems.length})</h3>
          <button className="cart-close-btn" onClick={() => setIsOpen(false)}>
            <FaTimes />
          </button>
        </div>
        <div className="cart-items-container">
          {cartItems.length === 0 ? (
            <div
              className="h-100 d-flex flex-column align-items-center justify-content-center text-main"
              style={{ opacity: 0.5 }}
            >
              <FaShoppingCart size={60} className="mb-3" />
              <h5>Your cart is empty</h5>
              <button
                className="btn btn-sm btn-outline-secondary mt-3 rounded-pill"
                onClick={() => setIsOpen(false)}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.img} alt={item.name} className="cart-item-img" />
                <div className="cart-item-details">
                  <div>
                    <div className="cart-item-name">{item.name}</div>
                    <div className="text-main small">{item.category}</div>
                  </div>
                  <div className="cart-actions">
                    <div className="cart-item-price">
                      Rs. {item.price.toLocaleString()}
                    </div>
                    <div className="mini-qty-box">
                      <button
                        className="qty-mini-btn"
                        onClick={() => updateQty(item.id, "dec")}
                      >
                        <FaMinus size={8} />
                      </button>
                      <span className="qty-mini-val">{item.qty}</span>
                      <button
                        className="qty-mini-btn"
                        onClick={() => updateQty(item.id, "inc")}
                      >
                        <FaPlus size={8} />
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  <FaTrash size={12} />
                </button>
              </div>
            ))
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="bill-row">
              <span className="bill-label">Subtotal</span>
              <span className="bill-total">
                Rs. {subtotal.toLocaleString()}
              </span>
            </div>
            <button className="btn-checkout" onClick={onCheckout}>
              Proceed to Checkout <FaArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
