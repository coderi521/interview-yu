// 最多重试n次请求，期间成功则成功，超过n次未成功则失败。重试时间递增20ms，40ms，60ms
function fn(k) {
  let count = 0;
  let time = 10;

  main();

  async function recursion() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        time *= 2;
        count += 1;
        console.log("count:" + count);
        if (Math.random() < 0.5) {
          resolve(1);
        } else {
          reject(0);
        }
      }, time);
    });
  }

  function main() {
    if (count === k) {
      console.log(0);
      return;
    }
    recursion()
      .then((res) => {
        console.log(res);
        return;
      })
      .catch((err) => {
        main();
      });
  }
}
