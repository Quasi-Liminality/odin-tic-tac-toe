const GameBoard = (function () {
    const board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    const getBoard = () => board;

    const updateBoard = (player, row, column) => {
        board[row][column] = player;
    };

    const resetBoard = () => {
        board.forEach((row, index) => board[index].fill(null));
    };

    return { getBoard, updateBoard, resetBoard };
})();

function Player(name, marker) {   
    const getName = () => name;
    const setName = (playerName) => name = playerName;
    const getMarker = () => marker;

    return { getName, setName, getMarker };
}

const GameController = (function () {
    const players = [
        Player('Player One', '&#9711;'),
        Player('Player Two', '&#10060;')
    ];

    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    // Checks if the active player has won
    const checkGameWinner = () => {
        const board = GameBoard.getBoard();
        const horizontalLines = board;
        const diagonalLines = [
            [board[0][0], board[1][1], board[2][2]],
            [board[0][3], board[1][1], board[2][0]]
        ];
        const verticalLines = (() => {
            const columns = [];
            for (row of board) {
                row.forEach((item, index) => {
                    if (!columns[index]) {
                        columns[index] = [];
                    }
                    columns[index].push(item);
                });
            }
            return columns;
        })();

        let hasPlayerWon = false;

        const lines = [...horizontalLines, ...diagonalLines, ...verticalLines];

        lines.forEach(line => {
            if (line.every(item => item === activePlayer)) {
                return hasPlayerWon = true;
            }
        });

        return hasPlayerWon;
    };

    const checkGameDrawed = () => {
        const board = GameBoard.getBoard();
        
        if (!board.flat().some(item => item === null)) {
            return true;
        }
        return false;
    }

    const playRound = (row, column) => {
        const board = GameBoard.getBoard();
        if (!board[row][column]) {
            GameBoard.updateBoard(activePlayer, row, column);
                      
            if (checkGameWinner()) {
                console.log(`${activePlayer.getName()} has won!`);
                GameBoard.resetBoard();

            }
            if (checkGameDrawed()) {
                GameBoard.resetBoard();
                
            }

            switchActivePlayer();
        }
    };

    return { getActivePlayer, playRound, checkGameWinner };
})();

const DisplayController = (function(){
    const boardDisplay = document.querySelector('.board');

    const renderGame = () => {
        const board = GameBoard.getBoard();
        const boardCells = [];

        board.forEach((row, rowIndex) => {
            row.forEach((item, itemIndex) => {
                let button = document.createElement('button');
                button.dataset.row = rowIndex;
                button.dataset.column = itemIndex;
                if (item !== null) {
                    button.textContent = item.getMarker();
                }
                boardCells.push(button);
            } );
        });

        boardDisplay.replaceChildren(...boardCells);
    };

    return { renderGame };
})();

DisplayController.renderGame();


// GameController.playRound(0, 0);
// GameController.playRound(0, 1);
// GameController.playRound(1, 1);
// GameController.playRound(0, 2);
// GameController.playRound(2, 2);
// console.table(GameBoard.getBoard());



