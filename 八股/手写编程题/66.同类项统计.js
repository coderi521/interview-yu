// 给定数组['1a','2b','13c','5a']，数组元素的格式是一个数字（可能多位）前缀与一个字母的组合
// 输出出现次数最多的字母对应的前缀数字之和。
//测试用例
const test = ["1a", "2b", "13c", "5a"];

const len = test.length;
const hash = new Map();
for (let i = 0; i < len; i++) {
  const strlen = test[i].length;
  //如果这个字符串中的字母还没作为键存储在哈希表中，就把他加进去
  if (!hash.has(test[i][strlen - 1])) {
    //哈希表中的值是一个数组，第一个元素代表出现的次数，第二个元素代表前缀数字之和
    //注意细节，slice方法的两个参数是能取到左不能取到右
    const arr = [1, parseInt(test[i].slice(0, strlen - 1))];
    hash.set(test[i][strlen - 1], arr);
  } else {
    //否则出现次数+1，前缀数字之和也要改变
    const arr = hash.get(test[i][strlen - 1]);
    arr[0]++;
    arr[1] += parseInt(test[i].slice(0, strlen - 1));
    hash.set(test[i][strlen - 1], arr);
  }
}
//接下来找出现次数最多的字母，并打印结果
let maxCount = 0,
  res = 0;
for (let key of hash.keys()) {
  const arr = hash.get(key);
  if (arr[0] > maxCount) {
    maxCount = arr[0];
    res = arr[1];
  }
}
console.log(res);
