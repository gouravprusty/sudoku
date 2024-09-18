const newGrid = (size) => {
    let arr = new Array(size);
    for (let i = 0; i < size; i++) {
        arr[i] = new Array(size);
        
    }
    for (let i = 0; i < Math.pow(size, 2); i++) {
        arr[Math.floor(i/size)][i%size] = CONSTANT.UNASSIGNED;
        
    }
    return arr;
};

// check dupliacte for col
const isColSafe = (grid, col, value) => {
    for(let row = 0; row < CONSTANT.GRID_SIZE; row++){
        if(grid[row][col] === value) return false;
    }
    return true;
}

// check dupliacte for row
const isRowSafe = (grid, row, value) => {
    for(let col = 0; col < CONSTANT.GRID_SIZE; col++){
        if(grid[row][col] === value) return false;
    }
    return true;
}

// check dupliacte for 3*3 box
const isBoxSafe = (grid, box_row, box_col, value) => {
    for(let row = 0; row < CONSTANT.BOX_SIZE; row++){
        for(let col = 0; col < CONSTANT.BOX_SIZE; col++){
            if(grid[row + box_row][col + box_col] === value) return false;
        }
    }
    return true;
}

// check in row, col and 3*3 box
const isSafe = (grid, row, col, value) => {
    return isRowSafe(grid, row, value) && isColSafe(grid, col, value) && isBoxSafe(grid, row - row%3, col - col%3, value) && value !== CONSTANT.UNASSIGNED;
}

// find unassigned cell
const findUnassignedPos = (grid, pos) => {
    for(let row = 0; row < CONSTANT.GRID_SIZE; row++){
        for(let col = 0; col < CONSTANT.GRID_SIZE; col++){
            if(grid[row][col] === CONSTANT.UNASSIGNED){
                pos.row = row;
                pos.col = col;
                return true;
            }
        }
    }
    return false;
};

// shuffle arr
const shuffleArray = (arr) => {
    let currIndex = arr.length;

    while(currIndex !== 0){
        let randomIndex = Math.floor(Math.random() * currIndex);
        currIndex--;

        let temp = arr[currIndex];
        arr[currIndex] = arr[randomIndex];
        arr[randomIndex] = temp;
    }
    return arr;
}

// check puzzle is complete
const isFullGrid = (grid) => {
    return grid.every((row, i) => {
        return row.every((cell, j) => {
            return cell !== CONSTANT.UNASSIGNED;
        })
    })
};

// 
const sudokuCreate = (grid) => {
    let unassigned_pos = {
        row: -1,
        col: -1,
    }
    if(!findUnassignedPos(grid, unassigned_pos)) return true;
    let number_list = shuffleArray([...CONSTANT.NUMBERS]);
    let row = unassigned_pos.row;
    let col = unassigned_pos.col;
    number_list.forEach((num, i) => {
        if(isSafe(grid, row, col, num)){
            grid[row][col] = num;
            if(isFullGrid(grid)){
                return true;
            }else{
                if(sudokuCreate(grid)){
                    return true;
                }
            }
            grid[row][col] = CONSTANT.UNASSIGNED;
        }
    })
    return isFullGrid(grid);
}
const sudokuCheck = (grid) => {
    let unassigned_pos = {
        row: -1,
        col: -1,
    }
    if(!findUnassignedPos(grid, unassigned_pos)) return true;

    grid.forEach((row, i) => {
        row.forEach((cell, j) => {
            if(isSafe(grid, i, j, cell)){
                if(isFullGrid(grid)){
                    return true;
                }else{
                    if(sudokuCreate(grid)){
                        return true;
                    }
                }
            }
        })
    })
    

    return isFullGrid(grid);
};

const removeCells = (grid, level) => {
    let res = [...grid];
    let attempts = level;
    while(attempts > 0){
        let row = Math.floor(Math.random() * CONSTANT.GRID_SIZE);
        let col = Math.floor(Math.random() * CONSTANT.GRID_SIZE);
        while(res[row][col] === 0){
            row = Math.floor(Math.random() * CONSTANT.GRID_SIZE);
            col = Math.floor(Math.random() * CONSTANT.GRID_SIZE);
        }
        res[row][col] = CONSTANT.UNASSIGNED;
        attempts--;
    }
    return res;
}

// Generate sudoku base on level
const generateSudoku = (level) => {
    let sudoku = newGrid(CONSTANT.GRID_SIZE);
    let check = sudokuCreate(sudoku);
    if(check){
        let question = removeCells(sudoku, level);
        return{
            original: sudoku,
            question: question
        }
    }
    return undefined;
}