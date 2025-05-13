document.addEventListener('DOMContentLoaded', function() {
  var adminStats = document.createElement('div');
  adminStats.className = 'admin-analytics';
  var users = [];
  for (var key in localStorage) {
    if (key.startsWith('users')) {
      users = JSON.parse(localStorage.getItem(key) || '[]');
      break;
    }
  }
  var courses = JSON.parse(localStorage.getItem('courses') || '[]');
  var totalAssignments = 0, totalQuizzes = 0, totalSubs = 0;
  courses.forEach(c => {
    var assigns = JSON.parse(localStorage.getItem(`assignments_${c.id}`) || '[]');
    assigns.forEach(a => {
      if (a.type === 'assignment') totalAssignments++;
      if (a.type === 'quiz') totalQuizzes++;
    });
  });
  for (var key in localStorage) {
    if (key.startsWith('submissions_')) {
      var subs = JSON.parse(localStorage.getItem(key) || '{}');
      totalSubs += Object.keys(subs).length;
    }
  }
  adminStats.innerHTML = `
    <h2 data-i18n="Admin Analytics">Admin Analytics</h2>
    <div class="analytics-cards">
      <div class="analytics-card"><span class="analytics-label" data-i18n="Total Users">Total Users</span><span class="analytics-value">${users.length}</span></div>
      <div class="analytics-card"><span class="analytics-label" data-i18n="Total Courses">Total Courses</span><span class="analytics-value">${courses.length}</span></div>
      <div class="analytics-card"><span class="analytics-label" data-i18n="Total Assignments">Total Assignments</span><span class="analytics-value">${totalAssignments}</span></div>
      <div class="analytics-card"><span class="analytics-label" data-i18n="Total Quizzes">Total Quizzes</span><span class="analytics-value">${totalQuizzes}</span></div>
      <div class="analytics-card"><span class="analytics-label" data-i18n="Total Submissions">Total Submissions</span><span class="analytics-value">${totalSubs}</span></div>
    </div>
  `;
  var main = document.querySelector('.main-content');
  if (main) main.prepend(adminStats);
}); 