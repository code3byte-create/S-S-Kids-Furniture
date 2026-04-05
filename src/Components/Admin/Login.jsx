import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  FaUserShield,
  FaLock,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaExclamationCircle,
} from "react-icons/fa";

const Login = ({ onLogin, onCancel }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Specific errors for fields
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    // 1. Reset Errors
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    let isValid = true;

    // 2. Custom Validation Logic
    if (!email) {
      setEmailError("Email address is required.");
      isValid = false;
    } else if (!email.includes("@")) {
      setEmailError("Invalid email. Did you forget the '@'?");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Please enter your password.");
      isValid = false;
    }

    if (!isValid) return; // Agar validation fail hui to ruk jao

    // 3. Proceed to Firebase Login
    setLoading(true);
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (err) {
      setGeneralError("Access Denied. Incorrect credentials.");
    }
    setLoading(false);
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-icon-box">
          <FaUserShield />
        </div>

        <h3 className="login-title">Admin Portal</h3>
        <p className="login-subtitle">Secure access for S&S Kids Furniture Admin</p>

        {/* General Error (Top Alert) */}
        {generalError && (
          <div className="alert-message">
            <span className="alert-icon">
              <FaExclamationCircle />
            </span>
            <span>{generalError}</span>
          </div>
        )}

        {/* --- FORM START (noValidate added) --- */}
        <form onSubmit={handleLogin} noValidate>
          {/* Email Field */}
          <div className="input-field-group">
            <label>Email Address</label>
            <div
              className={`input-wrapper ${emailError ? "error-border" : ""}`}
            >
              <span className="icon">
                <FaEnvelope />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@faizikids.com"
              />
            </div>
            {/* Custom Premium Error Message */}
            {emailError && (
              <div className="field-error-msg">
                <FaExclamationCircle /> {emailError}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="input-field-group">
            <label>Password</label>
            <div
              className={`input-wrapper ${passwordError ? "error-border" : ""}`}
            >
              <span className="icon">
                <FaLock />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <span
                className="toggle-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {/* Custom Premium Error Message */}
            {passwordError && (
              <div className="field-error-msg">
                <FaExclamationCircle /> {passwordError}
              </div>
            )}
          </div>

          <button disabled={loading} className="btn-login-royal">
            {loading ? "Verifying..." : "Login to Dashboard"}
          </button>

          <button type="button" className="btn-cancel-link" onClick={onCancel}>
            <FaArrowLeft /> Cancel & Go Back
          </button>
        </form>

        <div className="login-footer">
          <p>Protected System • Faizi Kids Furniture</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
