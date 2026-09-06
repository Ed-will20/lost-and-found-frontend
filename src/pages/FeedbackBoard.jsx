import { useEffect, useState } from 'react';
import { feedbackAPI } from '../services/api';
import { MessageSquareText } from 'lucide-react';

export default function FeedbackBoard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    feedbackAPI.getPublic()
      .then((res) => setItems(res.data.feedback))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Feedback board</h1>
      <p className="text-sm text-gray-500 mb-6">A few things people have shared about the site.</p>

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-400">Nothing here yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <MessageSquareText className="h-4 w-4 text-blue-600 mb-2" />
              <p className="text-sm text-gray-700 mb-3">{item.message}</p>
              <p className="text-xs text-gray-400">{item.name || 'Anonymous'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
