const TicTacToe = (function() {
    const GameBoard = (function () {
        const board = Array(9).fill(null);
    
        const getBoard = () => board;
    
        const getLines = () => {
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
    
            return [...horizontalLines, ...verticalLines, ...diagonalLines];
        };
    
        const updateCell = (player, index) => board[index] = player;
    
        const isFull = () => !board.some(cell => cell === null);
    
        const resetBoard = () => board.fill(null);
    
        return {
            getBoard,
            getLines,
            updateCell,
            isFull,
            resetBoard
        };
    })();
    
    const GameController = (function () {
        function Player({ id, name, marker }) { 
            const getID = () => id;  
            const getName = () => name;
            const setName = (playerName) => name = playerName;
            const getPlayerMarker = () => marker;
        
            return {
                getID,
                getName,
                setName,
                getPlayerMarker
            };
        }
    
        const players = [
            Player({
                id: 'player-one',
                name: 'Player One',
                marker: '⭘'
            }),
            Player({
                id: 'player-two',
                name: 'Player Two',
                marker: '𝗑'
            })
        ]; 
    
        let activePlayer = players[0];
        
        const getPlayers = () => players;
    
        const getActivePlayer = () => activePlayer;
    
        const switchActivePlayer = () => {
            activePlayer = activePlayer === players[0] ? players[1] : players[0];
        };
        
        const getGameWinner = () => {
            const lines = GameBoard.getLines();
            
            let gameWinner = null;
    
            for (const player of players) {
                lines.forEach(line => {
                    if (line.every(cell => cell === player)) {
                        return gameWinner = `${player.getName()} wins!`;
                    }
                });
            }
    
            return gameWinner;
        };
        
        const hasGameDrew = () => {     
            if (GameBoard.isFull()) {
                return 'It\s a draw!';
            }
            return false;
        }
        
        const playRound = (cellIndex) => {
            const board = GameBoard.getBoard();
            const isCellEmpty = !board[cellIndex];
            const hasGameEnded = () => (getGameWinner() || hasGameDrew());
            
            if (isCellEmpty && !hasGameEnded()) {
                GameBoard.updateCell(activePlayer, cellIndex);
                 
                if (!hasGameEnded()) {
                    switchActivePlayer();
                }
            }
        };
        
        const restartGame = () => {
            GameBoard.resetBoard();
            activePlayer = players[0];
        }
    
        return {
            getPlayers,
            getActivePlayer,
            playRound,
            getGameWinner,
            hasGameDrew,
            restartGame
        };
    })();
    
    const DisplayController = function () {
        // Dom cache
        const boardDisplay = document.querySelector('.board');
        const gameResultDisplay = document.querySelector('.game-result');
    
        const playerOneTurnIndicator = document.querySelector('#player-one .player-turn');
        const playerOneName = document.querySelector('#player-one .player-name > span');
        const playerOneRenameButton = document.querySelector('#player-one button');
        
        const playerTwoTurnIndicator = document.querySelector('#player-two .player-turn');
        const playerTwoName = document.querySelector('#player-two .player-name > span');
        const playerTwoRenameButton = document.querySelector('#player-two button');
    
        // Restart button to be appended once game is over
        const restartButton = (() => {
            const button = document.createElement('button');
            button.id = 'restart';
            button.textContent = 'Click to Restart';
            button.onclick = handleRestartClick;
            return button;
        })();
    
        const render = () => {
            const renderPlayerNames = (() => {
                const players = GameController.getPlayers();
                playerOneName.textContent = players[0].getName();
                playerTwoName.textContent = players[1].getName();
            })();
    
            const renderActiveTurnMessage = (() => {
                const message = 'Your turn!';
                const isPlayerOneActive = playerOneTurnIndicator.closest('.player').id === GameController.getActivePlayer().getID();
                if (isPlayerOneActive) {
                    playerOneTurnIndicator.textContent = message;
                    playerTwoTurnIndicator.textContent = '';
                } else {
                    playerOneTurnIndicator.textContent = '';
                    playerTwoTurnIndicator.textContent = message;
                }
            })();
    
            const renderGameBoard = (() => {
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
            })();
    
            const renderGameResults = (() => {
                const gameResult = GameController.getGameWinner() || GameController.hasGameDrew();
        
                if (gameResult) {
                    gameResultDisplay.textContent = gameResult;
                    boardDisplay.appendChild(restartButton);
                } else {
                    gameResultDisplay.textContent = 'Tic-tac-toe';
                }
            })();    
        };
        
        const clearActiveTurnIndicator = () => {
            playerOneTurnIndicator.textContent = '';
            playerTwoTurnIndicator.textContent = '';
        };
        
        // Event listeners
        boardDisplay.addEventListener('click', handleBoardClick);
        playerOneRenameButton.addEventListener('click', handleRenameClick);
        playerTwoRenameButton.addEventListener('click', handleRenameClick);
    
        // Event handlers
        function handleRestartClick(e) {
            GameController.restartGame();
            clearActiveTurnIndicator();
            
            render();
        }
        
        function handleBoardClick(e) {
            if (e.target.tagName === 'BUTTON') {
                const cellIndex = e.target.dataset.index;
        
                GameController.playRound(cellIndex);
    
                render();
            }        
        }
    
        function handleRenameClick(e) {
            const name = prompt('What would you like to be called?');
            const targetID = e.target.closest('.player').id;
            const targetPlayer = GameController.getPlayers().find(player => player.getID() === targetID);
            targetPlayer.setName(name);
    
            render();
        }
    
        render();
    };

    return DisplayController;
})();

document.querySelector('#start').addEventListener('click', TicTacToe);



