// LOGIN.JS - Auth page logic

onAppReady(() => {
  renderAuthenticatedState();
  initAuthTabs();
  initLoginForm();
  initRegisterForm();
});

function renderAuthenticatedState() {
  const user = getCurrentUser();
  const card = document.querySelector('.auth-card');
  if (!user || !card) return;

  card.innerHTML = `
    <h1>PC Gear Store</h1>
    <p class="auth-subtitle">Ban dang dang nhap voi tai khoan</p>
    <div class="auth-session-box">
      <span class="auth-session-icon"><i class="fa-solid fa-circle-user"></i></span>
      <strong>${user.fullname || user.email}</strong>
      <small>${user.email}</small>
      <span class="auth-role">${user.role === 'admin' ? 'Quan tri vien' : 'Khach hang'}</span>
    </div>
    <div style="display:grid;gap:10px;margin-top:18px">
      <a class="btn btn-primary btn-lg btn-full" href="${user.role === 'admin' ? 'admin.html' : 'index.html'}">Tiep tuc vao ${user.role === 'admin' ? 'trang admin' : 'cua hang'}</a>
      <button class="btn btn-outline btn-lg btn-full" type="button" onclick="logoutUser('login.html')">Dang xuat</button>
    </div>
  `;
}

function initAuthTabs() {
  document.querySelectorAll('[data-tab]').forEach(button => {
    button.addEventListener('click', () => {
      const tab = button.dataset.tab;
      document.querySelectorAll('.auth-tabs button').forEach(item => item.classList.remove('active'));
      document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
      button.classList.add('active');
      document.querySelector(`[data-auth-form="${tab}"]`)?.classList.add('active');
    });
  });
}

function initLoginForm() {
  const form = document.querySelector('[data-auth-form="login"]');
  if (!form) return;

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const email = form.querySelector('input[type="email"]')?.value.trim();
    const password = form.querySelector('input[type="password"]')?.value;

    try {
      const user = await loginUser(email, password);
      showToast(`Dang nhap thanh cong: ${user.fullname || user.email}`);
      setTimeout(() => window.location.href = user.role === 'admin' ? 'admin.html' : 'index.html', 800);
    } catch (error) {
      showToast(`<i class="fa-solid fa-circle-xmark"></i> ${error.message || 'Dang nhap that bai'}`);
    }
  });
}

function initRegisterForm() {
  const form = document.querySelector('[data-auth-form="register"]');
  if (!form) return;

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const inputs = form.querySelectorAll('input');
    const payload = {
      fullname: inputs[0]?.value.trim(),
      email: inputs[1]?.value.trim(),
      phone: inputs[2]?.value.trim(),
      password: inputs[3]?.value
    };

    try {
      await registerUser(payload);
      showToast('Dang ky thanh cong');
      setTimeout(() => window.location.href = 'index.html', 800);
    } catch (error) {
      showToast(`<i class="fa-solid fa-circle-xmark"></i> ${error.message || 'Dang ky that bai'}`);
    }
  });
}