import { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';

function App() {
  const [user, setUser] = useState(undefined); // undefined = loading

  useEffect(() => {
    fetch('/auth/me')
      .then(r => r.json())
      .then(data => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return user ? (
    <Dashboard user={user} setUser={setUser} />
  ) : (
    <Landing />
  );
}

export default App;
