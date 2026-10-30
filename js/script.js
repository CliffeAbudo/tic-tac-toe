//creating a player
function createPlayer(name, mark) {
  return {
    name: name,
    mark: mark,
  };
}
const player1 = createPlayer("player1", "x");
const player2 = createPlayer("player2", "o");

const Gameboard = (function () {
  const gameBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  const WINNING_COMBINATIONS = [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];
  function checkWinner() {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;

      if (
        gameBoard[a] !== 0 &&
        gameBoard[a] === gameBoard[b] &&
        gameBoard[b] === gameBoard[c]
      ) {
        return gameBoard[a];
      }
    }

    return null;
  }

  function checkTie() {
    if (checkWinner() !== null) {
      return false;
    }

    for (const square of gameBoard) {
      if (square === 0) {
        return false;
      }
    }

    return true;
  }
  function resetBoard() {
    for (let i = 0; i < gameBoard.length; i++) {
      gameBoard[i] = 0;
    }
  }

  return {
    //gives the rest of game a way to see current board
    getBoard() {
      return gameBoard;
    },
    placeMark(position, mark) {
      gameBoard[position] = mark;
    },
    checkWinner,
    checkTie,
    resetBoard,
  };
})();

const GameController = (function () {
  let currentPlayer = player1;
  let gameOver = false;
  let winner = null;

  function playRound(position) {
    if (Gameboard.getBoard()[position] === 0 && gameOver === false) {
      Gameboard.placeMark(position, currentPlayer.mark);
      console.log(Gameboard.getBoard()[position]);

      winner = Gameboard.checkWinner();

      if (winner !== null) {
        console.log(`${winner} wins!`);
        gameOver = true;
      } else if (Gameboard.checkTie()) {
        console.log("It's a tie!");
        gameOver = true;
      } else {
        if (currentPlayer === player1) {
          currentPlayer = player2;
        } else {
          currentPlayer = player1;
        }
      }
    }
  }
  function getCurrentPlayer() {
    return currentPlayer.mark;
  }
  function getWinner() {
    return winner;
  }
  function isTie() {
    return Gameboard.checkTie();
  }
  function resetGame() {
    currentPlayer = player1;
    gameOver = false;
    winner = null;
    Gameboard.resetBoard();
  }

  return {
    playRound,
    getCurrentPlayer,
    getWinner,
    isTie,
    resetGame,
  };
})();

const DisplayController = (function () {
  const squares = document.querySelectorAll(".square");
  const status = document.querySelector("#game-status");
  const restartButton = document.querySelector("#restart-button");

  function addEventListeners() {
    squares.forEach((square) => {
      square.addEventListener("click", () => {
        const position = Number(square.dataset.position);

        GameController.playRound(position);
        renderBoard();
        renderStatus();
      });
    });
  }

  function addRestartListener() {
    restartButton.addEventListener("click", () => {
      GameController.resetGame();
      renderBoard();
      renderStatus();
    });
  }

  function renderBoard() {
    squares.forEach((square, index) => {
      const value = Gameboard.getBoard()[index];

      if (value === 0) {
        square.textContent = "";
      } else {
        square.textContent = value;
      }
    });
  }

  function renderStatus() {
    const currentPlayer = GameController.getCurrentPlayer();
    status.textContent = `Player ${currentPlayer.toUpperCase()}'s turn`;
    const winner = GameController.getWinner();

    if (winner !== null) {
      status.textContent = `Player ${winner.toUpperCase()} wins!`;
    } else if (GameController.isTie()) {
      status.textContent = "It's a tie!";
    } else {
      const currentPlayer = GameController.getCurrentPlayer();
      status.textContent = `Player ${currentPlayer.toUpperCase()}'s turn`;
    }
  }

  addEventListeners();
  addRestartListener();
  renderBoard();

  return {
    renderBoard,
    renderStatus,
  };
})();
