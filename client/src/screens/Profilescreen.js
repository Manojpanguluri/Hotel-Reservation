import React, { useState, useEffect } from "react";
import { Tabs, Tag } from "antd";
import Loader from "../components/Loader";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function Profilescreen() {
  const navigate = useNavigate();
  let user = null;
  try {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      const parsed = JSON.parse(stored);
      user = parsed.data ? parsed.data : parsed;
    }
  } catch (e) {
    user = null;
  }

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  const tabItems = [
    {
      key: "1",
      label: (
        <span>
          <i className="fa-solid fa-user me-2"></i> Guest Profile
        </span>
      ),
      children: (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white" style={{ maxWidth: "600px" }}>
          <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
            <div className="bg-dark text-warning rounded-circle d-flex align-items-center justify-content-center fs-2" style={{ width: "70px", height: "70px" }}>
              <i className="fa-solid fa-user-astronaut"></i>
            </div>
            <div>
              <h4 className="font-serif fw-bold text-dark mb-0">{user.name}</h4>
              <span className="badge bg-secondary text-white mt-1">
                {user.isAdmin ? "Administrator" : "Valued Guest"}
              </span>
            </div>
          </div>

          <div className="row g-3 text-start">
            <div className="col-12">
              <label className="text-uppercase text-secondary small fw-bold">Full Name</label>
              <div className="fs-6 fw-semibold text-dark">{user.name}</div>
            </div>
            <div className="col-12">
              <label className="text-uppercase text-secondary small fw-bold">Email Address</label>
              <div className="fs-6 fw-semibold text-dark">{user.email}</div>
            </div>
            <div className="col-12">
              <label className="text-uppercase text-secondary small fw-bold">Account Privilege</label>
              <div>
                {user.isAdmin ? (
                  <Tag color="gold" className="px-3 py-1 fs-6 rounded-pill">System Admin</Tag>
                ) : (
                  <Tag color="blue" className="px-3 py-1 fs-6 rounded-pill">Standard Guest</Tag>
                )}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <span>
          <i className="fa-solid fa-bookmark me-2"></i> My Bookings
        </span>
      ),
      children: <MyBookings user={user} />,
    },
  ];

  return (
    <div className="container container-xl py-5">
      <div className="text-start mb-4">
        <span className="section-tag">Guest Dashboard</span>
        <h2 className="section-heading">Account & Bookings</h2>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
        <Tabs defaultActiveKey="2" items={tabItems} size="large" />
      </div>
    </div>
  );
}

export default Profilescreen;

export function MyBookings({ user: passedUser }) {
  let user = passedUser;
  if (!user) {
    try {
      const stored = localStorage.getItem("currentUser");
      if (stored) {
        const parsed = JSON.parse(stored);
        user = parsed.data ? parsed.data : parsed;
      }
    } catch (e) {
      user = null;
    }
  }

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user._id) return;
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${API_URL}/api/bookings/getbookingsbyuserid`,
          { userid: user._id }
        );
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        Swal.fire("Error", "Failed to retrieve your booking history", "error");
      }
    };

    fetchBookings();
  }, [user?._id]);

  async function cancelBooking(bookingid, roomid) {
    const confirm = await Swal.fire({
      title: "Cancel Reservation?",
      text: "Are you sure you want to cancel this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Cancel Booking",
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);
      await axios.post(`${API_URL}/api/bookings/cancelbooking`, {
        bookingid: bookingid,
        roomid: roomid,
      });
      setLoading(false);
      Swal.fire("Cancelled", "Your booking has been cancelled.", "success").then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
      Swal.fire("Error", "Cancellation request failed", "error");
    }
  }

  if (loading) return <Loader />;

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="fa-solid fa-calendar-xmark text-muted display-3 mb-3"></i>
        <h4 className="font-serif fw-bold text-dark mb-2">No Bookings Found</h4>
        <p className="text-secondary mb-4">You haven't made any hotel room reservations yet.</p>
        <Link to="/home" className="btn btn-gold rounded-pill px-4">
          Explore Rooms & Suites
        </Link>
      </div>
    );
  }

  return (
    <div className="row g-4 text-start">
      {bookings.map((booking) => {
        const isCancelled = booking.status === "cancelled";
        return (
          <div className="col-lg-6" key={booking._id}>
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-light h-100 position-relative">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h4 className="font-serif fw-bold text-dark mb-1">{booking.room}</h4>
                  <span className="text-muted small font-monospace">ID: {booking._id}</span>
                </div>
                {isCancelled ? (
                  <Tag color="error" className="px-3 py-1 rounded-pill fw-bold">Cancelled</Tag>
                ) : (
                  <Tag color="success" className="px-3 py-1 rounded-pill fw-bold">Confirmed</Tag>
                )}
              </div>

              <div className="row g-3 p-3 bg-white rounded-3 mb-3 border">
                <div className="col-6">
                  <span className="text-muted small d-block">Check-In</span>
                  <span className="fw-bold text-dark"><i className="fa-regular fa-calendar-check text-success me-1"></i> {booking.fromDate}</span>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Check-Out</span>
                  <span className="fw-bold text-dark"><i className="fa-regular fa-calendar-xmark text-danger me-1"></i> {booking.toDate}</span>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Total Paid</span>
                  <span className="fw-bold text-warning fs-5">₹{booking.totalamt}</span>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Transaction ID</span>
                  <span className="text-dark small font-monospace text-truncate d-block">{booking.transactionId}</span>
                </div>
              </div>

              {!isCancelled && (
                <div className="text-end mt-auto pt-2">
                  <button
                    className="btn btn-outline-danger btn-sm rounded-pill px-4"
                    onClick={() => cancelBooking(booking._id, booking.roomid)}
                  >
                    <i className="fa-solid fa-ban me-1"></i> Cancel Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
