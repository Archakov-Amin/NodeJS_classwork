(function () {
  "use strict";

  const API_BASE = "http://localhost:5000";

  const nav            = document.getElementById("nav");
  const authSection    = document.getElementById("auth-section");
  const profileSection = document.getElementById("profile-section");
  const usersSection   = document.getElementById("users-section");

  const profileAvatarWrap = document.getElementById("profile-avatar-wrap");
  const profileName       = document.getElementById("profile-name");
  const profileEmail      = document.getElementById("profile-email");
  const profileAge        = document.getElementById("profile-age");
  const profileError      = document.getElementById("profile-error");
  const profileActions    = document.getElementById("profile-actions");
  const editProfileForm   = document.getElementById("edit-profile-form");
  const editProfileBtn    = document.getElementById("edit-profile-btn");
  const deleteProfileBtn  = document.getElementById("delete-profile-btn");
  const cancelEditBtn     = document.getElementById("cancel-edit-btn");

  const usersGrid  = document.getElementById("users-grid");
  const usersError = document.getElementById("users-error");

  // ===== Хранилище (теперь { token, user }) =====
  function getAuth() {
    try {
      const raw = localStorage.getItem("auth");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
  function saveAuth(data) {
    if (data) localStorage.setItem("auth", JSON.stringify(data));
    else localStorage.removeItem("auth");
  }
  function authHeaders() {
    const auth = getAuth();
    return auth && auth.token ? { Authorization: `Bearer ${auth.token}` } : {};
  }

  // ===== Нормализация: mongoose-документ → { id, name, ... } =====
  function toClientUser(raw) {
    if (!raw) return null;
    return {
      id: raw.id || raw._id,
      name: raw.name,
      lastName: raw.lastName,
      email: raw.email,
      age: raw.age,
      avatar: raw.avatar,
    };
  }

  function avatarUrl(avatar) {
    if (!avatar) return null;
    return API_BASE + "/" + avatar.replace(/^\.?\//, "");
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  // ===== Navbar =====
  function renderNavbar(auth) {
    if (!auth || !auth.user) { nav.innerHTML = ""; return; }
    nav.innerHTML = `
      <a href="#" data-view="profile">Профиль</a>
      <a href="#" data-view="users">Все пользователи</a>
      <button type="button" class="logout-btn" id="logout-btn">Выйти</button>
    `;
    document.getElementById("logout-btn").addEventListener("click", () => {
      saveAuth(null);
      renderApp();
    });
    nav.querySelectorAll("a[data-view]").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        if (a.dataset.view === "profile") showProfile();
        else showUsers();
      });
    });
  }

  function hideAll() {
    authSection.hidden = true;
    profileSection.hidden = true;
    usersSection.hidden = true;
  }

  function renderApp() {
    const auth = getAuth();
    renderNavbar(auth);
    if (!auth || !auth.user) {
      hideAll();
      authSection.hidden = false;
      return;
    }
    showProfile();
  }

  // ===== Профиль =====
  function renderProfile(user) {
    profileAvatarWrap.innerHTML = "";
    const url = avatarUrl(user.avatar);
    let avatarEl;
    if (url) {
      avatarEl = document.createElement("img");
      avatarEl.className = "avatar big";
      avatarEl.src = url;
      avatarEl.alt = "avatar";
    } else {
      avatarEl = document.createElement("div");
      avatarEl.className = "avatar big placeholder";
      avatarEl.textContent = (user.name || "?")[0];
    }
    profileAvatarWrap.appendChild(avatarEl);

    profileName.textContent  = `${user.name} ${user.lastName}`;
    profileEmail.textContent = user.email;
    profileAge.textContent   = user.age != null ? `Возраст: ${user.age}` : "";

    profileError.hidden = true;
    editProfileForm.hidden = true;
    profileActions.hidden = false;
  }

  // Догружаем полного пользователя (в /login нет age и avatar)
  async function fetchFullUser(id) {
    try {
      const res = await fetch(`${API_BASE}/user/${id}`, { headers: authHeaders() });
      if (!res.ok) return null;
      const data = await res.json();
      return toClientUser(data); // отбрасываем password-hash и _id
    } catch { return null; }
  }

  async function showProfile() {
    const auth = getAuth();
    if (!auth || !auth.user) return renderApp();
    hideAll();
    profileSection.hidden = false;
    renderProfile(auth.user);

    const full = await fetchFullUser(auth.user.id);
    if (full) {
      auth.user = { ...auth.user, ...full };
      saveAuth(auth);
      renderProfile(auth.user);
    }
  }

  editProfileBtn.addEventListener("click", () => {
    const auth = getAuth();
    if (!auth || !auth.user) return;
    const u = auth.user;
    profileActions.hidden = true;
    editProfileForm.hidden = false;
    editProfileForm.querySelector('[name="name"]').value     = u.name || "";
    editProfileForm.querySelector('[name="lastName"]').value = u.lastName || "";
    editProfileForm.querySelector('[name="age"]').value      = u.age != null ? u.age : "";
  });

  cancelEditBtn.addEventListener("click", () => {
    editProfileForm.hidden = true;
    profileActions.hidden = false;
  });

  editProfileForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const auth = getAuth();
    if (!auth || !auth.user) return;

    const payload = {
      name:     editProfileForm.querySelector('[name="name"]').value.trim(),
      lastName: editProfileForm.querySelector('[name="lastName"]').value.trim(),
      age:      Number(editProfileForm.querySelector('[name="age"]').value),
    };

    try {
      const res = await fetch(`${API_BASE}/user/${auth.user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Не удалось сохранить изменения");

      // PATCH возвращает полный mongoose-документ — нормализуем
      const updated = toClientUser(await res.json());
      auth.user = { ...auth.user, ...updated };
      saveAuth(auth);
      renderProfile(auth.user);
    } catch (err) {
      profileError.textContent = err.message;
      profileError.hidden = false;
    }
  });

  deleteProfileBtn.addEventListener("click", async () => {
    const auth = getAuth();
    if (!auth || !auth.user) return;
    if (!confirm("Удалить аккаунт?")) return;

    try {
      const res = await fetch(`${API_BASE}/user/${auth.user.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Не удалось удалить аккаунт");
      saveAuth(null);
      renderApp();
    } catch (err) {
      profileError.textContent = err.message;
      profileError.hidden = false;
    }
  });

  // ===== Все пользователи =====
  function showUsers() {
    const auth = getAuth();
    if (!auth || !auth.user) return renderApp();
    hideAll();
    usersSection.hidden = false;
    loadUsers();
  }

  async function loadUsers() {
    usersError.hidden = true;
    usersGrid.innerHTML = "<p>Загрузка...</p>";
    try {
      const res = await fetch(`${API_BASE}/users`, { headers: authHeaders() });
      if (!res.ok) throw new Error("Не удалось загрузить пользователей");
      const raw = await res.json();
      const users = raw.map(toClientUser); // отбрасываем password-hash
      renderUsers(users);
    } catch (err) {
      usersGrid.innerHTML = "";
      usersError.textContent = err.message;
      usersError.hidden = false;
    }
  }

  function renderUsers(users) {
    usersGrid.innerHTML = "";
    if (!users.length) { usersGrid.innerHTML = "<p>Пользователей нет.</p>"; return; }

    users.forEach((u) => {
      const card = document.createElement("div");
      card.className = "user-card";
      card.dataset.id = u.id;

      const url = avatarUrl(u.avatar);
      let avatarEl;
      if (url) {
        avatarEl = document.createElement("img");
        avatarEl.className = "avatar";
        avatarEl.src = url;
        avatarEl.alt = "";
      } else {
        avatarEl = document.createElement("div");
        avatarEl.className = "avatar placeholder";
        avatarEl.textContent = (u.name || "?")[0];
      }
      card.appendChild(avatarEl);

      const info = document.createElement("div");
      info.className = "user-info";
      info.innerHTML = `
        <h3>${escapeHtml(u.name)} ${escapeHtml(u.lastName)}</h3>
        <p class="email">${escapeHtml(u.email)}</p>
        <p>Возраст: ${u.age != null ? escapeHtml(u.age) : "—"}</p>
      `;
      card.appendChild(info);

      const actions = document.createElement("div");
      actions.className = "actions";

      const editBtn = document.createElement("button");
      editBtn.textContent = "Редактировать";
      editBtn.addEventListener("click", () => startEdit(card, u));

      const delBtn = document.createElement("button");
      delBtn.className = "danger";
      delBtn.textContent = "Удалить";
      delBtn.addEventListener("click", () => deleteUser(u.id));

      actions.appendChild(editBtn);
      actions.appendChild(delBtn);
      card.appendChild(actions);

      usersGrid.appendChild(card);
    });
  }

  // Обновление БЕЗ аватара — только name / lastName / age
  function startEdit(card, user) {
    const info    = card.querySelector(".user-info");
    const actions = card.querySelector(".actions");

    info.hidden = true;
    actions.hidden = true;

    const form = document.createElement("form");
    form.className = "edit-form";
    form.innerHTML = `
      <input name="name"     value="${escapeHtml(user.name)}"     placeholder="Имя" required />
      <input name="lastName" value="${escapeHtml(user.lastName)}" placeholder="Фамилия" required />
      <input name="age" type="number" min="12"
             value="${user.age != null ? escapeHtml(user.age) : ""}"
             placeholder="Возраст" required />
      <div class="actions">
        <button type="submit">Сохранить</button>
        <button type="button" class="secondary" data-cancel>Отмена</button>
      </div>
    `;
    card.appendChild(form);

    form.querySelector("[data-cancel]").addEventListener("click", () => {
      form.remove();
      info.hidden = false;
      actions.hidden = false;
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const payload = {
        name:     form.querySelector('[name="name"]').value.trim(),
        lastName: form.querySelector('[name="lastName"]').value.trim(),
        age:      Number(form.querySelector('[name="age"]').value),
      };

      try {
        const res = await fetch(`${API_BASE}/user/${user.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Не удалось сохранить изменения");

        const updated = toClientUser(await res.json());

        // Если редактировали самого себя — обновляем и localStorage
        const auth = getAuth();
        if (auth && auth.user && auth.user.id === updated.id) {
          auth.user = { ...auth.user, ...updated };
          saveAuth(auth);
        }

        form.remove();
        info.innerHTML = `
          <h3>${escapeHtml(updated.name)} ${escapeHtml(updated.lastName)}</h3>
          <p class="email">${escapeHtml(updated.email)}</p>
          <p>Возраст: ${updated.age != null ? escapeHtml(updated.age) : "—"}</p>
        `;
        info.hidden = false;
        actions.hidden = false;
      } catch (err) {
        alert(err.message);
      }
    });
  }

  async function deleteUser(id) {
    if (!confirm("Удалить пользователя?")) return;
    try {
      const res = await fetch(`${API_BASE}/user/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Не удалось удалить пользователя");

      const auth = getAuth();
      if (auth && auth.user && auth.user.id === id) {
        saveAuth(null);
        renderApp();
        return;
      }
      const card = usersGrid.querySelector(`.user-card[data-id="${id}"]`);
      if (card) card.remove();
    } catch (err) {
      alert(err.message);
    }
  }

  window.renderApp = renderApp;
  renderApp();
})();