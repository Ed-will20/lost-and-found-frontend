import { Link } from 'react-router-dom';
import { Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

          <div>
            <p className="text-lg font-bold text-gray-900 mb-2">EyeFoundYou</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Reconnecting people with their lost belongings -- one item at a time.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Links</p>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Browse items</Link></li>
              <li><Link to="/about" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Contact us & FAQ</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Get in touch</p>
            <a
              href="mailto:help@eyefoundyou.com"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-2"
            >
              <Mail className="h-4 w-4" />
              help@eyefoundyou.com
            </a>
            <a
              href="https://www.linkedin.com/in/edafeogege"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">Copyright {new Date().getFullYear()} EyeFoundYou. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
