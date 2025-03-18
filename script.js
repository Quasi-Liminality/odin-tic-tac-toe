const GameBoard = (function () {
    const board = Array(9).fill(null);

    const getBoard = () => board;

    const updateBoard = (player, index) => {
        board[index] = player;
    };

    const resetBoard = () => {
        board.fill(null);
    };

    return { getBoard, updateBoard, resetBoard };
})();

function Player({ name, marker }) {   
    const getName = () => name;
    const setName = (playerName) => name = playerName;
    const getPlayerMarker = () => marker;

    return { getName, setName, getPlayerMarker };
}

const GameController = (function () {
    const players = [
        Player({
            name: 'Player One',
            marker: '⭘'
        }),
        Player({
            name: 'Player Two',
            marker: '𝗑'
        })
    ]; 

    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    // Checks if active player has won
    const checkGameWinner = () => {
        const board = GameBoard.getBoard();
        const horizontalLines = [
            [board[0], board[1], board[2]],
            [board[3], board[4], board[5]],
            [board[6], board[7], board[8]]
        ];
        const verticalLines = [
            [board[0], board[3], board[6]],
            [board[1], board[4], board[7]],
            [board[2], board[5], board[8]]
        ];
        const diagonalLines = [
            [board[0], board[4], board[8]],
            [board[2], board[4], board[6]]
        ];

        let playerHasWon = false;

        const lines = [...horizontalLines, ...diagonalLines, ...verticalLines];

        lines.forEach(line => {
            if (line.every(item => item === activePlayer)) {
                return playerHasWon = true;
            }
        });

        return playerHasWon;
    };

    const checkGameDrew = () => {
        const board = GameBoard.getBoard();
        
        if (!board.some(item => item === null)) {
            return true;
        }
        return false;
    }

    const playRound = (cellIndex) => {
        const board = GameBoard.getBoard();
        if (!board[cellIndex]) {
            GameBoard.updateBoard(activePlayer, cellIndex);
                      
            if (checkGameWinner()) {
                console.log(`${activePlayer.getName()} has won!`);
                GameBoard.resetBoard();

            }
            if (checkGameDrew()) {
                GameBoard.resetBoard();
                
            }

            switchActivePlayer();
        }
    };

    return { getActivePlayer, playRound, checkGameWinner };
})();

const DisplayController = (function (){
    const boardDisplay = document.querySelector('.board');

    const handleBoardClick = (e) => {
        if (e.target.tagName === 'BUTTON') {
            const cellIndex = e.target.dataset.index;

            GameController.playRound(cellIndex);
            console.table(GameBoard.getBoard());
            renderGame();
        }        
    }
    boardDisplay.addEventListener('click', handleBoardClick);

    const renderGame = () => {
        const board = GameBoard.getBoard();
        const boardCells = [];

        board.forEach((cell, index) => {
            let button = document.createElement('button');
            button.dataset.index = index;
            if (cell !== null) {
                button.textContent = cell.getPlayerMarker();
            }
            boardCells.push(button);
        });

        boardDisplay.replaceChildren(...boardCells);
    };

    renderGame();
})();

// DisplayController();



// GameController.playRound(0, 0);
// GameController.playRound(0, 1);
// GameController.playRound(1, 1);
// GameController.playRound(0, 2);
// GameController.playRound(2, 2);
// console.table(GameBoard.getBoard());



