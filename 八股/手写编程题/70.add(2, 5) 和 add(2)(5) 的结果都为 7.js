var add = function (x, r) {
  if (arguments.length === 1) {
    return function (y) {
      return x + y;
    };
  } else {
    return x + r;
  }
};
console.log(add(2)(5)); // 7
console.log(add(2, 5)); // 7
