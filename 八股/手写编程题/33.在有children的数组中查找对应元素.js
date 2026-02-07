var arr = [
  {
    id: 1,
    label: "一级 1",
    children: [
      { id: 2, label: "二级 1-1", children: [{ id: 3, label: "三级 1-1-1" }] },
    ],
  },
  {
    id: 4,
    label: "一级 2",
    children: [
      { id: 5, label: "二级 2-1", children: [{ id: 6, label: "三级 2-1-1" }] },
      { id: 7, label: "二级 2-2", children: [{ id: 8, label: "三级 2-2-1" }] },
    ],
  },
  {
    id: 9,
    label: "一级 3",
    children: [
      {
        id: 10,
        label: "二级 3-1",
        children: [{ id: 11, label: "三级 3-1-1" }],
      },
      {
        id: 12,
        label: "二级 3-2",
        children: [{ id: 13, label: "三级 3-2-1" }],
      },
    ],
  },
];
function findObjById(id, arr) {
  var currentObj = null;
  currentObj = arr.find(function (item) {
    return item.id === id;
  });
  if (currentObj) {
    return currentObj;
  } else {
    for (var i = 0; i < arr.length; i++) {
      // children 属性返回元素的子元素的集合
      // 这里 arr 的 length 为 3
      if (arr[i].children && arr[i].children.length > 0) {
        // 第二层 find 三次
        currentObj = findObjById(id, arr[i].children);
        if (currentObj) {
          return currentObj;
        }
      }
    }
  }
}
var res = findObjById(2, arr);
console.log(res);

// 第二种
var arr = [
  {
    id: 1,
    label: "一级 1",
    children: [
      { id: 2, label: "二级 1-1", children: [{ id: 3, label: "三级 1-1-1" }] },
    ],
  },
  {
    id: 4,
    label: "一级 2",
    children: [
      { id: 5, label: "二级 2-1", children: [{ id: 6, label: "三级 2-1-1" }] },
      { id: 7, label: "二级 2-2", children: [{ id: 8, label: "三级 2-2-1" }] },
    ],
  },
  {
    id: 9,
    label: "一级 3",
    children: [
      {
        id: 10,
        label: "二级 3-1",
        children: [{ id: 11, label: "三级 3-1-1" }],
      },
      {
        id: 12,
        label: "二级 3-2",
        children: [{ id: 13, label: "三级 3-2-1" }],
      },
    ],
  },
];
function findObjById(id, arr) {
  var currentObj = null;
  currentObj = arr.find(function (item) {
    return item.id === id;
  });
  if (currentObj) {
    return currentObj;
  } else {
    for (var i = 0; i < arr.length; i++) {
      // children 属性返回元素的子元素的集合
      // 这里 arr 的 length 为 3
      if (arr[i].children && arr[i].children.length > 0) {
        // 第二层 find 三次
        currentObj = findObjById(id, arr[i].children);
        if (currentObj) {
          return currentObj;
        }
      }
    }
  }
}
var res = findObjById(2, arr);
console.log(res);
