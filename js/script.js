const body = document.querySelector("body");
// Themes
const toggleTheme = document.querySelector("#dark_mode_toggle");
const themeColor = document.querySelector("meta[name='theme-color']");
// Buttons
const continueBtn = document.querySelector("#btn_continue");
const playBtn = document.querySelector("#btn_play");
const levelBtn = document.querySelector("#btn_level");
const pauseBtn = document.querySelector(".pause_btn");
const resumeBtn = document.querySelector("#resume");
const newGame = document.querySelector("#new_game")
const newGame2 = document.querySelector(".new_game2")
const deleteBtn = document.querySelector(".delete_btn")
const resultTime = document.querySelector(".result_time")
// Inputs
const playerName = document.querySelector(".input_name");
const numInput = document.querySelectorAll(".number");
// Screens
const startScreen = document.querySelector(".start_screen");
const gameScreen = document.querySelector(".main_game");
const pauseScreen = document.querySelector(".pause_screen");
const resultScreen = document.querySelector(".result_screen");
// Components
const cells = document.querySelectorAll(".main_grid_cell");
const player_name = document.querySelector("#player_name");
const game_level = document.querySelector("#game_level");
const game_time = document.querySelector("#game_time");

let timer = null;
let pause = false;
let seconds = 0;

let su = undefined;
let su_ans = undefined;
let selected_cell = -1;

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

const showTime = (seconds) => new Date(seconds * 1000).toISOString().substr(11, 8);

const clearSudoku = () => {
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
        cells[i].innerHTML = "";
        cells[i].classList.remove("filled");
        cells[i].classList.remove("selected");
    }
}

const initSudoku = () => {
    clearSudoku();
    resetBg();
    su = generateSudoku(level);
    su_ans = [...su.question];
    seconds = 0;
    saveGameInfo();
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
        let row = Math.floor(i/CONSTANT.GRID_SIZE);
        let col = i%CONSTANT.GRID_SIZE;
        cells[i].setAttribute("data-value", su.question[row][col]);
        if(su.question[row][col] !== 0){
            cells[i].classList.add("filled");
            cells[i].innerHTML = su.question[row][col]
        }
    }
};

const loadSudoku = () => {
    let game = getGameInfo();
    game_level.innerHTML = CONSTANT.LEVEL_NAME[game_level];
    su = game.su;
    su_ans = su.answer;
    seconds = game.seconds;
    game_time.innerHTML = showTime(seconds);
    levelIndex = game.level;

    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
        let row = Math.floor(i/CONSTANT.GRID_SIZE);
        let col = i%CONSTANT.GRID_SIZE;
        cells[i].setAttribute("data-value", su_ans[row][col]);
        cells[i].innerHTML = su_ans[row][col] !== 0 ? su_ans[row][col] : "";

        if(su.question[row][col] !== 0){
            cells[i].classList.add("filled");
        }
    }
}

const hoverBg = (index) => {
    let row = Math.floor(index / CONSTANT.GRID_SIZE);
    let col = index % CONSTANT.GRID_SIZE;
    let box_start_row = row - row % 3;
    let box_start_col = col - col % 3;
    for (let i = 0; i < CONSTANT.BOX_SIZE; i++) {
        for (let j = 0; j < CONSTANT.BOX_SIZE; j++) {
            let cell = cells[9 * (box_start_row + i) + (box_start_col + j)];
            cell.classList.add("hover");
        }
    }
    let step = 9;
    while(index - step >= 0){
        cells[index - step].classList.add("hover");
        step += 9;
    }
    step = 9;
    while(index + step < 81){
        cells[index + step].classList.add("hover");
        step += 9;
    }
    step = 1;
    while(index - step >= 9*row){
        cells[index - step].classList.add("hover");
        step += 1;
    }
    step = 1;
    while(index + step < 9*row  + 9){
        cells[index + step].classList.add("hover");
        step += 1;
    }
}
const resetBg = () => {
    cells.forEach(e => e.classList.remove("hover"));
}

const checkErr = (value) => {
    const addErr = (cell) => {
        if(parseInt(cell.getAttribute("data-value")) === value){
            cell.classList.add("err");
            cell.classList.add("cell_err");
            setTimeout(() => {
                cell.classList.remove("cell_err");
            }, 500);
        }
    }
    let index = selected_cell;

    let row = Math.floor(index / CONSTANT.GRID_SIZE);
    let col = index % CONSTANT.GRID_SIZE;
    let box_start_row = row - row % 3;
    let box_start_col = col - col % 3;
    for (let i = 0; i < CONSTANT.BOX_SIZE; i++) {
        for (let j = 0; j < CONSTANT.BOX_SIZE; j++) {
            let cell = cells[9 * (box_start_row + i) + (box_start_col + j)];
            if(!cell.classList.contains("selected")) addErr(cell);
        }
    }
    let step = 9;
    while(index - step >= 0){
        addErr(cells[index - step]);
        step += 9;
    }
    step = 9;
    while(index + step < 81){
        addErr(cells[index + step]);
        step += 9;
    }
    step = 1;
    while(index - step >= 9*row){
        addErr(cells[index - step]);
        step += 1;
    }
    step = 1;
    while(index + step < 9*row  + 9){
        addErr(cells[index + step]);
        step += 1;
    }

};

const removeErr = () => cells.forEach(e => e.classList.remove('err'));

const saveGameInfo = () => {
    let game = {
        level: levelIndex,
        seconds: seconds,
        su: {
            original: su.original,
            question: su.question,
            answer: su_ans
        }
    }
    localStorage.setItem("game", JSON.stringify(game));
}

const removeGameInfo = () => {
    localStorage.removeItem("game");
    continueBtn.style.display = "none";
}

const isGameWin = () => sudokuCheck(su_ans);

const showResult = () => {
    clearInterval(timer);
    resultScreen.classList.add("active");
    resultTime.innerHTML = showTime(seconds);
}

const initNumInputEvent = () => {
    numInput.forEach((e, index) => {
        e.addEventListener('click', () => {
            if(!cells[selected_cell].classList.contains("filled")){
                cells[selected_cell].innerHTML = index + 1;
                cells[selected_cell].setAttribute("data-value", index + 1);

                let row = Math.floor(selected_cell / CONSTANT.GRID_SIZE);
                let col = selected_cell % CONSTANT.GRID_SIZE;
                su_ans[row][col] = index + 1;

                saveGameInfo();

                removeErr();
                checkErr(index + 1);
                cells[selected_cell].classList.add("zoom_in");
                setTimeout(() => {
                    cells[selected_cell].classList.remove("zoom_in");
                }, 500);

                if(isGameWin()){
                    removeGameInfo();
                    showResult();
                }
            }
        })
    })
};

const initCellsEvent = () => {
    cells.forEach((e, index) => {
        e.addEventListener("click", () => {
            if(!e.classList.contains("filled")){
                cells.forEach(e => e.classList.remove("selected"));
                selected_cell = index;
                e.classList.remove("err");
                e.classList.add("selected");
                resetBg();
                hoverBg(index);
            }
        })
    });
}
const startGame = () => {
    startScreen.classList.remove("active");
    gameScreen.classList.add("active");
    player_name.innerText = playerName.value.trim();
    setPlayerName(playerName.value.trim());
    game_level.innerText = CONSTANT.LEVEL_NAME[levelIndex];
    seconds = 0;
    showTime(seconds);
    timer = setInterval(() => {
        if(!pause){
            seconds = seconds + 1
            game_time.innerHTML = showTime(seconds);
        }
    }, 1000);
};

const returnStartScreen = () => {
    clearInterval(timer);
    pause = false;
    seconds = 0;
    startScreen.classList.add("active");
    gameScreen.classList.remove("active");
    pauseScreen.classList.remove("active");
    resultScreen.classList.remove("active");
}

playBtn.addEventListener("click", () => {
    if(playerName.value.trim().length > 0){
        initSudoku();
        startGame();
    }else{
        playerName.classList.add("input_err");
        setTimeout(() => {
            playerName.classList.remove("input_err");
            playerName.focus();
        }, 500);
    }
});

continueBtn.addEventListener("click", () => {
    if(playerName.value.trim().length > 0){
        loadSudoku();
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

pauseBtn.addEventListener("click", () => {
    pauseScreen.classList.add("active");
    pause = true;
});
resumeBtn.addEventListener("click", () => {
    pauseScreen.classList.remove("active");
    pause = false;
});
newGame.addEventListener("click", () => {
    returnStartScreen();
});
newGame2.addEventListener("click", () => {
    console.log("object");
    returnStartScreen();
});

deleteBtn.addEventListener("click", () => {
    cells[selected_cell].innerHTML = "";
    cells[selected_cell].setAttribute("data-value", 0);
    let row = Math.floor(selected_cell / CONSTANT.GRID_SIZE);
    let col = selected_cell % CONSTANT.GRID_SIZE;
    su_ans[row][col] = 0;
    removeErr();
})

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
    initCellsEvent();
    initNumInputEvent();

    if(getPlayerName()){
        playerName.value = getPlayerName();
    }else{
        playerName.focus();
    }
}
init();
