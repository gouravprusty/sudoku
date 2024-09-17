const body = document.querySelector("body");
// Themes
const toggleTheme = document.querySelector("#dark_mode_toggle");
const themeColor = document.querySelector("meta[name='theme-color']");
// Buttons
const continueBtn = document.querySelector("#btn_continue");
const playBtn = document.querySelector("#btn_play");
const levelBtn = document.querySelector("#btn_level");
// Inputs
const playerName = document.querySelector(".input_name");
// Screens
const startScreen = document.querySelector(".start_screen");
const gameScreen = document.querySelector(".main_game");
// Components
const cells = document.querySelectorAll(".main_grid_cell");
const player_name = document.querySelector("#player_name");
const game_level = document.querySelector("#game_level");
const game_time = document.querySelector("#game_time");

let timer = null;

// Toggle dark mode on button click
toggleTheme.addEventListener("click", () => {
    body.classList.toggle("dark");
    const isDarkMode = body.classList.contains("dark");
    localStorage.setItem("darkmode", isDarkMode);
    themeColor.setAttribute("content", isDarkMode ? "#1a1a2e" : "#fff");
});

const CONSTANT = {
    UNASSIGNED: 0,
    GRID_SIZE: 9,
    BOX_SIZE: 3,
    NUMBERS: [1,2,3,4,5,6,7,8,9],
    LEVEL_NAME: ["Easy", "Medium", "Hard", "Very Hard", "Insane", "Inhuman"],
    LEVEL: [29, 38, 47, 56, 65 ,74]
}

let levelIndex = 0;
let level = CONSTANT.LEVEL[levelIndex];

levelBtn.addEventListener("click", (e) => {
    levelIndex = levelIndex + 1 > CONSTANT.LEVEL.length - 1 ? 0 : levelIndex + 1;
    level = CONSTANT.LEVEL[levelIndex];
    e.target.innerHTML = CONSTANT.LEVEL_NAME[levelIndex];
});

const setPlayerName = (name) => localStorage.setItem("player_name", name);
const getPlayerName = () => localStorage.getItem("player_name")

const startGame = () => {
    startScreen.classList.remove("active");
    gameScreen.classList.add("active");
    player_name.innerText = playerName.value.trim();
    setPlayerName(playerName.value.trim());
    timer = setInterval(() => {
        if(!pause){
            seconds = seconds + 1
            game_time.innerHTML = showTime(seconds);
        }
    }, 1000);
};

playBtn.addEventListener("click", () => {
    if(playerName.value.trim().length > 0){
        startGame();
    }else{
        playerName.classList.add("input_err");
        setTimeout(() => {
            playerName.classList.remove("input_err");
            playerName.focus();
        }, 500);
    }
});

// Initialize theme on page load
const getGameInfo = () => JSON.parse(localStorage.getItem("game"));

const initGameGrid = () => {
    let index = 0;
    for(let i = 0; i < Math.pow(CONSTANT.GRID_SIZE,2); i++){
        let row = Math.floor(i/CONSTANT.GRID_SIZE);
        let col = i % CONSTANT.GRID_SIZE;
        if(row === 2 || row === 5) cells[index].style.marginBottom = "10px";
        if(col === 2 || col === 5) cells[index].style.marginRight = "10px";
        index++;
    }
};

function init() {
    const darkmode = JSON.parse(localStorage.getItem("darkmode"));
    if (darkmode) {
        body.classList.add("dark");
        themeColor.setAttribute("content", "#1a1a2e");
    } else {
        body.classList.remove("dark");
        themeColor.setAttribute("content", "#fff");
    }
    const game = getGameInfo();
    continueBtn.style.display = game ? "grid" : "none";

    initGameGrid();
}
init();
