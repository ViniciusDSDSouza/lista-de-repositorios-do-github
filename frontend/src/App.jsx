import React from "react";

function App() {
  const handleLogin = () => {
    const backendUrl =
      "http://localhost:3000";

    const loginUrl = `${backendUrl}/auth/github`;

    window.location.href = loginUrl;
  };

  return (
    <header>
      <h1>Login com Github</h1>
      <button onClick={handleLogin}>Login with GitHub</button>
    </header>
  );
}

export default App;
