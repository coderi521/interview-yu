function nodeTree(val) {
  this.val = val;
  this.left = null;
  this.right = null;
}

// BFS层序遍历
function treeTofloor(root) {
  if (root == null) return;
  let queue = [];
  let result = [];
  queue.push(root);
  while (queue.length) {
    let node = queue.shift();
    result.push(node.val);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }

  return result;
}

// DFS递归遍历；
function dfs(root, depth, arr) {
  if (root == null) return arr;
  if (!arr[depth]) arr[depth] = [];
  arr[depth].push(root.val);

  dfs(root.left, depth + 1, arr);
  dfs(root.right, depth + 1, arr);

  return arr;
}
