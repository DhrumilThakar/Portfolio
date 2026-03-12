/* ============================================
   CYBER BLUE PORTFOLIO - SCRIPT.JS
   Smooth scroll, theme toggle, animations, form handling
   ============================================ */

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setupNavigation();
  setupFormHandling();
  setupScrollReveals();
  setupHeroAnimation();
  setupProjectFilter();
});

// ============================================
// THEME TOGGLE
// ============================================

function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('portfolio-theme');
  
  // Set initial theme
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    themeToggle.textContent = '☀️';
  } else {
    document.body.classList.remove('light-theme');
    themeToggle.textContent = '🌙';
  }
  
  // Toggle theme on button click
  themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const isLightTheme = body.classList.toggle('light-theme');
  
  // Update localStorage
  localStorage.setItem('portfolio-theme', isLightTheme ? 'light' : 'dark');
  
  // Update icon
  themeToggle.textContent = isLightTheme ? '☀️' : '🌙';
}

// ============================================
// SMOOTH SCROLL NAVIGATION
// ============================================

function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Only handle anchor links
      if (href.startsWith('#')) {
        e.preventDefault();
        
        const targetSection = document.querySelector(href);
        if (targetSection) {
          // Calculate offset for fixed navbar
          const navHeight = document.querySelector('.navbar').offsetHeight;
          const targetPosition = targetSection.offsetTop - navHeight;
          
          // Smooth scroll with requestAnimationFrame for better performance
          smoothScrollTo(targetPosition, 800);
        }
      }
    });
  });
}

function smoothScrollTo(target, duration) {
  const start = window.scrollY;
  const distance = target - start;
  let startTime = null;
  
  function ease(t) {
    // Ease-out cubic function
    return 1 - Math.pow(1 - t, 3);
  }
  
  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    window.scrollTo(0, start + distance * ease(progress));
    
    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  }
  
  requestAnimationFrame(animation);
}

// ============================================
// FORM HANDLING
// ============================================

function setupFormHandling() {
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form values
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();
      
      // Basic validation
      if (!name || !email || !message) {
        showFormMessage('Please fill in all fields', 'error');
        return;
      }
      
      // Email validation
      if (!isValidEmail(email)) {
        showFormMessage('Please enter a valid email address', 'error');
        return;
      }
      
      // Send email using EmailJS
      sendEmailViaEmailJS(name, email, message, contactForm);
    });
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showFormMessage(message, type) {
  const formMessage = document.getElementById('formMessage');
  if (formMessage) {
    formMessage.textContent = message;
    formMessage.className = `form-message`;
    
    // Color based on type
    if (type === 'error') {
      formMessage.style.borderLeftColor = '#f87171';
      formMessage.style.color = '#f87171';
    } else {
      formMessage.style.borderLeftColor = '#22c55e';
      formMessage.style.color = '#22c55e';
    }
    
    formMessage.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      formMessage.classList.add('hidden');
    }, 5000);
  }
}

function sendEmailViaEmailJS(name, email, message, form) {
  // Using Formspree for simple form handling (no backend needed)
  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('message', message);
  
  fetch('https://formspree.io/f/mvzwrqbz', {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  })
    .then(response => {
      if (response.ok) {
        showFormMessage('Thank you! Your message has been sent to dhruvmilthakar@gmail.com', 'success');
        form.reset();
      } else {
        showFormMessage('Failed to send message. Please try again.', 'error');
      }
    })
    .catch(error => {
      showFormMessage('Failed to send message. Please try again or email directly.', 'error');
      console.error('Form submission error:', error);
    });
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================

function setupScrollReveals() {
  const revealElements = document.querySelectorAll('.project-card, .tech-category');
  
  // Create Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add visible class for animation
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  revealElements.forEach(element => {
    observer.observe(element);
  });
}

// ============================================
// HERO ANIMATION
// ============================================

function setupHeroAnimation() {
  const particles = document.querySelectorAll('.particle');
  
  // Animate particles on page load
  particles.forEach((particle, index) => {
    particle.style.animation = `drift ${4 + index}s ease-in-out infinite`;
  });
}

// ============================================
// PROJECT FILTER
// ============================================

function setupProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const projectsGrid = document.querySelector('.projects-grid');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      
      // Update active button styling
      filterBtns.forEach(b => b.classList.remove('filter-btn-active'));
      btn.classList.add('filter-btn-active');
      
      // Filter projects
      let visibleCount = 0;
      projectCards.forEach(card => {
        const languages = card.dataset.languages || '';
        const languageArray = languages.split(',').map(lang => lang.trim());
        
        if (filter === 'all' || languageArray.includes(filter)) {
          card.classList.remove('hidden');
          visibleCount++;
        } else {
          card.classList.add('hidden');
        }
      });
      
      // Show/hide no projects message
      let noProjectsMsg = projectsGrid.querySelector('.no-projects-message');
      if (visibleCount === 0) {
        if (!noProjectsMsg) {
          noProjectsMsg = document.createElement('div');
          noProjectsMsg.className = 'no-projects-message';
          noProjectsMsg.textContent = `No projects found for ${filter === 'all' ? 'this filter' : filter} 😢`;
          projectsGrid.appendChild(noProjectsMsg);
        }
      } else {
        if (noProjectsMsg) {
          noProjectsMsg.remove();
        }
      }
    });
  });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Detect when user scrolls past navbar
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 10) {
    navbar.style.borderBottomColor = 'rgba(30, 41, 59, 0.5)';
    navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
  } else {
    navbar.style.borderBottomColor = '';
    navbar.style.boxShadow = '';
  }
});

// Performance optimization: Debounce scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    // Can add additional scroll-related logic here
  }, 150);
});

// ============================================
// BACK TO TOP BUTTON
// ============================================

const backToTopLink = document.querySelector('.back-to-top');
if (backToTopLink) {
  backToTopLink.addEventListener('click', (e) => {
    e.preventDefault();
    smoothScrollTo(0, 800);
  });
}

// ============================================
// BUTTON INTERACTIONS
// ============================================

// Add ripple effect to all buttons
document.querySelectorAll('.btn, .btn-link, .social-link').forEach(button => {
  button.addEventListener('mouseenter', function() {
    // Can add additional hover effects here
  });
});

// ============================================
// KEYBOARD ACCESSIBILITY
// ============================================

document.addEventListener('keydown', (e) => {
  // Close any open menus on Escape
  if (e.key === 'Escape') {
    // Can be extended for mobile menu
  }
  
  // Quick scroll with keyboard
  if (e.key === 'Home' || (e.ctrlKey && e.key === 'Home')) {
    e.preventDefault();
    smoothScrollTo(0, 800);
  }
});

// ============================================
// MOBILE OPTIMIZATION
// ============================================

// Prevent zooming on double-tap in older browsers
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }
  lastTouchEnd = now;
}, false);

// ============================================
// EXTERNAL LINKS
// ============================================

document.querySelectorAll('a[href^="http"]').forEach(link => {
  link.setAttribute('target', '_blank');
  link.setAttribute('rel', 'noopener noreferrer');
});

// ============================================
// LAZY LOADING SUPPORT (for future image optimization)
// ============================================

if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  });
  
  document.querySelectorAll('img.lazy').forEach(img => {
    imageObserver.observe(img);
  });
}

// ============================================
// ANALYTICS / TRACKING (optional - can be customized)
// ============================================

// Track section views
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Can be used to track section views in analytics
      // console.log('Viewing section:', entry.target.id);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('section').forEach(section => {
  sectionObserver.observe(section);
});
