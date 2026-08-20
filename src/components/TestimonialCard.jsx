import { Star, Quote } from 'lucide-react';

const CATEGORY_LABELS = {
  wallet: 'Wallet', phone: 'Phone', keys: 'Keys', jewelry: 'Jewelry',
  electronics: 'Electronics', documents: 'Documents', clothing: 'Clothing',
  shoes: 'Shoes', bags: 'Bags', books: 'Books', id_passport: 'ID / Passport',
  glasses: 'Glasses', headphones: 'Headphones', bicycle: 'Bicycle',
  pet: 'Pet', luggage: 'Luggage', sports_equipment: 'Sports Equipment',
  umbrella: 'Umbrella', musical_instrument: 'Musical Instrument', other: 'Other',
};

function categoryLabel(value) {
  if (!value) return '';
  return CATEGORY_LABELS[value] || value.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export default function TestimonialCard({ testimonial }) {
  const label = categoryLabel(testimonial.category);
  return (
    <div className="bg-white rounded-lg shadow-md p-5 flex flex-col h-full">
      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            className={`h-4 w-4 ${n <= testimonial.score ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
      <Quote className="h-5 w-5 text-blue-200 mb-2" />
      <p className="text-gray-700 text-sm flex-1 mb-4">{testimonial.testimonial}</p>
      <div className="border-t pt-3">
        <p className="text-sm font-semibold text-gray-900">{testimonial.ratee_display_name}</p>
        {testimonial.item_title && (
          <p className="text-xs text-gray-500">
            {label ? `${label} - ` : ''}{testimonial.item_title}
          </p>
        )}
      </div>
    </div>
  );
}
