import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  FaBox,
  FaChartLine,
  FaShoppingCart,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaEdit,
  FaTrash,
  FaPlus,
  FaPlusCircle,
  FaSearch,
  FaFilter,
  FaCheckCircle,
  FaChevronDown,
  FaImage,
  FaStar,
  FaUpload,
} from "react-icons/fa";

// Firebase imports
import { db } from "../../firebase";
import { doc, setDoc, collection, addDoc, deleteDoc } from "firebase/firestore";

const AdminPanel = ({
  products = [],
  orders = [],
  banners = [],
  setBanners,
  reviews = [],
  setReviews,
  onAddProduct,
  onDeleteProduct,
  onUpdateProduct,
  onUpdateOrderStatus,
  onLogout,
}) => {
  const MySwal = withReactContent(Swal);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // --- 1. MASTER DATA ---
  const categoryData = {
    "Bunk Beds": {
      hasSize: false,
      subCats: [
        "Simple Bunk Bed",
        "Car Hut Bunk Bed",
        "Pilor Design Bunk Bed",
        "Tap Design Bunk Bed",
      ],
    },
    "Single Beds": {
      hasSize: false,
      subCats: ["Simple Single Bed", "Cartoon Single Bed", "Draws Single Bed"],
    },
    "Car Beds": {
      hasSize: false,
      subCats: ["Single Car Bed", "Double Car Bed"],
    },
    Wardrobes: {
      hasSize: true,
      subCats: [
        "2 Full Door",
        "2 Doors 2 Draws",
        "2 Doors 3 Draws",
        "2 Full Doors",
        "3 Doors 2 Draws",
        "4 Doors",
      ],
    },
    "Baby Cots": { hasSize: true, subCats: ["Standard Design"] },
    "Study Tables": {
      hasSize: false,
      subCats: ["Single Study Table", "Double Study Table"],
    },
    Accessories: { hasSize: false, subCats: ["General"] },
  };

  // --- STATES ---
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  // Review State
  const [reviewForm, setReviewForm] = useState({
    name: "",
    city: "",
    text: "",
    rating: 5,
  });

  // Banner State
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerForm, setBannerForm] = useState({
    title: "",
    subtitle: "",
    img: "",
  });

  const [productForm, setProductForm] = useState({
    name: "",
    category: "Bunk Beds",
    subCategory: "",
    gender: "Unisex",
    size: "",
    price: "",
    description: "",
    img: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // --- AUTO-UPDATE SUB-CATEGORY ---
  useEffect(() => {
    if (!isEditing) {
      const firstSub = categoryData[productForm.category]?.subCats[0] || "";
      setProductForm((prev) => ({ ...prev, subCategory: firstSub }));
    }
  }, [productForm.category, isEditing]);

  // --- IMAGE UPLOAD FUNCTION ---
  const uploadImageToCloudinary = async (file) => {
    const cloudName = "dzvcqhk9x";
    const uploadPreset = "faizi_mughal";

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      const cloudData = await res.json();

      if (!res.ok) {
        console.error("Cloudinary Error Details:", cloudData);
        throw new Error(cloudData.error?.message || "Upload Failed");
      }

      return cloudData.secure_url;
    } catch (error) {
      console.error("Upload Error:", error);
      MySwal.fire("Upload Error", error.message, "error");
      return null;
    }
  };

  // --- REVIEW HANDLERS ---
  const handleAddReview = async (e) => {
    e.preventDefault();

    if (!reviewForm.name || !reviewForm.text) {
      return MySwal.fire("Error", "Please fill name and review text", "error");
    }

    try {
      // FIX: Saving both fields (text/comment & city/location) to be safe
      const newReviewData = {
        ...reviewForm,
        comment: reviewForm.text, // Save as comment too
        location: reviewForm.city, // Save as location too
      };

      const docRef = await addDoc(collection(db, "reviews"), newReviewData);

      const newReview = { ...newReviewData, id: docRef.id };
      if (setReviews) setReviews([...reviews, newReview]);

      MySwal.fire("Success", "Review Added Successfully!", "success");
      setReviewForm({ name: "", city: "", text: "", rating: 5 });
    } catch (error) {
      console.error("Error adding review:", error);
      MySwal.fire("Error", "Failed to add review", "error");
    }
  };

  const handleDeleteReview = async (id) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "Delete this review?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d43f3a",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc(doc(db, "reviews", id));
          if (setReviews) setReviews(reviews.filter((r) => r.id !== id));
          MySwal.fire("Deleted!", "Review has been removed.", "success");
        } catch (error) {
          MySwal.fire("Error", "Failed to delete review", "error");
        }
      }
    });
  };

  // --- BANNER HANDLER ---
  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    let finalImg = banners && banners.length > 0 ? banners[0].img : "";

    if (bannerFile) {
      const url = await uploadImageToCloudinary(bannerFile);
      if (url) {
        finalImg = url;
      } else {
        setIsUploading(false);
        return;
      }
    }

    const newBannerData = { ...bannerForm, img: finalImg, id: 1 };

    try {
      await setDoc(doc(db, "settings", "heroBanner"), newBannerData);

      if (setBanners) {
        setBanners([newBannerData]);
        MySwal.fire("Success", "Banner Saved to Database!", "success");
        setBannerFile(null);
      }
    } catch (error) {
      console.error("Database Error:", error);
      MySwal.fire("Error", "Could not save to database", "error");
    }

    setIsUploading(false);
  };

  // --- PRODUCT HANDLERS ---
  const handleEditClick = (product) => {
    setIsEditing(true);
    setCurrentId(product.id);
    setProductForm({
      name: product.name,
      category: product.category || "Bunk Beds",
      subCategory: product.subCategory || "",
      gender: product.gender || "Unisex",
      size: product.size || "",
      price: product.price,
      description: product.description || "",
      img: product.img,
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setProductForm({
      name: "",
      category: "Bunk Beds",
      subCategory: "",
      gender: "Unisex",
      size: "",
      price: "",
      description: "",
      img: "",
    });
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price)
      return MySwal.fire("Error", "Please fill name and price", "error");

    setIsUploading(true);
    let finalImage = productForm.img;

    if (imageFile) {
      const uploadedUrl = await uploadImageToCloudinary(imageFile);
      if (uploadedUrl) {
        finalImage = uploadedUrl;
      } else {
        setIsUploading(false);
        return;
      }
    }

    const productData = { ...productForm, img: finalImage };

    if (isEditing) {
      onUpdateProduct({ ...productData, id: currentId });
      MySwal.fire({
        icon: "success",
        title: "Updated!",
        text: "Product details updated.",
        confirmButtonColor: "#d4a017",
      });
    } else {
      onAddProduct({ ...productData, id: Date.now().toString() });
      MySwal.fire({
        icon: "success",
        title: "Added!",
        text: "New product added to inventory.",
        confirmButtonColor: "#d4a017",
      });
    }
    setIsUploading(false);
    resetForm();
  };

  const handleDeleteClick = (productId) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d43f3a",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        onDeleteProduct(productId);
        MySwal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Product has been deleted.",
          confirmButtonColor: "#d4a017",
        });
      }
    });
  };

  const handleLogoutClick = () => {
    MySwal.fire({
      title: "Logout?",
      text: "Are you sure you want to log out?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d4a017",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        onLogout();
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
        Toast.fire({ icon: "success", title: "Logged out successfully" });
      }
    });
  };

  // --- HELPERS ---
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-warning text-dark";
      case "Shipped":
        return "bg-info text-white";
      case "Delivered":
        return "bg-success text-white";
      case "Cancelled":
        return "bg-danger text-white";
      default:
        return "bg-secondary text-white";
    }
  };

  const filteredProducts =
    products?.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }) || [];

  const uniqueCustomers =
    Array.from(new Set(orders?.map((o) => o.email))).map((email) =>
      orders.find((o) => o.email === email)
    ) || [];

  return (
    <div className="admin-layout fade-in">
      {/* MOBILE HEADER */}
      <div className="admin-mobile-header d-lg-none">
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn-icon-light"
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars size={22} />
          </button>
          <h5 className="mb-0 text-white brand-font">Faizi Admin</h5>
        </div>
      </div>

      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${isSidebarOpen ? "show" : ""}`}>
        <div className="sidebar-logo">
          Faizi <span>Admin</span>
          <button
            className="d-lg-none btn-close-white"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes />
          </button>
        </div>
        <ul className="sidebar-menu">
          <li
            className={`menu-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("dashboard");
              setSidebarOpen(false);
            }}
          >
            <FaChartLine /> <span className="menu-text">Dashboard</span>
          </li>
          <li
            className={`menu-item ${activeTab === "products" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("products");
              setSidebarOpen(false);
            }}
          >
            <FaBox /> <span className="menu-text">Inventory</span>
          </li>
          <li
            className={`menu-item ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("orders");
              setSidebarOpen(false);
            }}
          >
            <FaShoppingCart /> <span className="menu-text">Orders</span>
          </li>
          <li
            className={`menu-item ${activeTab === "customers" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("customers");
              setSidebarOpen(false);
            }}
          >
            <FaUsers /> <span className="menu-text">Customers</span>
          </li>
          <li
            className={`menu-item ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("reviews");
              setSidebarOpen(false);
            }}
          >
            <FaStar /> <span className="menu-text">Reviews</span>
          </li>
          <li
            className={`menu-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("settings");
              setSidebarOpen(false);
            }}
          >
            <FaCog /> <span className="menu-text">Settings</span>
          </li>
        </ul>
        <div style={{ marginTop: "auto" }}>
          <li className="menu-item logout-btn" onClick={handleLogoutClick}>
            <FaSignOutAlt /> <span className="menu-text">Logout</span>
          </li>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-content">
        <header className="admin-header">
          <div className="admin-title">
            <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            <p className="text-muted">Overview of your store performance</p>
          </div>
          <div className="user-profile">
            <div className="avatar-circle">A</div>
          </div>
        </header>

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="view-container">
            <div className="stats-grid">
              <div className="stat-card blue">
                <div className="stat-icon">
                  <FaChartLine />
                </div>
                <div>
                  <p>Total Revenue</p>
                  <h3>
                    Rs.{" "}
                    {orders
                      ?.reduce((acc, o) => acc + o.totalAmount, 0)
                      .toLocaleString()}
                  </h3>
                </div>
              </div>
              <div className="stat-card orange">
                <div className="stat-icon">
                  <FaShoppingCart />
                </div>
                <div>
                  <p>Total Orders</p>
                  <h3>{orders?.length || 0}</h3>
                </div>
              </div>
              <div className="stat-card green">
                <div className="stat-icon">
                  <FaBox />
                </div>
                <div>
                  <p>Total Products</p>
                  <h3>{products?.length || 0}</h3>
                </div>
              </div>
              <div className="stat-card purple">
                <div className="stat-icon">
                  <FaUsers />
                </div>
                <div>
                  <p>Customers</p>
                  <h3>{uniqueCustomers?.length || 0}</h3>
                </div>
              </div>
            </div>
            <div className="form-card">
              <h4>Recent Orders</h4>
              {orders && orders.length > 0 ? (
                orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="recent-order-row">
                    <div>
                      <strong>{order.customerName}</strong>
                      <span className="d-block text-muted small">
                        {order.date}
                      </span>
                    </div>
                    <div className="text-end">
                      <span className="d-block fw-bold text-primary">
                        Rs. {order.totalAmount}
                      </span>
                      <span className={`badge ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">No orders yet.</p>
              )}
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {activeTab === "products" && (
          <div className="view-container">
            <div className="form-card">
              <h4
                className="mb-4 d-flex align-items-center gap-2"
                style={{ color: "#0F172A", fontWeight: "700" }}
              >
                {isEditing ? (
                  <FaEdit className="text-gold" />
                ) : (
                  <FaPlusCircle className="text-gold" />
                )}
                {isEditing ? "Edit Product Details" : "Add New Inventory Item"}
              </h4>
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label">Product Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Ferrari Car Bed"
                      value={productForm.name}
                      onChange={(e) =>
                        setProductForm({ ...productForm, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Price (PKR)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="0"
                      value={productForm.price}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          price:
                            e.target.value === ""
                              ? ""
                              : parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Category</label>
                    <div className="select-wrapper">
                      <select
                        className="form-input custom-select"
                        value={productForm.category}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            category: e.target.value,
                          })
                        }
                      >
                        {Object.keys(categoryData).map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <FaChevronDown className="select-arrow" />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Sub-Category</label>
                    <div className="select-wrapper">
                      <select
                        className="form-input custom-select"
                        value={productForm.subCategory}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            subCategory: e.target.value,
                          })
                        }
                      >
                        {categoryData[productForm.category]?.subCats?.map(
                          (sub) => (
                            <option key={sub} value={sub}>
                              {sub}
                            </option>
                          )
                        )}
                      </select>
                      <FaChevronDown className="select-arrow" />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Gender</label>
                    <div className="select-wrapper">
                      <select
                        className="form-input custom-select"
                        value={productForm.gender}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            gender: e.target.value,
                          })
                        }
                      >
                        <option value="Unisex">Unisex (Both)</option>
                        <option value="Boys">Boys</option>
                        <option value="Girls">Girls</option>
                      </select>
                      <FaChevronDown className="select-arrow" />
                    </div>
                  </div>
                  {categoryData[productForm.category]?.hasSize && (
                    <div className="col-12">
                      <label className="form-label">Size Option</label>
                      <div className="select-wrapper">
                        <select
                          className="form-input custom-select"
                          value={productForm.size}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              size: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Size (Optional)</option>
                          <option value="Small">Small</option>
                          <option value="Large">Large</option>
                        </select>
                        <FaChevronDown className="select-arrow" />
                      </div>
                    </div>
                  )}
                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-input"
                      rows="4"
                      placeholder="Product details..."
                      value={productForm.description}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          description: e.target.value,
                        })
                      }
                      style={{ resize: "none" }}
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Product Image</label>
                    <input
                      type="file"
                      className="form-input"
                      style={{ padding: "8px" }}
                      onChange={(e) => setImageFile(e.target.files[0])}
                    />
                  </div>
                  <div className="col-12 mt-4">
                    <button
                      disabled={isUploading}
                      className="btn-gold-admin w-100 py-3 text-uppercase"
                      style={{
                        fontSize: "1.1rem",
                        opacity: isUploading ? 0.7 : 1,
                      }}
                    >
                      {isUploading ? (
                        "Uploading Image..."
                      ) : isEditing ? (
                        <>
                          <FaCheckCircle /> Update Product
                        </>
                      ) : (
                        <>
                          <FaPlus /> Add to Inventory
                        </>
                      )}
                    </button>
                    {isEditing && (
                      <div className="text-center mt-3">
                        <button
                          type="button"
                          className="btn-cancel-admin"
                          onClick={resetForm}
                        >
                          Cancel & Reset
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
            <div className="toolbar">
              <div className="search-bar-wrapper">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="d-flex align-items-center gap-2">
                <FaFilter style={{ color: "#d4a017" }} />
                <div className="select-wrapper" style={{ minWidth: "180px" }}>
                  <select
                    className="form-input custom-select w-auto"
                    style={{ width: "100%" }}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="All">Filter: All Items</option>
                    {Object.keys(categoryData).map((cat) => (
                      <option key={cat}>{cat}</option>
                    ))}
                  </select>
                  <FaChevronDown className="select-arrow" />
                </div>
              </div>
            </div>
            <div className="product-grid-admin">
              {filteredProducts?.map((product) => (
                <div className="admin-product-card" key={product.id}>
                  <div className="img-container">
                    {product.img ? (
                      <img src={product.img} alt={product.name} />
                    ) : (
                      <FaImage className="text-muted fs-1" />
                    )}
                  </div>
                  <div className="admin-prod-details">
                    <h5>{product.name}</h5>
                    <p>Rs. {product.price}</p>
                    <div className="d-flex gap-1 flex-wrap mb-2">
                      <small className="product-badge">
                        {product.category}
                      </small>
                      {product.subCategory && (
                        <small className="product-badge">
                          {product.subCategory}
                        </small>
                      )}
                    </div>
                    <div className="admin-actions">
                      <button
                        className="btn-action-sm btn-edit"
                        onClick={() => handleEditClick(product)}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        className="btn-action-sm btn-delete"
                        onClick={() => handleDeleteClick(product.id)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredProducts?.length === 0 && (
                <div className="text-center w-100 p-5">
                  <p className="text-muted">
                    No products found matching your search.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ORDERS */}
        {activeTab === "orders" && (
          <div className="view-container">
            <div className="form-card">
              <h4 className="mb-4">Order Management</h4>
              {orders?.length === 0 ? (
                <p className="text-center text-muted">
                  No orders received yet.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders?.map((order) => (
                        <tr key={order.id}>
                          <td>
                            <small className="text-muted">
                              {order.orderId}
                            </small>
                          </td>
                          <td>
                            <strong>{order.customerName}</strong>
                            <br />
                            <small className="text-muted">{order.city}</small>
                          </td>
                          <td>
                            <small>{order.items.length} items</small>
                          </td>
                          <td className="fw-bold text-primary">
                            Rs. {order.totalAmount}
                          </td>
                          <td>
                            <span
                              className={`badge ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <select
                              className="form-select form-select-sm"
                              value={order.status}
                              onChange={(e) =>
                                onUpdateOrderStatus(order.id, e.target.value)
                              }
                            >
                              <option value="Pending">Pending</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CUSTOMERS */}
        {activeTab === "customers" && (
          <div className="view-container">
            <div className="form-card">
              <h4 className="mb-4">Customer Database</h4>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>City</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uniqueCustomers?.map((cust, index) => (
                      <tr key={index}>
                        <td className="fw-bold">{cust?.customerName}</td>
                        <td>{cust?.email || "N/A"}</td>
                        <td>{cust?.phone}</td>
                        <td>{cust?.city}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* REVIEWS */}
        {activeTab === "reviews" && (
          <div className="view-container">
            <div className="form-card mb-4">
              <h4 className="mb-4 text-gold">Add New Review</h4>
              <form onSubmit={handleAddReview}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input
                      className="form-input"
                      placeholder="Parent Name (e.g. Ali Khan)"
                      value={reviewForm.name}
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      className="form-input"
                      placeholder="City (e.g. Lahore)"
                      value={reviewForm.city}
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, city: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-12">
                    <textarea
                      className="form-input"
                      rows="3"
                      placeholder="What did they say?"
                      value={reviewForm.text}
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, text: e.target.value })
                      }
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <select
                      className="form-input"
                      value={reviewForm.rating}
                      onChange={(e) =>
                        setReviewForm({
                          ...reviewForm,
                          rating: parseInt(e.target.value),
                        })
                      }
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                      <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                      <option value="3">⭐⭐⭐ (3 Stars)</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <button className="btn-gold-admin w-100">Add Review</button>
                  </div>
                </div>
              </form>
            </div>

            {/* FIX: Using OR (||) logic to show data correctly */}
            <div className="review-grid">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="review-card-admin p-3 border rounded mb-3 bg-white"
                >
                  <div className="d-flex justify-content-between">
                    <div>
                      {/* FIX: Shows city OR location */}
                      <strong>{rev.name}</strong>{" "}
                      <small className="text-muted">
                        ({rev.city || rev.location})
                      </small>
                      <div className="text-warning">
                        {"★".repeat(rev.rating)}
                      </div>
                    </div>
                    <button
                      className="btn btn-sm btn-danger h-50"
                      onClick={() => handleDeleteReview(rev.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                  {/* FIX: Shows text OR comment */}
                  <p className="mt-2 text-muted small">
                    "{rev.text || rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === "settings" && (
          <div className="view-container">
            <div className="form-card" style={{ maxWidth: "800px" }}>
              <h4 className="mb-4 text-gold">
                <FaImage className="me-2" /> Hero Banner Settings
              </h4>
              <form onSubmit={handleBannerSubmit}>
                <div className="row g-4">
                  <div className="col-12">
                    <label className="form-label">
                      Main Title (Bari Heading)
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Make Their Dreams Come Alive"
                      value={bannerForm.title}
                      onChange={(e) =>
                        setBannerForm({ ...bannerForm, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Subtitle (Choti Line)</label>
                    <textarea
                      className="form-input"
                      rows="2"
                      placeholder="e.g. Luxury comfort designed for little royals..."
                      value={bannerForm.subtitle}
                      onChange={(e) =>
                        setBannerForm({
                          ...bannerForm,
                          subtitle: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">
                      Banner Image (Nayi Tasweer)
                    </label>
                    <input
                      type="file"
                      className="form-input"
                      style={{ padding: "10px" }}
                      onChange={(e) => setBannerFile(e.target.files[0])}
                    />
                  </div>
                  {banners.length > 0 && (
                    <div className="col-12 mt-2">
                      <label className="form-label text-muted">
                        Abhi ye tasweer lagi hui hai:
                      </label>
                      <div
                        style={{
                          border: "2px solid #d4a017",
                          borderRadius: "10px",
                          overflow: "hidden",
                        }}
                      >
                        {banners[0].img ? (
                          <img
                            src={banners[0].img}
                            alt="Current Banner"
                            style={{
                              width: "100%",
                              height: "200px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <p className="text-center p-3">No Image</p>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="col-12">
                    <button
                      disabled={isUploading}
                      className="btn-gold-admin w-100 py-3"
                    >
                      {isUploading ? (
                        "Uploading..."
                      ) : (
                        <>
                          <FaUpload className="me-2" /> Update Website Banner
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminPanel;
