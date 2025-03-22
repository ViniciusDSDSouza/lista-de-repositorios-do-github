import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "../App";
import Repositories from "../components/Repositories";
import CreateRepository from "../components/CreateRepository";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/repos" element={<Repositories />} />
        <Route path="/create-repo" element={<CreateRepository />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
