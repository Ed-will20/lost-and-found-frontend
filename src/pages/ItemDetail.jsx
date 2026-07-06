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
  const [claimData, setClaimData] = useState({ proof_description: '', proof_images: [] });
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => { fetchItem(); }, [id]);

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
    if (!user) { navigate('/login'); return; }
    setSubmitting(true);
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('proof_description', claimData.proof_description);
      claimData.proof_images.forEach(image => formData.append('proof_images', image));
      await claimsAPI.create(id, formData);
      setMessage(
        isLost
          ? 'Submitted! The owner will review your proof and reach out if it matches.'
          : 'Claim submitted! The finder will review it.'
      );
      setShowClaimForm(false);
      setClaimData({ proof_description: '', proof_images: [] });
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!item) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Item not found</p>
    </div>
  );

  const isLost = item.post_type === 'lost';
  const isOwner = user && user.id === item.user_id;
  const images = item.images || [];
  const resolveImg = (img) => img.startsWith('https://') ? img : `${API_BASE_URL}${img}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:text-blue-700 mb-5 text-sm">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Image section — full width on mobile, half on md+ */}
        {images.length > 0 && (
          <div className="md:hidden">
            <img
              src={resolveImg(images[activeImg])}
              alt={item.title}
              className="w-full h-64 object-cover"
            />
            {images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={resolveImg(img)}
                    alt={`${item.title} ${idx + 1}`}
                    onClick={() => setActiveImg(idx)}
                    className={`h-16 w-16 flex-shrink-0 object-cover rounded cursor-pointer border-2 transition-colors ${
                      activeImg === idx ? 'border-blue-500' : 'border-transparent'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="md:flex">
          {/* Desktop image column */}
          <div className="hidden md:block md:w-1/2">
            {images.length > 0 ? (
              <>
                <img
                  src={resolveImg(images[activeImg])}
                  alt={item.title}
                  className="w-full h-96 object-cover"
                />
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 p-3">
                    {images.map((img, idx) => (
                      <img
                        key={idx}
                        src={resolveImg(img)}
                        alt={`${item.title} ${idx + 1}`}
                        onClick={() => setActiveImg(idx)}
                        className={`h-20 w-full object-cover rounded cursor-pointer border-2 transition-colors ${
                          activeImg === idx ? 'border-blue-500' : 'border-transparent opacity-75 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="h-96 bg-gray-200 flex items-center justify-center">
                <MapPin className="h-24 w-24 text-gray-400" />
              </div>
            )}
          </div>

          {/* Details column */}
          <div className="md:w-1/2 p-5 sm:p-8">
            <div className="mb-4 flex gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isLost ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {isLost ? 'LOST' : 'FOUND'}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                item.status === 'found' ? 'bg-green-100 text-green-800' :
                item.status === 'claimed' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {item.status === 'found' ? 'ACTIVE' : item.status.toUpperCase()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{item.title}</h1>

            <div className="space-y-3 mb-6 text-sm">
              <div className="flex items-start text-gray-600">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">{isLost ? 'Last seen at:' : 'Found at:'}</p>
                  <p>{item.found_address}</p>
                  <p>{item.found_city}, {item.found_state} {item.found_zip}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                <p>{isLost ? 'Lost on' : 'Found on'} {new Date(item.found_date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center text-gray-600">
                <User className="h-4 w-4 mr-2 flex-shrink-0" />
                <p>Posted by {item.finder_name}</p>
              </div>
            </div>

            <div className="border-t pt-5 mb-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-700 text-sm whitespace-pre-line">{item.description}</p>
            </div>

            {item.tags && item.tags.length > 0 && (
              <div className="mb-5">
                <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Claim button / form */}
            {!isOwner && item.status === 'found' && (
              <div>
                {!showClaimForm ? (
                  <button
                    onClick={() => user ? setShowClaimForm(true) : navigate('/login')}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium text-sm"
                  >
                    {isLost ? 'I Found This Item' : 'Claim This Item'}
                  </button>
                ) : (
                  <div className="border-t pt-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                          className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50"
                        >
                          {submitting ? 'Submitting...' : (isLost ? 'Submit' : 'Submit Claim')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowClaimForm(false)}
                          className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 text-sm font-medium"
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
              <div className={`mt-4 p-4 rounded-lg text-sm ${
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
