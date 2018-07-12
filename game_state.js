var coords = require('./coords.js')

const dx = [1, -1, 0, 0]
const dy = [0, 0, 1, -1]
const total_number_of_moves = 30 // Hardcoded ?

const range = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start);
const copyGrid = (oldGrid) => oldGrid.map((arr) => arr.slice());

function updateGrid(grid, old_coords, new_coords, grid_update) {
  var new_grid = copyGrid(grid)
  new_grid[old_coords.getR()][old_coords.getC()] = null; 
  new_grid[new_coords.getR()][new_coords.getC()] = grid_update; 
  return new_grid;
}

function addPortalToGrid(grid, portal1_coords, portal2_coords) {
  var new_grid = copyGrid(grid)
  new_grid[portal1_coords.getR()][portal1_coords.getC()] = "P"
  new_grid[portal2_coords.getR()][portal2_coords.getC()] = "P"
  return new_grid;
}

function removePortalFromGrid(grid, portal1_coords, portal2_coords) {
  var new_grid = copyGrid(grid)
  new_grid[portal1_coords.getR()][portal1_coords.getC()] = null
  new_grid[portal2_coords.getR()][portal2_coords.getC()] = null
  return new_grid;
}

module.exports = class game_state {
  
  // As only one constructor is allowed, I have replaced this constructor with nextState function
  // //Pre-condition: move is valid
  // constructor(old_state, move) {
  //   this.grid = old_state.playMove(move); //Returns a grid i.e
  //   this.player_turn = old_state.player_turn == "C" ? "U" : "C";
  //   this.no_turns = old_state.no_turns++;
  //   this.child_list = []
  //   this.best_child = null
  //   this.score = 0
  // }

  // If required -> Required for starting state
  constructor(grid, player_turn, no_turns) {
    this.grid = grid;
    this.player_turn = player_turn;
    this.no_turns = no_turns;
    this.child_list = []
    this.best_child = null
    this.score = 0
  }

  nextState(move) {
    return new game_state(this.playMove(move), this.player_turn == "C" ? "U" : "C", this.no_turns + 1)
  }

  parse_grid() {
    var comp_coords = null, user_coords = null, exit_coords = null, portal1_coords = null, portal2_coords = null;
    for (var row of range(0, this.grid.length)) {
      for (var col of range(0, this.grid[row].length)) {
        var current_coords = new coords([row, col])
        switch(this.grid[row][col]) {
          case 'C': comp_coords = current_coords; break;
          case 'U': user_coords = current_coords; break;
          case 'E': exit_coords = current_coords; break;
          case 'P':
            if(portal1_coords == null) {
              portal1_coords = current_coords;
            } else {
              portal2_coords = current_coords;
            }
            break;
        } 
      }
    }
    return {"comp_coords": comp_coords, "user_coords": user_coords, "exit_coords": exit_coords,
      "portal1_coords": portal1_coords, "portal2_coords": portal2_coords}
  }

  prob_function() {
    var grid_properties = this.parse_grid()
    var exit_coords = grid_properties.exit_coords
    var portal1_coords = grid_properties.portal1_coords
    var portal2_coords = grid_properties.portal2_coords
    var bfs_q = [exit_coords];
    var num_iterations = 0
    while(bfs_q.length > 0) {
      var current_coords = bfs_q.shift()
      var cur_row = current_coords.getR()
      var cur_col = current_coords.getC()
      if(cur_row >= 0 && cur_row < this.grid.length &&
        cur_col >= 0 && cur_col < this.grid[0].length) {
        if(this.grid[cur_row][cur_col] == 'C' || this.grid[cur_row][cur_col] == 'U') {
          break;
        } else if(this.grid[cur_row][cur_col] == 'P') {
          if(portal1_coords.equals(current_coords)) {
            bfs_q.push(portal2_coords)
          } else {
            bfs_q.push(portal1_coords)
          }
        } else {
          for (var i of range(0, 4)) {
            bfs_q.push(new coords([cur_row + dy[i], cur_col + dx[i]]))
          }
        }
        num_iterations++
      } else {
        continue;
      }
    }
    return Math.min((num_iterations / total_number_of_moves - this.no_turns), 1)
  }


  // Need to decide on representation of a move ...


  // Pre-condition: move is valid -> but does this precondition not make sense because knowing if a move is valid
  // is almost close to simulating move itself ??
  playMove(move) {
    var grid_properties = this.parse_grid()
    var exit_coords = grid_properties.exit_coords
    var portal1_coords = grid_properties.portal1_coords
    var portal2_coords = grid_properties.portal2_coords
    var user_coords = grid_properties.user_coords
    var comp_coords = grid_properties.comp_coords

    var moveType = move[0] // OR move.type -> "MOVE" or "SHOOT"
    var moveInput = move[1] // move.input -> ("LEFT" or "UP" or "DOWN" or "RIGHT" OR [nr, nc]) or [[p1r, p1c], [p2r, p2c]]
    var current_grid = this.grid
    var cur_player_coords = this.player_turn == "C" ? comp_coords : user_coords;
    if(moveType == "MOVE") { //String matching ?
      var new_coords = null
      switch(moveInput) {
        case "LEFT": 
          new_coords = cur_player_coords.left();
          break;
        case "UP": 
          new_coords = cur_player_coords.up();
          break;
        case "RIGHT": 
          new_coords = cur_player_coords.right();
          break;
        case "DOWN": 
          new_coords = cur_player_coords.down();
          break;
      }
      if(new_coords.equals(portal1_coords)) {
        return updateGrid(removePortalFromGrid(current_grid, portal1_coords, portal2_coords), 
          cur_player_coords, portal2_coords, this.player_turn)
      } else if(new_coords.equals(portal2_coords)) {
        return updateGrid(removePortalFromGrid(current_grid, portal1_coords, portal2_coords), 
          cur_player_coords, portal1_coords, this.player_turn)
      } else {
        return updateGrid(current_grid, cur_player_coords, new_coords, this.player_turn)
      }
    } else {
      if (portal1_coords == null && portal2_coords == null) { // Hoping this check is done before anyways and always passes
        return addPortalToGrid(current_grid, new coords(moveInput[0]), new coords(moveInput[1]))
      } else {
        throw "Invalid Portal Co-ordinates"
      }
    }
  }

  generate_moves() {
    var grid_properties = this.parse_grid()
    var exit_coords = grid_properties.exit_coords
    var portal1_coords = grid_properties.portal1_coords
    var portal2_coords = grid_properties.portal2_coords
    var user_coords = grid_properties.user_coords
    var comp_coords = grid_properties.comp_coords

    var cur_player_coords = this.player_turn == "C" ? comp_coords : user_coords;
    var moves_array = []
    //Checking and adding
    moves_array.push(cur_player_coords.getC() == 0 ? [] : ["MOVE", "LEFT"])
    moves_array.push(cur_player_coords.getC() == this.grid[0].length ? [] : ["MOVE", "RIGHT"])
    moves_array.push(cur_player_coords.getR() == 0 ? [] : ["MOVE", "UP"])
    moves_array.push(cur_player_coords.getC() == this.grid.length ? [] : ["MOVE", "DOWN"])

    if(portal1_coords == null && portal2_coords == null) { //No portals exist

      var prow = cur_player_coords.getR();
      var pcol = cur_player_coords.getC();
      
      for (var rown of range(0, this.grid.length)) {
        for(var rown2 of range(rown + 1, this.grid.length)) {
          if(rown != prow && rown2 != prow && this.grid[rown][pcol] != 'X' && this.grid[rown2, pcol] != 'X') {
            var portal1 = [rown, pcol];
            var portal2 = [rown2, pcol];
            var mi = [portal1, portal2];
            moves_array.push(["SHOOT", mi]);
          }
        }
      }

      for (var coln of range(0, this.grid[0].length)) {
        for(var coln2 of range(coln + 1, this.grid[0].length)) {
          if(coln != pcol && coln2 != pcol && this.grid[prow][coln] != 'X' && this.grid[prow, coln2] != 'X') {
            var portal1 = [prow, coln];
            var portal2 = [prow, coln2];
            var mi = [portal1, portal2];
            moves_array.push(["SHOOT", mi]);
          }
        }
      }

      for (var rown of range(0, this.grid.length)) {
        for(var coln of range(0, this.grid[0].length)) {
          if(rown != prow && coln != pcol && this.grid[rown][pcol] != 'X' && this.grid[prow, coln] != 'X') {
            var portal1 = [rown, pcol];
            var portal2 = [prow, coln];
            var mi = [portal1, portal2];
            moves_array.push(["SHOOT", mi]);
          }
        }
      }

    }
    return moves_array.filter((move) => move.length > 0)
  }
}