import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

var cell_color = {
  "A": "Yellow",
  "B": "Blue",
  "X": "Red",
  "E": "White",
}

class Square extends React.Component {
  render() {
    const color = cell_color[this.props.value];
    return (
      <button className="square" onClick = {() => this.props.onClick()} 
          style = {{backgroundColor: color}}>
        {this.props.value}
      </button>
    );
  }
}

class Point {
  constructor(x, y) {
    this._x = x;
    this._y = y;
  }
}

var setup_component = ['A', 'B', 'E', 'X']
var message = ["Place player 1", "Place player 2", "Place Exit", "Place brick"]

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _squares: Array(64).fill(null), // 8 * 8 grid
      _setup_id: 0,
    };
  }

  get_coord(x) {
    return new Point(Math.floor(x / 8), x % 8);
  }

  handleClick(i) {
    const squares = this.state._squares.slice();
    const setup_id = this.state._setup_id;
    if(squares[i]) {
      return ;
    }
    squares[i] = setup_component[setup_id];
    this.setState({
      _squares: squares,
      _setup_id: Math.min(3, setup_id + 1),
    });
  }

  renderSquare(i) {
    return (<Square
      value = {this.state._squares[i]}
      onClick = {() => this.handleClick(i)}
    />);
  }


  render() {
    const status = message[this.state._setup_id];

    return (
      <div>
        <div className="status">{status}</div>
        {Array(8).fill(null).map((_, i) => 
          <div className = "board-row">
            {Array(8).fill(null).map((_, j) => 
              this.renderSquare(i*8 + j)
            )}
          </div>
        )}
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div>
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
          <div className="game-info">
            {/*<!-- Don't know this divs use, copied the broad code from a tutorial done earlier */}
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
          </div>
        </div>
        <button className = "start"> {/*On click should communicate with backend*/}
          Start Simulation
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

