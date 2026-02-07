// 题目中已给
const log = (callback) => {
  log.count = log.count || 0;
  var count = log.count++;
  setTimeout(() => {
    console.log(count);
    callback && callback();
  }, (Math.random() * 1000) % 10);
};

// 自己写的。只用循环调用
let cb = () => {
  if (log.count > 100) {
    return;
  } else {
    return log(cb);
  }
};
cb();
// 思路：
// 使用循环调用。
// 当log.count的值小于等于100时，循环调用log；
// 否则终止执行；
