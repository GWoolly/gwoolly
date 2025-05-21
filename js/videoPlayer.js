document.addEventListener('DOMContentLoaded', function () {
    var videoPreviews = document.querySelectorAll('.video-preview');

    videoPreviews.forEach(function (preview) {
        // Click to play video
        preview.addEventListener('click', function () {
            var overlay = this.querySelector('.video-preview-overlay');
            var video = this.querySelector('video');
            var iframe = this.querySelector('iframe.video-modal');

            overlay.style.visibility = 'hidden';

            if (video) {
                video.style.display = 'block';
                video.play();
            } else if (iframe) {
                iframe.style.display = 'block';

                var src = iframe.src;
                if (!src.includes('autoplay=1')) {
                    iframe.src = src + (src.includes('?') ? '&' : '?') + 'autoplay=1';
                }
            }
        });

        // Modal close event to reset video
        var modal = preview.closest('.portfolio-modal');
        if (modal) {
            modal.addEventListener('hidden.bs.modal', function () {
                var overlay = preview.querySelector('.video-preview-overlay');
                var video = preview.querySelector('video');
                var iframe = preview.querySelector('iframe.video-modal');

                overlay.style.visibility = 'visible';

                if (video) {
                    video.pause();
                    video.currentTime = 0;
                    video.style.display = 'none';
                } else if (iframe) {
                    var currentSrc = iframe.src;
                    iframe.src = '';

                    setTimeout(function () {
                        var newSrc = currentSrc.replace(/(\?|&)autoplay=1/, '');
                        iframe.src = newSrc;
                        iframe.style.display = 'none';
                    }, 100);
                }
            });
        }
    });
});

$(document).ready(function () {
    $('.portfolio-modal').on('hidden.bs.modal', function () {
        var overlay = $(this).find('.video-preview-overlay');
        var videoElements = $(this).find('video');
        var iframeElements = $(this).find('iframe');
        
        // Show overlay if it exists
        if (overlay.length) {
            overlay.css('visibility', 'visible');
        }
        
        // Pause and reset any HTML5 video elements
        if (videoElements.length) {
            videoElements.each(function() {
                this.pause();
                this.currentTime = 0;
            });
        }
        
        // Handle all iframes within the modal
        if (iframeElements.length) {
            iframeElements.each(function() {
                var $iframe = $(this);
                var currentSrc = $iframe.attr('src') || '';
                
                // Pause the video by removing the src temporarily and adding it back without autoplay
                $iframe.attr('src', '');
                
                // Only hide iframes with the "video-modal" class
                if ($iframe.hasClass('video-modal')) {
                    $iframe.hide();
                }
                
                // Use setTimeout to ensure the src change takes effect
                setTimeout(function () {
                    // Remove autoplay parameter if present
                    var newSrc = currentSrc.replace(/(\?|&)autoplay=1/g, '');
                    $iframe.attr('src', newSrc);
                }, 100);
            });
        }
    });
});