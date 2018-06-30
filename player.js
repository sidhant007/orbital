var coords = require('./coords.js')
module.exports = class player {

  constructor(coord, symbol) {
    this._coords  = new coords(coord);
    this._symbol = symbol;
  }

  equals(other) {
    return other instanceof player && this._coords.equals(other._coords) && this._symbol == other._symbol;
  }

  getSymbol() {
    return this._symbol;
  }

  getCoords() {
    return this._coords;
  }

  // Move away from string matching ...
  playMove(input) {
    var possible_deltas = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    var move = 0;
    switch(input) {
      case 'LEFT': move = 1; break
      case 'DOWN': move = 2; break;
      case 'UP': move = 3; break;
      default: move = 0; break;
    }
    return new coords([this._coords.getR() + possible_deltas[move][0], 
      this._coords.getC() + possible_deltas[move][1]]);
  }
  
  // // Also needs to be refactored on user input
  // shootPortal(bound_r, bound_c) {
  //   var portal1_coords = new coords([Math.floor(Math.random() * bound_r), this._c]);
  //   var portal2_coords = new coords([this._r, Math.floor(Math.random() * bound_c)]);
  //   return [portal1_coords, portal2_coords];
  // }

  updatePosition(new_coords) {
    return new player(new_coords.get(), this._symbol);
  }

}