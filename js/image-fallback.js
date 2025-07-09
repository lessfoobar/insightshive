// Add this to a new file: js/image-fallback.js
// This provides better fallback handling for missing images

document.addEventListener('DOMContentLoaded', function() {
    // Handle image loading errors for team photos
    const teamImages = document.querySelectorAll('.team-photo img');
    
    teamImages.forEach(img => {
        img.addEventListener('error', function() {
            const container = this.parentNode;
            const altText = this.getAttribute('alt');
            
            // Hide the image
            this.style.display = 'none';
            
            // Add fallback styling
            container.classList.add('default');
            
            // Create initials from name
            const initials = altText.split(' ').map(name => name.charAt(0)).join('');
            container.innerHTML = initials;
        });
        
        // Add loading animation
        img.addEventListener('load', function() {
            this.style.opacity = '0';
            this.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 100);
        });
    });
});

// Preload images for better performance
function preloadTeamImages() {
    const imageUrls = [
        'images/team/nikola-kalev.jpg',
        'images/team/ognyan-vasilev.jpg',
        'images/team/ivan-ivanov.jpg'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Call preload function
preloadTeamImages();