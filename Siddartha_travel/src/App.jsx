// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import Nav from "./components/Nav.jsx";
import Home from "./pages/Home";
import About from "./pages/About";
import Register1 from "./pages/Register1.jsx";
import CreateTrip from "./pages/CreateTrip.jsx";
import Dashboard from "./pages/Dashboard";
import PaymentComponent from "./pages/Payment.jsx";
import PaymentResponse from "./pages/PaymentResponse";
import ScrollToTop from "./components/ScrollToTop";
import Login from "./pages/Login";
import TripDetail from "./components/CreateTrip/TripDetail.jsx";
import EventForm from "./pages/EventForm.jsx";
import { useAuth, AuthProvider } from "./context/AuthContext";
import EventDetails from "./components/EventTrip.jsx/Eventsdetails.jsx";
import AdventureSchoolForm from "./pages/AdventureSchool.jsx";
import AdventureDetails from "./components/AdventureSchool/AdventureDetails.jsx";
import AllTripsPage from "./pages/AllTrips.jsx";
import TestPage from "./pages/TestPage.jsx";
import PaymentResponseSimple from "./pages/PaymentResponseSimple.jsx";
import UserPayments from "./pages/UserPayments";
import HostPayments from "./pages/HostPayments";
import BugRequest from "./pages/BugRequest.jsx";
import PrivacyPolicy from "./components/PrivacyPolicy.jsx";
import TermsAndConditions from "./components/TermsAndConditions.jsx";
import Footer from "./components/Footer.jsx";

// import Trips from './pages/'

// Admin imports
import AdminLayout from "./Admin/AdminLayout";
import AdminUsers from "./Admin/pages/AdminUsers.jsx";
import AdminHosts from "./Admin/pages/AdminHosts.jsx";
import AdminFieldConfig from "./Admin/pages/AdminFieldConfig.jsx";
import Bugrequesthost from "./Admin/pages/Bugrequesthost.jsx";
import AdminLogin from "./Admin/pages/AdminLogin.jsx";
import AdminProtectedRoute from "./Admin/AdminProtectedRoute.jsx";

/* --------------------------------------------------
   ✅ Protected Route Components
-------------------------------------------------- */
function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return currentUser ? children : <Navigate to="/login" replace />;
}

function HostOnlyRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== "host") return <Navigate to="/" replace />;

  return children;
}

/* --------------------------------------------------
   ✅ Layout with Nav + Footer
-------------------------------------------------- */
function Layout({ children }) {
  const location = useLocation();
  const hideFooter =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/dashboard";

  return (
    <>
      <Nav />
      {children}
      {!hideFooter && <Footer />}
    </>
  );
}

/* --------------------------------------------------
   ✅ Main App Component
-------------------------------------------------- */
function AppContent() {
  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        {/* Public Pages */}
        {/* <Route path="/Trips" element={<Trips/>}/> */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/alltrips" element={<AllTripsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register1 />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

        {/* Dashboard & Trip Routes */}
        <Route
          path="/dashboard"
          element={
            <HostOnlyRoute>
              <Dashboard />
            </HostOnlyRoute>
          }
        />
        <Route
          path="/create-trip"
          element={
            <ProtectedRoute>
              <CreateTrip />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-trip/:tripId"
          element={
            <ProtectedRoute>
              <CreateTrip />
            </ProtectedRoute>
          }
        />
        <Route path="/trip/:tripId" element={<TripDetail />} />

        {/* Event Routes */}
        <Route
          path="/event-form"
          element={
            <ProtectedRoute>
              <EventForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/event-form/:eventId"
          element={
            <ProtectedRoute>
              <EventForm />
            </ProtectedRoute>
          }
        />
        <Route path="/event/:eventId" element={<EventDetails />} />

        {/* Payment Routes */}
        <Route path="/test" element={<TestPage />} />
        <Route path="/payment" element={<PaymentComponent />} />
        <Route path="/payment/response" element={<PaymentResponse />} />
        <Route
          path="/payment/response-simple"
          element={<PaymentResponseSimple />}
        />
        <Route
          path="/user/payments"
          element={
            <ProtectedRoute>
              <UserPayments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/host/payments"
          element={
            <HostOnlyRoute>
              <HostPayments />
            </HostOnlyRoute>
          }
        />

        {/* Adventure School */}
        <Route
          path="/adventure-form"
          element={
            <ProtectedRoute>
              <AdventureSchoolForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adventure-form/:schoolId"
          element={
            <ProtectedRoute>
              <AdventureSchoolForm />
            </ProtectedRoute>
          }
        />
        <Route path="/adventure/:schoolId" element={<AdventureDetails />} />
        <Route
          path="/adventure-school-details/:schoolId"
          element={<AdventureDetails />}
        />

        {/* Misc */}
        <Route path="/bug-request" element={<BugRequest />} />

        {/* 🔐 Admin Login Route */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* 🔐 Admin Section (Protected) */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route path="users" element={<AdminUsers />} />
          <Route path="hosts" element={<AdminHosts />} />
          <Route path="field-config" element={<AdminFieldConfig />} />
          <Route path="bug-request-host" element={<Bugrequesthost />} />
        </Route>
      </Routes>
    </Layout>
  );
}

/* --------------------------------------------------
   ✅ Wrap with Redux + Auth + Router
-------------------------------------------------- */
function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;
