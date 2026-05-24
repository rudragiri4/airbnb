import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { FiStar, FiHeart, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const categories = [
  { label: 'Amazing pools', icon: '🏊', query: 'pools' },
  { label: 'Beachfront', icon: '🏖️', query: 'beachfront' },
  { label: 'Cabins', icon: '🏕️', query: 'cabins' },
  { label: 'Countryside', icon: '🌾', query: 'countryside' },
  { label: 'Tiny homes', icon: '🏠', query: 'tiny homes' },
  { label: 'Mansions', icon: '🏰', query: 'mansions' },
  { label: 'Mountains', icon: '⛰️', query: 'mountains' },
  { label: 'Tropical', icon: '🌴', query: 'tropical' },
  { label: 'Luxury', icon: '✨', query: 'luxury villas' },
  { label: 'Skiing', icon: '⛷️', query: 'ski resort' },
  { label: 'Camping', icon: '⛺', query: 'camping' },
  { label: 'City view', icon: '🌆', query: 'city view apartment' },
];

function ListingCard({ property, index }) {
  const [liked, setLiked] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [hovered, setHovered] = useState(false);

  const images = property.images?.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600'];

  const name = property.name || 'Beautiful Property';
  const price = property.price?.total || property.price?.rate || property.price?.amount || null;
  const rating = property.rating || property.avgRating || null;
  const reviewCount = property.reviewsCount || 0;
  const beds = property.beds;
  const bedrooms = property.bedrooms;
  const bathrooms = property.bathrooms;
  const type = property.type || 'Entire rental unit';
  const isGuestFav = rating >= 4.9 || reviewCount > 50;

  return (
    <div
      className="group cursor-pointer"
      style={{ animationDelay: `${index * 60}ms`, animation: 'fadeSlideUp 0.5s ease forwards', opacity: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative rounded-xl md:rounded-2xl overflow-hidden aspect-square bg-gray-100">
        <img
          src={images[imgIdx]}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          onError={e => e.target.src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600'}
        />
        {/* Guest favourite badge */}
        {isGuestFav && (
          <div className="absolute top-2 left-2 bg-white text-gray-800 text-[10px] md:text-xs font-semibold px-2 md:px-3 py-0.5 md:py-1 rounded-full shadow-md">
            Guest favourite
          </div>
        )}
        {/* Heart */}
        <button
          onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
          className="absolute top-2 right-2 transition-transform hover:scale-110 active:scale-90"
        >
          <FiHeart className={`w-4 h-4 md:w-5 md:h-5 transition-all duration-200 drop-shadow-lg ${liked ? 'fill-airbnb text-airbnb' : 'text-white fill-black/20'}`} />
        </button>
        {/* Image nav arrows - desktop only */}
        {images.length > 1 && (
          <>
            <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 hidden md:flex gap-1 transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
              {images.slice(0, 5).map((_, i) => (
                <button key={i} onClick={e => { e.preventDefault(); setImgIdx(i); }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIdx ? 'bg-white scale-125' : 'bg-white/60'}`} />
              ))}
            </div>
            <button onClick={e => { e.preventDefault(); setImgIdx(Math.max(0, imgIdx - 1)); }}
              className={`absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md transition-all duration-200 hidden md:flex ${hovered && imgIdx > 0 ? 'opacity-100' : 'opacity-0'}`}>
              <FiChevronLeft size={14} />
            </button>
            <button onClick={e => { e.preventDefault(); setImgIdx(Math.min(images.length - 1, imgIdx + 1)); }}
              className={`absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md transition-all duration-200 hidden md:flex ${hovered && imgIdx < images.length - 1 ? 'opacity-100' : 'opacity-0'}`}>
              <FiChevronRight size={14} />
            </button>
          </>
        )}
      </div>

      {/* Info */}
      <a href={property.url || property.deeplink} target="_blank" rel="noreferrer" className="block mt-2 md:mt-3">
        <div className="flex justify-between items-start gap-1">
          <h3 className="font-semibold text-gray-900 text-xs md:text-sm leading-snug line-clamp-1">{name}</h3>
          {rating > 0 && (
            <div className="flex items-center gap-0.5 shrink-0">
              <FiStar className="fill-gray-900 text-gray-900" size={10} />
              <span className="text-xs text-gray-900">{Number(rating).toFixed(2)}</span>
            </div>
          )}
        </div>
        <p className="text-gray-500 text-xs mt-0.5">{type}</p>
        <p className="text-gray-500 text-xs hidden md:block">
          {[bedrooms && `${bedrooms} bed${bedrooms > 1 ? 's' : ''}`,
            beds && `${beds} bed${beds > 1 ? 's' : ''}`,
            bathrooms && `${bathrooms} bath`
          ].filter(Boolean).join(' · ')}
        </p>
        <p className="mt-1 text-xs md:text-sm">
          {price
            ? <><span className="font-semibold text-gray-900">${typeof price === 'object' ? price.amount || price : price}</span><span className="text-gray-500"> night</span></>
            : <span className="font-semibold text-gray-900 underline text-xs">View on Airbnb</span>
          }
        </p>
      </a>
    </div>
  );
}

export default function Home({ externalSearch }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchLocation, setSearchLocation] = useState('New York');
  const catScrollRef = useRef(null);

  useEffect(() => {
    if (externalSearch) {
      setSearchLocation(externalSearch);
      fetchListings(externalSearch);
    }
  }, [externalSearch]);

  const fetchListings = async (loc) => {
    setLoading(true);
    setListings([]);
    try {
      const res = await api.get(`/search?location=${encodeURIComponent(loc)}`);
      const items = res.data?.results || [];
      setListings(items.slice(0, 20));
    } catch (err) {
      console.error('fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings('New York'); }, []);

  const handleCategoryClick = (cat, idx) => {
    setActiveCategory(idx);
    setSearchLocation(cat.label);
    fetchListings(cat.query);
  };

  const handleSearch = (loc) => {
    setSearchLocation(loc);
    fetchListings(loc);
  };

  const scrollCats = (dir) => {
    catScrollRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' });
  };

  return (
    <div>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 md:px-10 py-6">

        {/* Categories bar */}
        <div className="relative flex items-center mb-6">
          <button onClick={() => scrollCats(-1)}
            className="absolute left-0 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-md hover:shadow-lg transition-shadow hidden md:flex items-center justify-center">
            <FiChevronLeft size={16} />
          </button>

          <div ref={catScrollRef} className="cat-scroll flex gap-6 overflow-x-auto px-2 md:px-10 w-full">
            {categories.map((cat, i) => (
              <button key={cat.label} onClick={() => handleCategoryClick(cat, i)}
                className={`flex flex-col items-center gap-1.5 min-w-fit pb-2 border-b-2 transition-all duration-200 group ${
                  activeCategory === i
                    ? 'border-gray-800 text-gray-800'
                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-300'
                }`}>
                <span className={`text-2xl transition-transform duration-200 ${activeCategory === i ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {cat.icon}
                </span>
                <span className="text-xs font-medium whitespace-nowrap">{cat.label}</span>
              </button>
            ))}
          </div>

          <button onClick={() => scrollCats(1)}
            className="absolute right-0 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-md hover:shadow-lg transition-shadow hidden md:flex items-center justify-center">
            <FiChevronRight size={16} />
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i}>
                <div className="shimmer rounded-xl md:rounded-2xl aspect-square mb-2 md:mb-3"></div>
                <div className="shimmer h-3 md:h-4 rounded-full mb-1.5 md:mb-2 w-3/4"></div>
                <div className="shimmer h-2.5 md:h-3 rounded-full mb-1 md:mb-1.5 w-1/2"></div>
                <div className="shimmer h-2.5 md:h-3 rounded-full w-1/3"></div>
              </div>
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {listings.map((listing, i) => (
              <ListingCard key={listing.id || i} property={listing} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-gray-400">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-lg font-semibold text-gray-600">No listings found</p>
            <p className="text-sm mt-1">Try searching a different location</p>
          </div>
        )}
      </div>
    </div>
  );
}