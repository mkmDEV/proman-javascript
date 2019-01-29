window.onload = function dragAndDrop() {
        dragula([
            document.getElementById('b1'),
            document.getElementById('b2'),
            document.getElementById('b3'),
            document.getElementById('b4')
        ]);


        // Scrollable area
        let element = document.getElementById("boards"); // Count Boards
        let numberOfBoards = element.getElementsByClassName('board').length;
        let boardsWidth = numberOfBoards * 30; // Width of all Boards
        console.log(boardsWidth);
        element.style.width = boardsWidth + "%"; // set Width

        // disable text-selection
        function disableselect(e) {
            return false;
        }

        document.onselectstart = new Function();
        document.onmousedown = disableselect;

    }
