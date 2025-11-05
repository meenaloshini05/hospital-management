import React, { useEffect, useState } from "react";
import API from "../api";

export default function DoctorPrescription() {
  const [formData, setFormData] = useState({
    doctorName: "",
    doctorEmail: "",
    patientName: "",
    patientEmail: "",
    patientAge: "",
    diagnosis: "",
    medicines: "",
    notes: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const [prescriptions, setPrescriptions] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")); // logged-in doctor

  useEffect(() => {
    if (user?.email) {
      fetchPrescriptions();
    }
  }, [user]);

  const fetchPrescriptions = async () => {
    try {
      const res = await API.get(
        `/prescriptions/doctor?doctorEmail=${user.email}`
      );
      setPrescriptions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/prescriptions", {
        ...formData,
        doctorId: user._id,
        doctorName: user.name,
        doctorEmail: user.email,
      });
      setFormData({
        patientName: "",
        patientEmail: "",
        patientAge: "",
        diagnosis: "",
        medicines: "",
        notes: "",
      });
      alert("saved");
      fetchPrescriptions();
    } catch (err) {
      console.error("Error saving prescription:", err);
    }
  };
  const handleUpdate = async (id) => {
    try {
      await API.put(`/prescriptions/${id}`, editData);
      setEditingId(null); // close edit mode
      fetchPrescriptions(); // reload table
    } catch (err) {
      console.error("Error updating prescription:", err);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this prescription?"))
      return;
    try {
      await API.delete(`/prescriptions/${id}`);
      fetchPrescriptions(); // reload table
    } catch (err) {
      console.error("Error deleting prescription:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-decoration-underline mb-4">Doctor Prescriptions</h2>

      {/* Prescription Form */}
      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              name="patientName"
              placeholder="Patient Name"
              className="form-control"
              value={formData.patientName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="email"
              name="patientEmail"
              placeholder="Patient Email"
              className="form-control"
              value={formData.patientEmail}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              name="patientAge"
              placeholder="Age"
              className="form-control"
              value={formData.patientAge}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              name="diagnosis"
              placeholder="Diagnosis"
              className="form-control"
              value={formData.diagnosis}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              name="medicines"
              placeholder="Medicines"
              className="form-control"
              value={formData.medicines}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-12">
            <textarea
              name="notes"
              placeholder="Notes"
              className="form-control"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
        </div>
        <div class="row justify-content-center">
          <button type="submit" className="btn btn-primary  mt-3 w-50">
            Add Prescription
          </button>
        </div>
      </form>

      {/* Prescription Table */}
      <h4 className="text-decoration-underline">Prescriptions</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Email</th>
            <th>Age</th>
            <th>Diagnosis</th>
            <th>Medicines</th>
            <th>Notes</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map((p) => (
            <tr key={p._id}>
              {editingId === p._id ? (
                <>
                  <td>
                    <input
                      type="text"
                      name="patientName"
                      value={editData.patientName}
                      onChange={handleEditChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      name="patientEmail"
                      value={editData.patientEmail}
                      onChange={handleEditChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="patientAge"
                      value={editData.patientAge}
                      onChange={handleEditChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="diagnosis"
                      value={editData.diagnosis}
                      onChange={handleEditChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="medicines"
                      value={editData.medicines}
                      onChange={handleEditChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="notes"
                      value={editData.notes}
                      onChange={handleEditChange}
                      className="form-control"
                    />
                  </td>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-success me-2 mb-2"
                      onClick={() => handleUpdate(p._id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{p.patientName}</td>
                  <td>{p.patientEmail}</td>
                  <td>{p.patientAge}</td>
                  <td>{p.diagnosis}</td>
                  <td>{p.medicines}</td>
                  <td>{p.notes}</td>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => {
                        setEditingId(p._id);
                        setEditData(p); // preload form with existing data
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(p._id)}
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
