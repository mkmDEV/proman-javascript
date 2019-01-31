window.onload = function getBoards() {
    let boards = document.getElementsByClassName('card-body');
    for (let board of boards) {
        dragAndDrop(board)
    }
};

function dragAndDrop(board) {
    dragula([
            board.querySelector('#b1'),
            board.querySelector('#b2'),
            board.querySelector('#b3'),
            board.querySelector('#b4')
        ],
        {
            revertOnSpill: true
        }).on('dragend', function (el) {
        const currentCard = el.firstElementChild;
        let cardId = currentCard.dataset.id;
        let cardInfo = currentCard.dataset.info;
        console.log(cardInfo)
        let cardBoardId = currentCard.dataset.boardid;
        currentCard.setAttribute('data-status', el.parentElement.dataset.status);
        let cardStatus = el.parentElement.dataset.status;
        let board = document.getElementById(cardBoardId);
        let cardsOfBoard = board.closest('#boards').getElementsByClassName('card-content');
        let cardOrder = [];
        for (let card of cardsOfBoard) {
            cardOrder.push(card.dataset.id)
        }
        let boardTitle = board.dataset.title;

        updateCard(cardId, cardInfo, cardStatus);
        updateBoard(cardBoardId, boardTitle, cardOrder.toString())
    });

    // disable text-selection
    function disableselect(e) {
        return false;
    }

    board.onselectstart = new Function();
    board.onmousedown = disableselect;

}

function updateCard(cardId, cardInfo, cardStatus) {
    let data = {'card_info': cardInfo, 'card_status': cardStatus};
    fetch(`/cards/${cardId}/rename`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

function updateBoard(boardId, boardTitle, cardOrder) {
    let data = {'board_id': boardId, 'board_title': boardTitle, 'card_order': cardOrder};
    fetch(`/boards/${boardId}/rename`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}