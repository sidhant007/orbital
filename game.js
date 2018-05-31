class game {

  constructor(rows, cols, grid, user_coords, comp_coords, exit_coords) {
    this._rows = rows;
    this._cols = cols;
    this._grid = grid;
    this._user = new player(user_coords[0], usery_coords[1]);
    this._comp = new agent(comp_coords[0], comp_coords[1]);
    this._exitr = exit_coords[0];
    this._exitc = exit_coords[1];
    this.portal1r = this.portal1c = this.portal2r = this.portal2c = -1;
    this,_num_moves = 0;
  }

  nextTurn() {
    var old_user_coords = this._user.getCoords();
    var new_user_coords = this._user.playMove();
    while(!checkCoords(new_user_coords)) {
      new_user_coords = this._user.playMove();
    }
    updateUser(old_user_coords, new_user_coords);
    var old_comp_coords = this._comp.getCoords();
    var new_comp_coords = this._comp.playMove();
    while(!checkCoords(new_comp_coords)) {
      new_comp_coords = this._comp.playMove();
    }
    updateComp(old_comp_coords, new_comp_coords);
    this._num_moves++;
  }

  //TO DO: Refactor below 2 methods into 1 maybe...
  updateUser(old_coords, new_coords) {
    this._grid[old_coords[0]][old_coords[1]] = 'O'; //O stands for empty cell
    this._grid[new_coords[0]][new_coords[1]] = 'U'; //U stands for user
    this._user.updatePosition(new_coords);
  }

  updateComp(old_coords, new_coords) {
    this._grid[old_coords[0]][old_coords[1]] = 'O'; //O stands for empty cell
    this._grid[new_coords[0]][new_coords[1]] = 'C'; //C stands for computer
    this._comp.updatePosition(new_coords);
  }

  checkCoords(coords) {
    var coord_r = coords[0], coord_c = coords[1];
    return coord_r >= 0 && coord_c >= 0 && coord_r < this._rows && coord_c < this._cols;
  }

  getReward() {
    comp_coords = this._comp.getCoords();
    ccr = comp_coords[0];
    ccc = comp_coords[1];
    if ccr == this_exitr && ccc == this._exitc {
      return WIN_REWARD;
    } else {
      return TIME_WASTE_REWARD * this._num_moves; //Can try rewards based on proximity to exit
    }
  }

}





