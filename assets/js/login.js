// LOGIN.JS - Auth page logic

document.addEventListener('DOMContentLoaded', () => {
  // Tab switching
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      // Toggle tab buttons
      document.querySelectorAll('.auth-tabs button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Toggle forms
      document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
      document.querySelector(`[data-auth-form="${tab}"]`)?.classList.add('active');
    });
  });

  // Form submissions
  const loginForm = document.querySelector('[data-auth-form="login"]');
  const registerForm = document.querySelector('[data-auth-form="register"]');

  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      showToast('Đăng nhập thành công! (Demo)');
      setTimeout(() => window.location.href = 'index.html', 1200);
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', e => {
      e.preventDefault();
      showToast('Đăng ký thành công! (Demo)');
      setTimeout(() => {
        document.querySelector('[data-tab="login"]')?.click();
      }, 1200);
    });
  }
});
