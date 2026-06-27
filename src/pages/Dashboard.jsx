import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { itemsAPI, claimsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Package, FileText, CheckCircle, XCircle, MessageCircle,
  Image, Pencil, Trash2, MapPin, Phone, Mail, Star, Calendar, User, Camera
} from 'lucide-react';
import { API_BASE_URL } from '../config/config';

export default function Dashboard() {
  const { user, updateProfilePicture } = useAuth();
  const navigate = useNavigate();
  const [myItems, setMyItems] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemClaims, setItemClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvedChatId, setApprovedChatId] = useState(null);
  const [rejectingClaimId, setRejectingClaimId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [lightboxImg, setLightboxImg] = useState(null);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => { fetchData(); }, []);

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

  const handlePictureClick = () => fileInputRef.current?.click();

  const handlePictureChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    if (!file.type.startsWith('image/')) { setUploadError('Please select an image file.'); return; }
    if (file.size > 5 * 1024 * 1024) { setUploadError('Image must be smaller than 5MB.'); return; }
    setUploadingPicture(true);
    try {
      await updateProfilePicture(file);
    } catch (error) {
      setUploadError('Failed to upload picture. Please try again.');
    } finally {
      setUploadingPicture(false);
      e.target.value = '';
    }
  };

  const handleDeleteClick = (itemId) => { setDeleteError(''); setDeletingItemId(itemId); };

  const handleConfirmDelete = async () => {
    if (!deletingItemId) return;
    setDeleteError('');
    setDeleteLoading(true);
    try {
      await itemsAPI.delete(deletingItemId);
      setDeletingItemId(null);
      fetchData();
    } catch (error) {
      setDeleteError(error.response?.data?.error || 'Failed to delete item. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const successfulReturns = myClaims.filter(c => c.status === 'approved').length;
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;
  const avatarUrl = user?.profile_picture_url
    ? (user.profile_picture_url.startsWith('https://') ? user.profile_picture_url : `${API_BASE_URL}${user.profile_picture_url}`)
    : null;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 mb-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <button
              type="button"
              onClick={handlePictureClick}
              disabled={uploadingPicture}
              className="relative block rounded-full focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-wait"
              title="Change profile picture"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt={user?.full_name} className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover ring-4 ring-blue-100" />
              ) : (
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-blue-100 flex items-center justify-center ring-4 ring-blue-50">
                  <User className="h-8 w-8 sm:h-10 sm:w-10 text-blue-400" />
                </div>
              )}
              <span className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center ring-2 ring-white">
                <Camera className="h-3 w-3 text-white" />
              </span>
              {uploadingPicture && (
                <span className="absolute inset-0 rounded-full bg-black bg-opacity-40 flex items-center justify-center">
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-b-transparent"></span>
                </span>
              )}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePictureChange} className="hidden" />
            {uploadError && <p className="absolute top-full mt-1 w-40 text-xs text-red-600">{uploadError}</p>}
          </div>

          {/* Name + details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{user?.full_name}</h1>
              {user?.rating != null && (
                <div className="flex-shrink-0 flex items-center gap-1 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-1">
                  <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-400" />
                  <span className="text-sm font-semibold text-yellow-700">{Number(user.rating).toFixed(1)}</span>
                </div>
              )}
            </div>
            <div className="mt-2 space-y-1">
              {user?.email && (
                <span className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                  <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </span>
              )}
              {user?.phone_number && (
                <span className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                  <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                  {user.phone_number}
                </span>
              )}
              {(user?.city || user?.state) && (
                <span className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                  {[user.city, user.state].filter(Boolean).join(', ')}
                </span>
              )}
              {memberSince && (
                <span className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                  <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                  Member since {memberSince}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{myItems.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">Items posted</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{myClaims.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">Claims submitted</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-green-600">{successfulReturns}</p>
            <p className="text-xs text-gray-500 mt-0.5">Successful returns</p>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* My Posted Items */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <div className="flex items-center mb-4">
            <Package className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">My Posted Items</h2>
          </div>
          {myItems.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">You haven't posted any items yet.</p>
              <Link to="/post-item" className="mt-3 inline-block text-sm text-blue-600 hover:underline">
                Post your first item →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  {/* Title row */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <Link to={`/items/${item.id}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700 leading-snug">
                      {item.title}
                    </Link>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                        item.post_type === 'lost' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.post_type === 'lost' ? 'LOST' : 'FOUND'}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                        item.status === 'found' ? 'bg-green-100 text-green-800' :
                        item.status === 'claimed' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-500 text-xs mb-3 line-clamp-2">{item.description}</p>

                  {/* Action row — always horizontal, touch-friendly */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => fetchItemClaims(item.id)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Claims →
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/edit-item/${item.id}`)}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Claims */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <div className="flex items-center mb-4">
            <FileText className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">My Claims</h2>
          </div>
          {myClaims.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">You haven't submitted any claims yet.</p>
              <Link to="/" className="mt-3 inline-block text-sm text-blue-600 hover:underline">Browse items →</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myClaims.map((claim) => (
                <div key={claim.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug">{claim.item_title}</h3>
                    <span className={`flex-shrink-0 px-2 py-0.5 rounded text-xs font-medium ${
                      claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {claim.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-2 line-clamp-2">{claim.proof_description}</p>
                  {claim.status === 'rejected' && claim.rejection_reason && (
                    <p className="text-red-600 text-xs mt-1">Reason: {claim.rejection_reason}</p>
                  )}
                  {claim.status === 'approved' && claim.chat_id && (
                    <Link to={`/chats/${claim.chat_id}`} className="inline-flex items-center mt-2 text-sm text-green-700 font-medium hover:underline">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Open chat to arrange return
                    </Link>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Submitted {new Date(claim.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Claims Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex justify-between items-center rounded-t-2xl sm:rounded-t-xl">
              <h3 className="text-lg font-semibold">Claims for this item</h3>
              <button
                onClick={() => { setSelectedItem(null); setApprovedChatId(null); }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >✕</button>
            </div>

            <div className="p-5">
              {approvedChatId && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium mb-1 text-sm">✅ Claim approved! A chat has been opened.</p>
                  <p className="text-green-700 text-xs mb-3">Coordinate with the claimant to return the item.</p>
                  <Link to={`/chats/${approvedChatId}`} className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Go to Chat
                  </Link>
                </div>
              )}

              {itemClaims.length === 0 ? (
                <p className="text-gray-500 text-sm">No claims submitted yet.</p>
              ) : (
                <div className="space-y-4">
                  {itemClaims.map((claim) => (
                    <div key={claim.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{claim.claimer_name}</p>
                          <p className="text-xs text-gray-500">{claim.claimer_email}</p>
                          {claim.claimer_phone && <p className="text-xs text-gray-500">{claim.claimer_phone}</p>}
                        </div>
                        <span className={`flex-shrink-0 px-2 py-0.5 rounded text-xs font-medium ${
                          claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {claim.status}
                        </span>
                      </div>

                      <p className="text-gray-700 text-sm mb-3">{claim.proof_description}</p>

                      {claim.proof_images && claim.proof_images.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-medium text-gray-400 mb-1 flex items-center gap-1">
                            <Image className="h-3 w-3" /> Proof Images
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            {claim.proof_images.map((img, idx) => (
                              <img
                                key={idx}
                                src={img.startsWith('https://') ? img : `${API_BASE_URL}${img}`}
                                alt={`Proof ${idx + 1}`}
                                className="h-20 w-20 object-cover rounded border cursor-pointer hover:opacity-80"
                                onClick={() => setLightboxImg(img.startsWith('https://') ? img : `${API_BASE_URL}${img}`)}
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
                                placeholder="Give a reason for rejection (optional)..."
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                              />
                              <div className="flex gap-2">
                                <button onClick={() => handleRejectClaim(claim.id)} className="flex-1 py-2 px-3 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                                  Confirm Reject
                                </button>
                                <button onClick={() => { setRejectingClaimId(null); setRejectionReason(''); }} className="flex-1 py-2 px-3 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button onClick={() => handleApproveClaim(claim.id)} className="flex-1 flex items-center justify-center py-2 px-3 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                                <CheckCircle className="h-4 w-4 mr-1" /> Approve
                              </button>
                              <button onClick={() => setRejectingClaimId(claim.id)} className="flex-1 flex items-center justify-center py-2 px-3 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
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
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingItemId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-md p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete this item?</h3>
            <p className="text-sm text-gray-600 mb-4">This will permanently remove the post. This can't be undone.</p>
            {deleteError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded text-sm">{deleteError}</div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setDeletingItemId(null); setDeleteError(''); }}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
                className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {lightboxImg && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60] cursor-pointer p-4" onClick={() => setLightboxImg(null)}>
          <img src={lightboxImg} alt="Proof" className="max-w-full max-h-[90vh] rounded shadow-xl" />
        </div>
      )}
    </div>
  );
}
