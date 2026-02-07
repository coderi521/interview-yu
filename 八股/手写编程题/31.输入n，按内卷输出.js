// 输入 1, 输出:
// 1
// 输入 2, 输出:
// 1, 2
// 4, 3
// 输入 3, 输出:
// 1, 2, 3
// 8, 9, 4
// 7, 6, 5
// 输入 4, 输出:
// 1, 2, 3, 4
// 12, 13, 14, 5
// 11, 16, 15, 6
// 10, 9, 8, 7

const print = (n) => {
  const arr = Array(n)
    .fill()
    .map(() => {
      return Array(n).fill(0);
    });

  printMatrixClockwisely(arr, n, n);

  console.log(arr);
};

const printMatrixInCircle = (arr, start, row, colum, cur) => {
  let endX = row - 1 - start;
  let endY = colum - 1 - start;

  for (let i = start; i <= endY; i++) {
    arr[start][i] = cur;
    cur++;
    // console.log(arr[start][i]);
  }

  if (endX > start) {
    for (let i = start + 1; i <= endX; i++) {
      arr[i][endY] = cur;
      cur++;
      // console.log(arr[i][endY]);
    }
  }

  if (endX > start && endY > start) {
    for (let i = endY - 1; i >= start; i--) {
      arr[endY][i] = cur;
      cur++;
      // console.log(arr[endY][i]);
    }
  }

  if (endY > start && endX - 1 > start) {
    for (let i = endX - 1; i > start; i--) {
      arr[i][start] = cur;
      cur++;
      // console.log(arr[i][start]);
    }
  }

  return cur;
};

const printMatrixClockwisely = (arr, row, colum) => {
  let start = 0;
  let cur = 1;

  while (row > 2 * start && colum > 2 * start) {
    cur = printMatrixInCircle(arr, start, row, colum, cur);
    start++;
  }
};
print(4);
