import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props){
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
  
  renderSquare(i) {
    return (
    	<Square 
    		value={this.props.squares[i]}
    		onClick={() => this.props.onClick(i)}
    		key={i}
    		id={i}
    	/>
    );
  }

// Template for creating board using 2 loops
// c - cols, r - rows
  createBoard() {
  	let cols = [];
  	for(let c = 0; c < 3; c++){
  		let rows = [];
  		for(let r = 0; r < 3; r++){
  			// i - used for renderSquare function
  			let i = 3*c + r;
  			rows.push(this.renderSquare(i));
  		}
  		cols.push(rows);
  	}
  	return (
  		<div>
  			{cols.map(function(col, index){
  					return <div className="board-row" key={index}>{col}</div>;
  			})}
  		</div>
  	)
  }


  render() {
    return (
      this.createBoard()
    );
  }
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
				positions: Array(9).fill(null),
			}],
			stepNumber: 0,
			xIsNext: true,
			positions: [], // holds a history of (row, col) for moves
			jumped: false, // used as mediator, between choosing a move, and creating new timeline, for positions
			ascending: true, // to track order to display moves
		}
	}

	 handleClick(i) {
  	const history = this.state.history.slice(0, this.state.stepNumber + 1);
  	const current = history[history.length - 1];
  	const squares = current.squares.slice();
  	let positions = this.state.positions;
  	const calcWin = calculateWinner(squares);
  	if(calcWin || squares[i]) {
  		return;
  	}
  	squares[i] = this.state.xIsNext ? 'X' : 'O';
  	// some arithmetics to convert i into col,row
  	let col = (i % 3) + 1;
  	let row = Math.ceil((i+1.0)/3);
  	let pos = {col: col,
  						 row: row};
  	this.setState({
  		history: history.concat([{
  			squares: squares,
  			positions: positions,
  		}]),
  		stepNumber: history.length,
  		xIsNext: !this.state.xIsNext,
   	});
   	if(this.state.jumped){
   		positions = positions.slice(0, this.state.stepNumber);
   	}
   	positions.push(pos);
 	 	this.setState({
 			positions: positions,
 			jumped: false,
 		});
   	
   	const length = this.state.history.length;
  	for(let j = 0; j < length; j++){
  		document.getElementById(j).style.fontWeight = "normal";
  	}
  }

  jumpTo(step) {
  	const length = this.state.history.length;
  	for(let i = 0; i < length; i++){
  		document.getElementById(i).style.fontWeight = "normal";
  	}
  	this.setState({
  		stepNumber: step,
  		xIsNext: (step % 2) === 0,
  		jumped: true,
  	});
  	document.getElementById(step).style.fontWeight = "bold";
  }

  render() {
  	let history = this.state.history;
  	const current = history[this.state.stepNumber];
  	const calcWin = calculateWinner(current.squares);
  	const positions = this.state.positions;
  	const length = history.length;

  	const moves = history.map((step, move) => {
  		let col, row;
  		// change move if order is different
  		if(!this.state.ascending){
  			move = length - move - 1;
  		}
  		if(move) {
	  		col = positions[move - 1].col;
	  		row = positions[move - 1].row;
	  	}
	  	else{
	  		col = 0;
	  		row = 0;
	  	}
  		const desc = move ?
  			'Go to move #' + move + " at (" + col + "," + row + ")" :
  			'Go to game start';
  			return (
  				<li key={move.toString()}>
  					<button id={move} onClick={() => this.jumpTo(move)}>{desc}</button>
  				</li>
  			);

  	});

  	let status;
  	let lines;
  	if(calcWin) {
    	status = 'Winner: ' + calcWin.winner;
    	// highlight the right boxes
    	lines = calcWin.lines;
    	for(let i = 0; i < lines.length; i++){
    		// use #E3D75C for background
    		// document.getElementById(lines[i]).style.background = "#e3d75c";
    		// throws an error, cant read proprty style of null
    		// when using get elementById, refers to moves, not squares
    		console.log("test: " + lines[i]);
    		// POTENTIAL SOLUTION: pass calcWin as prop to  Board
    		// In Board, check if calcWin is not null
    		// if not null get lines and set square colors to #e3d75c
    	}
    }
    else {
    	status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
          	squares={current.squares}
          	onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <button onClick={() => this.setState({ascending: !this.state.ascending,})}>
          	Ascending order: {this.state.ascending.toString()}
          </button>
        </div>
      </div>
    );
  }
}

// instead of only returning squares[a]
// we could return an object of squares[a] and lines[i]
// use lines[i] to color the boxes that caused a win
function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	for(let i = 0; i < lines.length; i++){
		const [a, b, c] = lines[i];
		if (squares[a] &&
				squares[a] === squares[b] &&
				squares[a] === squares[c])
		{
			return {
				winner: squares[a],
				lines: lines[i]
			};
		}
	}
	return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
