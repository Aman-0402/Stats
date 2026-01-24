// Stats tracking
let stats = {
    correct: 0,
    wrong: 0,
    attempted: 0,
    total: 20 // Change this to 105 for the full exam
};

// Track answered questions
let answeredQuestions = new Set();

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Add animation delay to questions
    const questions = document.querySelectorAll('.question');
    questions.forEach((q, index) => {
        q.style.animationDelay = `${index * 0.05}s`;
    });
    
    updateStats();
    showWelcomeMessage();
});

// Welcome message
function showWelcomeMessage() {
    Swal.fire({
        title: '📊 Welcome to Statistics MCQ Test!',
        html: `
            <div style="text-align: left; padding: 10px;">
                <p>📝 <strong>Total Questions:</strong> 105</p>
                <p>✅ <strong>Types:</strong> Single & Multiple Choice</p>
                <p>⏱️ <strong>Time:</strong> No time limit - take your time!</p>
                <p>🎯 <strong>Goal:</strong> Test your statistics knowledge</p>
            </div>
        `,
        icon: 'info',
        confirmButtonText: 'Start Test 🚀',
        confirmButtonColor: '#4CAF50',
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    });
}

// Show instructions
function showInstructions() {
    Swal.fire({
        title: '📖 Instructions',
        html: `
            <div style="text-align: left; padding: 10px;">
                <h4>How to use:</h4>
                <ul style="list-style-position: inside;">
                    <li>Select your answer(s) for each question</li>
                    <li>Click the "Submit" button to check your answer</li>
                    <li>Questions marked with "Multiple Answers" badge require selecting multiple options</li>
                    <li>Your progress is tracked at the top of the page</li>
                    <li>Green = Correct, Red = Wrong</li>
                </ul>
                <p style="margin-top: 15px;"><strong>Good luck! 🍀</strong></p>
            </div>
        `,
        icon: 'question',
        confirmButtonText: 'Got it!',
        confirmButtonColor: '#2196F3'
    });
}

// Check single answer
function checkAnswer(qNo) {
    const questionDiv = document.querySelector(`[data-qno="${qNo}"]`);
    const correct = questionDiv.dataset.answer;
    const selected = document.querySelector(`input[name="q${qNo}"]:checked`);
    const result = document.getElementById(`result${qNo}`);
    const submitBtn = questionDiv.querySelector('.submit-btn');

    if (!selected) {
        Swal.fire({
            title: 'Oops!',
            text: 'Please select an option before submitting',
            icon: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: '#ff9800',
            timer: 2000,
            timerProgressBar: true
        });
        
        // Shake animation
        questionDiv.classList.add('shake');
        setTimeout(() => questionDiv.classList.remove('shake'), 500);
        return;
    }

    // Disable inputs after submission
    const inputs = questionDiv.querySelectorAll('input');
    inputs.forEach(input => input.disabled = true);
    submitBtn.disabled = true;

    const isCorrect = selected.value === correct;
    
    // Update stats only if not previously answered
    if (!answeredQuestions.has(qNo)) {
        answeredQuestions.add(qNo);
        stats.attempted++;
        
        if (isCorrect) {
            stats.correct++;
            showCorrectAnswer(questionDiv, result, submitBtn);
        } else {
            stats.wrong++;
            showWrongAnswer(questionDiv, result, correct, submitBtn);
        }
        
        updateStats();
    }
}

// Check multiple answers
function checkMultiAnswer(qNo) {
    const questionDiv = document.querySelector(`[data-qno="${qNo}"]`);
    const correctAnswers = questionDiv.dataset.answer.split(",").sort().join("");
    const selected = document.querySelectorAll(`input[name="q${qNo}"]:checked`);
    const result = document.getElementById(`result${qNo}`);
    const submitBtn = questionDiv.querySelector('.submit-btn');

    let userAnswer = "";
    selected.forEach(opt => userAnswer += opt.value);
    userAnswer = userAnswer.split("").sort().join("");

    if (!userAnswer) {
        Swal.fire({
            title: 'Oops!',
            text: 'Please select at least one option before submitting',
            icon: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: '#ff9800',
            timer: 2000,
            timerProgressBar: true
        });
        
        questionDiv.classList.add('shake');
        setTimeout(() => questionDiv.classList.remove('shake'), 500);
        return;
    }

    // Disable inputs after submission
    const inputs = questionDiv.querySelectorAll('input');
    inputs.forEach(input => input.disabled = true);
    submitBtn.disabled = true;

    const isCorrect = userAnswer === correctAnswers;
    
    // Update stats only if not previously answered
    if (!answeredQuestions.has(qNo)) {
        answeredQuestions.add(qNo);
        stats.attempted++;
        
        if (isCorrect) {
            stats.correct++;
            showCorrectAnswer(questionDiv, result, submitBtn);
        } else {
            stats.wrong++;
            showWrongAnswer(questionDiv, result, questionDiv.dataset.answer, submitBtn);
        }
        
        updateStats();
    }
}

// Show correct answer feedback
function showCorrectAnswer(questionDiv, result, submitBtn) {
    // Add success class
    questionDiv.classList.add('correct-answer');
    
    // Update result display
    result.innerHTML = '<i class="fas fa-check-circle"></i> Correct Answer!';
    result.className = 'result correct';
    
    // Update button
    submitBtn.innerHTML = '<i class="fas fa-check"></i> Correct';
    submitBtn.classList.add('btn-correct');
    
    // Confetti effect
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4CAF50', '#8BC34A', '#CDDC39']
    });
    
    // Success sound (you can add actual sound here)
    // playSound('success');
    
    // Sweet alert
    Swal.fire({
        title: 'Excellent! 🎉',
        text: 'You got it right!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
        timerProgressBar: true
    });
}

// Show wrong answer feedback
function showWrongAnswer(questionDiv, result, correctAnswer, submitBtn) {
    // Add wrong class
    questionDiv.classList.add('wrong-answer');
    
    // Shake animation
    questionDiv.classList.add('shake');
    setTimeout(() => questionDiv.classList.remove('shake'), 500);
    
    // Update result display
    result.innerHTML = `<i class="fas fa-times-circle"></i> Wrong! Correct answer: ${correctAnswer}`;
    result.className = 'result wrong';
    
    // Update button
    submitBtn.innerHTML = '<i class="fas fa-times"></i> Wrong';
    submitBtn.classList.add('btn-wrong');
    
    // Sweet alert
    Swal.fire({
        title: 'Not quite! 😕',
        html: `The correct answer is: <strong>${correctAnswer}</strong>`,
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
        timerProgressBar: true
    });
}

// Update statistics
function updateStats() {
    const remaining = stats.total - stats.attempted;
    const scorePercent = stats.attempted > 0 
        ? Math.round((stats.correct / stats.attempted) * 100) 
        : 0;
    
    // Update display with animation
    animateValue('correctCount', stats.correct);
    animateValue('wrongCount', stats.wrong);
    animateValue('remainingCount', remaining);
    document.getElementById('scorePercent').textContent = scorePercent + '%';
    
    // Update progress bar
    const progress = (stats.attempted / stats.total) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    
    // Check if test completed
    if (stats.attempted === stats.total) {
        setTimeout(showFinalResults, 1000);
    }
}

// Animate number counting
function animateValue(id, value) {
    const element = document.getElementById(id);
    const current = parseInt(element.textContent) || 0;
    
    if (current === value) return;
    
    const increment = value > current ? 1 : -1;
    const duration = 300;
    const steps = Math.abs(value - current);
    const stepTime = duration / steps;
    
    let currentValue = current;
    const timer = setInterval(() => {
        currentValue += increment;
        element.textContent = currentValue;
        
        if (currentValue === value) {
            clearInterval(timer);
        }
    }, stepTime);
}

// Show final results
function showFinalResults() {
    const percentage = Math.round((stats.correct / stats.total) * 100);
    let title, icon, message;
    
    if (percentage >= 90) {
        title = '🏆 Outstanding Performance!';
        icon = 'success';
        message = 'You have excellent knowledge of statistics!';
        
        // Big confetti celebration
        const duration = 3 * 1000;
        const end = Date.now() + duration;
        
        (function frame() {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#FFD700', '#FFA500', '#FF6347']
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#FFD700', '#FFA500', '#FF6347']
            });
            
            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
        
    } else if (percentage >= 75) {
        title = '🌟 Great Job!';
        icon = 'success';
        message = 'You have a strong understanding of statistics!';
    } else if (percentage >= 60) {
        title = '👍 Good Effort!';
        icon = 'info';
        message = 'You have a decent grasp of the concepts!';
    } else if (percentage >= 40) {
        title = '📚 Keep Learning!';
        icon = 'warning';
        message = 'There\'s room for improvement. Review the topics!';
    } else {
        title = '💪 Don\'t Give Up!';
        icon = 'error';
        message = 'Practice more and you\'ll improve!';
    }
    
    Swal.fire({
        title: title,
        html: `
            <div style="font-size: 18px; padding: 20px;">
                <p style="font-size: 48px; margin: 20px 0; font-weight: bold; color: ${percentage >= 60 ? '#4CAF50' : '#f44336'};">
                    ${percentage}%
                </p>
                <hr style="margin: 20px 0;">
                <div style="text-align: left;">
                    <p>✅ <strong>Correct:</strong> ${stats.correct} / ${stats.total}</p>
                    <p>❌ <strong>Wrong:</strong> ${stats.wrong} / ${stats.total}</p>
                    <p style="margin-top: 15px;">${message}</p>
                </div>
            </div>
        `,
        icon: icon,
        confirmButtonText: 'Review Answers',
        confirmButtonColor: '#4CAF50',
        showClass: {
            popup: 'animate__animated animate__zoomIn'
        },
        hideClass: {
            popup: 'animate__animated animate__zoomOut'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// Smooth scroll to question when clicked
function scrollToQuestion(qNo) {
    const question = document.querySelector(`[data-qno="${qNo}"]`);
    question.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl + Enter to submit (for single answer questions)
    if (e.ctrlKey && e.key === 'Enter') {
        const focusedInput = document.querySelector('input:focus');
        if (focusedInput) {
            const questionNum = focusedInput.name.replace('q', '');
            const questionDiv = document.querySelector(`[data-qno="${questionNum}"]`);
            const submitBtn = questionDiv.querySelector('.submit-btn');
            if (submitBtn && !submitBtn.disabled) {
                submitBtn.click();
            }
        }
    }
});

// Add hover effect sound (optional - requires audio files)
function playSound(soundName) {
    // You can add actual sound files here
    // const audio = new Audio(`sounds/${soundName}.mp3`);
    // audio.play();
}