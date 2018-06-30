var player = require('./player.js')
var minimax = require('./minimax.js')
module.exports = class agent extends player {
  
  constructor(coord) {
    super(coord, 'C');
    this._minimaxTree = undefined;
  }

  passReward(state) {
		if(state.parent != null) {
			var score = state.score;
			if(score > state.parent.score) {
				//console.log("Passing a score of " + score + " to ");
				//state.parent.state.printGame();
				state.parent.score = score;
				this.passReward(state.parent)
			}
		}
	}

  generateStateTree(starting_game) {
  	var allStates = minimax.getAllStates(starting_game, starting_game._move_limit)
  	var lastLevel = allStates.length - 1;
  	for (var level = lastLevel; level > 0; level--) {
	  	for (var endState of allStates[level]) {
	  		//console.log("Considering below endstate:")
	  		//endState.game_state.printGame();
	  		this.passReward(endState);
	  	}
	  }
  	return allStates;
  }

  play(starting_state, current_state) {
  	if(this._minimaxTree == undefined) {
  		this._minimaxTree = this.generateStateTree(starting_state);
  	} 
		var movesPlayed = current_state._num_moves;
		var nextState = this._minimaxTree[movesPlayed + 1].filter((state) => state.parent.state.equals(current_state))
		.reduce((max, cs) => {
			//console.log(cs.game_state.printGame());
			if(cs.score > max.score) {
				return cs;
			} else {
				return max;
			}
		});
		return nextState.game_state;
  }

  updatePosition(new_coords) {
    return new agent(new_coords.get());
  }
}


