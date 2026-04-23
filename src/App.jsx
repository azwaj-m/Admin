import React, { useState } from 'react';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="App">
      {!isLoggedIn ? (
        <AdminLogin onLogin={setIsLoggedIn} />
      ) : (
        <Dashboard />
      )}
    </div>
  );
}

export default App;
