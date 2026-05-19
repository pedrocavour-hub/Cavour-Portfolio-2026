// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const isOpen = navMenu.classList.contains('active');
    hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu when a link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

// Project Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filterValue === 'all' || category === filterValue) {
                card.style.display = 'block';
                // Trigger animation
                setTimeout(() => {
                    card.style.animation = 'fadeInUp 0.5s ease';
                }, 10);
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Debounced scroll handler for better performance
let ticking = false;

function updateNavbarAndLinks() {
    const navbar = document.querySelector('.navbar');
    
    // Update navbar shadow on scroll
    if (window.scrollY > 100) {
        navbar.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }

    // Update active nav link on scroll
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateNavbarAndLinks();
            ticking = false;
        });
        ticking = true;
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});

// Observe experience items
document.querySelectorAll('.experience-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'all 0.6s ease';
    observer.observe(item);
});

// Observe skill categories
document.querySelectorAll('.skill-category').forEach(skill => {
    skill.style.opacity = '0';
    skill.style.transform = 'translateY(20px)';
    skill.style.transition = 'all 0.6s ease';
    observer.observe(skill);
});

// Observe education cards
document.querySelectorAll('.education-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});

// Number counter animation
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    
    const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

// Trigger counter animations
const highlightCards = document.querySelectorAll('.highlight-card h3');
let countersAnimated = false;

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
            countersAnimated = true;
            highlightCards.forEach(card => {
                const text = card.textContent;
                const number = parseInt(text);
                if (!isNaN(number)) {
                    animateCounter(card, number);
                }
            });
        }
    });
});

// Fixed: use querySelector to get single element, then observe it
const highlightSection = document.querySelector('.about-highlights');
if (highlightSection) {
    counterObserver.observe(highlightSection);
}

// Click outside mobile menu to close (improved to not interfere with hamburger)
document.addEventListener('click', (e) => {
    const isClickingHamburger = e.target.closest('.hamburger');
    const isClickingNavMenu = e.target.closest('.nav-menu');
    
    if (!isClickingHamburger && !isClickingNavMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});

// Contact form link tracking
document.querySelectorAll('.contact-card, .cta-buttons a').forEach(link => {
    link.addEventListener('click', function() {
        console.log('User clicked contact link:', this.href);
    });
});

// Resume download tracking
document.querySelector('.btn-resume')?.addEventListener('click', function() {
    console.log('User downloading resume');
});

// Add CSS for active nav link
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary-color);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// Lazy load images for better performance
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        images.forEach(img => imageObserver.observe(img));
    }
}

// Preload images for better performance
function preloadImages() {
    const images = document.querySelectorAll('img:not([data-src])');
    images.forEach(img => {
        const newImg = new Image();
        newImg.src = img.src;
    });
}

window.addEventListener('load', () => {
    preloadImages();
    lazyLoadImages();
});

// Log page view (for analytics integration)
console.log('Portfolio loaded successfully');
console.log('Current page:', window.location.href);

// Dark mode toggle (optional)
function initDarkMode() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
        document.body.classList.add('dark-mode');
    }
}

// Initialize dark mode on load
window.addEventListener('DOMContentLoaded', initDarkMode);
