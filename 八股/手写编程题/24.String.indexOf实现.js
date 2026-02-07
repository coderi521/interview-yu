var a = "abcdefghijkl";
var b = "ghi";
var c = "123";
function indexOf(str, item) {
  var aL = str.length;
  var bL = item.length;
  for (var i = 0; i < aL - bL; i++) {
    if (str.slice(i, bL + i) == item) {
      return i;
    }
  }
  return -1;
}
console.log(indexOf(a, b));
console.log(indexOf(a, c));
