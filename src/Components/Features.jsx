import React, { useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaShieldAlt, FaAward, FaTools, FaUndo } from "react-icons/fa";

const Features = () => {
  const sliderRef = useRef(null);

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="features-section py-5">
      <div className="container">
        <div className="text-center mb-5">
          <span style={{ color: "var(--primary-gold)", letterSpacing: "2px" }} className="fw-bold small text-uppercase">
            The Faizi Promise
          </span>
          <h2 className="brand-font fw-bold" style={{ color: "var(--text-main)" }}>
            Why Parents Trust Us
          </h2>
        </div>

        <div className="slider-wrapper">
          <button className="slider-btn left" onClick={() => scrollSlider("left")}>
            <FaChevronLeft />
          </button>
          
          <div className="slider-container" ref={sliderRef}>
            {/* Feature 1 */}
            <div className="feature-slider-card">
              <div className="feature-card h-100">
                <div className="feature-icon-box"><FaShieldAlt /></div>
                <h5 className="feature-title">Child Safe</h5>
                <p className="feature-desc">Non-toxic paints and rounded corners for safety.</p>
              </div>
            </div>
            {/* Feature 2 */}
            <div className="feature-slider-card">
              <div className="feature-card h-100">
                <div className="feature-icon-box"><FaAward /></div>
                <h5 className="feature-title">5-Year Warranty</h5>
                <p className="feature-desc">We stand by our quality with a solid guarantee.</p>
              </div>
            </div>
            {/* Feature 3 */}
            <div className="feature-slider-card">
              <div className="feature-card h-100">
                <div className="feature-icon-box"><FaTools /></div>
                <h5 className="feature-title">Free Assembly</h5>
                <p className="feature-desc">Expert installation at your doorstep, absolutely free.</p>
              </div>
            </div>
            {/* Feature 4 */}
            <div className="feature-slider-card">
              <div className="feature-card h-100">
                <div className="feature-icon-box"><FaUndo /></div>
                <h5 className="feature-title">Easy Returns</h5>
                <p className="feature-desc">7-day hassle-free return policy if not satisfied.</p>
              </div>
            </div>
          </div>

          <button className="slider-btn right" onClick={() => scrollSlider("right")}>
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;