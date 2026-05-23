import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../api/axios';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder');

function CheckoutForm({ booking, listing, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    try {
      const { data } = await api.post('/payments/create-intent', { bookingId: booking._id });
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) }
      });
      if (result.error) throw new Error(result.error.message);
      await api.post('/payments/confirm', { bookingId: booking._id, paymentIntentId: result.paymentIntent.id });
      toast.success('Booking confirmed! 🎉');
      onSuccess();
    } catch (err) {
      toast.error(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePay}>
      <div className="border border-gray-300 rounded-xl p-4 mb-4">
        <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      </div>
      <button type="submit" disabled={!stripe || loading} className="btn-primary w-full">
        {loading ? 'Processing...' : `Pay $${booking.totalPrice}`}
      </button>
      <p className="text-xs text-gray-400 text-center mt-2">Test: use card 4242 4242 4242 4242</p>
    </form>
  );
}

export default function BookingPage() {
  const { listingId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = searchParams.get('guests') || 1;
  const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));

  useEffect(() => {
    api.get(`/listings/${listingId}`).then(res => {
      setListing(res.data);
      return api.post('/bookings', { listingId, checkIn, checkOut, guests: Number(guests) });
    }).then(res => {
      setBooking(res.data);
    }).catch(err => {
      toast.error(err.response?.data?.message || 'Failed to create booking');
      navigate(-1);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-airbnb"></div></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">Confirm and pay</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Your trip</h2>
          <div className="space-y-3 mb-6 text-sm text-gray-700">
            <div className="flex justify-between">
              <span className="font-medium">Dates</span>
              <span>{new Date(checkIn).toLocaleDateString()} – {new Date(checkOut).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Guests</span>
              <span>{guests} guest(s)</span>
            </div>
          </div>
          <h2 className="text-lg font-semibold mb-4">Payment</h2>
          {booking && (
            <Elements stripe={stripePromise}>
              <CheckoutForm booking={booking} listing={listing} onSuccess={() => navigate('/my-bookings')} />
            </Elements>
          )}
        </div>

        {/* Right: Summary */}
        {listing && (
          <div className="border border-gray-200 rounded-2xl p-5 h-fit">
            <div className="flex gap-4 mb-4">
              <img src={listing.images?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200'}
                className="w-20 h-20 rounded-xl object-cover" alt="" />
              <div>
                <p className="font-semibold">{listing.title}</p>
                <p className="text-sm text-gray-500">{listing.location?.city}</p>
              </div>
            </div>
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>${listing.price} × {nights} nights</span>
                <span>${listing.price * nights}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t pt-2">
                <span>Total</span>
                <span>${listing.price * nights}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
