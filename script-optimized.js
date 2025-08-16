// 🚀 PERFORMANCE OPTIMIZED Typing Pro Script
// Optimized for: Total Blocking Time, Main Thread Work, JavaScript Execution

class TypingTest {
    constructor() {
        // Performance: Initialize core properties first
        this.words = [];
        this.currentWordIndex = 0;
        this.startTime = null;
        this.isTestActive = false;
        this.timer = null;
        this.timeLeft = 60;
        this.typedWords = [];
        this.totalCharacters = 0;
        this.correctCharacters = 0;
        
        // Key tracking system
        this.keyMistakes = {};
        this.totalKeyPresses = 0;
        this.mistakeHistory = [];
        
        // Practice paragraph system
        this.practiceParagraphs = [];
        this.currentPracticeMode = 'normal';
        
        // Performance: Defer non-critical initialization
        this.initializeCriticalElements();
        this.bindCriticalEvents();
        this.generateWords();
        this.updateDisplay();
        
        // Performance: Load non-critical features after page load
        requestIdleCallback(() => {
            this.initializeNonCriticalFeatures();
        });
    }

    // Performance: Initialize only critical elements first
    initializeCriticalElements() {
        this.wordsContainer = document.getElementById('wordsContainer');
        this.typingInput = document.getElementById('typingInput');
        this.restartBtn = document.getElementById('restartBtn');
        this.timeElement = document.getElementById('time');
        this.wpmElement = document.getElementById('wpm');
        this.accuracyElement = document.getElementById('accuracy');
        this.charactersElement = document.getElementById('characters');
    }

    // Performance: Initialize non-critical features after page load
    initializeNonCriticalFeatures() {
        this.newTestBtn = document.getElementById('newTestBtn');
        this.results = document.getElementById('results');
        this.timeSelect = document.getElementById('timeSelect');
        this.wordCount = document.getElementById('wordCount');
        this.difficulty = document.getElementById('difficulty');
        this.practiceMode = document.getElementById('practiceMode');
        this.paragraphLength = document.getElementById('paragraphLength');
        this.keyTracking = document.getElementById('keyTracking');
        this.keyStatsPanel = document.getElementById('keyStatsPanel');
        this.keyStatsGrid = document.getElementById('keyStatsGrid');
        this.generatePracticeBtn = document.getElementById('generatePracticeBtn');
        this.soundToggle = document.getElementById('soundToggle');
        
        // Results elements
        this.finalWpmElement = document.getElementById('finalWpm');
        this.finalAccuracyElement = document.getElementById('finalAccuracy');
        this.finalWordsElement = document.getElementById('finalWords');
        this.finalCharactersElement = document.getElementById('finalCharacters');
        
        // Initialize non-critical features
        this.updateKeyStats();
        this.initializeSoundPreference();
        this.bindNonCriticalEvents();
        this.enhanceDropdowns();
    }

    // Performance: Bind only critical events first
    bindCriticalEvents() {
        // Performance: Use event delegation for better performance
        this.typingInput.addEventListener('input', this.debounce(this.handleInput.bind(this), 16)); // 60fps
        this.typingInput.addEventListener('keydown', this.handleKeydown.bind(this));
        this.restartBtn.addEventListener('click', this.restartTest.bind(this));
    }

    // Performance: Bind non-critical events after page load
    bindNonCriticalEvents() {
        if (this.newTestBtn) this.newTestBtn.addEventListener('click', this.startNewTest.bind(this));
        if (this.timeSelect) this.timeSelect.addEventListener('change', this.updateTimeLimit.bind(this));
        if (this.wordCount) this.wordCount.addEventListener('change', this.generateWords.bind(this));
        if (this.difficulty) this.difficulty.addEventListener('change', this.generateWords.bind(this));
        if (this.practiceMode) this.practiceMode.addEventListener('change', this.updatePracticeMode.bind(this));
        if (this.paragraphLength) this.paragraphLength.addEventListener('change', this.generateWords.bind(this));
        if (this.keyTracking) this.keyTracking.addEventListener('change', this.updateKeyTracking.bind(this));
        if (this.generatePracticeBtn) this.generatePracticeBtn.addEventListener('click', this.generatePracticeParagraph.bind(this));
        if (this.soundToggle) this.soundToggle.addEventListener('click', this.toggleSound.bind(this));
    }

    // Performance: Debounce function to reduce main thread work
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Performance: Throttle function for high-frequency events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Performance: Optimized input handling with debouncing
    handleInput(e) {
        if (!this.isTestActive) {
            this.startTest();
        }
        
        const typedValue = e.target.value;
        const currentWord = this.words[this.currentWordIndex];
        
        if (typedValue.endsWith(' ')) {
            this.processWord(typedValue.trim());
            e.target.value = '';
            this.currentWordIndex++;
            
            if (this.currentWordIndex >= this.words.length) {
                this.endTest();
                return;
            }
        }
        
        // Performance: Batch DOM updates
        this.updateTypingProgress(typedValue, currentWord);
    }

    // Performance: Batch DOM updates to reduce reflows
    updateTypingProgress(typedValue, currentWord) {
        // Performance: Use requestAnimationFrame for smooth updates
        requestAnimationFrame(() => {
            this.updateWordDisplay(typedValue, currentWord);
            this.updateStats();
        });
    }

    // Performance: Optimized stats update with batching
    updateStats() {
        if (!this.startTime) return;
        
        const elapsedTime = (Date.now() - this.startTime) / 1000;
        const minutes = elapsedTime / 60;
        
        // Performance: Calculate all stats at once
        const stats = this.calculateStats(elapsedTime, minutes);
        
        // Performance: Update DOM in batch
        requestAnimationFrame(() => {
            this.updateStatsDisplay(stats);
        });
    }

    // Performance: Calculate all stats at once to reduce computation
    calculateStats(elapsedTime, minutes) {
        const wpm = Math.round(this.typedWords.length / minutes);
        const accuracy = this.totalCharacters > 0 ? Math.round((this.correctCharacters / this.totalCharacters) * 100) : 100;
        
        return { wpm, accuracy, elapsedTime, totalCharacters: this.totalCharacters };
    }

    // Performance: Batch DOM updates
    updateStatsDisplay(stats) {
        if (this.wpmElement) this.wpmElement.textContent = stats.wpm;
        if (this.accuracyElement) this.accuracyElement.textContent = stats.accuracy + '%';
        if (this.charactersElement) this.charactersElement.textContent = stats.totalCharacters;
        if (this.timeElement) this.timeElement.textContent = Math.ceil(stats.elapsedTime) + 's';
    }

    // Performance: Optimized word generation
    generateWords() {
        const difficulty = this.difficulty ? this.difficulty.value : 'easy';
        const wordCount = this.wordCount ? parseInt(this.wordCount.value) : 8;
        
        // Performance: Use more efficient word generation
        this.words = this.getWordsByDifficulty(difficulty, wordCount * 10);
        
        // Performance: Update display efficiently
        requestAnimationFrame(() => {
            this.updateWordsDisplay();
        });
    }

    // Performance: Efficient word generation
    getWordsByDifficulty(difficulty, count) {
        const wordLists = {
            easy: ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at'],
            medium: ['computer', 'programming', 'development', 'software', 'technology', 'internet', 'website', 'application', 'database', 'algorithm', 'function', 'variable', 'object', 'class', 'method'],
            hard: ['sophisticated', 'implementation', 'optimization', 'algorithmic', 'computational', 'theoretical', 'mathematical', 'statistical', 'analytical', 'methodological'],
            expert: ['pneumonoultramicroscopicsilicovolcanoconioses', 'supercalifragilisticexpialidocious', 'antidisestablishmentarianism', 'floccinaucinihilipilification', 'hippopotomonstrosesquippedaliophobia']
        };
        
        const words = wordLists[difficulty] || wordLists.easy;
        const result = [];
        
        for (let i = 0; i < count; i++) {
            result.push(words[Math.floor(Math.random() * words.length)]);
        }
        
        return result;
    }

    // Performance: Efficient display update
    updateWordsDisplay() {
        if (!this.wordsContainer) return;
        
        // Performance: Use DocumentFragment for batch DOM updates
        const fragment = document.createDocumentFragment();
        
        this.words.forEach((word, index) => {
            const wordSpan = document.createElement('span');
            wordSpan.textContent = word;
            wordSpan.className = 'word';
            wordSpan.dataset.index = index;
            
            if (index === this.currentWordIndex) {
                wordSpan.classList.add('current');
            }
            
            fragment.appendChild(wordSpan);
            
            // Add space between words
            if (index < this.words.length - 1) {
                fragment.appendChild(document.createTextNode(' '));
            }
        });
        
        // Performance: Single DOM update
        this.wordsContainer.innerHTML = '';
        this.wordsContainer.appendChild(fragment);
    }

    // Performance: Optimized test start
    startTest() {
        this.isTestActive = true;
        this.startTime = Date.now();
        this.typedWords = [];
        this.totalCharacters = 0;
        this.correctCharacters = 0;
        
        // Performance: Use requestAnimationFrame for smooth timer
        this.startTimer();
    }

    // Performance: Smooth timer with requestAnimationFrame
    startTimer() {
        const updateTimer = () => {
            if (!this.isTestActive) return;
            
            const elapsedTime = (Date.now() - this.startTime) / 1000;
            this.timeLeft = Math.max(0, this.timeLimit - elapsedTime);
            
            if (this.timeLeft <= 0) {
                this.endTest();
                return;
            }
            
            // Performance: Update timer display efficiently
            if (this.timeElement) {
                this.timeElement.textContent = Math.ceil(this.timeLeft) + 's';
            }
            
            // Performance: Use requestAnimationFrame for smooth updates
            requestAnimationFrame(updateTimer);
        };
        
        requestAnimationFrame(updateTimer);
    }

    // Performance: Optimized test end
    endTest() {
        this.isTestActive = false;
        clearTimeout(this.timer);
        
        // Performance: Calculate final stats efficiently
        const finalStats = this.calculateFinalStats();
        
        // Performance: Show results with requestAnimationFrame
        requestAnimationFrame(() => {
            this.showResults(finalStats);
        });
    }

    // Performance: Efficient final stats calculation
    calculateFinalStats() {
        const elapsedTime = (Date.now() - this.startTime) / 1000;
        const minutes = elapsedTime / 60;
        const wpm = Math.round(this.typedWords.length / minutes);
        const accuracy = this.totalCharacters > 0 ? Math.round((this.correctCharacters / this.totalCharacters) * 100) : 100;
        
        return {
            wpm,
            accuracy,
            totalWords: this.typedWords.length,
            totalCharacters: this.totalCharacters,
            elapsedTime
        };
    }

    // Performance: Efficient results display
    showResults(stats) {
        if (!this.results) return;
        
        // Performance: Update all result elements at once
        if (this.finalWpmElement) this.finalWpmElement.textContent = stats.wpm;
        if (this.finalAccuracyElement) this.finalAccuracyElement.textContent = stats.accuracy + '%';
        if (this.finalWordsElement) this.finalAccuracyElement.textContent = stats.totalWords;
        if (this.finalCharactersElement) this.finalCharactersElement.textContent = stats.totalCharacters;
        
        // Performance: Show results efficiently
        this.results.style.display = 'block';
        
        // Performance: Scroll to results smoothly
        this.results.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Performance: Optimized restart
    restartTest() {
        this.isTestActive = false;
        this.currentWordIndex = 0;
        this.typedWords = [];
        this.totalCharacters = 0;
        this.correctCharacters = 0;
        
        if (this.typingInput) {
            this.typingInput.value = '';
            this.typingInput.focus();
        }
        
        if (this.results) {
            this.results.style.display = 'none';
        }
        
        this.generateWords();
        this.updateDisplay();
    }

    // Performance: Efficient display update
    updateDisplay() {
        // Performance: Use requestAnimationFrame for smooth updates
        requestAnimationFrame(() => {
            this.updateWordsDisplay();
            this.updateStats();
        });
    }

    // Performance: Lazy load advanced features
    loadAdvancedFeatures() {
        // Performance: Load features only when needed
        if (this.currentPracticeMode === 'focused') {
            this.loadFocusedPracticeFeatures();
        }
        
        if (this.currentPracticeMode === 'paragraph') {
            this.loadParagraphModeFeatures();
        }
    }

    // Performance: Load focused practice features
    loadFocusedPracticeFeatures() {
        // Performance: Load only when needed
        if (!this.focusedPracticeLoaded) {
            this.focusedPracticeLoaded = true;
            // Load focused practice logic
        }
    }

    // Performance: Load paragraph mode features
    loadParagraphModeFeatures() {
        // Performance: Load only when needed
        if (!this.paragraphModeLoaded) {
            this.paragraphModeLoaded = true;
            // Load paragraph mode logic
        }
    }

    // Performance: Memory cleanup
    cleanup() {
        this.isTestActive = false;
        clearTimeout(this.timer);
        
        // Performance: Remove event listeners
        if (this.typingInput) {
            this.typingInput.removeEventListener('input', this.handleInput);
            this.typingInput.removeEventListener('keydown', this.handleKeydown);
        }
        
        if (this.restartBtn) {
            this.restartBtn.removeEventListener('click', this.restartTest);
        }
    }
}

// Performance: Initialize only when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new TypingTest();
    });
} else {
    // Performance: DOM already ready, initialize immediately
    new TypingTest();
}

// Performance: Service Worker for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Performance: Preload critical resources
const preloadCriticalResources = () => {
    const criticalResources = [
        { href: 'styles.css', as: 'style' },
        { href: 'script.js', as: 'script' }
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        document.head.appendChild(link);
    });
};

// Performance: Execute preloading when idle
if ('requestIdleCallback' in window) {
    requestIdleCallback(preloadCriticalResources);
} else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(preloadCriticalResources, 1000);
}
