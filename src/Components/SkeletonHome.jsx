import React from "react";
import "../App.css";

const SkeletonHome = () => {
  return (
    <div className="container py-4 fade-in">
      {/* 1. Navbar Placeholder */}
      <div className="d-flex justify-content-between mb-4 align-items-center">
        <div
          className="skeleton"
          style={{ width: "150px", height: "40px" }}
        ></div>
        <div className="d-none d-md-flex gap-3">
          <div
            className="skeleton"
            style={{ width: "80px", height: "20px" }}
          ></div>
          <div
            className="skeleton"
            style={{ width: "80px", height: "20px" }}
          ></div>
          <div
            className="skeleton"
            style={{ width: "80px", height: "20px" }}
          ></div>
        </div>
      </div>

      {/* 2. Hero Banner Skeleton */}
      <div className="skeleton sk-banner"></div>

      {/* 3. Category/Products Grid Skeleton */}
      <div className="row g-4 mt-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="col-md-3 col-6">
            {/* CHANGE HERE: bg-white hata kar sk-card-bg lagaya */}
            <div className="sk-card sk-card-bg">
              {/* Image Box */}
              <div className="skeleton sk-img"></div>
              {/* Text Lines */}
              <div className="skeleton sk-title"></div>
              <div className="skeleton sk-price"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonHome;
