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
  };
})();

const GameController = (function () {
  let currentPlayer = player1;
  let gameOver = false;

  function playRound(position) {
    if (Gameboard.getBoard()[position] === 0 && gameOver === false) {
      Gameboard.placeMark(position, currentPlayer.mark);
      console.log(Gameboard.getBoard()[position]);

      const winner = Gameboard.checkWinner();

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

  return {
    playRound,
  };
})();

const DisplayController = (function () {
  const squares = document.querySelectorAll(".square");
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
  return {
    renderBoard,
  };
})();
GameController.playRound(1);
GameController.playRound(3);
GameController.playRound(7);
DisplayController.renderBoard();
