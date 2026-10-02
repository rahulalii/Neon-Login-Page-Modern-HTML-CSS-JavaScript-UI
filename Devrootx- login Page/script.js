/**
 * Nexus Authentication Portal - Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const loginTab = document.getElementById('loginTab');
  const signupTab = document.getElementById('signupTab');
  const tabGlider = document.getElementById('tabGlider');
  const loginFormSection = document.getElementById('loginFormSection');
  const signupFormSection = document.getElementById('signupFormSection');
  const brandTagline = document.getElementById('brandTagline');

  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const forgotForm = document.getElementById('forgotForm');

  const loginSubmitBtn = document.getElementById('loginSubmitBtn');
  const signupSubmitBtn = document.getElementById('signupSubmitBtn');
  const forgotSubmitBtn = document.getElementById('forgotSubmitBtn');

  const forgotModal = document.getElementById('forgotModal');
  const openForgotModal = document.getElementById('openForgotModal');
  const closeForgotModal = document.getElementById('closeForgotModal');

  const toastContainer = document.getElementById('toastContainer');
  const authCard = document.getElementById('authCard');
  const cardGlow = document.getElementById('cardGlow');

  const signupPasswordInput = document.getElementById('signupPassword');
  const bar1 = document.getElementById('bar1');
  const bar2 = document.getElementById('bar2');
  const bar3 = document.getElementById('bar3');
  const bar4 = document.getElementById('bar4');
  const strengthText = document.getElementById('strengthText');

  /* ==========================================================================
     Tab Switching Logic
     ========================================================================== */
  function switchTab(mode) {
    if (mode === 'login') {
      loginTab.classList.add('active');
      loginTab.setAttribute('aria-selected', 'true');
      signupTab.classList.remove('active');
      signupTab.setAttribute('aria-selected', 'false');
      tabGlider.style.transform = 'translateX(0)';

      loginFormSection.classList.remove('hidden');
      loginFormSection.classList.add('active');
      signupFormSection.classList.remove('active');
      signupFormSection.classList.add('hidden');

      brandTagline.textContent = 'Welcome back! Please enter your details.';
    } else {
      signupTab.classList.add('active');
      signupTab.setAttribute('aria-selected', 'true');
      loginTab.classList.remove('active');
      loginTab.setAttribute('aria-selected', 'false');
      tabGlider.style.transform = 'translateX(100%)';

      signupFormSection.classList.remove('hidden');
      signupFormSection.classList.add('active');
      loginFormSection.classList.remove('active');
      loginFormSection.classList.add('hidden');

      brandTagline.textContent = 'Create an account to get started with Nexus.';
    }
  }

  loginTab.addEventListener('click', () => switchTab('login'));
  signupTab.addEventListener('click', () => switchTab('signup'));

  /* ==========================================================================
     Password Visibility Toggle
     ========================================================================== */
  document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const eyeOpen = button.querySelector('.eye-open');
      const eyeClosed = button.querySelector('.eye-closed');

      if (input.type === 'password') {
        input.type = 'text';
        eyeOpen.classList.add('hidden');
        eyeClosed.classList.remove('hidden');
      } else {
        input.type = 'password';
        eyeOpen.classList.remove('hidden');
        eyeClosed.classList.add('hidden');
      }
    });
  });

  /* ==========================================================================
     Password Strength Calculator
     ========================================================================== */
  if (signupPasswordInput) {
    signupPasswordInput.addEventListener('input', () => {
      const val = signupPasswordInput.value;
      const result = evaluatePasswordStrength(val);
      updateStrengthUI(result);
    });
  }

  function evaluatePasswordStrength(password) {
    if (!password) return { score: 0, text: 'Must contain at least 8 characters' };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let text = 'Weak password';
    if (score === 2) text = 'Fair password';
    if (score === 3) text = 'Good password';
    if (score >= 4) text = 'Strong & secure password';

    return { score, text };
  }

  function updateStrengthUI({ score, text }) {
    const bars = [bar1, bar2, bar3, bar4];
    bars.forEach(b => {
      b.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
    });

    strengthText.textContent = text;

    const colors = ['#f43f5e', '#f59e0b', '#6366f1', '#10b981'];
    const activeColor = colors[Math.max(0, score - 1)] || colors[0];

    for (let i = 0; i < score; i++) {
      if (bars[i]) {
        bars[i].style.backgroundColor = activeColor;
      }
    }
  }

  /* ==========================================================================
     Validation Utilities
     ========================================================================== */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(inputEl, errorEl, message) {
    const fieldWrapper = inputEl.closest('.input-field');
    if (fieldWrapper) {
      fieldWrapper.classList.add('error');
      // trigger shake re-animation
      fieldWrapper.style.animation = 'none';
      void fieldWrapper.offsetWidth;
      fieldWrapper.style.animation = 'shake 0.35s ease';
    }
    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  function clearError(inputEl, errorEl) {
    const fieldWrapper = inputEl.closest('.input-field');
    if (fieldWrapper) {
      fieldWrapper.classList.remove('error');
    }
    if (errorEl) {
      errorEl.textContent = '';
    }
  }

  // Clear errors when typing
  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
      const parentGroup = input.closest('.input-group') || input.closest('form');
      const errorMsg = parentGroup ? parentGroup.querySelector('.error-msg') : null;
      clearError(input, errorMsg);
    });
  });

  /* ==========================================================================
     Toast System
     ========================================================================== */
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    } else {
      iconSvg = `<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      toast.addEventListener('animationend', () => toast.remove());
    }, 3500);
  }

  /* ==========================================================================
     Button Loading State Utility
     ========================================================================== */
  function setButtonLoading(btn, isLoading, defaultText = 'Submit') {
    const btnText = btn.querySelector('.btn-text');
    const spinner = btn.querySelector('.spinner');

    if (isLoading) {
      btn.disabled = true;
      if (btnText) btnText.textContent = 'Processing...';
      if (spinner) spinner.classList.remove('hidden');
    } else {
      btn.disabled = false;
      if (btnText) btnText.textContent = defaultText;
      if (spinner) spinner.classList.add('hidden');
    }
  }

  /* ==========================================================================
     Login Submission Handling
     ========================================================================== */
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail');
    const emailError = document.getElementById('loginEmailError');
    const password = document.getElementById('loginPassword');
    const passwordError = document.getElementById('loginPasswordError');

    let isValid = true;

    if (!email.value.trim()) {
      showError(email, emailError, 'Email address is required.');
      isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
      showError(email, emailError, 'Please enter a valid email address.');
      isValid = false;
    } else {
      clearError(email, emailError);
    }

    if (!password.value) {
      showError(password, passwordError, 'Password is required.');
      isValid = false;
    } else if (password.value.length < 6) {
      showError(password, passwordError, 'Password must be at least 6 characters.');
      isValid = false;
    } else {
      clearError(password, passwordError);
    }

    if (!isValid) return;

    // Simulate authentication call
    setButtonLoading(loginSubmitBtn, true);

    setTimeout(() => {
      setButtonLoading(loginSubmitBtn, false, 'Sign In');
      showToast(`Welcome back, ${email.value.trim().split('@')[0]}!`, 'success');
      loginForm.reset();
    }, 1200);
  });

  /* ==========================================================================
     Sign Up Submission Handling
     ========================================================================== */
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('signupName');
    const nameError = document.getElementById('signupNameError');
    const email = document.getElementById('signupEmail');
    const emailError = document.getElementById('signupEmailError');
    const password = document.getElementById('signupPassword');
    const passwordError = document.getElementById('signupPasswordError');
    const terms = document.getElementById('termsAgreement');
    const termsError = document.getElementById('termsError');

    let isValid = true;

    if (!name.value.trim()) {
      showError(name, nameError, 'Full name is required.');
      isValid = false;
    } else {
      clearError(name, nameError);
    }

    if (!email.value.trim()) {
      showError(email, emailError, 'Email address is required.');
      isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
      showError(email, emailError, 'Please enter a valid email address.');
      isValid = false;
    } else {
      clearError(email, emailError);
    }

    const strength = evaluatePasswordStrength(password.value);
    if (!password.value) {
      showError(password, passwordError, 'Password is required.');
      isValid = false;
    } else if (password.value.length < 8) {
      showError(password, passwordError, 'Password must be at least 8 characters.');
      isValid = false;
    } else if (strength.score < 2) {
      showError(password, passwordError, 'Please choose a stronger password.');
      isValid = false;
    } else {
      clearError(password, passwordError);
    }

    if (!terms.checked) {
      termsError.textContent = 'You must accept the terms and conditions.';
      isValid = false;
    } else {
      termsError.textContent = '';
    }

    if (!isValid) return;

    // Simulate account registration
    setButtonLoading(signupSubmitBtn, true);

    setTimeout(() => {
      setButtonLoading(signupSubmitBtn, false, 'Create Account');
      showToast('Account created successfully! Switching to sign in...', 'success');
      signupForm.reset();
      updateStrengthUI({ score: 0, text: 'Must contain at least 8 characters' });
      setTimeout(() => switchTab('login'), 800);
    }, 1400);
  });

  /* ==========================================================================
     Forgot Password Modal
     ========================================================================== */
  function openModal() {
    forgotModal.classList.remove('hidden');
    document.getElementById('forgotEmail').focus();
  }

  function closeModal() {
    forgotModal.classList.add('hidden');
    forgotForm.reset();
    clearError(document.getElementById('forgotEmail'), document.getElementById('forgotEmailError'));
  }

  openForgotModal.addEventListener('click', openModal);
  closeForgotModal.addEventListener('click', closeModal);

  forgotModal.addEventListener('click', (e) => {
    if (e.target === forgotModal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !forgotModal.classList.contains('hidden')) {
      closeModal();
    }
  });

  forgotForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('forgotEmail');
    const errorEl = document.getElementById('forgotEmailError');

    if (!email.value.trim() || !isValidEmail(email.value.trim())) {
      showError(email, errorEl, 'Please enter a valid email address.');
      return;
    }

    clearError(email, errorEl);
    setButtonLoading(forgotSubmitBtn, true);

    setTimeout(() => {
      setButtonLoading(forgotSubmitBtn, false, 'Send Reset Link');
      closeModal();
      showToast('Reset instructions sent to your email!', 'success');
    }, 1100);
  });

  /* ==========================================================================
     Social Logins Simulation
     ========================================================================== */
  ['googleLogin', 'githubLogin', 'appleLogin'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', () => {
        const provider = btn.getAttribute('title');
        showToast(`Connecting with ${provider}...`, 'info');
      });
    }
  });

  /* ==========================================================================
     Dynamic Card Mouse Glow
     ========================================================================== */
  if (authCard && cardGlow) {
    authCard.addEventListener('mousemove', (e) => {
      const rect = authCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      cardGlow.style.left = `${x - 125}px`;
      cardGlow.style.top = `${y - 125}px`;
    });
  }
});
