import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { chatsAPI, claimsAPI, ratingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Send, Package, CheckCircle, Star } from 'lucide-react';
import { API_BASE_URL } from '../config/config';

export default function Chat() {
  const { id } = useParams();
  const { user } = useAuth();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const pollRef = useRef(null);
  // Tracks the last message count we actually scrolled for, so polling
  // ticks that return the same messages don't force a re-scroll.
  const lastScrolledCountRef = useRef(0);

  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState('');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingScore, setRatingScore] = useState(5);
  const [ratingTestimonial, setRatingTestimonial] = useState('');
  const [ratingPublic, setRatingPublic] = useState(false);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingError, setRatingError] = useState('');
  const [justRated, setJustRated] = useState(false);

  useEffect(() => {
    fetchChat();
    markThisChatRead();
    // Poll for new messages every 5 seconds
    pollRef.current = setInterval(fetchMessages, 5000);
    return () => clearInterval(pollRef.current);
  }, [id]);

  // Scroll to bottom only when the message count actually grows —
  // not on every poll tick, since fetchMessages sets a fresh array
  // reference every 5 seconds even when nothing new arrived.
  useEffect(() => {
    if (messages.length > lastScrolledCountRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      lastScrolledCountRef.current = messages.length;
    }
  }, [messages]);

  // Marks this chat's messages as read, then tells the Navbar (via a
  // custom event) to refresh its unread badge immediately instead of
  // waiting for its own 30-second poll tick.
  const markThisChatRead = async () => {
    try {
      await chatsAPI.markRead(id);
      window.dispatchEvent(new Event('chat:read'));
    } catch (error) {
      console.error('Error marking chat as read:', error);
    }
  };

  const fetchChat = async () => {
    try {
      const res = await chatsAPI.getMessages(id);
      setChat(res.data.chat);
      setMessages(res.data.messages);
    } catch (error) {
      console.error('Error fetching chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await chatsAPI.getMessages(id);
      setMessages(res.data.messages);
      // Keep chat state (item_status/has_rated) fresh too, in case the
      // other party marks it returned or rates while this tab is open.
      setChat((prev) => (prev ? { ...prev, ...res.data.chat } : res.data.chat));
    } catch (error) {
      console.error('Error polling messages:', error);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const res = await chatsAPI.sendMessage(id, newMessage.trim());
      setMessages((prev) => [...prev, res.data.message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleMarkReturned = async () => {
    if (!chat?.claim_id) return;
    setResolving(true);
    setResolveError('');
    try {
      await claimsAPI.resolve(chat.claim_id);
      setChat((prev) => ({ ...prev, item_status: 'resolved' }));
      if (!chat.has_rated) {
        setShowRatingModal(true);
      }
    } catch (error) {
      setResolveError(error.response?.data?.error || 'Failed to mark item as returned.');
    } finally {
      setResolving(false);
    }
  };

  const handleSubmitRating = async () => {
    if (!chat?.claim_id) return;
    setRatingSubmitting(true);
    setRatingError('');
    try {
      await ratingsAPI.submit(chat.claim_id, {
        score: ratingScore,
        testimonial: ratingTestimonial.trim() || undefined,
        testimonial_public: ratingPublic,
      });
      setShowRatingModal(false);
      setJustRated(true);
      setChat((prev) => ({ ...prev, has_rated: true }));
    } catch (error) {
      setRatingError(error.response?.data?.error || 'Failed to submit rating. Please try again.');
    } finally {
      setRatingSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Chat not found.</p>
      </div>
    );
  }

  const otherPersonName = user?.id === chat.finder_id
    ? chat.claimer_name
    : chat.finder_name;

  const myRole = user?.id === chat.finder_id ? 'finder' : 'claimer';
  const hasRated = chat.has_rated || justRated;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col h-screen">

      {/* Header */}
      <div className="mb-4">
        <Link to="/dashboard" className="flex items-center text-blue-600 hover:text-blue-700 mb-3">
          <ArrowLeft className="h-5 w-5 mr-1" /> Back to Dashboard
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Chat with {otherPersonName}</h1>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Package className="h-4 w-4 mr-1" />
              <span>Re: {chat.item_title}</span>
            </div>
          </div>

          {/* Item thumbnail if available */}
          {chat.item_images && chat.item_images.length > 0 && (
            <img
              src={chat.item_images[0].startsWith("https://") ? chat.item_images[0] : `${API_BASE_URL}${chat.item_images[0]}`}
              alt={chat.item_title}
              className="h-14 w-14 object-cover rounded-lg border"
            />
          )}
        </div>

        {/* Role banner */}
        <div className={`mt-2 px-4 py-2 rounded text-sm font-medium ${
          myRole === 'finder'
            ? 'bg-blue-50 text-blue-700'
            : 'bg-green-50 text-green-700'
        }`}>
          {myRole === 'finder'
            ? '📦 You found this item. Coordinate with the claimant to return it — suggest a public meeting place or ask for a mailing address.'
            : '🎉 Your claim was approved! Coordinate with the finder to arrange pickup or delivery.'}
        </div>

        {/* Resolution banner */}
        {chat.item_status === 'claimed' && chat.claim_id && (
          <div className="mt-2 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200">
            <p className="text-sm text-amber-800 mb-2">
              Once the item has actually been handed back or received, mark it as returned to close this out.
            </p>
            {resolveError && <p className="text-xs text-red-600 mb-2">{resolveError}</p>}
            <button
              onClick={handleMarkReturned}
              disabled={resolving}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50"
            >
              <CheckCircle className="h-4 w-4" />
              {resolving ? 'Marking...' : 'Mark as Returned'}
            </button>
          </div>
        )}

        {chat.item_status === 'resolved' && (
          <div className="mt-2 px-4 py-3 rounded-lg bg-green-50 border border-green-200 flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm text-green-800 flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4" />
              This item has been marked as returned.
            </p>
            {!hasRated ? (
              <button
                onClick={() => setShowRatingModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-green-300 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100"
              >
                <Star className="h-3.5 w-3.5" />
                Rate your experience
              </button>
            ) : (
              <span className="text-xs text-green-700">Thanks for your feedback!</span>
            )}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow-sm p-4 space-y-3 mb-4">
        {messages.length === 0 ? (
          <p className="text-center text-gray-400 mt-8">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  {!isMe && (
                    <p className="text-xs text-gray-500 mb-1 ml-1">{msg.sender_name}</p>
                  )}
                  <div className={`px-4 py-2 rounded-2xl text-sm ${
                    isMe
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}>
                    {msg.message_text}
                  </div>
                  <p className="text-xs text-gray-400 mt-1 mx-1">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Message input */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button
          type="submit"
          disabled={sending || !newMessage.trim()}
          className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-md p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">How did it go?</h3>
            <p className="text-sm text-gray-500 mb-4">
              Rate your experience with {otherPersonName}. This helps build trust for future users.
            </p>

            <div className="flex items-center justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRatingScore(n)}
                  className="p-1"
                >
                  <Star
                    className={`h-8 w-8 ${n <= ratingScore ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                </button>
              ))}
            </div>

            <textarea
              value={ratingTestimonial}
              onChange={(e) => setRatingTestimonial(e.target.value)}
              placeholder="Optional — share a quick note about the experience..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
            />

            <label className="flex items-start gap-2 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={ratingPublic}
                onChange={(e) => setRatingPublic(e.target.checked)}
                className="mt-0.5"
              />
              <span className="text-xs text-gray-600">
                Allow this note to be shown publicly (e.g. on our homepage or in outreach materials). Only your first name and last initial will be shown — never your full name.
              </span>
            </label>

            {ratingError && (
              <div className="mb-3 bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded text-sm">
                {ratingError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowRatingModal(false)}
                disabled={ratingSubmitting}
                className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Skip for now
              </button>
              <button
                onClick={handleSubmitRating}
                disabled={ratingSubmitting}
                className="flex-1 py-2.5 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {ratingSubmitting ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
