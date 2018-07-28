var game_state = require("./game_state.js")
var game_tree = require("./game_tree.js")
var grid = []
for (var i = 0; i < 8; i++) {
	grid.push([null, "X", null, "X", null, null, "X", null])
}
grid[0][0] = 'C'
grid[7][7] = 'U'
grid[4][4] = 'E'
var gs = new game_state(grid, 'C', 0)
// var gs2 = new game_state(grid, 'U', 1)
// console.log(gs2.prob_function())
game_tree.dfs(gs)
console.log(gs)
console.log(gs.generate_moves())
console.log(gs.best_child.grid)
console.log(gs.best_child.best_child.grid)
var two_moves_down = gs.best_child.best_child
two_moves_down.reinitialize()
game_tree.dfs(two_moves_down)
console.log(two_moves_down.best_child.grid)
console.log(two_moves_down.best_child.best_child.grid)
var four_moves_down = two_moves_down.best_child.best_child
four_moves_down.reinitialize()
game_tree.dfs(four_moves_down)
console.log(four_moves_down.best_child.grid)
console.log(four_moves_down.best_child.best_child.grid)
var six_moves_down = four_moves_down.best_child.best_child
six_moves_down.reinitialize()
game_tree.dfs(six_moves_down)
console.log(six_moves_down.best_child.grid)
console.log(six_moves_down.best_child.best_child.grid)
console.log(six_moves_down.best_child.best_child.best_child.grid)