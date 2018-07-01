var coords = require('./coords.js')
const newGrid = (oldGrid) => oldGrid.map((arr) => arr.slice());
function equalArray(array1, array2) {
  if (!Array.isArray(array1) && !Array.isArray(array2)) {
    return array1 === array2;
  }

  if (array1.length !== array2.length) {
    return false;
  }

  for (var i = 0, len = array1.length; i < len; i++) {
    if (!equalArray(array1[i], array2[i])) {
      return false;
    }
  }

  return true;
}
module.exports = class game {
  
  constructor(rows, cols, grid, exit_coords, portal1, portal2, portalExists) {
    this._rows = rows;
    this._cols = cols;
    this._grid = grid;
    this._exit = new coords(exit_coords);
    this._portal1 = portal1 || new coords([-1, -1]);
    this._portal2 = portal2 || new coords([-1, -1]);
    this._portalExists = portalExists || false;
  }

  equals(other) {
    return other instanceof game && this._rows == other._rows && this._cols == other._cols && equalArray(this._grid, other._grid) && 
      this._exit.equals(other._exit) && ((this._portal1.equals(other._portal1) && this._portal2.equals(other._portal2)) ||
      (this._portal1.equals(other._portal2) && this._portal2.equals(other._portal1))) && this._portalExists == other._portalExists;
  }

  copy() {
    return new game(this._rows, this._cols, this._grid, this._exit.get(), 
      this._portal1, this._portal2, this._portalExists);
  }

  addPortals(portal1_coords, portal2_coords) {
    var new_grid = newGrid(this._grid);
    new_grid[portal1_coords.getR()][portal1_coords.getC()] = 'P'
    new_grid[portal2_coords.getR()][portal2_coords.getC()] = 'P'
    return new game(this._rows, this._cols, new_grid, this._exit.get(), portal1_coords, portal2_coords, true);
  }

  removePortal(portal_coords) {
    var new_grid = newGrid(this._grid);
    new_grid[portal_coords.getR()][portal_coords.getC()] = 'O'
    return new game(this._rows, this._cols, new_grid, this._exit.get(), false, false, false)
  }

  updateGrid(old_coords, new_coords, grid_update) {
    var new_grid = newGrid(this._grid);
    new_grid[old_coords.getR()][old_coords.getC()] = 'O'; //O stands for empty cell
    new_grid[new_coords.getR()][new_coords.getC()] = grid_update; //U stands for user
    return new_grid;
  }

  atPortal(player) {
    var player_coords = player.getCoords();
    if(player_coords.equals(this._portal1)) {
      var new_player = player.updatePosition(this._portal2);
      var new_game = new game(this._rows, this._cols, this.updateGrid(player_coords, this._portal2, player.getSymbol()),
        this._exit.get(), this._portal1, this._portal2, this._portalExists).removePortal(this._portal1);
        return [new_player, new_game]
    }
    if(player_coords.equals(this._portal2)) {
      var new_player = player.updatePosition(this._portal1);
      var new_game = new game(this._rows, this._cols, this.updateGrid(player_coords, this._portal1, player.getSymbol()),
        this._exit.get(), this._portal1, this._portal2, this._portalExists).removePortal(this._portal2);
        return [new_player, new_game]
    }
    return [player, this]
  }

  checkCoords(coords) {
    var coord_r = coords.getR(), coord_c = coords.getC();
    return coord_r >= 0 && coord_c >= 0 && coord_r < this._rows && coord_c < this._cols &&
      this._grid[coord_r][coord_c] != 'X';
  }

// Might refactor if another use case occurs ...
  validPortal(portal_coords, player) {
    return this._grid[portal_coords.getR()][portal_coords.getC()] != "X";
  }

  gameState() {
    for (var row of this._grid) {
      var line = ""
      for (var pos of row) {
        line += pos + " "
      }
      console.log(line)
    }
  }
}
