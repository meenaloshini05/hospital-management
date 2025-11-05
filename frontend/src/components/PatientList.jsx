import React, { useEffect, useState } from "react";
import API from "../api";

export default function PatientList() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");

  // ✅ Fetch all patient bookings
  const fetchBookings = async (query = "") => {
    try {
      const res = await API.get(`/patients${query}`);
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ✅ Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() === "") {
      fetchBookings();
    } else {
      fetchBookings(`?doctorName=${search}`);
    }
  };

  // ✅ Update doctor status
  // const updateStatus = async (id, status) => {
  //   try {
  //     await API.put(`/patients/${id}/status`, {
  //       doctorStatus: status,
  //     });
  //     fetchBookings();
  //   } catch (err) {
  //     console.error("Error updating status:", err);
  //   }
  // };

  // ✅ Delete record
  const handleDelete = async (id) => {
    if (window.confirm("Delete this record?")) {
      try {
        await API.delete(`/patients/${id}`);
        fetchBookings();
      } catch (err) {
        console.error("Error deleting:", err);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-3 text-decoration-underline">
        Patient List
      </h3>

      {/* 🔍 Search Bar */}
      <form onSubmit={handleSearch} className="d-flex justify-content-end mb-3">
        <input
          type="text"
          placeholder="Search by Doctor ID or Doctor Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-control me-2 w-50"
        />
        <button className="btn btn-primary" type="submit">
          Search
        </button>
      </form>

      {/* 🧾 Table */}
      <table className="table table-bordered  table-striped">
        <thead className="table-dark text-center">
          <tr>
            <th>Patient ID</th>
            <th>Patient Name</th>
            <th>Doctor Name</th>
            <th>Specialist</th>
            <th>Date</th>
            <th>Time</th>
            <th>Doctor Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings.map((b) => (
              <tr key={b._id}>
                <td>{b.patientId}</td>
                <td>{b.patientName}</td>
                <td>{b.doctorName}</td>
                <td>{b.specialist}</td>
                <td>{b.date}</td>
                <td>{b.time}</td>
                <td>{b.doctorStatus}</td>
                <td>
                  {/* <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => updateStatus(b._id, "Reviewed")}
                  >
                    Reviewed
                  </button>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => updateStatus(b._id, "Not Reviewed")}
                  >
                    Not Reviewed
                  </button> */}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(b._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No data found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
