import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { itemsAPI, claimsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, User, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '../config/config';

export default function ItemDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claimData, setClaimData] = useState({
    proof_description: '',
    proof_images: [],
  });
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await itemsAPI.getById(id);
      setItem(response.data.item);
    } catch (error) {
      console.error('Error fetching item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('proof_description', claimData.proof_description);
      claimData.proof_images.forEach(image => {
        formData.append('proof_images', image);
      });

      await claimsAPI.create(id, formData);
      setMessage(
        isLost
          ? 'Submitted! The owner will review your proof and reach out if it matches.'
          : 'Claim submitted successfully! The finder will review it.'
      );
      setShowClaimForm(false);
      setClaimData({ proof_description: '', proof_images: [] });
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Item not found</p>
      </div>
    );
  }

  const isLost = item.post_type === 'lost';
  const isOwner = user && user.id === item.user_id;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-1" />
        Back
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Images */}
          <div className="md:w-1/2">
            {item.images && item.images.length > 0 ? (
              <div className="h-96">
                <img
                  src={item.images[0].startsWith("https://") ? item.images[0] : `${API_BASE_URL}${item.images[0]}`}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-96 bg-gray-200 flex items-center justify-center">
                <MapPin className="h-24 w-24 text-gray-400" />
              </div>
            )}

            {item.images && item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 p-4">
                {item.images.slice(1).map((img, idx) => (
                  <img
                    key={idx}
                    src={img.startsWith("https://") ? img : `${API_BASE_URL}${img}`}
                    alt={`${item.title} ${idx + 2}`}
                    className="h-20 w-full object-cover rounded cursor-pointer hover:opacity-75"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="md:w-1/2 p-8">
            <div className="mb-4 flex gap-2">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                isLost ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {isLost ? 'LOST' : 'FOUND'}
              </span>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                item.status === 'found' ? 'bg-green-100 text-green-800' :
                item.status === 'claimed' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {item.status.toUpperCase()}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{item.title}</h1>

            <div className="space-y-3 mb-6">
              <div className="flex items-start text-gray-600">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">{isLost ? 'Last seen at:' : 'Found at:'}</p>
                  <p>{item.found_address}</p>
                  <p>{item.found_city}, {item.found_state} {item.found_zip}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-2" />
                <p>{isLost ? 'Lost on' : 'Found on'} {new Date(item.found_date).toLocaleDateString()}</p>
              </div>

              <div className="flex items-center text-gray-600">
                <User className="h-5 w-5 mr-2" />
                <p>Posted by {item.finder_name}</p>
              </div>
            </div>

            <div className="border-t pt-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{item.description}</p>
            </div>

            {item.tags && item.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Claim / Respond Button */}
            {!isOwner && item.status === 'found' && (
              <div>
                {!showClaimForm ? (
                  <button
                    onClick={() => user ? setShowClaimForm(true) : navigate('/login')}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {isLost ? 'I Found This Item' : 'Claim This Item'}
                  </button>
                ) : (
                  <div className="border-t pt-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {isLost ? 'Tell the Owner You Found It' : 'Submit Claim'}
                    </h3>

                    <form onSubmit={handleClaimSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {isLost ? 'Proof You Have This Item *' : 'Proof of Ownership *'}
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={claimData.proof_description}
                          onChange={(e) => setClaimData({ ...claimData, proof_description: e.target.value })}
                          placeholder={
                            isLost
                              ? "Describe identifying details only the owner would recognize, and where/when you found it..."
                              : "Describe how you can prove this item is yours..."
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Proof Images (optional, up to 3)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => setClaimData({ ...claimData, proof_images: Array.from(e.target.files) })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          {submitting ? 'Submitting...' : (isLost ? 'Submit' : 'Submit Claim')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowClaimForm(false)}
                          className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {message && (
              <div className={`mt-4 p-4 rounded ${
                message.includes('success') || message.includes('Submitted') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
