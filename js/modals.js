// --- Helper Function ---
function isModalEscapeBlocked() {
  // Check for gallery modal
  const galleryElement = document.querySelector('.gallery-modal.active');
  const galleryActive = galleryElement !== null;
  
  // Check for game embeds
  const gameElement = document.querySelector('iframe.game-embed, canvas.game-embed');
  const gameActive = gameElement !== null;
  
  // More robust fullscreen detection with detailed logging
  const fullscreenElement = document.fullscreenElement || 
                           document.webkitFullscreenElement || 
                           document.mozFullScreenElement || 
                           document.msFullscreenElement;
  
  // Log what was detected as fullscreen
  if (fullscreenElement) {
    console.log('Fullscreen element detected:', fullscreenElement);
  }
  
  const fullscreenActive = fullscreenElement !== null;
  
  console.log('Escape check — gallery:', galleryActive, 'game:', gameActive, 'fullscreen:', fullscreenActive);
  
  // TEMPORARY: Allow escape to work regardless of fullscreen status for debugging
  // Remove the "fullscreenActive ||" below to enable proper fullscreen detection
  return gameActive;
}

// --- Global Escape Handler ---
$(document).on('keyup', function(e) {
  if (e.key !== "Escape" && e.which !== 27) return; // Escape key only
  
  console.log('Escape key pressed');
  
  // Handle different types of modals
  const $galleryModal = $('.gallery-modal.active');
  const $portfolioModal = $('.portfolio-modal.modal.fade.in, .portfolio-modal.fade.in');
  const $bootstrapModal = $('.modal.show, .modal.in').not('.portfolio-modal, .gallery-modal');
  
  // Debug what modals are found
  console.log('Gallery modals found:', $galleryModal.length);
  console.log('Portfolio modals found:', $portfolioModal.length);
  console.log('Bootstrap modals found:', $bootstrapModal.length);
  
  // Determine which modal to close (prioritize top-level modals)
  let modalToClose = null;
  let modalType = "";
  
  if ($galleryModal.length > 0) {
    modalToClose = $galleryModal;
    modalType = "gallery";
  } else if ($portfolioModal.length > 0) {
    modalToClose = $portfolioModal;
    modalType = "portfolio";
  } else if ($bootstrapModal.length > 0) {
    modalToClose = $bootstrapModal.last();
    modalType = "bootstrap";
  }
  
  if (!modalToClose) {
    console.log('No open modals found');
    return;
  }
  
  console.log('Modal found to close:', modalType, modalToClose);
  
  // Check if modal closing should be blocked
  if (isModalEscapeBlocked()) {
    console.log('Escape blocked (global)');
    e.stopPropagation();
    e.preventDefault();
    return;
  }
  
  console.log('Closing modal:', modalType);
  
  // Close based on modal type
  switch (modalType) {
    case "gallery":
      $galleryModal.removeClass('active');
      console.log('Gallery modal closed');
      break;
    case "portfolio":
      // Try using the modal's close button first
      const closeBtn = $portfolioModal.find('.close-modal, .close, [data-dismiss="modal"]');
      if (closeBtn.length > 0) {
        closeBtn.click();
        console.log('Triggered close button click');
      } else {
        // Manual close as fallback
        $portfolioModal.removeClass('in').addClass('out');
        setTimeout(function() {
          $portfolioModal.hide().removeClass('out');
        }, 300);
        console.log('Portfolio modal closed manually');
      }
      break;
    case "bootstrap":
      try {
        modalToClose.modal('hide');
        console.log('Bootstrap modal closed');
      } catch (err) {
        modalToClose.removeClass('show in').hide();
        console.log('Manual hide fallback due to error:', err);
      }
      break;
  }
  
  // Prevent default behavior to avoid double handling
  e.preventDefault();
  e.stopPropagation();
});


// Close modal when clicking elements with close-modal class
$(document).on('click', '.close-modal', function(e) {
  e.preventDefault();
  
  // Find the parent modal
  const $parentModal = $(this).closest('.modal, .gallery-modal, .portfolio-modal');
  
  if ($parentModal.length === 0) {
    console.log('No parent modal found for close button');
    return;
  }
  
  console.log('Closing modal via close-modal button:', $parentModal);
  
  // Close based on modal type
  if ($parentModal.hasClass('gallery-modal')) {
    $parentModal.removeClass('active');
    console.log('Gallery modal closed');
  } else if ($parentModal.hasClass('portfolio-modal')) {
    $parentModal.removeClass('in').addClass('out');
    setTimeout(function() {
      $parentModal.hide().removeClass('out');
    }, 300);
    console.log('Portfolio modal closed');
  } else {
    // Standard Bootstrap modal
    try {
      $parentModal.modal('hide');
      console.log('Bootstrap modal closed');
    } catch (err) {
      $parentModal.removeClass('show in').hide();
      console.log('Manual hide fallback due to error:', err);
    }
  }
});


// Close gallery modal when clicking on gallery-content (modal background)
$(document).on('click', '.gallery-content', function(e) {
  // Only close if clicking directly on gallery-content
  // (not on child elements within gallery-content)
  if (e.target === this) {
    // Find the parent gallery-modal and remove active class
    const $galleryModal = $(this).closest('.gallery-modal');
    $galleryModal.removeClass('active');
    console.log('Gallery modal closed by clicking on gallery-content background');
  }
});

// Also handle direct clicks on gallery-modal
$(document).on('click', '.gallery-modal', function(e) {
  // Only close if clicking directly on the modal background
  // (not on child elements within the modal)
  if (e.target === this) {
    $(this).removeClass('active');
    console.log('Gallery modal closed by clicking on gallery-modal background');
  }
});

// Close gallery modal when clicking on close button
$(document).on('click', '.gallery-modal .close-modal', function(e) {
  e.preventDefault();
  e.stopPropagation(); // Prevent event from bubbling to the modal background
  
  const $galleryModal = $(this).closest('.gallery-modal');
  if ($galleryModal.length > 0) {
    $galleryModal.removeClass('active');
    console.log('Gallery modal closed via close button');
  }
});