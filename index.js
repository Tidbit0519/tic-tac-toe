import inquirer from 'inquirer';

const Gameboard = () => {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board.push([]);
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const placeMark = (row, column, mark) => {
        board[row][column].addMark(mark);
    }

    const getBoard = () => {
        return board;
    }

    const printBoard = () => {
        console.log("----------");
        for (let i = 0; i < rows; i++) {
            process.stdout.write("| ")
            for (let j = 0; j < columns; j++) {
                process.stdout.write(board[i][j].getValue() + " | ")
            }
            console.log("")
            console.log("----------");
        }
    }

    return {
        placeMark,
        getBoard,
        printBoard
    }
}

const Cell = () => {
    let value = "";

    const addMark = (mark) => {
        value = mark;
    }

    const getValue = () => {
        return value;
    }

    return {
        addMark,
        getValue
    }
}

const GameController = () => {
    let gameboard = Gameboard();

    const players = [
        { name: 'Player 1', mark: 'X' },
        { name: 'Player 2', mark: 'O' }
    ];
    let currentPlayer = players[0];

    const switchPlayer = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
        console.log(`\n${currentPlayer.name} turn`)
    }

    const playRound = (row, column) => {
        gameboard.placeMark(row, column, currentPlayer.mark);
        gameboard.printBoard();
        switchPlayer();
    }

    const printNewGame = () => {
        gameboard.printBoard();
        console.log(`\n${currentPlayer.name} turn`)
    }
    
    const getBoard = () => {
        console.log(gameboard.getBoard().length);
        return gameboard.getBoard();
    }

    return {
        playRound,
        printNewGame,
        getBoard
    }
}

async function main() {
    const game = GameController();
    game.printNewGame();

    const questions = [
      {
        type: "input",
        name: "row",
        message: "Enter row:",
      },
      {
        type: "input",
        name: "column",
        message: "Enter column:",
      },
    ]
    
    while (true) {
        const answers = await inquirer.prompt(questions);
        game.playRound(answers.row, answers.column);
    }
}

main();