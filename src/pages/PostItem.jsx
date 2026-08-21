import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Upload, MapPin, School, Info, X } from 'lucide-react';

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

const MAX_IMAGES = 5;

export default function PostItem() {
  const { user } = useAuth();
  const [postType, setPostType] = useState('found');
  const [formData, setFormData] = useState({
    title: '', description: '', category: '',
    found_address: '', found_city: '', found_state: '',
    found_zip: '', found_lat: '', found_lng: '',
    found_date: '', tags: '',
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mapsReady, setMapsReady] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const navigate = useNavigate();

  const addressInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const fileInputRef = useRef(null);

  const isLost = postType === 'lost';

  // Generate/revoke object URLs for thumbnail previews whenever the
  // selected image list changes.
  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setImagePreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  // Poll for the Google Maps script (loaded via index.html) since load timing
  // isn't guaranteed relative to React mounting.
  useEffect(() => {
    if (manualMode) return;
    if (window.google && window.google.maps && window.google.maps.places) {
      setMapsReady(true);
      return;
    }
    const interval = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setMapsReady(true);
        clearInterval(interval);
      }
    }, 300);
    return () => clearInterval(interval);
  }, [manualMode]);

  // Wire up Autocomplete once the script is ready and the input exists
  useEffect(() => {
    if (manualMode || !mapsReady || !addressInputRef.current || autocompleteRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      addressInputRef.current,
      { types: ['address'], componentRestrictions: { country: 'us' } }
    );

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current.getPlace();
      if (!place || !place.address_components) return;

      const getComponent = (type) =>
        place.address_components.find((c) => c.types.includes(type))?.long_name || '';

      const streetNumber = getComponent('street_number');
      const route = getComponent('route');
      const city =
        getComponent('locality') ||
        getComponent('sublocality') ||
        getComponent('postal_town') ||
        '';
      const state = getComponent('administrative_area_level_1');
      const zip = getComponent('postal_code');
      const lat = place.geometry?.location?.lat();
      const lng = place.geometry?.location?.lng();

      setFormData((prev) => ({
        ...prev,
        found_address: [streetNumber, route].filter(Boolean).join(' '),
        found_city: city,
        found_state: state,
        found_zip: zip,
        found_lat: lat !== undefined ? String(lat) : '',
        found_lng: lng !== undefined ? String(lng) : '',
      }));
    });
  }, [mapsReady, manualMode]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Accumulate newly picked files onto the existing selection (capped at
  // MAX_IMAGES) instead of replacing it, since a raw <input type="file">
  // onChange only ever reports the files picked in that one dialog.
  const handleImageChange = (e) => {
    const selected = Array.from(e.target.files);
    setImages((prev) => [...prev, ...selected].slice(0, MAX_IMAGES));
    // Reset the input so picking the same file again after removing it works.
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSwitchToManual = () => {
    setFormData((prev) => ({
      ...prev,
      found_address: '',
      found_city: '',
      found_state: '',
      found_zip: '',
      found_lat: '',
      found_lng: '',
    }));
    autocompleteRef.current = null;
    setManualMode(true);
  };

  const handleSwitchToAutocomplete = () => {
    setFormData((prev) => ({
      ...prev,
      found_address: '',
      found_city: '',
      found_state: '',
      found_zip: '',
      found_lat: '',
      found_lng: '',
    }));
    autocompleteRef.current = null;
    setManualMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Image required for found items only. Lost items are exempt since the
    // poster no longer has the item in hand -- a soft nudge is shown in the
    // form instead of a hard block.
    if (!isLost && images.length === 0) {
      setError('Please upload at least one image of the item.');
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

        {user?.home_campus && (
          <div className="mb-6 flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5">
            <School className="h-4 w-4 text-blue-700 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800 leading-relaxed">
              This post will be tagged with your home campus, <strong>{user.home_campus}</strong>, so it shows
              up by default for others browsing that campus. It'll still be visible to everyone everywhere --
              change your home campus anytime from your Dashboard.
            </p>
          </div>
        )}

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
              Upload Images (up to {MAX_IMAGES}) {isLost ? '(optional but recommended)' : '*'}
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              disabled={images.length >= MAX_IMAGES}
              className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
            />
            {images.length >= MAX_IMAGES && (
              <p className="mt-1 text-xs text-gray-500">Maximum of {MAX_IMAGES} images reached. Remove one to add another.</p>
            )}

            {imagePreviews.length > 0 && (
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2">
                {imagePreviews.map((url, idx) => (
                  <div key={url} className="relative group">
                    <img
                      src={url}
                      alt={`Selected ${idx + 1}`}
                      className="h-20 w-full object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      aria-label={`Remove image ${idx + 1}`}
                      className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center hover:bg-red-700 shadow"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {isLost && images.length === 0 && (
              <div className="mt-2 flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2.5">
                <Info className="h-4 w-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  No photo? That's okay for lost items. If you have one, even an old photo of the item helps
                  finders recognize it. If not, add identifying details in the description instead, like a
                  receipt, serial number, engraving, or case color.
                </p>
              </div>
            )}
          </div>

          {/* Location — Autocomplete by default, with manual fallback */}
          <div className="border-t pt-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {isLost ? 'Last Seen Location' : 'Location Where Found'}
              </h3>
              <button
                type="button"
                onClick={manualMode ? handleSwitchToAutocomplete : handleSwitchToManual}
                className="text-xs font-medium text-blue-600 hover:text-blue-800 underline"
              >
                {manualMode ? 'Use address search instead' : "Can't find your address? Enter manually"}
              </button>
            </div>

            {!manualMode ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search for an address
                  </label>
                  <input
                    type="text"
                    ref={addressInputRef}
                    defaultValue={formData.found_address}
                    placeholder={mapsReady ? 'Start typing an address...' : 'Loading address search...'}
                    disabled={!mapsReady}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Pick an address from the dropdown so the location saves correctly.
                  </p>
                </div>

                {/* Read-only confirmation of what was picked, so users can see it worked */}
                {(formData.found_city || formData.found_state) && (
                  <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                    {formData.found_address && <div>{formData.found_address}</div>}
                    <div>
                      {formData.found_city}{formData.found_city && formData.found_state ? ', ' : ''}
                      {formData.found_state} {formData.found_zip}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 -mt-1">
                  Manual entry won't pin an exact map location, but the item will still show up in city/state search.
                </p>
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
              </div>
            )}

            <div className="mt-3">
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
