var isPalindrome = function (x) {
  if (x < 0 || (!(x % 10) && x)) return false;
  let x2 = x,
    res = 0;
  while (x2) {
    res = res * 10 + (x2 % 10);
    x2 = parseInt(x2 / 10);
  }
  return res === x;
};
