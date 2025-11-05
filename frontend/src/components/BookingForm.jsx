import React, { useEffect, useState } from "react";
import API from "../api";

export default function BookingForm() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    patientId: "",
    patientName: "",
    patientAge: "",
    patientAddress: "",
    patientMobile: "",
    patientEmail: "",
    disease: "",
    doctorEmail: "",
    doctorName: "", // to be filled when selecting doctor
    specialist: "", // likewise
    date: "",
    time: "",
    status: "pending",
    doctorStatus: "Not Reviewed",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // fetch the list of doctors
    API.get("/doctors")
      .then((res) => {
        setDoctors(res.data);
      })
      .catch((err) => {
        console.error("Error fetching doctors:", err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "doctorEmail") {
      // when doctor selection changes, populate doctorName & specialist
      const selected = doctors.find((d) => d.email === value);
      if (selected) {
        setForm({
          ...form,
          doctorEmail: value,
          doctorName: selected.doctorName,
          specialist: selected.specialist,
        });
      } else {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Basic front-end validation: ensure required fields are filled
    if (
      !form.patientId ||
      !form.patientName ||
      !form.patientAge ||
      !form.patientAddress ||
      !form.patientMobile ||
      !form.patientEmail ||
      !form.doctorEmail ||
      !form.doctorName ||
      !form.specialist ||
      !form.date ||
      !form.time
    ) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      console.log("Submitting booking:", form);
      const res = await API.post("/bookings", form);
      console.log("Booking created:", res.data);
      alert("Appointment booked successfully!");
      // reset form
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
    } catch (err) {
      console.error("Error booking appointment:", err);
      const msg =
        err.response?.data?.message ||
        JSON.stringify(err.response?.data) ||
        err.message ||
        "Booking failed";
      setError(msg);
    }
  };

  return (
    <div className="container mt-4 col-md-8">
      <h3 className="text-center mb-4 text-decoration-underline">
        Book Appointment
      </h3>

      <form onSubmit={handleSubmit} className="card p-4 shadow">
        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Patient ID</label>
            <input
              type="text"
              className="form-control"
              name="patientId"
              value={form.patientId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Patient Name</label>
            <input
              type="text"
              className="form-control"
              name="patientName"
              value={form.patientName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Age</label>
            <input
              type="number"
              className="form-control"
              name="patientAge"
              value={form.patientAge}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Mobile Number</label>
            <input
              type="tel"
              className="form-control"
              name="patientMobile"
              value={form.patientMobile}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Patient Email</label>
            <input
              type="email"
              className="form-control"
              name="patientEmail"
              value={form.patientEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Address</label>
            <input
              type="text"
              className="form-control"
              name="patientAddress"
              value={form.patientAddress}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-12 mb-3">
            <label>Disease / Symptoms</label>
            <input
              type="text"
              className="form-control"
              name="disease"
              value={form.disease}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Doctor</label>
            <select
              className="form-select"
              name="doctorEmail"
              value={form.doctorEmail}
              onChange={handleChange}
              required
            >
              <option value="">Select Doctor</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc.email}>
                  {doc.doctorName} — {doc.specialist}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label>Date</label>
            <input
              type="date"
              className="form-control"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Time</label>
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

        <button type="submit" className="btn btn-primary mt-3 w-100">
          Book Appointment
        </button>
      </form>
    </div>
  );
}
