class player {

  constructor(coord_r, coord_c, symbol) {
    this._r = coord_r;
    this._c = coord_c;
    this._symbol = symbol;
  }

  getSymbol() {
    return this._symbol;
  }

  getCoords() {
    return [this._r, this._c];
  }

  // Add functionality to take input from actual user / frontend
  playMove() {
    var possible_deltas = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    var random_move = Math.floor(Math.random() * 4);
    return [this._r + possible_deltas[random_move][0], 
      this._c + possible_deltas[random_move][1]];
  }
  
  // Also needs to be refactored on user input
  shootPortal(bound_r, bound_c) {
    var portal1_coords = [Math.floor(Math.random() * bound_r), this._c];
    var portal2_coords = [this._r, Math.floor(Math.random() * bound_c)];
    return [portal1_coords, portal2_coords];
  }

  updatePosition(new_coords) {
    this._r = new_coords[0];
    this._c = new_coords[1];
  }

}
