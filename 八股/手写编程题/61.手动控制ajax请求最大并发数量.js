// 我最先想到的是将请求分片，每片都在十个以内，然后依次Promise.all()。但很快发现，每组Promise.all之间存在等待时间，这并不是最快的方式。
// 最快的方式应该是一口气发十个请求，只要有一个请求响应成功，就立即发出下一个请求，循环往复，很明显这是一个递归的过程，我们应该在回调函数中做做文章。
const axios = require("axios");
const arr = new Array(100).fill("https://www.baidu.com");

/**
 * @param {Array<String>} arr 请求地址
 * @param {Number} n 控制并发数量
 */
function ajax(arr, n) {
  const { length } = arr;
  const result = [];
  let flag = 0; // 控制进度，表示当前位置
  let sum = 0; // 记录请求完成总数

  return new Promise((resolve, reject) => {
    // 先连续调用n次，就代表最大并发数量
    while (flag < n) {
      next();
    }
    function next() {
      const cur = flag++; // 利用闭包保存当前位置，以便结果能顺序存储
      if (cur >= length) return;

      const url = arr[cur];
      axios
        .get(url)
        .then((res) => {
          result[cur] = cur; // 保存结果。为了体现顺序，这里保存索引值
          if (++sum >= length) {
            resolve(result);
          } else {
            next();
          }
        })
        .catch(reject);
    }
  });
}

ajax(arr, 10).then((res) => {
  console.log(res);
});
