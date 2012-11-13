//
function move(keyCode) {
    if (!gameFinished()){ //if the game is finished, don't allow further play
        var blankSpace = $.inArray(0, gameBoard);
        //var blankSpaceBoard = blankSpaceArr+1;
        direction = keyCode - 37;

        if (canGoDirection(direction)){
            $("div#instructions").text(direction);
            moveCells(direction);
        }
    }
}

function mouse(startSquare){

    var blankSpace = $.inArray(0, gameBoard);

    direction = 5;
    if (startSquare - 1 == blankSpace) {
        direction = 0;
    }
    else if (startSquare - gameBoard.size == blankSpace){
        direction = 1;
    } 
    else if (parseInt(startSquare) + 1 == blankSpace){
        direction = 2;
    }
    else if (parseInt(startSquare) + gameBoard.size == blankSpace){
        direction = 3;
    } 

    if (canGoDirection(direction)){
        $("div#instructions").text(direction);
        moveCells(direction);
    }
}



//size is the width and height of a new game board
function newGame(size) {
    gameBoard = [];
    gameBoard.size = size;
    gameBoard.moves = 0;

    var htmlString = "<tr>";
    for (var i = 0; i < size * size; i++){
        if (i % size == 0) {
            htmlString += "</tr><tr>";
        }
        htmlString += "<td id = '" + i + "'></td>";
        gameBoard[i] = i;
    }

    htmlString += "</tr>";


    randomizeArray(gameBoard);


    $("table#game").html(htmlString);



    $("div#instructions").text("");

    displayBoard(gameBoard);
}

function displayBoard() {
    for (var i = 0; i < gameBoard.length; i++){
        var picture = "url('1.png')";
        $("td#" + i).css("background-image", "url('" + gameBoard[i] + ".png')");
    }
}

function randomizeArray(array) {
    for (var i = 0; i < 100 * array.length; i ++){
        var direction = Math.floor(Math.random()*4);
        if (canGoDirection(direction)){
            swapCells(direction);
        }
    }
}

function canGoDirection(swapIndex) {
    var blankLocation = $.inArray(0, gameBoard);
    switch (swapIndex) {
        case 2:
            return (blankLocation % gameBoard.size != 0);
            break;
        case 3:
            return (blankLocation >= gameBoard.size);
            break;
        case 0:
            return (blankLocation % gameBoard.size != gameBoard.size - 1);
            break;
        case 1:
            return (blankLocation < gameBoard.size * (gameBoard.size - 1));
            break;
    }
    return false
}

function swapCells(swapIndex){
    var blankLocation = $.inArray(0, gameBoard);
    switch (swapIndex) {
        case 2:
            swapCell = blankLocation - 1;
            break;
        case 3:
            swapCell = blankLocation - gameBoard.size;
            break;
        case 0:
            swapCell = blankLocation + 1;
            break;
        case 1:
            swapCell = blankLocation + gameBoard.size;
            break;
    }
    temp = gameBoard[blankLocation];
    gameBoard[blankLocation] = gameBoard[swapCell];
    gameBoard[swapCell] = temp;
    blankLocation = swapCell;

}

function moveCells(direction) {

    swapCells(direction);
    displayBoard();
    gameBoard.moves += 1;

    if (gameFinished()) {
        $("div#instructions").text("You Win! You used " + gameBoard.moves + " moves");
    } else {
        $("div#instructions").text("Moves: " + gameBoard.moves);
    }
}

function gameFinished() {
    for (var i = 0; i < gameBoard.size * gameBoard.size -1; i++) {
        if (gameBoard[i] != i + 1) {
            return false;
        }
    }
    return true;
}