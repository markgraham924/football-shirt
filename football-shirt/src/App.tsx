import React, { JSX } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Profile from './pages/Profile';
import Marketplace from './pages/Marketplace';
import Upload from './pages/Upload';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ShirtDetail from './pages/ShirtDetail';

// Auth Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1e88e5', // Blue color
    },
    secondary: {
      main: '#ff6f00', // Amber color
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/profile/:userId" element={<Profile />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/upload" element={
        <ProtectedRoute>
          <Upload />
        </ProtectedRoute>
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/shirt/:id" element={<ShirtDetail />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navbar />
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
