//var game_controller = require('./game_controller.js')
const range = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start);

// var gc = new game_controller({"rows": 3, "cols": 3, "grid": [['O', 'O', 'U'], ['C', 'X', 'O'], ['E', 'O', 'O']], 
// 	"user_coords": [0, 2], "comp_coords": [1, 0], "exit_coords": [2, 0], "move_limit": 3});

module.exports = {"getAllStates": function(game_controller, depth) {
	var gc = game_controller
	var levelStates = [{"score": 0, "state": gc, "parent": null, "depth": 0}];
	var allStates = [[{"score": 0, "game_state": gc, "parent": null, "depth": 0}]];

	for (var i of range(0, depth)) {  
	  var next_level_states = []
	  for (var gc_state of levelStates) {
	  	if(!(gc_state.state.checkWin() || gc_state.state.checkLoss())) {
		    var player = gc_state.state._turn_maker == 0 ? gc_state.state._user : gc_state.state._comp;

		    var allMoves = [["MOVE", "LEFT"], ["MOVE", "RIGHT"], ["MOVE", "UP"], ["MOVE", "DOWN"]]
		    var prow = player.getCoords().getR();
		    var pcol = player.getCoords().getC();
		    
		    for (var rown of range(0, gc_state.state._game._rows)) {
		      for(var rown2 of range(rown + 1, gc_state.state._game._rows)) {
		        if(rown != prow && rown2 != prow) {
		          var portal1 = [rown, pcol];
		          var portal2 = [rown2, pcol];
		          var mi = [portal1, portal2];
		          allMoves.push(["SHOOT", mi]);
		        }
		      }
		    }

		    for (var coln of range(0, gc_state.state._game._cols)) {
		      for(var coln2 of range(coln + 1, gc_state.state._game._cols)) {
		        if(coln != pcol && coln2 != pcol) {
		          var portal1 = [prow, coln];
		          var portal2 = [prow, coln2];
		          var mi = [portal1, portal2];
		          allMoves.push(["SHOOT", mi]);
		        }
		      }
		    }

		    for (var rown of range(0, gc_state.state._game._rows)) {
		      for(var coln of range(0, gc_state.state._game._cols)) {
		        if(rown != prow && coln != pcol) {
		          var portal1 = [rown, pcol];
		          var portal2 = [prow, coln];
		          var mi = [portal1, portal2];
		          allMoves.push(["SHOOT", mi]);
		        }
		      }
		    }

		    for (var move of allMoves) {
		      var moveType = move[0];
		      var moveInput = move[1];
		      //console.log(gc_state)
		      var nextgc = gc_state.state.makeTurn(moveType, moveInput, player);
		      //console.log(nextgc)
			  	if(!(nextgc === parseInt(nextgc, 10))) {
			    	next_level_states.push({"score": 0, "state": nextgc, "parent": gc_state, "depth": gc_state.depth + 1});
			    }
		    }
		  }
	  }
	  
	  levelStates = next_level_states;
	  allStates.push(next_level_states.map(function(gc_state) { 
	  	//console.log(gc_state)
	    return {"score": gc_state.state.getReward(), "game_state": gc_state.state, "parent": gc_state.parent, "depth": gc_state.depth};
		}));
	}
	return allStates;
}}





