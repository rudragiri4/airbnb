import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useState } from 'react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ListingDetail from './pages/ListingDetail';
import SearchResults from './pages/SearchResults';
import BookingPage from './pages/BookingPage';
import MyBookings from './pages/MyBookings';
import HostDashboard from './pages/HostDashboard';
import CreateListing from './pages/CreateListing';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children, hostOnly }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-airbnb"></div>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  if (hostOnly && user.role !== 'host') return <Navigate to="/" />;
  return children;
};

function AppRoutes() {
  const navigate = useNavigate();
  const [homeSearch, setHomeSearch] = useState(null);

  const handleNavSearch = (loc) => {
    // If on home page, trigger home search; else navigate to search page
    if (window.location.pathname === '/') {
      setHomeSearch(loc);
    } else {
      navigate(`/search?location=${encodeURIComponent(loc)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onSearch={handleNavSearch} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home externalSearch={homeSearch} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/booking/:listingId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          <Route path="/host/dashboard" element={<ProtectedRoute hostOnly><HostDashboard /></ProtectedRoute>} />
          <Route path="/host/listings/new" element={<ProtectedRoute hostOnly><CreateListing /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-center" />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}