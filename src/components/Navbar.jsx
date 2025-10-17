import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Hospital
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
          aria-controls="nav"
          aria-expanded="false"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {user?.role === "admin" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/patients">
                    Manage Patients
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/doctors">
                    Manage Doctors
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/manage-bookings">
                    Appointments
                  </Link>
                </li>
              </>
            )}

            {user?.role === "doctor" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/appointment-status">
                    Appointment Status
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/doctor-prescriptions">
                    Prescriptions
                  </Link>
                </li>
              </>
            )}

            {user?.role === "user" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/book">
                    Book Appointment
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-bookings">
                    My Bookings
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-prescriptions">
                    My Prescriptions
                  </Link>
                </li>
              </>
            )}

            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>

          {user && (
            <div className="d-flex align-items-center">
              <span className="navbar-text me-3 fw-bold text-dark">
                👤 {user.name} ({user.role})
              </span>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
