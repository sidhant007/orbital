const WIN_REWARD = 0, LOSS_REWARD = -100, TIME_WASTE_REWARD = -4;
class game {
  
  constructor(rows, cols, grid, user_coords, comp_coords, exit_coords, move_limit) {
    this._rows = rows;
    this._cols = cols;
    this._grid = grid;
    this._user = new player(user_coords[0], usery_coords[1], 'U');
    this._comp = new agent(comp_coords[0], comp_coords[1]);
    this._exitr = exit_coords[0];
    this._exitc = exit_coords[1];
    this.portal1r = this.portal1c = this.portal2r = this.portal2c = -1;
    this._num_moves = 0;
    this._move_limit = move_limit;
  }
  
  nextTurn(user_input, comp_input) {
    nextTurn(this._user, user_input);
    nextTurn(this._comp, comp_input);
  }

  nextTurn(player, input, grid_letter) {
    if(input == "MOVE") { //Scope for more rigorous case ?
      var old_coords = player.getCoords();
      var new_coords = [];
      do {
        new_coords = player.playMove();
      } while(!checkCoords(new_coords)); 
      updateGrid(old_coords, new_coords, player.getSymbol());
      player.updatePosition(new_coords);
     } else { //Shooting Portal
      var portal_coords = [];
      do {
        portal_coords = player.shootPortal();
      } while(!validPortal(portal_coords[0], portal_coords[1], player)); 
      this.portal1r = portal_coords[0][0];
      this.portal1c = portal_coords[0][1];
      this.portal2r = portal_coords[1][0];
      this.portal2c = portal_coords[1][1];
    }
    this._num_moves++;
  }

  teleport() {
    atPortal(this._user);
    atPortal(this._comp);
  }

  atPortal(player) {
    player_coords = player.getCoords();
    if(player_coords[0] == this._portal1r && player_coords[1] == this._portal1c) {
      portal2_coords = [this._portal2r, this._portal2c]; 
      player.updatePosition(portal2_coords);
      updateGrid(player_coords, portal2_coords, player.getSymbol());
    }
    if(player_coords[0] == this._portal2r && player_coords[1] == this._portal2c) {
      portal1_coords = [this._portal1r, this._portal1c]; 
      player.updatePosition(portal1_coords);
      updateGrid(player_coords, portal1_coords, player.getSymbol());
    }
  }

  updateGrid(old_coords, new_coords, grid_update) {
    this._grid[old_coords[0]][old_coords[1]] = 'O'; //O stands for empty cell
    this._grid[new_coords[0]][new_coords[1]] = grid_update; //U stands for user
  }

  checkCoords(coords) {
    var coord_r = coords[0], coord_c = coords[1];
    return coord_r >= 0 && coord_c >= 0 && coord_r < this._rows && coord_c < this._cols &&
      this._grid[coord_r][coord_c] != 'X';
  }

// Might refactor if another use case occurs ...
  validPortal(portal1_coords, portal2_coords, player) {
    return (portal1_coords[0] == this.player._r || portal1_coords[1] == this.player._c) &&
      (portal2_coords[0] == this.player._r || portal2_coords[1] == this.player._c) &&
        this._grid[portal1_coords[0]][portal1_coords[1]] != "X" &&
	  this._grid[portal2_coords[0]][portal2_coords[1]] != "X" &&
	    (portal1_coords[0] == this._user._r && portal1_coords[1] == this._user._c ||
	      portal2_coords[0] == this._user._r && portal2_coords[1] == this._user._c ||
	        portal1_coords[0] == this._comp._r && portal1_coords[1] == this._comp._c ||
	          portal2_coords[0] == this._comp._r && portal2_coords[1] == this._comp._c);  
		  
  }

  getReward() {
    var comp_coords = this._comp.getCoords();
    var ccr = comp_coords[0];
    var ccc = comp_coords[1];
    if (checkWin()) {
      return WIN_REWARD;
    } else if (checkLoss()) {
      return LOSS_REWARD;
    } else {
      return TIME_WASTE_REWARD * this._num_moves; //Can try rewards based on proximity to exit
    }
  }

  checkWin() {
    var user_coords = this._user.getCoords();
    var comp_coords = this._user.getCoords();
    return (user_coords[0] == this._exitr && user_coords[1] == this._exitc) ||
      (comp_coords[0] == this._exitr && comp_coords[1] == this._exitc);
  }

  checkLoss() {
    return this._num_moves > this._move_limit;    
  }

}
