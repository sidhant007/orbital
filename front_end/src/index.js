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
  "p": "PASS",
}

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
      _sim: false,
    };
  }

  resetGame() {
    this.setState({
      _squares: Array(64).fill(null),
      _setup_id: 0,
      _trail: Array(8).fill(-1),
      _sim: false,
    })
    gc = null;
  }

  checkWinLoose() {
    if(gc != null && gc._win) {
      alert("You won the game in " + gc._turns + " moves");
      this.resetGame();
    } else if(gc != null && gc._turns > 30) {
      alert("You lost the game since you exceeded the prescribed 30 turns limit");
      this.resetGame();
    }
  }

  isValid(x) {
    return (x === 'w' || x === 'a' || x === 's' || x === 'd' || x === 'p') && this.state._sim;
  }

  componentDidMount() {
    window.addEventListener("keydown", (event) => {
      const setup_id = this.state._setup_id;
      const trail = this.state._trail.slice();
      if(this.isValid(event.key) == true && portal_cnt != 1) {
        this.setState({
          _squares: gc.play_user(dir[event.key], this.state._squares),
          _setup_id: setup_id,
          _trail: trail,
          _sim: this.state._sim,
        });
        this.checkWinLoose();
        portal_cnt = 0;
        for(var i = 0; i < 64; i++) if(this.state._squares[i] === 'P')  portal_cnt++;
      }
    });
  }

  valid_cell(portal_coord, squares) {
    var user_coord = -1;
    for(var i = 0; i < 64; i++) if (squares[i] === 'U')  user_coord = i;
    return Math.floor(portal_coord / 8) === Math.floor(user_coord / 8) || (portal_coord % 8) === (user_coord % 8);
  }

  handleClick(i) {
    const squares = this.state._squares.slice();
    const setup_id = this.state._setup_id;
    const trail = this.state._trail.slice();
    if(this.state._sim) {
      if(squares[i])  return ;
      var hasShot = 0;
      if(this.valid_cell(i, squares) === true && portal_cnt <= 1) {
        portal_cnt++;
        hasShot = 1;
        squares[i] = 'P';
      }
      this.setState({
        _squares: squares,
        _setup_id: setup_id,
        _trail: trail,
        _sim: this.state._sim,
      });
      if(portal_cnt === 2 && hasShot === 1) {
        this.setState({
          _squares: gc.play_user("SHOOT", squares),
          _setup_id: setup_id,
          _trail: trail,
          _sim: this.state._sim,
        });
        this.checkWinLoose();
      }
    }
    else {
      if(squares[i] === 'X') {
        squares[i] = null;
        this.setState({
          _squares: squares,
          _setup_id: Math.min(3, setup_id),
          _trail: trail,
          _sum: this.state._sim,
        });
      }
      else if(squares[i] === null) {
        squares[i] = setup_component[setup_id];
        this.setState({
          _squares: squares,
          _setup_id: Math.min(3, setup_id + 1),
          _trail: trail,
          _sim: this.state._sim,
        });
      } else {
        return ;
      }
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
      _sim: this.state._sim,
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
    this.setState({
      _squares: this.state._squares,
      _setup_id: this.state._setup_id,
      _trail: this.state._trail,
      _sim: true,
    })
    gc = new game_controller(8, 8);
  }

  setupPreset(id) {
    const squares = Array(64).fill(null);
    const trail = this.state._trail.slice();
    if(id === 1) {
      squares[0] = 'U';
      squares[1] = 'X';
      squares[9] = 'X';
      squares[16] = 'X';
      squares[20] = 'C';
      squares[34] = 'E';
    } else if (id === 2){
      squares[3] =  squares[11] = squares[19] = 'X';
      squares[9] = 'U', squares[14] = 'C';
      for(var i = 24; i < 32; i++)  squares[i] = 'X';
      squares[43] = 'E';
    } else if(id === 3) {
      squares[0] = 'U';
      squares[8] = squares[16] = squares[32] = squares[40] = squares[56] = 'X';
      squares[24] = 'E', squares[48] = 'C';
      for(var i = 2; i < 8; i++)  squares[i] = 'X';
    }
    this.setState({
      _squares: squares,
      _setup_id: 3,
      _trail: trail,
      _sim: this.state._sim,
    })
  }

  render() {
    const status = message[this.state._setup_id];
    const turns = gc === null ? 0 : gc._turns;

    return (
      <div className="board">
        <div className="instruction-board">
          <div className="status-heading">Portal</div>
          <div className="status">Instructions</div>
            <ul>
              <li> U = "User", C = "CPU", E = "Exit", P = "Portal", X = "Brick" </li>
              <li> First build the map, you can EITHER - </li>
                <ul>
                  <li> Construct the map by placing User, CPU, Exit and Bricks( click on a brick cell incase you want to unselect it) OR </li>
                  <li> Press the button "Preset 1/2/3" to begin with a sample map. </li>
                </ul>
              <li> Now press "Start Simulation" to begin the game </li>
              <li> In a single turn you can EITHER - </li>
                <ul>
                  <li> Move user using "wasd" (w = up, a = left, s = down, d = right) OR </li>
                  <li> Click on 2 valid cells to create portals </li>
                  <li> Pass your turn by pressing "p" (It still contributes to the turn)</li>
                </ul>
              <li> User/CPU can ONLY walk on empty or portal cells. </li>
              <li> Valid cells for portals created by user must either have the same row or same column as user AND must be an empty cell</li>
              <li> At any given instant there can only be a single pair of portal (i.e 2 cells with P) in the game. </li>
              <li> Objective is that the user/cpu either of the two should reach the exit in minimum no. of turns. If no. of turns used exceeds 30, you loose.</li>
              <li> A single turn consists of movement by both the User and the CPU </li>
            </ul>
        </div>
        <div className="game-board">
          <div className="status-left">{status}</div>
          <div className="status-right">#Turns: {turns}</div>
          {Array(8).fill(null).map((_, i) =>
            <div className = "board-row">
              {Array(8).fill(null).map((_, j) =>
                this.renderSquare(i*8 + j)
              )}
            </div>
          )}
          <button className="use-preset" onClick={() => this.setupPreset(1)} disabled={this.state._sim}>
            Preset 1
          </button>
          <button className="use-preset" onClick={() => this.setupPreset(2)} disabled={this.state._sim}>
            Preset 2
          </button>
          <button className="use-preset" onClick={() => this.setupPreset(3)} disabled={this.state._sim}>
            Preset 3
          </button>
          <button className="start" onClick={() => this.startSim()} disabled={this.state._sim}>
            Start Simulation
          </button>
          <button className="reset" onClick={() => this.resetGame()}>
            Reset Game
          </button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Board />,
  document.getElementById('root')
);
