import React, { JSX } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Box from '@mui/material/Box';

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

// Create a theme that will dynamically update based on CSS variables
const createAppTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    // We're using CSS variables for most colors, but defining some here for MUI
    primary: {
      main: mode === 'light' ? '#3f51b5' : '#7986cb',
    },
    secondary: {
      main: mode === 'light' ? '#f50057' : '#ff4081',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: 'var(--background-color)',
          color: 'var(--text-color)',
        },
      },
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
  // Determine current theme mode
  const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
  const theme = React.useMemo(() => createAppTheme(isDarkMode ? 'dark' : 'light'), [isDarkMode]);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh',
            bgcolor: 'var(--background-color)',
            color: 'var(--text-color)',
            transition: 'background-color 0.3s, color 0.3s'
          }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
              <AppRoutes />
            </Box>
            {/* You can add a footer here if needed */}
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
