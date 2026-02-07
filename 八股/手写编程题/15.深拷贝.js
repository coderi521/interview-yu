function deepCope(obj) {
  // 先判断 obj 是 array 还是 object
  // Array.isArray(值)  检测这个值是否是数组
  // var newObj = Array.isArray(obj) ? [] : {}
  // 值 instanceof Array  检测这个值是否是由 Array 构造函数创建的
  // Array 可以替换成 RegExp  Function  Object
  var newObj = obj instanceof Array ? [] : {};
  for (var key in obj) {
    var val = obj[key];
    // 这个判断主要是判断 val 是不是原始类型  number  string boolean undefined null
    if (typeof val === "object") {
      newObj[key] = deepCope(val);
    } else {
      newObj[key] = val;
    }
  }
  return newObj;
}

// 优化遍历拷贝
// 判断是否为复杂引用类型
// 优化点
// 使用Reflect.ownKeys方法取出不可枚举属性以及Symbol类型；
// 对于Date、RegExp类型，直接生成一个新的实例返回；
// 使用Object.getOwnPropertyDescriptors()获取所有属性及其特性，并使用Object.create()创建一个新对象，继承传入原对象的原型链；
// 使用WeakMap类型作为Hash表，因为WeakMap是弱引用类型，可以有效防止内存泄漏，检测循环引用，遇到循环引用直接返回WeakMap存储的值。
const isRealObj = (obj) =>
  (typeof obj === "object" || typeof obj === "function") && obj !== null;

const deepClone = (obj, hash = new WeakMap()) => {
  // 处理Date对象
  if (obj.constructor === Date) {
    return new Date(obj);
  }
  // 处理RegExp对象
  if (obj.constructor === RegExp) {
    return new RegExp(obj);
  }
  // 利用WeakMap处理循环引用
  if (hash.has(obj)) {
    return hash.get(obj);
  }
  // 获取对象所有属性的特性列表
  const allKeyValue = Object.getOwnPropertyDescriptors(obj);
  // 继承原型链
  const newObj = Object.create(Object.getPrototypeOf(obj), allKeyValue);
  // 利用WeakMap处理循环引用
  hash.set(obj, newObj);
  // 使用Reflect.ownKeys获取对象的所有属性数组，包括不可枚举属性
  for (let key of Reflect.ownKeys(obj)) {
    // 为复杂引用类型且不为function类型的话进行递归，并将同一个WeakMap传入
    newObj[key] =
      isRealObj(obj[key]) && typeof obj[key] !== "function"
        ? deepClone(obj[key], hash)
        : obj[key];
  }
  return newObj;
};
