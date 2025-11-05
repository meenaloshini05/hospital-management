import React from "react";
import "./frontpage.css";
import { useNavigate } from "react-router-dom";

function Frontpage() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5 ">
      <div className="row mt-5">
        <div className="col-6 ">
          <div>
            <h2 className="head-title">Bringing</h2>
            <h2 className="hero-title ">
              Healthcare of International Standard
            </h2>
            <h2 className="head-title">Within the reach of every individual</h2>
          </div>
        </div>
        <div className="col p-5">
          <img
            src={"healthcare.svg"}
            alt="banner"
            className="img-fluid"
            width={500}
            height={350}
          />
        </div>
      </div>
    </div>
  );
}

export default Frontpage;
