import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import OnboardingModal from "@/components/shared/OnboardingModal";

// Layouts
import PublicLayout from "@/layouts/PublicLayout";
import AuthLayout from "@/layouts/AuthLayout";
import AdminLayout from "@/layouts/AdminLayout";

// Public Pages
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import Pricing from "@/pages/Pricing";

// Auth Pages
import Dashboard from "@/pages/Dashboard";
import Feed from "@/pages/Feed";
import Doubts from "@/pages/Doubts";
import DoubtsNew from "@/pages/DoubtsNew";
import DoubtsDetail from "@/pages/DoubtsDetail";
import Projects from "@/pages/Projects";
import ProjectsNew from "@/pages/ProjectsNew";
import ProjectDetail from "@/pages/ProjectDetail";
import Mentors from "@/pages/Mentors";
import MentorProfile from "@/pages/MentorProfile";
import StudyRooms from "@/pages/StudyRooms";
import StudyRoom from "@/pages/StudyRoom";
import MockTests from "@/pages/MockTests";
import MockTest from "@/pages/MockTest";
import TestResults from "@/pages/TestResults";
import Leaderboard from "@/pages/Leaderboard";
import Hiring from "@/pages/Hiring";
import Aura from "@/pages/Aura";
import Profile from "@/pages/Profile";
import Connections from "@/pages/Connections";
import Settings from "@/pages/Settings";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminMentors from "@/pages/admin/AdminMentors";
import AdminReports from "@/pages/admin/AdminReports";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

// Inner component — lives inside BrowserRouter so useNavigate works
function AppInner() {
  const { needsOnboarding, isAuthenticated } = useAuthStore();

  return (
    <>
      {/* Onboarding modal for new Google users */}
      {isAuthenticated && needsOnboarding && (
        <OnboardingModal
          onComplete={() => useAuthStore.setState({ needsOnboarding: false })}
        />
      )}

      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
        </Route>

        {/* Auth */}
        <Route element={<ProtectedRoute><AuthLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/doubts" element={<Doubts />} />
          <Route path="/doubts/new" element={<DoubtsNew />} />
          <Route path="/doubts/:id" element={<DoubtsDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/new" element={<ProjectsNew />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/mentors/:username" element={<MentorProfile />} />
          <Route path="/study-rooms" element={<StudyRooms />} />
          <Route path="/study-rooms/:roomId" element={<StudyRoom />} />
          <Route path="/mock-tests" element={<MockTests />} />
          <Route path="/mock-tests/:testId" element={<MockTest />} />
          <Route path="/mock-tests/results/:id" element={<TestResults />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/hiring" element={<Hiring />} />
          <Route path="/aura" element={<Aura />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/connections" element={<Connections />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Admin */}
        <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/mentors" element={<AdminMentors />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
