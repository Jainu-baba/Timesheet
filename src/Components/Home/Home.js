import React from "react";
import "./Home.css"
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="mainButton">
        <Button variant="contained" size="large" onClick={() => navigate("/employee")}>Employee</Button>
        <Button variant="contained" size="large" onClick={() => navigate("/manager")}>Manager</Button>
      </div>

    </div>
  );
};

export default Home;
