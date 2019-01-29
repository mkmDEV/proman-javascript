buttonBoard = document.getElementById("create_board");

modalCreateBoard = document.getElementById("board_modal")

buttonBoard.addEventListener("click", createBoard);

function createBoard(){
    modalCreateBoard.style.display = "block";
}