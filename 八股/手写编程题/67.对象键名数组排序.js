// 给定一个对象，其中存储了世界富豪的名字(key)和资产(value)，求排行榜（输出一个数组，其中是富豪的名字，按他们的资产从大到小排序）。
// 例如输入{bill:500,sam:480,roark:501}，返回['roark','bill','sam']。

//测试用例
const test = { bill: 500, sam: 480, roark: 501, tom: 999 };
//Object.keys()方***返回一个由一个给定对象的自身可枚举属性组成的数组
//数组中属性名的排列顺序和正常循环遍历该对象时返回的顺序一致
//arr=['bill','sam','roark','tom']
const arr = Object.keys(test);
const len = arr.length;
for (let i = 0; i < len - 1; i++) {
  for (let j = 0; j < len - i - 1; j++) {
    //一定要注意交换时用的序号是j不是i，面试时脑子太迷糊写错了，看半天都看不出来哪里错了
    if (test[arr[j]] < test[arr[j + 1]]) {
      let temp = arr[j];
      arr[j] = arr[j + 1];
      arr[j + 1] = temp;
    }
  }
}
console.log(arr);

// 第二种
function fun(obj) {
  let arr = Object.keys(obj); //获取所有key值
  //通过冒泡排序，比较富豪对应的资产，对富豪名排序
  for (let i = arr.length - 1; i >= 0; i--) {
    let flag = false;
    for (let j = 0; j < i; j++) {
      if (obj[arr[j]] < obj[arr[j + 1]]) {
        //比较富豪对应的资产
        flag = true;
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
    if (!flag) {
      break;
    }
  }
  return arr;
}

let obj = { bill: 500, sam: 480, roark: 501 };
console.log(fun(obj)); // ['roark', 'bill', 'sam']
