import { Link, useLocation } from 'react-router-dom';
import { FiSearch, FiHeart, FiUser, FiGrid } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  const path = location.pathname;

  const tabs = [
    { to: '/', icon: FiSearch, label: 'Explore' },
    { to: '/my-bookings', icon: FiHeart, label: 'Wishlists' },
    ...(user?.role === 'host' ? [{ to: '/host/dashboard', icon: FiGrid, label: 'Host' }] : []),
    { to: user ? '/profile' : '/login', icon: FiUser, label: user ? 'Profile' : 'Log in' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex md:hidden">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const active = path === tab.to;
        return (
          <Link key={tab.to} to={tab.to}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${
              active ? 'text-airbnb' : 'text-gray-500'
            }`}>
            <Icon size={22} className={active ? 'stroke-[2.5]' : ''} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}