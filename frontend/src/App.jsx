import React from "react";

function App() {
  const handleLogin = () => {
    const backendUrl =
      "https://bookish-guacamole-9rxx6x766x5c49r-3000.app.github.dev";

    const loginUrl = `${backendUrl}/auth/github`;

    window.location.href = loginUrl;
  };

  return (
    <header>
      <button onClick={handleLogin}>Login with GitHub</button>
    </header>
  );
}

export default App;
