import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';

// Pages
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { VideoScan } from './pages/VideoScan/VideoScan';
import { VideoResult } from './pages/VideoResult/VideoResult';
import { History } from './pages/History/History';
import { AdminPanel } from './pages/AdminPanel/AdminPanel';
import { SecurityTips } from './pages/SecurityTips/SecurityTips';
import { Subscription } from './pages/Subscription/Subscription';
import { Checkout } from './pages/Subscription/Checkout';
import { Profile } from './pages/Profile/Profile';
import { NewsAlerts } from './pages/NewsAlerts/NewsAlerts';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/" replace />;
    return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scan" element={<VideoScan />} />
            <Route path="/result/:id" element={<VideoResult />} />
            <Route path="/history" element={<History />} />
            <Route path="/news" element={<NewsAlerts />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/tips" element={<SecurityTips />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/checkout/:tier" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
