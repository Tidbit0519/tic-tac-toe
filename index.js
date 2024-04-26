const Gameboard = () => {
	const rows = 3
	const columns = 3
	const board = []

	for (let i = 0; i < rows; i++) {
		board.push([])
		for (let j = 0; j < columns; j++) {
			board[i].push(Cell())
		}
	}

	const placeMark = (row, column, mark, color) => {
		board[row][column].addMark(mark, color)
	}

	const getBoard = () => {
		return board
	}

	return {
		placeMark,
		getBoard,
	}
}

const Cell = () => {
	let value = ""
	let cellColor = ""

	const addMark = (mark, color) => {
		value = mark
		cellColor = color
	}

	const getValue = () => {
		return value
	}

	const getColor = () => {
		return cellColor
	}

	return {
		addMark,
		getValue,
		getColor,
	}
}

const GameController = () => {
	let gameboard = Gameboard()
	const players = [
		{ name: "Player 1", mark: "X", color: "red"},
		{ name: "Player 2", mark: "O", color: "blue"},
	]
	let currentPlayer = players[0]

	const switchPlayer = () => {
		currentPlayer = currentPlayer === players[0] ? players[1] : players[0]
	}

	const getCurrentPlayer = () => {
		return currentPlayer
	}

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

	const getBoard = () => {
		return gameboard.getBoard()
	}

	const checkWinner = () => {
        const board = gameboard.getBoard().map((row) => row.map((cell) => cell.getValue()))

		let winner = null
		for (let i = 0; i < 3; i++) {
			if (
				board[i][0] !== "" &&
				board[i][0] === board[i][1] &&
				board[i][0] === board[i][2]
            ) {
				winner = players.find(
					(player) => player.mark === board[i][0]
				)
			}
		}

		for (let i = 0; i < 3; i++) {
			if (
				board[0][i] !== "" &&
				board[0][i] === board[1][i] &&
				board[0][i] === board[2][i]
			) {
				winner = players.find(
					(player) => player.mark === board[0][i]
				)
			}
		}

		if (
			board[0][0] !== "" &&
			board[0][0] === board[1][1] &&
			board[0][0] === board[2][2]
		) {
			winner = players.find((player) => player.mark === board[0][0])
		}

		if (
			board[0][2] !== "" &&
			board[0][2] === board[1][1] &&
			board[0][2] === board[2][0]
		) {
			winner = players.find((player) => player.mark === board[0][2])
		}
		
		if (winner) {
			const restartButton = document.querySelector(".restart-btn")
			restartButton.style.display = "block"
		}

		return winner
    }
    
    const restartGame = () => {
        gameboard = Gameboard()
        currentPlayer = players[0]
    }

	return {
		getCurrentPlayer,
		setPlayersName,
		playRound,
		getBoard,
        checkWinner,
        restartGame
	}
}

function main() {
	const gameController = GameController()
	const mainMenu = document.querySelector(".main-menu")
	const boardContainer = document.querySelector(".board-container")
	const playerTurnDiv = document.querySelector(".player-turn")
	const gameBoardDiv = document.querySelector(".game-board")
	const startButton = document.querySelector(".start-btn")
	const restartButton = document.querySelector(".restart-btn")

    const updatePlayerTurn = () => {
			const winner = gameController.checkWinner()
			playerTurnDiv.style.animation = "none" 
			playerTurnDiv.style.width = "1%" 
			playerTurnDiv.offsetHeight // This does nothing but force a layout reflow

			if (winner) {
				playerTurnDiv.textContent = `${winner.name} wins!`
			} else if (
				gameController
					.getBoard()
					.flat()
					.every((cell) => cell.getValue() !== "")
			) {
				playerTurnDiv.textContent = "Draw!"
			} else {
				playerTurnDiv.textContent = `${
					gameController.getCurrentPlayer().name
				}'s Turn`
			}

			// Timeout to ensure the animation is reapplied after reflow
			setTimeout(() => {
				playerTurnDiv.style.animation =
					"typing 1s steps(40, end) forwards, blink-caret .75s step-end infinite"
			}, 10)
		}


	const updateGameBoard = () => {
		gameBoardDiv.innerHTML = ""
		const board = gameController.getBoard()
		board.forEach((row, rowIndex) => {
			const rowDiv = document.createElement("div")
			rowDiv.classList.add("row")
			row.forEach((cell, columnIndex) => {
				const cellButton = document.createElement("button")
				cellButton.classList.add("cell")
				cellButton.id = `cell-${rowIndex}-${columnIndex}`
				cellButton.dataset.row = rowIndex
				cellButton.dataset.column = columnIndex
				cellButton.textContent = cell.getValue()
				cellButton.style.color = cell.getColor()
				cellButton.addEventListener("click", cellClick)
				rowDiv.appendChild(cellButton)

			})
			gameBoardDiv.appendChild(rowDiv)
		})
	}

	function cellClick(event) {
		if (gameController.checkWinner() || playerTurnDiv.textContent === "Draw!" ) return
			
		const row = event.target.dataset.row
		const column = event.target.dataset.column
		gameController.playRound(row, column)
		updateGameBoard()
		updatePlayerTurn()
	}
	
	function restartGame() {
		gameController.restartGame()
		updateGameBoard()
		updatePlayerTurn()
		restartButton.style.display = "none"
	}

	function startGame() {
		boardContainer.style.display = "flex"
		updatePlayerTurn()
		setTimeout(() => {
			gameBoardDiv.style.animation =
				"fade-in 1s cubic-bezier(0.390, 0.575, 0.565, 1.000) forwards"
			updateGameBoard()
		}, 10)
		restartButton.addEventListener("click", restartGame)
	}

	function checkPlayerName() {
		const player1Name = document.querySelector('.player1').value.trim();
		const player2Name = document.querySelector('.player2').value.trim();
		if (player1Name === "" || player2Name === "") {
			alert("Please enter player names")
			startButton.disabled = true
			return false
		} else if (player1Name === player2Name) {
			alert("Player names must be different")
			return false
		} else {
			gameController.setPlayersName(player1Name, player2Name)
			startButton.disabled = false
			return true
		}
	}

	startButton.addEventListener("click", (event) => {
		event.preventDefault();
		if (checkPlayerName()) {
			mainMenu.style.display = "none"
			startButton.style.display = "none"
			startGame()
		}
	})
}

document.addEventListener("DOMContentLoaded", function () {
	var gameTitle = document.querySelector(".game-title")
	gameTitle.addEventListener("animationend", function (e) {
		if (e.animationName === "typing") {
			gameTitle.style.animation = "none"
			gameTitle.style.borderRight = "none"
			setTimeout(() => {
				main()
			}, 100)
		}
	})
})

