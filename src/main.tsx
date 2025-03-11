
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { Toaster } from "sonner"
import './index.css'
import './ios-styles.css'

// Check for dark mode preference
const getTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Set initial theme
document.documentElement.setAttribute('data-theme', getTheme());

// Create a theme listener to update when localStorage changes
window.addEventListener('storage', () => {
  const currentTheme = getTheme();
  document.documentElement.setAttribute('data-theme', currentTheme);
});

// Add theme change listener for Settings page changes
window.addEventListener('themeChange', ((e: CustomEvent) => {
  const theme = e.detail.theme;
  document.documentElement.setAttribute('data-theme', theme);
}) as EventListener);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster position="top-right" />
    </BrowserRouter>
  </React.StrictMode>,
)
