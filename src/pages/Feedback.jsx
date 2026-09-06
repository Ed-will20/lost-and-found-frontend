import { useEffect, useState } from 'react';
import { feedbackAPI } from '../services/api';
import { MessageSquareHeart, MessageSquareText } from 'lucide-react';

export default function Feedback() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [publicFeedback, setPublicFeedback] = useState([]);
  const [boardLoading, setBoardLoading] = useState(true);

  const loadBoard = () => {
    feedbackAPI.getPublic()
      .then((res) => setPublicFeedback(res.data.feedback))
      .catch(() => setPublicFeedback([]))
      .finally(() => setBoardLoading(false));
  };

  useEffect(loadBoard, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.message.trim()) {
      setError('Please enter a message before submitting.');
      return;
    }
    setLoading(true);
    try {
      await feedbackAPI.submit(formData);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
        {submitted ? (
          <div className="text-center py-6">
            <MessageSquareHeart className="h-10 w-10 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Thanks!</h1>
            <p className="text-gray-600">Your feedback was sent. It genuinely helps shape what gets built next.</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Got feedback?</h1>
            <p className="text-sm text-gray-500 mb-6">
              No account needed. Bugs, ideas, or just "this was confusing" -- all of it helps.
            </p>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name (optional)</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Only if you'd like a reply"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Feedback *</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="What's on your mind?"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Feedback'}
              </button>
            </form>
          </>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">What others are saying</h2>
        <p className="text-sm text-gray-500 mb-4">A few things people have shared about the site.</p>

        {boardLoading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : publicFeedback.length === 0 ? (
          <p className="text-sm text-gray-400">Nothing here yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {publicFeedback.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <MessageSquareText className="h-4 w-4 text-blue-600 mb-2" />
                <p className="text-sm text-gray-700 mb-3">{item.message}</p>
                <p className="text-xs text-gray-400">{item.name || 'Anonymous'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
