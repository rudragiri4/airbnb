import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ListingCard from '../components/listings/ListingCard';
import { FiFilter } from 'react-icons/fi';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const location = searchParams.get('location') || '';
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', guests: '', propertyType: '' });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ city: location, ...filters });
    api.get(`/listings?${params}`)
      .then(res => setListings(res.data.listings || []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, [location, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {location ? `Stays in "${location}"` : 'All Listings'}
          {!loading && <span className="text-gray-500 font-normal text-base ml-2">({listings.length} results)</span>}
        </h1>
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-2 hover:bg-gray-50">
          <FiFilter /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase">Min Price</label>
            <input type="number" placeholder="$0" className="input-field mt-1 py-2"
              value={filters.minPrice} onChange={e => setFilters({...filters, minPrice: e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase">Max Price</label>
            <input type="number" placeholder="Any" className="input-field mt-1 py-2"
              value={filters.maxPrice} onChange={e => setFilters({...filters, maxPrice: e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase">Guests</label>
            <input type="number" placeholder="1" className="input-field mt-1 py-2"
              value={filters.guests} onChange={e => setFilters({...filters, guests: e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase">Type</label>
            <select className="input-field mt-1 py-2" value={filters.propertyType} onChange={e => setFilters({...filters, propertyType: e.target.value})}>
              <option value="">All types</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="cabin">Cabin</option>
              <option value="condo">Condo</option>
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-2xl aspect-square mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings.map(listing => <ListingCard key={listing._id} listing={listing} />)}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-xl font-semibold">No results found</p>
          <p className="text-sm mt-2">Try different dates, location, or filters</p>
        </div>
      )}
    </div>
  );
}
