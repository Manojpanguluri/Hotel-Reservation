import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Swal from "sweetalert2";
import { Tabs, Tag } from "antd";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function Adminscreen() {
  const navigate = useNavigate();
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
    if (!currentUser || !currentUser.isAdmin) {
      Swal.fire("Access Denied", "You must be an administrator to access the admin portal.", "warning");
      navigate("/home");
    }
  }, [currentUser, navigate]);

  if (!currentUser || !currentUser.isAdmin) return null;

  const tabItems = [
    {
      key: "1",
      label: (
        <span>
          <i className="fa-solid fa-list-check me-2"></i> All Bookings
        </span>
      ),
      children: <Bookings />,
    },
    {
      key: "2",
      label: (
        <span>
          <i className="fa-solid fa-bed me-2"></i> Manage Rooms
        </span>
      ),
      children: <Rooms />,
    },
    {
      key: "3",
      label: (
        <span>
          <i className="fa-solid fa-plus-circle me-2"></i> Add New Room
        </span>
      ),
      children: <AddRoom />,
    },
    {
      key: "4",
      label: (
        <span>
          <i className="fa-solid fa-users me-2"></i> Registered Users
        </span>
      ),
      children: <Users />,
    },
  ];

  return (
    <div className="container container-xl py-5 text-start">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <span className="section-tag">Management Portal</span>
          <h2 className="section-heading mb-0">Admin Dashboard</h2>
        </div>
        <div className="badge bg-dark text-warning fs-6 px-3 py-2 rounded-pill">
          <i className="fa-solid fa-user-shield me-1"></i> Admin Privileges Active
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
        <Tabs defaultActiveKey="1" items={tabItems} size="large" />
      </div>
    </div>
  );
}

export default Adminscreen;

// ---------------- BOOKINGS TAB ----------------
export function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/bookings/getallbookings`);
        setBookings(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalRevenue = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((acc, curr) => acc + (curr.totalamt || 0), 0);

  if (loading) return <Loader />;

  return (
    <div>
      {/* METRIC CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="p-3 bg-light rounded-4 border">
            <div className="text-muted small">Total Bookings</div>
            <div className="fs-3 fw-bold text-dark">{bookings.length}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-3 bg-light rounded-4 border">
            <div className="text-muted small">Confirmed Bookings</div>
            <div className="fs-3 fw-bold text-success">
              {bookings.filter((b) => b.status !== "cancelled").length}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-3 bg-light rounded-4 border">
            <div className="text-muted small">Total Revenue Generated</div>
            <div className="fs-3 fw-bold text-warning">₹{totalRevenue}</div>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle border">
          <thead className="table-dark">
            <tr>
              <th>Booking ID</th>
              <th>User ID</th>
              <th>Room Suite</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((b) => (
                <tr key={b._id}>
                  <td className="font-monospace small">{b._id}</td>
                  <td className="font-monospace small">{b.userid}</td>
                  <td className="fw-semibold text-dark">{b.room}</td>
                  <td>{b.fromDate}</td>
                  <td>{b.toDate}</td>
                  <td className="fw-bold">₹{b.totalamt}</td>
                  <td>
                    {b.status === "cancelled" ? (
                      <Tag color="error">Cancelled</Tag>
                    ) : (
                      <Tag color="success">Confirmed</Tag>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-muted">
                  No bookings found in system.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------- ROOMS TAB ----------------
export function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/rooms/getallrooms`);
        setRooms(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="fw-bold text-dark fs-5">Active Accommodations ({rooms.length})</span>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle border">
          <thead className="table-dark">
            <tr>
              <th>Room ID</th>
              <th>Suite Name</th>
              <th>Type</th>
              <th>Rent / Night</th>
              <th>Capacity</th>
              <th>Contact Phone</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <tr key={room._id}>
                  <td className="font-monospace small">{room._id}</td>
                  <td className="fw-semibold text-dark">{room.name}</td>
                  <td><Tag color="gold">{room.type}</Tag></td>
                  <td className="fw-bold">₹{room.rentperday}</td>
                  <td>{room.maxcount} Guests</td>
                  <td>{room.phonenumber}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">
                  No rooms found in database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------- USERS TAB ----------------
export function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/user/getallusers`);
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="fw-bold text-dark fs-5">Registered Guests ({users.length})</span>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle border">
          <thead className="table-dark">
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email Address</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u._id}>
                  <td className="font-monospace small">{u._id}</td>
                  <td className="fw-semibold text-dark">{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    {u.isAdmin ? (
                      <Tag color="gold">Administrator</Tag>
                    ) : (
                      <Tag color="blue">Standard Guest</Tag>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-muted">
                  No registered users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------- ADD ROOM TAB ----------------
export function AddRoom() {
  const [loading, setloading] = useState(false);
  const [name, setname] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [rentperday, setrentperday] = useState("");
  const [maxcount, setmaxcount] = useState("");
  const [description, setdescription] = useState("");
  const [phonenumber, setphonenumber] = useState("");
  const [type, settype] = useState("Luxury");
  const [imageurl1, setImageurl1] = useState("/images/rooms/deluxe-suite.jpg");
  const [imageurl2, setImageurl2] = useState("/images/rooms/ocean-view.jpg");
  const [imageurl3, setImageurl3] = useState("/images/rooms/executive-suite.jpg");

  async function addRoom(e) {
    if (e) e.preventDefault();

    if (!name || !rentperday || !maxcount || !description || !phonenumber || !type) {
      Swal.fire("Missing Fields", "Please complete all required fields.", "warning");
      return;
    }

    const newroom = {
      name,
      roomNumber,
      rentperday: Number(rentperday),
      maxcount: Number(maxcount),
      description,
      phonenumber: Number(phonenumber),
      type,
      imageurls: [imageurl1, imageurl2, imageurl3].filter(Boolean),
    };

    try {
      setloading(true);
      await axios.post(`${API_URL}/api/rooms/addroom`, newroom);
      setloading(false);
      Swal.fire("Room Added!", "New hotel room suite created successfully.", "success").then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Error adding room:", error);
      setloading(false);
      Swal.fire("Error", "Failed to add room.", "error");
    }
  }

  return (
    <div className="card border-0 p-3 bg-light rounded-4">
      <h5 className="font-serif fw-bold text-dark mb-3">Add New Suite / Accommodation</h5>
      {loading && <Loader />}
      <form onSubmit={addRoom}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label small fw-bold text-secondary">Room / Suite Name</label>
            <input
              type="text"
              placeholder="e.g. Royal Penthouse Suite"
              className="form-control"
              value={name}
              onChange={(e) => setname(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
  <label className="form-label small fw-bold text-secondary">
    Room Number
  </label>
  <input
    type="text"
    placeholder="e.g. 103"
    className="form-control"
    value={roomNumber}
    onChange={(e) => setRoomNumber(e.target.value)}
    required
  />
</div>
          <div className="col-md-6">
            <label className="form-label small fw-bold text-secondary">Rent Per Day (₹)</label>
            <input
              type="number"
              placeholder="e.g. 2500"
              className="form-control"
              value={rentperday}
              onChange={(e) => setrentperday(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-bold text-secondary">Max Occupancy (Guests)</label>
            <input
              type="number"
              placeholder="e.g. 3"
              className="form-control"
              value={maxcount}
              onChange={(e) => setmaxcount(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-bold text-secondary">Concierge Phone Number</label>
            <input
              type="text"
              placeholder="e.g. 9876543210"
              className="form-control"
              value={phonenumber}
              onChange={(e) => setphonenumber(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-bold text-secondary">Suite Type</label>
            <select
              className="form-control"
              value={type}
              onChange={(e) => settype(e.target.value)}
            >
              <option value="Luxury">Luxury Suite</option>
              <option value="Executive">Executive Suite</option>
              <option value="Penthouse">Penthouse Villa</option>
              <option value="Non-Delux">Standard Room</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-bold text-secondary">Primary Image URL</label>
            <input
              type="text"
              className="form-control"
              placeholder="Image URL 1"
              value={imageurl1}
              onChange={(e) => setImageurl1(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-bold text-secondary">Secondary Image URL</label>
            <input
              type="text"
              className="form-control"
              placeholder="Image URL 2"
              value={imageurl2}
              onChange={(e) => setImageurl2(e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-bold text-secondary">Tertiary Image URL</label>
            <input
              type="text"
              className="form-control"
              placeholder="Image URL 3"
              value={imageurl3}
              onChange={(e) => setImageurl3(e.target.value)}
            />
          </div>

          <div className="col-12">
            <label className="form-label small fw-bold text-secondary">Suite Description</label>
            <textarea
              rows="3"
              className="form-control h-auto"
              placeholder="Provide a detailed description of amenities, bedding, view, etc."
              value={description}
              onChange={(e) => setdescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="col-12 text-end mt-3">
            <button type="submit" className="btn btn-gold px-5 rounded-pill" disabled={loading}>
              <i className="fa-solid fa-plus me-1"></i> Save Room to System
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
