import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

var game_controller = require('./game_controller.js')

var cell_color = {
  "U": "Yellow",
  "C": "Blue",
  "X": "Red",
  "E": "White",
  "P": "Pink",
}

var dir = {
  "w": "UP",
  "a": "LEFT",
  "s": "DOWN",
  "d": "RIGHT",
}

var sim_started = false;
var portal_cnt = 0;
var gc = null;

class Square extends React.Component {
  render() {
    const color = cell_color[this.props.value];
    return (
      <button className="square" 
        onClick = {() => this.props.onClick()} 
        style = {{backgroundColor: color, opacity: this.props.my_opacity}} 
        onMouseEnter = {() => this.props.onMouseOver()} 
      >
        {this.props.value}
      </button>
    );
  }
}

var setup_component = ['U', 'C', 'E', 'X']
var message = ["Place User", "Place Computer", "Place Exit", "Place bricks"]

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _squares: Array(64).fill(null), // 8 * 8 grid
      _setup_id: 0,
      _trail: Array(8).fill(-1),
    };
  }

  isValid(x) {
    return (x === 'w' || x === 'a' || x === 's' || x === 'd') && sim_started;
  }

  componentDidMount() {
    window.addEventListener("keydown", (event) => {
      const setup_id = this.state._setup_id;
      const trail = this.state._trail.slice();
      if(this.isValid(event.key)) {
        this.setState({
          _squares: gc.play_user(dir[event.key], this.state._squares),
          _setup_id: setup_id,
          _trail: trail,
        });
      }
    });
  }

  handleClick(i) {
    const squares = this.state._squares.slice();
    const setup_id = this.state._setup_id;
    const trail = this.state._trail.slice();
    if(squares[i]) {
      return ;
    }
    if(sim_started) {
      portal_cnt++;
      squares[i] = '?';
      this.setState({
        _squares: squares,
        _setup_id: setup_id,
        _trail: trail,
      });
      if(portal_cnt === 2) {
        this.setState({
          _squares: gc.play_user("SHOOT", squares),
          _setup_id: setup_id,
          _trail: trail,
        });
        portal_cnt = 0;
      }
    }
    else {
      squares[i] = setup_component[setup_id];
      this.setState({
        _squares: squares,
        _setup_id: Math.min(3, setup_id + 1),
        _trail: trail,
      });
    }
  }

  handleOver(i) {
    const trail = this.state._trail.slice();
    trail.shift();
    trail.push(i);
    this.setState({
      _squares: this.state._squares,
      _setup_id: this.state._setup_id,
      _trail: trail,
    });
  }

  renderSquare(i) {
    return (<Square
      value = {this.state._squares[i]}
      onClick = {() => this.handleClick(i)}
      onMouseOver = {() => this.handleOver(i)}
      my_opacity = {Math.min(1, (11 - this.state._trail.indexOf(i)) * 0.1)}
    />);
  }

  startSim() {
    if(this.state._setup_id < 3) {
      alert("The board is incomplete!! Please fill in all the details.")
      return ;
    }
    sim_started = true;
    gc = new game_controller(8, 8);
  }

  render() {
    const status = message[this.state._setup_id];

    return (
      <div>
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
        <button className = "start" onClick={() => this.startSim()}>
          Start Simulation
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  <Board />,
  document.getElementById('root')
);

