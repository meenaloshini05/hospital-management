import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Frontpage from "./components/Frontpage";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";

{
  /* Admin */
}
import DoctorList from "./components/DoctorList";
import ManageBookings from "./components/ManageBookings";
import PatientList from "./components/PatientList";

{
  /* Doctor */
}
import AppointmentStatus from "./components/AppointmentStatus";
import DoctorPrescription from "./components/DoctorPrescription";

{
  /* user */
}
import BookingForm from "./components/BookingForm";
import UserPrescription from "./components/UserPrescription";
import PatientBookingStatus from "./components/PatientBookingStatus";

export default function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Frontpage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route
          path="/doctors"
          element={
            <ProtectedRoute roles={["user", "admin", "doctor"]}>
              <DoctorList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <ProtectedRoute roles={["admin", "doctor"]}>
              <PatientList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-bookings"
          element={
            <ProtectedRoute roles={["admin"]}>
              <ManageBookings />
            </ProtectedRoute>
          }
        />

        {/* Doctor */}
        <Route
          path="/appointment-status"
          element={
            <ProtectedRoute roles={["doctor"]}>
              <AppointmentStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor-prescriptions"
          element={
            <ProtectedRoute roles={["doctor"]}>
              {" "}
              <DoctorPrescription />
            </ProtectedRoute>
          }
        />

        {/* user */}
        <Route
          path="/book"
          element={
            <ProtectedRoute roles={["user"]}>
              <BookingForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-prescriptions"
          element={
            <ProtectedRoute roles={["user"]}>
              <UserPrescription />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute roles={["user"]}>
              <PatientBookingStatus />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/doctors" replace />} />
      </Routes>
    </div>
  );
}
