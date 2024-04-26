// Define the Gameboard and Cell modules to encapsulate related functionalities.
const Gameboard = () => {
	const rows = 3,
		columns = 3
	const board = Array.from({ length: rows }, () =>
		Array.from({ length: columns }, () => Cell())
	)

	const placeMark = (row, column, mark, color) =>
		board[row][column].addMark(mark, color)
	const getBoard = () => board

	return { placeMark, getBoard }
}

const Cell = () => {
	let value = "",
		color = ""
	const addMark = (mark, colorInput) => {
		value = mark
		color = colorInput
	}
	const getValue = () => value
	const getColor = () => color

	return { addMark, getValue, getColor }
}

// GameController to manage players, game state, and board interactions.
const GameController = () => {
	let gameboard = Gameboard()
	const players = [
		{ name: "Player 1", mark: "X", color: "lightcoral" },
		{ name: "Player 2", mark: "O", color: "cyan" },
	]
	let currentPlayer = players[0]

	const switchPlayer = () =>
		(currentPlayer = currentPlayer === players[0] ? players[1] : players[0])
	const setPlayersName = (player1Name, player2Name) => {
		players[0].name = player1Name
		players[1].name = player2Name
	}
	const playRound = (row, column) => {
		if (gameboard.getBoard()[row][column].getValue() === "") {
			gameboard.placeMark(row, column, currentPlayer.mark, currentPlayer.color)
			switchPlayer()
		}
	}
	const getBoard = () => gameboard.getBoard()
	const checkWinner = () => checkGameWinner(gameboard, players)
	const restartGame = () => {
		gameboard = Gameboard()
		currentPlayer = players[0]
	}

	return {
		getCurrentPlayer: () => currentPlayer,
		setPlayersName,
		playRound,
		getBoard,
		checkWinner,
		restartGame,
	}
}

// Function to check for a winner in the current game state.
const checkGameWinner = (gameboard, players) => {
	const board = gameboard
		.getBoard()
		.map((row) => row.map((cell) => cell.getValue()))
	const lines = [
		...board,
		...board[0].map((i) => board.map((row) => row[i])),
		[0, 1, 2].map((i) => board[i][i]),
		[0, 1, 2].map((i) => board[2 - i][i]),
	]

	for (const line of lines) {
		if (line[0] !== "" && line.every((val) => val === line[0])) {
			const winner = players.find((player) => player.mark === line[0])
			if (winner) {
				document.querySelector(".restart-btn").style.display = "block"
				return winner
			}
		}
	}
	return null
}

// Update the display for the player's turn or game result.
function updatePlayerTurn(gameController, playerTurnDiv) {
	const winner = gameController.checkWinner();
	playerTurnDiv.style.animation = "none"; 
	playerTurnDiv.style.width = "1%"; 
	playerTurnDiv.offsetHeight; // Forces a layout reflow

	if (winner) {
		playerTurnDiv.textContent = `${winner.name} wins!`;
		document.querySelector(".restart-btn").style.display = "block";
	} else if (gameController.getBoard().flat().every(cell => cell.getValue() !== "")) {
		playerTurnDiv.textContent = "Draw!";
		document.querySelector(".restart-btn").style.display = "block"
	} else {
		playerTurnDiv.textContent = `${gameController.getCurrentPlayer().name}'s Turn`;
	}

	// Reapply the typing animation after reflow with a slight delay
	setTimeout(() => {
		playerTurnDiv.style.animation = "typing 1s steps(40, end) forwards, blink-caret .75s step-end infinite";
	}, 10);
}


// Update the game board display.
function updateGameBoard(gameController, gameBoardDiv, playerTurnDiv) {
	const board = gameController.getBoard()
	gameBoardDiv.innerHTML = ""
	board.forEach((row, rowIndex) => {
		const rowDiv = document.createElement("div")
		rowDiv.classList.add("row")
		row.forEach((cell, columnIndex) => {
			const cellButton = createCellButton(cell, rowIndex, columnIndex, () => {
				handleCellClick(
					gameController,
					rowIndex,
					columnIndex,
					gameBoardDiv,
					playerTurnDiv
				)
			})
			rowDiv.appendChild(cellButton)
		})
		gameBoardDiv.appendChild(rowDiv)
	})
	updatePlayerTurn(gameController, playerTurnDiv) // Update player turn after board is updated
}

// Create a cell button for the game board.
function createCellButton(cell, rowIndex, columnIndex, onClick) {
	const cellButton = document.createElement("button")
	cellButton.classList.add("cell")
	cellButton.id = `cell-${rowIndex}-${columnIndex}`
	cellButton.dataset.row = rowIndex
	cellButton.dataset.column = columnIndex
	cellButton.textContent = cell.getValue()
	cellButton.style.color = cell.getColor()
	cellButton.addEventListener("click", onClick)
	return cellButton
}

// Handle click events on cells.
function handleCellClick(
	gameController,
	rowIndex,
	columnIndex,
	gameBoardDiv,
	playerTurnDiv
) {
	const winner = gameController.checkWinner()
	if (winner || playerTurnDiv.textContent.includes("Draw")) return
	gameController.playRound(rowIndex, columnIndex)
	updateGameBoard(gameController, gameBoardDiv, playerTurnDiv)
}

// Check player names and set them in the game controller.
function checkPlayerNamesAndSet(gameController) {
	const player1Name = document.querySelector(".player1").value.trim()
	const player2Name = document.querySelector(".player2").value.trim()
	if (!player1Name || !player2Name) {
		alert("Please enter player names")
		return false
	} else if (player1Name === player2Name) {
		alert("Player names must be different")
		return false
	}
	gameController.setPlayersName(player1Name, player2Name)
	return true
}

// Initialize the game's UI components and set event handlers.
function initializeUI(gameController) {
	const mainMenu = document.querySelector(".main-menu")
	const boardContainer = document.querySelector(".board-container")
	const playerTurnDiv = document.querySelector(".player-turn")
	const gameBoardDiv = document.querySelector(".game-board")
	const startButton = document.querySelector(".start-btn")
	const restartButton = document.querySelector(".restart-btn")

	restartButton.addEventListener("click", () => {
		gameController.restartGame()
		updateGameBoard(gameController, gameBoardDiv, playerTurnDiv)
		restartButton.style.display = "none"
	})

	startButton.addEventListener("click", (event) => {
		event.preventDefault()
		if (checkPlayerNamesAndSet(gameController)) {
			mainMenu.style.display = "none"
			startButton.style.display = "none"
			startGame(gameController, boardContainer, gameBoardDiv, playerTurnDiv)
		}
	})
}

function startGame(
	gameController,
	boardContainer,
	gameBoardDiv,
	playerTurnDiv
) {
	boardContainer.style.display = "flex"
	updatePlayerTurn(gameController, playerTurnDiv) // Update player turn at game start
	setTimeout(() => {
		gameBoardDiv.style.animation =
			"fade-in 1s cubic-bezier(0.390, 0.575, 0.565, 1.000) forwards"
		updateGameBoard(gameController, gameBoardDiv, playerTurnDiv)
	}, 10)
}

// Event listener setup and initial functionality definition.
document.addEventListener("DOMContentLoaded", () => {
	const gameController = GameController()
	initializeUI(gameController)
})
