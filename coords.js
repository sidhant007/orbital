class coords {

  constructor(coord_array) {
    this._r = coord_array[0];
    this._c = coord_array[1];
  }

  equals(other) {
    return other instanceof coords && this._r == other._r && this._c == other._c;
  }

  update(new_coord_array) {
    this._r = new_coord_array[0];
    this._c = new_coord_array[1];
  }

  get() {
    return [this._r, this._c];
  }

  getR() {
    return this._r;
  }
  
  getC() {
    return this._c;
  }
}
