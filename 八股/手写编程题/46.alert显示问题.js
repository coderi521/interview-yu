function a() {
  alert(10);
}
alert(a); //结果是function a(){alert(10)}
a(); //弹框弹出10
var a = 3;
alert(a); //弹出框输出3
a = 6;
a(); //a此时是变量，不是函数，输出是Uncaught TypeError: a is not a function
