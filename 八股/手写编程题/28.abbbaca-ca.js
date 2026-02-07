// 示例：输入“abbbaca”->删掉bbb变成’aaca’ 删掉’aa’得到结果 ‘ca’
// 思路：用栈，如果新入栈的字符和栈顶的相同就删掉
const test = "abbbaca"; //测试用例
const len = test.length;
const stk = [test[0]];
console.log(stk);
for (let i = 1; i < len; i++) {
  if (stk.length) {
    let top = stk[stk.length - 1];
    //如果将要入栈的字符和栈顶字符相同，就将指针后移到这个全由相同字符组成的子串的最后一位，并且删除栈顶元素
    if (test[i] === top) {
      while (test[i] === test[i + 1]) {
        i++;
      }
      stk.pop();
    } else {
      stk.push(test[i]);
    }
  } else {
    stk.push(test[i]);
  }
}
console.log(stk.join(""));
