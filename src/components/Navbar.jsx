import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Search, PlusCircle, LayoutDashboard, MessageCircle, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { chatsAPI } from '../services/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchUnread = async () => {
      try {
        const res = await chatsAPI.getUnreadCount();
        setUnreadCount(res.data.unread);
      } catch {}
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const close = () => setMenuOpen(false);

  return (
    <nav className="bg-white shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" onClick={close} className="flex items-center space-x-2">
              <Search className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">EyeFoundYou</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center space-x-2">
            <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Browse
            </Link>
            {user ? (
              <>
                <Link to="/post-item" className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  <PlusCircle className="h-4 w-4" />
                  <span>Post Item</span>
                </Link>
                <Link to="/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <Link to="/chats" className="relative flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  <div className="relative">
                    <MessageCircle className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold leading-none">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </div>
                  <span>Chats</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center space-x-1 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Register</Link>
              </>
            )}
          </div>

          {/* Mobile: unread badge + hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            {user && unreadCount > 0 && (
              <Link to="/chats" onClick={close} className="relative p-2">
                <MessageCircle className="h-6 w-6 text-gray-700" />
                <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </Link>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white shadow-lg">
          <div className="px-4 py-3 space-y-1">
            <Link to="/" onClick={close} className="block px-3 py-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Browse Items
            </Link>
            {user ? (
              <>
                <Link to="/post-item" onClick={close} className="flex items-center gap-2 px-3 py-3 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700">
                  <PlusCircle className="h-4 w-4" />
                  Post Item
                </Link>
                <Link to="/dashboard" onClick={close} className="flex items-center gap-2 px-3 py-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link to="/chats" onClick={close} className="flex items-center gap-2 px-3 py-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <MessageCircle className="h-4 w-4" />
                  Chats
                  {unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-3 rounded-md text-sm font-medium text-red-600 hover:bg-red-50">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={close} className="block px-3 py-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Login</Link>
                <Link to="/register" onClick={close} className="block px-3 py-3 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 text-center">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
