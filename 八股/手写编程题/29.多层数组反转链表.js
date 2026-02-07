// 示例：[1, [2, [3, [4, [5, 'null']]]]] => [5, [4, [3, [2, [1, 'null']]]]]
function reverse(list) {
  const refs = [];

  let currentList = list;
  while (Array.isArray(currentList[1])) {
    refs.push(currentList);

    currentList = currentList[1];
  }
  refs.push(currentList);

  let middle = null,
    maxIndex = refs.length - 1,
    halfLength = Math.floor(refs.length / 2);

  for (let i = 0; i < halfLength; i++) {
    const left = refs[i],
      right = refs[maxIndex - i];

    [left[0], right[0]] = [right[0], left[0]];
  }
}

const data = [1, [2, [3, [4, [5, "null"]]]]];

reverse(data);

console.log(JSON.stringify(data));
// 此处是为了更直观的看数据
