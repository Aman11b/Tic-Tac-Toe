// GameBoard Module
const GameBoard = (() => {
    const board = Array(9).fill(null);

    const getBoard = () => board;

    const setCell = (index, symbol) => {
        if (board[index] === null) { // Check if the cell is empty
            board[index] = symbol;
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        board.fill(null);
    };

    return {
        getBoard,
        setCell,
        resetBoard,
    };
})();

// PLAYER FACTORY
const Player = (name, symbol) => {
    const getName = () => name;
    const getSymbol = () => symbol;

    return {
        getName,
        getSymbol,
    };
};

// Player Selection Logic
const playerSelect = (() => {
    const xBtn = document.querySelector('.btn-p.x');
    const oBtn = document.querySelector('.btn-p.o');
    const playerBtns = document.querySelectorAll('.btn-p');

    let selectSymbol = null; // Track selected symbol
    let gameStarted = false;

    const updateSelectionUI = () => {
        console.log(`Player selected: ${selectSymbol}`);
        playerBtns.forEach(btn => {
            if (btn.classList.contains(selectSymbol.toLowerCase())) {
                btn.classList.add("selected");
                btn.classList.remove("not-selected");
            } else {
                btn.classList.remove("selected");
                btn.classList.add("not-selected");
            }
        });
    };

    // Player symbol selection
    xBtn.addEventListener("click", () => {
        selectSymbol = "X";
        startGame(selectSymbol);
        updateSelectionUI();
    });

    oBtn.addEventListener("click", () => {
        selectSymbol = "O";
        startGame(selectSymbol);
        updateSelectionUI();
    });

    // Start the game logic
    const startGame = (symbol) => {
        if (!gameStarted) {
            console.log(`Starting game with Player 1 as ${symbol}`);
            GameController.startGame("Player 1", symbol);
            gameStarted = true; // Mark the game as started
        }
    };

    return {
        getSelectionSymbol: () => selectSymbol,
    };
})();

// Game Controller Logic
const GameController = (() => {
    const cells = document.querySelectorAll('.field');
    let currentPlayer;
    const players = [];

    const startGame = (player1Name, player1Symbol) => {
        const player2Symbol = player1Symbol === "X" ? "O" : "X";
        players[0] = Player(player1Name, player1Symbol);
        players[1] = Player("Player 2", player2Symbol);
        currentPlayer = players[0]; // Player 1 starts
        GameBoard.resetBoard(); // Reset the board for a new game

        cells.forEach((cell, index) => {
            cell.addEventListener("click", () => handlePlayerMove(index));
        });
    };

    // Handle a player's move
    const handlePlayerMove = (index) => {
        if (GameBoard.getBoard()[index] !== null || checkWin() || checkDraw()) {
            return; // Skip if the cell is already taken or if the game is over
        }

        if (GameBoard.setCell(index, currentPlayer.getSymbol())) {
            cells[index].innerHTML = currentPlayer.getSymbol();
        }

        if (checkWin()) {
            displayWinner();
            return;
        }
        if (checkDraw()) {
            displayDraw();
            return;
        }

        switchPlayer(); // Switch to the next player
    };

    // Switch player turn
    const switchPlayer = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    };

    // Check for a win
    const checkWin = () => {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6],            // Diagonals
        ];

        const board = GameBoard.getBoard();
        return winPatterns.some(pattern => pattern.every(index => board[index] === currentPlayer.getSymbol()));
    };

    // Check for a draw
    const checkDraw = () => {
        const board = GameBoard.getBoard();
        return board.every(cell => cell !== null);
    };

    // Display win message
    const displayWinner = () => {
        const winContainer = document.querySelector('.win');
        winContainer.classList.add('show');

        const winnerText = document.querySelector('.winner');
        winnerText.classList.remove('hide');
        winnerText.textContent = `${currentPlayer.getName()} wins!`;

        document.querySelector(`.${currentPlayer.getSymbol().toLowerCase()}-text`).classList.remove('hide');
        document.querySelector('.play-again').classList.remove('hide');
    };

    // Display draw message
    const displayDraw = () => {
        console.log("It's a draw!");
        const winContainer = document.querySelector('.win');
        winContainer.classList.add('show');

        const winnerText = document.querySelector('.winner');
        winnerText.classList.remove('hide');
        winnerText.textContent = "It's a draw!";

        document.querySelector('.play-again').classList.remove('hide');
    };

        // Restart button logic (updated)
        document.querySelector('.restart').addEventListener('click', () => {
            // Reset the board and game state
            GameBoard.resetBoard();
            cells.forEach(cell => cell.innerText = ''); // Clear the board UI
    
            // Reset player selection and allow users to pick X/O again

            playerSelect.gameStarted = false;
            playerSelect.updateSelectionUI(); // Reset UI to allow selection of X/O
        });

    // PlayAgain the game
    document.querySelector('.play-again').addEventListener('click', () => {
        GameBoard.resetBoard();
        cells.forEach(cell => cell.innerText = ''); // Clear the board UI
        document.querySelector('.win').classList.remove('show');
        document.querySelector('.winner').classList.add('hide');
        document.querySelector('.x-text').classList.add('hide');
        document.querySelector('.o-text').classList.add('hide');
        document.querySelector('.play-again').classList.add('hide'); // Hide the Play Again button

        playerSelect.getSelectionSymbol(); // Allow the user to select X/O again (optional)
    });

    return {
        startGame,
    };
})();