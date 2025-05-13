document.addEventListener('DOMContentLoaded', function() {
  var user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  var enrolled = user.enrolledCourses || [];
  var main = document.querySelector('.main-content');
  var listDiv = document.createElement('div');
  listDiv.className = 'assignments-list';
  var allAssignments = [];
  enrolled.forEach(cid => {
    var course = (JSON.parse(localStorage.getItem('courses') || '[]').find(c => c.id == cid) || { title: 'Course' });
    var assigns = JSON.parse(localStorage.getItem(`assignments_${cid}`) || '[]');
    var subs = JSON.parse(localStorage.getItem(`submissions_${cid}_${user.email}`) || '{}');
    assigns.forEach(a => {
      allAssignments.push({
        course: course.title,
        courseId: cid,
        id: a.id,
        title: a.title,
        type: a.type,
        submitted: !!subs[a.id],
        due: a.due || ''
      });
    });
  });
  if (allAssignments.length === 0) {
    listDiv.innerHTML = '<div style="color:#A0A4B8;">No assignments found.</div>';
  } else {
    listDiv.innerHTML = '<table class="assignments-table"><thead><tr><th data-i18n="Course">Course</th><th data-i18n="Title">Title</th><th data-i18n="Type">Type</th><th data-i18n="Status">Status</th><th data-i18n="Due">Due</th><th></th></tr></thead><tbody>' +
      allAssignments.map(a => `<tr><td>${a.course}</td><td>${a.title}</td><td>${a.type}</td><td>${a.submitted ? '<span style=\"color:#43E97B;\">Submitted</span>' : '<span style=\"color:#FF4C60;\">Not Submitted</span>'}</td><td>${a.due}</td><td><a href="course-detail.html?id=${a.courseId}" class="btn-primary" style="padding:0.3rem 1rem;">${a.submitted ? 'View' : 'Submit'}</a></td></tr>`).join('') + '</tbody></table>';
  }
  main.appendChild(listDiv);
}); 