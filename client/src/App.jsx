import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';

function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-bold text-indigo-400 mb-3">AI Capsule</h1>
        <p className="text-gray-400 mb-6">
          Sign in with GitHub to access your protected prompt dashboard.
        </p>
        <a
          href="/auth/github"
          className="inline-flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition w-full"
        >
          Sign in with GitHub
        </a>
      </div>
    </div>
  );
}

function ProtectedRoute({ user, loading, children }) {
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/auth/me')
      .then((r) => r.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute user={user} loading={loading}>
            <Dashboard user={user} setUser={setUser} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
