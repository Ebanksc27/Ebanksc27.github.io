document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById("start-button");
  startButton.addEventListener("click", startGame);
});

let gameStarted = false;

function startGame() {
    if (!gameStarted) {
      gameStarted = true;
      console.log("Starting game...");
      const startButton = document.getElementById("start-button");
      
      // Remove the event listener and the button element from the DOM
      startButton.removeEventListener("click", startGame);
      startButton.remove();

   // I added a title for flavor
const title = document.getElementById("title");

// Create an array of the letters in "Connect Four"
const letters = ["c", "o", "n", "n", "e", "c", "t", "F", "o", "u", "r"];

// Loop through each letter in the array and create a span element for it
// with a class of "title-letter"
letters.forEach((letter, index) => {
  const span = document.createElement("span");
  span.classList.add("title-letter");
  span.textContent = letter;
  span.style.animationDelay = `${index * 0.1}s`;
  title.appendChild(span);
});

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
// adjusted to const since their values shouldn't change
const WIDTH = 7;
const HEIGHT = 6;

//adjusted to let since their values will change
let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  board = Array.from({ length: HEIGHT }, () => Array.from({ length: WIDTH }, () => null));
  // Array.from() used to create 2D array for game board
  // creates 2D array with demensions height and width, intializeing each cell with null.
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById("board");

  // TODO: add comment for this code
  // // Create the top row with column tops, set its ID, and add a click event listener
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // Loop through the columns to create header cells and append them to the top row
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // TODO: add comment for this code
  // Loop through each row from 0 to HEIGHT -1
  for (let y = 0; y < HEIGHT; y++) {
    //creat new row element
    const row = document.createElement("tr");

    // Loop through each coumn in current row from 0 to WIDTH -1
    for (let x = 0; x < WIDTH; x++) {
      //create new cell element
      const cell = document.createElement("td");

      // Set the ID of the cell using its row and column number
      cell.setAttribute("id", `${y}-${x}`);

      // Append the cell to the current row
      row.append(cell);
    }

    // Append the row to the board
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  // Loop through the rows from bottom to top and return the first empty row
  for (let y = HEIGHT -1; y >= 0; y--) {
    if (board[y][x] === null) {
      return y;
  }
}
// If no empty row is found, return null 
return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  // create div element for piece and add class for curent player
  const piece = document.createElement("div");
  piece.classList.add('piece', `p${currPlayer}`);

  // get the correct cell in the HTML board using the row and column index
  const cell = document.getElementById(`${y}-${x}`);
  // append the piece to the correct cell
  cell.append(piece);
}

/** endGame: announce game end and ADDING PROMPT FOR NEW GAME */

function endGame(msg) {
  // TODO: pop up alert message and prompt for new game
  setTimeout(() => {
    const playAgain = confirm(`${msg} Play again?`);
    if (playAgain) {
      resetGame();
    }
  }, 100);
}

/** resetGame: resets the board and game variables */

function resetGame() {
  // Reset board
  board = Array.from({ length: HEIGHT }, () => Array.from({ length: WIDTH }, () => null));

  // Reset current player
  currPlayer = 1;

  // Clear board in HTML
  const htmlBoard = document.getElementById("board");
  htmlBoard.innerHTML = "";

  // Re-create HTML board
  makeHtmlBoard();
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // // Get x from the ID of the clicked cell by converting the ID to a number using the plus (+) operator
  const x = +evt.target.id;

  // // Get the next available spot in the column using the findSpotForCol function (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so, call endGame
  // Check tie by checking if all cells in every row are filled
  const isTie = board.every(row => row.every(cell => cell !== null));
  if (isTie) {
    return endGame('Tie Game!');
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  // switch players: if currPlayer is 1, change to 2, otherwise change to 1
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.
// Loop through all cells in the board and check for a win starting at each cell
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // check for horizontal, vertical, and diagonal wins
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // If any win conditions found, return true
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
  // To ensure the function works if no win is found I added this
  // If no win conditions found, return false
  return false;
}

makeBoard(); // create the board
makeHtmlBoard(); // create the visual HTML board
}
}
