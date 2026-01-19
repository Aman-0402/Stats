/* ==========================================
   MAIN.JS - Statistics eBook
   Core functionality and interactive features
   ========================================== */

// ==========================================
// INITIALIZE ON PAGE LOAD
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    initSmoothScrolling();
    initProgressTracking();
    initCardAnimations();
    initScrollToTop();
    loadUserPreferences();
});

// ==========================================
// PAGE INITIALIZATION
// ==========================================

function initializePage() {
    // Add fade-in animation to main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.opacity = '0';
        setTimeout(() => {
            mainContent.style.transition = 'opacity 0.5s ease-in';
            mainContent.style.opacity = '1';
        }, 100);
    }

    // Log page visit
    logPageVisit();
}

// ==========================================
// SMOOTH SCROLLING
// ==========================================

function initSmoothScrolling() {
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ==========================================
// PROGRESS TRACKING
// ==========================================

function initProgressTracking() {
    // Track which chapters have been visited
    const currentPage = window.location.pathname;
    
    // Check if we're on a chapter page
    if (currentPage.includes('chapter')) {
        markChapterAsVisited(currentPage);
        updateProgressDisplay();
    }
    
    // Display progress on contents page
    if (currentPage.includes('contents.html')) {
        highlightVisitedChapters();
        displayProgressStats();
    }
}

function markChapterAsVisited(chapterPath) {
    // Get visited chapters from localStorage
    let visitedChapters = JSON.parse(localStorage.getItem('visitedChapters') || '[]');
    
    // Extract chapter number from path
    const chapterMatch = chapterPath.match(/chapter(\d+)/);
    if (chapterMatch) {
        const chapterNum = parseInt(chapterMatch[1]);
        
        // Add to visited if not already there
        if (!visitedChapters.includes(chapterNum)) {
            visitedChapters.push(chapterNum);
            localStorage.setItem('visitedChapters', JSON.stringify(visitedChapters));
        }
    }
}

function highlightVisitedChapters() {
    const visitedChapters = JSON.parse(localStorage.getItem('visitedChapters') || '[]');
    
    visitedChapters.forEach(chapterNum => {
        const chapterCard = document.querySelector(`[onclick*="chapter${String(chapterNum).padStart(2, '0')}"]`);
        if (chapterCard) {
            // Add a "visited" indicator
            chapterCard.classList.add('visited');
            
            // Add a checkmark icon
            const chapterHeader = chapterCard.querySelector('.chapter-header');
            if (chapterHeader && !chapterCard.querySelector('.visited-badge')) {
                const badge = document.createElement('span');
                badge.className = 'visited-badge';
                badge.innerHTML = '✓';
                badge.title = 'You\'ve read this chapter';
                chapterHeader.appendChild(badge);
            }
        }
    });
}

function displayProgressStats() {
    const visitedChapters = JSON.parse(localStorage.getItem('visitedChapters') || '[]');
    const totalChapters = 13;
    const progress = Math.round((visitedChapters.length / totalChapters) * 100);
    
    // Create progress indicator if it doesn't exist
    const container = document.querySelector('.container');
    if (container && !document.querySelector('.progress-indicator')) {
        const progressDiv = document.createElement('div');
        progressDiv.className = 'progress-indicator';
        progressDiv.innerHTML = `
            <div class="progress-bar-container">
                <div class="progress-label">Your Progress: ${visitedChapters.length}/${totalChapters} chapters</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <div class="progress-percentage">${progress}%</div>
            </div>
        `;
        
        // Insert after header, before first phase section
        const firstPhase = document.querySelector('.phase-section');
        if (firstPhase) {
            container.insertBefore(progressDiv, firstPhase);
        }
    }
}

function updateProgressDisplay() {
    // Update any progress displays on the current page
    const visitedChapters = JSON.parse(localStorage.getItem('visitedChapters') || '[]');
    console.log(`Progress: ${visitedChapters.length}/13 chapters visited`);
}

// ==========================================
// CARD ANIMATIONS
// ==========================================

function initCardAnimations() {
    // Add staggered animation to chapter cards
    const cards = document.querySelectorAll('.chapter-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 50);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
}

// ==========================================
// SCROLL TO TOP BUTTON
// ==========================================

function initScrollToTop() {
    // Create scroll-to-top button
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '↑';
    scrollBtn.title = 'Scroll to top';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollBtn);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==========================================
// USER PREFERENCES
// ==========================================

function loadUserPreferences() {
    // Load any saved user preferences
    const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    
    // Apply preferences (can be extended later)
    if (preferences.fontSize) {
        document.body.style.fontSize = preferences.fontSize;
    }
}

function saveUserPreference(key, value) {
    const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    preferences[key] = value;
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
}

// ==========================================
// PAGE VISIT LOGGING
// ==========================================

function logPageVisit() {
    // Log page visits for analytics (optional)
    const visits = JSON.parse(localStorage.getItem('pageVisits') || '{}');
    const currentPage = window.location.pathname;
    
    if (!visits[currentPage]) {
        visits[currentPage] = {
            firstVisit: new Date().toISOString(),
            count: 0
        };
    }
    
    visits[currentPage].count++;
    visits[currentPage].lastVisit = new Date().toISOString();
    
    localStorage.setItem('pageVisits', JSON.stringify(visits));
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function resetProgress() {
    // Clear all progress (useful for testing)
    if (confirm('Are you sure you want to reset your reading progress?')) {
        localStorage.removeItem('visitedChapters');
        localStorage.removeItem('pageVisits');
        location.reload();
    }
}

function getReadingStats() {
    // Get reading statistics
    const visitedChapters = JSON.parse(localStorage.getItem('visitedChapters') || '[]');
    const pageVisits = JSON.parse(localStorage.getItem('pageVisits') || '{}');
    
    return {
        chaptersRead: visitedChapters.length,
        totalChapters: 13,
        progress: Math.round((visitedChapters.length / 13) * 100),
        pagesVisited: Object.keys(pageVisits).length,
        visitHistory: pageVisits
    };
}

// ==========================================
// KEYBOARD SHORTCUTS
// ==========================================

document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + H: Go to home
    if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        window.location.href = '/index.html';
    }
    
    // Ctrl/Cmd + K: Go to contents
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        window.location.href = '/contents.html';
    }
    
    // Escape: Scroll to top
    if (e.key === 'Escape') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// ==========================================
// CHAPTER NAVIGATION (for chapter pages)
// ==========================================

function initChapterNavigation() {
    // Get current chapter number
    const currentPath = window.location.pathname;
    const chapterMatch = currentPath.match(/chapter(\d+)/);
    
    if (chapterMatch) {
        const currentChapter = parseInt(chapterMatch[1]);
        const prevChapter = currentChapter - 1;
        const nextChapter = currentChapter + 1;
        
        // Add navigation buttons
        const nav = document.createElement('div');
        nav.className = 'chapter-navigation';
        
        let navHTML = '<div class="chapter-nav-buttons">';
        
        // Previous button
        if (prevChapter >= 1) {
            navHTML += `
                <a href="chapter${String(prevChapter).padStart(2, '0')}.html" class="btn btn-nav btn-prev">
                    ← Previous Chapter
                </a>
            `;
        }
        
        // Contents button
        navHTML += `
            <a href="../contents.html" class="btn btn-nav btn-contents">
                📚 Contents
            </a>
        `;
        
        // Next button
        if (nextChapter <= 13) {
            navHTML += `
                <a href="chapter${String(nextChapter).padStart(2, '0')}.html" class="btn btn-nav btn-next">
                    Next Chapter →
                </a>
            `;
        }
        
        navHTML += '</div>';
        nav.innerHTML = navHTML;
        
        // Add to page
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.appendChild(nav);
        }
    }
}

// Initialize chapter navigation if on a chapter page
if (window.location.pathname.includes('chapter')) {
    document.addEventListener('DOMContentLoaded', initChapterNavigation);
}

// ==========================================
// EXPORT FUNCTIONS (for console access)
// ==========================================

window.StatisticsEbook = {
    resetProgress: resetProgress,
    getStats: getReadingStats,
    savePreference: saveUserPreference
};

console.log('📊 Statistics eBook loaded!');
console.log('💡 Tip: Use Ctrl+K to jump to Contents, Ctrl+H for Home, or ESC to scroll to top');

// ==========================================
// ENHANCED MCQ (MULTIPLE CHOICE QUESTIONS) HANDLER
// ==========================================

function initMCQs() {
  const questions = document.querySelectorAll('.mcq-question');

  // Correct answers for each question (index-based)
  const correctAnswers = ['B', 'C', 'C', 'C', 'B'];

  questions.forEach((question, index) => {
    const options = question.querySelectorAll('.option');
    const showAnswerBtn = question.querySelector('.show-answer-btn');
    const answerContent = question.querySelector('.answer-content');

    let selectedOption = null;
    let isLocked = false;

    // Handle option click
    options.forEach(option => {
      option.addEventListener('click', () => {
        if (isLocked) return; // prevent changes after answer reveal

        options.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        selectedOption = option.getAttribute('data-option');
      });
    });

    // Handle show answer button
    if (showAnswerBtn) {
      showAnswerBtn.addEventListener('click', () => {
        if (isLocked) return;

        if (!selectedOption) {
          alert("⚠️ Please select an option before viewing the answer!");
          return;
        }

        isLocked = true;

        // Reveal answer content
        if (answerContent) {
          answerContent.classList.add('visible');
        }

        // Highlight options
        options.forEach(option => {
          const optionValue = option.getAttribute('data-option');

          if (optionValue === correctAnswers[index]) {
            option.classList.add('correct');
          } else if (optionValue === selectedOption) {
            option.classList.add('incorrect');
          }

          // Disable further clicking
          option.style.pointerEvents = 'none';
        });

        // Hide show answer button
        showAnswerBtn.classList.add('hidden');
      });
    }
  });
}

// Initialize MCQs on DOM ready
document.addEventListener('DOMContentLoaded', initMCQs);
