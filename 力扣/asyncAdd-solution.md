# 异步加法实现与性能优化

## 题目要求

实现一个满足 `asyncAdd` 函数，实现两个数的异步加法，并要求用其计算多个数的和，同时考虑性能优化。

---

## 完整代码实现

```javascript
// 1. 模拟异步加法函数（题目通常会给出这个）
function asyncAdd(a, b, callback) {
  setTimeout(() => {
    callback(null, a + b);
  }, Math.random() * 1000); // 模拟异步延迟
}

// 2. 将 asyncAdd 封装成 Promise
function asyncAddPromise(a, b) {
  return new Promise((resolve, reject) => {
    asyncAdd(a, b, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// 3. 串行方案（简单但性能差）
async function sumSerial(nums) {
  let result = 0;
  for (const num of nums) {
    result = await asyncAddPromise(result, num);
  }
  return result;
}

// 4. 并行方案（性能优化 - 分治法）
async function sumParallel(nums) {
  // 边界条件
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];
  if (nums.length === 2) return asyncAddPromise(nums[0], nums[1]);

  // 两两配对，并行计算
  const tasks = [];
  for (let i = 0; i < nums.length; i += 2) {
    if (i + 1 < nums.length) {
      // 两个数并行相加
      tasks.push(asyncAddPromise(nums[i], nums[i + 1]));
    } else {
      // 奇数个数时，最后一个直接保留
      tasks.push(Promise.resolve(nums[i]));
    }
  }

  // 等待本轮所有并行任务完成
  const results = await Promise.all(tasks);

  // 递归处理下一轮
  return sumParallel(results);
}

// 5. 使用示例
async function main() {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  console.log('开始串行计算...');
  console.time('串行');
  const serialResult = await sumSerial(nums);
  console.timeEnd('串行');
  console.log('串行结果:', serialResult);

  console.log('\n开始并行计算...');
  console.time('并行');
  const parallelResult = await sumParallel(nums);
  console.timeEnd('并行');
  console.log('并行结果:', parallelResult);
}

main();
```

---

## 关键点解析

### 时间复杂度对比

| 方案 | 时间复杂度 | 说明 |
|------|-----------|------|
| 串行 | O(n) | 每次只能执行一个加法 |
| 并行 | O(log n) | 每轮并行处理，轮数为 log₂n |

### 并行优化原理

```
第1轮: [1,2,3,4,5,6,7,8] → 并行计算 → [3, 7, 11, 15]
第2轮: [3,7,11,15]       → 并行计算 → [10, 26]
第3轮: [10,26]           → 并行计算 → [36]
```

8个数只需要 3 轮（log₂8 = 3），而串行需要 7 次加法。

---

## 进阶：控制并发数量

如果需要限制并发数，可以使用如下方案：

```javascript
async function sumWithConcurrencyLimit(nums, limit = 4) {
  if (nums.length <= 1) return nums[0] || 0;

  const results = [];
  let index = 0;

  async function worker() {
    while (index < nums.length - 1) {
      const i = index;
      index += 2;
      if (i + 1 < nums.length) {
        results.push(await asyncAddPromise(nums[i], nums[i + 1]));
      } else {
        results.push(nums[i]);
      }
    }
  }

  // 创建指定数量的 worker
  await Promise.all(Array(Math.min(limit, Math.ceil(nums.length / 2))).fill().map(worker));

  return sumWithConcurrencyLimit(results, limit);
}
```

---

## 总结

1. **Promise 封装**：将 callback 风格的 `asyncAdd` 封装成 Promise，便于使用 async/await
2. **串行方案**：简单直观，但性能较差
3. **并行方案**：利用分治思想，两两配对并行计算，时间复杂度从 O(n) 优化到 O(log n)
4. **并发控制**：在需要限制并发数量的场景下，使用 worker 池模式控制并发
