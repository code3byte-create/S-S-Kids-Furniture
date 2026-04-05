import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaShoppingCart,
  FaSearch,
  FaFilter,
  FaTimes,
} from "react-icons/fa";

const categoriesList = [
  "Car Beds",
  "Bunker Beds",
  "Single Beds",
  "Baby Cots",
  "Study Tables",
  "Wardrobes",
  "Accessories",
];

const ListingPage = ({
  category,
  products,
  onBack,
  openModal,
  addToCart,
  onCategoryChange,
}) => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedSubCat, setSelectedSubCat] = useState("All");

  // --- FIX: SCROLL ISSUE SOLVED HERE ---

  // 1. Sirf tab Upar jao aur Filters Reset karo jab CATEGORY badle
  useEffect(() => {
    setSelectedGender("All");
    setSelectedSubCat("All");
    window.scrollTo(0, 0);
  }, [category]); // <--- Yahan se 'products' hata diya taake scroll karte waqt refresh na ho

  // 2. Products ya Filters change hone par List Update karo (Lekin scroll mat chero)
  useEffect(() => {
    let result = products;

    if (selectedGender !== "All") {
      result = result.filter(
        (p) => p.gender === selectedGender || p.gender === "Unisex"
      );
    }
    if (selectedSubCat !== "All") {
      result = result.filter((p) => p.subCategory === selectedSubCat);
    }
    setFilteredProducts(result);
  }, [selectedGender, selectedSubCat, products]); // Yahan logic chalti rahegi

  // --- SUB-CATEGORIES EXTRACTION ---
  const subCategories = [
    "All",
    ...new Set(products.map((p) => p.subCategory).filter(Boolean)),
  ];
  const genders = ["All", "Boys", "Girls", "Unisex"];

  return (
    <section className="listing-page-container fade-in py-5">
      <div className="container">
        {/* Category Switcher */}
        <div className="category-quick-nav mb-4">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              className={`nav-pill-btn ${category === cat ? "active" : ""}`}
              onClick={() => onCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* HEADER */}
        <div className="listing-header text-center mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button onClick={onBack} className="btn-back-link">
              <FaArrowLeft className="me-2" /> Back Home
            </button>
            <span className="text-main small fw-bold">
              {filteredProducts.length} Results
            </span>
          </div>

          <h1 className="display-4 brand-font fw-bold text-main mb-2">
            {category} <span className="text-gold-gradient">Collection</span>
          </h1>
          <div className="title-underline mx-auto mb-4"></div>

          {/* --- FILTER LAYOUT --- */}
          <div className="premium-filter-container">
            {/* GENDER FILTER */}
            <div className="filter-group">
              <p className="filter-label">FILTER BY GENDER</p>
              <div className="d-flex justify-content-center flex-wrap gap-2">
                {genders.map((gen) => (
                  <button
                    key={gen}
                    className={`premium-filter-btn ${
                      selectedGender === gen ? "active" : ""
                    }`}
                    onClick={() => setSelectedGender(gen)}
                  >
                    {gen}
                  </button>
                ))}
              </div>
            </div>

            {subCategories.length > 1 && <div className="filter-divider"></div>}

            {/* SUB-CATEGORY FILTER */}
            {subCategories.length > 1 && (
              <div className="filter-group">
                <p className="filter-label">SELECT DESIGN / TYPE</p>
                <div className="d-flex justify-content-center flex-wrap gap-2">
                  {subCategories.map((sub) => (
                    <button
                      key={sub}
                      className={`premium-filter-btn small ${
                        selectedSubCat === sub ? "active" : ""
                      }`}
                      onClick={() => setSelectedSubCat(sub)}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="row g-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="col-lg-3 col-md-4 col-6">
                <div
                  className="premium-product-card h-100"
                  onClick={() => openModal(product)}
                >
                  <div className="card-img-box">
                    <img src={product.img} alt={product.name} />
                    <span
                      className={`premium-badge ${
                        product.gender ? product.gender.toLowerCase() : ""
                      }`}
                    >
                      {product.gender || category}
                    </span>
                  </div>
                  <div className="card-details">
                    <h5 className="product-title text-truncate">
                      {product.name}
                    </h5>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <span className="product-price">
                        Rs. {product.price.toLocaleString()}
                      </span>
                      <button
                        className="btn-add-mini"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                      >
                        <FaShoppingCart size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <div className="empty-state">
                <FaSearch size={40} className="text-muted mb-3" />
                <h3>No products found.</h3>
                <button
                  onClick={() => {
                    setSelectedGender("All");
                    setSelectedSubCat("All");
                  }}
                  className="btn btn-outline-dark mt-3 rounded-pill"
                >
                  Clear Filters <FaTimes className="ms-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ListingPage;
