import React, { useEffect, useState } from "react";
import API from "../api";

export default function PatientBookingStatus() {
  const [bookings, setBookings] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (user?.email) {
      API.get(`/bookings?patientEmail=${user.email}`).then((r) =>
        setBookings(r.data)
      );
    }
  }, [user]);

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-3 text-decoration-underline">
        My Bookings
      </h3>
      {bookings.length === 0 ? (
        <p className="text-center text-muted ">No bookings found.</p>
      ) : (
        <table className="table table-bordered table-striped shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Patient ID</th>
              <th>Doctor Name</th>
              <th>Specialist</th>
              <th>Doctor Email</th>
              <th>Date</th>
              <th>Time</th>
              <th>Disease</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>{b.patientId}</td>
                <td>{b.doctorName}</td>
                <td>{b.specialist}</td>
                <td>{b.doctorEmail}</td>
                <td>{b.date}</td>
                <td>{b.time}</td>
                <td>{b.disease || "-"}</td>
                <td>
                  <span
                    className={`badge ${
                      b.status === "Reviewed"
                        ? "bg-success"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
