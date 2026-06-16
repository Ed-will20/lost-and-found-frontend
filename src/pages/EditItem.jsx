import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { itemsAPI } from '../services/api';
import { Upload, MapPin } from 'lucide-react';
import { API_BASE_URL } from '../config/config';

export default function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    found_address: '',
    found_city: '',
    found_state: '',
    found_zip: '',
    found_lat: '',
    found_lng: '',
    found_date: '',
    tags: '',
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await itemsAPI.getById(id);
        const item = res.data.item;
        setFormData({
          title: item.title || '',
          description: item.description || '',
          category: item.category || '',
          found_address: item.found_address || '',
          found_city: item.found_city || '',
          found_state: item.found_state || '',
          found_zip: item.found_zip || '',
          found_lat: item.found_lat || '',
          found_lng: item.found_lng || '',
          found_date: item.found_date ? item.found_date.split('T')[0] : '',
          tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
        });
        setExistingImages(item.images || []);
      } catch (err) {
        setError('Failed to load item');
      } finally {
        setFetching(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      newImages.forEach(img => data.append('images', img));
      await itemsAPI.update(id, data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update item');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Item</h1>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {existingImages.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Images</label>
              <div className="flex gap-2 flex-wrap">
                {existingImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.startsWith('https://') ? img : `${API_BASE_URL}${img}`}
                    alt={`Item ${idx + 1}`}
                    className="h-20 w-20 object-cover rounded border"
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">Uploading new images below will replace these.</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Upload className="inline h-4 w-4 mr-1" />
              Replace Images (up to 5)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {newImages.length > 0 && (
              <p className="mt-2 text-sm text-gray-600">{newImages.length} new image(s) selected</p>
            )}
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <MapPin className="inline h-5 w-5 mr-1" />
              Location Where Found
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="found_address"
                  value={formData.found_address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="found_city"
                  value={formData.found_city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  name="found_state"
                  value={formData.found_state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                <input
                  type="text"
                  name="found_zip"
                  value={formData.found_zip}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Found</label>
                <input
                  type="date"
                  name="found_date"
                  value={formData.found_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude (optional)</label>
                <input
                  type="number"
                  step="any"
                  name="found_lat"
                  value={formData.found_lat}
                  onChange={handleChange}
                  placeholder="34.0522"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude (optional)</label>
                <input
                  type="number"
                  step="any"
                  name="found_lng"
                  value={formData.found_lng}
                  onChange={handleChange}
                  placeholder="-118.2437"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="wallet, brown, leather"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
