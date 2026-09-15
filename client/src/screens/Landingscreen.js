import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DatePicker } from "antd";
import moment from "moment";

const { RangePicker } = DatePicker;

function Landingscreen() {
  const navigate = useNavigate();
  const [selectedDates, setSelectedDates] = useState(null);

  const handleSearch = () => {
    if (selectedDates && selectedDates.length === 2) {
      const from = moment(selectedDates[0].toDate()).format("DD-MM-YYYY");
      const to = moment(selectedDates[1].toDate()).format("DD-MM-YYYY");
      navigate(`/home?fromDate=${from}&toDate=${to}`);
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="landing-container">
      {/* HERO SECTION */}
      <section
        className="hero-section text-white d-flex align-items-center position-relative"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.75)), url('/images/hero/hero-bg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "85vh",
          padding: "5rem 1rem 7rem 1rem",
        }}
      >
        <div className="container container-xl text-center">
          <span className="badge-gold mb-3 px-3 py-2 text-uppercase font-sans tracking-widest">
            <i className="fa-solid fa-crown me-2"></i> World-Class Hospitality
          </span>
          <h1 className="display-2 font-serif fw-bold mb-3 text-white">
            Stay Somewhere Exceptional
          </h1>
          <p className="lead mx-auto text-light opacity-90 mb-4" style={{ maxWidth: "680px", fontSize: "1.25rem" }}>
            Unrivaled luxury, world-class dining, and breathtaking coastal sanctuaries designed for unforgettable escapes.
          </p>

          {/* FLOATING QUICK BOOKING BAR */}
          <div
            className="card border-0 shadow-lg mx-auto p-3 p-md-4 rounded-4"
            style={{
              maxWidth: "850px",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              color: "#0f172a",
            }}
          >
            <div className="row g-3 align-items-center text-start">
              <div className="col-md-7">
                <label className="form-label fw-bold small text-uppercase text-secondary mb-1">
                  <i className="fa-regular fa-calendar-check me-1 text-warning"></i> Check-in / Check-out Dates
                </label>
                <RangePicker
                  className="w-100 border-1"
                  format="DD-MM-YYYY"
                  disabledDate={(current) => current && current < moment().startOf('day')}
                  onChange={(dates) => setSelectedDates(dates)}
                  style={{ height: '48px' }}
                />
              </div>
              <div className="col-md-5">
                <label className="form-label opacity-0 d-none d-md-block mb-1">Search</label>
                <button
                  className="btn btn-gold w-100 py-3 fw-bold text-uppercase rounded-3"
                  onClick={handleSearch}
                >
                  <i className="fa-solid fa-magnifying-glass me-2"></i> Check Availability
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-5 bg-white">
        <div className="container container-xl py-4">
          <div className="text-center mb-5">
            <span className="section-tag">Unmatched Experience</span>
            <h2 className="section-heading">Why Choose Grand Horizon</h2>
            <div className="mx-auto bg-warning" style={{ width: "60px", height: "3px" }}></div>
          </div>

          <div className="row g-4 text-center">
            <div className="col-md-3 col-sm-6">
              <div className="p-4 rounded-4 border bg-light h-100">
                <div className="fs-1 text-warning mb-3">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <h5 className="font-serif fw-bold">Prime Beachfront</h5>
                <p className="text-muted small mb-0">
                  Nestled directly on pristine white-sand shores with private ocean access.
                </p>
              </div>
            </div>

            <div className="col-md-3 col-sm-6">
              <div className="p-4 rounded-4 border bg-light h-100">
                <div className="fs-1 text-warning mb-3">
                  <i className="fa-solid fa-utensils"></i>
                </div>
                <h5 className="font-serif fw-bold">Michelin Dining</h5>
                <p className="text-muted small mb-0">
                  Award-winning chefs crafting extraordinary seasonal culinary delights.
                </p>
              </div>
            </div>

            <div className="col-md-3 col-sm-6">
              <div className="p-4 rounded-4 border bg-light h-100">
                <div className="fs-1 text-warning mb-3">
                  <i className="fa-solid fa-bell-concierge"></i>
                </div>
                <h5 className="font-serif fw-bold">24/7 Concierge</h5>
                <p className="text-muted small mb-0">
                  Personalized VIP butler services and custom itinerary planning around the clock.
                </p>
              </div>
            </div>

            <div className="col-md-3 col-sm-6">
              <div className="p-4 rounded-4 border bg-light h-100">
                <div className="fs-1 text-warning mb-3">
                  <i className="fa-solid fa-spa"></i>
                </div>
                <h5 className="font-serif fw-bold">Wellness & Spa</h5>
                <p className="text-muted small mb-0">
                  Holistic thermal baths, massage therapies, and ocean-facing infinity pools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED ROOM PREVIEWS */}
      <section className="py-5" style={{ backgroundColor: "#f8fafc" }}>
        <div className="container container-xl py-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <span className="section-tag">Luxury Accommodations</span>
              <h2 className="section-heading mb-0">Featured Suites & Villas</h2>
            </div>
            <Link to="/home" className="btn btn-outline-dark-custom mt-3 mt-md-0">
              View All Accommodations <i className="fa-solid fa-arrow-right ms-2"></i>
            </Link>
          </div>

          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="luxury-card h-100 d-flex flex-column">
                <div className="position-relative" style={{ height: "240px" }}>
                  <img
                    src="/images/rooms/deluxe-suite.jpg"
                    alt="Deluxe Suite"
                    className="w-100 h-100 object-fit-cover"
                  />
                  <span className="position-absolute top-0 end-0 m-3 badge bg-dark text-warning px-3 py-2 rounded-pill">
                    Luxury
                  </span>
                </div>
                <div className="p-4 d-flex flex-column flex-grow-1">
                  <h4 className="font-serif fw-bold mb-2">Deluxe Suite</h4>
                  <p className="text-muted small mb-3">
                    Spacious sanctuary featuring king-size bedding, marble bath, and private terrace views.
                  </p>
                  <div className="mt-auto d-flex align-items-center justify-content-between pt-3 border-top">
                    <div>
                      <span className="fs-4 fw-bold text-dark">₹1,500</span>
                      <span className="text-muted small"> / night</span>
                    </div>
                    <Link to="/home" className="btn btn-gold btn-sm px-3">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="luxury-card h-100 d-flex flex-column">
                <div className="position-relative" style={{ height: "240px" }}>
                  <img
                    src="/images/rooms/executive-suite.jpg"
                    alt="Executive Suite"
                    className="w-100 h-100 object-fit-cover"
                  />
                  <span className="position-absolute top-0 end-0 m-3 badge bg-dark text-warning px-3 py-2 rounded-pill">
                    Executive
                  </span>
                </div>
                <div className="p-4 d-flex flex-column flex-grow-1">
                  <h4 className="font-serif fw-bold mb-2">Executive Ocean Suite</h4>
                  <p className="text-muted small mb-3">
                    Panoramas of the sea, separate lounge area, deep soaking tub, and executive privileges.
                  </p>
                  <div className="mt-auto d-flex align-items-center justify-content-between pt-3 border-top">
                    <div>
                      <span className="fs-4 fw-bold text-dark">₹2,500</span>
                      <span className="text-muted small"> / night</span>
                    </div>
                    <Link to="/home" className="btn btn-gold btn-sm px-3">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="luxury-card h-100 d-flex flex-column">
                <div className="position-relative" style={{ height: "240px" }}>
                  <img
                    src="/images/rooms/villa.jpg"
                    alt="Presidential Villa"
                    className="w-100 h-100 object-fit-cover"
                  />
                  <span className="position-absolute top-0 end-0 m-3 badge bg-dark text-warning px-3 py-2 rounded-pill">
                    Penthouse
                  </span>
                </div>
                <div className="p-4 d-flex flex-column flex-grow-1">
                  <h4 className="font-serif fw-bold mb-2">Presidential Private Villa</h4>
                  <p className="text-muted small mb-3">
                    Ultimate privacy with infinity pool, dedicated butler, dual master suites, and chef kitchen.
                  </p>
                  <div className="mt-auto d-flex align-items-center justify-content-between pt-3 border-top">
                    <div>
                      <span className="fs-4 fw-bold text-dark">₹5,000</span>
                      <span className="text-muted small"> / night</span>
                    </div>
                    <Link to="/home" className="btn btn-gold btn-sm px-3">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AMENITIES & EXPERIENCES */}
      <section className="py-5 bg-white">
        <div className="container container-xl py-3">
          <div className="text-center mb-5">
            <span className="section-tag">Refined Leisure</span>
            <h2 className="section-heading">Resort Facilities & Amenities</h2>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden position-relative group-hover">
                <img src="/images/amenities/pool.jpg" className="w-100 object-fit-cover" style={{ height: "260px" }} alt="Pool" />
                <div className="p-3 bg-dark text-white">
                  <h5 className="font-serif mb-1"><i className="fa-solid fa-water-ladder text-warning me-2"></i> Ocean Infinity Pool</h5>
                  <p className="small text-muted mb-0">Climate-controlled swimming pool with private cabanas.</p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden position-relative">
                <img src="/images/amenities/spa.jpg" className="w-100 object-fit-cover" style={{ height: "260px" }} alt="Spa" />
                <div className="p-3 bg-dark text-white">
                  <h5 className="font-serif mb-1"><i className="fa-solid fa-spa text-warning me-2"></i> Serenity Wellness Spa</h5>
                  <p className="small text-muted mb-0">Holistic aromatherapy, massage therapy & steam suites.</p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden position-relative">
                <img src="/images/amenities/restaurant.jpg" className="w-100 object-fit-cover" style={{ height: "260px" }} alt="Dining" />
                <div className="p-3 bg-dark text-white">
                  <h5 className="font-serif mb-1"><i className="fa-solid fa-utensils text-warning me-2"></i> Gourmet Fine Dining</h5>
                  <p className="small text-muted mb-0">International cuisine and sommelier-curated wine cellar.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section
        className="py-5 text-white text-center position-relative"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url('/images/hero/hero-2.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container container-xl py-5">
          <h2 className="display-4 font-serif fw-bold mb-3 text-white">Your Unforgettable Journey Awaits</h2>
          <p className="lead mx-auto mb-4 opacity-90" style={{ maxWidth: "600px" }}>
            Reserve your luxury room or suite today and experience hospitality redefined.
          </p>
          <Link to="/home" className="btn btn-gold btn-lg px-5 py-3 rounded-pill fw-bold text-uppercase">
            Book Your Stay Now
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Landingscreen;
