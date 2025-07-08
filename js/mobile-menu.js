// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Create menu toggle button if it doesn't exist
    if (!menuToggle) {
        const navContainer = document.querySelector('.nav-container');
        const newMenuToggle = document.createElement('button');
        newMenuToggle.className = 'menu-toggle';
        newMenuToggle.innerHTML = '<span></span><span></span><span></span>';
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
    }
    
    // Close menu when clicking on a link
    const navLinksItems = document.querySelectorAll('.nav-links a');
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            document.querySelector('.menu-toggle').classList.remove('active');
            document.querySelector('.nav-links').classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const toggle = document.querySelector('.menu-toggle');
        const links = document.querySelector('.nav-links');
        
        if (!toggle.contains(event.target) && !links.contains(event.target)) {
            toggle.classList.remove('active');
            links.classList.remove('active');
        }
    });
});