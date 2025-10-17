import React, { useEffect, useState } from "react";

import API from "../api";

function AppointmentStatus() {
  const [appointments, setAppointments] = useState([]);
  const doctorEmail = localStorage.getItem("doctorEmail"); // from login

  // ✅ Get logged-in doctor data from localStorage
  const doctor = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchAppointments();
  }, [doctor]);

  const fetchAppointments = async () => {
    try {
      if (!doctor?.email) {
        setError("Doctor email not found in localStorage");
        return;
      }
      const res = await API.get(
        `/doctor/appointments?doctorEmail=${doctor.email}`
      );
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  const updateStatus = async (id, doctorStatus) => {
    try {
      await API.put(`/doctor/appointments/${id}/Status`, { doctorStatus });
      fetchAppointments();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const deleteAppointment = async (id) => {
    try {
      await API.delete(`/doctor/appointments/${id}`);
      fetchAppointments();
    } catch (err) {
      console.error("Error deleting appointment:", err);
    }
  };

  return (
    <div className="container">
      <h3 className="my-4 text-center text-decoration-underline">
        Appointment Status
      </h3>
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Patient Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length > 0 ? (
            appointments.map((a) => (
              <tr key={a._id}>
                <td>{a.patientName}</td>
                <td>{a.date}</td>
                <td>{a.time}</td>
                <td>{a.doctorStatus}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => updateStatus(a._id, "Reviewed")}
                  >
                    Reviewed
                  </button>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => updateStatus(a._id, "Not Reviewed")}
                  >
                    Not Reviewed
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteAppointment(a._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No appointments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AppointmentStatus;
