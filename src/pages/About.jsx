import { Link } from 'react-router-dom';
import { Heart, Search, MessageCircle } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
          <Search className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">About EyeFoundYou</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          A free platform built to close the gap between people who lose things and people who find them.
        </p>
      </div>

      {/* Story */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">The story behind it</h2>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            My name is Edafe Ogege. I'm a rising senior at San Francisco State University studying Computer Science, and I built EyeFoundYou because I know firsthand how frustrating it is to lose something that matters.
          </p>
          <p>
            It started when I lost my school ID on the bus. Sitting there without it, I kept thinking — what if someone found it and genuinely wanted to return it, but had no way to reach me? Losing an ID means cancelling cards, replacing documents, and spending hours undoing the damage. It's stressful in a way that's easy to underestimate until it happens to you.
          </p>
          <p>
            But I also thought about the other side. Most people who find something lost are good — they <em>want</em> to help. The problem is the friction. The nearest lost and found might be across town. You're already busy. Taking someone's wallet home feels awkward. So the item sits there, or gets handed to a desk where it disappears into a box.
          </p>
          <p>
            EyeFoundYou bridges that gap. Finders can post what they've found in seconds. Owners can submit proof and connect directly. No middlemen, no waiting rooms, no lost-and-found boxes that never get checked.
          </p>
          <p className="font-medium text-blue-700">
            The name says it all. I want everyone who's ever lost something to one day be able to say — Eye found you.
          </p>
        </div>
      </div>

      {/* How it works summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-blue-50 rounded-xl p-5 text-center">
          <Search className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-blue-900 mb-1">Post what you found</p>
          <p className="text-xs text-blue-700">Snap a photo, add a location, done.</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-5 text-center">
          <Heart className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-blue-900 mb-1">Owner submits proof</p>
          <p className="text-xs text-blue-700">They describe the item. You verify it's theirs.</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-5 text-center">
          <MessageCircle className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-blue-900 mb-1">Chat and arrange return</p>
          <p className="text-xs text-blue-700">A private chat opens. You coordinate the handoff.</p>
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Browse items
        </Link>
      </div>
    </div>
  );
}
