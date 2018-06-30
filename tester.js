var game_controller = require('./game_controller.js')
var agent = require('./agent.js')

var gc = new game_controller({"rows": 4, "cols": 4, "grid": [['O', 'O', 'O', 'U'], ['O', 'X', 'X', 'O'], ['O', 'X', 'X', 'O'], ['C', 'O', 'O', 'E']], 
	"user_coords": [0, 3], "comp_coords": [3, 0], "exit_coords": [3, 3], "move_limit": 6});

var nextState = gc.makeTurn("MOVE", "LEFT", gc._user);
console.log(nextState)
var result = nextState._comp.play(gc, nextState);
console.log(result)
console.log("-------------------------------------Turn 2--------------------------------")
nextState = result.makeTurn("MOVE", "LEFT", result._user)
console.log(nextState)
var result = nextState._comp.play(gc, nextState);
console.log(result)


