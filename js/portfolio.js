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



// Secret projects
document.addEventListener("DOMContentLoaded", function() {
  // Constants to easily adjust the cookie lifespan and the expected URL parameter
  const COOKIE_LIFESPAN_DAYS = 7; // The cookie lifespan in days
  const ACCESS_URL_PARAM = "access"; // The URL parameter that grants access
  const ACCESS_PARAM_VALUE = "true"; // The value that must be present in the URL parameter to grant access

  const correctPassword = "showme"; // The password you want users to enter
  const passwordInput = document.getElementById("password-input");
  const submitButton = document.getElementById("submit-password");
  const errorMessage = document.getElementById("error-message");
  const restrictedContent = document.getElementById("restricted-content");
  const passwordContainer = document.getElementById("password-container");

  // Check if the user has already logged in by checking the cookie
  if (getCookie("loggedIn") === "true") {
    showRestrictedContent();
  }

  // Check if the URL contains the specific parameter to grant access
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get(ACCESS_URL_PARAM) === ACCESS_PARAM_VALUE) {
    setCookie("loggedIn", "true", COOKIE_LIFESPAN_DAYS); // Expires in defined number of days
    showRestrictedContent(); // Show restricted content directly
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
      errorMessage.style.display = "block"; // Show error message
      passwordInput.value = ""; // Clear the input field after wrong attempt
      passwordInput.focus(); // Focus back on the password field
    }
  }

  // Function to show restricted content
  function showRestrictedContent() {
    passwordContainer.style.display = "none"; // Hide password input
    restrictedContent.style.display = "block"; // Show restricted content
  }

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