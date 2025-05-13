// --- Course Detail Logic ---
function getQueryParam(param) {
  const url = new URL(window.location.href);
  return url.searchParams.get(param);
}

function getCourses() {
  return JSON.parse(localStorage.getItem('courses'));
}
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}

const courseId = parseInt(getQueryParam('id'));
const courses = getCourses();
const course = courses.find(c => c.id === courseId) || courses[0];

// --- Render Header ---
function renderHeader() {
  const header = document.getElementById('course-detail-header');
  header.innerHTML = `
    <img src="${course.img}" alt="${course.title}">
    <div class="course-info">
      <div class="course-title">${course.title}</div>
      <div class="course-category">${course.category}</div>
      <div class="course-desc">${course.desc}</div>
    </div>
  `;
}

// --- Render Syllabus ---
const defaultSyllabus = [
  'Introduction & Overview',
  'Core Concepts',
  'Practical Examples',
  'Assignments & Quizzes',
  'Final Project',
];
function renderSyllabus() {
  const ul = document.getElementById('course-syllabus');
  ul.innerHTML = '';
  defaultSyllabus.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    ul.appendChild(li);
  });
}

// --- Render Video ---
function renderVideo() {
  document.getElementById('course-video').src = '../assets/video-placeholder.mp4';
}

// --- Render Notes ---
function renderNotes() {
  const notes = document.getElementById('course-notes');
  notes.href = '../assets/notes-placeholder.pdf';
  notes.textContent = 'Download Notes';
}

// --- Assignments/Quizzes Data (per course) ---
const defaultAssignments = [
  {
    id: 1,
    title: 'Assignment 1: Basic Concepts',
    type: 'assignment',
    desc: 'Write a summary of the core concepts covered in week 1.',
    status: 'open',
  },
  {
    id: 2,
    title: 'Quiz 1: Fundamentals',
    type: 'quiz',
    desc: 'Answer the following questions about the fundamentals.',
    status: 'open',
    questions: [
      { q: 'What is JavaScript?', a: '' },
      { q: 'Name a JavaScript data type.', a: '' },
    ],
  },
  {
    id: 3,
    title: 'Assignment 2: Practical Task',
    type: 'assignment',
    desc: 'Build a simple calculator using JavaScript.',
    status: 'open',
  },
  {
    id: 4,
    title: 'Quiz 2: Advanced Topics',
    type: 'quiz',
    desc: 'Test your knowledge on advanced topics.',
    status: 'open',
    questions: [
      { q: 'Explain closures in JavaScript.', a: '' },
      { q: 'What is an event loop?', a: '' },
    ],
  },
];
function getAssignments() {
  return JSON.parse(localStorage.getItem(`assignments_${courseId}`)) || defaultAssignments;
}
function setAssignments(list) {
  localStorage.setItem(`assignments_${courseId}`,'['+list.map(a=>JSON.stringify(a)).join(',')+']');
}
function getUserSubmissions() {
  const user = getCurrentUser();
  return JSON.parse(localStorage.getItem(`submissions_${courseId}_${user.email}`) || '{}');
}
function setUserSubmissions(subs) {
  const user = getCurrentUser();
  localStorage.setItem(`submissions_${courseId}_${user.email}`, JSON.stringify(subs));
}
function renderAssignments() {
  const ul = document.getElementById('course-assignments');
  ul.innerHTML = '';
  const assignments = getAssignments();
  const submissions = getUserSubmissions();
  assignments.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${item.title}</strong> <span style="color:var(--color-secondary);font-size:0.95em;">[${item.type}]</span><br><span style="color:var(--color-text-muted);">${item.desc}</span>`;
    const btn = document.createElement('button');
    btn.className = 'btn-primary';
    btn.style.marginLeft = '1rem';
    if (submissions[item.id]) {
      btn.textContent = 'View Submission';
      btn.onclick = () => viewSubmission(item, submissions[item.id]);
    } else {
      btn.textContent = item.type === 'quiz' ? 'Solve Quiz' : 'Submit Assignment';
      btn.onclick = () => solveAssignment(item);
    }
    li.appendChild(btn);
    ul.appendChild(li);
  });
  renderAdminControls();
  renderSubmissionsForAdmin();
}
// --- Solve/Submit Modal ---
function solveAssignment(item) {
  let modal = document.getElementById('assignment-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'assignment-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.6)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';
    document.body.appendChild(modal);
  }
  let html = `<div style="background:var(--color-surface-dark);padding:2rem 2.5rem;border-radius:1.2rem;max-width:420px;width:100%;box-shadow:0 2px 16px rgba(0,0,0,0.18);color:var(--color-text-light);">
    <h2 style="color:var(--color-primary);margin-bottom:1rem;">${item.title}</h2>
    <div style="margin-bottom:1rem;">${item.desc}</div>`;
  if (item.type === 'assignment') {
    html += `<textarea id="assignment-answer" rows="5" style="width:100%;padding:0.7rem;border-radius:0.7rem;border:1px solid var(--color-surface-light);background:var(--color-bg-dark);color:var(--color-text-light);"></textarea>`;
  } else if (item.type === 'quiz') {
    item.questions.forEach((q, i) => {
      html += `<div style="margin-bottom:0.7rem;"><strong>Q${i+1}:</strong> ${q.q}<br><input type="text" id="quiz-q${i}" style="width:100%;padding:0.5rem;border-radius:0.5rem;border:1px solid var(--color-surface-light);background:var(--color-bg-dark);color:var(--color-text-light);"></div>`;
    });
  }
  html += `<div style="margin-top:1.2rem;display:flex;gap:1rem;justify-content:flex-end;"><button id="modal-cancel" class="btn-primary" style="background:var(--color-error);">Cancel</button><button id="modal-submit" class="btn-primary">Submit</button></div></div>`;
  modal.innerHTML = html;
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
  document.getElementById('modal-cancel').onclick = () => modal.remove();
  document.getElementById('modal-submit').onclick = () => {
    const submissions = getUserSubmissions();
    if (item.type === 'assignment') {
      const answer = document.getElementById('assignment-answer').value.trim();
      if (!answer) return alert('Please enter your answer.');
      submissions[item.id] = { type: 'assignment', answer, submitted: new Date().toISOString() };
    } else if (item.type === 'quiz') {
      const answers = item.questions.map((q, i) => document.getElementById('quiz-q'+i).value.trim());
      if (answers.some(a => !a)) return alert('Please answer all questions.');
      // Auto-grade
      let score = null;
      if (item.questions.every(q => q.correct)) {
        let correctCount = 0;
        answers.forEach((a, i) => {
          if (a.toLowerCase() === (item.questions[i].correct||'').toLowerCase()) correctCount++;
        });
        score = `${correctCount} / ${answers.length}`;
      }
      submissions[item.id] = { type: 'quiz', answers, submitted: new Date().toISOString(), score };
    }
    setUserSubmissions(submissions);
    modal.remove();
    renderAssignments();
    alert('Submitted successfully!');
  };
}
function viewSubmission(item, submission) {
  let modal = document.getElementById('assignment-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'assignment-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.6)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';
    document.body.appendChild(modal);
  }
  let html = `<div style="background:var(--color-surface-dark);padding:2rem 2.5rem;border-radius:1.2rem;max-width:420px;width:100%;box-shadow:0 2px 16px rgba(0,0,0,0.18);color:var(--color-text-light);">
    <h2 style="color:var(--color-primary);margin-bottom:1rem;">${item.title}</h2>
    <div style="margin-bottom:1rem;">${item.desc}</div>`;
  if (submission.type === 'assignment') {
    html += `<div><strong>Your Answer:</strong><br><div style="background:var(--color-bg-dark);padding:0.7rem;border-radius:0.7rem;margin-top:0.5rem;">${submission.answer}</div></div>`;
  } else if (submission.type === 'quiz') {
    item.questions.forEach((q, i) => {
      html += `<div style="margin-bottom:0.7rem;"><strong>Q${i+1}:</strong> ${q.q}<br><strong>Your Answer:</strong> <span style="color:var(--color-secondary);">${submission.answers[i]}</span>`;
      if (q.correct) {
        const isCorrect = submission.answers[i].toLowerCase() === q.correct.toLowerCase();
        html += ` <span style="margin-left:0.5rem;color:${isCorrect ? 'var(--color-success)' : 'var(--color-error)'};font-weight:600;">${isCorrect ? '✔' : '✘'}</span> <span style="color:var(--color-text-muted);font-size:0.95em;">(Correct: ${q.correct})</span>`;
      }
      html += `</div>`;
    });
    if (submission.score) {
      html += `<div style="margin-top:1rem;font-size:1.1em;color:var(--color-primary);font-weight:700;">Score: ${submission.score}</div>`;
    }
  }
  // Show feedback if exists
  const user = getCurrentUser();
  const feedbackKey = `feedback_${courseId}_${user.email}_${item.id}`;
  const feedback = localStorage.getItem(feedbackKey);
  if (feedback) {
    html += `<div style=\"margin-top:1.2rem;padding:0.7rem;background:var(--color-success);color:#fff;border-radius:0.7rem;\"><strong>Teacher Feedback:</strong><br>${feedback}</div>`;
  }
  html += `<div style="margin-top:1.2rem;display:flex;gap:1rem;justify-content:flex-end;"><button id="modal-close" class="btn-primary">Close</button></div></div>`;
  modal.innerHTML = html;
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
  document.getElementById('modal-close').onclick = () => modal.remove();
}

// --- Discussion (per course) ---
function getDiscussion() {
  return JSON.parse(localStorage.getItem(`discussion_${courseId}`) || '[]');
}
function setDiscussion(comments) {
  localStorage.setItem(`discussion_${courseId}`,'['+comments.map(c=>JSON.stringify(c)).join(',')+']');
}
function renderDiscussion() {
  const box = document.getElementById('course-discussion');
  box.innerHTML = '';
  getDiscussion().forEach(c => {
    const div = document.createElement('div');
    div.className = 'comment';
    div.textContent = `${c.user}: ${c.text}`;
    box.appendChild(div);
  });
}
document.getElementById('discussion-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const input = document.getElementById('discussion-input');
  const user = getCurrentUser();
  const comments = getDiscussion();
  comments.push({ user: user.name, text: input.value });
  setDiscussion(comments);
  input.value = '';
  renderDiscussion();
});

// --- Live Chat (per course, per user) ---
function getLiveChat() {
  return JSON.parse(localStorage.getItem(`livechat_${courseId}`) || '[]');
}
function setLiveChat(msgs) {
  localStorage.setItem(`livechat_${courseId}`,'['+msgs.map(m=>JSON.stringify(m)).join(',')+']');
}
function renderLiveChat() {
  const box = document.getElementById('live-chat');
  box.innerHTML = '';
  getLiveChat().forEach(m => {
    const div = document.createElement('div');
    div.className = 'chat-msg';
    div.textContent = `${m.user}: ${m.text}`;
    box.appendChild(div);
  });
}
document.getElementById('chat-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const input = document.getElementById('chat-input');
  const user = getCurrentUser();
  const msgs = getLiveChat();
  msgs.push({ user: user.name, text: input.value });
  setLiveChat(msgs);
  input.value = '';
  renderLiveChat();
});

// --- Advanced AI Assistant (context-aware, multi-language, session memory) ---
var aiSessionContext = [];
function aiSmartResponse(input, lang, context) {
  aiSessionContext.push({ role: 'user', text: input });
  // Use last 3 exchanges for context (simple demo)
  let lastUser = aiSessionContext.filter(m => m.role === 'user').slice(-3).map(m => m.text).join(' | ');
  let lastAI = aiSessionContext.filter(m => m.role === 'ai').slice(-3).map(m => m.text).join(' | ');
  const lower = input.toLowerCase();
  // English responses
  if (lang === 'en') {
    if (lower.includes('hello') || lower.includes('hi')) return 'Hello! How can I help you with your course today?';
    if (lower.includes('assignment')) return 'For assignments, read the instructions carefully and break the task into smaller steps. Need help with a specific question?';
    if (lower.includes('quiz')) return 'For quizzes, review your notes and try to recall key concepts. I can help explain any topic!';
    if (lower.includes('study tip')) return 'Study Tip: Take regular breaks and test yourself after each study session.';
    if (lower.includes('progress')) return 'You can track your progress on the dashboard. Keep going!';
    if (lower.includes('thank')) return 'You're welcome! If you have more questions, just ask.';
    if (lower.includes('how to') || lower.includes('explain')) return 'Sure! Please specify the topic or question you want explained.';
    if (lastUser && lower.includes('again')) return 'You recently asked: ' + lastUser;
    if (lastAI && lower.includes('repeat')) return 'Previously, I said: ' + lastAI;
    return 'I am your AI assistant. Ask me anything about your course, assignments, or study tips!';
  }
  // Arabic responses
  if (lang === 'ar') {
    if (lower.includes('مرحبا') || lower.includes('اهلا') || lower.includes('السلام')) return 'مرحبًا! كيف يمكنني مساعدتك في دورتك اليوم؟';
    if (lower.includes('واجب') || lower.includes('مهمة')) return 'بالنسبة للواجبات، اقرأ التعليمات بعناية وقسم المهمة إلى خطوات صغيرة. هل تحتاج مساعدة في سؤال معين؟';
    if (lower.includes('اختبار') || lower.includes('كويز')) return 'للاختبارات، راجع ملاحظاتك وحاول تذكر المفاهيم الأساسية. يمكنني شرح أي موضوع!';
    if (lower.includes('نصيحة') || lower.includes('دراسة')) return 'نصيحة دراسية: خذ فترات راحة منتظمة واختبر نفسك بعد كل جلسة دراسة.';
    if (lower.includes('تقدم')) return 'يمكنك تتبع تقدمك من خلال لوحة التحكم. استمر!';
    if (lower.includes('شكرا')) return 'على الرحب والسعة! إذا كان لديك المزيد من الأسئلة فقط اسأل.';
    if (lower.includes('كيف') || lower.includes('اشرح')) return 'بالطبع! يرجى تحديد الموضوع أو السؤال الذي تريد شرحه.';
    if (lastUser && lower.includes('مرة اخرى')) return 'لقد سألت مؤخرًا: ' + lastUser;
    if (lastAI && lower.includes('كرر')) return 'سابقًا قلت: ' + lastAI;
    return 'أنا مساعدك الذكي. اسألني عن أي شيء يخص دورتك أو واجباتك أو نصائح الدراسة!';
  }
  // Fallback
  return 'I am your AI assistant. Ask me anything about your course, assignments, or study tips!';
}
// Patch AI chat form to use smart response and remember AI replies
var aiForm = document.getElementById('ai-form');
if (aiForm) {
  aiForm.onsubmit = function(e) {
    e.preventDefault();
    var input = document.getElementById('ai-input');
    var msgs = getAIChat();
    var lang = localStorage.getItem('lang') || 'en';
    msgs.push({ role: 'user', text: input.value });
    var aiResponse = aiSmartResponse(input.value, lang, {});
    msgs.push({ role: 'ai', text: aiResponse });
    aiSessionContext.push({ role: 'ai', text: aiResponse });
    setAIChat(msgs);
    input.value = '';
    renderAIChat();
  };
}

// --- Admin/Teacher CRUD for Assignments/Quizzes ---
function isAdmin() {
  const user = getCurrentUser();
  return user && user.email === 'admin@edu.com';
}
function renderAdminControls() {
  if (!isAdmin()) return;
  const ul = document.getElementById('course-assignments');
  let addBtn = document.getElementById('add-assignment-btn');
  if (!addBtn) {
    addBtn = document.createElement('button');
    addBtn.id = 'add-assignment-btn';
    addBtn.className = 'btn-primary';
    addBtn.style.marginBottom = '1.2rem';
    addBtn.textContent = '+ Add Assignment/Quiz';
    ul.parentElement.insertBefore(addBtn, ul);
    addBtn.onclick = () => openAssignmentModal();
  }
  // Add edit/delete buttons to each assignment
  ul.querySelectorAll('li').forEach((li, idx) => {
    let editBtn = li.querySelector('.edit-btn');
    let delBtn = li.querySelector('.del-btn');
    if (!editBtn) {
      editBtn = document.createElement('button');
      editBtn.className = 'btn-primary edit-btn';
      editBtn.style.marginLeft = '0.5rem';
      editBtn.style.background = 'var(--color-secondary)';
      editBtn.textContent = 'Edit';
      li.appendChild(editBtn);
      editBtn.onclick = () => openAssignmentModal(getAssignments()[idx], idx);
    }
    if (!delBtn) {
      delBtn = document.createElement('button');
      delBtn.className = 'btn-primary del-btn';
      delBtn.style.marginLeft = '0.5rem';
      delBtn.style.background = 'var(--color-error)';
      delBtn.textContent = 'Delete';
      li.appendChild(delBtn);
      delBtn.onclick = () => {
        if (confirm('Delete this assignment/quiz?')) {
          const list = getAssignments();
          list.splice(idx, 1);
          setAssignments(list);
          renderAssignments();
          renderAdminControls();
        }
      };
    }
  });
}
function openAssignmentModal(editItem = null, editIdx = null) {
  let modal = document.getElementById('assignment-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'assignment-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.6)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';
    document.body.appendChild(modal);
  }
  let html = `<div style="background:var(--color-surface-dark);padding:2rem 2.5rem;border-radius:1.2rem;max-width:480px;width:100%;box-shadow:0 2px 16px rgba(0,0,0,0.18);color:var(--color-text-light);">
    <h2 style="color:var(--color-primary);margin-bottom:1rem;">${editItem ? 'Edit' : 'Add'} Assignment/Quiz</h2>
    <div style="margin-bottom:0.7rem;">
      <label>Title<br><input id="modal-title" type="text" style="width:100%;padding:0.5rem;border-radius:0.5rem;border:1px solid var(--color-surface-light);background:var(--color-bg-dark);color:var(--color-text-light;)"></label>
    </div>
    <div style="margin-bottom:0.7rem;">
      <label>Type<br><select id="modal-type" style="width:100%;padding:0.5rem;border-radius:0.5rem;border:1px solid var(--color-surface-light);background:var(--color-bg-dark);color:var(--color-text-light;)"><option value="assignment">Assignment</option><option value="quiz">Quiz</option></select></label>
    </div>
    <div style="margin-bottom:0.7rem;">
      <label>Description<br><textarea id="modal-desc" rows="2" style="width:100%;padding:0.5rem;border-radius:0.5rem;border:1px solid var(--color-surface-light);background:var(--color-bg-dark);color:var(--color-text-light;)"></textarea></label>
    </div>
    <div id="modal-questions-wrap" style="display:none;margin-bottom:0.7rem;">
      <label>Quiz Questions (one per line, use | to separate question and correct answer)<br><textarea id="modal-questions" rows="3" style="width:100%;padding:0.5rem;border-radius:0.5rem;border:1px solid var(--color-surface-light);background:var(--color-bg-dark);color:var(--color-text-light;)"></textarea></label>
      <div style="color:var(--color-text-muted);font-size:0.95em;margin-top:0.3rem;">Example: <br>What is 2+2?|4</div>
    </div>
    <div style="margin-top:1.2rem;display:flex;gap:1rem;justify-content:flex-end;"><button id="modal-cancel" class="btn-primary" style="background:var(--color-error);">Cancel</button><button id="modal-save" class="btn-primary">Save</button></div></div>`;
  modal.innerHTML = html;
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
  // Prefill if editing
  if (editItem) {
    document.getElementById('modal-title').value = editItem.title;
    document.getElementById('modal-type').value = editItem.type;
    document.getElementById('modal-desc').value = editItem.desc;
    if (editItem.type === 'quiz') {
      document.getElementById('modal-questions-wrap').style.display = '';
      document.getElementById('modal-questions').value = (editItem.questions||[]).map(q=>q.q + (q.correct ? '|' + q.correct : '')).join('\n');
    }
  }
  document.getElementById('modal-type').onchange = function() {
    document.getElementById('modal-questions-wrap').style.display = this.value === 'quiz' ? '' : 'none';
  };
  if (editItem && editItem.type === 'quiz') document.getElementById('modal-questions-wrap').style.display = '';
  document.getElementById('modal-cancel').onclick = () => modal.remove();
  document.getElementById('modal-save').onclick = () => {
    const title = document.getElementById('modal-title').value.trim();
    const type = document.getElementById('modal-type').value;
    const desc = document.getElementById('modal-desc').value.trim();
    let questions = [];
    if (type === 'quiz') {
      questions = document.getElementById('modal-questions').value.split('\n').map(q=>{
        const [question, correct] = q.split('|').map(x=>x.trim());
        return {q: question, a: '', correct: correct||''};
      }).filter(q=>q.q);
      if (!questions.length) return alert('Please enter at least one question.');
    }
    if (!title || !desc) return alert('Please fill all fields.');
    let list = getAssignments();
    if (editItem) {
      list[editIdx] = { ...editItem, title, type, desc, questions, status: 'open' };
    } else {
      const newId = Math.max(0, ...list.map(a=>a.id))+1;
      list.push({ id: newId, title, type, desc, questions, status: 'open' });
    }
    setAssignments(list);
    modal.remove();
    renderAssignments();
    renderAdminControls();
  };
}

// --- Teacher Feedback for Assignments/Quizzes ---
function renderSubmissionsForAdmin() {
  if (!isAdmin()) return;
  const ul = document.getElementById('course-assignments');
  let adminSubsBtn = document.getElementById('view-submissions-btn');
  if (!adminSubsBtn) {
    adminSubsBtn = document.createElement('button');
    adminSubsBtn.id = 'view-submissions-btn';
    adminSubsBtn.className = 'btn-primary';
    adminSubsBtn.style.marginBottom = '1.2rem';
    adminSubsBtn.style.marginLeft = '1rem';
    adminSubsBtn.textContent = 'View All Submissions';
    ul.parentElement.insertBefore(adminSubsBtn, ul.nextSibling);
    adminSubsBtn.onclick = openSubmissionsModal;
  }
}
function openSubmissionsModal() {
  let modal = document.getElementById('assignment-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'assignment-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.6)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';
    document.body.appendChild(modal);
  }
  // Gather all submissions for this course
  let html = `<div style="background:var(--color-surface-dark);padding:2rem 2.5rem;border-radius:1.2rem;max-width:600px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 2px 16px rgba(0,0,0,0.18);color:var(--color-text-light);">
    <h2 style="color:var(--color-primary);margin-bottom:1rem;">All Student Submissions</h2>`;
  const assignments = getAssignments();
  // Find all users who have submissions
  const allSubs = [];
  for (let key in localStorage) {
    if (key.startsWith(`submissions_${courseId}_`)) {
      const email = key.split('_').slice(2).join('_');
      const subs = JSON.parse(localStorage.getItem(key));
      allSubs.push({ email, subs });
    }
  }
  if (allSubs.length === 0) {
    html += '<div>No submissions yet.</div>';
  } else {
    allSubs.forEach(({ email, subs }) => {
      html += `<div style="margin-bottom:1.2rem;"><strong style="color:var(--color-secondary);">${email}</strong>`;
      assignments.forEach(item => {
        if (subs[item.id]) {
          html += `<div style="margin:0.5rem 0 0.5rem 1rem;padding:0.7rem;background:var(--color-bg-dark);border-radius:0.7rem;">
            <div><strong>${item.title}</strong> <span style="color:var(--color-secondary);font-size:0.95em;">[${item.type}]</span></div>`;
          if (subs[item.id].type === 'assignment') {
            html += `<div style="margin:0.3rem 0;"><strong>Answer:</strong> ${subs[item.id].answer}</div>`;
          } else if (subs[item.id].type === 'quiz') {
            item.questions.forEach((q, i) => {
              html += `<div style="margin-bottom:0.3rem;"><strong>Q${i+1}:</strong> ${q.q}<br><strong>Ans:</strong> <span style="color:var(--color-secondary);">${subs[item.id].answers[i]}</span>`;
              if (q.correct) {
                const isCorrect = subs[item.id].answers[i].toLowerCase() === q.correct.toLowerCase();
                html += ` <span style="margin-left:0.5rem;color:${isCorrect ? 'var(--color-success)' : 'var(--color-error)'};font-weight:600;">${isCorrect ? '✔' : '✘'}</span> <span style="color:var(--color-text-muted);font-size:0.95em;">(Correct: ${q.correct})</span>`;
              }
              html += `</div>`;
            });
            if (subs[item.id].score) {
              html += `<div style="margin-top:0.3rem;font-size:1.05em;color:var(--color-primary);font-weight:700;">Score: ${subs[item.id].score}</div>`;
            }
          }
          // Feedback box
          const feedbackKey = `feedback_${courseId}_${email}_${item.id}`;
          const feedback = localStorage.getItem(feedbackKey) || '';
          html += `<div style="margin-top:0.5rem;"><label>Feedback:<br><textarea id="fb_${feedbackKey}" rows="2" style="width:100%;padding:0.5rem;border-radius:0.5rem;border:1px solid var(--color-surface-light);background:var(--color-bg-dark);color:var(--color-text-light);">${feedback}</textarea></label></div>`;
          html += `<button class="btn-primary" style="margin-top:0.3rem;" onclick="saveFeedback('${feedbackKey}')">Save Feedback</button>`;
          html += `</div>`;
        }
      });
      html += `</div>`;
    });
  }
  html += `<div style="margin-top:1.2rem;display:flex;gap:1rem;justify-content:flex-end;"><button id="modal-close" class="btn-primary">Close</button></div></div>`;
  modal.innerHTML = html;
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
  document.getElementById('modal-close').onclick = () => modal.remove();
  window.saveFeedback = function(key) {
    const val = document.getElementById('fb_' + key).value;
    localStorage.setItem(key, val);
    alert('Feedback saved!');
  };
}

/* get notification */
// --- Notifications System ---
function getNotifications() {
  const user = getCurrentUser();
  return JSON.parse(localStorage.getItem(`notifications_${user.email}`) || '[]');
}
function setNotifications(list) {
  const user = getCurrentUser();
  localStorage.setItem(`notifications_${user.email}`, JSON.stringify(list));
}
function addNotification(msg) {
  const list = getNotifications();
  list.unshift({ msg, date: new Date().toISOString(), read: false });
  setNotifications(list);
  updateNotificationBadge();
}
function updateNotificationBadge() {
  const badge = document.querySelector('.badge');
  if (!badge) return;
  const notifs = getNotifications();
  const unread = notifs.filter(n => !n.read).length;
  badge.textContent = unread > 0 ? unread : '';
}
function showNotificationsDropdown() {
  let dropdown = document.getElementById('notifications-dropdown');
  if (!dropdown) {
    dropdown = document.createElement('div');
    dropdown.id = 'notifications-dropdown';
    dropdown.style.position = 'absolute';
    dropdown.style.top = '48px';
    dropdown.style.right = '0';
    dropdown.style.background = 'var(--color-surface-dark)';
    dropdown.style.color = 'var(--color-text-light)';
    dropdown.style.minWidth = '260px';
    dropdown.style.boxShadow = '0 2px 16px rgba(0,0,0,0.18)';
    dropdown.style.borderRadius = '1rem';
    dropdown.style.zIndex = '9999';
    dropdown.style.padding = '1rem 0.5rem';
    document.body.appendChild(dropdown);
  }
  const notifs = getNotifications();
  dropdown.innerHTML = '<strong style="color:var(--color-primary);margin-left:1rem;">Notifications</strong><br><br>';
  if (notifs.length === 0) {
    dropdown.innerHTML += '<div style="color:var(--color-text-muted);padding:0.7rem;">No notifications.</div>';
  } else {
    notifs.slice(0, 10).forEach(n => {
      dropdown.innerHTML += `<div style="padding:0.5rem 0.7rem;border-radius:0.7rem;margin-bottom:0.3rem;background:${n.read ? 'transparent' : 'var(--color-primary)'};color:${n.read ? 'var(--color-text-light)' : '#fff'};">${n.msg}<br><span style="font-size:0.9em;color:var(--color-text-muted);">${new Date(n.date).toLocaleString()}</span></div>`;
    });
  }
  // Mark all as read
  notifs.forEach(n => n.read = true);
  setNotifications(notifs);
  updateNotificationBadge();
  // Hide on click outside
  setTimeout(() => {
    document.addEventListener('click', hideDropdown, { once: true });
  }, 100);
  function hideDropdown(e) {
    if (!dropdown.contains(e.target) && e.target.id !== 'notifications-btn') {
      dropdown.remove();
    }
  }
}
// Attach to notifications button
const notifBtn = document.getElementById('notifications-btn');
if (notifBtn) {
  notifBtn.onclick = function(e) {
    e.stopPropagation();
    showNotificationsDropdown();
  };
  updateNotificationBadge();
}
// --- Trigger notifications on feedback/grade ---
// Patch saveFeedback to notify student
window.saveFeedback = function(key) {
  const val = document.getElementById('fb_' + key).value;
  localStorage.setItem(key, val);
  alert('Feedback saved!');
  // Notify student
  const parts = key.split('_');
  const courseId = parts[1];
  const email = parts[2];
  const assignId = parts[3];
  const assignments = JSON.parse(localStorage.getItem(`assignments_${courseId}`) || '[]');
  const assignment = assignments.find(a => a.id == assignId);
  let msg = `You received feedback on "${assignment ? assignment.title : 'an assignment'}".`;
  // Add notification to student
  const notifKey = `notifications_${email}`;
  const list = JSON.parse(localStorage.getItem(notifKey) || '[]');
  list.unshift({ msg, date: new Date().toISOString(), read: false });
  localStorage.setItem(notifKey, JSON.stringify(list));
};
// Patch quiz auto-grading to notify student
const origSolveAssignment = solveAssignment;
solveAssignment = function(item) {
  origSolveAssignment.apply(this, arguments);
  if (item.type === 'quiz') {
    const user = getCurrentUser();
    const submissions = getUserSubmissions();
    if (submissions[item.id] && submissions[item.id].score) {
      addNotification(`You received a score on "${item.title}": ${submissions[item.id].score}`);
    }
  }
};

// --- Render All ---
document.addEventListener('DOMContentLoaded', function() {
  renderHeader();
  renderSyllabus();
  renderVideo();
  renderNotes();
  renderAssignments();
  renderDiscussion();
  renderLiveChat();
  renderAIChat();
  getNotifications();
}); 