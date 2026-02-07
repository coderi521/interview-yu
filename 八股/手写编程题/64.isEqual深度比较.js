//判断是否是对象
function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}

//js对象深度比较 全相等
function isEqual(obj1, obj2) {
  //如果传入的不是对象，那就直接比较并且返回
  if (!isObject(obj1) || !isObject(obj2)) {
    // 值类型，（注意，参与equal的一般不会是函数）
    return obj1 === obj2;
  }
  //如果传入的两个对象为同一个，那直接返回true
  if (obj1 === obj2) {
    return true;
  }

  // 两个都是对象或数组，且不相等
  // 1.如果两个对象的key的长度不一致，返回false
  obj1Keys = Object.keys(obj1);
  obj2Keys = Object.keys(obj2);
  if (obj1Keys.length !== obj2Keys.length) {
    return false;
  }

  // 2.以obj1 为基准 和 obj2 依次递归比较
  for (let key in obj1) {
    // 比较当前 key 的 val -- 递归
    const res = isEqual(obj1[key], obj2[key]);
    if (!res) {
      return false;
    }
  }
  // 3.全相等
  return true;
}
let obj1 = {
  a: 1,
  b: 2,
  c: {
    d: "d",
    e: "e",
  },
};
let obj2 = {
  a: 1,
  b: 2,
  c: {
    d: "d",
    e: "e",
  },
};
console.log(isEqual(obj1, obj2));
