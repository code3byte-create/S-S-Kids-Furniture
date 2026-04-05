import React from "react";
import {
  FaBars,
  FaShoppingCart,
  FaMoon,
  FaSun,
  FaShippingFast,
} from "react-icons/fa";

const Navbar = ({
  toggleTheme,
  theme,
  cartCount,
  setIsCartOpen,
  setIsMobileMenuOpen,
  scrollToSection,
  onTrackClick,
  hasNewOrder,
  onHomeClick,
}) => {
  return (
    <nav className="navbar glass-navbar sticky-top">
      <div className="container d-flex justify-content-between align-items-center">
        {/* --- 1. LEFT: MOBILE MENU & LOGO --- */}
        <div className="d-flex align-items-center gap-3">
          {/* Mobile Menu Button (Hamburger) */}
          <button
            className="btn d-lg-none p-0 border-0"
            style={{ color: "var(--text-main)", fontSize: "24px" }}
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <FaBars />
          </button>

          {/* Brand Logo */}
          <span
            className="navbar-brand fw-bold brand-font m-0 text-nowrap"
            onClick={onHomeClick}
            style={{ color: "var(--text-main)" }}
          >
            S&S <span style={{ color: "var(--primary-gold)" }}>KIDS</span>
            {/* "FURNITURE" sirf bari screen (sm se upar) par dikhega */}
            <span className="d-none d-sm-inline ms-1">FURNITURE</span>
          </span>
        </div>

        {/* --- 2. CENTER: DESKTOP LINKS (Hidden on Mobile) --- */}
        <div className="d-none d-lg-flex gap-4">
          <span
            onClick={onHomeClick}
            className="nav-link-custom "
          >
            Home
          </span>
          <span
            onClick={() => scrollToSection("shop-categories")}
            className="nav-link-custom "
          >
            Shop
          </span>
          <span
            onClick={() => scrollToSection("new-arrivals")}
            className="nav-link-custom "
          >
            New Arrivals
          </span>
          <span
            onClick={() => scrollToSection("about-us")}
            className="nav-link-custom "
          >
            About Us
          </span>
        </div>

        {/* --- 3. RIGHT: ICONS (Visible on Mobile & Desktop) --- */}
        <div className="d-flex align-items-center gap-2 gap-md-3">
          {/* Track Icon */}
          <button
            onClick={onTrackClick}
            className="nav-icon-btn"
            style={{ color: "var(--text-main)" }}
            title="Track Your Order"
          >
            <FaShippingFast size={20} />
            {/* Red Dot Logic */}
            {hasNewOrder && <span className="notification-dot"></span>}
          </button>

          {/* Theme Toggle (Desktop Only to save space on mobile) */}
          <button
            onClick={toggleTheme}
            className="nav-icon-btn d-none d-lg-flex"
            style={{ color: "var(--text-main)" }}
          >
            {theme === "light" ? (
              <FaMoon size={18} />
            ) : (
              <FaSun size={18} color="#ffd700" />
            )}
          </button>

          {/* Cart Icon */}
          <button
            className="nav-icon-btn"
            style={{ color: "var(--text-main)" }}
            onClick={() => setIsCartOpen(true)}
          >
            <div className="position-relative">
              <FaShoppingCart size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
