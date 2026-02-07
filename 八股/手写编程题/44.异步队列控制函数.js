const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const subFlow = createFlow([() => delay(2000).then(() => log("c"))]);
const log = (a) => {
  console.log(a);
};

// 要求顺序输出并执行delay延迟
createFlow([
  () => log("a"),
  () => log("b"),
  subFlow,
  [() => delay(2000).then(() => log("d")), () => log("e")],
]).run(() => {
  console.log("done");
});

// promise链实现
function createFlow(arr) {
  // 参数会有嵌套的情况，铺平参数为一维数组
  const runArr = arr.slice().flat(Infinity);
  // createFlow方法并不会输出，执行run方法的时候才会真正输出
  // 每次都返回then方法，会让整个reduce过程变成 Promise.then(task1).then(task2).then(task3) 的形式
  const run = (cb) => {
    // 拼接run传入的回调函数，执行reduce方法
    return runArr.concat(cb).reduce((prev, cur) => {
      // 当前值如果是个嵌套的createFlow，则执行当前值的run方法
      // 返回一个新的promise，成为下次reduce的prev
      if (cur && cur.isFlow) {
        return prev.then(cur.run);
      }
      // 普通函数则直接执行，返回一个新的promise，成为下次reduce的prev
      return prev.then(cur);
      // Promise.resolve()作为初始值启动reduce
    }, Promise.resolve());
  };

  // 返回flow对象
  return {
    isFlow: true,
    run,
  };
}

// async await实现
function createFlow(arr) {
  const runArr = arr.slice().flat(Infinity);
  const run = async (cb) => {
    for (let i = 0; i < runArr.length; i++) {
      if (runArr[i] && runArr[i].isFlow) {
        await runArr[i].run();
      } else {
        await runArr[i]();
      }
    }
    cb && cb();
  };

  return {
    isFlow: true,
    run,
  };
}
