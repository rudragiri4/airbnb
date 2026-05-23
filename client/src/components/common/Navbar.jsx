import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiSearch, FiMenu, FiUser, FiGlobe } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Navbar({ onSearch }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [where, setWhere] = useState('');
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setActiveField(null);
      }
      if (!e.target.closest('.menu-container')) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = () => {
    if (where.trim()) {
      setActiveField(null);
      if (onSearch) onSearch(where);
      else navigate(`/search?location=${encodeURIComponent(where)}`);
    }
  };

  return (
    <nav className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'border-b border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex items-center justify-between h-20 gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 shrink-0">
            <svg viewBox="0 0 32 32" className="w-8 h-8 fill-airbnb">
              <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.111 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.042 0-4.246-1.272-6.105-3.365l-.207-.238-.09-.104-.109.12c-1.864 2.092-4.08 3.387-6.203 3.387-3.48 0-6.357-2.416-6.357-6.478l.001-.228.01-.415c.05-.924.293-1.805.96-3.396l.145-.353c.982-2.29 5.163-11.054 7.1-14.836l.533-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.239 0-2.053.539-2.987 2.21l-.523 1.008c-1.926 3.776-6.06 12.448-7.031 14.717l-.145.353c-.56 1.336-.74 2.04-.78 2.797l-.007.36-.001.212c0 2.92 1.978 4.478 4.357 4.478 1.555 0 3.36-1.101 4.96-2.934l.244-.284.24-.284.258-.308.28.327.244.284c1.6 1.833 3.405 2.934 4.96 2.934 2.379 0 4.357-1.558 4.357-4.478l-.001-.212-.007-.36c-.04-.757-.22-1.46-.78-2.797l-.145-.353c-.97-2.262-5.082-10.88-7.031-14.717l-.523-1.008C18.053 3.539 17.239 3 16 3z"/>
            </svg>
            <span className="text-airbnb font-bold text-xl hidden lg:block">airbnb</span>
          </Link>

          {/* Center Tabs */}
          <div className="hidden md:flex items-center gap-1">
            
          </div>

          {/* Search Bar */}
          <div ref={searchRef} className="flex-1 max-w-xl">
            <div className={`flex items-center border rounded-full transition-all duration-200 cursor-pointer ${
              activeField ? 'shadow-xl border-transparent' : 'border-gray-300 shadow-sm hover:shadow-md'
            }`}>
              {/* Where */}
              <div className={`flex-1 px-4 py-2.5 rounded-full transition-colors ${activeField === 'where' ? 'bg-white' : 'hover:bg-gray-100'}`}
                onClick={() => setActiveField('where')}>
                <p className="text-xs font-semibold text-gray-800">Where</p>
                <input
                  value={where} onChange={e => setWhere(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder="Search destinations"
                  className="w-full text-sm text-gray-500 outline-none bg-transparent placeholder-gray-400"
                />
              </div>

              <div className="w-px h-6 bg-gray-300"></div>

              {/* Check in */}
              <div className={`px-4 py-2.5 rounded-full transition-colors ${activeField === 'checkin' ? 'bg-white' : 'hover:bg-gray-100'}`}
                onClick={() => setActiveField('checkin')}>
                <p className="text-xs font-semibold text-gray-800">Check in</p>
                <p className="text-sm text-gray-400">{checkIn ? checkIn.toLocaleDateString() : 'Add dates'}</p>
              </div>

              <div className="w-px h-6 bg-gray-300"></div>

              {/* Check out */}
              <div className={`px-4 py-2.5 rounded-full transition-colors ${activeField === 'checkout' ? 'bg-white' : 'hover:bg-gray-100'}`}
                onClick={() => setActiveField('checkout')}>
                <p className="text-xs font-semibold text-gray-800">Check out</p>
                <p className="text-sm text-gray-400">{checkOut ? checkOut.toLocaleDateString() : 'Add dates'}</p>
              </div>

              <div className="w-px h-6 bg-gray-300"></div>

              {/* Who + Search button */}
              <div className="flex items-center gap-2 px-3 py-2">
                <div className={`px-2 py-0.5 rounded-full transition-colors ${activeField === 'guests' ? 'bg-white' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveField('guests')}>
                  <p className="text-xs font-semibold text-gray-800">Who</p>
                  <p className="text-sm text-gray-400">{guests > 0 ? `${guests} guest${guests > 1 ? 's' : ''}` : 'Add guests'}</p>
                </div>
                <button onClick={handleSearch}
                  className="bg-airbnb hover:bg-airbnb-dark text-white rounded-full p-2.5 transition-all hover:scale-105 active:scale-95">
                  <FiSearch size={14} />
                </button>
              </div>
            </div>

            {/* Date pickers dropdown */}
            {activeField === 'checkin' && (
              <div className="absolute mt-2 bg-white rounded-3xl shadow-2xl p-4 z-50">
                <DatePicker selected={checkIn} onChange={d => { setCheckIn(d); setActiveField('checkout'); }}
                  minDate={new Date()} inline />
              </div>
            )}
            {activeField === 'checkout' && (
              <div className="absolute mt-2 bg-white rounded-3xl shadow-2xl p-4 z-50">
                <DatePicker selected={checkOut} onChange={d => { setCheckOut(d); setActiveField(null); }}
                  minDate={checkIn || new Date()} inline />
              </div>
            )}
            {activeField === 'guests' && (
              <div className="absolute mt-2 bg-white rounded-3xl shadow-2xl p-6 z-50 w-72">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">Guests</p>
                    <p className="text-gray-400 text-xs">Ages 13 or above</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setGuests(Math.max(0, guests - 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-600 transition-colors">−</button>
                    <span className="w-4 text-center text-sm">{guests}</span>
                    <button onClick={() => setGuests(guests + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-600 transition-colors">+</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Become host + menu */}
          <div className="flex items-center gap-2 shrink-0">
            <Link to="/host/listings/new" className="hidden md:block text-sm font-medium text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-full transition-colors whitespace-nowrap">
              Become a Host
            </Link>
            <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors">
              <FiGlobe size={18} className="text-gray-600" />
            </button>

            <div className="menu-container relative">
              <button onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 border border-gray-300 rounded-full px-3 py-2 hover:shadow-md transition-shadow">
                <FiMenu className="text-gray-600" size={16} />
                <div className={`rounded-full overflow-hidden ${user?.avatar ? '' : 'bg-gray-500 p-1'}`}>
                  {user?.avatar
                    ? <img src={user.avatar} className="w-6 h-6 rounded-full" alt="" />
                    : <FiUser className="text-white" size={14} />}
                </div>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-fade-in">
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-sm font-semibold text-gray-800 border-b">{user.name}</div>
                      <Link to="/my-bookings" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors">My Bookings</Link>
                      <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors">Profile</Link>
                      {user.role === 'host' && <>
                        <Link to="/host/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors">Host Dashboard</Link>
                        <Link to="/host/listings/new" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors">Add Listing</Link>
                      </>}
                      <hr className="my-1" />
                      <button onClick={() => { logout(); setMenuOpen(false); navigate('/'); }}
                        className="block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 text-red-500 transition-colors">Logout</button>
                    </>
                  ) : (
                    <>
                      <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors">Sign up</Link>
                      <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors">Log in</Link>
                      <hr className="my-1" />
                      <Link to="/host/listings/new" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors">Become a Host</Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}