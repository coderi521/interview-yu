// 快排有两种写法，一种是交换比pivot大和pivot小的元素(不创建新数组)，一种是把比pivot小的数放进数组里，把比pivot大的数放进数组里。然后连接起来。(创建了数组保存变量)，以下给出交换的方案。

function Sort(arr) {
  function partition(arr, left, right) {
    let value = arr[left];
    let _left = left,
      _right = right;
    while (_left < _right) {
      while (arr[_right] >= value && _left < _right) {
        _right--;
      }
      while (arr[_left] <= value && _left < _right) {
        _left++;
      }
      [arr[_right], arr[_left]] = [arr[_left], arr[_right]];
    }
    [arr[left], arr[_left]] = [arr[_left], arr[left]];
    return _left;
  }
  function quickSort(arr, left, right) {
    if (left >= right) return;
    let pivot = partition(arr, left, right);
    quickSort(arr, left, pivot - 1);
    quickSort(arr, pivot + 1, right);
  }
  quickSort(arr, 0, arr.length - 1);
  return arr;
}
