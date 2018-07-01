module.exports = class game_controller {
	
	constructor(rows, cols) {
    this._rows = rows;
    this._cols = cols;
    this._turns = 0;
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

  move(old_user, new_user, portal, grid, letter) {
    this._turns++;
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
      alert("Finished the game in " + this._turns + " moves");
    } else if(new_pos === null) {
      grid[old_user[0]][old_user[1]] = null;
      grid[new_user[0]][new_user[1]] = letter;
    }
    return grid;
  }

  play_user(turn, board) {
    var grid = new Array(this._rows);
    var user = [-1, -1];
    var cpu = [-1, -1];
    var portal = [];
    for(var i = 0; i < this._rows; i++) {
      grid[i] = new Array(this._cols);
      for(var j = 0; j < this._cols; j++) {
        grid[i][j] = board[i * this._cols + j];
        var tmp = grid[i][j];
        if(tmp === 'U')      user = [i, j];
        else if(tmp === 'C') cpu = [i, j];
        else if(tmp === '?' || tmp === 'P') portal.push([i, j]);
      }
    }
    if(turn === "SHOOT") {
      var p1 = portal[0];
      var p2 = portal[1];
      console.log(portal);
      if(this.valid_portal(user, p1) && this.valid_portal(user, p2)) {
        grid[p1[0]][p1[1]] = 'P';
        grid[p2[0]][p2[1]] = 'P';
      }
    } else {
      var delta = [0, 0];
      if(turn === "LEFT")        delta[1] = -1;
      else if(turn === "RIGHT")  delta[1] = 1;
      else if(turn === "UP")     delta[0] = -1;
      else if(turn === "DOWN")   delta[0] = 1;
      var new_user = [user[0] + delta[0], user[1] + delta[1]]
      if(new_user[0] < 0 || new_user[0] >= this._cols
        || new_user[1] < 0 || new_user[1] >= this._rows) {
        return this.prettify(grid);
      }
      grid = this.move(user, new_user, portal, grid, 'U');
    }
    return this.prettify(grid);
  }
}
