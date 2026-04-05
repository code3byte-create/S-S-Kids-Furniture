import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { TapBunkBed } from "../assets/index"; // Path adjust karlen

const Hero = ({ scrollToSection, bannerData }) => {
  // Logic: Agar admin ka data hai to wo use karo, warna default BunkBed use karo
  const title = bannerData?.title || "Make Their Dreams Come Alive.";
  const subtitle =
    bannerData?.subtitle || "Luxury comfort designed for the little royals.";
  const image = bannerData?.img || TapBunkBed;

  return (
    <section id="home" className="hero-wrapper container">
      <div className="hero-blob"></div>
      <div className="row align-items-center">
        <div className="col-lg-6 text-center text-lg-start z-1">
          <span
            className="text-uppercase fw-bold ls-2"
            style={{ color: "var(--primary-gold)", letterSpacing: "2px" }}
          >
            Premium Kids Furniture
          </span>
          <h1
            className="display-3 fw-bold my-3 brand-font"
            style={{ color: "var(--text-main)" }}
          >
            {title}
          </h1>
          <p className="lead mb-5" style={{ color: "var(--text-muted)" }}>
            {subtitle}
          </p>
          <button
            className=" btn-premium"
            onClick={() => scrollToSection("shop-categories")}
          >
            Start Browsing <FaArrowRight className="ms-2" />
          </button>
        </div>
        <div className="col-lg-6 mt-5 mt-lg-0 text-center z-1">
          <img
            src={image}
            alt="Luxury Room"
            className="img-fluid floating-image hero-img-real"
            style={{
              borderRadius: "20px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            }}
          />
        </div>
      </div>
    </section>
  );
};
export default Hero;
