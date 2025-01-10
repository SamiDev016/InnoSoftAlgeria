// Initialize AOS
AOS.init({
    duration: 800,
    offset: 100,
    once: true,
    easing: 'ease-out-cubic'
});

// Initialize Splitting
Splitting();

// Initialize Swiper
const servicesSwiper = new Swiper('.services-swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    pagination: {
        el: '.swiper-pagination',
        clickable: true
    },
    breakpoints: {
        640: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        },
    }
});

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Animate hero section
gsap.from('.hero-content', {
    opacity: 0,
    y: 100,
    duration: 1,
    ease: 'power4.out'
});

gsap.from('.hero-image', {
    opacity: 0,
    x: 100,
    duration: 1,
    delay: 0.5,
    ease: 'power4.out'
});

// Animate services cards on scroll
gsap.utils.toArray('.service-card').forEach(card => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out'
    });
});

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
});

// Contact Form Validation
const contactForm = document.querySelector('#contact-form');
const formInputs = contactForm.querySelectorAll('input, textarea');

const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};

const validatePhone = (phone) => {
    return phone.match(/^[\d\s\-\+\(\)]{8,}$/);
};

formInputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim() === '') {
            input.classList.add('error');
        } else {
            if (input.type === 'email' && !validateEmail(input.value)) {
                input.classList.add('error');
            } else if (input.type === 'tel' && !validatePhone(input.value)) {
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        }
    });
});

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let isValid = true;
    
    formInputs.forEach(input => {
        if (input.value.trim() === '') {
            input.classList.add('error');
            isValid = false;
        } else if (input.type === 'email' && !validateEmail(input.value)) {
            input.classList.add('error');
            isValid = false;
        } else if (input.type === 'tel' && !validatePhone(input.value)) {
            input.classList.add('error');
            isValid = false;
        }
    });

    if (!isValid) {
        showToast('Please fill in all required fields correctly', 'error');
        return;
    }

    try {
        const formData = new FormData(contactForm);
        const response = await fetch('/api/contact', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            showToast('Message sent successfully!', 'success');
            contactForm.reset();
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        showToast('Failed to send message. Please try again later.', 'error');
    }
});

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Intersection Observer for animations
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.animate-on-scroll').forEach((element) => {
    animateOnScroll.observe(element);
});

// Language handling
let currentLang = 'en';

function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // Update current language display
    const currentLangDisplay = document.querySelector('.current-lang');
    currentLangDisplay.textContent = lang.toUpperCase();
    
    // Update all translations
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = key.split('.').reduce((obj, i) => obj[i], translations[lang]);
        if (translation) {
            if (element.hasAttribute('data-splitting')) {
                element.innerHTML = translation;
                Splitting({ target: element });
            } else {
                element.textContent = translation;
            }
        }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translation = key.split('.').reduce((obj, i) => obj[i], translations[lang]);
        if (translation) {
            element.placeholder = translation;
        }
    });

    // Update active language in dropdown
    document.querySelectorAll('.lang-dropdown a').forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-lang') === lang);
    });
}

// Language selector event listeners
document.querySelectorAll('.lang-dropdown a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = e.target.getAttribute('data-lang');
        setLanguage(lang);
    });
});

// Remove preloader when page is loaded
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    preloader.style.opacity = '0';
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 300);
});
