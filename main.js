const GameBoard=(()=>{
    // board initializing
    const board=Array(9).fill(null);

    // method to get board state
    const getBoard=()=>board;

    // method ot set a cell's value
    const setCell=(index,Symbol)=>{
        if(board[index]===null){ //check if the cell is empty
            board[index]=Symbol;
            return true;
        }
        return false;
    };

    // method to reset tye board
    const resetBoard=()=>{
        board.fill(null);
    };

    return{
        getBoard,
        setCell,
        resetBoard
    };

})();

// console.log(GameBoard.setCell(0,"X"));
// console.log(GameBoard.getBoard());
// console.log(GameBoard.setCell(1,"O"));
// console.log(GameBoard.getBoard());
// GameBoard.resetBoard();
// console.log(GameBoard.getBoard());

// PLAYER FACTORY
const Player=(Name,Symbol)=>{
    // store player details
    const getName=()=>Name;
    const getSymbol=()=>Symbol;

    return{
        getName,getSymbol
    };
};

// const play1=Player("Alice","X");
// console.log(play1.getName(),play1.getSymbol())
// const play2=Player("Ali","O");
// console.log(play2.getSymbol())

// player selection handling
const playerSelect=(()=>{
    const xBtn=document.querySelector('.btn-p.x');
    const yBtn=document.querySelector('.btn-p.o');
    const playerBtn=document.querySelectorAll('.btn-p');

    let selectSymbol="X" //default player symbol

    const updateSelectionUI=()=>{
        playerBtn.forEach(btn=>{
            if(btn.classList.contains(selectSymbol.toLocaleLowerCase())){
                btn.classList.add("selected");
                btn.classList.remove("not-selected");
            }else{
                btn.classList.remove("selected");
                btn.classList.add("not-selected")
            }
        });
    };


    xBtn.addEventListener("click",()=>{
        selectSymbol="X";
        updateSelectionUI();
        console.log("Player selected x");
    });

    yBtn.addEventListener("click",()=>{
        selectSymbol="O";
        updateSelectionUI();
        console.log("Player selected o");
    })

    return{
        getSelectionSymbol:()=>selectSymbol,
    };


})();



// GAME CONTROLLER
const GameController=(()=>{
    // initialize initial player
    let currentPlayer;
    const player=[];

    // start the game
    const startGame=(player1Name,player2Name)=>{
        player[0]=Player(player1Name,"X");
        player[1]=Player(player2Name,"O");
        currentPlayer=player[0];
        GameBoard.resetBoard();
        console.log(`Starting game: ${player[0].getName()} vs ${player[1].getName()}`);
    };

    // toggle player
    const switchPlayer=()=>{
        currentPlayer=currentPlayer===player[0]?player[1]:player[0];
        console.log(`Switched player: It's now ${currentPlayer.getName()}'s turn`);
    }

    // return current player
    const getCurrentPlayer=()=>currentPlayer;

    // handle player move
    const playTurn=(index)=>{
        if(GameBoard.setCell(index,currentPlayer.getSymbol())){
            console.log(`${currentPlayer.getName()} placed ${currentPlayer.getSymbol()} at ${index}`);
            if(checkWin()){
                console.log(`${currentPlayer.getName()} wins!`);
                return;
            }
            switchPlayer();
            console.log(`It's ${currentPlayer.getName()}'s turn`);
        }else{
            console.log("Cell is already taken");
        }
        
    };

    // win condition check
    const checkWin=()=>{
        const winPattern=[
            [0,1,2],[3,4,5],[6,7,8],//row
            [0,3,6],[1,4,7],[2,5,8],//col
            [0,4,8],[2,4,6]    //diagonal
        ];
        const board=GameBoard.getBoard();
        return winPattern.some(pattern=>pattern.every(index=>board[index]===currentPlayer.getSymbol()));
    };

    // return public method
    return{startGame,playTurn};
})();

