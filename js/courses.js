// --- Courses Data (placeholder, can be replaced with real data) ---
const defaultCourses = [
  {
    id: 1,
    title: 'JavaScript for Beginners',
    category: 'Programming',
    desc: 'Learn the basics of JavaScript, the language of the web.',
    img: '../assets/course-js.png',
  },
  {
    id: 2,
    title: 'Algebra Essentials',
    category: 'Math',
    desc: 'Master the fundamentals of algebra and equations.',
    img: '../assets/course-math.png',
  },
  {
    id: 3,
    title: 'Introduction to Biology',
    category: 'Science',
    desc: 'Explore the building blocks of life and living organisms.',
    img: '../assets/course-bio.png',
  },
  {
    id: 4,
    title: 'Business Communication',
    category: 'Business',
    desc: 'Develop effective communication skills for the workplace.',
    img: '../assets/course-biz.png',
  },
  {
    id: 5,
    title: 'English Grammar Basics',
    category: 'Languages',
    desc: 'Improve your English grammar for better writing and speaking.',
    img: '../assets/course-eng.png',
  },
];

// Save default courses if not present
if (!localStorage.getItem('courses')) {
  localStorage.setItem('courses', JSON.stringify(defaultCourses));
}

function getCourses() {
  return JSON.parse(localStorage.getItem('courses'));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}

function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

function renderCourses() {
  const courses = getCourses();
  const user = getCurrentUser();
  const search = document.getElementById('course-search').value.toLowerCase();
  const category = document.getElementById('course-category-filter').value;
  const grid = document.getElementById('courses-grid');
  grid.innerHTML = '';
  courses
    .filter(c =>
      (!search || c.title.toLowerCase().includes(search)) &&
      (!category || c.category === category)
    )
    .forEach(course => {
      const enrolled = (user.enrolledCourses || []).includes(course.id);
      const card = document.createElement('div');
      card.className = 'course-card';
      card.innerHTML = `
        <img src="${course.img}" alt="${course.title}">
        <div class="course-category">${course.category}</div>
        <div class="course-title">${course.title}</div>
        <div class="course-desc">${course.desc}</div>
        <button class="btn-enroll${enrolled ? ' enrolled' : ''}" data-id="${course.id}" ${enrolled ? 'disabled' : ''}>
          ${enrolled ? 'Enrolled' : 'Enroll'}
        </button>
      `;
      grid.appendChild(card);
    });
  // Add enroll event listeners
  document.querySelectorAll('.btn-enroll').forEach(btn => {
    btn.addEventListener('click', function() {
      const courseId = parseInt(this.getAttribute('data-id'));
      enrollInCourse(courseId);
    });
  });
}

function enrollInCourse(courseId) {
  const user = getCurrentUser();
  if (!user.enrolledCourses) user.enrolledCourses = [];
  if (!user.enrolledCourses.includes(courseId)) {
    user.enrolledCourses.push(courseId);
    setCurrentUser(user);
    renderCourses();
    alert('Enrolled successfully!');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('course-search').addEventListener('input', renderCourses);
  document.getElementById('course-category-filter').addEventListener('change', renderCourses);
  renderCourses();
}); 