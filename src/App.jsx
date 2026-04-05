import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect, Suspense } from "react";
import { Toaster, toast } from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";
import "./App.css";

// 1. Firebase Imports
import { db } from "./firebase";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  limit,
} from "firebase/firestore";

// 2. Components Import
import Navbar from "./Components/Navbar";
import MobileMenu from "./Components/MobileMenu";
import CartSidebar from "./Components/CartSidebar";
import ProductModal from "./Components/ProductModal";
import Hero from "./Components/Hero";
import CategorySection from "./Components/CategorySection";
import PromoBanner from "./Components/PromoBanner";
import NewArrivals from "./Components/NewArrivals";
import Features from "./Components/Features";
import Testimonials from "./Components/Testimonials";
import ListingPage from "./Components/ListingPage";
import Footer from "./Components/Footer";
import PolicyModal from "./Components/PolicyModal";
import SkeletonHome from "./Components/SkeletonHome";
// Checkout aur OrderTracking yahan se remove kar diye hain kyunke neeche lazy load ho rahe hain
import AboutUs from "./Components/AboutUs";
import AboutSection from "./Components/AboutSection";
import OrderSuccessModal from "./Components/OrderSuccessModal";

// Icons
import { FaWhatsapp, FaArrowUp } from "react-icons/fa";

// --- 3. LAZY LOADING COMPONENTS ---
const AdminPanel = React.lazy(() => import("./Components/Admin/AdminPanel"));
const Login = React.lazy(() => import("./Components/Admin/Login"));
const Checkout = React.lazy(() => import("./Components/Checkout"));
const OrderTracking = React.lazy(() => import("./Components/OrderTracking"));

function App() {
  // --- STATE ---
  const [theme, setTheme] = useState("light");
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [banners, setBanners] = useState([
    {
      id: 1,
      title: "Make Their Dreams Come Alive.",
      subtitle: "Luxury comfort designed for the little royals.",
      img: "https://via.placeholder.com/1200x600",
    },
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Car Beds");

  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem("savedView") || "home";
  });

  useEffect(() => {
    localStorage.setItem("savedView", currentView);
    window.scrollTo(0, 0);
  }, [currentView]);

  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isAdminMode, setIsAdminMode] = useState(() => {
    return localStorage.getItem("isAdminMode") === "true";
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // --- NEW STATES ---
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastOrderId, setLastOrderId] = useState("");
  const [policyType, setPolicyType] = useState(null);
  const [hasNewOrder, setHasNewOrder] = useState(false);

  // --- 1. DATA FETCHING ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const productsCollection = collection(db, "products");
        const productSnapshot = await getDocs(productsCollection);
        const productsList = productSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      const reviewsCol = collection(db, "reviews");
      const revSnapshot = await getDocs(reviewsCol);
      setReviews(
        revSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };
    fetchReviews();
  }, []);

  // --- FETCH BANNER ---
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const docRef = doc(db, "settings", "heroBanner");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBanners([docSnap.data()]);
        }
      } catch (error) {
        console.error("Error fetching banner:", error);
      }
    };
    fetchBanner();
  }, []);

  const fetchData = async () => {
    const productsRef = collection(db, "products");
    // Sirf pehle 20 products mangwao speed ke liye
    const q = query(productsRef, limit(20));

    const snapshot = await getDocs(q);
    // ... baqi code same
  };

  // Helper Function
  const getOptimizedImg = (url) => {
    if (!url) return "https://via.placeholder.com/150";
    if (url.includes("cloudinary.com")) {
      return url.replace("/upload/", "/upload/f_auto,q_auto/");
    }
    return url;
  };

  // FIX 1: Removed the stray <img> tag that was causing syntax error here.

  // --- ADMIN HANDLERS ---
  const handleAddProduct = async (productData) => {
    try {
      setIsLoading(true);
      const productsCollection = collection(db, "products");
      const { id, imageFile, ...dataToSave } = productData;

      if (!dataToSave.img) {
        dataToSave.img = "https://via.placeholder.com/150";
      }

      const docRef = await addDoc(productsCollection, dataToSave);
      setProducts([{ ...dataToSave, id: docRef.id }, ...products]);
    } catch (error) {
      toast.error("Error adding product: " + error.message);
    }
    setIsLoading(false);
  };

  const handleUpdateProduct = async (productData) => {
    try {
      setIsLoading(true);
      const { imageFile, ...dataToUpdate } = productData;
      const productRef = doc(db, "products", dataToUpdate.id);
      await updateDoc(productRef, dataToUpdate);

      setProducts(
        products.map((p) => (p.id === dataToUpdate.id ? dataToUpdate : p))
      );
    } catch (error) {
      toast.error("Update Failed: " + error.message);
    }
    setIsLoading(false);
  };

  const handleDeleteProduct = async (id) => {
    try {
      setIsLoading(true);
      const productDoc = doc(db, "products", id);
      await deleteDoc(productDoc);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      toast.error("Error deleting: " + error.message);
    }
    setIsLoading(false);
  };

  // --- CUSTOMER: PLACE ORDER ---
  const handlePlaceOrder = async (userData) => {
    try {
      setIsLoading(true);
      const newOrderId = `ORD-${Date.now()}`;

      const orderData = {
        customerName: userData.name || "Unknown",
        email: userData.email || "N/A",
        phone: userData.phone || "",
        address: userData.address || "No Address",
        city: userData.city || "",
        postalCode: userData.postalCode || "",
        notes: userData.notes || "",
        items: cartItems,
        totalAmount: subtotal,
        status: "Pending",
        date: new Date().toLocaleString(),
        orderId: newOrderId,
      };

      const ordersCollection = collection(db, "orders");
      await addDoc(ordersCollection, orderData);

      setCartItems([]);
      setHasNewOrder(true);
      setLastOrderId(newOrderId);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Order Error:", error);
      toast.error("Order failed: " + error.message);
    }
    setIsLoading(false);
  };

  // --- THEME & UTILS ---
  useEffect(() => {
    const savedTheme = localStorage.getItem("site-theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowScrollBtn(true);
      } else {
        setShowScrollBtn(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // useEffect mein init karen
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation ki speed
      once: true, // Sirf ek baar chale
    });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("site-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const addToCart = (product, qty = 1) => {
    const existing = cartItems.find((item) => item.id === product.id);
    if (existing) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + qty } : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, qty: qty }]);
    }
    setIsCartOpen(true);
    setSelectedProduct(null);
  };

  const removeFromCart = (id) =>
    setCartItems(cartItems.filter((item) => item.id !== id));

  const updateQty = (id, type) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id) {
          const newQty =
            type === "inc" ? item.qty + 1 : item.qty > 1 ? item.qty - 1 : 1;
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const getFilteredProducts = () =>
    products.filter((p) => p.category === activeCategory);

  const handleCategoryClick = (key) => {
    setActiveCategory(key);
    setCurrentView("home");
  };

  const scrollToSection = (id) => {
    if (currentView !== "home") {
      setCurrentView("home");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // --- RENDER LOGIC ---

  if (isAdminMode) {
    return (
      <Suspense
        fallback={
          <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-gold"></div>
          </div>
        }
      >
        {!isAuthenticated ? (
          <Login
            onLogin={() => {
              setIsAuthenticated(true);
              localStorage.setItem("isAuthenticated", "true");
            }}
            onCancel={() => {
              setIsAdminMode(false);
              localStorage.removeItem("isAdminMode");
            }}
          />
        ) : (
          <AdminPanel
            products={products}
            banners={banners}
            setBanners={setBanners}
            reviews={reviews}
            setReviews={setReviews}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateProduct={handleUpdateProduct}
            onLogout={() => {
              setIsAdminMode(false);
              setIsAuthenticated(false);
              localStorage.removeItem("isAdminMode");
              localStorage.removeItem("isAuthenticated");
            }}
          />
        )}
      </Suspense>
    );
  }

  if (isLoading) {
    // Spinner hata diya, ab Skeleton ayega
    return <SkeletonHome />;
  }

  // --- FOOTER LOGIC ---
  const handleFooterCategoryClick = (category) => {
    if (currentView !== "home") {
      setCurrentView("home");
    }
    if (category === "New Arrivals") {
      setTimeout(() => scrollToSection("new-arrivals"), 100);
    } else {
      setActiveCategory(category);
      setTimeout(() => scrollToSection("shop-categories"), 100);
    }
  };

  const handleTrackClick = () => {
    setCurrentView("track-order");
    setHasNewOrder(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="App">
      <MobileMenu
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
        scrollToSection={scrollToSection}
        toggleTheme={toggleTheme}
        theme={theme}
      />

      <Navbar
        toggleTheme={toggleTheme}
        theme={theme}
        cartCount={cartItems.length}
        setIsCartOpen={setIsCartOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        scrollToSection={scrollToSection}
        onTrackClick={handleTrackClick}
        hasNewOrder={hasNewOrder}
        onHomeClick={() => setCurrentView("home")}
        onCartClick={() => setIsCartOpen(true)}
      />

      <CartSidebar
        isOpen={isCartOpen}
        setIsOpen={setIsCartOpen}
        cartItems={cartItems}
        updateQty={updateQty}
        removeFromCart={removeFromCart}
        subtotal={subtotal}
        onCheckout={() => {
          setIsCartOpen(false);
          setCurrentView("checkout");
          window.scrollTo(0, 0);
        }}
      />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          addToCart={addToCart}
        />
      )}

      {/* --- MAIN CONTENT --- */}
      {/* FIX 2: Wrapped Lazy Loaded Components in Suspense */}
      {currentView === "checkout" ? (
        <Suspense
          fallback={
            <div className="d-flex justify-content-center p-5">
              <div className="spinner-border text-gold"></div>
            </div>
          }
        >
          <Checkout
            cartItems={cartItems}
            subtotal={subtotal}
            onBack={() => setCurrentView("home")}
            onPlaceOrder={handlePlaceOrder}
          />
        </Suspense>
      ) : currentView === "track-order" ? (
        <Suspense
          fallback={
            <div className="d-flex justify-content-center p-5">
              <div className="spinner-border text-gold"></div>
            </div>
          }
        >
          <OrderTracking onBack={() => setCurrentView("home")} />
        </Suspense>
      ) : currentView === "about-us" ? (
        <AboutUs
          onBack={() => setCurrentView("home")}
          onShopNow={() => scrollToSection("shop-categories")}
        />
      ) : currentView === "listing" ? (
        <ListingPage
          category={activeCategory}
          products={getFilteredProducts()}
          onBack={() => setCurrentView("home")}
          openModal={setSelectedProduct}
          addToCart={addToCart}
          onCategoryChange={(newCat) => setActiveCategory(newCat)}
        />
      ) : (
        <>
          <Hero scrollToSection={scrollToSection} bannerData={banners[0]} />

          <CategorySection
            activeCategory={activeCategory}
            handleCategoryClick={handleCategoryClick}
            products={getFilteredProducts()}
            openModal={setSelectedProduct}
            addToCart={addToCart}
            onViewAll={() => setCurrentView("listing")}
          />
          <NewArrivals
            products={products}
            openModal={setSelectedProduct}
            addToCart={addToCart}
          />
          <PromoBanner scrollToSection={scrollToSection} />
          <div id="about-us">
            <AboutSection
              onReadMore={() => {
                setCurrentView("about-us");
                window.scrollTo(0, 0);
              }}
            />
          </div>
          <Features />
          <div className="fade-in">
            <Testimonials reviews={reviews} />
          </div>
        </>
      )}

      <Footer
        onCategoryClick={handleFooterCategoryClick}
        onTrackClick={handleTrackClick}
        openPolicy={(type) => setPolicyType(type)}
        onAdminLogin={() => {
          setIsAdminMode(true);
          localStorage.setItem("isAdminMode", "true");
        }}
      />

      <Toaster position="top-center" reverseOrder={false} />

      {policyType && (
        <PolicyModal type={policyType} onClose={() => setPolicyType(null)} />
      )}

      {showSuccessModal && (
        <OrderSuccessModal
          orderId={lastOrderId}
          onClose={() => {
            setShowSuccessModal(false);
            setCurrentView("home");
          }}
        />
      )}

      {/* --- FLOATING BUTTONS (WhatsApp) --- */}
      <div className="floating-buttons-container">
        {currentView !== "track-order" && (
          <a
            href="https://wa.me/923240407989"
            className="float-btn whatsapp-btn"
            target="_blank"
            rel="noopener noreferrer"
            title="Chat on WhatsApp"
          >
            <FaWhatsapp />
          </a>
        )}
      </div>

      {showScrollBtn && (
        <button
          className="scroll-top-btn"
          onClick={scrollToTop}
          title="Back to Top"
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
}

export default App;
