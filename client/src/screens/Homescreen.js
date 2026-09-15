import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import { DatePicker } from "antd";
import { useSearchParams } from "react-router-dom";

const { RangePicker } = DatePicker;
const API_URL = process.env.REACT_APP_API_URL;

function Homescreen() {
  const [searchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [duplicateRooms, setDuplicateRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [fromDate, setFromDate] = useState(searchParams.get("fromDate") || "");
  const [toDate, setToDate] = useState(searchParams.get("toDate") || "");
  const [searchKey, setSearchKey] = useState("");
  const [type, setType] = useState("all");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const data = (await axios.get(`${API_URL}/api/rooms/getallrooms`)).data;

        // Ensure imageurls has clean local fallbacks if empty or remote broken
        const formattedRooms = data.map((room) => {
          const fallbackImg =
            room.type.toLowerCase().includes("luxury") || room.type.toLowerCase().includes("delux")
              ? "/images/rooms/deluxe-suite.jpg"
              : "/images/rooms/executive-suite.jpg";

          const urls = (room.imageurls && room.imageurls.length > 0 && room.imageurls[0])
            ? room.imageurls
            : [fallbackImg, "/images/rooms/ocean-view.jpg", "/images/rooms/family-suite.jpg"];

          return { ...room, imageurls: urls };
        });

        setDuplicateRooms(formattedRooms);
        applyFilters(formattedRooms, searchKey, type, fromDate, toDate);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const isRoomAvailable = (room, reqFromStr, reqToStr) => {
    if (!reqFromStr || !reqToStr || !room.currentbookings || room.currentbookings.length === 0) {
      return true;
    }
    const reqFrom = moment(reqFromStr, "DD-MM-YYYY");
    const reqTo = moment(reqToStr, "DD-MM-YYYY");

    for (const booking of room.currentbookings) {
      if (booking.status === "cancelled") continue;
      const bFrom = moment(booking.fromDate, "DD-MM-YYYY");
      const bTo = moment(booking.toDate, "DD-MM-YYYY");

      if (reqFrom.isSameOrBefore(bTo) && reqTo.isSameOrAfter(bFrom)) {
        return false;
      }
    }
    return true;
  };

  const applyFilters = (allRooms, search, roomType, from, to) => {
    let filtered = [...allRooms];

    // Search by Keyword
    if (search.trim() !== "") {
      filtered = filtered.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Room Type Filter
    if (roomType !== "all") {
      filtered = filtered.filter((r) =>
        r.type.toLowerCase().includes(roomType.toLowerCase())
      );
    }

    // Date Availability Filter
    if (from && to) {
      filtered = filtered.filter((r) => isRoomAvailable(r, from, to));
    }

    setRooms(filtered);
  };

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      const from = moment(dates[0].toDate()).format("DD-MM-YYYY");
      const to = moment(dates[1].toDate()).format("DD-MM-YYYY");
      setFromDate(from);
      setToDate(to);
      applyFilters(duplicateRooms, searchKey, type, from, to);
    } else {
      setFromDate("");
      setToDate("");
      applyFilters(duplicateRooms, searchKey, type, "", "");
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchKey(val);
    applyFilters(duplicateRooms, val, type, fromDate, toDate);
  };

  const handleTypeChange = (e) => {
    const val = e.target.value;
    setType(val);
    applyFilters(duplicateRooms, searchKey, val, fromDate, toDate);
  };

  return (
    <div className="container container-xl py-4">
      {/* FILTER & SEARCH BAR */}
      <div className="card border-0 shadow-sm p-4 rounded-4 mb-5 bg-white">
        <div className="row g-3 align-items-center">
          <div className="col-lg-4 col-md-6">
            <label className="form-label small fw-bold text-uppercase text-secondary mb-1">
              <i className="fa-regular fa-calendar-days text-warning me-1"></i> Dates of Stay
            </label>
            <RangePicker
              className="w-100"
              format="DD-MM-YYYY"
              defaultValue={
                fromDate && toDate
                  ? [moment(fromDate, "DD-MM-YYYY"), moment(toDate, "DD-MM-YYYY")]
                  : null
              }
              onChange={handleDateChange}
              disabledDate={(current) => current && current < moment().startOf("day")}
            />
          </div>

          <div className="col-lg-5 col-md-6">
            <label className="form-label small fw-bold text-uppercase text-secondary mb-1">
              <i className="fa-solid fa-magnifying-glass text-warning me-1"></i> Search Rooms
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by suite name (e.g. Deluxe, Ocean, Penthouse)..."
              value={searchKey}
              onChange={handleSearchChange}
            />
          </div>

          <div className="col-lg-3 col-md-12">
            <label className="form-label small fw-bold text-uppercase text-secondary mb-1">
              <i className="fa-solid fa-filter text-warning me-1"></i> Room Type
            </label>
            <select className="form-control" value={type} onChange={handleTypeChange}>
              <option value="all">All Accommodations</option>
              <option value="Luxury">Luxury Suites</option>
              <option value="delux">Deluxe Rooms</option>
              <option value="non-delux">Standard Rooms</option>
            </select>
          </div>
        </div>
      </div>

      {/* ROOM LISTINGS GRID */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Error message="Failed to load rooms. Please refresh or try again later." />
      ) : rooms.length === 0 ? (
        <div className="text-center py-5 my-4 bg-white rounded-4 shadow-sm p-5">
          <i className="fa-solid fa-hotel text-muted display-3 mb-3"></i>
          <h3 className="font-serif fw-bold text-dark mb-2">No Rooms Available</h3>
          <p className="text-secondary max-w-md mx-auto mb-4">
            We couldn't find any rooms matching your search criteria or dates. Try adjusting your dates or filter options.
          </p>
          <button
            className="btn btn-gold rounded-pill px-4"
            onClick={() => {
              setSearchKey("");
              setType("all");
              setFromDate("");
              setToDate("");
              applyFilters(duplicateRooms, "", "all", "", "");
            }}
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {rooms.map((room) => (
            <div className="col-12" key={room._id}>
              <Room room={room} fromDate={fromDate} toDate={toDate} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Homescreen;
