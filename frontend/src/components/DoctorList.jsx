import React, { useEffect, useState } from "react";
import API from "../api";

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    doctorId: "",
    doctorName: "",
    email: "",
    doctorFrom: "",
    specialist: "",
    gender: "",
    language: "",
    dateOfJoining: "",
    dateOfBirth: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");

  const fetch = async () => {
    const res = await API.get("/doctors" + (q ? `?name=${q}` : ""));
    setDoctors(res.data);
  };

  useEffect(() => {
    fetch();
  }, []);

  const loadDoctors = async () => {
    try {
      const res = await API.get("/doctors");
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load doctors");
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/doctors/${editingId}`, form);
        setEditingId(null);
      } else {
        await API.post("/doctors", form);
      }
      setForm({
        doctorId: "",
        doctorName: "",
        email: "",
        doctorFrom: "",
        specialist: "",
        gender: "",
        language: "",
        dateOfJoining: "",
        dateOfBirth: "",
      });
      loadDoctors();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error saving doctor");
    }
  };

  const handleEdit = (doc) => {
    setEditingId(doc._id);
    setForm({
      doctorId: doc.doctorId || "",
      doctorName: doc.doctorName || "",
      email: doc.email || "",
      doctorFrom: doc.doctorFrom || "",
      specialist: doc.specialist || "",
      gender: doc.gender || "",
      language: doc.language || "",
      dateOfJoining: doc.dateOfJoining ? doc.dateOfJoining.slice(0, 10) : "",
      dateOfBirth: doc.dateOfBirth ? doc.dateOfBirth.slice(0, 10) : "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this doctor?")) return;
    try {
      await API.delete(`/doctors/${id}`);
      loadDoctors();
    } catch (err) {
      console.error(err);
      setError("Delete failed");
    }
  };

  return (
    <div className="container">
      <div className="my-4 d-flex justify-content-end">
        <input
          className="form-control me-2 w-50"
          placeholder="Search by name"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn btn-primary" onClick={fetch}>
          Search
        </button>
      </div>

      <div className="row">
        <div className="col-md-3">
          <h3 className="text-center text-decoration-underline">
            {editingId ? "Edit Doctor" : "Add Doctor"}
          </h3>
          <form onSubmit={handleSubmit}>
            <input
              className="form-control mb-2"
              name="doctorId"
              placeholder="Id"
              value={form.doctorId}
              onChange={handleChange}
              required
            />
            <input
              className="form-control mb-2"
              name="doctorName"
              placeholder="Name"
              value={form.doctorName}
              onChange={handleChange}
              required
            />
            <input
              className="form-control mb-2"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              className="form-control mb-2"
              name="doctorFrom"
              placeholder="From (state/city)"
              value={form.doctorFrom}
              onChange={handleChange}
            />
            <select
              className="form-select mb-2"
              name="specialist"
              value={form.specialist}
              onChange={handleChange}
              required
            >
              <option value="">Select Specialist</option>
              <option value="Cardiologist (Heart)">Cardiologist (Heart)</option>
              <option value="Dermatologist (Skin)">Dermatologist (Skin)</option>
              <option value="Endocrinologist (Hormones)">
                Endocrinologist (Hormones)
              </option>
              <option value="Gastroenterologist (Digestive System)">
                Gastroenterologist (Digestive System)
              </option>
              <option value="Neurologist (Brain and Nerves)">
                Neurologist (Brain and Nerves)
              </option>
              <option value="Oncologist (Cancer)">Oncologist (Cancer)</option>
              <option value="Orthopedic Surgeon (Bones)">
                Orthopedic Surgeon (Bones)
              </option>
              <option value="Pediatrician (Children)">
                Pediatrician (Children)
              </option>
              <option value="Psychiatrist (Mental Health)">
                Psychiatrist (Mental Health)
              </option>
              <option value="Pulmonologist (Lungs)">
                Pulmonologist (Lungs)
              </option>
              <option value="General">General</option>
            </select>

            <select
              className="form-select mb-2"
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="">Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <input
              className="form-control mb-2"
              name="language"
              placeholder="Language"
              value={form.language}
              onChange={handleChange}
            />
            <label className="form-label small">Date Of Joining</label>
            <input
              className="form-control mb-2"
              type="date"
              name="dateOfJoining"
              value={form.dateOfJoining}
              onChange={handleChange}
            />
            <label className="form-label small">Date Of Birth</label>
            <input
              className="form-control mb-2"
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
            />
            {error && <div className="text-danger mb-2">{error}</div>}
            <button className="btn btn-primary w-100 mb-2" type="submit">
              {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary ms-2 w-100"
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    doctorName: "",
                    email: "",
                    doctorFrom: "",
                    specialist: "",
                    gender: "",
                    language: "",
                    dateOfJoining: "",
                    dateOfBirth: "",
                  });
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        <div className="col-md-9">
          <table className="table table-bordered table-striped">
            <thead className="table-dark text-center">
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Specialist</th>
                <th>From</th>
                <th>Language</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((d) => (
                <tr key={d._id}>
                  <td>{d.doctorId}</td>
                  <td>{d.doctorName}</td>
                  <td>{d.specialist}</td>
                  <td>{d.doctorFrom}</td>
                  <td>{d.language}</td>
                  <td>{d.email}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEdit(d)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(d._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {doctors.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center">
                    No doctors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
