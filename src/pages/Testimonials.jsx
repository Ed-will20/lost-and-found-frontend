import { useState, useEffect } from 'react';
import { ratingsAPI } from '../services/api';
import TestimonialCard from '../components/TestimonialCard';
import { MessageSquareQuote } from 'lucide-react';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ratingsAPI.getPublic(50)
      .then((res) => setTestimonials(res.data))
      .catch((error) => console.error('Error fetching testimonials:', error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Reviews</h1>
        <p className="text-base sm:text-lg text-gray-600">What people are saying after getting reunited with their items</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading reviews...</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <MessageSquareQuote className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">No public reviews yet. Check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      )}
    </div>
  );
}
