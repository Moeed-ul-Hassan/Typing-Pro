# Typing Pro API Documentation 📚

This document provides detailed information about the Typing Pro application's internal API and architecture.

## 🏗️ Architecture Overview

Typing Pro is built using vanilla JavaScript with a modular class-based architecture. The main application is controlled by the `TypingTest` class, which manages all functionality including word generation, statistics tracking, and user interactions.

## 📦 Core Classes

### TypingTest Class

The main application class that orchestrates all functionality.

#### Constructor
```javascript
new TypingTest()
```
Initializes the application, sets up event listeners, and generates the initial word set.

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `words` | Array<string> | Current set of words for typing |
| `currentWordIndex` | number | Index of the current word being typed |
| `startTime` | number | Timestamp when test started |
| `isTestActive` | boolean | Whether a test is currently running |
| `timer` | number | Interval timer reference |
| `timeLeft` | number | Remaining time in seconds |
| `typedWords` | Array<object> | Array of typed word objects |
| `totalCharacters` | number | Total characters typed |
| `correctCharacters` | number | Correctly typed characters |
| `keyMistakes` | object | Tracking of frequently missed keys |
| `totalKeyPresses` | number | Total key presses made |
| `mistakeHistory` | Array | History of typing mistakes |
| `practiceParagraphs` | Array | Available practice paragraphs |
| `currentPracticeMode` | string | Current practice mode setting |

#### Methods

##### Word Generation
```javascript
generateWords()
```
Generates new words based on current settings and practice mode.

```javascript
generateNormalWords(totalWords, difficulty)
```
Generates random words for normal practice mode.

```javascript
generateFocusedPracticeWords(totalWords, difficulty)
```
Generates words focusing on frequently missed keys.

```javascript
generateParagraphWords(totalWords, difficulty)
```
Generates words from practice paragraphs.

##### Key Tracking
```javascript
trackKeyMistakes(originalWord, typedWord)
```
Analyzes typing mistakes and updates key statistics.

```javascript
updateKeyStats()
```
Updates the display of key statistics.

##### Practice Content
```javascript
generatePracticeParagraph()
```
Creates a focused practice paragraph based on user mistakes.

```javascript
createFocusedPracticeText(missedKeys, difficulty, paragraphLength)
```
Generates practice text emphasizing frequently missed keys.

##### Test Management
```javascript
startTest()
```
Begins a new typing test.

```javascript
endTest()
```
Completes the current test and shows results.

```javascript
restartTest()
```
Resets and restarts the current test.

```javascript
resetTest()
```
Completely resets the test state.

## 🎯 Event System

### Input Events
```javascript
typingInput.addEventListener('input', handleInput)
typingInput.addEventListener('keydown', handleKeydown)
```

### Button Events
```javascript
restartBtn.addEventListener('click', restartTest)
newTestBtn.addEventListener('click', startNewTest)
generatePracticeBtn.addEventListener('click', generatePracticeParagraph)
```

### Settings Events
```javascript
timeSelect.addEventListener('change', updateTimeLimit)
wordCount.addEventListener('change', generateWords)
difficulty.addEventListener('change', generateWords)
practiceMode.addEventListener('change', updatePracticeMode)
paragraphLength.addEventListener('change', generateWords)
keyTracking.addEventListener('change', updateKeyTracking)
```

## 📊 Data Structures

### Typed Word Object
```javascript
{
    word: string,        // Original word
    typed: string,       // What user actually typed
    correct: boolean     // Whether it was typed correctly
}
```

### Key Mistake Object
```javascript
{
    [key]: number        // Key character -> mistake count
}
```

### Practice Paragraph Object
```javascript
{
    text: string,        // Paragraph content
    difficulty: string,  // Difficulty level
    length: string       // Length category
}
```

## 🔧 Configuration Options

### Test Duration
- `15`: 15 seconds
- `30`: 30 seconds
- `60`: 1 minute (default)
- `120`: 2 minutes
- `300`: 5 minutes
- `600`: 10 minutes

### Words Per Line
- `8`: 8 words per line (default)
- `10`: 10 words per line
- `12`: 12 words per line
- `15`: 15 words per line

### Difficulty Levels
- `easy`: Basic vocabulary
- `medium`: Intermediate words
- `hard`: Advanced vocabulary
- `expert`: Complex technical terms

### Practice Modes
- `normal`: Standard typing test
- `focused`: Targeted practice on weak keys
- `paragraph`: Real-world content practice

### Paragraph Lengths
- `short`: 50-100 words
- `medium`: 100-200 words
- `long`: 200-400 words
- `extended`: 400+ words

## 📈 Statistics Calculation

### WPM (Words Per Minute)
```javascript
const timeElapsed = (Date.now() - startTime) / 1000 / 60;
const wpm = timeElapsed > 0 ? correctWords / timeElapsed : 0;
```

### Accuracy
```javascript
const accuracy = totalCharacters > 0 ? 
    (correctCharacters / totalCharacters) * 100 : 100;
```

### Key Mistake Percentage
```javascript
const percentage = (count / totalKeyPresses) * 100;
```

## 🎨 UI Components

### Words Container
```javascript
const wordsContainer = document.getElementById('wordsContainer');
```
Displays the current word set with visual indicators for:
- Current word (highlighted)
- Correctly typed words (green)
- Incorrectly typed words (red)
- Untyped words (default)

### Statistics Bar
```javascript
const statsBar = document.querySelector('.stats-bar');
```
Shows real-time:
- Time remaining
- Current WPM
- Current accuracy
- Character count

### Settings Panel
```javascript
const settings = document.querySelector('.settings');
```
Contains all configuration options with enhanced dropdowns and visual feedback.

### Key Statistics Panel
```javascript
const keyStatsPanel = document.getElementById('keyStatsPanel');
```
Displays frequently missed keys with:
- Key character
- Mistake count
- Mistake percentage

## 🔄 State Management

### Test States
1. **Inactive**: No test running
2. **Active**: Test in progress
3. **Completed**: Test finished, showing results

### Word States
1. **Untyped**: Word not yet reached
2. **Current**: Word currently being typed
3. **Correct**: Word typed correctly
4. **Incorrect**: Word typed incorrectly

### Practice States
1. **Normal**: Standard word generation
2. **Focused**: Targeted practice mode
3. **Paragraph**: Paragraph-based content

## 🚀 Performance Considerations

### Memory Management
- Event listeners are properly cleaned up
- Timer intervals are cleared when not needed
- DOM manipulation is minimized

### Rendering Optimization
- Words are rendered in batches
- DOM updates are batched where possible
- CSS animations use hardware acceleration

### Data Structures
- Efficient array operations for word management
- Object-based key tracking for O(1) lookups
- Minimal object creation during typing

## 🔒 Security Features

### Input Sanitization
- All user input is validated
- No eval() or dangerous functions
- XSS protection through proper escaping

### Data Privacy
- All data stays local to the browser
- No external data transmission
- User privacy is maintained

## 🧪 Testing

### Manual Testing Checklist
- [ ] All practice modes work correctly
- [ ] Statistics calculate accurately
- [ ] Key tracking functions properly
- [ ] UI responds correctly to all inputs
- [ ] Accessibility features work

### Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 📝 Error Handling

### Common Error Scenarios
1. **Invalid input**: Graceful fallback to defaults
2. **Timer issues**: Proper cleanup and restart
3. **DOM errors**: Error boundaries and fallbacks
4. **Memory issues**: Automatic cleanup and optimization

### Error Recovery
- Automatic test restart on critical errors
- Graceful degradation of features
- User-friendly error messages
- Automatic state recovery

## 🔮 Future Enhancements

### Planned API Extensions
- WebSocket support for multiplayer
- Local storage for progress persistence
- Service Worker for offline support
- WebAssembly for performance-critical operations

### Plugin System
- Custom word generators
- Alternative statistics engines
- Theme customization
- Practice content providers

---

This API documentation is maintained alongside the codebase. For the most up-to-date information, refer to the source code and inline documentation.
