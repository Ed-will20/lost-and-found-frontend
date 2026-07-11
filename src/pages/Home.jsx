import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemsAPI } from '../services/api';
import { MapPin, Calendar, Search, Filter, X } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const STATE_ABBR_MAP = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi',
  MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire',
  NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina',
  ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania',
  RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee',
  TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington',
  WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
};

function normaliseState(input) {
  if (!input) return '';
  const trimmed = input.trim();
  const upper = trimmed.toUpperCase();
  if (STATE_ABBR_MAP[upper]) return STATE_ABBR_MAP[upper];
  return trimmed;
}

const EMPTY_FILTERS = { search: '', state: '', category: '' };

export default function Home() {
  const [postType, setPostType] = useState('found');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  const isLost = postType === 'lost';

  useEffect(() => {
    fetchItems(EMPTY_FILTERS, postType);
    setFilters(EMPTY_FILTERS);
  }, [postType]);

  const fetchItems = async (activeFilters, activePostType) => {
    try {
      setLoading(true);
      const normalisedFilters = {
        ...activeFilters,
        state: normaliseState(activeFilters.state),
        post_type: activePostType,
      };
      const response = await itemsAPI.getAll(normalisedFilters);
      setItems(response.data.items);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems(filters, postType);
    setShowFilters(false);
  };

  const handleClear = () => {
    setFilters(EMPTY_FILTERS);
    fetchItems(EMPTY_FILTERS, postType);
  };

  const hasActiveFilters = filters.search || filters.state || filters.category;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Lost & Found Items</h1>
        <p className="text-base sm:text-lg text-gray-600">Help reunite people with their belongings</p>
      </div>

      {/* Lost / Found tabs */}
      <div className="mb-6 flex border-b border-gray-200">
        <button
          onClick={() => setPostType('found')}
          className={`flex-1 sm:flex-none px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
            !isLost ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Found Items
        </button>
        <button
          onClick={() => setPostType('lost')}
          className={`flex-1 sm:flex-none px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
            isLost ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Lost Items
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        {isLost
          ? 'These are items other people are actively looking for. If you've found one, open it and let them know.'
          : 'These are items other people found and are holding onto. If one matches something you lost, open it and submit proof to claim it.'}
      </p>

      {/* Search bar + filter toggle */}
      <div className="mb-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2.5 border rounded-md text-sm font-medium transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && <span className="bg-blue-600 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">!</span>}
          </button>
          <button
            type="submit"
            className="px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            Search
          </button>
        </form>

        {/* Expandable filters */}
        {showFilters && (
          <div className="mt-3 p-4 bg-white rounded-lg shadow-md border border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">All Categories</option>
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
                <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  placeholder="e.g., California or CA"
                  value={filters.state}
                  onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { handleSearch({ preventDefault: () => {} }); }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
              >
                Apply
              </button>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex items-center gap-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
                >
                  <X className="h-4 w-4" />
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading items...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600">
            {isLost ? 'No lost items posted yet. Try adjusting your filters.' : 'No found items posted yet. Try adjusting your filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {items.map((item) => (
            <Link
              key={item.id}
              to={`/items/${item.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              {item.images && item.images.length > 0 ? (
                <img
                  src={item.images[0].startsWith("https://") ? item.images[0] : `${API_BASE_URL}${item.images[0]}`}
                  alt={item.title}
                  className="w-full h-44 sm:h-48 object-cover"
                />
              ) : (
                <div className="w-full h-44 sm:h-48 bg-gray-200 flex items-center justify-center">
                  <Search className="h-16 w-16 text-gray-400" />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                <div className="flex items-center text-xs text-gray-500 mb-1">
                  <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                  <span className="truncate">{item.found_city}, {item.found_state}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500 mb-3">
                  <Calendar className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                  <span>{new Date(item.found_date).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.post_type === 'lost' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {item.post_type === 'lost' ? 'LOST' : 'FOUND'}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.status === 'found' ? 'bg-green-100 text-green-800' :
                    item.status === 'claimed' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status === 'found' ? 'ACTIVE' : item.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
