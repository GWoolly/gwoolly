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
  let singleImageMode = false;
  
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
  
  // Handle single images that should be expandable
  initializeSingleImages();
  
  // Function to initialize single images
  function initializeSingleImages() {
    const singleImages = document.querySelectorAll('.single-image-gallery img[data-expandable="true"]');
    
    singleImages.forEach(img => {
      // Check if the image is displayed at less than 75% of its natural size
      img.addEventListener('load', function() {
        const naturalWidth = this.naturalWidth;
        const displayWidth = this.offsetWidth;
        
        if (displayWidth < naturalWidth * 0.75) {
          this.classList.add('expandable');
          this.style.cursor = 'pointer';
          
          // Add click event to open modal
          this.addEventListener('click', function() {
            openSingleImageModal(this);
          });
        }
      });
      
      // If the image is already loaded, trigger the load event
      if (img.complete) {
        img.dispatchEvent(new Event('load'));
      }
    });
  }
  
  // Open gallery modal for a single image
  function openSingleImageModal(img) {
    singleImageMode = true;
    
    // Create a virtual gallery with just this one image
    galleryItems = [{ 
      getAttribute: (attr) => img.getAttribute(attr)
    }];
    currentIndex = 0;
    
    // Show modal
    galleryModal.classList.add('active');
    
    // Update image and caption
    updateModalContent();
    
    // Hide navigation buttons for single image
    prevButton.style.display = 'none';
    nextButton.style.display = 'none';
    
    // Hide counter and indicator dots for single image
    imageCounter.style.display = 'none';
    indicatorDots.style.display = 'none';
  }
  
  // Open gallery modal
  function openGalleryModal(container, startIndex) {
    singleImageMode = false;
    
    // Get all items in this gallery
    galleryItems = Array.from(container.querySelectorAll('.gallery-item'));
    currentIndex = startIndex;
    
    // Show modal
    galleryModal.classList.add('active');
    
    // Show navigation buttons for gallery
    prevButton.style.display = galleryItems.length > 1 ? 'block' : 'none';
    nextButton.style.display = galleryItems.length > 1 ? 'block' : 'none';
    
    // Show counter and create indicator dots for gallery
    imageCounter.style.display = galleryItems.length > 1 ? 'block' : 'none';
    indicatorDots.style.display = galleryItems.length > 1 ? 'flex' : 'none';
    
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
    
    // Update indicator dots if not in single image mode
    if (!singleImageMode) {
      updateIndicatorDots();
      updateCounter();
    }
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
    if (singleImageMode) return;
    
    currentIndex = (currentIndex + 1) % galleryItems.length;
    updateModalContent();
  }
  
  // Previous image
  function prevImage() {
    if (singleImageMode) return;
    
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    updateModalContent();
  }
  
  // Close modal
  function closeModal() {
    galleryModal.classList.remove('active');
    singleImageMode = false;
  }
  
  // Event listeners
  nextButton.addEventListener('click', nextImage);
  prevButton.addEventListener('click', prevImage);
  closeButton.addEventListener('click', closeModal);
  
  // Close on escape key
  document.addEventListener('keyup', function(e) {
    if (e.key === 'Escape' && galleryModal.classList.contains('active')) {
      closeModal();
    } else if (e.key === 'ArrowRight' && galleryModal.classList.contains('active') && !singleImageMode) {
      nextImage();
    } else if (e.key === 'ArrowLeft' && galleryModal.classList.contains('active') && !singleImageMode) {
      prevImage();
    }
  });
  
  // Close when clicking on modal background (not on content)
  galleryModal.addEventListener('click', function(e) {
    if (e.target === galleryModal) {
      closeModal();
    }
  });
  
  // Handle window resize events to check if images become expandable
  window.addEventListener('resize', debounce(function() {
    initializeSingleImages();
  }, 250));
  
  // Debounce function to limit excessive calls during resize
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        func.apply(context, args);
      }, wait);
    };
  }
  
  // Add suggested CSS to document if not present
  addExpandableImageStyles();
  
  // Function to add styles for expandable images
  function addExpandableImageStyles() {
    const style = document.createElement('style');
    style.textContent = `
      img.expandable {
        cursor: zoom-in;
        transition: transform 0.2s ease;
      }
      
      img.expandable:hover {
        transform: scale(1.02);
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
    `;
    document.head.appendChild(style);
  }
});