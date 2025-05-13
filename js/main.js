// Theme toggle logic
function setTheme(theme) {
  document.body.classList.toggle('light', theme === 'light');
  localStorage.setItem('theme', theme);
}

function toggleTheme() {
  const current = localStorage.getItem('theme') === 'light' ? 'dark' : 'light';
  setTheme(current);
}

function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  setTheme(saved);
}

document.addEventListener('DOMContentLoaded', initTheme);

// --- AUTH LOGIC ---

// Helper: Get/set current user
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}
function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}
function logoutUser() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

// Register logic
if (document.getElementById('register-form')) {
  const regForm = document.getElementById('register-form');
  const avatarInput = document.getElementById('avatar-input');
  const avatarPreview = document.getElementById('avatar-preview');
  let avatarData = '';

  avatarInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        avatarPreview.src = evt.target.result;
        avatarData = evt.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  regForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const password = document.getElementById('reg-password').value;
    if (!name || !email || password.length < 6) {
      alert('Please fill all fields and use a strong password.');
      return;
    }
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
      alert('Email already registered.');
      return;
    }
    const user = { name, email, password, avatar: avatarData || '../assets/user-placeholder.png' };
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    setCurrentUser(user);
    window.location.href = 'index.html';
  });
}

// Login logic
if (document.getElementById('login-form')) {
  const loginForm = document.getElementById('login-form');
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      alert('Invalid email or password.');
      return;
    }
    setCurrentUser(user);
    window.location.href = 'index.html';
  });
}

// Update header with user info
function updateHeaderProfile() {
  const user = getCurrentUser();
  const avatar = document.querySelector('.profile-header .avatar');
  const name = document.querySelector('.profile-header .profile-name');
  if (user && avatar && name) {
    avatar.src = user.avatar || '../assets/user-placeholder.png';
    name.textContent = user.name;
  }
}

// Profile dropdown and logout
if (document.querySelector('.profile-header')) {
  updateHeaderProfile();
  // Add dropdown and logout (optional: can be expanded later)
  document.querySelector('.profile-header').addEventListener('click', function() {
    if (confirm('Logout?')) logoutUser();
  });
}

// Redirect to login if not authenticated (except on login/register)
const authPages = ['login.html', 'register.html'];
if (!authPages.some(p => window.location.pathname.endsWith(p))) {
  if (!getCurrentUser()) {
    window.location.href = 'login.html';
  }
} 

// ... existing code ...
// --- PROFILE PAGE LOGIC ---
if (document.getElementById('profile-form')) {
  const form = document.getElementById('profile-form');
  const avatarInput = document.getElementById('profile-avatar-input');
  const avatarPreview = document.getElementById('profile-avatar-preview');
  const nameInput = document.getElementById('profile-name');
  const emailInput = document.getElementById('profile-email');
  const passwordInput = document.getElementById('profile-password');
  const logoutBtn = document.getElementById('logout-btn');
  let avatarData = '';

  // Load current user data
  const user = getCurrentUser();
  if (user) {
    avatarPreview.src = user.avatar || '../assets/user-placeholder.png';
    nameInput.value = user.name;
    emailInput.value = user.email;
    passwordInput.value = user.password;
    avatarData = user.avatar;
  }

  avatarInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        avatarPreview.src = evt.target.result;
        avatarData = evt.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    if (!name || !email || password.length < 6) {
      alert('Please fill all fields and use a strong password.');
      return;
    }
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    // Check for email conflict (if changed)
    if (email !== user.email && users.find(u => u.email === email)) {
      alert('Email already registered.');
      return;
    }
    // Update user in users array
    users = users.map(u =>
      u.email === user.email ? { ...u, name, email, password, avatar: avatarData } : u
    );
    localStorage.setItem('users', JSON.stringify(users));
    const updatedUser = { name, email, password, avatar: avatarData };
    setCurrentUser(updatedUser);
    updateHeaderProfile();
    alert('Profile updated!');
    window.location.reload();
  });

  logoutBtn.addEventListener('click', function() {
    logoutUser();
  });
}

// --- Multi-language Support ---
const translations = {
  en: {
    'Welcome to EduPlatform': 'Welcome to EduPlatform',
    'Your gateway to modern, interactive learning. Explore courses, track your progress, and connect with instructors and peers.': 'Your gateway to modern, interactive learning. Explore courses, track your progress, and connect with instructors and peers.',
    'Browse Courses': 'Browse Courses',
    'Login to EduPlatform': 'Login to EduPlatform',
    'Create Your Account': 'Create Your Account',
    'Full Name': 'Full Name',
    'Email': 'Email',
    'Password': 'Password',
    'Register': 'Register',
    'Login': 'Login',
    'Logout': 'Logout',
    'Already have an account?': 'Already have an account?',
    'Don\'t have an account?': 'Don\'t have an account?',
    'Your Profile': 'Your Profile',
    'Save Changes': 'Save Changes',
    'Dashboard': 'Dashboard',
    'Courses': 'Courses',
    'Assignments': 'Assignments',
    'Quizzes': 'Quizzes',
    'Live Chat': 'Live Chat',
    'Profile': 'Profile',
    'Admin': 'Admin',
    'Helpdesk': 'Helpdesk',
    'Home': 'Home',
    'Go to Courses': 'Go to Courses',
    'Go to Assignments': 'Go to Assignments',
    'Go to Quizzes': 'Go to Quizzes',
    'View Progress': 'View Progress',
    'English': 'English',
    'العربية': 'Arabic',
    // ... add more as needed ...
  },
  ar: {
    'Welcome to EduPlatform': 'مرحبًا بك في منصة EduPlatform',
    'Your gateway to modern, interactive learning. Explore courses, track your progress, and connect with instructors and peers.': 'بوابتك للتعلم الحديث والتفاعلي. استكشف الدورات، وتتبع تقدمك، وتواصل مع المعلمين والزملاء.',
    'Browse Courses': 'تصفح الدورات',
    'Login to EduPlatform': 'تسجيل الدخول إلى EduPlatform',
    'Create Your Account': 'إنشاء حسابك',
    'Full Name': 'الاسم الكامل',
    'Email': 'البريد الإلكتروني',
    'Password': 'كلمة المرور',
    'Register': 'تسجيل',
    'Login': 'دخول',
    'Logout': 'خروج',
    'Already have an account?': 'لديك حساب بالفعل؟',
    'Don\'t have an account?': 'ليس لديك حساب؟',
    'Your Profile': 'ملفك الشخصي',
    'Save Changes': 'حفظ التغييرات',
    'Dashboard': 'لوحة التحكم',
    'Courses': 'الدورات',
    'Assignments': 'الواجبات',
    'Quizzes': 'الاختبارات',
    'Live Chat': 'الدردشة المباشرة',
    'Profile': 'الملف الشخصي',
    'Admin': 'الإدارة',
    'Helpdesk': 'الدعم',
    'Home': 'الرئيسية',
    'Go to Courses': 'اذهب إلى الدورات',
    'Go to Assignments': 'اذهب إلى الواجبات',
    'Go to Quizzes': 'اذهب إلى الاختبارات',
    'View Progress': 'عرض التقدم',
    'English': 'الإنجليزية',
    'العربية': 'العربية',
    // ... add more as needed ...
  }
};
function getLang() {
  return localStorage.getItem('lang') || 'en';
}
function setLang(lang) {
  localStorage.setItem('lang', lang);
  updateLangUI();
}
function t(str) {
  const lang = getLang();
  return translations[lang][str] || str;
}
function updateLangUI() {
  // Update static text content for known elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  // Update select value
  const sel = document.getElementById('lang-switcher');
  if (sel) sel.value = getLang();
}
// Attach to language switcher
const langSel = document.getElementById('lang-switcher');
if (langSel) {
  langSel.value = getLang();
  langSel.onchange = function() {
    setLang(this.value);
  };
}
document.addEventListener('DOMContentLoaded', updateLangUI);

// --- Dashboard Analytics Logic ---
function updateDashboardAnalytics() {
  if (!document.getElementById('analytics-courses')) return;
  const user = getCurrentUser();
  const courses = JSON.parse(localStorage.getItem('courses') || '[]');
  const enrolled = user.enrolledCourses || [];
  let assignmentsCompleted = 0;
  let quizzesCompleted = 0;
  let totalAssignments = 0;
  let totalQuizzes = 0;
  enrolled.forEach(cid => {
    const assignments = JSON.parse(localStorage.getItem(`assignments_${cid}`) || '[]');
    assignments.forEach(a => {
      if (a.type === 'assignment') totalAssignments++;
      if (a.type === 'quiz') totalQuizzes++;
      const subs = JSON.parse(localStorage.getItem(`submissions_${cid}_${user.email}`) || '{}');
      if (subs[a.id]) {
        if (a.type === 'assignment') assignmentsCompleted++;
        if (a.type === 'quiz') quizzesCompleted++;
      }
    });
  });
  const progress = (totalAssignments + totalQuizzes) > 0 ? Math.round(100 * (assignmentsCompleted + quizzesCompleted) / (totalAssignments + totalQuizzes)) : 0;
  document.getElementById('analytics-courses').textContent = enrolled.length;
  document.getElementById('analytics-assignments').textContent = assignmentsCompleted;
  document.getElementById('analytics-quizzes').textContent = quizzesCompleted;
  document.getElementById('analytics-progress').style.width = progress + '%';
  document.getElementById('analytics-progress-label').textContent = progress + '%';
}
document.addEventListener('DOMContentLoaded', updateDashboardAnalytics);
