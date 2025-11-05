import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/register", { name, email, password, role });
      alert("Registered. Please login");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container">
      <div className="row mt-5 ">
        <div className="col-3 mt-5 mb-5">
          <img
            src={"register-image.png"}
            alt="register page image"
            width={500}
            height={400}
          />
        </div>
        <div className="col-md-5 offset-md-3 mt-5 me-2">
          <form onSubmit={submit} className="card p-4 shadow">
            <h3 className="mb-3 text-decoration-underline text-center">
              Register
            </h3>
            <div className="mb-3">
              <label className="mb-1">Name</label>
              <input
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="mb-1">Email</label>
              <input
                className="form-control"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="mb-1">Password</label>
              <input
                className="form-control"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="mb-1">Role</label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button className="btn btn-success">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
}
