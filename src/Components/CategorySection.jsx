import React, { useRef } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight,
  FaCar,
  FaBed,
  FaBaby,
  FaChair,
  FaCheckCircle,
  FaDoorClosed, // Wardrobe ke liye Icon
} from "react-icons/fa";

const CategorySection = ({
  activeCategory,
  handleCategoryClick,
  products,
  openModal,
  addToCart,
  onViewAll,
}) => {
  const categorySliderRef = useRef(null); // Ref for scrolling
  const previewSliderRef = useRef(null);

  // Scroll Function
  const scrollSlider = (ref, direction) => {
    if (ref.current)
      ref.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
  };

  // --- UPDATED CATEGORIES LIST ---
  // Storage hata dia, Single Beds aur Wardrobes add kia
  const categories = [
    { name: "Car Beds", icon: <FaCar />, key: "Car Beds" },
    { name: "Bunker Beds", icon: <FaBed />, key: "Bunker Beds" },
    { name: "Baby Cots", icon: <FaBaby />, key: "Baby Cots" },
    { name: "Study Tables", icon: <FaChair />, key: "Study Tables" },
    { name: "Single Beds", icon: <FaBed />, key: "Single Beds" }, // NEW
    { name: "Wardrobes", icon: <FaDoorClosed />, key: "Wardrobes" }, // NEW
  ];

  return (
    <section
      id="shop-categories"
      className="py-5"
      style={{ minHeight: "600px" }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-4">
          <span
            style={{ color: "var(--primary-gold)", letterSpacing: "2px" }}
            className="fw-bold text-uppercase small"
          >
            Browse Collection
          </span>
          <h2
            className="fw-bold brand-font display-5 mt-2"
            style={{ color: "var(--text-main)" }}
          >
            Our Categories
          </h2>
        </div>

        {/* --- CATEGORIES SLIDER (Mobile Fix Logic Applied Here) --- */}
        <div className="slider-wrapper mb-5 position-relative">
          {/* Left Arrow (Desktop Only) */}
          <button
            className="slider-btn left d-none d-md-flex"
            onClick={() => scrollSlider(categorySliderRef, "left")}
          >
            <FaChevronLeft />
          </button>

          {/* Slider Container with 'category-scroll-container' class */}
          <div
            className="category-scroll-container" // <--- YE CLASS CSS SE CONNECTED HAI
            ref={categorySliderRef}
          >
            {categories.map((cat, index) => (
              <div
                key={index}
                className={`category-card ${
                  activeCategory === cat.key ? "active" : ""
                }`}
                onClick={() => handleCategoryClick(cat.key)}
              >
                <div className="category-icon">{cat.icon}</div>
                <h6 className="category-title">{cat.name}</h6>
              </div>
            ))}
          </div>

          {/* Right Arrow (Desktop Only) */}
          <button
            className="slider-btn right d-none d-md-flex"
            onClick={() => scrollSlider(categorySliderRef, "right")}
          >
            <FaChevronRight />
          </button>
        </div>

        <hr style={{ opacity: 0.1, margin: "0 0 30px 0" }} />

        {/* Selected Category Products Header */}
        <div className="section-header-premium d-flex align-items-center justify-content-between">
          <div className="header-content">
            <span className="header-subtitle">Showing Results For</span>
            <h3 className="brand-font">{activeCategory}</h3>
          </div>
          <button onClick={onViewAll} className="btn-view-premium-outline">
            View All {activeCategory} <FaArrowRight />
          </button>
        </div>

        {/* --- PRODUCTS PREVIEW SLIDER (No Changes Here) --- */}
        <div className="slider-wrapper">
          <button
            className="slider-btn left"
            onClick={() => scrollSlider(previewSliderRef, "left")}
          >
            <FaChevronLeft />
          </button>

          <div className="slider-container" ref={previewSliderRef}>
            {products.slice(0, 8).map((product) => (
              <div key={product.id} className="product-slider-card">
                <div className="premium-card h-100">
                  <div
                    className="card-img-wrapper"
                    onClick={() => openModal(product)}
                  >
                    <img
                      src={product.img}
                      className="card-img-top"
                      alt={product.name}
                    />
                    <span className="category-badge">{product.category}</span>
                  </div>
                  <div className="card-content p-3">
                    <h5
                      className="card-title text-truncate"
                      onClick={() => openModal(product)}
                    >
                      {product.name}
                    </h5>
                    <div className="card-price fs-5">
                      Rs. {product.price.toLocaleString()}
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="btn btn-solid-gold w-100 mt-2"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="slider-btn right"
            onClick={() => scrollSlider(previewSliderRef, "right")}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
