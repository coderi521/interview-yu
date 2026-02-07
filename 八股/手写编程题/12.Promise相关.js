// all:全部子实例的成功才算成功，一个子实例失败就算失败
// any:有一个子实例成功就算成功，全部子实例失败才算失败
// race:race是赛跑机制，看最先的promise子实例是成功还是失败
// allSettled：
<a href="https://juejin.cn/post/6844904020029472776#heading-10">allSettled</a>;
// finally:，在当前 promise 实例执行完 then 或者 catch 后，均会触发。

/*********** all ***********/

// 核心功能：1.传入参数为一个空的可迭代对象，则直接进行resolve
// 2.如果参数中有一个 promise 失败，那么 promise.all 返回的 promise 对象失败
// 3.在任何情况下，Promise.all 返回的 promise 的完成状态的结果都是一个数组

Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
    let result = [];
    let index = 0;
    let len = promises.length;
    if (len === 0) {
      resolve(result);
      return;
    }
    for (let i = 0; i < len; i++) {
      Promise.resolve(
        Promise[i]
          .then((data) => {
            result[i] = data;
            index++;
            if (index === len) resolve(result);
          })
          .catch((err) => {
            reject(err);
          })
      );
    }
  });
};
/*********** all ***********/

/*********** any ***********/

Promise.any = function (promiseArr) {
  return new Promise(function (resolve, reject) {
    const length = promiseArr.length;
    const result = [];
    let count = 0;
    if (length === 0) {
      return resolve(result);
    }
    for (let item of promiseArr) {
      Promise.resolve(item).then(
        (value) => {
          return resolve(value);
        },
        (reason) => {
          result[count++] = reason;
          if (count === length) {
            reject(result);
          }
        }
      );
    }
  });
};

/*********** any ***********/

/*********** race ***********/

// race只要有一个 promise 执行完，直接 resolve 并停止执行

Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    let len = promises.length;
    if (len === 0) return;
    for (let i = 0; i < len; i++) {
      Promise.resolve(
        Promise[i]
          .then((data) => {
            resolve(data);
            return;
          })
          .catch((err) => {
            reject(err);
            return;
          })
      );
    }
  });
};

/*********** race ***********/

/*********** finally ***********/
// 它就是一个语法糖，在当前 promise 实例执行完 then 或者 catch 后，均会触发。
// 举个例子，一个 promise 在 then 和 catch 中均要打印时间戳：

// 实现方法
// 考虑到 promise 的 resolver 可能是个异步函数，因此 finally 实现中，要通过调用实例上的 then 方法，添加 callback 逻辑
// 成功透传 value，失败透传 error
Promise.prototype.finally = function (cb) {
  return this.then(
    (value) => Promise.resolve(cb()).then(() => value),
    (error) =>
      Promise.resolve(cb()).then(() => {
        throw error;
      })
  );
};

/*********** finally ***********/

/*********** 使用Promise封装Ajax ***********/

function getJSON(url) {
  // 创建一个 promise 对象
  let promise = new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    // 新建一个 http 请求
    xhr.open("GET", url, true);
    // 设置状态的监听函数
    xhr.onreadystatechange = function () {
      if (this.readyState !== 4) return;
      // 当请求成功或失败时，改变 promise 的状态
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    };
    // 设置错误监听函数
    xhr.onerror = function () {
      reject(new Error(this.statusText));
    };
    // 设置响应的数据类型
    xhr.responseType = "json";
    // 设置请求头信息
    xhr.setRequestHeader("Accept", "application/json");
    // 发送 http 请求
    xhr.send(null);
  });
  return promise;
}
/*********** 使用Promise封装Ajax ***********/

/*********** 手动实现一个Promise ***********/
class MyPromise {
  constructor(fn) {
    if (typeof fn !== "function") {
      throw new TypeError(`MyPromise fn ${fn} is not a function`);
    }
    this.state = "pending";
    this.value = void 0;
    fn(this.resolve.bind(this), this.reject.bind(this));
  }
  resolve(value) {
    if (this.state !== "pending") return;
    this.state = "fulfilled";
    this.value = value;
  }
  reject(reason) {
    if (this.state !== "pending") return;
    this.state = "rejected";
    this.value = reason;
  }
  then(fulfilled, rejected) {
    if (typeof fulfilled !== "function" && typeof rejected !== "function") {
      return this;
    }
    if (
      (typeof fulfilled !== "function" && this.state === "fulfilled") ||
      (typeof rejected !== "function" && this.state === "rejected")
    ) {
      return this;
    }
    return new MyPromise((resolve, reject) => {
      if (
        fulfilled &&
        typeof fulfilled === "function" &&
        this.state === "fulfilled"
      ) {
        let result = fulfilled(this.value);
        if (result && typeof result.then === "function") {
          return result.then(resolve, reject);
        } else {
          resolve(result);
        }
      }
      if (
        rejected &&
        typeof rejected === "function" &&
        this.state === "rejected"
      ) {
        let result = rejected(this.value);
        if (result && typeof result.then === "function") {
          return result.then(resolve, reject);
        } else {
          resolve(result);
        }
      }
    });
  }
  catch(rejected) {
    return this.then(null, rejected);
  }
}
/*********** 手动实现一个Promise ***********/
// 测试
new MyPromise((resolve, reject) => {
  console.log(1);
  //reject(2)
  resolve(2);
  console.log(3);
  setTimeout(() => {
    console.log(4);
  }, 0);
})
  .then((res) => {
    console.log(res);
    return new MyPromise((resolve, reject) => {
      resolve(5);
    }).then((res) => {
      return res;
    });
  })
  .then((res) => {
    console.log(res);
  })
  .catch((e) => {
    console.log("e", e);
  });
