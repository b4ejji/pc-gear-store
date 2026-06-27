// LOGIN.JS - Auth page logic

onAppReady(() => {
  initAuthTabs();
  initLoginForm();
  initRegisterForm();
});

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
      showToast(`Đăng nhập thành công: ${user.fullname || user.email}`);
      setTimeout(() => window.location.href = user.role === 'admin' ? 'admin.html' : 'index.html', 800);
    } catch (error) {
      showToast(`<i class="fa-solid fa-circle-xmark"></i> ${error.message || 'Đăng nhập thất bại'}`);
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
      showToast('Đăng ký thành công');
      setTimeout(() => window.location.href = 'index.html', 800);
    } catch (error) {
      showToast(`<i class="fa-solid fa-circle-xmark"></i> ${error.message || 'Đăng ký thất bại'}`);
    }
  });
}
