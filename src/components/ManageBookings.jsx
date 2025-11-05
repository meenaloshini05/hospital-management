import React, { useEffect, useState } from "react";
import API from "../api";

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "null"); // Logged-in user (doctor or patient)

  const [form, setForm] = useState({
    patientId: "",
    patientName: "",
    patientAge: "",
    patientAddress: "",
    patientMobile: "",
    patientEmail: "",
    disease: "",
    doctorEmail: "",
    doctorName: "", // add this
    specialist: "",
    date: "",
    time: "",
    status: "pending",
    doctorStatus: "Not Reviewed",
  });

  // ✅ Load doctors for dropdown
  const loadDoctors = async () => {
    try {
      const res = await API.get("/doctors");
      setDoctors(res.data);
    } catch (err) {
      console.error("Error loading doctors:", err);
    }
  };

  // ✅ Load doctor’s own appointments if doctor logged in
  const loadBookings = async () => {
    try {
      if (user?.role === "doctor" && user?.email) {
        const res = await API.get(`/bookings?doctorEmail=${user.email}`);
        setBookings(res.data);
      } else if (user?.role === "admin") {
        const res = await API.get("/bookings");
        setBookings(res.data);
      }
    } catch (err) {
      console.error("Error loading bookings:", err);
    }
  };

  useEffect(() => {
    loadDoctors();
    loadBookings();
  }, []);

  // ✅ Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "doctorEmail") {
      // find the selected doctor in the doctors array
      const selected = doctors.find((d) => d.email === value);
      if (selected) {
        setForm({
          ...form,
          doctorEmail: value,
          doctorName: selected.doctorName,
          specialist: selected.specialist,
        });
      } else {
        // if no selection or cleared
        setForm({
          ...form,
          doctorEmail: value,
          doctorName: "",
          specialist: "",
        });
      }
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  // ✅ Submit booking form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await API.post("/bookings", form);
      alert("Appointment booked successfully!");
      setForm({
        patientId: "",
        patientName: "",
        patientAge: "",
        patientAddress: "",
        patientMobile: "",
        patientEmail: "",
        disease: "",
        doctorEmail: "",
        doctorName: "",
        specialist: "",
        date: "",
        time: "",
        status: "pending",
        doctorStatus: "Not Reviewed",
      });
      loadBookings();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Booking failed");
    }
  };

  // ✅ Update status
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/bookings/${id}`, { status });
      loadBookings();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // ✅ Delete appointment
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?"))
      return;
    try {
      await API.delete(`/bookings/${id}`);
      loadBookings();
    } catch (err) {
      console.error("Failed to delete booking:", err);
    }
  };

  // ✅ Filter by Patient ID
  const filteredBookings = bookings.filter((b) =>
    b.patientId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-5">
      {/* ✅ Appointment Booking Form */}
      <div className="row justify-content-center">
        <div className="col-md-8">
          <form
            onSubmit={handleSubmit}
            className="p-4 border rounded bg-light shadow"
          >
            <h4 className="mb-3 text-center text-decoration-underline">
              Book Appointment
            </h4>

            <div className="row">
              <div className="col-md-6 mb-2">
                <input
                  type="text"
                  className="form-control"
                  name="patientId"
                  placeholder="Patient ID"
                  value={form.patientId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-2">
                <input
                  type="text"
                  className="form-control"
                  name="patientName"
                  placeholder="Patient Name"
                  value={form.patientName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-2">
                <input
                  type="number"
                  className="form-control"
                  name="patientAge"
                  placeholder="Patient Age"
                  value={form.patientAge}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-2">
                <input
                  type="text"
                  className="form-control"
                  name="patientAddress"
                  placeholder="Patient Address"
                  value={form.patientAddress}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-2">
                <input
                  type="text"
                  className="form-control"
                  name="patientMobile"
                  placeholder="Patient Mobile"
                  value={form.patientMobile}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-2">
                <input
                  type="email"
                  className="form-control"
                  name="patientEmail"
                  placeholder="Patient Email"
                  value={form.patientEmail}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-2">
                <input
                  type="text"
                  className="form-control"
                  name="disease"
                  placeholder="Disease"
                  value={form.disease}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-2">
                <select
                  className="form-select"
                  name="doctorEmail"
                  value={form.doctorEmail}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((d) => (
                    <option key={d._id} value={d.email}>
                      {d.doctorName} - {d.specialist}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-2">
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-2">
                <input
                  type="time"
                  className="form-control"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {error && <div className="text-danger mt-2">{error}</div>}
            {message && <div className="text-success mt-2">{message}</div>}

            <button className="btn btn-primary w-100 mt-3">
              Book Appointment
            </button>
          </form>
        </div>
      </div>

      {/* ✅ Appointment Status Table */}
      <div className="mt-5">
        <h4 className="text-center mb-3 text-decoration-underline">
          Appointment Status
        </h4>

        <div className="d-flex justify-content-end mb-3">
          <input
            type="text"
            className="form-control w-50"
            placeholder="Search by Patient ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="table table-bordered  table-striped">
          <thead className="table-dark text-center ">
            <tr>
              <th>Patient ID</th>
              <th>Patient Name</th>
              <th>Doctor Name</th>
              <th>Specialist</th>
              <th>Disease</th>
              <th>Appointment Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.patientId}</td>
                  <td>{b.patientName}</td>
                  <td>{b.doctorName}</td>
                  <td>{b.specialist}</td>
                  <td>{b.disease || "-"}</td>
                  <td>
                    {b.date ? new Date(b.date).toLocaleDateString() : "-"}
                  </td>
                  <td>{b.time}</td>
                  <td>{b.status}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => updateStatus(b._id, "Approved")}
                    >
                      Approved
                    </button>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => updateStatus(b._id, "Rejected")}
                    >
                      Rejected
                    </button>
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
                <td colSpan="9" className="text-center">
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
