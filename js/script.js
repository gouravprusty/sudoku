const body = document.querySelector("body");
const toggleTheme = document.querySelector("#dark_mode_toggle");
const themeColor = document.querySelector("meta[name='theme-color']");
const continueBtn = document.querySelector("#btn_continue");
const playerName = document.querySelector(".input_name");
const startScreen = document.querySelector(".start_screen");
const playBtn = document.querySelector("#btn_play");
const levelBtn = document.querySelector("#btn_level");

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

playBtn.addEventListener("click", () => {
    if(playerName.value.trim().length > 0){
        alert(`Level = ${level}`);
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

const init = () => {
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
};
init();
