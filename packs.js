document.addEventListener('DOMContentLoaded', function() {
  // Setup Dark Mode Toggle
  setupDarkMode();
  
  // Setup Language Selector
  setupLanguageSelector();
  
  // Setup Contact Form
  setupContactForm();
  
  // Setup Mobile Pack Navigation
  setupMobileNavigation();
});

// Dark Mode Toggle functionality
function setupDarkMode() {
  const darkModeToggle = document.getElementById("darkModeToggle");

  // Check for saved theme preference or use system preference
  const prefersDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedTheme = localStorage.getItem("theme");

  // Apply the saved theme or system preference
  if (savedTheme === "dark" || (!savedTheme && prefersDarkMode)) {
    document.documentElement.classList.add("dark");
  }

  // Function to toggle dark mode
  function toggleDarkMode() {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }

  // Add event listener to toggle button
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", toggleDarkMode);
  }
}

// Language Selector functionality
function setupLanguageSelector() {
  const languageOptions = document.querySelectorAll('.language-option');
  const currentLanguageSpan = document.getElementById('current-language');
  
  // Get saved language or default to English
  const savedLanguage = localStorage.getItem('language') || 'en';
  setLanguage(savedLanguage);
  
  // Set active class on the current language option
  languageOptions.forEach(option => {
    if (option.getAttribute('data-lang') === savedLanguage) {
      option.classList.add('active');
    } else {
      option.classList.remove('active');
    }
  });
  
  // Add event listeners to language options
  languageOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      e.preventDefault();
      const lang = option.getAttribute('data-lang');
      setLanguage(lang);
      
      // Update active class
      languageOptions.forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');
      
      // Save language preference
      localStorage.setItem('language', lang);
    });
  });
  
  // Function to set language
  function setLanguage(lang) {
    // Update current language display
    if (currentLanguageSpan) {
      currentLanguageSpan.textContent = lang.toUpperCase();
    }
    
    // Update all text elements with data-en and data-fr attributes
    const elements = document.querySelectorAll('[data-en][data-fr]');
    elements.forEach(element => {
      element.textContent = element.getAttribute(`data-${lang}`);
    });
  }
}

// Email sending function
function sendMail() {
  let parms = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    company: document.getElementById('company').value,
    message: document.getElementById('message').value,
    pack: document.getElementById('packType').value || 'None'
  }

  emailjs.send('service_e5gfubt', 'template_37jepbs', parms)
    .then(() => {
      // Show success animation
      const successAnimation = document.getElementById("successAnimation");
      if (successAnimation) {
        successAnimation.classList.add('active');
        
        // Hide success animation after 3 seconds
        setTimeout(() => {
          successAnimation.classList.remove('active');
          document.getElementById('contactForm').reset(); // Reset form
        }, 3000);
      }
    })
    .catch(error => {
      console.error('Error sending email:', error);
      // You could add error handling here
      alert('Failed to send email. Please try again later.');
    });
}

// Contact Form functionality
function setupContactForm() {
  const contactButtons = document.querySelectorAll('.contact-btn');
  const selectedPackSpan = document.getElementById('selectedPack');
  const packTypeInput = document.getElementById('packType');
  const contactForm = document.getElementById('contactForm');
  
  // Set up contact button click handlers
  contactButtons.forEach(button => {
    button.addEventListener('click', function() {
      const packTitle = this.getAttribute('data-pack');
      
      // Update the form with the selected pack
      if (selectedPackSpan) {
        selectedPackSpan.textContent = packTitle;
      }
      
      if (packTypeInput) {
        packTypeInput.value = packTitle;
      }
      
      // Scroll to contact section
      document.getElementById('contactSection').scrollIntoView({ behavior: 'smooth' });
    });
  });
  
  // Handle form submission
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Show loading state on button if needed
      const submitBtn = contactForm.querySelector('.submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }
      
      // Send email using EmailJS
      sendMail();
      
      // Reset button state after sending
      if (submitBtn) {
        setTimeout(() => {
          submitBtn.disabled = false;
          const currentLang = localStorage.getItem('language') || 'en';
          submitBtn.textContent = currentLang === 'en' ? 'Submit Request' : 'Envoyer la demande';
        }, 3000);
      }
    });
  }
}

// Mobile Pack Navigation
function setupMobileNavigation() {
  const packsGrid = document.querySelector('.packs-grid');
  const packCards = document.querySelectorAll('.pack-card');
  const prevButton = document.querySelector('.prev-pack');
  const nextButton = document.querySelector('.next-pack');
  const indicators = document.querySelectorAll('.indicator');
  
  if (!packsGrid || !prevButton || !nextButton) return;
  
  let currentIndex = 0;
  let isMobile = window.innerWidth < 768;
  
  // Function to update the active pack
  function updateActivePack() {
    if (!isMobile) return;
    
    // Calculate the percentage to translate based on the current index
    // Each card takes up 33.333% of the total width (100% / 3)
    const translatePercentage = currentIndex * (100 / packCards.length);
    
    // Update transform to show the current pack
    packsGrid.style.transform = `translateX(-${translatePercentage}%)`;
    
    // Update indicators
    indicators.forEach((indicator, index) => {
      if (index === currentIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
    
    // Update button states
    prevButton.disabled = currentIndex === 0;
    prevButton.style.opacity = currentIndex === 0 ? "0.5" : "1";
    nextButton.disabled = currentIndex === packCards.length - 1;
    nextButton.style.opacity = currentIndex === packCards.length - 1 ? "0.5" : "1";
  }
  
  // Add event listeners to navigation buttons
  prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateActivePack();
    }
  });
  
  nextButton.addEventListener('click', () => {
    if (currentIndex < packCards.length - 1) {
      currentIndex++;
      updateActivePack();
    }
  });
  
  // Add event listeners to indicators
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      currentIndex = index;
      updateActivePack();
    });
  });
  
  // Handle touch events for swiping
  let touchStartX = 0;
  let touchEndX = 0;
  
  packsGrid.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  packsGrid.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance to register as a swipe
    
    if (touchEndX < touchStartX - swipeThreshold && currentIndex < packCards.length - 1) {
      // Swipe left - go to next
      currentIndex++;
      updateActivePack();
    } else if (touchEndX > touchStartX + swipeThreshold && currentIndex > 0) {
      // Swipe right - go to previous
      currentIndex--;
      updateActivePack();
    }
  }
  
  // Initialize mobile view if on mobile
  if (isMobile) {
    updateActivePack();
  }
  
  // Update on window resize
  window.addEventListener('resize', () => {
    const newIsMobile = window.innerWidth < 768;
    
    if (newIsMobile !== isMobile) {
      isMobile = newIsMobile;
      
      // Reset styles if switching between mobile and desktop
      if (!isMobile) {
        packsGrid.style.transform = '';
      } else {
        currentIndex = 0; // Reset to first card when switching to mobile
        updateActivePack();
      }
    }
  });
}