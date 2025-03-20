import React from "react";

function App() {
  const handleLogin = () => {
    const baseUrl = window.location.origin;

    const loginUrl = `${baseUrl}/auth/github`;

    window.location.href = loginUrl;
  };

  return (
    <header>
      <button onClick={handleLogin}>Login with GitHub</button>
    </header>
  );
}

export default App;
