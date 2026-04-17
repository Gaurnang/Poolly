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
    <Route
      path="/"
      element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}
    >
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="create-poll" element={<CreatePollPage />} />
      <Route path="my-polls" element={<MyPollsPage />} />
      <Route path="voted-polls" element={<VotedPollsPage />} />
      <Route path="bookmarked" element={<BookmarkedPollsPage />} />
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
