/* ==========================================
   NAVIGATION.JS - Statistics eBook
   Navigation functionality and mobile menu
   ========================================== */

// ==========================================
// INITIALIZE NAVIGATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    highlightActiveNavLink();
    initHeaderScroll();
    initSearchFeature();
});

// ==========================================
// MOBILE MENU
// ==========================================

function initMobileMenu() {
    const header = document.querySelector('.main-header');
    const nav = document.querySelector('.header-nav');
    
    if (!header || !nav) return;
    
    // Create mobile menu toggle button
    const menuToggle = document.createElement('button');
    menuToggle.className = 'mobile-menu-toggle';
    menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
    menuToggle.innerHTML = `
        <span class="hamburger"></span>
        <span class="hamburger"></span>
        <span class="hamburger"></span>
    `;
    
    // Insert toggle button before navigation
    const headerContent = document.querySelector('.header-content');
    if (headerContent) {
        headerContent.insertBefore(menuToggle, nav);
    }
    
    // Toggle menu on click
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // Update aria-expanded
        const isExpanded = nav.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!header.contains(e.target) && nav.classList.contains('active')) {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Close menu when clicking a nav link
    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// ==========================================
// ACTIVE LINK HIGHLIGHTING
// ==========================================

function highlightActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        // Remove active class from all links
        link.classList.remove('active');
        
        // Get the href attribute
        const href = link.getAttribute('href');
        
        // Check if current page matches
        if (currentPath.includes(href) || 
            (href === 'index.html' && (currentPath === '/' || currentPath.endsWith('index.html'))) ||
            (href === 'contents.html' && currentPath.includes('contents.html'))) {
            link.classList.add('active');
        }
        
        // Special case for chapter pages - highlight Contents
        if (currentPath.includes('chapter') && href === 'contents.html') {
            // Optionally highlight contents when viewing chapters
            // link.classList.add('active-parent');
        }
    });
}

// ==========================================
// HEADER SCROLL BEHAVIOR
// ==========================================

function initHeaderScroll() {
    const header = document.querySelector('.main-header');
    if (!header) return;
    
    let lastScroll = 0;
    const scrollThreshold = 100;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add shadow when scrolled
        if (currentScroll > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide header on scroll down, show on scroll up (optional)
        // Uncomment below to enable auto-hide header
        /*
        if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }
        */
        
        lastScroll = currentScroll;
    });
}

// ==========================================
// BREADCRUMB NAVIGATION
// ==========================================

function createBreadcrumbs() {
    const currentPath = window.location.pathname;
    const breadcrumbContainer = document.createElement('nav');
    breadcrumbContainer.className = 'breadcrumbs';
    breadcrumbContainer.setAttribute('aria-label', 'Breadcrumb');
    
    let breadcrumbHTML = '<ol class="breadcrumb-list">';
    
    // Home link
    breadcrumbHTML += '<li><a href="/index.html">Home</a></li>';
    
    // Add current page
    if (currentPath.includes('contents.html')) {
        breadcrumbHTML += '<li aria-current="page">Contents</li>';
    } else if (currentPath.includes('chapter')) {
        const chapterMatch = currentPath.match(/chapter(\d+)/);
        if (chapterMatch) {
            breadcrumbHTML += '<li><a href="/contents.html">Contents</a></li>';
            breadcrumbHTML += `<li aria-current="page">Chapter ${parseInt(chapterMatch[1])}</li>`;
        }
    } else if (currentPath.includes('glossary')) {
        breadcrumbHTML += '<li aria-current="page">Glossary</li>';
    } else if (currentPath.includes('formulas')) {
        breadcrumbHTML += '<li aria-current="page">Formulas</li>';
    }
    
    breadcrumbHTML += '</ol>';
    breadcrumbContainer.innerHTML = breadcrumbHTML;
    
    // Insert breadcrumbs
    const mainContent = document.querySelector('.main-content .container');
    if (mainContent && !currentPath.endsWith('index.html')) {
        mainContent.insertBefore(breadcrumbContainer, mainContent.firstChild);
    }
}

// Initialize breadcrumbs
// createBreadcrumbs();

// ==========================================
// SEARCH FEATURE (Simple client-side search)
// ==========================================

function initSearchFeature() {
    // Only add search on contents page
    if (!window.location.pathname.includes('contents.html')) return;
    
    const container = document.querySelector('.main-content .container');
    if (!container) return;
    
    // Create search box
    const searchBox = document.createElement('div');
    searchBox.className = 'search-container';
    searchBox.innerHTML = `
        <input 
            type="text" 
            id="chapter-search" 
            class="search-input" 
            placeholder="🔍 Search chapters and topics..."
            aria-label="Search chapters"
        >
        <button id="clear-search" class="clear-search" aria-label="Clear search">✕</button>
    `;
    
    // Insert search box at the top
    const firstPhase = document.querySelector('.phase-section');
    if (firstPhase) {
        container.insertBefore(searchBox, firstPhase);
    }
    
    // Search functionality
    const searchInput = document.getElementById('chapter-search');
    const clearBtn = document.getElementById('clear-search');
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        filterChapters(searchTerm);
        
        // Show/hide clear button
        if (searchTerm) {
            clearBtn.style.display = 'block';
        } else {
            clearBtn.style.display = 'none';
        }
    });
    
    clearBtn.addEventListener('click', function() {
        searchInput.value = '';
        filterChapters('');
        clearBtn.style.display = 'none';
        searchInput.focus();
    });
}

function filterChapters(searchTerm) {
    const phasesSections = document.querySelectorAll('.phase-section');
    let visibleCount = 0;
    
    phasesSections.forEach(phase => {
        const chapters = phase.querySelectorAll('.chapter-card');
        let phaseHasVisible = false;
        
        chapters.forEach(chapter => {
            const title = chapter.querySelector('.chapter-title').textContent.toLowerCase();
            const topics = Array.from(chapter.querySelectorAll('.topics-list li'))
                .map(li => li.textContent.toLowerCase())
                .join(' ');
            
            const isVisible = !searchTerm || 
                            title.includes(searchTerm) || 
                            topics.includes(searchTerm);
            
            if (isVisible) {
                chapter.style.display = '';
                phaseHasVisible = true;
                visibleCount++;
            } else {
                chapter.style.display = 'none';
            }
        });
        
        // Hide phase if no chapters are visible
        if (phaseHasVisible) {
            phase.style.display = '';
        } else {
            phase.style.display = 'none';
        }
    });
    
    // Show "no results" message
    let noResults = document.querySelector('.no-results');
    if (visibleCount === 0 && searchTerm) {
        if (!noResults) {
            noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.innerHTML = `
                <p>No chapters found for "<strong>${searchTerm}</strong>"</p>
                <p>Try a different search term.</p>
            `;
            const container = document.querySelector('.main-content .container');
            const firstPhase = document.querySelector('.phase-section');
            if (firstPhase) {
                container.insertBefore(noResults, firstPhase);
            }
        }
    } else if (noResults) {
        noResults.remove();
    }
}

// ==========================================
// KEYBOARD NAVIGATION
// ==========================================

// Arrow key navigation between chapters
document.addEventListener('keydown', function(e) {
    // Only on chapter pages
    if (!window.location.pathname.includes('chapter')) return;
    
    const currentPath = window.location.pathname;
    const chapterMatch = currentPath.match(/chapter(\d+)/);
    
    if (!chapterMatch) return;
    
    const currentChapter = parseInt(chapterMatch[1]);
    
    // Left arrow or 'p' for previous
    if ((e.key === 'ArrowLeft' || e.key === 'p') && !e.ctrlKey && !e.metaKey) {
        const prevChapter = currentChapter - 1;
        if (prevChapter >= 1) {
            e.preventDefault();
            window.location.href = `chapter${String(prevChapter).padStart(2, '0')}.html`;
        }
    }
    
    // Right arrow or 'n' for next
    if ((e.key === 'ArrowRight' || e.key === 'n') && !e.ctrlKey && !e.metaKey) {
        const nextChapter = currentChapter + 1;
        if (nextChapter <= 13) {
            e.preventDefault();
            window.location.href = `chapter${String(nextChapter).padStart(2, '0')}.html`;
        }
    }
});

// ==========================================
// PHASE COLLAPSE/EXPAND (Optional)
// ==========================================

function initPhaseCollapse() {
    const phaseHeaders = document.querySelectorAll('.phase-header');
    
    phaseHeaders.forEach(header => {
        // Make phase headers clickable
        header.style.cursor = 'pointer';
        header.setAttribute('role', 'button');
        header.setAttribute('aria-expanded', 'true');
        
        header.addEventListener('click', function() {
            const phaseSection = this.closest('.phase-section');
            const chaptersList = phaseSection.querySelector('.chapters-list');
            
            if (chaptersList) {
                const isExpanded = chaptersList.style.display !== 'none';
                
                if (isExpanded) {
                    chaptersList.style.display = 'none';
                    header.setAttribute('aria-expanded', 'false');
                    phaseSection.classList.add('collapsed');
                } else {
                    chaptersList.style.display = '';
                    header.setAttribute('aria-expanded', 'true');
                    phaseSection.classList.remove('collapsed');
                }
            }
        });
    });
}

// Uncomment to enable phase collapse feature
// initPhaseCollapse();

// ==========================================
// TABLE OF CONTENTS GENERATOR (for chapter pages)
// ==========================================

function generateTableOfContents() {
    // DISABLED: Topics are now manually added to each chapter
    // This prevents auto-generation of TOC
    return;
    
    /* Original code kept for reference
    const content = document.querySelector('.chapter-content');
    if (!content) return;
    
    const headings = content.querySelectorAll('h2, h3');
    if (headings.length === 0) return;
    
    const toc = document.createElement('nav');
    toc.className = 'table-of-contents';
    toc.innerHTML = '<h3>On This Page</h3><ul class="toc-list"></ul>';
    
    const tocList = toc.querySelector('.toc-list');
    
    headings.forEach((heading, index) => {
        // Add ID to heading if it doesn't have one
        if (!heading.id) {
            heading.id = `section-${index}`;
        }
        
        const li = document.createElement('li');
        li.className = heading.tagName === 'H2' ? 'toc-h2' : 'toc-h3';
        
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        
        li.appendChild(link);
        tocList.appendChild(li);
    });
    
    // Insert TOC
    content.insertBefore(toc, content.firstChild);
    */
}

// DO NOT initialize TOC - topics are manually added to chapters
// if (window.location.pathname.includes('chapter')) {
//     document.addEventListener('DOMContentLoaded', generateTableOfContents);
// }

// ==========================================
// PROGRESS INDICATOR (Reading Progress Bar)
// ==========================================

function initReadingProgress() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="reading-progress-fill"></div>';
    document.body.appendChild(progressBar);
    
    const progressFill = progressBar.querySelector('.reading-progress-fill');
    
    // Update on scroll
    window.addEventListener('scroll', function() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        
        progressFill.style.width = `${Math.min(progress, 100)}%`;
    });
}

// Initialize reading progress
initReadingProgress();

console.log('🧭 Navigation system loaded!');
console.log('⌨️  Keyboard shortcuts: ← → or P/N to navigate chapters, ESC to scroll top');