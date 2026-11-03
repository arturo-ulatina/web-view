const form = document.getElementById("login-form");
const username = document.getElementById("username");
const password = document.getElementById("password");
const toggle = form.querySelector(".toggle-password");
const submit = form.querySelector('button[type="submit"]');

// Each rule returns an error message, or "" when the value is valid.
const rules = {
  username(value) {
    if (!value) return "Please enter your username.";
    if (value.length < 3) return "Username must be at least 3 characters.";
    if (value.length > 20) return "Username can be at most 20 characters.";
    if (!/^[a-zA-Z0-9._-]+$/.test(value)) {
      return "Use only letters, numbers, dots, dashes or underscores.";
    }
    return "";
  },
  password(value) {
    if (!value) return "Please enter your password.";
    if (value.length < 8) return "Password must be at least 8 characters.";
    return "";
  },
};

function validate(input) {
  const message = rules[input.name](input.value);
  const error = document.getElementById(input.name + "-error");
  error.textContent = message;
  input.setAttribute("aria-invalid", message ? "true" : "false");
  input.classList.toggle("is-valid", !message);
  return !message;
}

for (const input of [username, password]) {
  // Only start showing errors once the user has left the field,
  // then re-check on every keystroke so errors clear as they type.
  input.addEventListener("blur", () => {
    input.dataset.touched = "true";
    validate(input);
  });
  input.addEventListener("input", () => {
    if (input.dataset.touched) validate(input);
  });
}

// Strip spaces from the username as it's typed or pasted.
username.addEventListener("input", () => {
  const cleaned = username.value.replace(/\s+/g, "");
  if (cleaned !== username.value) username.value = cleaned;
});

toggle.addEventListener("click", () => {
  const showing = password.type === "text";
  password.type = showing ? "password" : "text";
  toggle.textContent = showing ? "Show" : "Hide";
  toggle.setAttribute("aria-pressed", String(!showing));
  password.focus();
});

form.addEventListener("submit", (event) => {
  console.log("Hola! Estoy empezando a validar la información");

  const results = [username, password].map((input) => {
    input.dataset.touched = "true";
    return validate(input);
  });

  if (results.includes(false)) {
    event.preventDefault();
    form.querySelector('[aria-invalid="true"]').focus();
    return;
  }

  console.log("Todo ha ido bien, voy a enviar los datos");

  // Prevent double submits while the request is in flight.
  submit.disabled = true;
  submit.textContent = "Logging in…";
});
