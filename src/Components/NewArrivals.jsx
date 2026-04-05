import React, { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const NewArrivals = ({ products, openModal, addToCart }) => {
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
    <section id="new-arrivals" className="container py-5">
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <span style={{ color: "var(--primary-gold)" }} className="fw-bold small">
            JUST LANDED
          </span>
          <h2 className="fw-bold brand-font" style={{ color: "var(--text-main)" }}>
            New Arrivals
          </h2>
        </div>
      </div>

      <div className="slider-wrapper">
        <button className="slider-btn left" onClick={() => scrollSlider("left")}>
          <FaChevronLeft />
        </button>
        
        <div className="slider-container" ref={sliderRef}>
          {products.slice(0, 8).map((product) => (
            <div key={product.id} className="product-slider-card">
              <div className="premium-card h-100">
                <div className="card-img-wrapper" onClick={() => openModal(product)}>
                  <img src={product.img} className="card-img-top" alt={product.name} />
                  <span className="category-badge">{product.category}</span>
                </div>
                <div className="card-content p-3">
                  <h5 className="card-title text-truncate" onClick={() => openModal(product)}>
                    {product.name}
                  </h5>
                  <div className="card-price fs-5">Rs. {product.price.toLocaleString()}</div>
                  <button onClick={() => addToCart(product)} className="btn btn-solid-gold w-100 mt-2">
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="slider-btn right" onClick={() => scrollSlider("right")}>
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
};

export default NewArrivals;