import React from "react";

const Dashboard = () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("jwt");

  if (token) {
    localStorage.setItem("jwt", token);
  }

  return (
    <div>
      <h1>Login realizado com sucesso</h1>
      <p>Bem-vindo ao Dashboard!</p>
      <p>{token}</p>
    </div>
  );
};

export default Dashboard;
