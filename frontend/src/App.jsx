import { Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import CreatePollPage from './pages/CreatePollPage';
import MyPollsPage from './pages/MyPollsPage';
import VotedPollsPage from './pages/VotedPollsPage';
import BookmarkedPollsPage from './pages/BookmarkedPollsPage';
import LoadingSpinner from './components/common/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  if (loading) return <LoadingSpinner fullscreen />;
  return user ? children : <Navigate to="/login" replace />;
};

// Layout accessible by anyone; only child routes may be protected
const PublicLayout = () => {
  const { loading } = useUser();
  if (loading) return <LoadingSpinner fullscreen />;
  return <DashboardLayout />;
};

const GuestRoute = ({ children }) => {
  const { user, loading } = useUser();
  if (loading) return <LoadingSpinner fullscreen />;
  return !user ? children : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route
      path="/login"
      element={<GuestRoute><LoginPage /></GuestRoute>}
    />
    <Route
      path="/signup"
      element={<GuestRoute><SignupPage /></GuestRoute>}
    />
    <Route path="/" element={<PublicLayout />}>
      {/* Public — anyone can browse */}
      <Route path="dashboard" element={<DashboardPage />} />
      {/* Protected — must be logged in */}
      <Route path="create-poll" element={<ProtectedRoute><CreatePollPage /></ProtectedRoute>} />
      <Route path="my-polls" element={<ProtectedRoute><MyPollsPage /></ProtectedRoute>} />
      <Route path="voted-polls" element={<ProtectedRoute><VotedPollsPage /></ProtectedRoute>} />
      <Route path="bookmarked" element={<ProtectedRoute><BookmarkedPollsPage /></ProtectedRoute>} />
    </Route>
  </Routes>
);

export default function App() {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
}
