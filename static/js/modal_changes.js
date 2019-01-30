//Create board
buttonBoard = document.getElementById("create_board");
modalCreateBoard = document.getElementById("board_modal");


buttonBoard.addEventListener("click", createBoard);


function createBoard(){
    modalCreateBoard.style.display = "block";
}


//CreaeteCard
buttonCard = document.getElementById("create_card");
modalCreateCard = document.getElementById("card_modal");


buttonCard.addEventListener("click", createCard)


function createCard(){
    modalCreateCard.style.display = "block";
}