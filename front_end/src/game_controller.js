var game_state = require("./game_state.js")
var game_tree = require("./game_tree.js")

const dx = [1, -1, 0, 0]
const dy = [0, 0, 1, -1]

module.exports = class game_controller {

	constructor(rows, cols) {
    this._rows = rows;
    this._cols = cols;
    this._turns = 0;
    this._win = false;
	}

  valid_portal(user, portal) {
    if(user[0] === portal[0] && user[1] === portal[1])  return false;
    return (user[0] === portal[0] || user[1] === portal[1]);
  }

  prettify(grid) {
    var board = new Array(this._rows * this._cols);
    for(var i = 0; i < this._rows; i++) {
      for(var j = 0; j < this._cols; j++) {
        var tmp = grid[i][j];
        if(tmp === '?')  tmp = null;
        board[i * this._cols + j] = tmp;
      }
    }
    return board;
  }

  same_pos(a, b) {
    return (a[0] === b[0] && a[1] === b[1]);
  }

  manhattan_dist(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
  }

  invalid_pos(grid, a) {
    var outside = (a[0] < 0 || a[0] >= this._cols || a[1] < 0 || a[1] >= this._rows);
    if(outside) return true;
    if(grid[a[0]][a[1]] === null || grid[a[0]][a[1]] === 'P' ||
      grid[a[0]][a[1]] === 'E') return false;
    else                                                      return true;
  }

  move(old_user, new_user, portal, grid, letter) {
    if(letter === 'U')  this._turns++;
    var new_pos = grid[new_user[0]][new_user[1]];
    if(new_pos === 'P') {
      grid[old_user[0]][old_user[1]] = null;
      if(this.same_pos(portal[0], new_user)) {
        grid[portal[0][0]][portal[0][1]] = null;
        grid[portal[1][0]][portal[1][1]] = letter;
      } else {
        grid[portal[1][0]][portal[1][1]] = null;
        grid[portal[0][0]][portal[0][1]] = letter;
      }
    } else if(new_pos === 'E') {
      grid[old_user[0]][old_user[1]] = null;
      this._win = true;
    } else if(new_pos === null) {
      grid[old_user[0]][old_user[1]] = null;
      grid[new_user[0]][new_user[1]] = letter;
    }
    return grid;
  }


  // play_cpu params -->
  // (cpu coords, exit coords, array of 2 portal coords, grid - 8 * 8 - 2d array)
  // returns the next coords of cpu.
  play_cpu(cpu, exit, portal, grid) {
    var options = [];
    for(var i = 0; i < 4; i++) {
      var new_cpu = [cpu[0] + dx[i], cpu[1] + dy[i]];
      if(this.invalid_pos(grid, new_cpu)) continue;
      var trans_new_cpu = new_cpu;
      if(grid[new_cpu[0]][new_cpu[1]] === 'P') {
        if(this.same_pos(portal[0], new_cpu)) trans_new_cpu = portal[1];
        else                                  trans_new_cpu = portal[0];
      }
      options.push([this.manhattan_dist(trans_new_cpu, exit), new_cpu]);
    }
    if(options.length === 0)  return cpu;
    options.sort();
    var limit = 1;
    for(var i = 0; i < options.length; i++) {
      if(options[i][0] === options[0][0]) limit = i + 1;
    }
    return options[Math.floor(Math.random() * limit)][1];
  }

  // play_user params --> (turn_type = SHOOT/LEFT/RIGHT/UP/DOWN, board is a 1d 64 element array)
  play_user(turn_type, board) {
    var grid = new Array(this._rows);
    var user = [-1, -1];
    var cpu = [-1, -1];
    var exit = [-1, -1];
    var portal = [];
    for(var i = 0; i < this._rows; i++) {
      grid[i] = new Array(this._cols);
      for(var j = 0; j < this._cols; j++) {
        grid[i][j] = board[i * this._cols + j];
        var tmp = grid[i][j];
        if(tmp === 'U')      user = [i, j];
        else if(tmp === 'C') cpu = [i, j];
        else if(tmp == 'E')  exit = [i, j];
        else if(tmp === 'P')  portal.push([i, j]);
      }
    }
    if(turn_type === "SHOOT") {
      this._turns++;
    } else {
      var delta = [0, 0];
      if(turn_type === "LEFT")        delta[1] = -1;
      else if(turn_type === "RIGHT")  delta[1] = 1;
      else if(turn_type === "UP")     delta[0] = -1;
      else if(turn_type === "DOWN")   delta[0] = 1;
      var new_user = [user[0] + delta[0], user[1] + delta[1]];
      if(this.invalid_pos(grid, new_user))  return this.prettify(grid);
      grid = this.move(user, new_user, portal, grid, 'U');
    }
    var cpu_game_state = new game_state(grid, 'C', 0);
    game_tree.dfs(cpu_game_state);
    grid = cpu_game_state.best_child.grid;
    var hasExit = 0;
    for(var i = 0; i < 8; i++)
      for(var j = 0; j < 8; j++)
        if(grid[i][j] === 'E') hasExit = 1;
    if(hasExit === 0) this._win = true;
    // var new_cpu = this.play_cpu(cpu, exit, portal, grid);
    // grid = this.move(cpu, new_cpu, portal, grid, 'C');
    return this.prettify(grid);
  }
}
