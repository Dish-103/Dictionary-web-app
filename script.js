// DOM Elements
const modeBtns = document.querySelectorAll('.mode-btn');
const modePanels = document.querySelectorAll('.mode-panel');
const wordInput = document.getElementById('wordInput');
const wordSearch = document.getElementById('wordSearch');
const wordResult = document.getElementById('wordResult');

// API URLs
const DICT_API = 'https://api.dictionaryapi.dev/api/v2/entries/en/';


// Mode Switching
modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        
        // Update active button
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Switch panels
        modePanels.forEach(panel => panel.classList.remove('active'));
        document.getElementById(`${mode}Mode`).classList.add('active');
    });
});

// Word Dictionary Functions
wordSearch.addEventListener('click', searchWord);
wordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchWord();
});

async function searchWord() {
    const word = wordInput.value.trim();
    if (!word) {
        showWordError('Please enter a word');
        return;
    }

    showLoading(wordResult);
    
    try {
        const response = await fetch(`${DICT_API}${word}`);
        const data = await response.json();

        if (response.ok && data.length > 0) {
            displayWordResult(data[0]);
        } else {
            showWordError('Word not found. Please try another word.');
        }
    } catch (error) {
        showWordError('Network error. Please try again.');
    }
}

function displayWordResult(data) {
    const word = data.word;
    const phonetic = data.phonetic || data.phonetics?.[0]?.text || 'Not available';
    const meanings = data.meanings[0];
    
    const audioSrc = data.phonetics?.find(p => p.audio)?.audio || '';
    const audioHTML = audioSrc ? `<button class="audio-btn" onclick="playAudio('${audioSrc}')">🔊 Play</button>` : '';

    const definition = meanings.definitions[0].definition;
    const example = meanings.definitions[0].example || 'Example not available';

    wordResult.innerHTML = `
        <div class="result-card">
            <div class="word-display">${word}</div>
            <div class="phonetic">${phonetic} ${audioHTML}</div>
            
            <div class="part-speech">${meanings.partOfSpeech}</div>
            <div class="definition">${definition}</div>
            
            <div class="example">
                <strong>💡 Example:</strong> ${example}
            </div>
        </div>
    `;
}

function showWordError(message) {
    wordResult.innerHTML = `<div class="result-card"><div class="error">${message}</div></div>`;
}

function showLoading(container) {
    container.innerHTML = `<div class="result-card"><div class="loading">🔍 Searching...</div></div>`;
}



// Audio Player
function playAudio(src) {
    const audio = new Audio(src);
    audio.play().catch(e => console.log('Audio play failed'));
}

// Clear inputs on mode switch
document.querySelector('[data-mode="word"]').addEventListener('click', () => {
    translateInput.value = '';
    translateResult.innerHTML = '';
});

document.querySelector('[data-mode="translate"]').addEventListener('click', () => {
    wordInput.value = '';
    wordResult.innerHTML = '';
});

