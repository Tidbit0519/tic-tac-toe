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

	const placeMark = (row, column, mark) => {
		board[row][column].addMark(mark)
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

	const addMark = (mark) => {
		value = mark
	}

	const getValue = () => {
		return value
	}

	return {
		addMark,
		getValue,
	}
}

const GameController = () => {
	let gameboard = Gameboard()
	const players = [
		{ name: "Player 1", mark: "X" },
		{ name: "Player 2", mark: "O" },
	]
	let currentPlayer = players[0]

	const switchPlayer = () => {
		currentPlayer = currentPlayer === players[0] ? players[1] : players[0]
	}

	const getCurrentPlayer = () => {
		return currentPlayer
	}

	const playRound = (row, column) => {
		if (gameboard.getBoard()[row][column].getValue() === "") {
			gameboard.placeMark(row, column, currentPlayer.mark)
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
                console.log("Found a winner!")
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

		return winner
    }
    
    const restartGame = () => {
        gameboard = Gameboard()
        currentPlayer = players[0]
    }

	return {
		getCurrentPlayer,
		playRound,
		getBoard,
        checkWinner,
        restartGame
	}
}

function main() {
	const gameController = GameController()
	const playerTurnDiv = document.querySelector(".player-turn")
	const gameBoardDiv = document.querySelector(".game-board")

    const updatePlayerTurn = () => {
		const winner = gameController.checkWinner()
		playerTurnDiv.style.width = "0.1%"
		if (winner) {
			playerTurnDiv.textContent = `${winner.name} win!`
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
		playerTurnDiv.style.animation =
			"typing 2s steps(40, end) forwards, blink-caret .75s step-end infinite"
	}

	const updateGameBoard = () => {
		const board = gameController.getBoard()
		gameBoardDiv.innerHTML = ""
		board.forEach((row, rowIndex) => {
			const rowDiv = document.createElement("div")
			rowDiv.classList.add("row")
			row.forEach((cell, columnIndex) => {
				const cellButton = document.createElement("button")
				cellButton.classList.add("cell")
				cellButton.dataset.row = rowIndex
				cellButton.dataset.column = columnIndex
				cellButton.textContent = cell.getValue()
				cellButton.addEventListener("click", cellClick)
				rowDiv.appendChild(cellButton)
			})
			gameBoardDiv.appendChild(rowDiv)
		})
	}

	function cellClick(event) {
		const row = event.target.dataset.row
		const column = event.target.dataset.column
		gameController.playRound(row, column)
		updateGameBoard()
		updatePlayerTurn()
    }
    
    // function restartGame() {
    //     const restartButton = document.querySelector(".restart-btn")
    //     restartButton.addEventListener("click", () => {
    //         console.log("Restarting game")
    //         gameController.restartGame()
    //     })
    // }

    // restartGame()
	updatePlayerTurn()
	updateGameBoard()
}

document.addEventListener("DOMContentLoaded", function () {
	var gameTitle = document.querySelector(".game-title")
	var playerTurn = document.querySelector(".player-turn")

	gameTitle.addEventListener("animationend", function (e) {
		if (e.animationName === "typing") {
			gameTitle.style.animation = "none"
			gameTitle.style.borderRight = "none"
			setTimeout(function () {
				main()
			}, 500)
		}
	})
})

