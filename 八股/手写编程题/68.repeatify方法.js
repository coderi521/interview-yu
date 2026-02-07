String.prototype.repeatify = function (num) {
  let res = "";
  for (let i = 0; i < num; i++) {
    res += this;
  }
  return res;
};

console.log("hello".repeatify(3)); //hellohellohello
