var obj = { temp: "" };
Object.defineProperty(obj, "msg", {
  get: function () {
    return temp;
  },
  set: function (newValue) {
    temp = newValue;
    p.innerHTML = newValue;
    input.value - newValue;
  },
});

var p = document.querySelector("p");
var input = document.querySelector("input");
input.oninput = function (e) {
  obj.msg = e.target.value;
};

//  第二种写法
let obj = {};
let input = document.getElementById("input");
let span = document.getElementById("span");
// 数据劫持
Object.defineProperty(obj, "text", {
  configurable: true,
  enumerable: true,
  get() {
    console.log("获取数据了");
  },
  set(newVal) {
    console.log("数据更新了");
    input.value = newVal;
    span.innerHTML = newVal;
  },
});
// 输入监听
input.addEventListener("keyup", function (e) {
  obj.text = e.target.value;
});
