/* 选择排序 */
for (var i = 0; i < arr.length - 1; i++) {
  for (var j = 1 + i; j < arr.length; j++) {
    if (arr[i] > arr[j]) {
      var xiaoshu = arr[j];
      arr[j] = arr[i];
      arr[i] = xiaoshu;
    }
  }
}
/* 选择排序 */

/* 冒泡排序 */
var arr = [23, 5, 78, 3, 5, 90, 35, 69, 1, 8];
for (var i = 0; i < arr.length - 1; i++) {
  for (var j = 0; j < arr.length - 1 - i; j++) {
    if (arr[j] > arr[j + 1]) {
      var dashu = arr[j];
      arr[j] = arr[j + 1];
      arr[j + 1] = dashu;
    }
  }
}

/* 冒泡排序 */

/* 快排 */

// 找到数组中间下标的项，把这项用splice删除，然后循环数组
// 如果比这项小的，放在一个left数组中
// 如果比这项大的，放在一个right的数组中，然后递归调用上面的方法
function quickStart(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  var num = Math.floor(arr.length / 2); // 中间的下标
  var numValue = arr.splice(num, 1)[0]; // 取得中间的值，原数组长度减一
  var left = []; //存放小于中间值的数
  var right = []; //存放大于中间值的数
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] < numValue) {
      left.push(arr[i]); //小于中间值，往左边放
    } else {
      right.push(arr[i]); //大于中间值，往右边放
    }
  }
  return quickStart(left).concat(numValue, quickStart(right));
}

/* 快排 */
