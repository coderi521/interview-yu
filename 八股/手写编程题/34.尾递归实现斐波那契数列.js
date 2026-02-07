const Fibonacci = (n, ack1 = 1, ack2 = 1) => {
  if (n <= 1) {
    return ack2;
  }
  return Fibonacci(n - 1, ack2, ack1 + ack2);
};

console.log(Fibonacci(50));

// 递归需要同时保存成百上千个调用帧。很容易出现栈溢出
// 但是对于尾递归来说，由于只存在一个调用栈，所以永远不会发生栈溢出错误

// 尾调用：一个函数的最后一步是调用另外一个函数
// 尾递归：尾调用自身，尾递归
