import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { FiStar, FiMapPin, FiUsers, FiHome } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    Promise.all([
      api.get(`/listings/${id}`),
      api.get(`/reviews/${id}`)
    ]).then(([listingRes, reviewRes]) => {
      setListing(listingRes.data);
      setReviews(reviewRes.data);
    }).catch(() => toast.error('Failed to load listing'))
      .finally(() => setLoading(false));
  }, [id]);

  const nights = checkIn && checkOut
    ? Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
    : 0;

  const handleBook = () => {
    if (!user) { navigate('/login'); return; }
    if (!checkIn || !checkOut) { toast.error('Select dates'); return; }
    navigate(`/booking/${id}?checkIn=${checkIn.toISOString()}&checkOut=${checkOut.toISOString()}&guests=${guests}`);
  };

  if (loading) return <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-airbnb"></div></div>;
  if (!listing) return <div className="text-center py-20">Listing not found</div>;

  const images = listing.images?.length > 0
    ? listing.images
    : ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
        {listing.rating > 0 && (
          <span className="flex items-center gap-1"><FiStar className="fill-current" /> {listing.rating} ({listing.reviewCount} reviews)</span>
        )}
        <span className="flex items-center gap-1"><FiMapPin size={14} /> {listing.location?.city}, {listing.location?.country}</span>
      </div>

      {/* Images */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden h-96 mb-8">
        <div className="col-span-2 row-span-2">
          <img src={images[0]} alt="" className="w-full h-full object-cover" />
        </div>
        {images.slice(1, 5).map((img, i) => (
          <div key={i} className="overflow-hidden">
            <img src={img} alt="" className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Details */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-4 pb-6 border-b">
            <div>
              <h2 className="text-xl font-semibold">Hosted by {listing.host?.name}</h2>
              <p className="text-gray-500 text-sm">
                {listing.guests} guests · {listing.bedrooms} bedrooms · {listing.beds} beds · {listing.bathrooms} baths
              </p>
            </div>
            {listing.host?.avatar && (
              <img src={listing.host.avatar} className="w-12 h-12 rounded-full ml-auto" alt="" />
            )}
          </div>

          <div className="py-6 border-b">
            <h3 className="text-lg font-semibold mb-3">About this place</h3>
            <p className="text-gray-600 leading-relaxed">{listing.description}</p>
          </div>

          {listing.amenities?.length > 0 && (
            <div className="py-6 border-b">
              <h3 className="text-lg font-semibold mb-4">What this place offers</h3>
              <div className="grid grid-cols-2 gap-3">
                {listing.amenities.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-600">
                    <span>✓</span> {a}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="py-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiStar className="fill-current" /> {listing.rating > 0 ? `${listing.rating} · ${reviews.length} reviews` : 'No reviews yet'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map(review => (
                <div key={review._id} className="p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
                      {review.author?.name?.[0]}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{review.author?.name}</p>
                      <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 border border-gray-200 rounded-2xl p-6 shadow-lg">
            <div className="text-2xl font-bold mb-4">
              ${listing.price} <span className="text-lg font-normal text-gray-500">/ night</span>
            </div>

            <div className="border border-gray-300 rounded-xl overflow-hidden mb-3">
              <div className="grid grid-cols-2 divide-x divide-gray-300">
                <div className="p-3">
                  <label className="text-xs font-semibold uppercase text-gray-600">Check-in</label>
                  <DatePicker selected={checkIn} onChange={setCheckIn} minDate={new Date()}
                    selectsStart startDate={checkIn} endDate={checkOut}
                    placeholderText="Add date" className="w-full text-sm outline-none cursor-pointer" />
                </div>
                <div className="p-3">
                  <label className="text-xs font-semibold uppercase text-gray-600">Checkout</label>
                  <DatePicker selected={checkOut} onChange={setCheckOut} minDate={checkIn || new Date()}
                    selectsEnd startDate={checkIn} endDate={checkOut}
                    placeholderText="Add date" className="w-full text-sm outline-none cursor-pointer" />
                </div>
              </div>
              <div className="p-3 border-t border-gray-300">
                <label className="text-xs font-semibold uppercase text-gray-600">Guests</label>
                <div className="flex items-center gap-3 mt-1">
                  <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-7 h-7 rounded-full border border-gray-400 flex items-center justify-center">-</button>
                  <span className="text-sm">{guests}</span>
                  <button onClick={() => setGuests(Math.min(listing.guests, guests + 1))} className="w-7 h-7 rounded-full border border-gray-400 flex items-center justify-center">+</button>
                </div>
              </div>
            </div>

            <button onClick={handleBook} className="btn-primary w-full text-center">
              {checkIn && checkOut ? 'Reserve' : 'Check availability'}
            </button>

            {nights > 0 && (
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>${listing.price} × {nights} nights</span>
                  <span>${listing.price * nights}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Total</span>
                  <span>${listing.price * nights}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
