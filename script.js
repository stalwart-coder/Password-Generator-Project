let sliderVar = document.querySelector('.slider');
let numericVar = document.querySelector('.numeric-value-container');
let resultVar = document.querySelector('.result');
let copyBtnVar = document.querySelector('.copy-button');
let copiedMsgVar = document.querySelector('[copiedMsg]');
let upperCaseVar = document.querySelector('#uppercase');
let lowerCaseVar = document.querySelector('#lowercase');
let numberVar = document.querySelector('#number');
let symbolVar = document.querySelector('#symbol');
let strengthIndiVar = document.querySelector('.strength-indicator');
let genPassContVar = document.querySelector('.gen-pass-container');
let allCheckBoxVar = document.querySelectorAll('input[type=checkbox]');

let passLength = 8;
let password = "";
let checkCount = 1;
const symbols = "!@#$%^&*()_+{}[]|:;<>,.?/~`";
//it call first for default functionality or ui
sliderHandel();

// Update slider UI
function sliderHandel() {
    sliderVar.value = passLength;
    numericVar.innerText = passLength;
}

// Set password strength indicator color
function setColorIndicator(color, shadowColor) {
    strengthIndiVar.style.backgroundColor = color;
    strengthIndiVar.style.boxShadow = `0px 0px 10px ${shadowColor}`;
}

// Speech synthesis function
function speakMessage(message) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "hi-IN";
    utterance.rate = 1;
    utterance.pitch = 1;
    synth.speak(utterance);
}

// Generate a random number in a given range
function genRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// Generate a random number (0-9)
function genRandomNumber() {
    return genRandomInt(0, 10);
}

// Generate an uppercase letter
function genUpperCase() {
    return String.fromCharCode(genRandomInt(65, 91));
}

// Generate a lowercase letter
function genLowerCase() {
    return String.fromCharCode(genRandomInt(97, 123));
}

// Generate a random symbol
function genSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

// Calculate password strength
function calculateStrength() {
    let isUpper = upperCaseVar.checked;
    let isLower = lowerCaseVar.checked;
    let isNumber = numberVar.checked;
    let isSymbol = symbolVar.checked;
    let strengthMessage = "";

    if (isUpper && isLower && (isNumber || isSymbol) && passLength >= 8) {
        setColorIndicator("#00e676", "#00e676"); // Green (Strong)
        strengthMessage = "Your password is strong good luck man   ";
    } else if ((isLower || isUpper) && (isNumber || isSymbol) && passLength >= 6) {
        setColorIndicator("#ffcc00", "#ffcc00"); // Yellow (Medium)
        strengthMessage = "Your password is medium but you can improve .";
    } else {
        setColorIndicator("#ff4d4d", "#ff4d4d"); // Red (Weak)
        strengthMessage = "its look weak so its easy to break for someone.";
    }
    
    return strengthMessage;
}

// Copy password to clipboard
async function copyContent() {
    try {
        await navigator.clipboard.writeText(resultVar.value);
        copiedMsgVar.innerText = 'Copied!';
        speakMessage(`your password is copied`);
    } catch (e) {
        copiedMsgVar.innerText = "Copy Failed!";
    }

    copiedMsgVar.classList.add('active');
    setTimeout(() => copiedMsgVar.classList.remove('active'), 2000);
}

// Shuffle password using Fisher-Yates Algorithm
function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array.join('');
}

// Slider Event Listener
sliderVar.addEventListener('input', (ev) => {
    passLength = parseInt(ev.target.value);
    sliderHandel();
});

// Copy button event
copyBtnVar.addEventListener('click', () => {
    if (resultVar.value) {
        copyContent();
    }
});

// Handle checkbox changes
function checkboxChangeHandler() {
    checkCount = 0;
    allCheckBoxVar.forEach((checkbox) => {
        if (checkbox.checked) checkCount++;
    });
}

// Ensure password length is at least the number of selected options
if (passLength < checkCount) {
    passLength = checkCount;
    sliderHandel();
}

// Add event listener to checkboxes
allCheckBoxVar.forEach((checkbox) => {
    checkbox.addEventListener('change', checkboxChangeHandler);
});

// Generate password event
genPassContVar.addEventListener('click', () => {
    if (checkCount == 0) return; // If no checkboxes are selected, do nothing

    if (passLength < checkCount) {
        passLength = checkCount;
        sliderHandel();
    }

    password = "";
    let passArr = [];

    if (upperCaseVar.checked) passArr.push(genUpperCase);
    if (lowerCaseVar.checked) passArr.push(genLowerCase);
    if (numberVar.checked) passArr.push(genRandomNumber);
    if (symbolVar.checked) passArr.push(genSymbol);

    // Compulsory addition of each selected type
    for (let i = 0; i < passArr.length; i++) {
        password += passArr[i]();
    }

    // Add remaining characters
    for (let i = 0; i < passLength - passArr.length; i++) {
        let randomIndex = genRandomInt(0, passArr.length);
        password += passArr[randomIndex]();
    }

    // Shuffle password
    password = shufflePassword(Array.from(password));

    // Display password
    resultVar.value = password;

    // Get strength message and speak
    let strengthMessage = calculateStrength();
    speakMessage(`i am robot of bipin pal thanku for using me  Your${passLength} digit password is generated you can copy using copy button. ${strengthMessage}`);
});
