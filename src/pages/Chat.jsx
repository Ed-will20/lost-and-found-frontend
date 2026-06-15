import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { chatsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Send, Package } from 'lucide-react';
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

  useEffect(() => {
    fetchChat();
    // Poll for new messages every 5 seconds
    pollRef.current = setInterval(fetchMessages, 5000);
    return () => clearInterval(pollRef.current);
  }, [id]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    </div>
  );
}
