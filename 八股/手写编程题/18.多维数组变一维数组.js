// toString
function flatten(arr) {
  return arr
    .toString()
    .split(",")
    .map(function (item) {
      return +item;
    });
}

// reduce
function flatten(arr) {
  return arr.reduce(function (prev, next) {
    return prev.concat(Array.isArray(next) ? flatten(next) : next);
  }, []);
}

// rest运算符
function flatten(arr) {
  while (arr.some((item) => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}
