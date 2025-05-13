document.addEventListener('DOMContentLoaded', function() {
  if (!window.Chart) return;
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const enrolled = user.enrolledCourses || [];
  // --- Dynamic Progress Over Time ---
  // Gather all submission dates
  let allDates = [];
  enrolled.forEach(cid => {
    const assignments = JSON.parse(localStorage.getItem(`assignments_${cid}`) || '[]');
    const subs = JSON.parse(localStorage.getItem(`submissions_${cid}_${user.email}`) || '{}');
    Object.values(subs).forEach(sub => {
      if (sub.submitted) allDates.push(new Date(sub.submitted));
    });
  });
  // Group by week (last 6 weeks)
  let weeks = [];
  let now = new Date();
  for (let i = 5; i >= 0; i--) {
    let start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - i * 7);
    let end = new Date(start); end.setDate(start.getDate() + 7);
    weeks.push({ label: `${start.getMonth()+1}/${start.getDate()}`, start, end });
  }
  let progressData = weeks.map(w => allDates.filter(d => d >= w.start && d < w.end).length);
  let progressLabels = weeks.map(w => w.label);
  // Cumulative progress
  let cumulative = 0;
  progressData = progressData.map(v => (cumulative += v));
  // --- Progress Chart ---
  const ctx1 = document.getElementById('progressChart');
  if (ctx1) {
    new Chart(ctx1, {
      type: 'line',
      data: {
        labels: progressLabels,
        datasets: [{
          label: 'Progress %',
          data: progressData.map(v => Math.round(100 * v / Math.max(1, progressData[progressData.length-1]))),
          borderColor: '#4F8CFF',
          backgroundColor: 'rgba(79,140,255,0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { min: 0, max: 100, ticks: { color: '#A0A4B8' } }, x: { ticks: { color: '#A0A4B8' } } },
        responsive: true,
      }
    });
  }
  // --- Activity Heatmap ---
  let weekdayCounts = [0,0,0,0,0,0,0];
  allDates.forEach(d => { weekdayCounts[d.getDay()]++; });
  const ctx3 = document.createElement('canvas');
  ctx3.id = 'heatmapChart';
  ctx3.width = 350; ctx3.height = 120;
  document.querySelector('.analytics-charts')?.appendChild(ctx3);
  new Chart(ctx3, {
    type: 'bar',
    data: {
      labels: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
      datasets: [{
        label: 'Activity',
        data: weekdayCounts,
        backgroundColor: '#FFB547',
        borderRadius: 8
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { color: '#A0A4B8' } }, x: { ticks: { color: '#A0A4B8' } } },
      responsive: true,
    }
  });
  // --- Completion Breakdown (Pie) ---
  let assignmentsCompleted = 0, quizzesCompleted = 0, totalAssignments = 0, totalQuizzes = 0;
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
  const ctx2 = document.getElementById('completionChart');
  if (ctx2) {
    new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: ['Assignments', 'Quizzes', 'Remaining'],
        datasets: [{
          data: [assignmentsCompleted, quizzesCompleted, (totalAssignments + totalQuizzes) - (assignmentsCompleted + quizzesCompleted)],
          backgroundColor: ['#43E97B', '#4F8CFF', '#23272F'],
          borderWidth: 0
        }]
      },
      options: {
        plugins: { legend: { labels: { color: '#A0A4B8' } } },
        cutout: '70%',
        responsive: true,
      }
    });
  }
  // --- Recent Activity Feed ---
  let activityFeed = [];
  enrolled.forEach(cid => {
    const assignments = JSON.parse(localStorage.getItem(`assignments_${cid}`) || '[]');
    const subs = JSON.parse(localStorage.getItem(`submissions_${cid}_${user.email}`) || '{}');
    Object.entries(subs).forEach(([aid, sub]) => {
      const a = assignments.find(x => x.id == aid);
      if (a && sub.submitted) {
        activityFeed.push({
          type: a.type,
          title: a.title,
          date: new Date(sub.submitted)
        });
      }
    });
  });
  activityFeed.sort((a,b) => b.date - a.date);
  const feedDiv = document.createElement('div');
  feedDiv.className = 'analytics-feed';
  feedDiv.innerHTML = '<h3>Recent Activity</h3>' + (activityFeed.length ? '<ul>' + activityFeed.slice(0,7).map(f => `<li>${f.type === 'assignment' ? '📝' : '🧩'} <strong>${f.title}</strong> <span style="color:#A0A4B8;">${f.date.toLocaleString()}</span></li>`).join('') + '</ul>' : '<div style="color:#A0A4B8;">No recent activity.</div>');
  document.querySelector('.analytics-charts')?.appendChild(feedDiv);
  // --- Leaderboard (compare with class average) ---
  let allUsers = [];
  for (let key in localStorage) {
    if (key.startsWith('submissions_')) {
      const email = key.split('_').slice(2).join('_');
      if (!allUsers.includes(email)) allUsers.push(email);
    }
  }
  let userTotal = assignmentsCompleted + quizzesCompleted;
  let classTotal = 0;
  allUsers.forEach(email => {
    let uTotal = 0;
    enrolled.forEach(cid => {
      const assignments = JSON.parse(localStorage.getItem(`assignments_${cid}`) || '[]');
      const subs = JSON.parse(localStorage.getItem(`submissions_${cid}_${email}`) || '{}');
      Object.keys(subs).forEach(aid => { uTotal++; });
    });
    classTotal += uTotal;
  });
  let classAvg = allUsers.length ? Math.round(classTotal / allUsers.length) : 0;
  const leaderboardDiv = document.createElement('div');
  leaderboardDiv.className = 'analytics-leaderboard';
  leaderboardDiv.innerHTML = `<h3>Leaderboard</h3><div style="margin-top:0.7rem;">You: <strong>${userTotal}</strong> | Class Avg: <strong>${classAvg}</strong></div>`;
  document.querySelector('.analytics-charts')?.appendChild(leaderboardDiv);
}); 