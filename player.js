class player {

  constructor(coord_r, coord_c) {
    this._r = coord_r;
    this._c = coord_c;
  }

  getCoords() {
    return [this._r, this._c];
  }

  // Add functionality to take input from actual user / frontend
  playMove() {
    possible_deltas = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    random_move = Math.floor(Math.random() * 4)
    return [this._r + possible_deltas[random_move][0], 
      this._c + possible_deltas[random_move][1]];
  }
  
  updatePosition(new_coords) {
    this._r = new_coords[0];
    this._c = new_coords[1];
  }
}
