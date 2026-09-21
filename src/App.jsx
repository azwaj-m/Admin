import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import AdminPlaceholder from './pages/AdminPlaceholder';
import Users from './pages/Users';
import UserDetails from './pages/UserDetails';
import Verification from './pages/Verification';
import Reports from './pages/Reports';
import Pricing from './pages/Pricing';

const Placeholder = ({ title, description }) => (
  <AdminPlaceholder title={title} description={description} />
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />

        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserDetails />} />

          <Route path="/verification" element={<Verification />} />

          <Route path="/reports" element={<Reports />} />

          <Route
            path="/subscriptions"
            element={
              <Placeholder
                title="پریمیم ممبرشپ"
                description="Silver، Gold اور Platinum subscriptions"
              />
            }
          />

          <Route
            path="/payments"
            element={
              <Placeholder
                title="ادائیگیاں"
                description="Payments، transactions اور verification"
              />
            }
          />

          <Route
            path="/pricing"
            element={<Pricing />}
          />

          <Route
            path="/notifications"
            element={
              <Placeholder
                title="نوٹیفکیشنز"
                description="Azwaj notification management"
              />
            }
          />

          <Route
            path="/content"
            element={
              <Placeholder
                title="مواد اور FAQ"
                description="Help، FAQ اور system content"
              />
            }
          />

          <Route
            path="/admin-security"
            element={
              <Placeholder
                title="ایڈمن سیکیورٹی"
                description="Roles، permissions اور audit logs"
              />
            }
          />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
