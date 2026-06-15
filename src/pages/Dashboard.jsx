import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemsAPI, claimsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Package, FileText, CheckCircle, XCircle, MessageCircle, Image } from 'lucide-react';
import { API_BASE_URL } from '../config/config';

export default function Dashboard() {
  const { user } = useAuth();
  const [myItems, setMyItems] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemClaims, setItemClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvedChatId, setApprovedChatId] = useState(null);
  const [rejectingClaimId, setRejectingClaimId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsRes, claimsRes] = await Promise.all([
        itemsAPI.getMyItems(),
        claimsAPI.getMyClaims(),
      ]);
      setMyItems(itemsRes.data.items);
      setMyClaims(claimsRes.data.claims);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchItemClaims = async (itemId) => {
    try {
      const response = await claimsAPI.getItemClaims(itemId);
      setItemClaims(response.data.claims);
      setSelectedItem(itemId);
      setApprovedChatId(null);
    } catch (error) {
      console.error('Error fetching claims:', error);
    }
  };

  const handleApproveClaim = async (claimId) => {
    try {
      const res = await claimsAPI.approve(claimId);
      setApprovedChatId(res.data.chat_id || null);
      fetchData();
      fetchItemClaims(selectedItem);
    } catch (error) {
      alert('Failed to approve claim');
    }
  };

  const handleRejectClaim = async (claimId) => {
    try {
      await claimsAPI.reject(claimId, rejectionReason);
      setRejectingClaimId(null);
      setRejectionReason('');
      fetchItemClaims(selectedItem);
    } catch (error) {
      alert('Failed to reject claim');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.full_name}!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Posted Items */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Package className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">My Posted Items</h2>
          </div>
          {myItems.length === 0 ? (
            <p className="text-gray-600">You haven't posted any items yet.</p>
          ) : (
            <div className="space-y-4">
              {myItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <Link to={`/items/${item.id}`} className="text-lg font-semibold text-blue-600 hover:text-blue-700">
                      {item.title}
                    </Link>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      item.status === 'found' ? 'bg-green-100 text-green-800' :
                      item.status === 'claimed' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{item.description?.substring(0, 100)}...</p>
                  <button
                    onClick={() => fetchItemClaims(item.id)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    View Claims →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Claims */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <FileText className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">My Claims</h2>
          </div>
          {myClaims.length === 0 ? (
            <p className="text-gray-600">You haven't submitted any claims yet.</p>
          ) : (
            <div className="space-y-4">
              {myClaims.map((claim) => (
                <div key={claim.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{claim.item_title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {claim.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{claim.proof_description}</p>
                  {/* Show rejection reason if rejected */}
                  {claim.status === 'rejected' && claim.rejection_reason && (
                    <p className="text-red-600 text-sm mt-1">
                      Reason: {claim.rejection_reason}
                    </p>
                  )}
                  {/* Approved: show link to chat */}
                  {claim.status === 'approved' && claim.chat_id && (
                    <Link
                      to={`/chats/${claim.chat_id}`}
                      className="inline-flex items-center mt-2 text-sm text-green-700 font-medium hover:underline"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Open chat to arrange return
                    </Link>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Submitted: {new Date(claim.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Claims Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Claims for this item</h3>
              <button onClick={() => { setSelectedItem(null); setApprovedChatId(null); }}
                className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
            </div>

            {/* Post-approve handoff banner */}
            {approvedChatId && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium mb-2">✅ Claim approved! A chat has been opened.</p>
                <p className="text-green-700 text-sm mb-3">
                  Coordinate with the claimant to return the item — suggest a public meeting place or ask for a mailing address.
                </p>
                <Link
                  to={`/chats/${approvedChatId}`}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Go to Chat
                </Link>
              </div>
            )}

            {itemClaims.length === 0 ? (
              <p className="text-gray-600">No claims submitted yet.</p>
            ) : (
              <div className="space-y-4">
                {itemClaims.map((claim) => (
                  <div key={claim.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{claim.claimer_name}</p>
                        <p className="text-sm text-gray-600">{claim.claimer_email}</p>
                        {claim.claimer_phone && (
                          <p className="text-sm text-gray-600">{claim.claimer_phone}</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {claim.status}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-3">{claim.proof_description}</p>

                    {/* Proof images */}
                    {claim.proof_images && claim.proof_images.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-500 mb-1 flex items-center">
                          <Image className="h-3 w-3 mr-1" /> Proof Images
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {claim.proof_images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img.startsWith("https://") ? img : `${API_BASE_URL}${img}`}
                              alt={`Proof ${idx + 1}`}
                              className="h-20 w-20 object-cover rounded border cursor-pointer hover:opacity-80"
                              onClick={() => setLightboxImg(img.startsWith("https://") ? img : `${API_BASE_URL}${img}`)}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {claim.status === 'pending' && (
                      <div className="space-y-2">
                        {rejectingClaimId === claim.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              placeholder="Give a reason for rejection (optional but helpful)..."
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleRejectClaim(claim.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                              >
                                Confirm Reject
                              </button>
                              <button
                                onClick={() => { setRejectingClaimId(null); setRejectionReason(''); }}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveClaim(claim.id)}
                              className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" /> Approve
                            </button>
                            <button
                              onClick={() => setRejectingClaimId(claim.id)}
                              className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              <XCircle className="h-4 w-4 mr-1" /> Reject
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lightbox for proof images */}
      {lightboxImg && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60] cursor-pointer"
          onClick={() => setLightboxImg(null)}
        >
          <img src={lightboxImg} alt="Proof" className="max-w-3xl max-h-[90vh] rounded shadow-xl" />
        </div>
      )}
    </div>
  );
}
