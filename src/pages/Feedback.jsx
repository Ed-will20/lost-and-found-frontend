import { useState } from 'react';
import { feedbackAPI } from '../services/api';
import { MessageSquareHeart } from 'lucide-react';

export default function Feedback() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <MessageSquareHeart className="h-10 w-10 text-blue-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Thanks!</h1>
        <p className="text-gray-600">Your feedback was sent. It genuinely helps shape what gets built next.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
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
      </div>
    </div>
  );
}
