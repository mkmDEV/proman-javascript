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
        let card_id = el.firstElementChild.dataset.id;
        let card_info = el.firstElementChild.dataset.info;
        let board = el.closest("board-title")
        let board_id = board.dataset.id;
        console.log(board_id)
        let board_title = board.dataset.title;
        let card_order = board.dataset.cardorder;
        el.firstElementChild.setAttribute('data-status', el.parentElement.dataset.status);
        let card_status = el.parentElement.dataset.status;
        updateCard(card_id, card_info, card_status);
        updateBoard(board_id, board_title, card_order)
    });

    // disable text-selection
    function disableselect(e) {
        return false;
    }

    board.onselectstart = new Function();
    board.onmousedown = disableselect;

}

function updateCard(card_id, card_info, card_status) {
    let data = {'card_info': card_info, 'card_status': card_status};
    fetch(`/cards/${card_id}/rename`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

function updateBoard(board_id, card_order) {
    let data = {'board_id': board_id, 'card_order': card_order};
    fetch(`/cards/${board_id}/rename`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}