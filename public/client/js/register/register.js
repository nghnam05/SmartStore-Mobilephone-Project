document.addEventListener("DOMContentLoaded", function () {
  function setupToggle(inputId, toggleId, iconId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);
    const icon = document.getElementById(iconId);

    toggle.addEventListener("click", () => {
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      icon.classList.toggle("bi-eye");
      icon.classList.toggle("bi-eye-slash");
    });
  }

  setupToggle("password", "togglePassword", "eyeIcon1");
  setupToggle("confirmPassword", "toggleConfirmPassword", "eyeIcon2");
});
