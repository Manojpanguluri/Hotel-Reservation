import React, { useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { Link, useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function Loginscreen() {
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const Login = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      seterror(true);
      setErrorMessage("Please fill in both email and password.");
      return;
    }

    const user = { email, password };
    try {
      setloading(true);
      seterror(false);
      const response = await axios.post(`${API_URL}/api/user/login`, user);
      setloading(false);

      // Store user object cleanly in localStorage
      localStorage.setItem("currentUser", JSON.stringify(response.data));
      navigate("/home");
    } catch (err) {
      console.error(err);
      setloading(false);
      seterror(true);
      setErrorMessage(
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Invalid email or password. Please check your credentials."
      );
    }
  };

  return (
    <div className="container container-xl py-5">
      <div className="row justify-content-center align-items-center min-vh-75">
        <div className="col-lg-10">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white">
            <div className="row g-0">
              {/* LEFT IMAGE HERO PANEL */}
              <div
                className="col-md-6 d-none d-md-block position-relative p-5 text-white"
                style={{
                  backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.85)), url('/images/hero/hero-2.jpg')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="d-flex flex-column h-100 justify-content-between text-start">
                  <div>
                    <span className="badge-gold mb-2">Welcome Back</span>
                    <h3 className="font-serif fw-bold display-6 text-white mb-3">
                      Grand Horizon
                    </h3>
                    <p className="small text-light opacity-90">
                      Sign in to manage your luxury stay, access exclusive guest benefits, and view your itinerary.
                    </p>
                  </div>

                  <div className="p-3 bg-white bg-opacity-10 backdrop-blur rounded-3 border border-white border-opacity-10">
                    <i className="fa-solid fa-quote-left text-warning me-2 fs-5"></i>
                    <span className="small italic text-light">
                      "Unforgettable ocean views and extraordinary service every time."
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT FORM PANEL */}
              <div className="col-md-6 p-4 p-md-5 text-start">
                <div className="mb-4">
                  <h3 className="font-serif fw-bold text-dark mb-1">Guest Sign In</h3>
                  <p className="text-secondary small">Enter your account credentials to log in.</p>
                </div>

                {error && <Error message={errorMessage} />}
                {loading && <Loader />}

                <form onSubmit={Login}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-uppercase text-secondary">
                      Email Address
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0">
                        <i className="fa-regular fa-envelope"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control border-start-0"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold text-uppercase text-secondary">
                      Password
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0">
                        <i className="fa-solid fa-lock"></i>
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control border-start-0 border-end-0"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setpassword(e.target.value)}
                        required
                      />
                      <button
                        className="btn btn-light border border-start-0 text-muted"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-gold w-100 py-3 rounded-pill fw-bold text-uppercase mb-3"
                    disabled={loading}
                  >
                    {loading ? "Signing In..." : "Sign In to Account"}
                  </button>
                </form>

                <div className="text-center pt-3 border-top text-secondary small">
                  Don't have a Grand Horizon account yet?{" "}
                  <Link to="/register" className="fw-bold text-dark hover-gold">
                    Register Here
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loginscreen;
