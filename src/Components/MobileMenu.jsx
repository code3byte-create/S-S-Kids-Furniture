import React from "react";
import {
  FaTimes,
  FaChevronRight,
  FaMoon,
  FaSun,
  FaHome,
  FaShoppingBag,
  FaStar,
  FaInfoCircle,
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

const MobileMenu = ({
  isOpen,
  setIsOpen,
  scrollToSection,
  toggleTheme,
  theme,
}) => {
  const menuItems = [
    { label: "Home", id: "home", icon: <FaHome /> },
    {
      label: "Shop Categories",
      id: "shop-categories",
      icon: <FaShoppingBag />,
    },
    { label: "New Arrivals", id: "new-arrivals", icon: <FaStar /> },
    { label: "About Us", id: "about-us", icon: <FaInfoCircle /> },
  ];

  return (
    <>
      {/* ===================================================
         1. OVERLAY (BACKDROP) - CLICK TO CLOSE LOGIC
         ===================================================
         Yeh wo hissa hai jo menu ke peeche hota hai.
         Jab user yahan click karega, 'setIsOpen(false)' chalega
         aur menu band ho jayega.
      */}
      <div
        className={`mobile-menu-overlay ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* ===================================================
         2. SIDEBAR CONTAINER (THE MENU ITSELF)
         ===================================================
         Yeh Menu ka dabba hai. Is par click karne se menu band
         NAHI hoga, kyunke yeh overlay ke upar hai.
      */}
      <div className={`mobile-menu-sidebar ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="mobile-menu-header">
          <h3
            className="brand-font fw-bold mb-0"
            style={{ fontSize: "1.5rem" }}
          >
            FAIZI <span style={{ color: "var(--primary-gold)" }}>KIDS</span>
          </h3>
          <button className="btn-close-custom" onClick={() => setIsOpen(false)}>
            <FaTimes size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="mobile-links">
          {menuItems.map((item, index) => (
            <div
              key={index}
              // Link par click karne se bhi menu band ho jana chahiye
              onClick={() => {
                scrollToSection(item.id);
                setIsOpen(false);
              }}
              className="mobile-nav-item"
            >
              <div className="nav-icon-box">{item.icon}</div>
              <span className="nav-text">{item.label}</span>
              <FaChevronRight className="nav-arrow" />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mobile-menu-footer">
          <div className="theme-toggle-box" onClick={toggleTheme}>
            <span className="small fw-bold">Appearance</span>
            <div className="toggle-switch">
              {theme === "light" ? (
                <>
                  <FaSun className="text-warning me-2" /> Light
                </>
              ) : (
                <>
                  <FaMoon className="text-white me-2" /> Dark
                </>
              )}
            </div>
          </div>

          <div className="social-icons-row">
            <a
              href="https://www.facebook.com/share/1BtLYQaYU1/"
              target="_blank"
              rel="noreferrer"
              className="social-btn"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/s.s_kidsfurniture?igsh=MTZpc29sbGJleDJqMA=="
              target="_blank"
              rel="noreferrer"
              className="social-btn"
            >
              <FaInstagram />
            </a>
            <a
              href="https://wa.me/923240407989"
              target="_blank"
              rel="noreferrer"
              className="social-btn"
            >
              <FaWhatsapp />
            </a>
          </div>

          <p className="copyright-text">© 2025 Faizi Kids Furniture.</p>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
