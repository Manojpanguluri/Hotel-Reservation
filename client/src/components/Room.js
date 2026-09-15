import React, { useState } from "react";
import { Modal, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";

function Room({ room, fromDate, toDate }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Fallback image handling
  const mainImage =
    room.imageurls && room.imageurls.length > 0
      ? room.imageurls[0]
      : "/images/rooms/deluxe-suite.jpg";

  return (
    <div className="luxury-card p-0 rounded-4 shadow-sm border border-light">
      <div className="row g-0 align-items-center">
        {/* ROOM IMAGE CONTAINER */}
        <div className="col-lg-5 position-relative overflow-hidden" style={{ minHeight: "280px" }}>
          <img
            src={mainImage}
            alt={room.name}
            className="w-100 h-100 object-fit-cover position-absolute top-0 start-0"
            style={{ transition: "transform 0.5s ease" }}
            onError={(e) => {
              e.target.src = "/images/rooms/deluxe-suite.jpg";
            }}
          />
          <span className="position-absolute top-0 start-0 m-3 badge bg-dark bg-opacity-75 text-warning px-3 py-2 rounded-pill font-sans">
            <i className="fa-solid fa-crown me-1"></i> {room.type}
          </span>
          <span className="position-absolute bottom-0 end-0 m-3 badge bg-dark bg-opacity-75 text-white px-3 py-1 rounded-pill small">
            <i className="fa-solid fa-camera me-1"></i> {room.imageurls ? room.imageurls.length : 1} Photos
          </span>
        </div>

        {/* ROOM CONTENT & DETAILS */}
        <div className="col-lg-7 p-4 p-md-5 d-flex flex-column justify-content-between h-100">
          <div>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h3 className="font-serif fw-bold text-dark mb-0">{room.name}</h3>
              <div className="text-end ms-3">
                <span className="fs-3 fw-bold text-dark">₹{room.rentperday}</span>
                <span className="text-muted small d-block">per night</span>
              </div>
            </div>

            <p className="text-secondary small mb-3 line-clamp-2">
              {room.description || "Experience supreme comfort with world-class amenities, elegant furnishings, and breathtaking ocean views."}
            </p>

            {/* AMENITY BADGES */}
            <div className="d-flex flex-wrap gap-2 mb-4">
              <span className="badge bg-light text-dark border px-3 py-2 rounded-pill small fw-normal">
                <i className="fa-solid fa-users text-warning me-1"></i> Up to {room.maxcount} Guests
              </span>
              <span className="badge bg-light text-dark border px-3 py-2 rounded-pill small fw-normal">
                <i className="fa-solid fa-wifi text-warning me-1"></i> High-Speed Wi-Fi
              </span>
              <span className="badge bg-light text-dark border px-3 py-2 rounded-pill small fw-normal">
                <i className="fa-solid fa-snowflake text-warning me-1"></i> Climate Control
              </span>
              <span className="badge bg-light text-dark border px-3 py-2 rounded-pill small fw-normal">
                <i className="fa-solid fa-phone text-warning me-1"></i> Concierge: {room.phonenumber}
              </span>
            </div>
          </div>

          {/* ACTIONS & BOOKING */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-3 border-top border-light">
            <button
              className="btn btn-outline-dark-custom btn-sm rounded-pill px-4"
              onClick={handleShow}
            >
              <i className="fa-solid fa-eye me-1"></i> View Details
            </button>

            {fromDate && toDate ? (
              <Link to={`/book/${room._id}/${fromDate}/${toDate}`}>
                <button className="btn btn-gold btn-sm rounded-pill px-4">
                  <i className="fa-solid fa-calendar-check me-1"></i> Book Suite
                </button>
              </Link>
            ) : (
              <button
                className="btn btn-gold btn-sm rounded-pill px-4"
                onClick={handleShow}
              >
                <i className="fa-solid fa-calendar-days me-1"></i> Select Dates to Book
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ROOM DETAILS MODAL */}
      <Modal show={show} onHide={handleClose} size="lg" centered className="rounded-4">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="font-serif fw-bold fs-4 text-dark me-auto">
            {room.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          {/* IMAGE CAROUSEL */}
          <div className="rounded-4 overflow-hidden mb-4 shadow-sm">
            <Carousel indicatorLabels={["Slide 1", "Slide 2", "Slide 3"]}>
              {room.imageurls && room.imageurls.length > 0 ? (
                room.imageurls.map((url, idx) => (
                  <Carousel.Item key={idx}>
                    <img
                      className="d-block w-100 object-fit-cover"
                      style={{ height: "400px" }}
                      src={url}
                      alt={`${room.name} view ${idx + 1}`}
                      onError={(e) => {
                        e.target.src = "/images/rooms/deluxe-suite.jpg";
                      }}
                    />
                  </Carousel.Item>
                ))
              ) : (
                <Carousel.Item>
                  <img
                    className="d-block w-100 object-fit-cover"
                    style={{ height: "400px" }}
                    src="/images/rooms/deluxe-suite.jpg"
                    alt={room.name}
                  />
                </Carousel.Item>
              )}
            </Carousel>
          </div>

          <div className="row g-4">
            <div className="col-md-8">
              <h5 className="font-serif fw-bold text-dark mb-2">About This Accommodation</h5>
              <p className="text-secondary small leading-relaxed">{room.description}</p>

              <h6 className="font-serif fw-bold text-dark mt-4 mb-2">Suite Features & Amenities</h6>
              <div className="row g-2 small text-secondary">
                <div className="col-6"><i className="fa-solid fa-check text-warning me-2"></i> King-size plush mattress</div>
                <div className="col-6"><i className="fa-solid fa-check text-warning me-2"></i> Private marble bathroom</div>
                <div className="col-6"><i className="fa-solid fa-check text-warning me-2"></i> 24/7 In-room dining service</div>
                <div className="col-6"><i className="fa-solid fa-check text-warning me-2"></i> Smart LED TV & Sound System</div>
                <div className="col-6"><i className="fa-solid fa-check text-warning me-2"></i> Espresso coffee machine</div>
                <div className="col-6"><i className="fa-solid fa-check text-warning me-2"></i> Personal electronic safe</div>
              </div>
            </div>

            <div className="col-md-4 bg-light p-3 rounded-4 border border-light">
              <h6 className="font-serif fw-bold text-dark mb-3">Reservation Summary</h6>
              <div className="d-flex justify-content-between mb-2 small">
                <span className="text-muted">Rate per night:</span>
                <span className="fw-bold text-dark">₹{room.rentperday}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 small">
                <span className="text-muted">Max Occupancy:</span>
                <span className="fw-bold text-dark">{room.maxcount} Guests</span>
              </div>
              <div className="d-flex justify-content-between mb-3 small">
                <span className="text-muted">Room Type:</span>
                <span className="fw-bold text-dark">{room.type}</span>
              </div>

              {fromDate && toDate ? (
                <Link to={`/book/${room._id}/${fromDate}/${toDate}`} className="w-100">
                  <button className="btn btn-gold w-100 rounded-pill py-2">
                    Proceed to Booking
                  </button>
                </Link>
              ) : (
                <div className="text-center">
                  <p className="small text-muted mb-2">Select check-in dates on the rooms page to book.</p>
                  <button className="btn btn-dark w-100 rounded-pill py-2" onClick={handleClose}>
                    Close & Choose Dates
                  </button>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Room;
