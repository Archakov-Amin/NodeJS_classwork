const API_URL = "http://localhost:5000";

// Элементы DOM
const userForm = document.getElementById("user-form");
const userIdInput = document.getElementById("user-id");
const nameInput = document.getElementById("name");
const lastNameInput = document.getElementById("lastName");
const ageInput = document.getElementById("age");
const avatarInput = document.getElementById("avatar");

const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const usersList = document.getElementById("users-list");

let isEditMode = false;

// Загрузка пользователей при старте страницы
document.addEventListener("DOMContentLoaded", fetchUsers);

// Получить всех пользователей (GET /users)
async function fetchUsers() {
  try {
    const res = await fetch(`${API_URL}/users`);
    if (!res.ok) throw new Error("Не удалось загрузить пользователей");
    const users = await res.json();
    renderUsers(users);
  } catch (err) {
    alert(err.message);
  }
}

// Рендеринг карточек в HTML
function renderUsers(users) {
  usersList.innerHTML = "";

  if (users.length === 0) {
    usersList.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #6b7280;">Пользователей пока нет.</p>`;
    return;
  }

  users.forEach((user) => {
    const card = document.createElement("div");
    card.className = "user-card";

    // Корректируем путь к аватарке (убираем './', если сервис сохранил как './uploads/file.png')
    let avatarSrc = "https://placeholder.com"; // дефолт заглушка
    if (user.avatar) {
      const cleanPath = user.avatar.replace(/^\.\//, "");
      avatarSrc = `${API_URL}/${cleanPath}`;
    }

    card.innerHTML = `
      <img src="${avatarSrc}" alt="Avatar" class="user-avatar" onerror="this.src='https://placeholder.com'">
      <div class="user-name">${user.name} ${user.lastName}</div>
      <div class="user-age">Возраст: ${user.age}</div>
      <div class="card-actions">
        <button class="btn btn-secondary" onclick="prepareEdit('${user._id}', '${user.name}', '${user.lastName}', ${user.age})">Редактировать</button>
        <button class="btn btn-danger" onclick="deleteUser('${user._id}')">Удалить</button>
      </div>
    `;
    usersList.appendChild(card);
  });
}

// Отправка формы (Создание или Обновление)
userForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = userIdInput.value;

  // Для отправки файлов на бэкенд ВСЕГДА используем FormData
  const formData = new FormData();
  formData.append("name", nameInput.value.trim());
  formData.append("lastName", lastNameInput.value.trim());
  formData.append("age", ageInput.value);

  if (avatarInput.files[0]) {
    formData.append("avatar", avatarInput.files[0]);
  }

  try {
    let res;
    if (isEditMode) {
      // Обновление (PATCH /user/:id)
      // Поскольку ваш сервер принимает JSON при обновлении (в UserController.updateUser нет fileService),
      // Мы отправляем обычный JSON. Если вам нужно менять аватар при обновлении — добавьте fileService на бэкенде.
      res = await fetch(`${API_URL}/user/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameInput.value.trim(),
          lastName: lastNameInput.value.trim(),
          age: ageInput.value,
        }),
      });
    } else {
      // Регистрация (POST /registration)
      res = await fetch(`${API_URL}/registration`, {
        method: "POST",
        body: formData, // Заголовки Content-Type браузер выставит сам (multipart/form-data)
      });
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data);

    resetForm();
    fetchUsers();
  } catch (err) {
    alert(`Ошибка: ${err.message}`);
  }
});

// Переключение формы в режим редактирования
window.prepareEdit = function (id, name, lastName, age) {
  isEditMode = true;
  formTitle.textContent = "Редактирование профиля";
  submitBtn.textContent = "Обновить";
  cancelBtn.classList.remove("hidden");

  userIdInput.value = id;
  nameInput.value = name;
  lastNameInput.value = lastName;
  ageInput.value = age;

  // При обновлении скрываем поле файла, так как ваш контроллер обновляет только текстовые поля
  avatarInput.closest(".form-group").style.opacity = "0.5";
  avatarInput.disabled = true;
};

// Сброс формы в дефолтное состояние
cancelBtn.addEventListener("click", resetForm);

function resetForm() {
  isEditMode = false;
  formTitle.textContent = "Регистрация пользователя";
  submitBtn.textContent = "Сохранить";
  cancelBtn.classList.add("hidden");

  userForm.reset();
  userIdInput.value = "";

  avatarInput.closest(".form-group").style.opacity = "1";
  avatarInput.disabled = false;
}

// Удаление пользователя (DELETE /user/:id)
window.deleteUser = async function (id) {
  if (!confirm("Вы уверены, что хотите удалить этого пользователя?")) return;

  try {
    const res = await fetch(`${API_URL}/user/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data);

    fetchUsers();
  } catch (err) {
    alert(err.message);
  }
};
