// Object.prototype.toString.call(array) === '[object, Array]'里边小写的object是什么意思，call换成apply可以吗？
// 用Array.prototype.toString.call()可以吗？

// 1. apply可以，但是参数要换成([array])
// 2. 用Array.prototype.toString.call()不可以，Array重写了toString方***将数组元素转化为字符串然后输出，不会输出原始类型
Array.myIsArray = function (obj) {
  return Object.prototype.toString.call(obj) === "[object Array]";
};
