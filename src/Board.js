import React from 'react';
import './index.css';

function Square(props) {
    return(
        <div 
            className='square'
            onClick={ props.onClick }
        >
            {props.value}
        </div>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square
            value={this.props.board[i]}
            onClick={() => this.props.onClick(i)}
        />
    }

    render() {
        return(
            <div className='board'>
                {this.renderSquare(0)}
                {this.renderSquare(1)}
                {this.renderSquare(2)}
                {this.renderSquare(3)}
                {this.renderSquare(4)}
                {this.renderSquare(5)}
                {this.renderSquare(6)}
                {this.renderSquare(7)}
                {this.renderSquare(8)}
            </div>
        );
    }
}

export default Board