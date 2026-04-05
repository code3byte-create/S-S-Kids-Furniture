import React, { useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaArrowRight,
  FaCheck,
  FaUserShield,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = ({
  onCategoryClick,
  onTrackClick,
  openPolicy,
  onAdminLogin,
}) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail("");
    }
  };

  return (
    <footer className="premium-footer">
      {/* --- MAIN CONTAINER --- */}
      <div className="container">
        {/* SECTION 1: LINKS & NEWSLETTER */}
        <div className="row g-5 mb-5">
          {/* Brand & Socials */}
          <div className="col-lg-4 col-md-6">
            <h3 className="brand-font fw-bold text-white mb-3">
              FAIZI <span style={{ color: "var(--primary-gold)" }}>KIDS</span>
            </h3>
            <p className="footer-desc">
              Crafting dreams into reality. We specialize in premium, safe, and
              magical furniture for your little ones.
            </p>
            <div className="footer-socials">
              <a
                href="https://www.facebook.com/share/1BtLYQaYU1/"
                target="_blank"
                rel="noreferrer"
                className="social-icon"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://www.instagram.com/s.s_kidsfurniture?igsh=MTZpc29sbGJleDJqMA=="
                target="_blank"
                rel="noreferrer"
                className="social-icon"
              >
                <FaInstagram />
              </a>
              <a
                href="https://wa.me/923240407989"
                target="_blank"
                rel="noreferrer"
                className="social-icon"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div className="col-lg-2 col-md-3 col-6">
            <h5 className="text-white mb-4 fw-bold">Shop</h5>
            <ul className="list-unstyled footer-links">
              <li>
                <span onClick={() => onCategoryClick("Car Beds")}>
                  Car Beds
                </span>
              </li>
              <li>
                <span onClick={() => onCategoryClick("Bunker Beds")}>
                  Bunker Beds
                </span>
              </li>
              <li>
                <span onClick={() => onCategoryClick("Baby Cots")}>
                  Baby Cots
                </span>
              </li>
              <li>
                <span onClick={() => onCategoryClick("New Arrivals")}>
                  New Arrivals
                </span>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="col-lg-2 col-md-3 col-6">
            <h5 className="text-white mb-4 fw-bold">Support</h5>
            <ul className="list-unstyled footer-links">
              <li>
                <span onClick={onTrackClick}>Track Order</span>
              </li>
              <li>
                <span onClick={() => openPolicy("shipping")}>
                  Shipping Policy
                </span>
              </li>
              <li>
                <span onClick={() => openPolicy("returns")}>
                  Returns & Exchange
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-lg-4 col-md-6">
            <h5 className="text-white mb-4 fw-bold">Stay Connected</h5>
            <p className="text-main small mb-3">
              Subscribe for exclusive offers.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="newsletter-form position-relative"
            >
              <input
                type="email"
                placeholder="Your Email..."
                className="form-control rounded-pill py-3 px-4"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "white",
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button className="btn-circle-gold position-absolute top-50 end-0 translate-middle-y me-2">
                {subscribed ? <FaCheck /> : <FaArrowRight />}
              </button>
            </form>
            {subscribed && (
              <small className="text-main mt-2 d-block fade-in">
                Thanks for subscribing!
              </small>
            )}
          </div>
        </div>

        {/* SECTION 2: CONTACT & MAP WIDGET (Strictly Inside Container) */}
        <div className="row">
          <div className="col-12">
            <div className="contact-widget-card">
              {/* Left Side: Info */}
              <div className="contact-info-side">
                <h4 className="text-white mb-4">Visit Our Store</h4>

                <a href="tel:+923240407989" className="contact-row mb-4">
                  <div className="icon-box-gold">
                    <FaPhoneAlt />
                  </div>
                  <div>
                    <small className="text-white d-block">Call Us</small>
                    <span className="text-white fw-bold fs-5">
                      +92 324 0407989
                    </span>
                  </div>
                </a>

                <div className="contact-row">
                  <div className="icon-box-gold">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <small className="text-white d-block">Location</small>
                    <span className="text-white small">
                      Shadipura Band Road, Daroghawala,
                      <br /> Lahore, Pakistan.
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: Map */}
              <div className="map-side">
                <iframe
                  title="Faizi Kids Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3398.923838356958!2d74.4011!3d31.5746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919106096053303%3A0x6e949988220807b1!2sDaroghawala%2C%20Lahore!5e0!3m2!1sen!2s!4v1640000000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM BAR --- */}
      <div className="footer-bottom mt-5">
        <div className="container d-flex justify-content-between align-items-center">
          <p className="mb-0 small text-main">
            © 2025 Faizi Kids Furniture. All Rights Reserved.
          </p>
          <button className="footer-admin-btn" onClick={onAdminLogin}>
            <FaUserShield /> Admin
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
