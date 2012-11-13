// size is the width and height of a new game board
// newGame creates a board of width size and height size, 
// creates an HTML representation of the board, and updates the view
function newGame() {
    window.moves = 0; //make the number of moves a property of gameBoard
    window.size = 3;

    //create correct number of cells in the table
    var htmlString = "<tr>";
    for (var i = 0; i < window.size * window.size; i++) {
        if (i % window.size == 0) {
            htmlString += "</tr><tr>";
        }
        htmlString += "<td id = '" + i + "'></td>";
    }
    htmlString += "</tr>";

    //change the view
    $("table#game").html(htmlString);
    displayBoard();
}

// keyCode is an integer representing the JQUery keycode of the pressed key
//    37: left arrow
//    38: up arrow
//    39: right arrow
//    40: down arrow
// keyboardMove moves a cell adjacent to the blank cell 
// (from the direction indicated in keyCode)
// into the blank space if this is possible. 
function keyboardMove(keyCode) {
    if (!gameFinished()) {
        direction = keyCode - 37; 

        if (canGoDirection(direction)) {
            moveCells(direction);
        }
    }
}

// startSquare is the id of the table cell that has been clicked on.
// mouseMove moves the cell that has been clicked on into the open space
// if that space is adjacent to the clicked cell.
function mouseMove(startSquare) {
    if (!gameFinished()) {
        var blankSpace = $.inArray(0, window.gameBoard);
        var direction = 5;

        //Find which direction the open space is from where you clicked.
        if (startSquare - 1 == blankSpace) {
            direction = 0;
        }
        else if (startSquare - window.size == blankSpace) {
            direction = 1;
        }    
        else if (parseInt(startSquare) + 1 == blankSpace) {
            direction = 2;
        }
        else if (parseInt(startSquare) + window.size == blankSpace) {
            direction = 3;
        } 

        //If it is possible to go that way, move the cells. 
        if (canGoDirection(direction)) {
            moveCells(direction);
        }
    }
}

// set which image the puzzle is
function setImage(path) {
    window.imagePath = path;

    $("div#image").hide();
    $("div#play").show();

    setPlayText();
    newGame();
}

// set what the layout of the puzzle will be
// arr is an array containing integers 0 to size of the array
function setGrid(arr) {
    window.gameBoard = arr;
    window.startBoard = arr.slice(0);
}

// swapIndex is a number between 0 and 3 indicating the direction you want to move
//      0: move left into blank space
//      1: move up into blank space
//      2: move right into blank space
//      3: move down into blank space
// canGoDirection returns true if it is possible to move that direction
// false if it is not. 
function canGoDirection(swapIndex) {
    var blankLocation = $.inArray(0, window.gameBoard);
    switch (swapIndex) {
        case 0: //if not on right edge
            return (blankLocation % window.size != window.size - 1);
            break;
        case 1: //if not on bottom
            return (blankLocation < window.size * (window.size - 1));
            break;
        case 2: //if not on left edge
            return (blankLocation % window.size != 0);
            break;
        case 3: //if not on top
            return (blankLocation >= window.size);
            break;
    }
    return false
}

// direction is a number between 0 and 3 indicating the direction you want to move
//      0: move left into blank space
//      1: move up into blank space
//      2: move right into blank space
//      3: move down into blank space
// moveCells moves once in the direction indicated, increments the moves made, 
// and displays win condition. 
function moveCells(direction) {
    swapCells(direction);
    displayBoard();
    window.moves += 1;

    if (gameFinished()) {
        $("div#instructions").text("You Win! Press 'New Game' to play again");
    } else {
        $("p#moves").text("Moves: " + window.moves);
    }
}

// swapIndex is a number between 0 and 3 indicating the direction you want to move
//      0: move left into blank space
//      1: move up into blank space
//      2: move right into blank space
//      3: move down into blank space
// swapCells exchanges a cell adjacent to the blank space (in swapIndex direction) 
// with the blank space 
function swapCells(swapIndex) {
    var blankLocation = $.inArray(0, window.gameBoard);
    var swapCell = blankLocation;
    switch (swapIndex) {
        case 0:
            swapCell = blankLocation + 1;
            break;
        case 1:
            swapCell = blankLocation + window.size;
            break;
        case 2:
            swapCell = blankLocation - 1;
            break;
        case 3:
            swapCell = blankLocation - window.size;
            break;
    }

    // switch the cells is in the gameBoard array
    temp = window.gameBoard[blankLocation];
    window.gameBoard[blankLocation] = window.gameBoard[swapCell];
    window.gameBoard[swapCell] = temp;
}

// gameFinished returns true if the game is finished, and false if it is not. 
function gameFinished() {
    for (var i = 0; i < window.size * window.size - 1; i++) {
        if (window.gameBoard[i] != i + 1) {
            return false;
        }
    }
    return true;
}

// resetCurrent sets the current puzzle back to its original state
function resetCurrent() {
    window.moves = 0;

    setPlayText();

    window.gameBoard = window.startBoard.slice();
    displayBoard();
}

// setPlayText changes the visible text to the default for a new game
function setPlayText() {
    $("p#moves").text("Moves: 0");
    $("div#instructions").text("Use the keyboard arrow keys" +
        " or your mouse to move the blocks into their correct positions");
}

// Update the html and css to display what the board currently looks like.
function displayBoard() {
    for (var i = 0; i < window.gameBoard.length; i++) {
        // make the background-image display the picture of the square
        $("td#" + i).css("background-image", "url('assets/" + window.imagePath +
            "/" + window.size + "/"  + window.gameBoard[i] + ".png')");
    }
}