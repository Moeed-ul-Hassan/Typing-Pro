class TypingTest {
    constructor() {
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
        

        
        this.initializeElements();
        this.bindEvents();
        this.generateWords();
        this.updateDisplay();
        this.updateKeyStats();
        this.initializeSoundPreference();
    }

    initializeElements() {
        this.wordsContainer = document.getElementById('wordsContainer');
        this.typingInput = document.getElementById('typingInput');
        this.restartBtn = document.getElementById('restartBtn');
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
        
        // Stats elements
        this.timeElement = document.getElementById('time');
        this.wpmElement = document.getElementById('wpm');
        this.accuracyElement = document.getElementById('accuracy');
        this.charactersElement = document.getElementById('characters');
        
        // Results elements
        this.finalWpmElement = document.getElementById('finalWpm');
        this.finalAccuracyElement = document.getElementById('finalAccuracy');
        this.finalWordsElement = document.getElementById('finalWords');
        this.finalCharactersElement = document.getElementById('finalCharacters');
    }

    bindEvents() {
        this.typingInput.addEventListener('input', (e) => this.handleInput(e));
        this.typingInput.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.restartBtn.addEventListener('click', () => this.restartTest());
        this.newTestBtn.addEventListener('click', () => this.startNewTest());
        this.timeSelect.addEventListener('change', () => this.updateTimeLimit());
        this.wordCount.addEventListener('change', () => this.generateWords());
        this.difficulty.addEventListener('change', () => this.generateWords());
        this.practiceMode.addEventListener('change', () => this.updatePracticeMode());
        this.paragraphLength.addEventListener('change', () => this.generateWords());
        this.keyTracking.addEventListener('change', () => this.updateKeyTracking());
        this.generatePracticeBtn.addEventListener('click', () => this.generatePracticeParagraph());
        this.soundToggle.addEventListener('click', () => this.toggleSound());
        
        // Enhanced dropdown interactions
        this.enhanceDropdowns();
    }

    enhanceDropdowns() {
        const selects = document.querySelectorAll('.setting-group select');
        
        selects.forEach(select => {
            // Add visual feedback on change
            select.addEventListener('change', () => {
                this.animateDropdownChange(select);
            });
            
            // Add focus effects
            select.addEventListener('focus', () => {
                this.addDropdownFocus(select);
            });
            
            select.addEventListener('blur', () => {
                this.removeDropdownFocus(select);
            });
            
            // Add hover effects
            select.addEventListener('mouseenter', () => {
                this.addDropdownHover(select);
            });
            
            select.addEventListener('mouseleave', () => {
                this.removeDropdownHover(select);
            });
        });
    }

    animateDropdownChange(select) {
        // Add a brief highlight animation
        select.style.transform = 'scale(1.02)';
        select.style.boxShadow = '0 0 0 4px var(--accent-color-alpha), 0 8px 25px rgba(226, 183, 20, 0.2)';
        
        setTimeout(() => {
            select.style.transform = 'scale(1)';
            select.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }, 200);
        
        // Show a brief success indicator
        this.showDropdownSuccess(select);
    }

    addDropdownFocus(select) {
        select.parentElement.classList.add('focused');
        select.style.borderColor = 'var(--accent-color)';
        select.style.backgroundColor = 'rgba(226, 183, 20, 0.08)';
    }

    removeDropdownFocus(select) {
        select.parentElement.classList.remove('focused');
        select.style.borderColor = 'var(--border-color)';
        select.style.backgroundColor = 'var(--input-bg)';
    }

    addDropdownHover(select) {
        select.style.borderColor = 'var(--accent-color)';
        select.style.backgroundColor = 'rgba(226, 183, 20, 0.05)';
    }

    removeDropdownHover(select) {
        if (!select.parentElement.classList.contains('focused')) {
            select.style.borderColor = 'var(--border-color)';
            select.style.backgroundColor = 'var(--input-bg)';
        }
    }

    showDropdownSuccess(select) {
        const successIndicator = document.createElement('div');
        successIndicator.className = 'dropdown-success';
        successIndicator.innerHTML = '✓';
        successIndicator.style.cssText = `
            position: absolute;
            right: 60px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--success-color);
            font-weight: bold;
            font-size: 1.2rem;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            z-index: 10;
        `;
        
        select.parentElement.style.position = 'relative';
        select.parentElement.appendChild(successIndicator);
        
        // Animate in
        setTimeout(() => {
            successIndicator.style.opacity = '1';
        }, 50);
        
        // Animate out
        setTimeout(() => {
            successIndicator.style.opacity = '0';
            setTimeout(() => {
                if (successIndicator.parentElement) {
                    successIndicator.remove();
                }
            }, 300);
        }, 1000);
    }

    generateWords() {
        const wordCount = parseInt(this.wordCount.value);
        const difficulty = this.difficulty.value;
        const practiceMode = this.practiceMode.value;
        const paragraphLength = this.paragraphLength.value;
        
        let totalWords;
        switch (paragraphLength) {
            case 'short': totalWords = Math.max(wordCount * 2, 50); break;
            case 'medium': totalWords = Math.max(wordCount * 3, 100); break;
            case 'long': totalWords = Math.max(wordCount * 4, 200); break;
            case 'extended': totalWords = Math.max(wordCount * 6, 400); break;
            default: totalWords = Math.max(wordCount * 3, 100);
        }
        
        if (practiceMode === 'focused' && Object.keys(this.keyMistakes).length > 0) {
            this.words = this.generateFocusedPracticeWords(totalWords, difficulty);
        } else if (practiceMode === 'paragraph') {
            this.words = this.generateParagraphWords(totalWords, difficulty);
        } else {
            this.words = this.generateNormalWords(totalWords, difficulty);
        }
        
        this.renderWords();
    }

    generateNormalWords(totalWords, difficulty) {
        const words = [];
        for (let i = 0; i < totalWords; i++) {
            words.push(this.getRandomWord(difficulty));
        }
        return words;
    }

    generateFocusedPracticeWords(totalWords, difficulty) {
        const words = [];
        const missedKeys = Object.keys(this.keyMistakes).sort((a, b) => 
            this.keyMistakes[b] - this.keyMistakes[a]
        );
        
        // Generate words with more focus on frequently missed keys
        for (let i = 0; i < totalWords; i++) {
            if (i % 3 === 0 && missedKeys.length > 0) {
                // Every 3rd word should contain frequently missed keys
                const targetKey = missedKeys[Math.floor(Math.random() * Math.min(3, missedKeys.length))];
                words.push(this.getWordWithKey(targetKey, difficulty));
            } else {
                words.push(this.getRandomWord(difficulty));
            }
        }
        return words;
    }

    generateParagraphWords(totalWords, difficulty) {
        const words = [];
        const paragraphs = this.getPracticeParagraphs(difficulty);
        
        for (const paragraph of paragraphs) {
            const paragraphWords = paragraph.split(' ');
            words.push(...paragraphWords);
            if (words.length >= totalWords) break;
        }
        
        // If we don't have enough words, add random words
        while (words.length < totalWords) {
            words.push(this.getRandomWord(difficulty));
        }
        
        return words.slice(0, totalWords);
    }

    getWordWithKey(targetKey, difficulty) {
        const keyWords = this.getWordsContainingKey(targetKey, difficulty);
        if (keyWords.length > 0) {
            return keyWords[Math.floor(Math.random() * keyWords.length)];
        }
        return this.getRandomWord(difficulty);
    }

    getWordsContainingKey(key, difficulty) {
        const allWords = this.getAllWords(difficulty);
        return allWords.filter(word => word.toLowerCase().includes(key.toLowerCase()));
    }

    getAllWords(difficulty) {
        const baseWords = [
            'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
            'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
            'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
            'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over',
            'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these',
            'give', 'day', 'most', 'us', 'here', 'thing', 'should', 'try', 'need', 'feel', 'three', 'state', 'never', 'become', 'something', 'much', 'call',
            'world', 'own', 'place', 'problem', 'same', 'tell', 'early', 'fact', 'course', 'hand', 'move', 'right', 'group', 'part', 'question', 'turn',
            'program', 'lead', 'keep', 'understand', 'company', 'system', 'each', 'might', 'great', 'such', 'through', 'during', 'begin', 'life', 'always',
            'those', 'both', 'paper', 'together', 'got', 'group', 'often', 'important', 'until', 'side', 'feet', 'car', 'mile', 'night', 'walk', 'white',
            'sea', 'began', 'grow', 'took', 'river', 'four', 'carry', 'state', 'once', 'book', 'hear', 'stop', 'without', 'second', 'later', 'miss',
            'idea', 'enough', 'eat', 'face', 'watch', 'far', 'Indian', 'real', 'almost', 'let', 'above', 'girl', 'sometimes', 'mountain', 'cut', 'young',
            'talk', 'soon', 'list', 'song', 'being', 'leave', 'family', 'it\'s', 'body', 'music', 'color', 'stand', 'sun', 'question', 'fish', 'area',
            'mark', 'dog', 'horse', 'birds', 'problem', 'complete', 'room', 'knew', 'since', 'ever', 'piece', 'told', 'usually', 'didn\'t', 'friends',
            'easy', 'heard', 'order', 'red', 'door', 'sure', 'become', 'top', 'ship', 'across', 'today', 'during', 'short', 'better', 'best', 'however',
            'low', 'hours', 'black', 'products', 'happened', 'whole', 'measure', 'remember', 'early', 'waves', 'reached', 'listen', 'wind', 'rock', 'space',
            'covered', 'fast', 'several', 'hold', 'himself', 'toward', 'five', 'step', 'morning', 'passed', 'vowel', 'true', 'hundred', 'against', 'pattern',
            'numeral', 'table', 'north', 'slowly', 'money', 'map', 'farm', 'pulled', 'draw', 'voice', 'seen', 'cold', 'cried', 'plan', 'notice', 'south',
            'sing', 'war', 'ground', 'fall', 'king', 'town', 'I\'ll', 'unit', 'figure', 'certain', 'field', 'travel', 'wood', 'fire', 'upon'
        ];
        
        if (difficulty === 'medium') {
            return [...baseWords, ...this.getMediumWords()];
        } else if (difficulty === 'hard') {
            return [...baseWords, ...this.getMediumWords(), ...this.getHardWords()];
        } else if (difficulty === 'expert') {
            return [...baseWords, ...this.getMediumWords(), ...this.getHardWords(), ...this.getExpertWords()];
        }
        
        return baseWords;
    }

    getMediumWords() {
        return [
            'computer', 'technology', 'information', 'development', 'experience', 'knowledge', 'education', 'government', 'community', 'business',
            'different', 'important', 'beautiful', 'difficult', 'necessary', 'successful', 'wonderful', 'excellent', 'fantastic', 'amazing',
            'understand', 'everything', 'something', 'anything', 'everybody', 'somebody', 'nobody', 'everywhere', 'somewhere', 'nowhere'
        ];
    }

    getHardWords() {
        return [
            'philosophy', 'psychology', 'sociology', 'anthropology', 'archaeology', 'biotechnology', 'cybersecurity', 'entrepreneurship',
            'sophisticated', 'revolutionary', 'extraordinary', 'unprecedented', 'comprehensive', 'contemporary', 'international', 'technological',
            'responsibility', 'opportunity', 'possibility', 'probability', 'capability', 'flexibility', 'reliability', 'sustainability'
        ];
    }

    getExpertWords() {
        return [
            'supercalifragilisticexpialidocious', 'pneumonoultramicroscopicsilicovolcanoconios', 'hippopotomonstrosesquippedaliophobia',
            'antidisestablishmentarianism', 'floccinaucinihilipilification', 'sesquipedalian', 'quintessential', 'serendipitous',
            'epistemological', 'ontological', 'metaphysical', 'phenomenological', 'hermeneutical', 'deconstructionist', 'poststructuralist'
        ];
    }

    getRandomWord(difficulty = 'easy') {
        const words = this.getAllWords(difficulty);
        return words[Math.floor(Math.random() * words.length)];
    }

    getPracticeParagraphs(difficulty) {
        const paragraphs = [
            "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once. Pangrams are often used to display font samples and test keyboards. They provide a comprehensive way to showcase all the characters in a typeface.",
            "Programming is the art of telling another human being what one wants the computer to do. It requires logical thinking, problem-solving skills, and attention to detail. Good code is not just functional but also readable and maintainable.",
            "The Internet is a global system of interconnected computer networks that use the standard Internet protocol suite to link devices worldwide. It carries a vast range of information resources and services, such as the inter-linked hypertext documents and applications of the World Wide Web.",
            "Artificial intelligence is the simulation of human intelligence in machines that are programmed to think and learn like humans. These machines can perform tasks that typically require human intelligence, such as visual perception, speech recognition, decision-making, and language translation.",
            "Climate change refers to long-term shifts in global or regional climate patterns. It encompasses both global warming driven by human emissions of greenhouse gases and the resulting large-scale shifts in weather patterns."
        ];
        
        if (difficulty === 'medium') {
            paragraphs.push(
                "The human brain is the command center for the human nervous system. It receives signals from the body's sensory organs and outputs information to the muscles. The human brain has the same basic structure as other mammal brains but is larger in relation to body size than any other brains."
            );
        } else if (difficulty === 'hard') {
            paragraphs.push(
                "Quantum mechanics is a fundamental theory in physics that describes the behavior of matter and energy at the atomic and subatomic level. It introduces concepts such as superposition, entanglement, and wave-particle duality that challenge our classical understanding of reality."
            );
        } else if (difficulty === 'expert') {
            paragraphs.push(
                "The Riemann hypothesis is one of the most important unsolved problems in mathematics. It concerns the distribution of the non-trivial zeros of the Riemann zeta function, which is intimately connected to the distribution of prime numbers. A proof would have profound implications for number theory and many other areas of mathematics."
            );
        }
        
        return paragraphs;
    }

    renderWords() {
        this.wordsContainer.innerHTML = '';
        const wordsPerLine = parseInt(this.wordCount.value);
        
        for (let i = 0; i < this.words.length; i++) {
            const wordSpan = document.createElement('span');
            wordSpan.textContent = this.words[i];
            wordSpan.className = 'word';
            wordSpan.dataset.index = i;
            
            if (i === this.currentWordIndex) {
                wordSpan.classList.add('current');
            } else if (i < this.currentWordIndex) {
                if (this.typedWords[i] && this.typedWords[i].correct) {
                    wordSpan.classList.add('correct');
                } else if (this.typedWords[i]) {
                    wordSpan.classList.add('incorrect');
                } else {
                    wordSpan.classList.add('typed');
                }
            }
            
            this.wordsContainer.appendChild(wordSpan);
            
            // Add line breaks
            if ((i + 1) % wordsPerLine === 0 && i < this.words.length - 1) {
                this.wordsContainer.appendChild(document.createElement('br'));
            }
        }
    }

    handleInput(e) {
        if (!this.isTestActive) {
            this.startTest();
        }

        const inputValue = e.target.value;
        const currentWord = this.words[this.currentWordIndex];
        
        if (inputValue.endsWith(' ')) {
            this.checkWord(inputValue.trim());
            e.target.value = '';
            this.currentWordIndex++;
            
            if (this.currentWordIndex >= this.words.length) {
                this.generateWords();
                this.currentWordIndex = 0;
            }
            
            this.renderWords();
        }
        
        this.updateStats();
    }

    handleKeydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const inputValue = this.typingInput.value.trim();
            if (inputValue) {
                this.checkWord(inputValue);
                this.typingInput.value = '';
                this.currentWordIndex++;
                
                if (this.currentWordIndex >= this.words.length) {
                    this.generateWords();
                    this.currentWordIndex = 0;
                }
                
                this.renderWords();
            }
        }
    }

    checkWord(typedWord) {
        const currentWord = this.words[this.currentWordIndex];
        const isCorrect = typedWord === currentWord;
        
        this.typedWords[this.currentWordIndex] = {
            word: currentWord,
            typed: typedWord,
            correct: isCorrect
        };
        
        this.totalCharacters += currentWord.length;
        if (isCorrect) {
            this.correctCharacters += currentWord.length;
        } else {
            // Track key mistakes for focused practice
            this.trackKeyMistakes(currentWord, typedWord);
        }
    }

    trackKeyMistakes(originalWord, typedWord) {
        if (this.keyTracking.value === 'disabled') return;
        
        const minLength = Math.min(originalWord.length, typedWord.length);
        
        for (let i = 0; i < minLength; i++) {
            if (originalWord[i] !== typedWord[i]) {
                const missedKey = originalWord[i];
                this.keyMistakes[missedKey] = (this.keyMistakes[missedKey] || 0) + 1;
                this.totalKeyPresses++;
            }
        }
        
        // Track extra or missing characters
        if (typedWord.length > originalWord.length) {
            for (let i = originalWord.length; i < typedWord.length; i++) {
                const extraKey = typedWord[i];
                this.keyMistakes[extraKey] = (this.keyMistakes[extraKey] || 0) + 1;
                this.totalKeyPresses++;
            }
        }
        
        this.updateKeyStats();
    }

    updateKeyStats() {
        if (this.keyTracking.value === 'disabled') {
            this.keyStatsPanel.style.display = 'none';
            return;
        }
        
        this.keyStatsPanel.style.display = 'block';
        this.keyStatsGrid.innerHTML = '';
        
        const sortedKeys = Object.entries(this.keyMistakes)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10); // Show top 10 missed keys
        
        if (sortedKeys.length === 0) {
            this.keyStatsGrid.innerHTML = '<p>No mistakes yet! Keep typing to see your key statistics.</p>';
            return;
        }
        
        sortedKeys.forEach(([key, count]) => {
            const keyStat = document.createElement('div');
            keyStat.className = 'key-stat';
            keyStat.innerHTML = `
                <span class="key-char">${key}</span>
                <span class="key-count">${count}</span>
                <span class="key-percentage">${Math.round((count / this.totalKeyPresses) * 100)}%</span>
            `;
            this.keyStatsGrid.appendChild(keyStat);
        });
    }

    updatePracticeMode() {
        this.currentPracticeMode = this.practiceMode.value;
        this.generateWords();
    }

    updateKeyTracking() {
        this.updateKeyStats();
    }

    generatePracticeParagraph() {
        const difficulty = this.difficulty.value;
        const paragraphLength = this.paragraphLength.value;
        
        // Generate a focused practice paragraph based on missed keys
        let practiceText = '';
        
        if (Object.keys(this.keyMistakes).length > 0) {
            const missedKeys = Object.keys(this.keyMistakes).sort((a, b) => 
                this.keyMistakes[b] - this.keyMistakes[a]
            );
            
            // Create sentences that emphasize frequently missed keys
            practiceText = this.createFocusedPracticeText(missedKeys.slice(0, 5), difficulty, paragraphLength);
        } else {
            // Generate a general practice paragraph
            practiceText = this.createGeneralPracticeText(difficulty, paragraphLength);
        }
        
        // Replace the current words with the practice paragraph
        this.words = practiceText.split(' ');
        this.currentWordIndex = 0;
        this.typedWords = [];
        this.renderWords();
        
        // Show a notification
        this.showNotification('Practice paragraph generated! Focus on improving your accuracy.');
    }

    createFocusedPracticeText(missedKeys, difficulty, paragraphLength) {
        const sentences = [];
        const baseSentences = [
            `Practice makes perfect when typing ${missedKeys.join(', ')}.`,
            `The ${missedKeys[0]} key is important for accurate typing.`,
            `Focus on ${missedKeys.slice(0, 2).join(' and ')} to improve your speed.`,
            `Typing ${missedKeys.join(' and ')} correctly will boost your accuracy.`,
            `Remember to practice ${missedKeys[0]} and ${missedKeys[1]} regularly.`
        ];
        
        sentences.push(...baseSentences);
        
        // Add more sentences based on paragraph length
        if (paragraphLength === 'medium' || paragraphLength === 'long') {
            sentences.push(
                `Consistent practice with difficult keys like ${missedKeys.join(', ')} will help you become a better typist.`,
                `Don't rush when typing ${missedKeys[0]}, take your time to ensure accuracy.`,
                `The more you practice ${missedKeys.join(' and ')}, the more confident you'll become.`
            );
        }
        
        if (paragraphLength === 'long' || paragraphLength === 'extended') {
            sentences.push(
                `Advanced typing requires mastery of all keys, especially challenging ones like ${missedKeys.join(', ')}.`,
                `Professional typists spend extra time practicing difficult key combinations involving ${missedKeys.slice(0, 3).join(', ')}.`,
                `Your typing speed will naturally improve as you master the ${missedKeys.join(' and ')} keys.`
            );
        }
        
        return sentences.join(' ');
    }

    createGeneralPracticeText(difficulty, paragraphLength) {
        const paragraphs = this.getPracticeParagraphs(difficulty);
        let selectedParagraph = paragraphs[Math.floor(Math.random() * paragraphs.length)];
        
        // Extend the paragraph based on length requirement
        if (paragraphLength === 'medium') {
            selectedParagraph += ' ' + this.getAdditionalSentences(difficulty, 2);
        } else if (paragraphLength === 'long') {
            selectedParagraph += ' ' + this.getAdditionalSentences(difficulty, 4);
        } else if (paragraphLength === 'extended') {
            selectedParagraph += ' ' + this.getAdditionalSentences(difficulty, 6);
        }
        
        return selectedParagraph;
    }

    getAdditionalSentences(difficulty, count) {
        const additionalSentences = {
            easy: [
                "Practice regularly to improve your typing skills.",
                "Start with simple words and gradually increase difficulty.",
                "Focus on accuracy before trying to increase speed."
            ],
            medium: [
                "Intermediate typists should practice with varied content.",
                "Include numbers and punctuation in your practice sessions.",
                "Challenge yourself with different writing styles and topics."
            ],
            hard: [
                "Advanced typing requires mastery of complex vocabulary.",
                "Practice with technical documents and academic texts.",
                "Focus on maintaining accuracy at higher speeds."
            ],
            expert: [
                "Expert typists can handle any type of content efficiently.",
                "Master the art of typing without looking at the keyboard.",
                "Achieve consistent high speeds with excellent accuracy."
            ]
        };
        
        const sentences = additionalSentences[difficulty] || additionalSentences.easy;
        const selected = [];
        
        for (let i = 0; i < count && i < sentences.length; i++) {
            selected.push(sentences[i]);
        }
        
        return selected.join(' ');
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    startTest() {
        this.isTestActive = true;
        this.startTime = Date.now();
        this.startTimer();
        this.typingInput.focus();
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            
            if (this.timeLeft <= 0) {
                this.endTest();
            }
        }, 1000);
    }

    endTest() {
        this.isTestActive = false;
        clearInterval(this.timer);
        this.typingInput.disabled = true;
        this.showResults();
    }

    showResults() {
        const finalStats = this.calculateFinalStats();
        
        this.finalWpmElement.textContent = Math.round(finalStats.wpm);
        this.finalAccuracyElement.textContent = finalStats.accuracy + '%';
        this.finalWordsElement.textContent = finalStats.totalWords;
        this.finalCharactersElement.textContent = finalStats.totalCharacters;
        
        this.results.style.display = 'block';
        this.results.scrollIntoView({ behavior: 'smooth' });
    }

    calculateFinalStats() {
        const totalWords = this.typedWords.filter(w => w).length;
        const correctWords = this.typedWords.filter(w => w && w.correct).length;
        const accuracy = this.totalCharacters > 0 ? Math.round((this.correctCharacters / this.totalCharacters) * 100) : 100;
        
        // Calculate WPM (words per minute)
        const timeElapsed = (Date.now() - this.startTime) / 1000 / 60; // in minutes
        const wpm = timeElapsed > 0 ? Math.round(correctWords / timeElapsed) : 0;
        
        return {
            wpm,
            accuracy,
            totalWords,
            totalCharacters: this.totalCharacters
        };
    }

    updateStats() {
        if (!this.isTestActive) return;
        
        const currentStats = this.calculateCurrentStats();
        this.wpmElement.textContent = Math.round(currentStats.wpm);
        this.accuracyElement.textContent = currentStats.accuracy + '%';
        this.charactersElement.textContent = this.totalCharacters;
    }

    calculateCurrentStats() {
        const timeElapsed = (Date.now() - this.startTime) / 1000 / 60; // in minutes
        const correctWords = this.typedWords.filter(w => w && w.correct).length;
        const wpm = timeElapsed > 0 ? correctWords / timeElapsed : 0;
        const accuracy = this.totalCharacters > 0 ? (this.correctCharacters / this.totalCharacters) * 100 : 100;
        
        return { wpm, accuracy };
    }

    updateDisplay() {
        this.timeElement.textContent = this.timeLeft + 's';
    }

    restartTest() {
        this.resetTest();
        this.typingInput.disabled = false;
        this.typingInput.focus();
    }

    startNewTest() {
        this.results.style.display = 'none';
        this.resetTest();
        this.typingInput.disabled = false;
        this.typingInput.focus();
    }

    resetTest() {
        this.currentWordIndex = 0;
        this.isTestActive = false;
        this.typedWords = [];
        this.totalCharacters = 0;
        this.correctCharacters = 0;
        this.typingInput.value = '';
        
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.updateTimeLimit();
        this.generateWords();
        this.updateDisplay();
        this.updateStats();
        this.updateKeyStats();
    }

    updateTimeLimit() {
        this.timeLeft = parseInt(this.timeSelect.value);
        this.updateDisplay();
    }

    toggleSound() {
        const soundIcon = this.soundToggle.querySelector('.sound-icon');
        const isActive = this.soundToggle.classList.contains('active');
        
        if (isActive) {
            this.soundToggle.classList.remove('active');
            soundIcon.textContent = '🔇';
            soundIcon.title = 'Sound Disabled';
        } else {
            this.soundToggle.classList.add('active');
            soundIcon.textContent = '🔊';
            soundIcon.title = 'Sound Enabled';
        }
        
        // Store preference in localStorage
        localStorage.setItem('typingProSoundEnabled', !isActive);
    }

    initializeSoundPreference() {
        const isSoundEnabled = localStorage.getItem('typingProSoundEnabled') === 'true';
        if (isSoundEnabled) {
            this.soundToggle.classList.add('active');
            this.soundToggle.querySelector('.sound-icon').textContent = '🔊';
            this.soundToggle.querySelector('.sound-icon').title = 'Sound Enabled';
        } else {
            this.soundToggle.classList.remove('active');
            this.soundToggle.querySelector('.sound-icon').textContent = '🔇';
            this.soundToggle.querySelector('.sound-icon').title = 'Sound Disabled';
        }
    }
}



// Initialize the typing test when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TypingTest();
});
