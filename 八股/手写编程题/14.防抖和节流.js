// 函数节流 第一次操作的东西 在第二次执行的时候要有一定的时间间隔

// 保证如果电梯第一个人进来后，10 秒后准时运送一次，这个时间从第一个人上电梯开始计时，不等待，如果没有人，则不运行。
// 高频事件触发，但在 n 秒内只会执行一次，所以节流会稀释函数的执行频率
// 场景：滚动加载更多，表单的重复提交
// 思路：每次触发事件时都判断当前是否有等待执行的延时函数

function throttle(fn) {
  let canRun = true; // 通过闭包保存一个标记
  return function () {
    if (!canRun) return; // 在函数开头判断标记是否为true，不为true则return
    canRun = false; // 立即设置为false
    setTimeout(() => {
      // 将外部传入的函数的执行放在setTimeout中
      fn.apply(this, arguments);
      // 最后在setTimeout执行完毕后再把标记设置为true(关键)表示可以执行下一次循环了。
      // 当定时器没有执行的时候标记永远是false，在开头被return掉
      canRun = true;
    }, 500);
  };
}
function sayHi(e) {
  console.log(e.target.innerWidth, e.target.innerHeight);
}
window.addEventListener("resize", throttle(sayHi));

// 防抖：函数防抖 一个需要频繁触发的函数，在规定时间内，只让最后一次生效，前面的不生效
// 比如搜索，键盘输入的时候不搜索，输入完之后才搜索

// 假设现在坐公交车，很多人不断在刷卡，那么此时司机是不能开车的
// 等到乘客都刷卡完毕了，司机需要等待一会儿（延迟时间）确认乘客都做好之后准备开车
// 此时正好又有一个乘客上车，那么司机又要重新等待刷卡上人再次坐稳之后再开车。

// 触发高频事件后 n 秒内函数只会执行一次，如果 n 秒内高频事件再次被触发，则重新计算时间

// 思路： 每次触发事件时都取消之前的延时调用方法
function debounce(fn) {
  let timeout = null; // 创建一个标记用来存放定时器的返回值
  return function () {
    clearTimeout(timeout); // 每当用户输入的时候把前一个 setTimeout clear 掉
    timeout = setTimeout(() => {
      // 然后又创建一个新的 setTimeout
      // 这样就能保证输入字符后的 interval 间隔内如果还有字符输入的话，就不会执行 fn 函数
      fn.apply(this, arguments);
    }, 500);
  };
}
function sayHi() {
  console.log("防抖成功");
}

var inp = document.getElementById("inp");
inp.addEventListener("input", debounce(sayHi)); // 防抖
