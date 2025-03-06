const THEME_KEY = 'football-shirt-theme';

// Function to toggle between light and dark themes
export const toggleTheme = () => {
  const currentTheme = localStorage.getItem(THEME_KEY) || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  // Update localStorage
  localStorage.setItem(THEME_KEY, newTheme);
  
  // Update data-theme attribute on document element
  document.documentElement.setAttribute('data-theme', newTheme);
  
  return newTheme;
};

// Function to initialize theme from localStorage or system preference
export const initializeTheme = () => {
  // Check localStorage first
  const savedTheme = localStorage.getItem(THEME_KEY);
  
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    return;
  }
  
  // Check system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = prefersDark ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
};
