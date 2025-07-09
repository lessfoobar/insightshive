// Enhanced mobile-menu.js with dark mode integration
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize dark mode
    initializeDarkMode();
    
    function initializeMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        // Create menu toggle button if it doesn't exist
        if (!menuToggle) {
            const navContainer = document.querySelector('.nav-container');
            const newMenuToggle = document.createElement('button');
            newMenuToggle.className = 'menu-toggle';
            newMenuToggle.innerHTML = '<span></span><span></span><span></span>';
            newMenuToggle.setAttribute('aria-label', 'Toggle navigation menu');
            navContainer.appendChild(newMenuToggle);
            
            // Add event listener to new button
            newMenuToggle.addEventListener('click', toggleMenu);
        } else {
            menuToggle.addEventListener('click', toggleMenu);
        }
        
        function toggleMenu() {
            const toggle = document.querySelector('.menu-toggle');
            const links = document.querySelector('.nav-links');
            
            toggle.classList.toggle('active');
            links.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (links.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
        
        // Close menu when clicking on a link
        const navLinksItems = document.querySelectorAll('.nav-links a');
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                document.querySelector('.menu-toggle').classList.remove('active');
                document.querySelector('.nav-links').classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const toggle = document.querySelector('.menu-toggle');
            const links = document.querySelector('.nav-links');
            
            if (toggle && links && !toggle.contains(event.target) && !links.contains(event.target)) {
                toggle.classList.remove('active');
                links.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const toggle = document.querySelector('.menu-toggle');
                const links = document.querySelector('.nav-links');
                if (toggle && links && links.classList.contains('active')) {
                    toggle.classList.remove('active');
                    links.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    }
    
    function initializeDarkMode() {
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
                initialTheme = 'dark';
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
                
                // Add a small animation when toggling
                themeToggle.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    themeToggle.style.transform = 'scale(1)';
                }, 150);
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
            const elements = document.querySelectorAll('*');
            elements.forEach(el => {
                el.style.transition = 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease';
            });
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
    }
});