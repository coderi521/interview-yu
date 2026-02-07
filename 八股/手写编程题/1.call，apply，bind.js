// call

// 其实主要的思路是将函数的this指向到传进来的第一个参数（一个对象）
// 实现方法是将函数本身变成传进来的第一个对象的一个属性，因为一个对象的属性或者方法，它的this就是指向当前对象。
// 处理好第一个对象，接着通过arguments对象获取到传进来的其余参数，通过slice(1)，就可以获取第二个以及往后的所有参数。
// 然后将获取到的参数传到 obj.fn ，这样就实现了第二个功能。
// 示例中使用了ES6的扩展运算符（...），简单地理解它的作用就是：将数组中的每一项打散。

Function.prototype.myCall = function (object) {
  let obj = object || window; // 如果没有传this参数，this将指向window
  obj.fn = this; // 获取函数本身，此时调用call方法的函数已经是传进来的对象的一个属性，也就是说函数的this已经指向传进来的对象
  let arg = [...arguments].slice(1); // 获取第二个及后面的所有参数(arg是一个数组)
  let result = obj.fn(...arg);
  return result;
};

// apply
// 其实知道call和apply之间的差别，就会发现，它们的实现原理只有一点点差别，那就是后面的参数不一样，
// apply的第二个参数是一个数组，所以可以拿call的实现方法稍微改动一下就可以了，如下：

Function.prototype.myApply = function (object) {
  let obj = object || window; // 如果没有传this参数，this将指向window
  obj.fn = this; // 获取函数本身，此时调用call方法的函数已经是传进来的对象的一个属性，也就是说函数的this已经指向传进来的对象
  let arg = [...arguments].slice(1); // 获取第二个及后面的所有参数(arg是一个数组)
  let result = obj.fn(arg); // 这里不要将数组打散，而是将整个数组传进去
  return result;
};

// 唯一不同之处就是：let result = obj.fn(arg); 这里传参的时候，将整个数组传进去就好了

// bind
// bind方法被调用的时候，会返回一个新的函数，这个新函数的this会指向bind的第一个参数，bind方法的其余参数将作为新函数的参数。
Function.prototype.myBind = function (object) {
  let obj = object || window;
  obj.fn = this;
  let arg = [...arguments].slice(1);
  return function () {
    obj.fn.apply(object, arg);
  };
};
// 前面的还是一样写法，就是返回的数据不一样，bind返回的是一个函数。
