import React, { useEffect, useState } from "react";
import API from "../api";

export default function UserPrescription() {
  const [prescriptions, setPrescriptions] = useState([]); // ✅ always start with []

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (user?.email) {
      API.get(`/prescriptions/patient?patientEmail=${user.email}`)
        .then((res) => setPrescriptions(res.data || [])) // ✅ fallback empty array
        .catch((err) => {
          console.error("Error fetching prescriptions:", err);
          setPrescriptions([]); // prevent undefined
        });
    }
  }, []);

  return (
    <div className="container mt-4">
      <h3>My Prescriptions</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Doctor</th>
            <th>Diagnosis</th>
            <th>Medicines</th>
            <th>Notes</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                No prescriptions found
              </td>
            </tr>
          ) : (
            prescriptions.map((p) => (
              <tr key={p._id}>
                <td>{p.doctorName}</td>
                <td>{p.diagnosis}</td>
                <td>{p.medicines}</td>
                <td>{p.notes}</td>
                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
