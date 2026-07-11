import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemsAPI } from '../services/api';
import { Upload, MapPin } from 'lucide-react';

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
  'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
  'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
  'Wisconsin','Wyoming',
];

export default function PostItem() {
  const [postType, setPostType] = useState('found');
  const [formData, setFormData] = useState({
    title: '', description: '', category: '',
    found_address: '', found_city: '', found_state: '',
    found_zip: '', found_date: '', tags: '',
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isLost = postType === 'lost';

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleImageChange = (e) => setImages(Array.from(e.target.files));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (images.length === 0) {
      setError(`Please upload at least one image ${isLost ? 'to help others recognize the item' : 'of the item'}.`);
      return;
    }
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      data.append('post_type', postType);
      images.forEach(image => data.append('images', image));
      await itemsAPI.create(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-xl shadow-md p-5 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          Post {isLost ? 'Lost' : 'Found'} Item
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {isLost
            ? 'Posting a lost item lets others browse it and, if they find it, submit proof and connect with you to arrange the return.'
            : "Posting a found item creates a listing others can browse and submit proof to claim. You'll review claims and approve the one with the best proof."}
        </p>

        {/* Lost / Found toggle */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">What are you posting?</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPostType('found')}
              className={`py-3 px-4 rounded-lg border text-sm font-medium transition-colors ${
                !isLost ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              I Found an Item
            </button>
            <button
              type="button"
              onClick={() => setPostType('lost')}
              className={`py-3 px-4 rounded-lg border text-sm font-medium transition-colors ${
                isLost ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              I Lost an Item
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Brown Leather Wallet"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder={isLost ? "Describe the item and any identifying details..." : "Describe the item in detail..."}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Select category</option>
              <option value="wallet">Wallet</option>
              <option value="phone">Phone</option>
              <option value="keys">Keys</option>
              <option value="jewelry">Jewelry</option>
              <option value="electronics">Electronics</option>
              <option value="documents">Documents</option>
              <option value="clothing">Clothing</option>
              <option value="shoes">Shoes</option>
              <option value="bags">Bags</option>
              <option value="books">Books</option>
              <option value="id_passport">ID / Passport</option>
              <option value="glasses">Glasses</option>
              <option value="headphones">Headphones</option>
              <option value="bicycle">Bicycle</option>
              <option value="pet">Pet</option>
              <option value="luggage">Luggage</option>
              <option value="sports_equipment">Sports Equipment</option>
              <option value="umbrella">Umbrella</option>
              <option value="musical_instrument">Musical Instrument</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Upload className="inline h-4 w-4 mr-1" />
              Upload Images (up to 5) *
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {images.length > 0 && (
              <p className="mt-2 text-sm text-gray-600">{images.length} image(s) selected</p>
            )}
          </div>

          {/* Location */}
          <div className="border-t pt-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {isLost ? 'Last Seen Location' : 'Location Where Found'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="found_address"
                  value={formData.found_address}
                  onChange={handleChange}
                  placeholder="123 Main St"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="found_city"
                    value={formData.found_city}
                    onChange={handleChange}
                    placeholder="Los Angeles"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <select
                    name="found_state"
                    value={formData.found_state}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">State</option>
                    {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                  <input
                    type="text"
                    name="found_zip"
                    value={formData.found_zip}
                    onChange={handleChange}
                    placeholder="90001"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isLost ? 'Date Lost' : 'Date Found'}
                  </label>
                  <input
                    type="date"
                    name="found_date"
                    value={formData.found_date}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Removed lat/lng fields — confusing for regular users on mobile */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="wallet, brown, leather"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Posting...' : `Post ${isLost ? 'Lost' : 'Found'} Item`}
          </button>
        </form>
      </div>
    </div>
  );
}
