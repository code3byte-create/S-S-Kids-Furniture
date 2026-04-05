import React from "react";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";
import { QueenSizeBunkBed } from "../assets/index";

const AboutSection = ({ onReadMore }) => {
  return (
    <section className="about-section-premium py-5 my-5">
      <div className="container">
        <div className="row align-items-center">
          {/* LEFT: LAYERED IMAGES */}
          <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
            <div className="blob-bg"></div> {/* Decorative Shape */}
            <div className="image-composition">
              <img
                src={QueenSizeBunkBed}
                alt="Furniture Crafting"
                className="img-fluid main-img shadow-lg"
              />
              <div className="glass-badge floating-anim">
                <span className="display-4 fw-bold text-gold">10+</span>
                <span className="small text-dark fw-bold d-block">
                  Years of Trust
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: CONTENT */}
          <div className="col-lg-6 ps-lg-5">
            <div className="about-badge-pill mb-3">Our Story</div>
            <h2 className="display-5 brand-font fw-bold mb-4">
              Where <span className="text-gold-gradient">Magic</span> Meets{" "}
              <br /> Master Craftsmanship.
            </h2>
            <p className="lead text-main mb-4">
              Faizi Kids isn't just a furniture store; it's a promise to
              parents. We build safe, non-toxic, and durable havens where your
              children dream big.
            </p>

            <div className="features-grid mb-5">
              <div className="feature-item">
                <FaCheckCircle className="text-gold me-2" />
                <span>100% Child Safe Materials</span>
              </div>
              <div className="feature-item">
                <FaCheckCircle className="text-gold me-2" />
                <span>Eco-Friendly Wood</span>
              </div>
              <div className="feature-item">
                <FaCheckCircle className="text-gold me-2" />
                <span>Custom Designs</span>
              </div>
            </div>

            <button
              className="btn btn-premium-outline rounded-pill px-4 py-2"
              onClick={onReadMore}
            >
              Read Our Full Story <FaArrowRight className="ms-2" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
