import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Board from './Board';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    board: Array(9).fill(null),
                    player: null,
                    move: [null, null]
                }
            ],
            viewStep: 0,
            turn: 'X'
        };
    }

    findMove() {
        const tempHistory = this.state.history.slice(0, this.state.viewStep + 1);
        const current = tempHistory[tempHistory.length - 1];
        const board = [...current.board];

        if(calculateWinner(board)) return;

        let bestMove = null;
        let bestScore = -Infinity;
        for(let i = 0; i < 9; i++) {
            if(!board[i]) {
                board[i] = ai;
                let newScore = minimax(board, 0, false);
                board[i] = null;

                if(newScore > bestScore){
                    bestScore = newScore;
                    bestMove = i;
                }
            }
        }

        this.addMove(board, tempHistory, bestMove);
    }

    addMove(board, history, i) {
        board[i] = this.state.turn;
        this.setState({
            history: history.concat([{
                board: board,
                player: board[i],
                move: findSquare(i)
            }]),
            viewStep: history.length,
            turn: this.state.turn === 'X' ? 'O' : 'X'
        });
    }
    
    handleClick(i) {
        const tempHistory = this.state.history.slice(0, this.state.viewStep + 1);
        const current = tempHistory[tempHistory.length - 1];
        const board = [...current.board];

        if(calculateWinner(board) || board[i]) return;

        this.addMove(board, tempHistory, i);
    }

    jumpTo(step) {
        this.setState({
            viewStep: step,
            turn: (step % 2) === 0 ? 'X' : 'O'
        })
    }

    checkForWinner(winner) {
        if(winner === 'X' || winner === 'O') return ['Winner: ', winner];
        else if(winner === 'Draw') return ['This is a ', winner]
        return ['Next player: ', this.state.turn]
    }

    render() {
        // AIs turn
        if(this.state.turn === ai) this.findMove();

        const tempHistory = this.state.history;
        const current = tempHistory[this.state.viewStep];
        const winner = calculateWinner(current.board);
        // const draw = calculateDraw(current.board);

        let [status, nextPlayer] = this.checkForWinner(winner);

        const moves = tempHistory.map((step, moveNumb) => {
            const move = step.player + ': '+ moveToString(step.move);
            const desc = moveNumb ? move : 'Go to beginning';
            return(
                <li key={moveNumb}>
                    <button onClick={() => this.jumpTo(moveNumb)}>{desc}</button>
                </li>
            );
        });

        return(
            <div className="screen">
                <div className="board">
                    <Board 
                        board = {current.board}
                        onClick = {i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div className="status">{status}<b>{nextPlayer}</b></div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// Global Variables
// ----------------------------------------------------------------------------------------

const WinningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const Columns = ['A', 'B', 'C']

const player = 'O', ai = 'X';

// Functions
// ----------------------------------------------------------------------------------------

function calculateWinner(board) {
    for(let i = 0; i < WinningCombos.length; i++){
        const [a, b, c] = WinningCombos[i];
        if(board[a] === board[b] && board[b] === board[c]) return board[a];
    }

    if(board.every(value => {return value})){
        return 'Draw';
    }

    return null;
}

function moveToString(arr) {
    return arr[0] + arr[1];
}

function findSquare(index) {
    const col = Columns[index % 3];
    const row = Math.floor(index / 3) + 1;
    return [col, row];
}

// AI
// ----------------------------------------------------------------------------------------

function scores(score) {
    if(score === ai) return 1;
    if(score === player) return -1;
    return 0;
}

function minimax(board, depth, isMaximizing) {
    let score = calculateWinner(board);

    if(score) return scores(score);

    if(isMaximizing){
        let bestMove = -Infinity;

        for(let i = 0; i < 9; i++){
            if(!board[i]){
                board[i] = ai;
                bestMove = Math.max(bestMove, minimax(board, depth + 1, !isMaximizing));
                board[i] = null;
            }
        }
        return bestMove;
    }
    
    else {
        let bestMove = Infinity;

        for(let i = 0; i < 9; i++){
            if(!board[i]){
                board[i] = player;
                bestMove = Math.min(bestMove, minimax(board, depth + 1, !isMaximizing));
                board[i] = null;
            }
        }
        return bestMove;
    }
}

// DOM
// ----------------------------------------------------------------------------------------

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);