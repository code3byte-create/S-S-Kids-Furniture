import React from "react";

const PromoBanner = ({ scrollToSection }) => {
  return (
    <section className="promo-banner">
      <div className="container promo-content">
        <span className="promo-tag">Ramadan Sale Live</span>
        <h2 className="promo-title brand-font">Dream Big, Pay Less!</h2>
        <p className="promo-desc">
          Upgrade your kid's room with our premium collection. <br className="d-none d-md-block" />
          Get flat <strong>15% OFF</strong> on all Bunk Beds & Car Beds.
        </p>
        <button
          className="btn btn-promo"
          onClick={() => scrollToSection("shop-categories")}
        >
          Shop Sale Now
        </button>
      </div>
    </section>
  );
};

export default PromoBanner;