window.onload = function getBoards () {
    let boards = document.getElementsByClassName('card-body')
    for (let board of boards) {
        dragAndDrop(board)
    }
}



    function dragAndDrop(board) {
        dragula([
            board.querySelector('#b1'),
            board.querySelector('#b2'),
            board.querySelector('#b3'),
            board.querySelector('#b4')
        ],
            {
      revertOnSpill: true
    });

        // disable text-selection
        function disableselect(e) {
            return false;
        }

        board.onselectstart = new Function();
        board.onmousedown = disableselect;

    }
