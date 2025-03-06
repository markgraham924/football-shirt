import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Switch,
  FormControlLabel,
  styled,
  ListItemButton
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/WbSunny';
import { useAuth } from '../contexts/AuthContext';
import { toggleTheme } from '../utils/theme';

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'var(--card-bg)',
  color: 'var(--text-color)',
  boxShadow: '0 2px 4px var(--shadow-color)',
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.3rem',
  background: 'linear-gradient(45deg, var(--primary-color) 30%, #5c6bc0 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginRight: '10px'
}));

const ThemeToggle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginLeft: '10px'
}));

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.getAttribute('data-theme') === 'dark'
  );
  
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  
  useEffect(() => {
    // Update theme state if it changes from elsewhere
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.getAttribute('data-theme') === 'dark');
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
    
    return () => observer.disconnect();
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Failed to log out", error);
    }
    handleClose();
  };

  const handleThemeToggle = () => {
    const newTheme = toggleTheme();
    setIsDarkMode(newTheme === 'dark');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const mobileMenu = (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={toggleMobileMenu}
      PaperProps={{
        sx: {
          width: '70%',
          maxWidth: '300px',
          backgroundColor: 'var(--card-bg)',
          color: 'var(--text-color)',
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Menu
        </Typography>
        <List>
          <ListItemButton component={Link} to="/" onClick={toggleMobileMenu}>
            <ListItemText primary="Home" />
          </ListItemButton>
          <ListItemButton component={Link} to="/marketplace" onClick={toggleMobileMenu}>
            <ListItemText primary="Marketplace" />
          </ListItemButton>
          {currentUser && (
            <ListItemButton component={Link} to="/upload" onClick={toggleMobileMenu}>
              <ListItemText primary="Upload" />
            </ListItemButton>
          )}
          {currentUser ? (
            <>
              <ListItemButton component={Link} to="/profile" onClick={toggleMobileMenu}>
                <ListItemText primary="My Profile" />
              </ListItemButton>
              <ListItemButton onClick={() => { handleLogout(); toggleMobileMenu(); }}>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </>
          ) : (
            <>
              <ListItemButton component={Link} to="/login" onClick={toggleMobileMenu}>
                <ListItemText primary="Login" />
              </ListItemButton>
              <ListItemButton component={Link} to="/signup" onClick={toggleMobileMenu}>
                <ListItemText primary="Sign Up" />
              </ListItemButton>
            </>
          )}
          <ListItem>
            <FormControlLabel
              control={<Switch checked={isDarkMode} onChange={handleThemeToggle} />}
              label={isDarkMode ? "Dark Mode" : "Light Mode"}
            />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );

  return (
    <StyledAppBar position="sticky">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LogoText variant="h6" sx={{ textDecoration: 'none' }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            </Link>
          </LogoText>
        </Box>
        
        {isMobile ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {currentUser && (
              <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                {currentUser.displayName ? currentUser.displayName[0] : "U"}
              </Avatar>
            )}
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={toggleMobileMenu}
              sx={{ color: 'var(--text-color)' }}
            >
              <MenuIcon />
            </IconButton>
            {mobileMenu}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button color="inherit" component={Link} to="/" sx={{ margin: '0 5px', borderRadius: '8px', textTransform: 'none', fontWeight: 600, '&:hover': { backgroundColor: 'var(--hover-color)' } }}>Home</Button>
            <Button color="inherit" component={Link} to="/marketplace" sx={{ margin: '0 5px', borderRadius: '8px', textTransform: 'none', fontWeight: 600, '&:hover': { backgroundColor: 'var(--hover-color)' } }}>Marketplace</Button>
            
            {currentUser ? (
              <>
                <Button color="inherit" component={Link} to="/upload" sx={{ margin: '0 5px', borderRadius: '8px', textTransform: 'none', fontWeight: 600, '&:hover': { backgroundColor: 'var(--hover-color)' } }}>Upload</Button>
                
                <IconButton
                  size="medium"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  sx={{ ml: 1, color: 'var(--text-color)' }}
                >
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {currentUser.displayName ? currentUser.displayName[0] : "U"}
                  </Avatar>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      backgroundColor: 'var(--card-bg)',
                      color: 'var(--text-color)',
                    }
                  }}
                >
                  <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>My Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login" sx={{ margin: '0 5px', borderRadius: '8px', textTransform: 'none', fontWeight: 600, '&:hover': { backgroundColor: 'var(--hover-color)' } }}>Login</Button>
                <Button color="inherit" variant="outlined" component={Link} to="/signup" sx={{ margin: '0 5px', borderRadius: '8px', textTransform: 'none', fontWeight: 600, '&:hover': { backgroundColor: 'var(--hover-color)' } }}>Sign Up</Button>
              </>
            )}
            
            <ThemeToggle>
              <IconButton onClick={handleThemeToggle} sx={{ color: 'var(--text-color)' }}>
                {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </ThemeToggle>
          </Box>
        )}
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;
