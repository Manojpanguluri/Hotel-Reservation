import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import swal from "sweetalert2";

const API_URL = process.env.REACT_APP_API_URL;

function Bookingscreen() {
  const navigate = useNavigate();
  const { roomid, fromDate, toDate } = useParams();
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState(false);
  const [room, setroom] = useState(null);

  const startDate = moment(fromDate, "DD-MM-YYYY");
  const endDate = moment(toDate, "DD-MM-YYYY");
  const totalDays = moment.duration(endDate.diff(startDate)).asDays() + 1;
  const [totalamt, settotalamt] = useState(0);

  let currentUser = null;
  try {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      const parsed = JSON.parse(stored);
      currentUser = parsed.data ? parsed.data : parsed;
    }
  } catch (e) {
    currentUser = null;
  }

  useEffect(() => {
    if (!localStorage.getItem("currentUser")) {
      navigate("/login");
      return;
    }
    const fetchData = async () => {
      try {
        setloading(true);
        const { data } = await axios.post(`${API_URL}/api/rooms/getroombyid`, {
          roomid,
        });

        // Ensure imageurls has fallback
        const urls = data.imageurls && data.imageurls.length > 0
          ? data.imageurls
          : ["/images/rooms/deluxe-suite.jpg"];

        settotalamt(data.rentperday * totalDays);
        setroom({ ...data, imageurls: urls });
        setloading(false);
      } catch (err) {
        console.error(err);
        setloading(false);
        seterror(true);
      }
    };

    fetchData();
  }, [roomid, totalDays, navigate]);

  const openRazorpay = async () => {
    if (!currentUser) {
      swal.fire("Session Expired", "Please log in to complete your booking", "warning");
      navigate("/login");
      return;
    }

    try {
      setloading(true);
      const { data: order } = await axios.post(`${API_URL}/api/bookings/createorder`, {
        amount: totalamt,
      });

      setloading(false);

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_dummy",
        amount: order.amount,
        currency: "INR",
        name: "Grand Horizon Hotel",
        description: `Booking for ${room.name}`,
        order_id: order.id,
        handler: async function (response) {
          const bookingDetails = {
            room,
            userid: currentUser._id,
            fromDate,
            toDate,
            totalamt,
            totalDays,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          };

          try {
            setloading(true);
            await axios.post(`${API_URL}/api/bookings/bookroom`, bookingDetails);
            setloading(false);
            swal.fire({
              title: "Booking Confirmed!",
              text: "Your reservation has been successfully booked. A confirmation email with your invoice PDF has been sent.",
              icon: "success",
              confirmButtonColor: "#c5a880",
            }).then(() => {
              navigate("/bookings");
            });
          } catch (err) {
            setloading(false);
            swal.fire("Booking Error", "Payment verified but booking save failed. Please contact support.", "error");
          }
        },
        prefill: {
          name: currentUser.name,
          email: currentUser.email,
        },
        theme: {
          color: "#0f172a",
        },
      };

      if (window.Razorpay) {
        const paymentObject = new window.Razorpay(options);

        paymentObject.on("payment.failed", function (response) {
          console.error("RAZORPAY PAYMENT FAILED:", response.error);
        });

        paymentObject.open();
      } else {
        swal.fire("Payment SDK Error", "Razorpay SDK failed to load. Please check your internet connection.", "error");
      }
    } catch (err) {
      console.error(err);
      setloading(false);
      swal.fire("Error", "Failed to initialize payment gateway", "error");
    }
  };

  if (loading) return <Loader />;
  if (error || !room) return <Error message="Unable to load booking details. Please try again." />;

  return (
    <div className="container container-xl py-5">
      <div className="text-center mb-5">
        <span className="section-tag">Complete Your Reservation</span>
        <h2 className="section-heading">Review & Confirm Stay</h2>
      </div>

      <div className="row g-4">
        {/* ROOM DETAILS & PREVIEW */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
            <img
              src={room.imageurls[0]}
              alt={room.name}
              className="w-100 object-fit-cover"
              style={{ height: "360px" }}
              onError={(e) => { e.target.src = "/images/rooms/deluxe-suite.jpg"; }}
            />
            <div className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h3 className="font-serif fw-bold text-dark mb-0">{room.name}</h3>
                <span className="badge-gold">{room.type}</span>
              </div>
              <p className="text-secondary small mb-4">{room.description}</p>

              <div className="row g-3 p-3 bg-light rounded-3">
                <div className="col-sm-6">
                  <span className="text-muted small d-block">Max Capacity</span>
                  <span className="fw-bold text-dark"><i className="fa-solid fa-users text-warning me-1"></i> {room.maxcount} Guests</span>
                </div>
                <div className="col-sm-6">
                  <span className="text-muted small d-block">Concierge Contact</span>
                  <span className="fw-bold text-dark"><i className="fa-solid fa-phone text-warning me-1"></i> {room.phonenumber}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOOKING SUMMARY & PAYMENT */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-md rounded-4 p-4 bg-white sticky-top" style={{ top: "100px" }}>
            <h4 className="font-serif fw-bold text-dark mb-4 pb-2 border-bottom">Reservation Summary</h4>

            {/* GUEST INFO */}
            <div className="mb-4">
              <span className="text-uppercase text-secondary small fw-bold tracking-wider">Guest Information</span>
              <div className="mt-2 p-3 bg-light rounded-3">
                <div className="fw-bold text-dark">{currentUser?.name}</div>
                <div className="text-muted small">{currentUser?.email}</div>
              </div>
            </div>

            {/* DATES BREAKDOWN */}
            <div className="mb-4">
              <span className="text-uppercase text-secondary small fw-bold tracking-wider">Dates of Stay</span>
              <div className="d-flex justify-content-between align-items-center mt-2 p-3 bg-light rounded-3">
                <div>
                  <span className="text-muted small d-block">Check-In</span>
                  <span className="fw-bold text-dark">{fromDate}</span>
                </div>
                <div className="text-center px-2">
                  <i className="fa-solid fa-arrow-right text-warning"></i>
                  <span className="d-block small text-muted">{totalDays} {totalDays === 1 ? "Night" : "Nights"}</span>
                </div>
                <div className="text-end">
                  <span className="text-muted small d-block">Check-Out</span>
                  <span className="fw-bold text-dark">{toDate}</span>
                </div>
              </div>
            </div>

            {/* PRICE BREAKDOWN */}
            <div className="mb-4">
              <span className="text-uppercase text-secondary small fw-bold tracking-wider">Price Breakdown</span>
              <div className="mt-2 d-flex flex-column gap-2">
                <div className="d-flex justify-content-between small">
                  <span className="text-secondary">Rate per night</span>
                  <span className="fw-semibold text-dark">₹{room.rentperday}</span>
                </div>
                <div className="d-flex justify-content-between small">
                  <span className="text-secondary">Duration</span>
                  <span className="fw-semibold text-dark">{totalDays} {totalDays === 1 ? "Night" : "Nights"}</span>
                </div>
                <div className="d-flex justify-content-between small">
                  <span className="text-secondary">Service & Resort Fees</span>
                  <span className="text-success fw-semibold">Complimentary</span>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold fs-5 text-dark">Total Amount</span>
                  <span className="fw-bold fs-3 text-warning">₹{totalamt}</span>
                </div>
              </div>
            </div>

            {/* PAYMENT ACTION */}
            <button
              className="btn btn-gold w-100 py-3 rounded-pill fw-bold text-uppercase fs-6 shadow"
              onClick={openRazorpay}
            >
              <i className="fa-solid fa-lock me-2"></i> Pay ₹{totalamt} with Razorpay
            </button>

            <div className="text-center mt-3 text-muted small d-flex align-items-center justify-content-center gap-2">
              <i className="fa-solid fa-shield-halved text-success"></i>
              <span>256-Bit SSL Encrypted & Instant Confirmation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bookingscreen;
