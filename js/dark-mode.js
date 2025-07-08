// dark-mode.js - Dark mode toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create the dark mode toggle button
    createThemeToggle();
    
    // Initialize theme based on user preference or system preference
    initializeTheme();
    
    function createThemeToggle() {
        // Check if theme toggle already exists
        if (document.querySelector('.theme-toggle')) return;
        
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.setAttribute('aria-label', 'Toggle dark mode');
        themeToggle.innerHTML = getThemeIcon();
        
        // Add event listener
        themeToggle.addEventListener('click', toggleTheme);
        
        // Append to body
        document.body.appendChild(themeToggle);
    }
    
    function getThemeIcon() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        return currentTheme === 'dark' ? '☀️' : '🌙';
    }
    
    function initializeTheme() {
        // Check for saved theme preference or default to system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        let initialTheme;
        if (savedTheme) {
            initialTheme = savedTheme;
        } else {
            initialTheme = systemPrefersDark ? 'dark' : 'light';
        }
        
        setTheme(initialTheme);
        updateToggleIcon();
    }
    
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        setTheme(newTheme);
        updateToggleIcon();
        
        // Add a subtle animation effect
        animateThemeChange();
    }
    
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update meta theme-color for mobile browsers
        updateMetaThemeColor(theme);
    }
    
    function updateToggleIcon() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = getThemeIcon();
        }
    }
    
    function updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        // Set theme color based on current theme
        metaThemeColor.content = theme === 'dark' ? '#2d2d2d' : '#ffffff';
    }
    
    function animateThemeChange() {
        document.body.style.transition = 'none';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 50);
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        // Only update if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            setTheme(newTheme);
            updateToggleIcon();
        }
    });
    
    // Keyboard accessibility for theme toggle
    document.addEventListener('keydown', function(e) {
        // Toggle theme with Ctrl+D or Cmd+D
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            toggleTheme();
        }
    });
});