const WIN_REWARD = 0, LOSS_REWARD = -100, TIME_WASTE_REWARD = -4;
class game {
  
  constructor(rows, cols, grid, user_coords, comp_coords, exit_coords, move_limit) {
    this._rows = rows;
    this._cols = cols;
    this._grid = grid;
    this._user = new player(user_coords[0], usery_coords[1], 'U');
    this._comp = new agent(comp_coords[0], comp_coords[1]);
    this._exit = new coords(exit_coords);
    this.portal1 = this.portal2 = new coords([-1, -1]);
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
      var new_coords = player.playMove();
      while(!checkCoords(new_coords)) {
        new_coords.update(player.playMove());
      }
      updateGrid(old_coords, new_coords, player.getSymbol());
      player.updatePosition(new_coords);
     } else { //Shooting Portal
      var portal_coords = player.shootPortal();
      var portal1_coords = portal_coords[0];
      var portal2_coords = portal_coords[1];
      while(!validPortal(portal1_coords) || !validPortal(portal2_coords)) {
        portal_coords = player.shootPortal();
        portal1_coords = portal_coords[0];
        portal2_coords = portal_coords[1];
      }
      this._portal1 = portal1_coords;
      this._portal2 = portal2_coords;
    }
    this._num_moves++;
  }

  teleport() {
    atPortal(this._user);
    atPortal(this._comp);
  }

  atPortal(player) {
    player_coords = player.getCoords();
    if(player_coords.getR() == this._portal1.getR() && player_coords.getC() == this._portal1.getC()) {
      player.updatePosition(portal2_coords);
      updateGrid(player_coords, portal2_coords, player.getSymbol());
    }
    if(player_coords.getR() == this._portal2.getR() && player_coords.getC() == this._portal2.getC()) {
      player.updatePosition(portal1_coords);
      updateGrid(player_coords, portal1_coords, player.getSymbol());
    }}

  //TO DO: Refactor below 2 methods into 1 maybe...
  updateGrid(old_coords, new_coords, grid_update) {
    this._grid[old_coords.getR()][old_coords.getC()] = 'O'; //O stands for empty cell
    this._grid[new_coords.getR()][new_coords.getC()] = grid_update; //U stands for user
  }

  checkCoords(coords) {
    var coord_r = coords,getR(), coord_c = coords.getC();
    return coord_r >= 0 && coord_c >= 0 && coord_r < this._rows && coord_c < this._cols &&
      this._grid[coord_r][coord_c] != 'X';
  }

  validPortal(portal1_coords, portal2_coords) {
    return (portal1_coords[0] == this._r || portal1_coords[1] == this._c) &&
      (portal2_coords[0] == this._r || portal2_coords[1] == this._c);
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
    return this._num_moves < this._move_limit;    
  }

}
