// Update the setupTypingAnimation function
function setupTypingAnimation() {
  const textElement = document.getElementById("typing-text")
  const typingArea = document.querySelector(".typing-area")
  
  // Set different text based on the page language
  const currentLang = localStorage.getItem('language') || 'en'
  const fullText = currentLang === 'en' ? "web solutions with " : "solutions web avec "
  
  let index = 0

  // Calculate the width needed for the full text plus the brand name
  // This helps prevent layout shifts
  const tempSpan = document.createElement("span")
  tempSpan.style.visibility = "hidden"
  tempSpan.style.position = "absolute"
  tempSpan.style.fontSize = window.getComputedStyle(textElement).fontSize
  tempSpan.style.fontFamily = window.getComputedStyle(textElement).fontFamily
  tempSpan.textContent = fullText + "pluss.dev"
  document.body.appendChild(tempSpan)

  // Set minimum width based on the full text
  const fullWidth = tempSpan.offsetWidth
  typingArea.style.minWidth = fullWidth + 10 + "px" // Add a little extra space

  // Remove the temporary element
  document.body.removeChild(tempSpan)

  // Clear any existing text
  textElement.textContent = ""

  // Function to add one character at a time
  function typeText() {
    if (index < fullText.length) {
      textElement.textContent += fullText.charAt(index)
      index++
      setTimeout(typeText, 100) // Adjust speed here (lower = faster)
    } else {
      // When typing is complete, add the span with "pluss.dev" with a fade-in effect
      const span = document.createElement("span")
      span.textContent = "pluss.dev"
      span.classList.add("brand-text")
      span.style.opacity = "0"
      textElement.appendChild(span)

      // Fade in the brand name
      setTimeout(() => {
        span.style.transition = "opacity 0.5s ease"
        span.style.opacity = "1"
      }, 200)
    }
  }

  // Start the typing animation
  setTimeout(typeText, 500) // Delay before starting
}

// Modal functionality
function setupModals() {
  const techButton = document.getElementById("techButton")
  const bioButton = document.getElementById("bioButton")
  const techModal = document.getElementById("techModal")
  const bioModal = document.getElementById("bioModal")
  const closeButtons = document.querySelectorAll("[data-close]")

  if (techButton && techModal) {
    techButton.addEventListener("click", () => {
      techModal.classList.add("active")
      document.body.style.overflow = "hidden" // Prevent scrolling when modal is open
    })
  }

  if (bioButton && bioModal) {
    bioButton.addEventListener("click", () => {
      bioModal.classList.add("active")
      document.body.style.overflow = "hidden" // Prevent scrolling when modal is open
    })
  }

  closeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const modalId = this.getAttribute("data-close")
      document.getElementById(modalId).classList.remove("active")
      document.body.style.overflow = "" // Re-enable scrolling
    })
  })

  // Close modal when clicking outside
  const modals = document.querySelectorAll(".modal-overlay")
  modals.forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        this.classList.remove("active")
        document.body.style.overflow = ""
      }
    })
  })
}

// Tab functionality
function setupTabs() {
  const tabTriggers = document.querySelectorAll(".tab-trigger")
  const tabContents = document.querySelectorAll(".tab-content")

  tabTriggers.forEach((trigger) => {
    trigger.addEventListener("click", function () {
      // Remove active class from all triggers and contents
      tabTriggers.forEach((t) => t.classList.remove("active"))
      tabContents.forEach((c) => c.classList.remove("active"))

      // Add active class to clicked trigger
      this.classList.add("active")

      // Show corresponding content
      const tabId = this.getAttribute("data-tab")
      document.getElementById(tabId).classList.add("active")
    })
  })
}

// Dark Mode Toggle functionality
function setupDarkMode() {
  const darkModeToggle = document.getElementById("darkModeToggle")
  const darkModeToggleMobile = document.getElementById("darkModeToggleMobile")

  // Check for saved theme preference or use system preference
  const prefersDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
  const savedTheme = localStorage.getItem("theme")

  // Apply the saved theme or system preference
  if (savedTheme === "dark" || (!savedTheme && prefersDarkMode)) {
    document.documentElement.classList.add("dark")
  }

  // Function to toggle dark mode
  function toggleDarkMode() {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    }
  }

  // Add event listeners to both toggle buttons
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", toggleDarkMode)
  }

  if (darkModeToggleMobile) {
    darkModeToggleMobile.addEventListener("click", toggleDarkMode)
  }
}

// Language Selector functionality
function setupLanguageSelector() {
  const languageOptions = document.querySelectorAll('.language-option')
  const currentLanguageSpans = document.querySelectorAll('#current-language, #mobile-current-language')
  
  // Get saved language or default to English
  const savedLanguage = localStorage.getItem('language') || 'en'
  setLanguage(savedLanguage)
  
  // Set active class on the current language option
  languageOptions.forEach(option => {
    if (option.getAttribute('data-lang') === savedLanguage) {
      option.classList.add('active')
    } else {
      option.classList.remove('active')
    }
  })
  
  // Add event listeners to language options
  languageOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      e.preventDefault()
      const lang = option.getAttribute('data-lang')
      setLanguage(lang)
      
      // Update active class
      languageOptions.forEach(opt => opt.classList.remove('active'))
      document.querySelectorAll(`.language-option[data-lang="${lang}"]`).forEach(opt => {
        opt.classList.add('active')
      })
      
      // Save language preference
      localStorage.setItem('language', lang)
      
      // Refresh typing animation with new language
      setupTypingAnimation()
      
      // Refresh card content with new language
      refreshCardContent()
    })
  })
  
  // Function to set language
  function setLanguage(lang) {
    // Update current language display
    currentLanguageSpans.forEach(span => {
      if (span) {
        span.textContent = lang.toUpperCase()
      }
    })
    
    // Update all text elements with data-en and data-fr attributes
    const elements = document.querySelectorAll('[data-en][data-fr]')
    elements.forEach(element => {
      const content = element.getAttribute(`data-${lang}`)
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = content
      } else {
        element.innerHTML = content
      }
    })
  }
  
  // Function to refresh card content when language changes
  function refreshCardContent() {
    // Re-render portfolio, e-commerce, and packs sections
    const portfolioGrid = document.getElementById("portfolio-grid")
    const ecommerceGrid = document.getElementById("e-commerce-grid")
    const packsGrid = document.getElementById("packs-grid")
    
    if (portfolioGrid) {
      // Clear existing content
      portfolioGrid.innerHTML = ""
      // Re-create portfolio cards with current language
      const portfolioCards = projects.map(createPortfolioCard)
      createSlider(portfolioGrid, portfolioCards)
    }
    
    if (ecommerceGrid) {
      // Clear existing content
      ecommerceGrid.innerHTML = ""
      // Re-create e-commerce cards with current language
      const ecommerceCards = ecommerceProjects.map(createEcommerceCard)
      createSlider(ecommerceGrid, ecommerceCards)
    }
    
    if (packsGrid) {
      // Clear existing content
      packsGrid.innerHTML = ""
      // Re-create packs cards with current language
      packsProjects.forEach(project => {
        const card = createPackCard(project)
        packsGrid.appendChild(card)
      })
      
      // Initialize Lucide icons in the newly added content
      lucide.createIcons()
    }
  }
}

// Visit Card Modal functionality
function setupVisitCardModal() {
  const visitCardBtn = document.getElementById("visitCardBtn")
  const visitCardModal = document.getElementById("visitCardModal")
  const closeVisitCard = document.getElementById("closeVisitCard")
  const downloadVcard = document.getElementById("downloadVcard")

  if (visitCardBtn && visitCardModal) {
    visitCardBtn.addEventListener("click", () => {
      visitCardModal.classList.add("show")
      // Add animation class to vCard elements
      const cardElements = visitCardModal.querySelectorAll(
        ".visit-card-header, .visit-card-info, .visit-card-contact-item, .visit-card-download",
      )
      cardElements.forEach((el) => {
        el.style.opacity = "0"
      })
      document.body.style.overflow = "hidden" // Prevent scrolling
    })
  }

  if (closeVisitCard) {
    closeVisitCard.addEventListener("click", () => {
      visitCardModal.classList.remove("show")
      document.body.style.overflow = "" // Re-enable scrolling
    })
  }

  // Close when clicking outside the card
  if (visitCardModal) {
    visitCardModal.addEventListener("click", function (e) {
      if (e.target === this) {
        visitCardModal.classList.remove("show")
        document.body.style.overflow = ""
      }
    })
  }

  // Download vCard function
  if (downloadVcard) {
    downloadVcard.addEventListener("click", (e) => {
      e.preventDefault()
      const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Mehdi Kernou
ORG:pluss.dev
TITLE:Full-stack web developer
TEL;TYPE=CELL:+213 542 452 129
EMAIL:kernoumehdi17@gmail.com
URL:https://mehdevv.github.io/pluss.dev/
PHOTO;ENCODING=b;TYPE=JPEG:${window.location.origin}/img/me.jpg
END:VCARD`

      const blob = new Blob([vcard], { type: "text/vcard" })
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = "pluss_dev.vcf"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    })
  }
}

// Contact Form functionality - Enhanced
function setupContactForm() {
  const contactForm = document.getElementById("contactForm")
  const formSuccess = document.getElementById("formSuccess")
  const formError = document.getElementById("formError")
  const returnToForm = document.getElementById("returnToForm")
  const returnToFormError = document.getElementById("returnToFormError")
  const submitBtn = contactForm ? contactForm.querySelector(".submit-btn") : null
  const successAnimation = document.getElementById("successAnimation")
  const selectedService = document.getElementById("selectedService")
  const serviceTypeInput = document.getElementById("serviceType")

  // Add animation to form fields when they come into view
  function animateFormFields() {
    const formFields = document.querySelectorAll(".animate-field")
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = "running"
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    )

    formFields.forEach((field) => {
      field.style.animationPlayState = "paused"
      observer.observe(field)
    })
  }

  // Initialize animations
  if (document.querySelector(".contact")) {
    animateFormFields()
  }

  // Form submission handling
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Show loading state
      if (submitBtn) {
        submitBtn.classList.add("loading")
      }

      // Get form data
      const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value,
        service: serviceTypeInput.value
      }

      // Simulate form submission (in a real scenario, you would send this to a server)
      setTimeout(() => {
        // Remove loading state
        if (submitBtn) {
          submitBtn.classList.remove("loading")
        }

        // Show success animation
        if (successAnimation) {
          successAnimation.classList.add("active")
          
          // Hide success animation after 3 seconds
          setTimeout(() => {
            successAnimation.classList.remove("active")
            contactForm.reset() // Reset form
          }, 3000)
        } else {
          // Fade out the form
          contactForm.style.opacity = "0"
          contactForm.style.transform = "translateY(-20px)"

          setTimeout(() => {
            // Hide form and show success message
            contactForm.style.display = "none"
            formSuccess.classList.add("show")

            // Reset form
            contactForm.reset()

            // Initialize Lucide icons in the success message
            lucide.createIcons()
          }, 500)
        }
      }, 1500)
    })
  }

  // Return to form button functionality
  if (returnToForm) {
    returnToForm.addEventListener("click", () => {
      formSuccess.classList.remove("show")

      setTimeout(() => {
        contactForm.style.display = "flex"

        setTimeout(() => {
          contactForm.style.opacity = "1"
          contactForm.style.transform = "translateY(0)"
        }, 50)
      }, 300)
    })
  }

  // Return to form from error button functionality
  if (returnToFormError) {
    returnToFormError.addEventListener("click", () => {
      formError.classList.remove("show")

      setTimeout(() => {
        contactForm.style.display = "flex"

        setTimeout(() => {
          contactForm.style.opacity = "1"
          contactForm.style.transform = "translateY(0)"
        }, 50)
      }, 300)
    })
  }

  // Add floating label effect
  const formInputs = document.querySelectorAll(".form-group input, .form-group textarea")

  formInputs.forEach((input) => {
    // Check if input has value on load
    if (input.value) {
      input.classList.add("has-value")
    }

    // Add event listeners
    input.addEventListener("focus", () => {
      input.parentElement.classList.add("focused")
    })

    input.addEventListener("blur", () => {
      input.parentElement.classList.remove("focused")
      if (input.value) {
        input.classList.add("has-value")
      } else {
        input.classList.remove("has-value")
      }
    })
  })
  
  // Set up service selection
  const serviceButtons = document.querySelectorAll('.review-project-btn, .order-now-btn');
  serviceButtons.forEach(button => {
    button.addEventListener('click', function() {
      const serviceName = this.closest('.card') ? 
        this.closest('.card').querySelector('.card-title').textContent : 
        this.closest('.packs-card').querySelector('.pack-title').textContent;
      
      if (selectedService) {
        selectedService.textContent = serviceName;
      }
      
      if (serviceTypeInput) {
        serviceTypeInput.value = serviceName;
      }
      
      // Scroll to contact section
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// Create image preview modal
function createImagePreviewModal() {
  const modal = document.createElement("div")
  modal.className = "modal"
  modal.id = "imageModal"

  const modalImg = document.createElement("img")
  modalImg.className = "modal-content"
  modalImg.id = "modalImage"

  const closeBtn = document.createElement("span")
  closeBtn.className = "modal-close"
  closeBtn.innerHTML = "&times;"

  modal.appendChild(modalImg)
  modal.appendChild(closeBtn)
  document.body.appendChild(modal)

  closeBtn.onclick = () => {
    modal.classList.remove("show")
  }

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.classList.remove("show")
    }
  }

  return {
    open: (src) => {
      modalImg.src = src
      modal.classList.add("show")
    },
  }
}

// Create portfolio card function
function createPortfolioCard(project) {
  const currentLang = localStorage.getItem('language') || 'en'
  const card = document.createElement("div")
  card.className = "card"

  // Use translated content based on language
  const reviewText = currentLang === 'en' ? "review project" : "voir le projet"

  card.innerHTML = `
    <div class="card-image">
      <img src="${project.image}" loading="lazy" alt="${project.title}">
    </div>
    <div class="card-content">
      <h3 class="card-title">${project.title}</h3>
      <p class="card-description">${currentLang === 'en' ? project.description : project.descriptionFr || project.description}</p>
      <div class="tech-tags">
        ${project.technologies
          .map(
            (tech) => `
          <span class="tech-tag">
            <img src="${tech.icon}" loading="lazy" alt="${tech.name}" class="tech-icon" title="${tech.name}">
          </span>
        `,
          )
          .join("")}
      </div>
      <div class="card-links">
        <a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="review-project-btn">
          <i data-lucide="share"></i>
          ${reviewText}
        </a>
      </div>
    </div>
  `

  const cardImage = card.querySelector(".card-image")
  cardImage.addEventListener("click", () => {
    imageModal.open(project.image)
  })

  return card
}

// Create e-commerce card function
function createEcommerceCard(project) {
  const currentLang = localStorage.getItem('language') || 'en'
  const card = document.createElement("div")
  card.className = "card e-commerce-card"

  card.innerHTML = `
    <div class="card-image">
      <img src="${project.image}" loading="lazy" alt="${project.title}">
    </div>
    <div class="card-content">
      <div class="card-header">
        <i data-lucide="shopping-bag"></i>
        <h3 class="card-title">${project.title}</h3>
      </div>
      <div class="scrollable-content">
        <p class="card-description">${currentLang === 'en' ? project.description : project.descriptionFr || project.description}</p>
        <ul class="feature-list">
          ${(currentLang === 'en' ? project.features : project.featuresFr || project.features).map((feature) => `<li>${feature}</li>`).join("")}
        </ul>
      </div>
    </div>
  `

  const cardImage = card.querySelector(".card-image")
  cardImage.addEventListener("click", () => {
    imageModal.open(project.image)
  })

  return card
}

// Create pack card function
function createPackCard(project) {
  const currentLang = localStorage.getItem('language') || 'en'
  const card = document.createElement("div")
  card.className = "packs-card e-commerce-card"

  // Determine language for button text
  const orderNowText = currentLang === 'en' ? "Order Now" : "Commander"

  card.innerHTML = `
    <div class="card-image">
      <img src="${project.image}" loading="lazy" alt="${project.title}">
    </div>
    <div class="card-content packsheight">
      <div class="card-header">
        <i data-lucide="package"></i>
        <h3 class="card-title pack-title">${project.title}</h3>
      </div>
      <div class="scrollable-content">
        <ul class="feature-list">
          <p class="packcard-description">${currentLang === 'en' ? project.description : project.descriptionFr || project.description}</p>
          ${(currentLang === 'en' ? project.features : project.featuresFr || project.features).map((feature) => `<li>${feature}</li>`).join("")}
        </ul>
      </div>
      <a href="./packs.html" class="order-now-btn">
        <span>${orderNowText}</span>
        <i data-lucide="shopping-cart"></i>
      </a>
    </div>
  `

  return card
}

// Create slider functionality - Enhanced for better visibility
function createSlider(container, slides) {
  // Clear any existing content
  container.innerHTML = ""

  const sliderContainer = document.createElement("div")
  sliderContainer.className = "slider-container"

  const sliderWrapper = document.createElement("div")
  sliderWrapper.className = "slider-wrapper"

  slides.forEach((slide) => {
    const slideElement = document.createElement("div")
    slideElement.className = "slider-slide"
    slideElement.appendChild(slide)
    sliderWrapper.appendChild(slideElement)
  })

  sliderContainer.appendChild(sliderWrapper)

  const currentLang = localStorage.getItem('language') || 'en'
  const prevText = currentLang === 'en' ? "Previous" : "Précédent"
  const nextText = currentLang === 'en' ? "Next" : "Suivant"


  const prevButton = document.createElement("button")
  prevButton.className = "slider-button prev"
  prevButton.innerHTML = '<i data-lucide="chevron-left"></i>'
  prevButton.setAttribute("aria-label", prevText)

  const nextButton = document.createElement("button")
  nextButton.className = "slider-button next"
  nextButton.innerHTML = '<i data-lucide="chevron-right"></i>'
  nextButton.setAttribute("aria-label", nextText)

  const controls = document.createElement("div")
  controls.className = "slider-controls"
  controls.appendChild(prevButton)
  controls.appendChild(nextButton)

  sliderContainer.appendChild(controls)
  container.appendChild(sliderContainer)

  let currentIndex = 0
  const totalSlides = slides.length

  function updateSlider() {
    const slidesPerView = getSlidesPerView()
    const slideWidth = 100 / slidesPerView
    sliderWrapper.style.transform = `translateX(-${currentIndex * slideWidth}%)`

    // Update button states
    updateButtonStates()
  }

  function getSlidesPerView() {
    if (window.innerWidth >= 1024) return 3
    if (window.innerWidth >= 640) return 2
    return 1
  }

  function updateButtonStates() {
    const slidesPerView = getSlidesPerView()
    const maxIndex = totalSlides - slidesPerView

    // Update prev button state
    if (currentIndex <= 0) {
      prevButton.classList.add("disabled")
    } else {
      prevButton.classList.remove("disabled")
    }

    // Update next button state
    if (currentIndex >= maxIndex) {
      nextButton.classList.add("disabled")
    } else {
      nextButton.classList.remove("disabled")
    }
  }

  prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--
      updateSlider()
    }
  })

  nextButton.addEventListener("click", () => {
    const slidesPerView = getSlidesPerView()
    if (currentIndex < totalSlides - slidesPerView) {
      currentIndex++
      updateSlider()
    }
  })

  // Update slider on window resize
  window.addEventListener("resize", () => {
    // Make sure currentIndex is valid after resize
    const slidesPerView = getSlidesPerView()
    const maxIndex = totalSlides - slidesPerView
    currentIndex = Math.min(currentIndex, maxIndex)
    if (currentIndex < 0) currentIndex = 0

    updateSlider()
  })

  // Initial update
  updateSlider()
  lucide.createIcons()
}

// Add this to the end of your existing window.onload or as a separate event listener
document.addEventListener("DOMContentLoaded", () => {
  // Initialize dark mode
  setupDarkMode()

  // Initialize language selector
  setupLanguageSelector()

  // Initialize typing animation
  setupTypingAnimation()

  // Initialize modals
  setupModals()

  // Initialize tabs
  setupTabs()

  // Initialize visit card modal
  setupVisitCardModal()

  // Initialize contact form
  setupContactForm()

  // Create image modal
  const imageModal = createImagePreviewModal()
  window.imageModal = imageModal; // Make it globally accessible

  // Render portfolio projects
  const portfolioGrid = document.getElementById("portfolio-grid")
  if (portfolioGrid) {
    // Create portfolio cards
    const portfolioCards = projects.map(createPortfolioCard)
    // Create slider with the portfolio cards
    createSlider(portfolioGrid, portfolioCards)
  }

  // Render e-commerce projects
  const ecommerceGrid = document.getElementById("e-commerce-grid")
  if (ecommerceGrid) {
    // Create e-commerce cards
    const ecommerceCards = ecommerceProjects.map(createEcommerceCard)
    // Create slider with the e-commerce cards
    createSlider(ecommerceGrid, ecommerceCards)
  }

  // Render packs projects - without slider
  const packsGrid = document.getElementById("packs-grid");
  if (packsGrid) {
    // Create packs cards
    packsProjects.forEach((project) => {
      const card = createPackCard(project)
      packsGrid.appendChild(card)
    })

    // Initialize Lucide icons in the newly added content
    lucide.createIcons()
  }

  // Initialize Lucide icons after dynamic content is added
  lucide.createIcons()
})

// Smooth scroll functionality
function scrollToSection(id) {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: "smooth" })
    const mobileMenu = document.querySelector('.mobile-menu')
    if (mobileMenu) {
      mobileMenu.classList.remove("active")
      const menuIcon = document.querySelector('.mobile-menu-btn i')
      if (menuIcon) {
        menuIcon.setAttribute("data-lucide", "menu")
        lucide.createIcons()
      }
    }
  }
}

// Navbar functionality
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById("navbar")
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  const mobileMenu = document.querySelector(".mobile-menu")
  
  if (mobileMenuBtn && mobileMenu) {
    const menuIcon = mobileMenuBtn.querySelector("i")

    // Update navbar on scroll
    const updateNavbar = () => {
      const aboutSection = document.getElementById("about")
      if (aboutSection) {
        navbar.classList.toggle("fixed", window.scrollY > aboutSection.offsetTop)
      }
    }

    window.addEventListener("scroll", updateNavbar)

    // Mobile menu toggle
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("active")
      menuIcon.setAttribute("data-lucide", mobileMenu.classList.contains("active") ? "x" : "menu")
      
      // Make sure language options are visible when menu is open
      const languageSelectorMobile = document.querySelector('.language-selector-mobile')
      if (languageSelectorMobile) {
        languageSelectorMobile.style.display = mobileMenu.classList.contains("active") ? "flex" : "none"
      }
      
      lucide.createIcons()
    })
  }
})

// Initialize Lucide icons
const lucide = window.lucide
lucide.createIcons()

// Email sending function
function sendMail(){
  let parms = {
    name : document.getElementById('name').value,
    email : document.getElementById('email').value,
    subject : document.getElementById('subject').value,
    message : document.getElementById('message').value,
  }

  emailjs.send('service_e5gfubt','template_evohj88',parms)
    .then(() => {
      // Show success animation
      const successAnimation = document.getElementById("successAnimation")
      if (successAnimation) {
        successAnimation.classList.add("active")
        
        // Hide success animation after 3 seconds
        setTimeout(() => {
          successAnimation.classList.remove("active")
          document.getElementById('contactForm').reset() // Reset form
        }, 3000)
      }
    })
    .catch(error => {
      console.error('Error sending email:', error)
      // Show error message
      const formError = document.getElementById("formError")
      if (formError) {
        formError.classList.add("show")
      }
    })
}

// Packs data
const packsProjects = [
  {
    title: "Visibility Pack",
    description: "Establish a professional online presence with essential features to showcase your business to potential customers.",
    descriptionFr: "Établissez une présence en ligne professionnelle avec des fonctionnalités essentielles pour présenter votre entreprise aux clients potentiels.",
    image: "./img/pack1.png",
    features: [
      "Responsive website design",
      "Professional branding integration",
      "Contact forms and location maps",
      "Social media integration",
      "Basic SEO optimization"
    ],
    featuresFr: [
      "Conception de site web responsive",
      "Intégration professionnelle de l'image de marque",
      "Formulaires de contact et cartes de localisation",
      "Intégration des médias sociaux",
      "Optimisation SEO de base"
    ],
  },
  {
    title: "Management Pack",
    description: "Dynamic content management and interaction with users through databases and forms for growing businesses.",
    descriptionFr: "Gestion dynamique du contenu et interaction avec les utilisateurs via des bases de données et des formulaires pour les entreprises en croissance.",
    image: "./img/pack2.png",
    features: [
      "Content Management System (CMS)",
      "User account management",
      "Database integration",
      "Advanced forms and data collection",
      "Analytics and reporting tools",
      "Multi-language support"
    ],
    featuresFr: [
      "Système de gestion de contenu (CMS)",
      "Gestion des comptes utilisateurs",
      "Intégration de base de données",
      "Formulaires avancés et collecte de données",
      "Outils d'analyse et de reporting",
      "Support multilingue"
    ],
  },
  {
    title: "Innovative Systems Pack",
    description: "Customized, scalable web solutions with advanced functionalities like e-commerce, automation, and data management for businesses looking to optimize and grow.",
    descriptionFr: "Solutions web personnalisées et évolutives avec des fonctionnalités avancées comme le e-commerce, l'automatisation et la gestion des données pour les entreprises cherchant à optimiser et à se développer.",
    image: "./img/pack3.png",
    features: [
      "Custom web application development",
      "E-commerce platform integration",
      "Business process automation",
      "API development and integration",
      "Advanced data management systems",
      "Scalable cloud infrastructure",
      "Security and compliance features"
    ],
    featuresFr: [
      "Développement d'applications web sur mesure",
      "Intégration de plateforme e-commerce",
      "Automatisation des processus d'entreprise",
      "Développement et intégration d'API",
      "Systèmes avancés de gestion de données",
      "Infrastructure cloud évolutive",
      "Fonctionnalités de sécurité et de conformité"
    ],
  },
];

// Portfolio projects data with French translations
const projects = [
  {
    title: "Step by step school website",
    description:
      "This website is designed for Step by Step School to present key information about the institution, including its values, academic offerings, student activities, and admission process. It features a clean and user-friendly layout that makes it easy for visitors to explore the school's highlights. The site includes sections for program details, community feedback, and a contact form for inquiries and further communication.",
    descriptionFr:
      "Ce site web est conçu pour Step by Step School afin de présenter les informations essentielles sur l’établissement, telles que ses valeurs, ses programmes académiques, ses activités scolaires et le processus d’admission. Il propose une mise en page claire et conviviale, permettant aux visiteurs de découvrir facilement les points forts de l’école. Le site comprend des sections dédiées aux détails des programmes, aux témoignages de la communauté et à un formulaire de contact pour toute demande d'information.",
    image: "img/ST.png",
    technologies: [
      { name: "React", icon: "img/react.png" },
      { name: "Tailwind", icon: "img/tailwindcss.png" },
    ],
    demoUrl: "https://kahina-vert.vercel.app/#",
  },
  {
    title: "Digital valley club wbeiste",
    description:
      "This landing page is created for Digital Valley Club to highlight its vibrant community, showcase member benefits, and provide essential contact information. Designed with a modern, visually appealing, and user-friendly layout, the page features dedicated sections for collaborations, member profiles, and a contact form for inquiries and membership applications.",
    descriptionFr:
      "Cette page de destination a été créée pour le Digital Valley Club afin de mettre en valeur sa communauté dynamique, de présenter les avantages réservés aux membres et de fournir les informations de contact essentielles. Conçue avec une mise en page moderne, esthétique et facile à utiliser, la page comprend des sections dédiées aux collaborations, aux profils des membres ainsi qu’un formulaire de contact pour les demandes d'information et d'adhésion.",
    image: "img/DV.gif",
    technologies: [
      { name: "HTML", icon: "img/html-icon.png" },
      { name: "CSS", icon: "img/css-icon.png" },
      { name: "JS", icon: "img/js-icon.png" },
      { name: "Sass", icon: "img/Sass.png" },
    ],
    demoUrl: "https://digitalvalleys.net",
  },
  {
    title: "kahina vert hotel website",
    description:
      "this landing page is made for kahina vert hotel to showcase thair services, rooms, opinions on services, and contact information. it is designed to be visually appealing and user-friendly, with a modern layout that highlights the hotel's offerings. the page includes sections for room descriptions, customer reviews, and a contact form for inquiries.",
    descriptionFr:
      "cette page de destination est conçue pour l'hôtel kahina vert pour présenter leurs services, leurs chambres, leurs avis sur les services et leurs coordonnées. elle est conçue pour être visuellement attrayante et conviviale, avec une mise en page moderne qui met en valeur les offres de l'hôtel. la page comprend des sections pour les descriptions des chambres, les avis des clients et un formulaire de contact pour les demandes de renseignements.",
    image: "img/AC.png",
    technologies: [
      { name: "React", icon: "img/react.png" },
      { name: "Tailwind", icon: "img/tailwindcss.png" },
    ],
    demoUrl: "https://kahina-vert.vercel.app/#",
  },
  {
    title: "youcan store for Bejaiastore",
    description:
      "I've built a complete eCommerce platform for Bejaia Store, providing an intuitive and user-friendly online shopping experience. The website features responsive design, seamless product browsing, secure checkout, and multiple payment options. Customers can easily track their orders, manage their accounts, and take advantage of special promotions, all while enjoying a smooth, mobile-friendly interface.",
    descriptionFr:
      "J'ai construit une plateforme e-commerce complète pour Bejaia Store, offrant une expérience d'achat en ligne intuitive et conviviale. Le site web présente un design responsive, une navigation fluide des produits, un paiement sécurisé et plusieurs options de paiement. Les clients peuvent facilement suivre leurs commandes, gérer leurs comptes et profiter de promotions spéciales, tout en bénéficiant d'une interface fluide et adaptée aux mobiles.",
    image: "img/BS.png",
    technologies: [{ name: "YouCan", icon: "img/youcan-icon.png" }],
    demoUrl: "https://bejaia-store.youcan.store/",
  },
  {
    title: "consultant portfolio website",
    description:
      "This personalized portfolio and services showcase is designed to highlight the expertise and experience of a consultant specializing in management and banking. The page serves as a professional digital presence that reflects the consultant's deep industry knowledge and proven track record of success. The design is sleek, sophisticated, and easy to navigate, ensuring that potential clients can easily learn about the consultant's services, skills, and unique approach.",
    descriptionFr:
      "Ce portfolio personnalisé et cette vitrine de services sont conçus pour mettre en valeur l'expertise et l'expérience d'un consultant spécialisé dans la gestion et la banque. La page sert de présence numérique professionnelle qui reflète la connaissance approfondie du secteur et les succès prouvés du consultant. Le design est élégant, sophistiqué et facile à naviguer, garantissant que les clients potentiels peuvent facilement se renseigner sur les services, les compétences et l'approche unique du consultant.",
    image: "img/ABD.png",
    technologies: [
      { name: "HTML", icon: "img/html-icon.png" },
      { name: "CSS", icon: "img/css-icon.png" },
      { name: "JS", icon: "img/js-icon.png" },
      { name: "PHP", icon: "img/php-icon.png" },
      { name: "SQL", icon: "img/sql-icon.png" },
    ],
    demoUrl: "https://mehdevv.github.io/abdeddaim/",
  },
  {
    title: "QR code logo + vistual visit card",
    description:
      "a virtuel visit card suiting thair buisness identity relied made a QR code-logo to be printed on physical visit cards and be scanned, implementing buttons to call directly or send rmails or save company/personal info of the owner of the card.",
    descriptionFr:
      "une carte de visite virtuelle adaptée à l'identité de leur entreprise, avec un logo QR code à imprimer sur des cartes de visite physiques pour être scanné, implémentant des boutons pour appeler directement, envoyer des emails ou enregistrer les informations personnelles/de l'entreprise du propriétaire de la carte.",
    image: "img/QR.png",
    technologies: [
      { name: "HTML", icon: "img/html-icon.png" },
      { name: "CSS", icon: "img/css-icon.png" },
      { name: "JS", icon: "img/js-icon.png" },
    ],
    demoUrl: "https://mehdevv.github.io/Innovconsult1/",
  },
]

// E-commerce projects data with French translations
const ecommerceProjects = [
  {
    title: "Youcan & shopify stores making",
    description: "we create youcan and shopify shops for your E commerce buisness.",
    descriptionFr: "nous créons des boutiques youcan et shopify pour votre entreprise de commerce électronique.",
    image: "img/shops.png",
    features: [
      "Product management and inventory tracking",
      "Secure payment processing and Order fulfillment",
      "Product recommendation",
    ],
    featuresFr: [
      "Gestion des produits et suivi des stocks",
      "Traitement sécurisé des paiements et exécution des commandes",
      "Recommandations de produits",
    ],
  },
  {
    title: "web designe & landing pages",
    description: "we create well designed pages and websites for your buisness.",
    descriptionFr: "nous créons des pages et des sites web bien conçus pour votre entreprise.",
    image: "img/LP.png",
    features: [
      "respecting measures of designe and fluidity of the page",
      "adding functions and animation for better user experience",
      "showing contact and services",
    ],
    featuresFr: [
      "respect des mesures de design et fluidité de la page",
      "ajout de fonctions et d'animations pour une meilleure expérience utilisateur",
      "affichage des contacts et services",
    ],
  },
  {
    title: "personalised Virtual visit cards",
    description: "we turn any designe you want to a vituelle card with a QR code for your buisness online.",
    descriptionFr: "nous transformons n'importe quel design que vous souhaitez en une carte virtuelle avec un code QR pour votre entreprise en ligne.",
    image: "img/QRS.png",
    features: [
      "QR code with your logo",
      "showing contact of your buisness online",
      "added to a visit card or printed to be scanned",
    ],
    featuresFr: [
      "Code QR avec votre logo",
      "affichage des contacts de votre entreprise en ligne",
      "ajouté à une carte de visite ou imprimé pour être scanné",
    ],
  },
]