import { useState, useEffect, useCallback } from 'react';
import CapsuleForm from '../components/CapsuleForm';
import CapsuleCard from '../components/CapsuleCard';

export default function Dashboard({ user, setUser }) {
  const [capsules, setCapsules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchCapsules = useCallback(async () => {
    setFetching(true);
    try {
      const r = await fetch('/api/capsules');
      if (r.status === 401) { setUser(null); return; }
      const data = await r.json();
      setCapsules(data);
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  }, [setUser]);

  useEffect(() => { fetchCapsules(); }, [fetchCapsules]);

  const handleCreate = async (form) => {
    setLoading(true);
    try {
      const r = await fetch('/api/capsules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!r.ok) throw new Error('Failed to create');
      await fetchCapsules();
      setShowForm(false);
    } catch (e) {
      alert('Error creating capsule: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (form) => {
    setLoading(true);
    try {
      const r = await fetch(`/api/capsules/${editTarget.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!r.ok) throw new Error('Failed to update');
      await fetchCapsules();
      setEditTarget(null);
    } catch (e) {
      alert('Error updating capsule: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this capsule?')) return;
    try {
      const r = await fetch(`/api/capsules/${id}`, { method: 'DELETE' });
      if (!r.ok) throw new Error('Failed to delete');
      await fetchCapsules();
    } catch (e) {
      alert('Error deleting capsule: ' + e.message);
    }
  };

  const handleLogout = async () => {
    await fetch('/auth/logout');
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-indigo-400">🧠 AI Capsule</span>
        </div>
        <div className="flex items-center gap-4">
          {user.avatar && (
            <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full border border-gray-700" />
          )}
          <span className="text-gray-400 text-sm hidden sm:block">{user.username}</span>
          <button onClick={handleLogout}
            className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-1.5 rounded-lg">
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">My Prompt Capsules</h2>
            <p className="text-gray-500 text-sm mt-1">{capsules.length} saved prompt{capsules.length !== 1 ? 's' : ''}</p>
          </div>
          {!showForm && !editTarget && (
            <button onClick={() => setShowForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium text-sm">
              + New Capsule
            </button>
          )}
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">New Capsule</h3>
            <CapsuleForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} loading={loading} />
          </div>
        )}

        {/* Edit Form */}
        {editTarget && (
          <div className="bg-gray-900 border border-indigo-800 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Edit Capsule</h3>
            <CapsuleForm
              initial={{
                ...editTarget,
                reviewed: editTarget.reviewed === 1,
                improved: editTarget.improved === 1,
              }}
              onSubmit={handleUpdate}
              onCancel={() => setEditTarget(null)}
              loading={loading}
            />
          </div>
        )}

        {/* Capsule List */}
        {fetching ? (
          <div className="text-center text-gray-500 py-20">Loading capsules...</div>
        ) : capsules.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg mb-2">No capsules yet.</p>
            <p className="text-gray-700 text-sm">Click "+ New Capsule" to save your first prompt.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {capsules.map(c => (
              <CapsuleCard key={c.id} capsule={c} onEdit={setEditTarget} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
