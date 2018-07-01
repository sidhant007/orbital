const WIN_REWARD = 1000, LOSS_REWARD = 0, TIE_REWARD = 500;
var game = require('./game.js')
var player = require('./player.js')
var agent = require('./agent.js')
var coords = require('./coords.js')

module.exports = class game_controller {
	
	constructor(params) {
		//console.log(params.game)
		this._game = params.game != undefined ? params.game.copy() : new game(params.rows, params.cols, params.grid, params.exit_coords,
			params.portal1, params.portal2, params.portalExists);
		this._user = params.user || new player(params.user_coords, 'U');
    this._comp = params.comp || new agent(params.comp_coords, undefined); //Change to agent
    this._num_moves = params.num_moves || 0;
    this._move_limit = params.move_limit;
    this._turn_maker = params.turn_maker || 0;
	}

	equals(other) {
		return other instanceof game_controller && this._game.equals(other._game) && this._user.equals(other._user)
			&& this._comp.equals(other._comp) && this._num_moves == other._num_moves && this._move_limit == other._move_limit &&
			this._turn_maker == other._turn_maker;
	}

	copy() {
	return new game_controller({"rows": this._game.rows, "cols": this._game.cols, "grid": this._game._grid,
	    "user_coords": this._user.getCoords().get(), "comp_coords": this._comp.getCoords().get(), "exit_coords": this._game._exit.get(), 
	    "move_limit": this._move_limit});
	}

	afterMove() {
		var next_turn = this._turn_maker == 0 ? 1 : 0;
		var result = this._game.atPortal(this._user);
		var newgc = new game_controller({"game": result[1], "user": result[0], "comp": this._comp, "num_moves": this._num_moves,
			"move_limit": this._move_limit, "turn_maker": next_turn})
		result = newgc._game.atPortal(this._comp);
		return new game_controller({"game": result[1], "user": newgc._user, "comp": result[0], "num_moves": newgc._num_moves + 1, 
			"move_limit": newgc._move_limit, "turn_maker": newgc._turn_maker});
	}

	// Add functionality to take input from actual user / frontend
	// Move away from string matching ...
	makeTurn(moveType, moveInput, player) {
		if(moveType == "MOVE") {
			var new_coords = player.playMove(moveInput);
			if(this._game.checkCoords(new_coords)) {
  				return new game_controller({"rows": this._game._rows, "cols": this._game._cols,
  					"grid": this._game.updateGrid(player.getCoords(), new_coords, player.getSymbol()),
  					"portal1": this._game._portal1, "portal2": this._game._portal2, "portalExists": this._game._portalExists,
  					"user": this._turn_maker == 0 ? player.updatePosition(new_coords) : this._user,
  					"comp": this._turn_maker == 0 ? this._comp : player.updatePosition(new_coords),
  					"exit_coords": this._game._exit.get(), "num_moves": this._num_moves, "move_limit": this._move_limit, 
  					"turn_maker": this._turn_maker}).afterMove();
  			} else {
  				return -1; //For invalid move to front end
  			}
		} else {
			if(!this._game._portalExists) {
				var portal1_coords = new coords(moveInput[0]);
				var portal2_coords = new coords(moveInput[1]);
				if(this._game.validPortal(portal1_coords) && this._game.validPortal(portal2_coords)) {
					return new game_controller({"game": this._game.addPortals(portal1_coords, portal2_coords), "user": this._user, "comp": this._comp,
						"num_moves": this._num_moves, "move_limit": this._move_limit, "turn_maker": this._turn_maker}).afterMove();
				} else {
					return -2; //For invalid portal positions to front end
				}
			} else {
				return -3; //If not allowed to shoot portals to front end      
			}
		}
	}

	getReward() {
		var comp_coords = this._comp.getCoords();
		if (this.checkWin()) {
		  return WIN_REWARD * (this._move_limit - this._num_moves);
		} else if (this.checkLoss()) {
		  return LOSS_REWARD;
		} else {
		  return TIE_REWARD;
		}
	}

	checkWin() {
		var user_coords = this._user.getCoords();
		var comp_coords = this._comp.getCoords();
		return user_coords.equals(this._game._exit) || comp_coords.equals(this._game._exit);
	}

	checkLoss() {
		return this._num_moves > this._move_limit;    
	}

	getState() {
		return this;
	}

	printGame() {
		this._game.gameState();
	}

}
