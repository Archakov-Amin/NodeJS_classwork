(function () {
  "use strict";

  const API_BASE = "http://localhost:5000";

  const authTitle       = document.getElementById("auth-title");
  const authError       = document.getElementById("auth-error");
  const loginForm       = document.getElementById("login-form");
  const registerForm    = document.getElementById("register-form");
  const toRegister      = document.getElementById("to-register");
  const toLogin         = document.getElementById("to-login");
  const avatarInput     = document.getElementById("avatar-input");
  const avatarPreview   = document.getElementById("avatar-preview");
  const avatarPlaceholder = document.getElementById("avatar-placeholder");

  let avatarFile = null;

  function showError(msg) {
    authError.textContent = msg;
    authError.hidden = false;
  }
  function clearError() {
    authError.hidden = true;
    authError.textContent = "";
  }

  function showLogin() {
    clearError();
    loginForm.hidden = false;
    registerForm.hidden = true;
    authTitle.textContent = "Вход";
  }
  function showRegister() {
    clearError();
    loginForm.hidden = true;
    registerForm.hidden = false;
    authTitle.textContent = "Регистрация";
  }

  // Переключение "Вход <-> Регистрация" (без отдельной страницы)
  toRegister.addEventListener("click", (e) => {
    e.preventDefault();
    showRegister();
  });
  toLogin.addEventListener("click", (e) => {
    e.preventDefault();
    showLogin();
  });

  // Превью аватара
  avatarInput.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    avatarFile = file;
    avatarPreview.src = URL.createObjectURL(file);
    avatarPreview.hidden = false;
    avatarPlaceholder.hidden = true;
  });

  // ===== Регистрация =====
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearError();

    const fd = new FormData(registerForm);
    if (avatarFile) fd.append("avatar", avatarFile);

    const btn = registerForm.querySelector("button[type=submit]");
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Отправка...";

    try {
      const res = await fetch(`${API_BASE}/registration`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg = typeof data === "string" ? data : data && data.message;
        throw new Error(msg || "Ошибка регистрации");
      }

      // Сброс формы и переход к вкладке Входа
      registerForm.reset();
      avatarFile = null;
      avatarPreview.hidden = true;
      avatarPreview.removeAttribute("src");
      avatarPlaceholder.hidden = false;
      showLogin();
    } catch (err) {
      showError(err.message);
    } finally {
      btn.disabled = false;
      btn.textContent = original;
    }
  });

  // ===== Логин =====
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearError();

    const payload = Object.fromEntries(new FormData(loginForm));

    const btn = loginForm.querySelector("button[type=submit]");
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Вход...";

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg = typeof data === "string" ? data : data && data.message;
        throw new Error(msg || "Неверный email или пароль");
      }

      const user = await res.json();
      localStorage.setItem("user", JSON.stringify(user));
      loginForm.reset();

      // Просим profile.js показать профиль
      if (typeof window.renderApp === "function") {
        window.renderApp();
      }
    } catch (err) {
      showError(err.message);
    } finally {
      btn.disabled = false;
      btn.textContent = original;
    }
  });
})();