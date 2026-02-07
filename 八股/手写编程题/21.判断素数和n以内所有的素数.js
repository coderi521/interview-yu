// 约数只有1和本身的整数称为质数（素数）

function isNum(num) {
  var tmp = Math.sqrt(num);
  for (let i = 2; i <= tmp; i++) {
    if (num % I === 0) {
      return 0;
    }
  }
  return 1;
}

// 获取n以内所有的素数
// 从 2 开始，我们知道 2 是一个素数，那么 2 × 2 = 4, 3 × 2 = 6, 4 × 2 = 8… 都不可能是素数了
// 我们发现 3 也是素数，那么 3 × 2 = 6, 3 × 3 = 9, 3 × 4 = 12… 也都不可能是素数了

var countPrimes = function (n) {
  // 将数组都初始化为 true
  let isPrime = new Array(n).fill(true);
  for (let i = 2; i < n; i++) {
    if (isPrime[i]) {
      // i 的倍数不可能是素数了
      for (let j = 2 * i; j < n; j += i) {
        isPrime[j] = false;
      }
    }
  }
  let count = 0;
  for (let i = 2; i < n; i++) {
    if (isPrime[i]) count++;
  }
  return count;
};
