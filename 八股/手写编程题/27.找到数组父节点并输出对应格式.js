// 输入：
// [
//   { id: 1, parentId: null },
//   { id: 2, parentId: 1 },
//   { id: 3, parentId: 1 },
//   { id: 4, parentId: 2 },
//   { id: 5, parentId: 2 },
//   { id: 6, parentId: 3 },
// ];

// 输出
// {
// id: 1,
// children: [
//     {
//         id: 2,
//         children: [
//             { id: 4, children: [] },
//             { id: 5, children: [] }
//         ]
//     },
//     {
//         id: 3,
//         children: [
//             { id: 6, children: [] }
//         ]
//     }
// ]
// }

const data = [
  { id: 1, parentId: null },
  { id: 2, parentId: 1 },
  { id: 3, parentId: 1 },
  { id: 4, parentId: 2 },
  { id: 5, parentId: 2 },
  { id: 6, parentId: 3 },
];

function createNode(id, data) {
  // 初始化要构建的 node
  const node = { id };
  // 去 data 中查找这个构建的 node 有哪些子节点, 并递归构建
  const childData = data.filter((item) => item.parentId === id);
  node.children = childData.reduce((acc, cur) => {
    acc.push(createNode(cur.id, data));
    return acc;
  }, []);
  return node;
}

function test(data) {
  // 先获取到哪个是根节点
  const rootNodeData = data.find((item) => item.parentId === null);
  if (!rootNodeData) {
    throw new Error("给定的数据中找不到根节点");
  }
  // 从根节点开始构建节点, 递归构建成树
  return createNode(rootNodeData.id, data);
}

const result = test(data);
console.log(result);
