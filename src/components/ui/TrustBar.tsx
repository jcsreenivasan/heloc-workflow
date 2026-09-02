import { Star } from 'lucide-react';

const reviews = [
  { platform: 'Google', rating: '4.9', count: '2,400+' },
  { platform: 'Zillow', rating: '5.0', count: '800+' },
  { platform: 'Yelp', rating: '4.7', count: '340+' },
];

function StarRating({ rating }: { rating: string }) {
  const num = parseFloat(rating);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={12}
          className={i <= Math.floor(num) ? 'text-amber-400 fill-amber-400' : 'text-amber-300 fill-amber-300'}
        />
      ))}
    </div>
  );
}

export function TrustBar() {
  return (
    <div className="w-full bg-white/80 backdrop-blur-sm border-t border-gray-100 py-2.5 px-4">
      <div className="max-w-2xl mx-auto flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
        <p className="text-xs text-gray-400 font-medium hidden sm:block">Trusted by homeowners:</p>
        {reviews.map((r, i) => (
          <div key={r.platform} className="flex items-center gap-2">
            {i > 0 && <span className="text-gray-200 text-sm hidden sm:block">·</span>}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-gray-600">{r.platform}</span>
              <StarRating rating={r.rating} />
              <span className="text-xs font-bold text-gray-700">{r.rating}</span>
              <span className="text-xs text-gray-400">({r.count})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
