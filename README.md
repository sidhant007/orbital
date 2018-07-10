# orbital
Orbital 2k18 Project

How to start - 
- Write "npm start" inside front_end to start on local host.
- Write "git subtree push --prefix front_end heroku master" in CLI on orbital/ to push to heroku, then access at "https://tragically-whistler-94856.herokuapp.com/"

To detect linting, anti-pattern and stuff - 
http://jshint.com/install/

Also on Github, a PR will only be merged if it has the latest commits of master and has atleast 1 code review.

## To do 

### Broad Pseudocode - 
```
state = {
	grid: [8][8],
	player_turn: // 0/1 or 'C'/'U',
	parse_grid() // returns cpu, user, exit, portals,
	no_of_turns: // int
	child_list = [] // array of "children" states.
	best_child = // indice of the child_list array
	score = // float 0 to 1.
}

constructor(x) = {
	grid: old_grid.playMove(x),
	player_turn: old_grid.player_turn.swap,
	no_turns: old_grid.no_turns++,
	child_list = []
	best_child = null
	score = 0
}

eval(state) = {
	my_val = state.prob_function()
	if(my_val == 1 || my_val == 0 || state.no_turns > 3) {
		return {isLeaf: true, score: my_val}
	} else {
		return {isLeaf: false}
	}
}

dfs(state) {
	tmp = eval(state)
	if(tmp.isLeaf) {
		state.score = tmp.score
		return 0
	}
	moves_possible = state.generate_moves() // array
	for(x: moves_possible) {
		y = new state(state, x)
		if(isPruned(y))	continue;
		state.child_list.push(y)
		dfs(y)
	}
	state.best_child = get_best_child(state.child_list)
	state.score = get_score(state.child_list)
	return 0
}
```
