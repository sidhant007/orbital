const num_levels_deep = 4

function eval(state) {
	// console.log(state)
	var score = state.prob_function()
	// console.log(score)
	if(score == 1 || score == 0 || state.no_turns >= num_levels_deep) {
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
	// console.log(state_list)
	var sum = 0
	for (var state of state_list) {
		sum += state.score
	}
	return sum / state_list.length
}

module.exports = {"dfs": function(state) {
	// console.log(state)
	var state_eval = eval(state)
	if(state_eval.isLeaf) {
		// console.log("Leaf state")
		state.score = state_eval.score
		return 0
	}
	var moves_possible = state.generate_moves() // array
	if(moves_possible.length == 0) {
		state.score = 1
		return 0
	}
	for (var move of moves_possible) {
		 // console.log(move)
		var next_state = state.nextState(move)
		 // console.log(next_state)
		if(isPruned(next_state)) {
			// console.log("Pruned")
			continue;
		}
		state.child_list.push(next_state)
		module.exports.dfs(next_state)
	}
	state.best_child = get_best_child(state.child_list)
	state.score = get_score(state.child_list)
	return 0
}}