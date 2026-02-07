// 1. 首先创建了一个新的空对象
// 2. 设置原型，将构造函数的作用域赋给新对象（也就是将对象的**proto**属性指向构造函数的 prototype 属性）
// 3. 指向构造函数中的代码，构造函数的 this 指向该对象（也就是为这个对象添加属性和方法）
// 4. 返回 this 指向的新对象，也就是实例（如果没有手动返回其他的对象）

// 构造器函数
let Parent = function (name, age) {
  this.name = name;
  this.age = age;
};
Parent.prototype.sayName = function () {
  console.log(this.name);
};
//自己定义的new方法
let newMethod = function (Parent, ...rest) {
  // 1.以构造器的prototype属性为原型，创建新对象；
  let child = Object.create(Parent.prototype);
  // 2.将this和调用参数传给构造器执行
  let result = Parent.apply(child, rest);
  // 3.如果构造器没有手动返回对象，则返回第一步的对象
  return typeof result === "object" ? result : child;
};
//创建实例，将构造函数Parent与形参作为参数传入
const child = newMethod(Parent, "echo", 26);
child.sayName(); //'echo';

//最后检验，与使用new的效果相同
child instanceof Parent; //true
child.hasOwnProperty("name"); //true
child.hasOwnProperty("age"); //true
child.hasOwnProperty("sayName"); //false
