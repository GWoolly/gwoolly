// Portfolio Grid - Filtering
document.addEventListener("DOMContentLoaded", function() {
  const buttons = document.querySelectorAll(".filter-btn");
  const items = document.querySelectorAll(".portfolio-item");

  buttons.forEach(button => {
    button.addEventListener("click", function() {
      const filter = this.getAttribute("data-filter");

      items.forEach(item => {
        const categories = item.getAttribute("data-category").split(","); // Convert to an array

        // Show if it matches at least one category
        if (filter === "all" || categories.includes(filter)) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });

      // Update button active styling
      buttons.forEach(btn => btn.classList.remove("btn-primary"));
      this.classList.add("btn-primary");
    });
  });
});

// Secret projects - Modified to handle modal context
document.addEventListener("DOMContentLoaded", function() {
  // Constants to easily adjust the cookie lifespan and the expected URL parameter
  /*
  const COOKIE_LIFESPAN_DAYS = {{ nda.cookie_duration }}; // The cookie lifespan in days
  const ACCESS_URL_PARAM = "{{ nda.param }}"; // The URL parameter that grants access
  const correctPassword = "{{ nda.password }}"; // The password you want users to enter
  /*/
  const COOKIE_LIFESPAN_DAYS = 7; // The cookie lifespan in days
  const ACCESS_URL_PARAM = "nda"; // The URL parameter that grants access
  const correctPassword = "please"; // The password you want users to enter
  //*/

  // Check if the URL contains the specific parameter to grant access
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has(ACCESS_URL_PARAM)) {
    setCookie("loggedIn", "true", COOKIE_LIFESPAN_DAYS);
  }

  // Listen for when any modal is shown
  $('.portfolio-modal').on('shown.bs.modal', function() {
    // Find the password elements within THIS modal
    const modal = $(this);
    const passwordInput = modal.find("#password-input")[0];
    const submitButton = modal.find("#submit-password")[0];
    const errorMessage = modal.find("#error-message")[0];
    const restrictedContent = modal.find("#restricted-content")[0];
    const passwordContainer = modal.find("#password-container")[0];

    // Only proceed if this modal has the password elements
    if (passwordInput && submitButton && restrictedContent && passwordContainer) {
      // Check if the user has already logged in by checking the cookie
      if (getCookie("loggedIn") === "true") {
        showRestrictedContent();
      }

      // Handle password submission when the user clicks the submit button
      submitButton.addEventListener("click", handlePasswordSubmission);

      // Handle password submission when the user presses the Enter key
      passwordInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
          handlePasswordSubmission();
        }
      });

      // Function to handle password submission
      function handlePasswordSubmission() {
        const enteredPassword = passwordInput.value.trim();

        if (enteredPassword === correctPassword) {
          // Set cookie to remember the user
          setCookie("loggedIn", "true", COOKIE_LIFESPAN_DAYS); // Expires in defined number of days
          showRestrictedContent();
        } else {
          errorMessage.style.visibility = "visible"; // Show error message if visibility was hidden
          passwordInput.value = ""; // Clear the input field after wrong attempt
          passwordInput.focus(); // Focus back on the password field
        }
      }

      // Function to show restricted content
      function showRestrictedContent() {
        passwordContainer.style.display = "none"; // Hide password input
        restrictedContent.style.display = "block"; // Show restricted content
      }
    }
  });

  // Function to set a cookie
  function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000); // Set expiry time
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }

  // Function to get a cookie value by name
  function getCookie(name) {
    const nameEq = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1);
      if (c.indexOf(nameEq) === 0) return c.substring(nameEq.length, c.length);
    }
    return null;
  }
});


// Polaroid image random rotation
document.addEventListener("DOMContentLoaded", function() {
  const stack = document.querySelector('.polaroid-stack');
  let polaroids = Array.from(stack.querySelectorAll('.polaroid'));

  // Initialize polaroids with random rotations
  polaroids.forEach((polaroid, index) => {
    const rotation = (Math.random() * 10) - 5;
    polaroid.style.setProperty('--rotation', `${rotation}deg`);
    polaroid.style.zIndex = polaroids.length - index;
    polaroid.style.transform = 'rotate(var(--rotation))';
    polaroid.style.transition = 'transform 0.3s ease';
  });

  let timer;
  let isAnimating = false;
  let isHovering = false;

  function updateZIndices() {
    polaroids.forEach((polaroid, index) => {
      polaroid.style.zIndex = polaroids.length - index;
    });
  }

  function moveTopPolaroidToBack() {
    if (isAnimating) return;
    isAnimating = true;
    
    const topPolaroid = polaroids[0];
    
    // Step 1: Move right (translate right and up)
    topPolaroid.style.transition = 'transform 0.2s ease';
    topPolaroid.style.transform = 'translate(150%, -20%) rotate(20deg)';

    setTimeout(() => {
      // Lower its z-index midway
      topPolaroid.style.zIndex = -1;
      
      // Generate the new rotation value here
      const newRotation = (Math.random() * 10) - 5;
      topPolaroid.style.setProperty('--rotation', `${newRotation}deg`);
    }, 200);

    setTimeout(() => {
      // Step 2: Slide left (translate back to the stack)
      // Use the new rotation value as part of the return animation
      topPolaroid.style.transition = 'transform 0.3s ease';
      topPolaroid.style.transform = 'translate(0, 0) rotate(var(--rotation))';

      setTimeout(() => {
        // Step 3: Rearrange DOM
        stack.appendChild(topPolaroid);

        // Update polaroid array
        polaroids.push(polaroids.shift());
        
        // Update z-indexes
        updateZIndices();
        
        // Animation is now complete
        isAnimating = false;
        
        // Check if mouse left during animation
        if (!isHovering) {
          resetCardsPosition();
        } else if (isHovering) {
          // If still hovering, update fan position
          applyFanEffect();
        }

      }, 300); // After sliding left completes

    }, 200); // After moving right completes
  }

  function applyFanEffect() {
    const spacing = 15; // Spacing between cards in pixels
    const cardCount = polaroids.length;
    
    // Calculate total width of the fan
    const totalWidth = (cardCount - 1) * spacing;
    
    // Calculate center adjustment to keep the stack centered when fanned
    const centerAdjustment = totalWidth / 2;
    
    polaroids.forEach((polaroid, index) => {
      // Calculate how far left this card should be from the top card
      // Index 0 (top card) is at the rightmost position, with each subsequent card moving left
      const offset = -index * spacing + centerAdjustment; // Adjusted to center the stack
      
      // Apply slight rotation based on position
      const fanRotation = index * 2; // Each card rotates slightly more
      
      // Get the base rotation from the CSS variable
      const baseRotation = parseFloat(polaroid.style.getPropertyValue('--rotation')) || 0;
      
      // Create transform combining horizontal offset and rotation
      polaroid.style.transition = 'transform 0.3s ease';
      polaroid.style.transform = `
        translateX(${offset}px)
        rotate(${baseRotation - fanRotation}deg)`; // Subtract for counterclockwise rotation
    });
  }
  
  function resetCardsPosition() {
    polaroids.forEach((polaroid) => {
      polaroid.style.transition = 'transform 0.3s ease';
      polaroid.style.transform = 'rotate(var(--rotation))';
    });
  }

  function startAutoAdvance() {
    timer = setInterval(moveTopPolaroidToBack, 4000);
  }

  function resetAutoAdvance() {
    clearInterval(timer);
    startAutoAdvance();
  }

  startAutoAdvance();

  stack.addEventListener('click', function(event) {
    if (isAnimating) return;
    
    const topPolaroid = polaroids[0];
    if (event.target.closest('.polaroid') === topPolaroid) {
      moveTopPolaroidToBack();
      resetAutoAdvance();
    }
  });

  // Fan-out effect on hover
  stack.addEventListener('mouseenter', function() {
    isHovering = true;
    if (!isAnimating) {
      applyFanEffect();
    }
  });

  stack.addEventListener('mouseleave', function() {
    isHovering = false;
    if (!isAnimating) {
      resetCardsPosition();
    }
  });
});






// Confetti
// <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script> Is within header.html
document.addEventListener('DOMContentLoaded', () => {
  const profileImg = document.querySelector('.img-profile');
  
  // Check if profile image exists
  if (!profileImg) {
    console.error('Profile image not found!');
    return;
  }
  
  // Check if confetti is available
  if (typeof confetti !== 'function') {
    console.error('Confetti function not found! Make sure the library is loaded correctly.');
    return;
  }
  
  let hasTriggered = false;
  const fanfareSound = new Audio('sounds/fanfare.mp3');
  
  function burstConfetti(playSound = false) {
    console.log('Bursting confetti!');
    
    try {
      // Get the element's position relative to the viewport
      const rect = profileImg.getBoundingClientRect();
      
      // Calculate the origin point (bottom center of the element)
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.bottom) / window.innerHeight;
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x, y }
      });
      
      // Play sound only if requested (on click) and if it loaded properly
      if (playSound && !fanfareSound.error) {
        fanfareSound.currentTime = 0;
        fanfareSound.play().catch(e => console.error('Audio playback failed:', e));
      }
    } catch (error) {
      console.error('Error triggering confetti:', error);
    }
  }
  
  // Set up IntersectionObserver - no sound when element comes into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasTriggered) {
        burstConfetti(false); // Don't play sound
        hasTriggered = true;
      }
    });
  }, { threshold: 0.5 });
  
  observer.observe(profileImg);
  
  // Add click listener - with sound
  profileImg.addEventListener('click', (e) => {
    console.log('Profile image clicked!');
    burstConfetti(true); // Play sound on click
  });
  
  console.log('Confetti setup complete!');
});



// Gallery
document.addEventListener('DOMContentLoaded', function() {
  // Gallery variables
  const galleryModal = document.getElementById('gallery-modal');
  const modalImage = document.getElementById('modal-image');
  const modalCaption = document.getElementById('modal-caption');
  const prevButton = document.getElementById('prev-button');
  const nextButton = document.getElementById('next-button');
  const closeButton = document.querySelector('.close-gallery');
  const imageCounter = document.getElementById('image-counter');
  const indicatorDots = document.getElementById('indicator-dots');
  
  let galleryItems = [];
  let currentIndex = 0;
  
  // Initialize galleries
  const galleryContainers = document.querySelectorAll('.gallery-container');
  
  galleryContainers.forEach(container => {
    const items = container.querySelectorAll('.gallery-item');
    
    items.forEach((item, index) => {
      // Add click event to open modal
      item.addEventListener('click', function() {
        openGalleryModal(container, index);
      });
    });
  });
  
  // Open gallery modal
  function openGalleryModal(container, startIndex) {
    // Get all items in this gallery
    galleryItems = Array.from(container.querySelectorAll('.gallery-item'));
    currentIndex = startIndex;
    
    // Show modal
    galleryModal.classList.add('active');
    
    // Update image and caption
    updateModalContent();
    
    // Create indicator dots
    createIndicatorDots();
    
    // Update counter
    updateCounter();
  }
  
  // Update modal image and caption
  function updateModalContent() {
    const currentItem = galleryItems[currentIndex];
    const imageSrc = currentItem.getAttribute('data-src');
    const imageCaption = currentItem.getAttribute('data-caption');
    
    modalImage.src = imageSrc;
    modalImage.alt = imageCaption || 'Gallery image';
    
    // Update caption
    if (imageCaption && imageCaption.trim() !== '') {
      modalCaption.textContent = imageCaption;
      modalCaption.style.display = 'block';
    } else {
      modalCaption.style.display = 'none';
    }
    
    // Update indicator dots
    updateIndicatorDots();
    
    // Update counter
    updateCounter();
  }
  
  // Create indicator dots
  function createIndicatorDots() {
    // Clear existing dots
    indicatorDots.innerHTML = '';
    
    // Create new dots
    galleryItems.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (index === currentIndex) {
        dot.classList.add('active');
      }
      
      // Add click event to dot
      dot.addEventListener('click', function() {
        currentIndex = index;
        updateModalContent();
      });
      
      indicatorDots.appendChild(dot);
    });
  }
  
  // Update indicator dots
  function updateIndicatorDots() {
    const dots = indicatorDots.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  
  // Update counter
  function updateCounter() {
    const counterText = document.querySelector('.counter-text');
    counterText.textContent = `${currentIndex + 1}/${galleryItems.length}`;
  }
  
  // Next image
  function nextImage() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    updateModalContent();
  }
  
  // Previous image
  function prevImage() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    updateModalContent();
  }
  
  // Close modal
  function closeModal() {
    galleryModal.classList.remove('active');
  }
  
  // Event listeners
  nextButton.addEventListener('click', nextImage);
  prevButton.addEventListener('click', prevImage);
  closeButton.addEventListener('click', closeModal);
  
  // Close on escape key
  document.addEventListener('keyup', function(e) {
    if (e.key === 'Escape' && galleryModal.classList.contains('active')) {
      closeModal();
    } else if (e.key === 'ArrowRight' && galleryModal.classList.contains('active')) {
      nextImage();
    } else if (e.key === 'ArrowLeft' && galleryModal.classList.contains('active')) {
      prevImage();
    }
  });
  
  // Close when clicking on modal background (not on content)
  galleryModal.addEventListener('click', function(e) {
    if (e.target === galleryModal) {
      closeModal();
    }
  });
});
