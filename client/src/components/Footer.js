import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-5">
      <div className="container container-xl">
        <div className="row g-4 mb-4 text-start">
          <div className="col-lg-4 col-md-6">
            <h4 className="font-serif text-white mb-3 d-flex align-items-center gap-2">
              <i className="fa-solid fa-hotel text-warning"></i> GRAND HORIZON
            </h4>
            <p className="text-secondary small mb-3">
              Experience the peak of refined elegance, luxury accommodations, and world-class hospitality tailored for discerning travelers.
            </p>
            <div className="d-flex gap-3 text-secondary">
              <a href="#instagram" aria-label="Instagram" className="text-secondary fs-5 hover-gold"><i className="fa-brands fa-instagram"></i></a>
              <a href="#facebook" aria-label="Facebook" className="text-secondary fs-5 hover-gold"><i className="fa-brands fa-facebook"></i></a>
              <a href="#twitter" aria-label="Twitter" className="text-secondary fs-5 hover-gold"><i className="fa-brands fa-x-twitter"></i></a>
              <a href="#linkedin" aria-label="LinkedIn" className="text-secondary fs-5 hover-gold"><i className="fa-brands fa-linkedin"></i></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="text-white text-uppercase font-serif mb-3 tracking-wider" style={{ letterSpacing: '1px' }}>Navigation</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li><Link to="/" className="text-secondary text-decoration-none">Home</Link></li>
              <li><Link to="/home" className="text-secondary text-decoration-none">Explore Rooms</Link></li>
              <li><Link to="/bookings" className="text-secondary text-decoration-none">My Bookings</Link></li>
              <li><Link to="/login" className="text-secondary text-decoration-none">Guest Login</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-white text-uppercase font-serif mb-3" style={{ letterSpacing: '1px' }}>Amenities</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0 text-secondary">
              <li><i className="fa-solid fa-water-ladder me-2 text-warning"></i> Infinity Pool & Spa</li>
              <li><i className="fa-solid fa-utensils me-2 text-warning"></i> Fine Dining & Rooftop Bar</li>
              <li><i className="fa-solid fa-dumbbell me-2 text-warning"></i> Fitness Center</li>
              <li><i className="fa-solid fa-wifi me-2 text-warning"></i> High-Speed Wi-Fi</li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-white text-uppercase font-serif mb-3" style={{ letterSpacing: '1px' }}>Contact & Location</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0 text-secondary">
              <li><i className="fa-solid fa-location-dot me-2 text-warning"></i> 100 Horizon Boulevard, Oceanfront, CA 90210</li>
              <li><i className="fa-solid fa-phone me-2 text-warning"></i> +1 (800) 555-HORIZON</li>
              <li><i className="fa-solid fa-envelope me-2 text-warning"></i> concierge@grandhorizon.com</li>
            </ul>
          </div>
        </div>

        <div className="border-top border-secondary border-opacity-25 pt-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 small text-secondary">
          <div>© {new Date().getFullYear()} Grand Horizon Luxury Hotel & Resort. All rights reserved.</div>
          <div className="d-flex gap-3">
            <Link to="#" className="text-secondary text-decoration-none">Privacy Policy</Link>
            <span>•</span>
            <Link to="#" className="text-secondary text-decoration-none">Terms of Service</Link>
            <span>•</span>
            <Link to="#" className="text-secondary text-decoration-none">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;