import { Link } from 'react-router-dom';
import { FiStar, FiHeart } from 'react-icons/fi';
import { useState } from 'react';

export default function ListingCard({ listing }) {
  const [liked, setLiked] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  const images = listing.images?.length > 0
    ? listing.images
    : ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500'];

  return (
    <div className="group">
      {/* Image */}
      <div className="relative rounded-2xl overflow-hidden aspect-square bg-gray-100">
        <img
          src={images[imgIndex]}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
          className="absolute top-3 right-3 p-1.5 rounded-full"
        >
          <FiHeart className={`w-5 h-5 ${liked ? 'fill-airbnb text-airbnb' : 'text-white drop-shadow'}`} />
        </button>
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {images.slice(0, 5).map((_, i) => (
              <button key={i} onClick={e => { e.preventDefault(); setImgIndex(i); }}
                className={`w-1.5 h-1.5 rounded-full ${i === imgIndex ? 'bg-white' : 'bg-white/60'}`} />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <Link to={`/listings/${listing._id}`} className="block mt-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-900 truncate">{listing.location?.city}, {listing.location?.country}</h3>
          {listing.rating > 0 && (
            <div className="flex items-center gap-1 text-sm ml-2 shrink-0">
              <FiStar className="fill-current" size={12} />
              <span>{Number(listing.rating).toFixed(1)}</span>
            </div>
          )}
        </div>
        <p className="text-gray-500 text-sm truncate">{listing.title}</p>
        <p className="text-gray-500 text-sm">
          {listing.guests} guests · {listing.bedrooms} bed · {listing.bathrooms} bath
        </p>
        <p className="mt-1 text-gray-900">
          <span className="font-semibold">${listing.price}</span>
          <span className="text-gray-500"> / night</span>
        </p>
      </Link>
    </div>
  );
}
