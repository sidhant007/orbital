var game_state = require("./game_state.js")
var game_tree = require("./game_tree.js")
var grid = [['U', 'C', null], [null, 'X', 'X'], [null, null, 'E']]
var grid2 = [['U', null, 'C'], [null, 'X', 'X'], [null, null, 'E']]
var gs = new game_state(grid, 'C', 0)
// var gs2 = new game_state(grid, 'U', 1)
// console.log(gs2.prob_function())
game_tree.dfs(gs)
console.log(gs.best_child.best_child.best_child)
