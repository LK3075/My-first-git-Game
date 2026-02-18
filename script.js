// === Keys ===
const operatorKey = {
    "TFW": "Transport For Wales",
    "C2C": "C2C",
    "CH": "Chiltern Railways",
    "EMR": "East Midlands Railway",
    "GC": "Grand Central",
    "GN": "Great Northern",
    "LNER": "LNER",
    "GWR": "Great Western Railway",
    "GX": "Gatwick Express",
    "HT": "Hull Trains",
    "LUMO": "LUMO",
    "WMT": "West Midlands Railway",
    "TFL": "Transport For London",
    "MER": "Mersyrail",
    "NT": "Northern",
    "SER": "South Eastern Railway",
    "SN": "Southern",
    "SCR": "Scotrail",
    "SWR": "South Western Railway",
    "TL": "Thamslink",
    "TPE": "Transpennine Express",
    "AWC": "Avanti West Coast",
    "XC": "Cross Country",
    "TWM": "Tyne and Wear Metro",
    "GA": "Greater Anglia"
};

const countryKey = {
    "SE": "South East England", "SW":"South West England", "EA":"East Anglia", "EM":"East Midlands",
    "WM":"West Midlands", "NE":"North East England", "NW":"North West England", "YH":"Yorkshire and Humber",
    "LON":"London", "W": "Wales", "S": "Scotland"
};

const funKey ={
    "word":"This station has more than one word in its name",
    "term":"Services can often terminate here",
    "thro":"This station has through lines",
    "dep": "This station is near depot",
    "jnc":"Services can branch off the line after departing before reaching another station",
    "int":"This station is a common interchange for other services/transport",
    "sea":"This station is near the seaside",
    "fut":"This station is near a stadium",
    "air":"This station is near an airport",
    "uni":"This station is near a university",
    "park":"This is a parkway station",
    "spa":"This is a spa station",
    "town":"This station serves a town/village",
    "city":"This station serves part of/all of a large town/city"
};

// === Messages ===
const startMessages = [
    'Give it your best shot..','How sharp is your railway knowledge?','How many can you get?',
    'Can YOU name the UK railway station?','Let the game begin...','Lets hope you stay on "track"...'
];
const guessPrompts = [
    'Give it your best shot..:','Give it a go..:','Your answer?:','What do you think?:',
    'Any ideas?:','Your guess..:','Take a guess:','Wanna try your luck?:','Whats your best guess?:',
];
const correctMessages = [
    'Good Job!','Well done!','Thats Right!','Thats Correct!','Correct Answer!','You got it!','Nice!',
    'Nice Job!','Good Work!','Correct. Well done!','Spot on!','Thats the right answer!','You figured it out!'
];
const incorrectMessages = ['Not quite...','Nope','Incorrect...'];
const guessedWrong = [
    "Not Quite... the answer was: {}",
    "Better luck next time. It was: {}",
    "Whoops... The Correct answer was: {}",
    "Round over! The answer was: {}"
];

// === Settings ===
const totalRounds = 5;
const startingClues = 4;
const maxGuesses = 10;

let totalScore = 0;
let stations = [];
let allStations = [];

// === DOM elements ===
const menu = document.getElementById("menu");
const playBtn = document.getElementById("playBtn");
const game = document.getElementById("game");
const roundText = document.getElementById("roundText");
const clueText = document.getElementById("clueText");
const guessInput = document.getElementById("guessInput");
const submitGuess = document.getElementById("submitGuess");
const resultText = document.getElementById("resultText");
const endButtons = document.getElementById("endButtons");
const playAgainBtn = document.getElementById("playAgainBtn");
const menuBtn = document.getElementById("menuBtn");
const gameMessage = document.getElementById("gameMessage");
const stationImage = document.getElementById("stationImage");
const autocompleteList = document.getElementById("autocompleteList");
const scoreDisplay = document.getElementById("scoreDisplay");
const guessesDisplay = document.getElementById("guessesDisplay");


guessInput.addEventListener("input", function() {
    const value = this.value.toLowerCase();
    autocompleteList.innerHTML = "";

    if (!value) return;

    const matches = allStations
        .map(s => s.name)
        .filter(name => name.toLowerCase().includes(value))
        .slice(0, 8); // max 8 suggestions

    matches.forEach(name => {
        const item = document.createElement("div");
        item.textContent = name;
        item.onclick = () => {
            guessInput.value = name;
            autocompleteList.innerHTML = "";
            guessInput.focus();
        };
        autocompleteList.appendChild(item);
    });
});

function showStationImage() {
    if (!currentStation.image) return;

    stationImage.src = currentStation.image;
    stationImage.style.display = "block";

    // restart animation cleanly
    stationImage.classList.remove("show");
    void stationImage.offsetWidth; // forces browser refresh

    // now fade in
    setTimeout(() => {
        stationImage.classList.add("show");
    }, 20);
}




guessInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {   // Check if Enter was pressed
        event.preventDefault();     // Prevent default Enter behavior
        submitGuess.click();        // Trigger the submit button click
    }
});


// === Load Stations JSON ===
fetch("StatList.json")
    .then(res => res.json())
    .then(data => {
        stations = [...data];      // game list
        allStations = [...data];   // autocomplete list
        console.log("Loaded", stations.length, "stations");
    })
    .catch(err => console.error("Error loading JSON:", err));

// === Helper ===
function randomChoice(arr) { return arr[Math.floor(Math.random()*arr.length)]; }

// === Game Variables ===
let currentRound = 0;
let currentStation = null;
let currentClues = [];
let cluesToShow = 0;
let guesses = 0;

function updateHUD() {
    scoreDisplay.textContent = "Score: " + totalScore;
    guessesDisplay.textContent = "Guesses Left: " + (maxGuesses - guesses);
}


// === Start Game ===
playBtn.onclick = function() {
    endButtons.style.display = "none";
    if (stations.length === 0) { alert("Stations are still loading..."); return; }
    menu.style.display = "none";
    game.style.display = "block";
    totalScore = 0;
    currentRound = 1;
    gameMessage.innerHTML = randomChoice(startMessages);
    setTimeout(() => { gameMessage.innerHTML = ""; }, 2000);
    startRound();
};
function startRound() {
    // Hide previous round's station image
    stationImage.style.display = "none";
    stationImage.classList.remove("show");

    // Clear guess input
    guessInput.value = "";

    // Clear autocomplete dropdown
    autocompleteList.innerHTML = "";

    // If the game is over
    if (currentRound > totalRounds) {
        clueText.innerHTML = `Game Over! Total Score: ${totalScore}`;
        guessInput.style.display = "none";
        submitGuess.style.display = "none";
        endButtons.style.display = "block";
        return;
    }

    // Show input and button for new round
    guessInput.style.display = "inline-block";
    submitGuess.style.display = "inline-block";

    guesses = 0;
    cluesToShow = startingClues;

    updateHUD();


    roundText.innerHTML = `Round ${currentRound} of ${totalRounds}`;

    // Pick a random station
    const idx = Math.floor(Math.random() * stations.length);
    currentStation = stations.splice(idx, 1)[0];

    // Build clues
    const fullOps = currentStation.operators.map(op => operatorKey[op] || op);
    const country = countryKey[currentStation.country] || currentStation.country;

    currentClues = [
        `Region: ${country}`,
        `Number of Platforms: ${currentStation.platforms}`,
        `Operators: ${fullOps.join(", ")}`,
        `Passing services regularly: ${currentStation["passing services regularly"]}`,
        `Has terminus platforms: ${currentStation["has terminus platforms"]}`
    ];

    for (let i = 1; i <= 10; i++) {
        const key = `Extra Fact${i}`;
        if (currentStation[key]) currentClues.push(`Fun Fact: ${funKey[currentStation[key]] || currentStation[key]}`);
    }

    currentClues = currentClues.sort(() => Math.random() - 0.5);
    updateClues();

    resultText.innerHTML = "";
    guessInput.focus();

    // Assign the guess handler
    submitGuess.onclick = handleGuess;
}


function handleGuess() {
    const guess = guessInput.value.trim();

    guessInput.value = "";   // clears the box
    guessInput.focus();      // puts the cursor back in the box

    guesses++;               // increment guesses first
    updateHUD();             // update score & guesses left

    if(guess.toLowerCase() === currentStation.name.toLowerCase()){
        const points = Math.max(1, maxGuesses - guesses + 1); // guess-based scoring
        totalScore += points;
        updateHUD();         // update after adding points
        resultText.innerHTML = `${randomChoice(correctMessages)} You scored ${points}. Total: ${totalScore}`;

        showStationImage();

        guessInput.style.display = "none";
        submitGuess.style.display = "none";

        currentRound++;
        setTimeout(startRound,4000);
    } else {
        resultText.innerHTML = randomChoice(incorrectMessages);
        if(cluesToShow < currentClues.length) cluesToShow++;
        updateClues();

        if(guesses >= maxGuesses){
            resultText.innerHTML = randomChoice(guessedWrong).replace("{}",currentStation.name);

            showStationImage();

            guessInput.style.display = "none";
            submitGuess.style.display = "none";

            currentRound++;
            setTimeout(startRound,4000);
        }
    }


}

function updateClues(){
    clueText.innerHTML = "";
    for(let i=0;i<cluesToShow;i++){
        clueText.innerHTML += `- ${currentClues[i]}<br>`;
    }
}

// Play Again
playAgainBtn.onclick = function() {
    totalScore = 0;
    currentRound = 1;

    // Reload stations from original JSON
    fetch("StatList.json")
        .then(res => res.json())
        .then(data => {
            stations = [...data];
            allstations = [...data];

            endButtons.style.display = "none";
            startRound();
        });
};

// Back to Menu
menuBtn.onclick = function() {
    game.style.display = "none";
    menu.style.display = "block";
    endButtons.style.display = "none";
};

