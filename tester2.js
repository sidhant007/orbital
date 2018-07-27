var game_state = require("./game_state.js")
var game_tree = require("./game_tree.js")
var grid = []
for (var i = 0; i < 8; i++) {
	grid.push([null, null, null, null, null, null, null, null])
}
grid[0][0] = 'C'
grid[7][7] = 'U'
grid[4][4] = 'E'
var gs = new game_state(grid, 'C', 0)
// var gs2 = new game_state(grid, 'U', 1)
// console.log(gs2.prob_function())
game_tree.dfs(gs)
console.log(gs.best_child)
console.log(gs.best_child.best_child)
var two_moves_down = gs.best_child.best_child
two_moves_down.reinitialize()
game_tree.dfs(two_moves_down)
console.log(two_moves_down.best_child)
console.log(two_moves_down.best_child.best_child)
var four_moves_down = two_moves_down.best_child.best_child
four_moves_down.reinitialize()
game_tree.dfs(four_moves_down)
console.log(four_moves_down.best_child)
console.log(four_moves_down.best_child.best_child)