// Letter data with emoji images and phonetic sounds
const letterData = {
    A: { image: '🍎', word: 'Apple', sound: 'ah' },
    B: { image: '🐻', word: 'Bear', sound: 'buh' },
    C: { image: '🐱', word: 'Cat', sound: 'kuh' },
    D: { image: '🐕', word: 'Dog', sound: 'duh' },
    E: { image: '🐘', word: 'Elephant', sound: 'eh' },
    F: { image: '🐸', word: 'Frog', sound: 'fuh' },
    G: { image: '🍇', word: 'Grapes', sound: 'guh' },
    H: { image: '🏠', word: 'House', sound: 'huh' },
    I: { image: '🍦', word: 'Ice cream', sound: 'ih' },
    J: { image: '🪼', word: 'Jellyfish', sound: 'juh' },
    K: { image: '🪁', word: 'Kite', sound: 'kuh' },
    L: { image: '🦁', word: 'Lion', sound: 'luh' },
    M: { image: '🐭', word: 'Mouse', sound: 'muh' },
    N: { image: '👃', word: 'Nose', sound: 'nuh' },
    O: { image: '🍊', word: 'Orange', sound: 'oh' },
    P: { image: '🐷', word: 'Pig', sound: 'puh' },
    Q: { image: '👑', word: 'Queen', sound: 'kwuh' },
    R: { image: '🌈', word: 'Rainbow', sound: 'ruh' },
    S: { image: '☀️', word: 'Sun', sound: 'sss' },
    T: { image: '🐢', word: 'Turtle', sound: 'tuh' },
    U: { image: '☂️', word: 'Umbrella', sound: 'uh' },
    V: { image: '🎻', word: 'Violin', sound: 'vuh' },
    W: { image: '🐋', word: 'Whale', sound: 'wuh' },
    X: { image: '🦴', word: 'X-ray', sound: 'ks' },
    Y: { image: '🪀', word: 'Yo-yo', sound: 'yuh' },
    Z: { image: '🦓', word: 'Zebra', sound: 'zuh' }
};

// Letter name pronunciations for speech
const letterNames = {
    A: 'ay', B: 'bee', C: 'see', D: 'dee', E: 'ee', F: 'eff',
    G: 'jee', H: 'aitch', I: 'eye', J: 'jay', K: 'kay', L: 'ell',
    M: 'em', N: 'en', O: 'oh', P: 'pee', Q: 'cue', R: 'are',
    S: 'ess', T: 'tee', U: 'you', V: 'vee', W: 'double you',
    X: 'ex', Y: 'why', Z: 'zee'
};

// Celebration emojis
const celebrationEmojis = ['🎉', '⭐', '🌟', '✨', '🎊', '👏', '🥳', '💫', '🏆', '👍'];
const confettiColors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181', '#aa96da', '#fcbad3'];

// Game state
let currentLetter = 'A';
let letters = Object.keys(letterData);
let usedLetters = [];

// DOM elements
const currentLetterEl = document.getElementById('currentLetter');
const letterImageEl = document.getElementById('letterImage');
const letterWordEl = document.getElementById('letterWord');
const celebrationEl = document.getElementById('celebration');
const keys = document.querySelectorAll('.key');

// Initialize the game
function init() {
    // Set up click handlers for on-screen keyboard
    keys.forEach(key => {
        key.addEventListener('click', () => handleKeyPress(key.dataset.key));
    });

    // Set up physical keyboard listener
    document.addEventListener('keydown', (e) => {
        const key = e.key.toUpperCase();
        if (letterData[key]) {
            handleKeyPress(key);
            // Visual feedback for physical keyboard press
            const keyEl = document.querySelector(`[data-key="${key}"]`);
            if (keyEl) {
                keyEl.classList.add('pressed');
                setTimeout(() => keyEl.classList.remove('pressed'), 150);
            }
        }
    });

    // Start with a random letter
    selectRandomLetter();
}

// Select a random letter
function selectRandomLetter() {
    // If all letters have been used, reset
    if (usedLetters.length >= letters.length) {
        usedLetters = [];
    }

    // Get available letters
    const availableLetters = letters.filter(l => !usedLetters.includes(l));
    
    // Pick a random one
    const randomIndex = Math.floor(Math.random() * availableLetters.length);
    currentLetter = availableLetters[randomIndex];
    usedLetters.push(currentLetter);

    // Update display
    updateDisplay();
    
    // Speak the letter after a short delay
    setTimeout(() => speakLetter(), 500);
}

// Update the display with current letter
function updateDisplay() {
    const data = letterData[currentLetter];
    
    // Add fade out animation
    currentLetterEl.style.animation = 'none';
    letterImageEl.style.animation = 'none';
    
    // Trigger reflow
    currentLetterEl.offsetHeight;
    letterImageEl.offsetHeight;
    
    // Update content
    currentLetterEl.textContent = currentLetter;
    letterImageEl.textContent = data.image;
    letterWordEl.textContent = data.word;
    
    // Restart animations
    currentLetterEl.style.animation = 'fadeIn 0.5s ease-out, letterPulse 2s ease-in-out infinite';
    letterImageEl.style.animation = 'fadeIn 0.5s ease-out, float 3s ease-in-out infinite';
    
    // Highlight the correct key
    highlightKey(currentLetter);
}

// Highlight the key to press
function highlightKey(letter) {
    // Remove highlight from all keys
    keys.forEach(key => key.classList.remove('highlight'));
    
    // Add highlight to correct key
    const targetKey = document.querySelector(`[data-key="${letter}"]`);
    if (targetKey) {
        targetKey.classList.add('highlight');
    }
}

// Handle key press
function handleKeyPress(key) {
    if (key === currentLetter) {
        // Correct key pressed!
        celebrate();
        
        // Wait for celebration, then next letter
        setTimeout(() => {
            selectRandomLetter();
        }, 1500);
    }
}

// Speak the letter name, word, and sound
function speakLetter() {
    const data = letterData[currentLetter];
    const letterName = letterNames[currentLetter];
    
    // Create speech utterances
    const synth = window.speechSynthesis;
    
    // Cancel any ongoing speech
    synth.cancel();
    
    // Sequence: Letter name -> Word -> Sound
    const toSpeak = [
        currentLetter,  // Just say the letter
        data.word,      // The word
        data.sound      // The phonetic sound
    ];
    
    let index = 0;
    
    function speakNext() {
        if (index < toSpeak.length) {
            const utterance = new SpeechSynthesisUtterance(toSpeak[index]);
            utterance.rate = 0.8;  // Slower for kids
            utterance.pitch = 1.1; // Slightly higher pitch
            utterance.onend = () => {
                index++;
                setTimeout(speakNext, 400); // Pause between words
            };
            synth.speak(utterance);
        }
    }
    
    speakNext();
}

// Celebration animation
function celebrate() {
    // Show celebration emoji
    const emoji = celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)];
    celebrationEl.querySelector('.celebration-emoji').textContent = emoji;
    celebrationEl.classList.add('active');
    
    // Create confetti
    createConfetti();
    
    // Hide celebration after delay
    setTimeout(() => {
        celebrationEl.classList.remove('active');
    }, 1200);
}

// Create confetti particles
function createConfetti() {
    const numConfetti = 30;
    
    for (let i = 0; i < numConfetti; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (Math.random() * 1 + 1) + 's';
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => confetti.remove(), 2000);
    }
}

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
