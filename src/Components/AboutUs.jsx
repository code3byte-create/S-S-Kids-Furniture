import React, { useEffect } from "react";
import {CEO} from '../assets/index.js'
import {
  FaArrowLeft,
  FaQuoteLeft,
  FaLeaf,
  FaShieldAlt,
  FaTools,
  FaHeart,
} from "react-icons/fa";

const AboutUs = ({ onBack, onShopNow }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page-wrapper fade-in">
      {/* 1. CINEMATIC HERO */}
      <section className="about-hero-fullscreen">
        <div className="hero-overlay"></div>

        {/* Navigation Top Left */}
        <button className="btn-back-absolute" onClick={onBack}>
          <FaArrowLeft className="me-2" /> Back Home
        </button>

        <div className="container position-relative z-2 text-center text-white h-100 d-flex flex-column justify-content-center align-items-center">
          <span className="hero-subtitle fade-up">ESTABLISHED 2015</span>
          <h1 className="display-1 brand-font fw-bold mb-4 fade-up-delay text-shadow">
            The Faizi Legacy
          </h1>
          <p className="hero-desc fade-up-delay-2">
            We don't build furniture. We build the stages for your children's
            childhood memories.
          </p>
        </div>
      </section>

      {/* 2. STATS STRIP (Black Bar) */}
      <section className="stats-strip bg-dark text-white py-5">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-4 border-end border-secondary">
              <h2 className="fw-bold text-gold display-5">5k+</h2>
              <small className="text-uppercase ls-2">Happy Families</small>
            </div>
            <div className="col-4 border-end border-secondary">
              <h2 className="fw-bold text-gold display-5">50+</h2>
              <small className="text-uppercase ls-2">Design Awards</small>
            </div>
            <div className="col-4">
              <h2 className="fw-bold text-gold display-5">100%</h2>
              <small className="text-uppercase ls-2">Safe Materials</small>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CEO MESSAGE */}
      <section className="py-5 my-5 container">
        <div className="row align-items-center">
          <div className="col-lg-5 mb-4 mb-lg-0">
            <div className="ceo-img-box">
              <img
                src={CEO}
                alt="CEO"
                className="img-fluid rounded-3"
              />
              <div className="border-frame"></div>
            </div>
          </div>
          <div className="col-lg-7 ps-lg-5">
            <FaQuoteLeft className="display-4 text-gold mb-3 opacity-25" />
            <h3 className="brand-font fst-italic mb-4">
              "I started this company when I couldn't find a safe, stylish bed
              for my own son. Today, we treat every piece of furniture as if
              it's going into our own home."
            </h3>
            <div>
              <h5 className="fw-bold mb-0 text-dark">Faiz Ul Hassan</h5>
              <span className="text-muted small text-uppercase ls-2">
                Founder & CEO
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR VALUES */}
      <section className="bg-main py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="text-gold fw-bold text-uppercase small">
              Why We Do It
            </span>
            <h2 className="brand-font fw-bold">Our Core Values</h2>
          </div>

          <div className="row g-4">
            {[
              {
                icon: <FaLeaf />,
                title: "Eco-Friendly",
                desc: "Sustainably sourced wood.",
              },
              {
                icon: <FaShieldAlt />,
                title: "Child Safe",
                desc: "Non-toxic paints & rounded edges.",
              },
              {
                icon: <FaHeart />,
                title: "Made with Love",
                desc: "Handcrafted details in every piece.",
              },
              {
                icon: <FaTools />,
                title: "Built to Last",
                desc: "Durability that lasts generations.",
              },
            ].map((val, i) => (
              <div className="col-md-3 col-sm-6" key={i}>
                <div className="value-card-premium h-100">
                  <div className="icon-circle">{val.icon}</div>
                  <h5 className="mt-3 fw-bold">{val.title}</h5>
                  <p className="text-main small mb-0">{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA BOTTOM */}
      <section className="cta-section py-5 text-center">
        <div className="container">
          <h2 className="text-white brand-font mb-4">
            Ready to transform their room?
          </h2>
          <button
            className="btn btn-gold-solid btn-lg rounded-pill px-5"
            onClick={onShopNow}
          >
            View Collection
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
