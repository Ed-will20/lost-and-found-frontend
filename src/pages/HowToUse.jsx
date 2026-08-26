import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Camera, MapPin, FileCheck, MessageCircle, CheckCircle2, Info, HelpCircle } from 'lucide-react';

const FOUND_STEPS = [
  {
    icon: Camera,
    title: 'Post what you found',
    body: "Snap a photo of the item, add a short description, and pick where you found it. Takes about a minute.",
  },
  {
    icon: FileCheck,
    title: 'Review claims',
    body: "If someone believes it's theirs, they'll submit proof (a description, a photo, an identifying detail). You review it and decide whether to approve.",
  },
  {
    icon: MessageCircle,
    title: 'Chat and arrange the return',
    body: "Once you approve a claim, a private chat opens automatically. Use it to agree on where and how to hand the item back.",
  },
  {
    icon: CheckCircle2,
    title: 'Mark it as returned',
    body: "Once the item is actually back with its owner, mark it returned from the chat. You'll both get a chance to rate the experience.",
  },
];

const LOST_STEPS = [
  {
    icon: Search,
    title: 'Post what you lost',
    body: "Describe the item and, if you have one, add a photo. No photo? That's fine for lost items -- a receipt, serial number, or distinguishing detail works too.",
  },
  {
    icon: MapPin,
    title: 'Add where you last saw it',
    body: "The more specific the location and date, the easier it is for a finder to recognize it as a match.",
  },
  {
    icon: FileCheck,
    title: 'Wait, or browse Found items yourself',
    body: "If someone finds it and posts it, you can submit proof to claim it. You can also browse Found listings directly in case it's already been posted.",
  },
  {
    icon: MessageCircle,
    title: 'Chat and arrange pickup',
    body: "Once your claim is approved, a private chat opens so you and the finder can coordinate getting it back to you.",
  },
];

const FOUND_FAQS = [
  {
    q: "I don't want to take the item home. What do I do?",
    a: "That's completely fine. If you handed it to an official lost-and-found (a bus driver, campus building front desk, event staff, an airport counter), just post the item anyway and mention where you left it in the description. The owner can coordinate pickup from there instead of from you directly.",
  },
  {
    q: 'The item feels sensitive (ID, passport, cash, cards).',
    a: "For anything like this, it's worth handing it to campus security, police, or a venue's official lost-and-found in addition to posting it here, since those are the safest places for it to sit while it's waiting to be claimed.",
  },
  {
    q: 'Nobody has claimed it yet. Should I take it down?',
    a: "You can leave it up as long as you're able to hold onto it, or note where it was dropped off if you already turned it in elsewhere. There's no automatic expiration.",
  },
];

const LOST_FAQS = [
  {
    q: 'I need it back urgently. Is there anything faster than waiting?',
    a: "Browse the Found items list directly in case it's already been posted, and check with the official lost-and-found for wherever you lost it (bus/transit line, campus building, venue) at the same time. Posting here and checking in person aren't mutually exclusive.",
  },
  {
    q: "Someone's chatting with me about my claim but it feels off.",
    a: "Chat only opens after a claim has been reviewed and approved, so you're not messaging a stranger before any verification happens. If something still feels wrong, arrange any handoff in a public place and trust your judgment.",
  },
  {
    q: "I don't have a photo of the item at all.",
    a: 'Totally normal for lost items. A receipt, serial number, engraving, or a specific description of a scuff or sticker works just as well to help a finder recognize it.',
  },
];

export default function HowToUse() {
  const [mode, setMode] = useState('found');
  const isFound = mode === 'found';
  const steps = isFound ? FOUND_STEPS : LOST_STEPS;
  const faqs = isFound ? FOUND_FAQS : LOST_FAQS;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">How EyeFoundYou Works</h1>
        <p className="text-lg text-gray-600">
          Pick the situation that matches you, and we'll walk you through it.
        </p>
      </div>

      {/* Big, obvious toggle */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex bg-gray-100 rounded-full p-1.5 shadow-inner">
          <button
            type="button"
            onClick={() => setMode('found')}
            className={`px-6 sm:px-8 py-3 rounded-full text-sm sm:text-base font-semibold transition-all ${
              isFound
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Did you find an item?
          </button>
          <button
            type="button"
            onClick={() => setMode('lost')}
            className={`px-6 sm:px-8 py-3 rounded-full text-sm sm:text-base font-semibold transition-all ${
              !isFound
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Did you lose an item?
          </button>
        </div>
      </div>

      <div className="text-center mb-8">
        <p className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
          isFound ? 'bg-blue-50 text-blue-800' : 'bg-orange-50 text-orange-800'
        }`}>
          {isFound
            ? "Great -- here's what to do with something you found."
            : "That's frustrating -- here's what to do to try to get it back."}
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-4 mb-10">
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          return (
            <div
              key={step.title}
              className="flex items-start gap-4 bg-white rounded-xl shadow-sm border border-gray-100 p-5"
            >
              <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${
                isFound ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {idx + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <StepIcon className={`h-4 w-4 ${isFound ? 'text-blue-600' : 'text-orange-600'}`} />
                  <h3 className="text-base font-semibold text-gray-900">{step.title}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{step.body}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contextual note */}
      <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-10">
        <Info className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-gray-600 leading-relaxed">
          {isFound
            ? "Claims require proof before you approve one, so you're never just handing an item to whoever asks first."
            : "You'll need to submit proof before a claim is approved -- this protects both you and the finder from someone falsely claiming an item."}
        </p>
      </div>

      {/* Common situations / FAQ */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className={`h-5 w-5 ${isFound ? 'text-blue-600' : 'text-orange-600'}`} />
          <h2 className="text-lg font-semibold text-gray-900">Common Situations</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((item) => (
            <div key={item.q} className="bg-white rounded-lg border border-gray-100 p-4">
              <p className="text-sm font-semibold text-gray-900 mb-1">{item.q}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/post-item"
          className={`inline-block px-8 py-3 rounded-lg font-medium text-white transition-colors ${
            isFound ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-600 hover:bg-orange-700'
          }`}
        >
          {isFound ? 'Post a Found Item' : 'Post a Lost Item'}
        </Link>
      </div>
    </div>
  );
}
