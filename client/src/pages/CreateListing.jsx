import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const amenitiesList = ['WiFi', 'Kitchen', 'Parking', 'Pool', 'Air conditioning', 'Heating', 'Washer', 'TV', 'Gym', 'BBQ'];

export default function CreateListing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', price: '',
    propertyType: 'apartment', guests: 1, bedrooms: 1, beds: 1, bathrooms: 1,
    location: { city: '', country: '', address: '' },
    amenities: [], images: []
  });
  const [imageUrls, setImageUrls] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const images = imageUrls.split('\n').map(u => u.trim()).filter(Boolean);
      await api.post('/listings', { ...form, images, price: Number(form.price) });
      toast.success('Listing created!');
      navigate('/host/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  const toggleAmenity = (a) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(a) ? prev.amenities.filter(x => x !== a) : [...prev.amenities, a]
    }));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">Create a new listing</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input type="text" required className="input-field" placeholder="Cozy apartment in the heart of Paris"
            value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea required rows={4} className="input-field resize-none"
            value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price / night ($)</label>
            <input type="number" required min="1" className="input-field"
              value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
            <select className="input-field" value={form.propertyType} onChange={e => setForm({...form, propertyType: e.target.value})}>
              {['apartment', 'house', 'villa', 'cabin', 'condo', 'studio'].map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[['guests','Max Guests'],['bedrooms','Bedrooms'],['beds','Beds'],['bathrooms','Bathrooms']].map(([key, label]) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input type="number" min="1" className="input-field py-2"
                value={form[key]} onChange={e => setForm({...form, [key]: Number(e.target.value)})} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[['city','City'],['country','Country'],['address','Address']].map(([key, label]) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input type="text" required={key !== 'address'} className="input-field py-2"
                value={form.location[key]}
                onChange={e => setForm({...form, location: {...form.location, [key]: e.target.value}})} />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
          <div className="flex flex-wrap gap-2">
            {amenitiesList.map(a => (
              <button type="button" key={a} onClick={() => toggleAmenity(a)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  form.amenities.includes(a) ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-300 hover:border-gray-500'
                }`}>
                {a}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (one per line)</label>
          <textarea rows={3} className="input-field resize-none text-sm"
            placeholder="https://images.unsplash.com/photo-..."
            value={imageUrls} onChange={e => setImageUrls(e.target.value)} />
          <p className="text-xs text-gray-400 mt-1">Paste Unsplash or other image URLs, one per line</p>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
}
