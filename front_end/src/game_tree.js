const num_levels_deep = 3

function evaluate(state) {
	// console.log(state)
	var score = state.prob_function()
	if(score == 0 || state.no_turns >= num_levels_deep) {
		return {isLeaf: true, score: score}
	} else {
		return {isLeaf: false}
	}
}

function isPruned(state) {
	return state.score > 0.9 || state.prob_function() > 0.9
}

function get_best_child(state_list) {
	var min_score = 2, best_state = null;
	for (var state of state_list) {
		var state_score = state.score || state.prob_function()
		// if(state_score == min_score) {
		// 	console.log("Tie")
		// }
		if(state_score < min_score) {
			min_score = state_score
			best_state = state
		}
	}
	return best_state
}

function get_score(state_list) {
	var minm = 1;
  return Math.min(...state_list.map(x => x.score));
  /*
	for (var state of state_list) {

	}
	return sum / state_list.length
  */
}

module.exports = {"dfs": function(state) {
	var state_eval = evaluate(state)
	if(state_eval.isLeaf) {
		// console.log("Leaf state")
		state.score = state_eval.score
		return 0
	}
	var moves_possible = state.generate_moves() // array
  moves_possible.sort(function(a, b){return 0.5 - Math.random()});
	if(moves_possible.length == 0) {
		state.score = 1
		return 0
	}
	for (var move of moves_possible) {
		var next_state = state.nextState(move)
    /*
    if(isPruned(next_state)) {
		  continue;
		}
    */
		state.child_list.push(next_state)
		module.exports.dfs(next_state)
	}
  // console.log(state)
	state.best_child = get_best_child(state.child_list)
  var tmp = 0;
  if((state.pmitt === true && state.player_turn === 'C') || (state.passed === true && state.player_turn === 'U')) tmp = 0.001
	state.score = get_score(state.child_list) + tmp
	return 0
}}
