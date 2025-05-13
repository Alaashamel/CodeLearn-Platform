document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const quizzesGrid = document.querySelector('.quizzes-grid');
    const quizSearch = document.getElementById('quiz-search');
    const quizFilter = document.getElementById('quiz-filter');

    // Sample quiz data (in a real app, this would come from a backend)
    const quizzes = [
        {
            id: 1,
            title: 'Introduction to Programming',
            course: 'Programming Basics',
            dueDate: '2024-03-20',
            duration: '30 minutes',
            questions: 10,
            completed: false
        },
        {
            id: 2,
            title: 'Web Development Fundamentals',
            course: 'Web Development',
            dueDate: '2024-03-25',
            duration: '45 minutes',
            questions: 15,
            completed: true
        },
        {
            id: 3,
            title: 'Database Design',
            course: 'Database Management',
            dueDate: '2024-03-28',
            duration: '60 minutes',
            questions: 20,
            completed: false
        }
    ];

    function renderQuizzes(filteredQuizzes) {
        quizzesGrid.innerHTML = filteredQuizzes.map(quiz => `
            <div class="quiz-card">
                <div class="quiz-header">
                    <h3>${quiz.title}</h3>
                    <span class="quiz-course">${quiz.course}</span>
                </div>
                <div class="quiz-details">
                    <p><i class="fas fa-clock"></i> ${quiz.duration}</p>
                    <p><i class="fas fa-question-circle"></i> ${quiz.questions} questions</p>
                    <p><i class="fas fa-calendar"></i> Due: ${quiz.dueDate}</p>
                </div>
                <div class="quiz-status ${quiz.completed ? 'completed' : 'pending'}">
                    ${quiz.completed ? 'Completed' : 'Pending'}
                </div>
                <button class="btn-primary" onclick="startQuiz(${quiz.id})">
                    ${quiz.completed ? 'Review' : 'Start Quiz'}
                </button>
            </div>
        `).join('');
    }

    // Initial render
    renderQuizzes(quizzes);

    // Search functionality
    quizSearch.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredQuizzes = quizzes.filter(quiz => 
            quiz.title.toLowerCase().includes(searchTerm) ||
            quiz.course.toLowerCase().includes(searchTerm)
        );
        renderQuizzes(filteredQuizzes);
    });

    // Filter functionality
    quizFilter.addEventListener('change', function(e) {
        const filter = e.target.value;
        let filteredQuizzes = quizzes;
        
        if (filter === 'completed') {
            filteredQuizzes = quizzes.filter(quiz => quiz.completed);
        } else if (filter === 'pending') {
            filteredQuizzes = quizzes.filter(quiz => !quiz.completed);
        }
        
        renderQuizzes(filteredQuizzes);
    });
});

// Quiz start function
function startQuiz(quizId) {
    // In a real app, this would redirect to the quiz page or open a modal
    console.log(`Starting quiz ${quizId}`);
    // For now, just show an alert
    alert('Quiz functionality will be implemented in the next phase!');
} 