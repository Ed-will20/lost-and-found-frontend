export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-xl shadow-md p-6 sm:p-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: July 2026</p>

        <div className="space-y-8 text-sm sm:text-base text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">1. What We Collect</h2>
            <p>
              When you use EyeFoundYou, we collect the information you provide directly:
              your name, email address, and, if you choose to add them, your city, state,
              and zip code. When you post or claim an item, we collect the details and
              images you upload, along with any messages you send through the chat feature.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">2. How We Use It</h2>
            <p>
              We use this information only to operate the core service: matching lost items
              with found items, verifying claims through the proof-submission process, and
              enabling chat between a finder and a claimant so they can arrange a return.
              We do not use your information for advertising, and we do not build marketing
              profiles from it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Sharing</h2>
            <p>
              We do not sell your personal information, and we do not share it with third
              parties for marketing purposes. Location and item details you post are visible
              to other users of the app, since that visibility is what makes the matching
              process work. Your email address is never shown publicly; chat is the only way
              other users can reach you.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Images</h2>
            <p>
              Images you upload when posting an item or submitting a claim are stored to
              support identification and proof of ownership. Only upload images you are
              comfortable being visible to the other party involved in a claim.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Your Rights</h2>
            <p>
              You can review or update most of your information from your dashboard at any
              time. If you would like your account and associated data deleted, email us at{' '}
              <a href="mailto:help@eyefoundyou.com" className="text-blue-600 hover:underline">
                help@eyefoundyou.com
              </a>{' '}
              and we will process the request. If you are located in the EU/EEA or in
              California, you have rights under GDPR or CCPA respectively to access, correct,
              or delete your data, and to ask what we hold about you; the same email above
              is the way to exercise those rights.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Data Retention</h2>
            <p>
              We keep item and account data for as long as your account is active. If an item
              is marked resolved, its record is kept for historical reference but is no longer
              actively surfaced in search results.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Contact</h2>
            <p>
              Questions about this policy can be sent to{' '}
              <a href="mailto:help@eyefoundyou.com" className="text-blue-600 hover:underline">
                help@eyefoundyou.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
