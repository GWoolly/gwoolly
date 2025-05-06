  document.addEventListener('DOMContentLoaded', function() {
    // Function to get URL parameters
    function getUrlParameter(name) {
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
      const results = regex.exec(location.search);
      return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Get referrer info - use 'ref' parameter instead of 'utm_source'
    const source = getUrlParameter('ref') || document.referrer || 'direct';
    
    // Create visitor data object
    const visitorData = {
      page: window.location.pathname,
      timestamp: new Date().toISOString(),
      referrer: source,
      userAgent: navigator.userAgent,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      language: navigator.language
    };

    // Send data to your Google Apps Script Web App
    fetch('https://script.google.com/macros/library/d/1Wnz2d9sReHlCchsGSuMTOZpzc-624QcDnl2Z0dzKWzx_2h4-mlOcUnz5/1', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(visitorData),
    })
    .catch(error => console.error('Error logging visit:', error));
  });