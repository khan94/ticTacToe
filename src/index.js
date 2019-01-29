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
    	/>
    );
  }

// Template for creating board using 2 loops
// c - cols, r - rows
  createRows() {
  	let counter = 0;
  	let cols = [];
  	for(let c = 0; c < 3; c++){
  		let rows = [];
  		for(let r = 0; r < 3; r++){
  			// i - used for renderSquare function
  			let i = 3*c + r;
  			rows.push(this.renderSquare(i));
  			counter++;
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
      this.createRows()
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
			jumped: false,
		}
	}

	 handleClick(i) {
  	const history = this.state.history.slice(0, this.state.stepNumber + 1);
  	const current = history[history.length - 1];
  	const squares = current.squares.slice();
  	const positions = current.positions.slice();
  	if(calculateWinner(squares) || squares[i]) {
  		return;
  	}
  	squares[i] = this.state.xIsNext ? 'X' : 'O';
  	let col = (i % 3) + 1;
  	let row = Math.ceil((i+1.0)/3);
  	console.log("TEST: col: " + col + " and row: " + row);
  	positions[history.length - 1] = {col: col,
  									row: row,};
  	console.log("History Length: " + history.length);
  	console.log("Col: " + positions[history.length - 1].col);
  	console.log("Row: " + positions[history.length - 1].row);
  	this.setState({
  		history: history.concat([{
  			squares: squares,
  			positions: positions,
  		}]),
  		stepNumber: history.length,
  		xIsNext: !this.state.xIsNext,
   	});
   	const length = this.state.history.length;
  	for(let i = 0; i < length; i++){
  		document.getElementById(i).style.fontWeight = "normal";
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
  	const history = this.state.history;
  	const current = history[this.state.stepNumber];
  	const winner  = calculateWinner(current.squares);
  	const positions = current.positions;

  	const moves = history.map((step, move) => {
  		let col, row;
  		// using jumped from state, so that the app doesn't crash
  		// when time travelling, as I haven't fixed bug
  		// of showing proper (col, row) after timetravel
  		if(move && !this.state.jumped) {
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
  				<li key={move}>
  					<button id={move} onClick={() => this.jumpTo(move)}>{desc}</button>
  				</li>
  			);

  	});

  	let status;
  	if(winner) {
    	status = 'Winner: ' + winner;
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
        </div>
      </div>
    );
  }
}

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
			return squares[a];
		}
	}
	return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
