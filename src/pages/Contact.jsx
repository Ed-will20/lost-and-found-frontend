import { useState } from 'react';
import { Mail, ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    q: 'Is EyeFoundYou free?',
    a: 'Yes, completely. There are no fees, no subscriptions, and no premium tiers. Posting an item, submitting a claim, and chatting to arrange a return are all free.',
  },
  {
    q: 'How do I get my lost item back?',
    a: 'Browse the Found Items tab and search for your item. If you spot it, click "Claim This Item" and submit proof of ownership — describe identifying details only you would know (a scratch, a name inside, a receipt). The finder reviews your proof and, if approved, a private chat opens so you can coordinate the return.',
  },
  {
    q: 'I found something. What are my options?',
    a: 'You have two options. You can post the item on EyeFoundYou so the owner can find it and claim it — just snap a photo and add a location. Alternatively, if you\'re not comfortable holding onto the item, you can drop it at the nearest lost and found desk (a library, gym front desk, or transit office) and note that location in your post so the owner knows where to collect it. Either way, posting here gives the owner the best chance of finding it.',
  },
  {
    q: 'How does proof of ownership work?',
    a: 'When you claim an item, you write a description of identifying details that only the real owner would know — unique markings, what\'s inside a wallet, a phone case design, a serial number. You can also upload photos. The finder reviews this and approves or rejects. This protects both sides: owners get their items back safely, and finders know they\'re returning to the right person.',
  },
  {
    q: 'What happens after a claim is approved?',
    a: 'A private chat opens automatically between you and the other party. Use it to agree on a handoff — a public meeting spot, a drop-off location, or mailing if distance is an issue.',
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-medium text-gray-900 pr-4">{q}</span>
        {open
          ? <ChevronUp className="h-4 w-4 text-gray-400 flex-shrink-0" />
          : <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
        }
      </button>
      {open && (
        <p className="pb-4 text-sm text-gray-600 leading-relaxed">{a}</p>
      )}
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus('');
    try {
      await fetch(`https://formsubmit.co/help@eyefoundyou.com`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          _subject: `EyeFoundYou contact from ${form.name}`,
          _captcha: 'false',
        }),
      });
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
          <Mail className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Contact us</h1>
        <p className="text-gray-600">Having trouble? We're here to help.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Send a message</h2>

          {status === 'success' && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm">
              Message sent! We'll get back to you shortly.
            </div>
          )}
          {status === 'error' && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
              Something went wrong. Email us directly at help@eyefoundyou.com
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Describe your issue or question..."
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Send message'}
            </button>
          </form>
        </div>

        {/* Direct contact */}
        <div>
          <div className="bg-blue-50 rounded-2xl p-6 mb-4">
            <p className="text-sm font-semibold text-blue-900 mb-1">Email us directly</p>
            <a href="mailto:help@eyefoundyou.com" className="text-sm text-blue-600 hover:underline">
              help@eyefoundyou.com
            </a>
            <p className="text-xs text-blue-700 mt-2">We typically respond within 24 hours.</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6">
            <p className="text-sm font-semibold text-gray-800 mb-1">Built by</p>
            <p className="text-sm text-gray-600">Edafe Ogege</p>
            <p className="text-xs text-gray-500 mt-1">Rising senior, Computer Science</p>
            <p className="text-xs text-gray-500">San Francisco State University</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Frequently asked questions</h2>
        <div>
          {faqs.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
        </div>
      </div>
    </div>
  );
}
