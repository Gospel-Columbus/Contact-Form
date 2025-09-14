// Select important elements
const form = document.querySelector("form");
const formGroups = document.querySelectorAll(".form-group");
const radioDivs = document.querySelectorAll(".query-type");
const toast = document.querySelector(".toast");

form.setAttribute("novalidate", ""); // turn off browser's default validation

// Show and hide toast message
function showToast() {
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 4000);
}

// Show an error inside a form group
function showError(formGroup, selector = ".error") {
  const errorMessage = formGroup.querySelector(selector);
  if (errorMessage) errorMessage.classList.remove("hidden");
}

// Hide all errors inside a form group
function hideErrors(formGroup) {
  formGroup.querySelectorAll(".error").forEach(error => {
    error.classList.add("hidden");
  });
}

// Check if a form group is valid
function validateGroup(formGroup) {
  const input = formGroup.querySelector("input, textarea");
  if (!input) return true; // skip if no input found
  const value = input.value?.trim();

  if (input.type === "radio") {
    const checked = formGroup.querySelector("input:checked");
    if (!checked) {
      showError(formGroup);
      return false;
    }
  } 
  else if (input.type === "checkbox") {
    if (!input.checked) {
      showError(formGroup);
      return false;
    }
  } 
  else if (input.type === "email") {
    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!value) {
      showError(formGroup, ".empty");
      return false;
    } else if (!emailPattern.test(value)) {
      showError(formGroup, ".valid");
      return false;
    }
  } 
  else {
    if (!value) {
      showError(formGroup);
      return false;
    }
  }
  return true; // valid
}

// Highlight radio background when selected
function updateRadioStyles() {
  radioDivs.forEach(div => {
    const radio = div.querySelector("input");
    div.classList.toggle("radio-selected", radio.checked);
  });
}

// ------------------ Event Listeners ------------------

// Handle radio clicks
radioDivs.forEach(div => {
  div.addEventListener("click", () => {
    div.querySelector("input").checked = true;
    updateRadioStyles();
    hideErrors(div.closest(".form-group"));
  });
});

// Handle form submission
form.addEventListener("submit", e => {
  e.preventDefault();
  let formValid = true;

  formGroups.forEach(group => {
    hideErrors(group); // reset errors
    if (!validateGroup(group)) formValid = false;
  });

  if (formValid) {
    showToast();
    form.reset();
    updateRadioStyles(); // clear radio styles
  }
});

// Remove error when user focuses on an input
formGroups.forEach(group => {
  const inputs = group.querySelectorAll("input, textarea");
  inputs.forEach(input => {
    input.addEventListener("focus", () => hideErrors(group));
  });
});

// Hide toast when clicked
toast.addEventListener("click", () => toast.classList.add("hidden"));