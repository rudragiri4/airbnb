import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function HostDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    api.get('/host/stats').then(res => setStats(res.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteListing = async (id) => {
    if (!confirm('Delete this listing?')) return;
    try {
      await api.delete(`/listings/${id}`);
      setStats(prev => ({ ...prev, listings: prev.listings.filter(l => l._id !== id) }));
      toast.success('Listing deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-airbnb"></div></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Host Dashboard</h1>
        <Link to="/host/listings/new" className="btn-primary">+ Add Listing</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Listings', value: stats?.totalListings || 0, icon: '🏠' },
          { label: 'Total Bookings', value: stats?.totalBookings || 0, icon: '📅' },
          { label: 'Total Revenue', value: `$${stats?.totalRevenue || 0}`, icon: '💰' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-2xl p-5 text-center">
            <p className="text-3xl mb-1">{s.icon}</p>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        {['overview', 'listings', 'bookings'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab ? 'border-gray-800 text-gray-800' : 'border-transparent text-gray-500'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'listings' && (
        <div className="space-y-4">
          {stats?.listings?.length === 0 ? (
            <p className="text-gray-500 text-center py-10">No listings yet. <Link to="/host/listings/new" className="text-airbnb hover:underline">Add one!</Link></p>
          ) : (
            stats?.listings?.map(listing => (
              <div key={listing._id} className="flex items-center gap-4 border border-gray-200 rounded-2xl p-4">
                <img src={listing.images?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100'}
                  className="w-16 h-16 rounded-xl object-cover" alt="" />
                <div className="flex-1">
                  <p className="font-semibold">{listing.title}</p>
                  <p className="text-sm text-gray-500">{listing.location?.city} · ${listing.price}/night</p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/listings/${listing._id}`} className="text-sm text-blue-500 hover:underline">View</Link>
                  <button onClick={() => handleDeleteListing(listing._id)} className="text-sm text-red-500 hover:underline">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {stats?.recentBookings?.length === 0 ? (
            <p className="text-gray-500 text-center py-10">No bookings yet</p>
          ) : (
            stats?.recentBookings?.map(booking => (
              <div key={booking._id} className="flex items-center gap-4 border border-gray-200 rounded-2xl p-4">
                <div className="flex-1">
                  <p className="font-semibold">{booking.listing?.title}</p>
                  <p className="text-sm text-gray-500">
                    Guest: {booking.guest?.name} · {new Date(booking.checkIn).toLocaleDateString()} – {new Date(booking.checkOut).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${booking.totalPrice}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="text-center py-10 text-gray-500">
          <p className="text-4xl mb-3">📊</p>
          <p>Switch to Listings or Bookings tab to manage your property</p>
        </div>
      )}
    </div>
  );
}
