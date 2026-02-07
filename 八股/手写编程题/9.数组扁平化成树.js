const authMenu = [
  { pid: -1, name: "购物车", id: 1, auth: "cart" },
  { pid: 1, name: "购物车列表", id: 4, auth: "cart-list" },
  { pid: 4, name: "彩票", id: 5, auth: "lottery" },
  { pid: 4, name: "商品", id: 6, auth: "product" },
  { pid: -1, name: "商店", id: 2, auth: "shop" },
  { pid: -1, name: "个人中心", id: 3, auth: "store" },
];

// 数组扁平化成数

const getTree = (authMenus) => {
  const menu = [];
  const sourceMap = {};
  authMenus.forEach((m) => {
    m.children = [];
    sourceMap[m.id] = m;
    if (m.pid === -1) {
      // 根目录
      menu.push(m);
    } else {
      sourceMap[m.pid].children.push(m);
    }
  });
  return menu;
};
export { getTree };
