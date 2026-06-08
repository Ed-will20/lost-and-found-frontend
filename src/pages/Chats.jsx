import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { chatsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, Package } from 'lucide-react';
import { API_BASE_URL } from '../config/config';

export default function Chats() {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const res = await chatsAPI.getMyChats();
      setChats(res.data.chats);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <MessageCircle className="h-7 w-7 text-blue-600 mr-2" />
        <h1 className="text-3xl font-bold text-gray-900">My Chats</h1>
      </div>

      {chats.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No chats yet.</p>
          <p className="text-gray-400 text-sm mt-1">
            Chats open automatically when a claim is approved.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {chats.map((chat) => {
            const otherPerson = user?.id === chat.finder_id
              ? chat.claimer_name
              : chat.finder_name;

            return (
              <Link
                key={chat.id}
                to={`/chats/${chat.id}`}
                className="flex items-center bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                {/* Item thumbnail */}
                {chat.item_images && chat.item_images.length > 0 ? (
                  <img
                    src={`${API_BASE_URL}${chat.item_images[0]}`}
                    alt={chat.item_title}
                    className="h-14 w-14 object-cover rounded-lg border mr-4 flex-shrink-0"
                  />
                ) : (
                  <div className="h-14 w-14 bg-gray-100 rounded-lg border mr-4 flex-shrink-0 flex items-center justify-center">
                    <Package className="h-6 w-6 text-gray-400" />
                  </div>
                )}

                {/* Chat info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-gray-900">{otherPerson}</p>
                    {chat.last_message_at && (
                      <p className="text-xs text-gray-400 ml-2 flex-shrink-0">
                        {new Date(chat.last_message_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-blue-600 truncate">{chat.item_title}</p>
                  {chat.last_message && (
                    <p className="text-sm text-gray-500 truncate mt-0.5">{chat.last_message}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
