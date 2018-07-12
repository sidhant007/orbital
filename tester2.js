var game_state = require("./game_state.js")
var grid = [['U', 'C', null], [null, 'X', 'X'], [null, null, 'E']]
var gs = new game_state(grid, 'C', 0)
console.log(gs.nextState(gs.generate_moves()[5]).nextState(["MOVE", "DOWN"]).nextState(["MOVE", "RIGHT"]))