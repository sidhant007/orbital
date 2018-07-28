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

function addPortalToGrid(grid, portal1_coords, portal2_coords, exit_coords) {
  var new_grid = copyGrid(grid)
  new_grid[portal1_coords.getR()][portal1_coords.getC()] = portal1_coords.equals(exit_coords) ? "P / E" : "P"
  new_grid[portal2_coords.getR()][portal2_coords.getC()] = portal2_coords.equals(exit_coords) ? "P / E" : "P"
  return new_grid;
}

function removePortalFromGrid(grid, portal1_coords, portal2_coords) {
  var new_grid = copyGrid(grid)
  new_grid[portal1_coords.getR()][portal1_coords.getC()] = null
  new_grid[portal2_coords.getR()][portal2_coords.getC()] = null
  return new_grid;
}

function swap(player) {
  return player == 'C' ? 'U' : 'C';
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
    this.score = -1
  }

  nextState(move) {
    return new game_state(this.playMove(move), swap(this.player_turn), this.no_turns + 1)
  }

  reinitialize() {
    this.no_turns = 0
    this.child_list = []
    this.best_child = null
    this.score = -1
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
          default: 
            if(this.grid[row][col] != null && this.grid[row][col].indexOf("/") > -1) {
              var first_char = this.grid[row][col].split(" / ")[0]
              exit_coords = current_coords
              switch(first_char) {
                case 'C': comp_coords = current_coords; break;
                case 'U': user_coords = current_coords; break;
                case 'P':
                  if(portal1_coords == null) {
                    portal1_coords = current_coords;
                  } else {
                    portal2_coords = current_coords;
                  }
                  break;
                default: break;
              }
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
    //console.log(this.grid)
    var exit_coords = grid_properties.exit_coords
    var portal1_coords = grid_properties.portal1_coords
    var portal2_coords = grid_properties.portal2_coords
    var user_coords = grid_properties.user_coords
    var comp_coords = grid_properties.comp_coords
    var bfs_q = [[exit_coords, 0]];
    var visited = []
    var portal_considered = false
    var num_moves = 0
    while(bfs_q.length > 0) {
      var current = bfs_q.shift()
      // console.log(current)
      var current_coords = current[0]
      var moves_till_now = current[1]
      visited.push(current_coords)
      var cur_row = current_coords.getR()
      var cur_col = current_coords.getC()
      if(current_coords.equals(user_coords) || current_coords.equals(comp_coords)) {
        // console.log("Done")
        // console.log(bfs_q) 
        num_moves = moves_till_now
        // bfs_q.length = 0
        break;
      } else if(this.grid[cur_row][cur_col] == 'P' && !portal_considered) {
        // console.log("At portal")
        if(portal1_coords.equals(current_coords)) {
          bfs_q.push([portal2_coords, moves_till_now + 1])
        } else {
          bfs_q.push([portal1_coords, moves_till_now + 1])
        }
        portal_considered = true
      } else {
        for (var i of range(0, 4)) {
          var new_coords = new coords([cur_row + dy[i], cur_col + dx[i]])
          // console.log("Considering " + new_coords.print())
          if(cur_row + dy[i] >= 0 && cur_row + dy[i] < this.grid.length &&
            cur_col + dx[i] >= 0 && cur_col + dx[i] < this.grid[0].length && 
            (!visited.filter((coords) => coords.equals(new_coords)).length > 0 &&
            !bfs_q.filter((coords) => coords[0].equals(new_coords)).length > 0) &&
            this.grid[cur_row + dy[i]][cur_col + dx[i]] != 'X')  {
              // console.log("Adding " + new_coords.print())
              bfs_q.push([new_coords, moves_till_now + 1])
          }
        }
      }

    }
    console.log(visited)
    return Math.min((num_moves / (total_number_of_moves - this.no_turns)), 1)
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
        if(portal2_coords.equals(exit_coords)) {
          return updateGrid(removePortalFromGrid(current_grid, portal1_coords, portal2_coords), 
            cur_player_coords, portal2_coords, this.player_turn + " / E")
        } else {
          return updateGrid(removePortalFromGrid(current_grid, portal1_coords, portal2_coords), 
            cur_player_coords, portal2_coords, this.player_turn)
        }
      } else if(new_coords.equals(portal2_coords)) {
        if(portal1_coords.equals(exit_coords)) {
          return updateGrid(removePortalFromGrid(current_grid, portal1_coords, portal2_coords), 
            cur_player_coords, portal1_coords, this.player_turn + " / E")
        } else {
          return updateGrid(removePortalFromGrid(current_grid, portal1_coords, portal2_coords), 
            cur_player_coords, portal1_coords, this.player_turn)
        }
      } else {
        if(new_coords.equals(exit_coords)) {
          return updateGrid(current_grid, cur_player_coords, new_coords, this.player_turn + " / E")
        } else {
          return updateGrid(current_grid, cur_player_coords, new_coords, this.player_turn)
        }
      }
    } else {
      if(moveType == "PASS") {
        return this.grid
      } else {
        if (portal1_coords == null && portal2_coords == null) { // Hoping this check is done before anyways and always passes
          return addPortalToGrid(current_grid, new coords(moveInput[0]), new coords(moveInput[1]), exit_coords)
        } else {
          throw "Invalid Portal Co-ordinates"
        }
      }
    }
  }

  generate_moves() {
    //console.log(this.grid)
    var grid_properties = this.parse_grid()
    var exit_coords = grid_properties.exit_coords
    var portal1_coords = grid_properties.portal1_coords
    var portal2_coords = grid_properties.portal2_coords
    var user_coords = grid_properties.user_coords
    var comp_coords = grid_properties.comp_coords

    var cur_player_coords = this.player_turn == "C" ? comp_coords : user_coords;
    var other_player_coords = this.player_turn == "C" ? user_coords : comp_coords;
    var moves_array = [["PASS", null]]
    //Checking and adding

    if(cur_player_coords.getC() != 0) {
      var left_coords = cur_player_coords.left()
      var to_left = this.grid[left_coords.getR()][left_coords.getC()]
      if(to_left == null || to_left == 'P' || to_left == 'E') {
        moves_array.push(["MOVE", "LEFT"])
      }
    }

    if(cur_player_coords.getC() != this.grid[0].length - 1) {
      var right_coords = cur_player_coords.right()
      var to_right = this.grid[right_coords.getR()][right_coords.getC()]
      if(to_right == null || to_right == 'P' || to_right == 'E') {
        moves_array.push(["MOVE", "RIGHT"])
      }
    }

    if(cur_player_coords.getR() != 0) {
      var up_coords = cur_player_coords.up()
      var to_up = this.grid[up_coords.getR()][up_coords.getC()]
      if(to_up == null || to_up == 'P' || to_up == 'E') {
        moves_array.push(["MOVE", "UP"])
      }
    }

    if(cur_player_coords.getR() != this.grid.length - 1) {
      var down_coords = cur_player_coords.down()
      // console.log(cur_player_coords)
      // console.log(down_coords)
      // console.log(this.grid)
      var to_down = this.grid[down_coords.getR()][down_coords.getC()]
      if(to_down == null || to_down == 'P' || to_down == 'E') {
        moves_array.push(["MOVE", "DOWN"])
      }
    }

    if(portal1_coords == null && portal2_coords == null) { //No portals exist

      var prow = cur_player_coords.getR();
      var pcol = cur_player_coords.getC();

      //Are we allowing portal creation on other player or exit ? Currently not allowed because causes problem with parsing
      // and subsequently other functions, but easily changeable
      for (var rown of range(0, this.grid.length)) {
        for(var rown2 of range(rown + 1, this.grid.length)) {
          if(rown != prow && rown2 != prow 
            && this.grid[rown][pcol] != 'X' && this.grid[rown2][pcol] != 'X' 
            && this.grid[rown][pcol] != swap(this.player_turn) && this.grid[rown2][pcol] != swap(this.player_turn)
            && this.grid[rown][pcol] != 'E' && this.grid[rown2][pcol] != 'E') {
            var portal1 = [rown, pcol];
            var portal2 = [rown2, pcol];
            var mi = [portal1, portal2];
            moves_array.push(["SHOOT", mi]);
          }
        }
      }

      for (var coln of range(0, this.grid[0].length)) {
        for(var coln2 of range(coln + 1, this.grid[0].length)) {
          if(coln != pcol && coln2 != pcol && 
            this.grid[prow][coln] != 'X' && this.grid[prow][coln2] != 'X' && 
            this.grid[prow][coln] != swap(this.player_turn) && this.grid[prow][coln2] != swap(this.player_turn)
            && this.grid[prow][coln] != 'E' && this.grid[prow][coln2] != 'E') {
            // console.log(this.grid[prow][coln])
            // console.log(this.grid[prow][coln2])
            // console.log(swap(this.player_turn))
            var portal1 = [prow, coln];
            var portal2 = [prow, coln2];
            var mi = [portal1, portal2];
            moves_array.push(["SHOOT", mi]);
          }
        }
      }

      for (var rown of range(0, this.grid.length)) {
        for(var coln of range(0, this.grid[0].length)) {
          if(rown != prow && coln != pcol 
            && this.grid[rown][pcol] != 'X' && this.grid[prow][coln] != 'X' 
            && this.grid[rown][pcol] != swap(this.player_turn) && this.grid[prow][coln] != swap(this.player_turn)
            && this.grid[rown][pcol] != 'E' && this.grid[prow][coln] != 'E') {
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
