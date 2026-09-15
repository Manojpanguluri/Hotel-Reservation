import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  let user = null;
  try {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser && storedUser !== "undefined") {
      const parsed = JSON.parse(storedUser);
      // Support both parsed.data and direct user object
      user = parsed.data ? parsed.data : parsed;
    }
  } catch (err) {
    console.error("Failed to parse currentUser from localStorage", err);
    user = null;
  }

  function logout() {
    localStorage.removeItem("currentUser");
    navigate("/login");
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg custom-navbar sticky-top">
      <div className="container-fluid container-xl">
        <Link className="navbar-brand" to="/">
          <i className="fa-solid fa-hotel brand-icon"></i>
          <span>GRAND HORIZON</span>
        </Link>

        <button
          className="navbar-toggler border-0 text-white"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="fa-solid fa-bars-staggered text-white fs-4"></i>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/") ? "active" : ""}`} to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/home") ? "active" : ""}`} to="/home">
                Rooms
              </Link>
            </li>

            {user ? (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive("/bookings") ? "active" : ""}`}
                    to="/bookings"
                  >
                    My Bookings
                  </Link>
                </li>

                {user.isAdmin && (
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${isActive("/admin") ? "active" : ""}`}
                      to="/admin"
                    >
                      <i className="fa-solid fa-user-shield me-1 text-warning"></i>
                      Admin
                    </Link>
                  </li>
                )}

                <li className="nav-item dropdown ms-lg-2 mt-2 mt-lg-0 nav-user-dropdown">
                  <button
                    className="btn btn-user dropdown-toggle"
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fa-solid fa-circle-user fs-5 me-1"></i>
                    <span>{user.name}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li className="px-3 py-2 border-bottom mb-1">
                      <div className="fw-semibold text-dark">{user.name}</div>
                      <div className="text-muted small">{user.email}</div>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/bookings">
                        <i className="fa-solid fa-bookmark me-2 text-primary"></i> My Bookings
                      </Link>
                    </li>
                    {user.isAdmin && (
                      <li>
                        <Link className="dropdown-item" to="/admin">
                          <i className="fa-solid fa-chart-line me-2 text-warning"></i> Admin Panel
                        </Link>
                      </li>
                    )}
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item text-danger w-100 text-start" onClick={logout}>
                        <i className="fa-solid fa-right-from-bracket me-2"></i> Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <div className="d-flex align-items-center gap-2 ms-lg-3 mt-2 mt-lg-0">
                <Link className="btn btn-outline-light btn-sm px-3 rounded-pill" to="/login">
                  Sign In
                </Link>
                <Link className="btn btn-gold btn-sm px-3 rounded-pill" to="/register">
                  Book Now
                </Link>
              </div>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
