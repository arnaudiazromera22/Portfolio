// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Tabbed Navigation System
// Select all potential "pages" - sections and the header which serves as Home
const pages = document.querySelectorAll('section, header.hero');
const navItems = document.querySelectorAll('.nav-links a');

// Function to show a specific section
function showSection(targetId) {
    // 1. Hide all sections
    pages.forEach(page => {
        page.classList.add('hidden');
        page.classList.remove('fade-in'); // Reset animation
    });

    // 2. Remove active class from all nav links
    navItems.forEach(item => {
        item.classList.remove('active');
    });

    // 3. Show target section
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        targetSection.classList.add('fade-in');

        // Safely reset videos and iframes ONLY when entering the projects section
        if (targetId === 'projects') {
            targetSection.querySelectorAll('video').forEach(video => {
                video.pause();
                video.currentTime = 0; 
            });
            
            targetSection.querySelectorAll('iframe').forEach(iframe => {
                const currentSrc = iframe.src.split('?')[0].split('#')[0]; 
                iframe.src = currentSrc + '?t=' + Date.now() + '#page=1&view=FitH';
            });
        }

        // Scroll to top when switching views for a "page turn" feel
        window.scrollTo(0, 0);
    }

    // 4. Set active state on nav link
    const activeLink = document.querySelector(`.nav-links a[href="#${targetId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Initialize: Show Home only
document.addEventListener('DOMContentLoaded', () => {
    // Hide everything first
    pages.forEach(page => page.classList.add('hidden'));

    // Show Home
    showSection('home');
});

// Event Delegation for all internal links
document.body.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        showSection(targetId);
    }
});


// FAQ Accordion (Preserved)
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(faq => {
                if (faq !== item) {
                    faq.classList.remove('active');
                }
            });
            // Toggle current item
            item.classList.toggle('active');
        });
    }
});

// Contact Form & Phone Modal - REMOVED (Replaced with Google Form Link)
// Code related to EmailJS and the phone chat interface has been removed as per the request to use a Google Form.
// Scroll Reveal Animation (Visual Overhaul)
const revealElements = document.querySelectorAll('section, .service-card, .project-card, .testimonial-card, .achievement-item, .hero-content, .hero-image');

// Add base reveal class
revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Optional: Stop observing once revealed for one-time animation
            // observer.unobserve(entry.target); 
        }
    });
}, {
    root: null,
    threshold: 0.15, // Trigger when 15% visible
    rootMargin: "0px"
});

revealElements.forEach(el => revealObserver.observe(el));

// Force media links to open from the start when clicking the overlay
document.querySelectorAll('.project-overlay a').forEach(link => {
    link.addEventListener('click', function(e) {
        // Prevent default caching by appending a timestamp query param
        let baseHref = this.getAttribute('href');
        
        // If it already has a timestamp, just use the base
        if (baseHref.includes('?')) {
            baseHref = baseHref.split('?')[0];
        } else if (baseHref.includes('#')) {
            baseHref = baseHref.split('#')[0];
        }
        
        if (baseHref.endsWith('.pdf')) {
            this.href = `${baseHref}?t=${new Date().getTime()}#page=1`;
        } else if (baseHref.endsWith('.mp4')) {
            this.href = `${baseHref}?t=${new Date().getTime()}#t=0`;
        }
    });
});
