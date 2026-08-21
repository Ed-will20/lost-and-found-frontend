export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-xl shadow-md p-6 sm:p-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: August 2026</p>

        <div className="space-y-8 text-sm sm:text-base text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">1. What We Collect</h2>
            <p>
              When you use EyeFoundYou, we collect the information you provide directly:
              your name, email address, and, if you choose to add them, your city, state,
              zip code, and school affiliation (including whether your school email has been
              verified and which campus you've set as your home campus). When you post or
              claim an item, we collect the details and images you upload, along with any
              messages you send through the chat feature. If you sign in with Google, we
              receive your basic profile information (name and email) from Google to create
              and authenticate your account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">2. How We Use It</h2>
            <p>
              We use this information only to operate the core service: matching lost items
              with found items, verifying claims through the proof-submission process, and
              enabling chat between a finder and a claimant so they can arrange a return.
              Your home campus is used to set a default, adjustable view when browsing items;
              it does not restrict who can see your posts. We do not use your information for
              advertising, and we do not build marketing profiles from it.
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
            <p className="mt-3">
              We rely on a small number of service providers to operate the app, each of whom
              processes data only as needed to perform their function: Google, for sign-in and
              for address search/mapping; Cloudinary, for storing uploaded images; and Resend,
              for delivering transactional emails such as claim updates and new-message
              notifications. None of these providers are permitted to use your data for their
              own marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Images</h2>
            <p>
              Images you upload when posting an item or submitting a claim are stored with our
              image hosting provider, Cloudinary, to support identification and proof of
              ownership. Only upload images you are comfortable being visible to the other
              party involved in a claim.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Public Testimonials</h2>
            <p>
              After an item is successfully returned, both parties may leave a rating and an
              optional written testimonial about their experience. A testimonial is only shown
              publicly, on our website, if you explicitly opt in when submitting it. Public
              testimonials display your first name and last initial only; your full name,
              email, and other account details are never included. You can choose not to make
              a testimonial public at the time you submit it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Your Rights</h2>
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
            <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Data Retention</h2>
            <p>
              We keep item and account data for as long as your account is active. If an item
              is marked resolved, its record is kept for historical reference but is no longer
              actively surfaced in search results. If a post is removed by its owner, it is no
              longer shown anywhere on the site, but the underlying record is retained
              internally so that related claim history isn't lost for the other party involved.
              This is separate from deleting your account: a request to delete your account,
              made per Section 6, removes your personal data rather than just hiding a single
              post.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">8. Account Security</h2>
            <p>
              Passwords are never stored in plain text. We use industry-standard hashing to
              store password data, so that even we cannot view your actual password.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">9. Children's Privacy</h2>
            <p>
              EyeFoundYou is not directed at, or intended for use by, children under the age
              of 13. We do not knowingly collect personal information from children under 13.
              If you believe a child has provided us with personal information, please contact
              us at the email below so we can remove it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">10. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time as the app changes. The "Last
              updated" date at the top will reflect the most recent revision. For material
              changes, we will make reasonable efforts to notify users, such as by email or an
              in-app notice, before the change takes effect.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">11. Contact</h2>
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
