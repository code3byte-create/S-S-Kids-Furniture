import React, { useState } from "react";
import { FaStar, FaQuoteLeft, FaPlus, FaTimes } from "react-icons/fa";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

// FIX 1: Default array add kia taake code crash na ho
const Testimonials = ({ reviews = [] }) => {
  // Logic: Agar reviews hain to wo dikhao, warna default dummy data
  const displayReviews =
    reviews && reviews.length > 0
      ? reviews
      : [
          {
            id: 1,
            name: "Faiz",
            city: "Lahore",
            text: "Very Good!",
            rating: 5,
          },
          {
            id: 2,
            name: "Ali",
            city: "Karachi",
            text: "Excellent quality.",
            rating: 5,
          },
        ];

  const [showModal, setShowModal] = useState(false);
  // const [loading, setLoading] = useState(true); // FIX 2: Loading ab App.jsx handle kar raha hai
  const [submitting, setSubmitting] = useState(false);

  // Form States
  const [newName, setNewName] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);

  // FIX 3: 'fetchReviews' aur 'useEffect' yahan se hata diya hai.
  // Kyunke ab data App.jsx se direct 'reviews' prop mein aa raha hai.

  // Submit Review
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newName || !newComment) return alert("Please fill details");

    setSubmitting(true);
    try {
      await addDoc(collection(db, "reviews"), {
        name: newName,
        location: newLocation || "Pakistan",
        rating: newRating,
        comment: newComment || newComment, // Fix variable name if needed, assuming 'text' in db
        text: newComment, // Saving as 'text' to match display logic
        createdAt: serverTimestamp(),
      });

      setNewName("");
      setNewLocation("");
      setNewComment("");
      setNewRating(5);
      setShowModal(false);

      // FIX 4: fetchReviews() hata diya, alert update kia
      alert("Thank you! Your review has been added. Refresh to see it.");
    } catch (error) {
      console.error("Error adding review:", error);
      alert("Failed to submit review.");
    }
    setSubmitting(false);
  };

  return (
    <section className="testimonials-section">
      <div className="container">
        {/* HEADER */}
        <div className="d-flex flex-column align-items-center text-center mb-5">
          <h2 className="brand-font display-6 fw-bold">
            Happy Parents <span className="text-gold">Say</span>
          </h2>
          <p className="text-main mb-4">
            See why hundreds of parents trust Faizi Kids Furniture.
          </p>

          {/* ADD REVIEW BUTTON */}
          <button
            onClick={() => setShowModal(true)}
            className="btn-gold-outline rounded-pill px-4 py-2"
          >
            <FaPlus className="me-2" /> Write a Review
          </button>
        </div>

        {/* --- REVIEWS CONTAINER --- */}
        {/* FIX 5: Loading logic simplified */}
        {reviews.length === 0 && displayReviews.length === 0 ? (
          <p className="text-center text-muted my-5">
            No reviews yet. Be the first to write one!
          </p>
        ) : (
          <div className="reviews-hybrid-container">
            {displayReviews.map((review) => (
              <div key={review.id} className="testimonial-card-wrapper">
                <div className="review-card h-100 fade-in">
                  <div className="quote-icon">
                    <FaQuoteLeft />
                  </div>

                  <div className="stars mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={
                          i < (review.rating || 5)
                            ? "text-warning"
                            : "text-muted opacity-25"
                        }
                      />
                    ))}
                  </div>

                  {/* FIX 6: Handle both 'comment' and 'text' fields just in case */}
                  <p className="review-text mb-4">
                    "{review.text || review.comment}"
                  </p>

                  <div className="review-footer mt-auto">
                    <h6 className="fw-bold mb-0 text-dark-responsive">
                      {review.name}
                    </h6>
                    <small className="text-muted">
                      {review.city || review.location}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- MODAL FORM --- */}
        {showModal && (
          <div className="modal-overlay fade-in" style={{ zIndex: 9999 }}>
            <div
              className="modal-content p-4 bg-white"
              style={{
                maxWidth: "500px",
                borderRadius: "20px",
                position: "relative",
              }}
            >
              <button
                onClick={() => setShowModal(false)}
                className="btn-close-absolute"
                style={{ top: "15px", right: "15px", color: "#333" }}
              >
                <FaTimes size={20} />
              </button>
              <h4 className="brand-font text-center mb-4 text-dark fw-bold">
                Write a Review
              </h4>
              <form onSubmit={handleSubmit}>
                <div className="text-center mb-4 bg-light p-3 rounded-4">
                  <p className="mb-2 small fw-bold text-muted">
                    Tap stars to rate:
                  </p>
                  <div className="d-flex justify-content-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        size={32}
                        className={
                          star <= newRating
                            ? "text-warning cursor-pointer"
                            : "text-secondary opacity-25 cursor-pointer"
                        }
                        onClick={() => setNewRating(star)}
                        style={{ transition: "0.2s" }}
                      />
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="form-control rounded-pill p-3"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="City (Optional)"
                    className="form-control rounded-pill p-3"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <textarea
                    rows="4"
                    placeholder="Share your experience..."
                    className="form-control p-3"
                    style={{ borderRadius: "15px", resize: "none" }}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  ></textarea>
                </div>
                <button
                  disabled={submitting}
                  className="btn-gold w-100 rounded-pill py-3 fw-bold"
                >
                  {submitting ? "Submitting..." : "Post Review"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
