// 传入函数参数执行一次
function ones(func) {
  var tag = true;
  return function () {
    if (tag === true) {
      func.apply(null, arguments);
      tag = false;
    }
    return undefined;
  };
}
