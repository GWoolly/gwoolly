document.addEventListener('DOMContentLoaded', function() {
    var videoPreviews = document.querySelectorAll('.video-preview');
  
    videoPreviews.forEach(function(preview) {
        // Click to play video
        preview.addEventListener('click', function() {
            var overlay = this.querySelector('.video-preview-overlay');
            var video = this.querySelector('video');
            var iframe = this.querySelector('iframe');
            
            overlay.style.display = 'none';
            
            // Handle different video types
            if (video) {
                video.style.display = 'block';
                video.play();
            } else if (iframe) {
                iframe.style.display = 'block';
                
                // For YouTube, modify src to autoplay
                if (iframe.src.includes('youtube.com')) {
                    var src = iframe.src;
                    if (!src.includes('autoplay=1')) {
                        iframe.src = src + (src.includes('?') ? '&' : '?') + 'autoplay=1';
                    }
                }
                // For Vimeo, modify src to autoplay
                else if (iframe.src.includes('vimeo.com')) {
                    var src = iframe.src;
                    if (!src.includes('autoplay=1')) {
                        iframe.src = src + (src.includes('?') ? '&' : '?') + 'autoplay=1';
                    }
                }
            }
        });
        
        // Modal close event to reset video
        var modal = preview.closest('.portfolio-modal');
        if (modal) {
            modal.addEventListener('hidden.bs.modal', function() {
                var overlay = preview.querySelector('.video-preview-overlay');
                var video = preview.querySelector('video');
                var iframe = preview.querySelector('iframe');
                
                if (video) {
                    video.pause();
                    video.currentTime = 0;
                    
                    // Revert to thumbnail
                    overlay.style.display = 'block';
                    video.style.display = 'none';
                } else if (iframe) {
                    // Stop YouTube/Vimeo by resetting src
                    var currentSrc = iframe.src;
                    iframe.src = '';
                    
                    // We use setTimeout to ensure the iframe is fully reset
                    setTimeout(function() {
                        // Remove autoplay parameter if present
                        var newSrc = currentSrc.replace(/(\?|&)autoplay=1/, '');
                        iframe.src = newSrc;
                        
                        // Revert to thumbnail
                        overlay.style.display = 'block';
                        iframe.style.display = 'none';
                    }, 100);
                }
            });
        }
    });
});

// Keeping the existing jQuery and fallback methods for broader compatibility
$(document).ready(function() {
    $('.portfolio-modal').on('hidden.bs.modal', function (e) {
        var video = $(this).find('video');
        var iframe = $(this).find('iframe');
        var overlay = $(this).find('.video-preview-overlay');
        
        if (video.length) {
            video[0].pause();
            video[0].currentTime = 0;
            
            // Revert to thumbnail
            overlay.show();
            video.hide();
        } else if (iframe.length) {
            // Stop YouTube/Vimeo by resetting src
            var currentSrc = iframe.attr('src');
            iframe.attr('src', '');
            
            // We use setTimeout to ensure the iframe is fully reset
            setTimeout(function() {
                // Remove autoplay parameter if present
                var newSrc = currentSrc.replace(/(\?|&)autoplay=1/, '');
                iframe.attr('src', newSrc);
                
                // Revert to thumbnail
                overlay.show();
                iframe.hide();
            }, 100);
        }
    });
});