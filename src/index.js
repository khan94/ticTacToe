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
			positions: [],
			jumped: false, // used as mediator, between choosing a move, and creating new timeline, for positions
			ascending: true,
		}
	}

	 handleClick(i) {
  	const history = this.state.history.slice(0, this.state.stepNumber + 1);
  	const current = history[history.length - 1];
  	const squares = current.squares.slice();
  	let positions = this.state.positions;
  	if(calculateWinner(squares) || squares[i]) {
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
   		console.warn("test to see if jumped");
   		positions = positions.slice(0, this.state.stepNumber);
   	}
   	positions.push(pos);
 	 	this.setState({
 			positions: positions,
 			jumped: false,
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
  	let history = this.state.history;
  	const current = history[this.state.stepNumber];
  	const winner  = calculateWinner(current.squares);
  	const positions = this.state.positions;


  	// this changes the variable history
  	// but if I try to change this.state.history
  	// crashes, because history.positions.length =  9
  	// And if its reversed, retrieving positions[0].col
  	// will throw an error, overall looks good, my first
  	// task was not solved fully, and was not solved correctly
  	// if(!this.state.ascending){
  	// 	history = history.slice().reverse();
  	// 	console.log(history);
  	// }
  	// else
  	// 	console.log(history);

  	// POTENTIAL SOLUTION: dont make positions of certain length
  	// so when reversing, we wont be trying to get null of undefined
  	// or make pulling information different, i.e dont do positions[move-1].col

  	// I think positions needs to stay with history,
  	// easier for updating when time travelling
  	console.log("history length: " + history.length);
  	const length = history.length;
  	const moves = history.map((step, move) => {
  		let col, row;
  		if(!this.state.ascending){
  			// change move
  			move = length - move - 1;
  		}
  		//or have a another if statement to check if ascending or not
  		//to retrieve the positions[i] properly
  		if(move) {
	  		col = positions[move - 1].col;
	  		row = positions[move - 1].row;
	  	}
	  	else if(move && !this.state.ascending){
	  		// retrieve col and row differently?
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
          <button onClick={() => this.setState({ascending: !this.state.ascending,})}>
          	Ascending order: {this.state.ascending.toString()}
          </button>
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
