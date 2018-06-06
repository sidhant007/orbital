class player {

  constructor(coord_r, coord_c, symbol) {
    this._coords  = new coords(coord_r, coord_c);
    this._symbol = symbol;
  }

  getSymbol() {
    return this._symbol;
  }

  getCoords() {
    return this._coords;
  }

  // Add functionality to take input from actual user / frontend
  playMove() {
    var possible_deltas = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    var random_move = Math.floor(Math.random() * 4);
    return new coords([this._coords.getR() + possible_deltas[random_move][0], 
      this._coords.getC() + possible_deltas[random_move][1]]);
  }
  
  // Also needs to be refactored on user input
  shootPortal(bound_r, bound_c) {
    var portal1_coords = new coords([Math.floor(Math.random() * bound_r), this._c]);
    var portal2_coords = new coords([this._r, Math.floor(Math.random() * bound_c)]);
    return [portal1_coords, portal2_coords];
  }

  updatePosition(new_coords) {
    this._coords.update(new_coords);
  }

}
