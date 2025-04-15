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


// // Markdown tables to columns
// document.addEventListener('DOMContentLoaded', function() {
  // // Find all tables in the document
  // const tables = document.querySelectorAll('table');
  
  // tables.forEach(table => {
    // // Check if the first cell contains "column-table"
    // const firstCell = table.querySelector('td, th');
    // if (firstCell && firstCell.textContent.trim().toLowerCase() === 'column-table') {
      // // Get all rows except the header row (which contains our marker)
      // const rows = Array.from(table.querySelectorAll('tr')).slice(1);
      // if (rows.length === 0) return;
      
      // // Count columns from the first data row
      // const columns = rows[0].querySelectorAll('td, th').length;
      
      // // Create a new div to replace the table
      // const columnContainer = document.createElement('div');
      // columnContainer.className = 'multi-column col-' + columns;
      
      // // For each column, create a div and fill it with content from that column across all rows
      // for (let colIndex = 0; colIndex < columns; colIndex++) {
        // const columnDiv = document.createElement('div');
        
        // // Collect markdown content for this column from all rows
        // let markdownContent = '';
        
        // rows.forEach(row => {
          // const cells = row.querySelectorAll('td, th');
          // if (colIndex < cells.length) {
            // // Get text content from cell (raw markdown)
            // markdownContent += cells[colIndex].textContent + '\n\n';
          // }
        // });
        
        // // Process the markdown content
        // const htmlContent = processMarkdown(markdownContent);
        // columnDiv.innerHTML = htmlContent;
        
        // columnContainer.appendChild(columnDiv);
      // }
      
      // // Replace the table with our column layout
      // table.parentNode.replaceChild(columnContainer, table);
    // }
  // });
  
  // // Simple markdown processor
  // function processMarkdown(markdown) {
    // if (!markdown) return '';
    
    // let html = markdown;
    
    // // Process headings (# Heading)
    // html = html.replace(/^(#{1,6})\s+(.+)$/gm, function(match, hashes, text) {
      // const level = hashes.length;
      // return `<h${level}>${text.trim()}</h${level}>`;
    // });
    
    // // Process bold (**text**)
    // html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // // Process italic (*text*)
    // html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // // Process links [text](url)
    // html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    
    // // Process unordered lists
    // html = html.replace(/^\s*[\*\-]\s+(.+)$/gm, '<li>$1</li>');
    // html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    
    // // Process ordered lists
    // html = html.replace(/^\s*\d+\.\s+(.+)$/gm, '<li>$1</li>');
    // html = html.replace(/(<li>.*<\/li>)/gs, '<ol>$1</ol>');
    
    // // Process blockquotes
    // html = html.replace(/^\>\s+(.+)$/gm, '<blockquote>$1</blockquote>');
    
    // // Process images ![alt](src)
    // html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">');
    
    // // Process code blocks
    // html = html.replace(/```(.*?)```/gs, function(match, code) {
      // return `<pre><code>${code.trim()}</code></pre>`;
    // });
    
    // // Process inline code
    // html = html.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // // Process paragraphs (lines with content)
    // html = html.replace(/^(?!<[a-z][^>]*>)(.+)$/gm, '<p>$1</p>');
    
    // // Fix any duplicate paragraph tags
    // html = html.replace(/<p><p>/g, '<p>');
    // html = html.replace(/<\/p><\/p>/g, '</p>');
    
    // // Replace multiple newlines with a single one
    // html = html.replace(/\n\s*\n/g, '\n');
    
    // return html;
  // }
// });