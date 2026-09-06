import { useEffect, useState } from 'react';
import { feedbackAPI } from '../services/api';

export default function AdminFeedback() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    feedbackAPI.getAllAdmin()
      .then((res) => setItems(res.data.feedback))
      .catch((err) => setError(err.response?.status === 403 ? 'Not authorized.' : 'Failed to load feedback.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleToggle = async (id) => {
    try {
      await feedbackAPI.togglePublic(id);
      load();
    } catch {
      setError('Failed to update visibility.');
    }
  };

  if (loading) return <p className="text-center py-10 text-sm text-gray-400">Loading...</p>;
  if (error) return <p className="text-center py-10 text-sm text-red-600">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Feedback (admin)</h1>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex justify-between items-start gap-4">
            <div>
              <p className="text-sm text-gray-800 mb-1">{item.message}</p>
              <p className="text-xs text-gray-400">
                {item.name || 'Anonymous'}{item.email ? ` · ${item.email}` : ''} · {new Date(item.created_at).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => handleToggle(item.id)}
              className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-md ${
                item.is_public ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {item.is_public ? 'Public' : 'Private'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
