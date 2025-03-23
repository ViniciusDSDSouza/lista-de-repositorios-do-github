import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "../App";
import Repositories from "../components/Repositories";
import CreateRepository from "../components/CreateRepository";
import RepoSearch from "../components/RepoSearch";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/repos" element={<Repositories />} />
        <Route path="/create-repo" element={<CreateRepository />} />
        <Route path="/repo-search" element={<RepoSearch />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
