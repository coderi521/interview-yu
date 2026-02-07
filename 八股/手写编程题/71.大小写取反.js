// 如何把一个字符串的大小写取反（大写变小写小写变大写），例如 ’AbC' 变成 'aBc'
// 方法一：常规
function transformStr(str) {
  let tempArr = str.split("");
  let result = tempArr.map((char) => {
    return char === char.toUpperCase()
      ? char.toLowerCase()
      : char.toUpperCase();
  });
  return result.join("");
}
console.log(transformStr("aBc"));

// 方法二：正则
"aBc".replace(/[A-Za-z]/g, (char) =>
  char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
);
