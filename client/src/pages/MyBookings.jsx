import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const statusColor = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings/my').then(res => setBookings(res.data))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      setBookings(bookings.map(b => b._id === id ? {...b, status: 'cancelled'} : b));
      toast.success('Booking cancelled');
    } catch {
      toast.error('Failed to cancel');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-airbnb"></div></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">My Bookings</h1>
      {bookings.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-5xl mb-4">🧳</p>
          <p className="text-xl font-semibold">No bookings yet</p>
          <Link to="/" className="text-airbnb font-semibold mt-2 inline-block hover:underline">Start exploring</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking._id} className="border border-gray-200 rounded-2xl p-5 flex gap-4 items-start">
              <img
                src={booking.listing?.images?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200'}
                className="w-24 h-24 rounded-xl object-cover shrink-0" alt=""
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <Link to={`/listings/${booking.listing?._id}`} className="font-semibold hover:underline">
                      {booking.listing?.title}
                    </Link>
                    <p className="text-sm text-gray-500">{booking.listing?.location?.city}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[booking.status]}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <span>{new Date(booking.checkIn).toLocaleDateString()} – {new Date(booking.checkOut).toLocaleDateString()}</span>
                  <span className="mx-2">·</span>
                  <span>{booking.guests} guests</span>
                  <span className="mx-2">·</span>
                  <span className="font-semibold">${booking.totalPrice}</span>
                </div>
                {booking.status === 'pending' && (
                  <button onClick={() => handleCancel(booking._id)}
                    className="mt-2 text-sm text-red-500 hover:underline">Cancel booking</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
