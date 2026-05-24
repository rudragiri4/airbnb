import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiSearch, FiMenu, FiUser, FiGlobe, FiX } from 'react-icons/fi';

export default function Navbar({ onSearch }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [where, setWhere] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = () => {
    if (where.trim()) {
      setMobileSearchOpen(false);
      if (onSearch) onSearch(where);
      else navigate(`/search?location=${encodeURIComponent(where)}`);
      setWhere('');
    }
  };

  return (
    <>
      <nav className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'border-b border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">

          {/* Desktop Navbar */}
          <div className="hidden md:flex items-center justify-between h-20 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-1.5 shrink-0">
              <svg viewBox="0 0 32 32" className="w-8 h-8 fill-airbnb">
                <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.111 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.042 0-4.246-1.272-6.105-3.365l-.207-.238-.09-.104-.109.12c-1.864 2.092-4.08 3.387-6.203 3.387-3.48 0-6.357-2.416-6.357-6.478l.001-.228.01-.415c.05-.924.293-1.805.96-3.396l.145-.353c.982-2.29 5.163-11.054 7.1-14.836l.533-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.239 0-2.053.539-2.987 2.21l-.523 1.008c-1.926 3.776-6.06 12.448-7.031 14.717l-.145.353c-.56 1.336-.74 2.04-.78 2.797l-.007.36-.001.212c0 2.92 1.978 4.478 4.357 4.478 1.555 0 3.36-1.101 4.96-2.934l.244-.284.24-.284.258-.308.28.327.244.284c1.6 1.833 3.405 2.934 4.96 2.934 2.379 0 4.357-1.558 4.357-4.478l-.001-.212-.007-.36c-.04-.757-.22-1.46-.78-2.797l-.145-.353c-.97-2.262-5.082-10.88-7.031-14.717l-.523-1.008C18.053 3.539 17.239 3 16 3z"/>
              </svg>
              <span className="text-airbnb font-bold text-xl">airbnb</span>
            </Link>

            {/* Desktop Search */}
            <div className="flex-1 max-w-xl">
              <div className="flex items-center border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-1 px-4 py-2.5">
                  <p className="text-xs font-semibold text-gray-800">Where</p>
                  <input value={where} onChange={e => setWhere(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    placeholder="Search destinations"
                    className="w-full text-sm text-gray-500 outline-none bg-transparent" />
                </div>
                <div className="w-px h-6 bg-gray-300"></div>
                <div className="px-4 py-2.5">
                  <p className="text-xs font-semibold text-gray-800">Check in</p>
                  <p className="text-sm text-gray-400">Add dates</p>
                </div>
                <div className="w-px h-6 bg-gray-300"></div>
                <div className="px-4 py-2.5">
                  <p className="text-xs font-semibold text-gray-800">Check out</p>
                  <p className="text-sm text-gray-400">Add dates</p>
                </div>
                <div className="w-px h-6 bg-gray-300"></div>
                <div className="flex items-center gap-2 px-3 py-2">
                  <div className="px-2">
                    <p className="text-xs font-semibold text-gray-800">Who</p>
                    <p className="text-sm text-gray-400">Add guests</p>
                  </div>
                  <button onClick={handleSearch}
                    className="bg-airbnb hover:bg-airbnb-dark text-white rounded-full p-2.5 transition-all hover:scale-105 active:scale-95">
                    <FiSearch size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              <Link to="/host/listings/new" className="text-sm font-medium text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-full transition-colors whitespace-nowrap">
                Become a Host
              </Link>
              <button className="w-10 h-10 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center">
                <FiGlobe size={18} className="text-gray-600" />
              </button>
              <div ref={menuRef} className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 border border-gray-300 rounded-full px-3 py-2 hover:shadow-md transition-shadow">
                  <FiMenu size={16} className="text-gray-600" />
                  <div className="bg-gray-500 rounded-full p-1">
                    <FiUser className="text-white" size={14} />
                  </div>
                </button>
                {menuOpen && <DropdownMenu user={user} logout={logout} navigate={navigate} setMenuOpen={setMenuOpen} />}
              </div>
            </div>
          </div>

          {/* Mobile Navbar */}
          <div className="flex md:hidden items-center justify-between h-16 gap-3">
            {/* Logo */}
            <Link to="/" className="shrink-0">
              <svg viewBox="0 0 32 32" className="w-7 h-7 fill-airbnb">
                <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.111 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.042 0-4.246-1.272-6.105-3.365l-.207-.238-.09-.104-.109.12c-1.864 2.092-4.08 3.387-6.203 3.387-3.48 0-6.357-2.416-6.357-6.478l.001-.228.01-.415c.05-.924.293-1.805.96-3.396l.145-.353c.982-2.29 5.163-11.054 7.1-14.836l.533-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.239 0-2.053.539-2.987 2.21l-.523 1.008c-1.926 3.776-6.06 12.448-7.031 14.717l-.145.353c-.56 1.336-.74 2.04-.78 2.797l-.007.36-.001.212c0 2.92 1.978 4.478 4.357 4.478 1.555 0 3.36-1.101 4.96-2.934l.244-.284.24-.284.258-.308.28.327.244.284c1.6 1.833 3.405 2.934 4.96 2.934 2.379 0 4.357-1.558 4.357-4.478l-.001-.212-.007-.36c-.04-.757-.22-1.46-.78-2.797l-.145-.353c-.97-2.262-5.082-10.88-7.031-14.717l-.523-1.008C18.053 3.539 17.239 3 16 3z"/>
              </svg>
            </Link>

            {/* Mobile Search Button */}
            <button onClick={() => setMobileSearchOpen(true)}
              className="flex-1 flex items-center gap-3 border border-gray-200 rounded-full px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow">
              <FiSearch size={16} className="text-gray-500 shrink-0" />
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800 leading-none">Where to?</p>
                <p className="text-xs text-gray-400 mt-0.5">Anywhere · Any week · Add guests</p>
              </div>
            </button>

            {/* Mobile Menu */}
            <div ref={menuRef} className="relative shrink-0">
              <button onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-1.5 border border-gray-300 rounded-full px-2.5 py-2 hover:shadow-md transition-shadow">
                <FiMenu size={15} className="text-gray-600" />
                <div className="bg-gray-500 rounded-full p-1">
                  <FiUser className="text-white" size={12} />
                </div>
              </button>
              {menuOpen && <DropdownMenu user={user} logout={logout} navigate={navigate} setMenuOpen={setMenuOpen} />}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Full Screen Search */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex items-center gap-3 p-4 border-b">
            <button onClick={() => setMobileSearchOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
              <FiX size={20} />
            </button>
            <div className="flex-1 flex items-center border border-gray-300 rounded-full px-4 py-2.5 gap-2 shadow-sm">
              <FiSearch size={16} className="text-gray-400 shrink-0" />
              <input
                autoFocus
                value={where}
                onChange={e => setWhere(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Search destinations..."
                className="flex-1 text-sm outline-none text-gray-800 placeholder-gray-400"
              />
              {where && <button onClick={() => setWhere('')}><FiX size={14} className="text-gray-400" /></button>}
            </div>
            <button onClick={handleSearch}
              className="bg-airbnb text-white rounded-full p-2.5 shrink-0">
              <FiSearch size={16} />
            </button>
          </div>
          {/* Quick suggestions */}
          <div className="p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Popular destinations</p>
            {['New York', 'Paris', 'Bali', 'Tokyo', 'London', 'Dubai'].map(city => (
              <button key={city} onClick={() => { setWhere(city); if (onSearch) { onSearch(city); setMobileSearchOpen(false); } }}
                className="flex items-center gap-3 w-full py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <FiSearch size={16} className="text-gray-500" />
                </div>
                <span className="text-sm font-medium text-gray-800">{city}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function DropdownMenu({ user, logout, navigate, setMenuOpen }) {
  return (
    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-fade-in">
      {user ? (
        <>
          <div className="px-4 py-2 text-sm font-semibold text-gray-800 border-b">{user.name}</div>
          <Link to="/my-bookings" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-gray-50">My Bookings</Link>
          <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-gray-50">Profile</Link>
          {user.role === 'host' && <>
            <Link to="/host/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-gray-50">Host Dashboard</Link>
            <Link to="/host/listings/new" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-gray-50">Add Listing</Link>
          </>}
          <hr className="my-1" />
          <button onClick={() => { logout(); setMenuOpen(false); navigate('/'); }}
            className="block w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-gray-50">Logout</button>
        </>
      ) : (
        <>
          <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm font-semibold hover:bg-gray-50">Sign up</Link>
          <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-gray-50">Log in</Link>
          <hr className="my-1" />
          <Link to="/host/listings/new" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-gray-50">Become a Host</Link>
        </>
      )}
    </div>
  );
}