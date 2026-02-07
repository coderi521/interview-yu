# Promise

## 题目
请简单介绍一下你对 ES6 中 Promise 的理解，以及它如何解决回调地狱问题？

## 考点
异步编程基础。

## 答案要点
Promise 是异步编程的一种解决方案，它代表一个异步操作最终完成或失败及其结果值。

- **状态机制**：Pending、Fulfilled、Rejected 三种状态，状态一旦改变不可逆。
- **链式调用**：通过 `then()` 和 `catch()` 串联异步操作，避免回调嵌套。
- **错误捕获**：在链尾统一捕获异常。
- **静态方法**：`Promise.all`、`Promise.race`、`Promise.allSettled` 等并发控制。

## 常见坑
- 忘记在 Promise 内部调用 `resolve` 或 `reject`，导致状态悬挂。
- 在 `then()` 中没有 `return`，导致链式调用中断。

## 追问
**如果 `Promise.all` 中有一个请求失败了，其他请求还会继续执行吗？**

会继续执行。`Promise.all` 会立即 `reject`，但其他请求仍会继续执行，不会被取消。

**如何实现一个简单的 `Promise.retry` 功能？**

```js
Promise.retry = async function (fun, times = 3, delay = 1000) {
  let attTimes = 0 // 当前重试次数

  while (attTimes < times) {
    try {
      attTimes++
      console.log(`第 ${attTimes} 次尝试`)
      const res = await fun()
      return res // 成功则直接返回
    } catch (e) {
      if (attTimes >= times) {
        throw e // 达到最大重试次数，抛出错误
      }
      // 等待延迟后重试
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}

function testRetry() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('retry failed')
    }, 1000)
  })
}

Promise.retry(testRetry, 3, 1000)
  .then((res) => console.log(res))
  .catch((err) => console.error(err))
```

# 闭包

## 参考资料
https://www.bilibili.com/video/BV1ot4y1j7W2?spm_id_from=333.788.videopod.sections&vd_source=f7e2c865c4051a81751841e06b0facb1

## 定义
内部函数引用外部函数变量。

## 常见坑
- 内部函数一定会引发内存泄漏吗？不会。
- 闭包函数必须 `return` 吗？不需要。

## 作用
避免污染全局变量（隔离性）：创建私有变量/方法，避免变量污染全局作用域，只有通过闭包暴露的接口才能访问这些私有成员。

## 实际应用场景

### 1) 函数柯里化
如 `add(1)(2)(3)()` 返回 `6`。

```js
function add(num) {
  let sum = num || 0
  function fn(x) {
    if (x === undefined) return sum
    sum += x
    return fn
  }
  return fn
}
const res = add(1)(2)(3)()
console.log(res)
```

### 2) 防抖
防抖是指触发事件后，不会立即执行目标函数，而是等待一段指定时间；如果在这段时间内事件再次被触发，则重新计时，只有当最后一次触发事件后，等待时间结束且没有新的触发，才会执行目标函数。

简单理解：“遇事不决，再等一等”，只执行最后一次。

```js
function debounce(fn, time = 1000, immediate = false) {
  let timer = null
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    if (immediate) {
      const isCallNow = !timer
      timer = setTimeout(() => {
        timer = null
      }, time)
      if (isCallNow) {
        fn.apply(this, args)
      }
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args)
      }, time)
    }
  }
}

function click(num) {
  console.log('Button clicked', num)
}
const a = debounce(click, 6000, true)
a(1)
```

### 3) 节流
节流是指触发事件后，会立即执行一次目标函数，然后在指定的时间内，无论事件被触发多少次，都不会再执行；只有当这段时间结束后，才会响应下一次触发。

简单理解：“弱水三千，只取一瓢”，固定时间内只执行一次。

不能直接使用 `args`，必须用 `lastArgs` 缓存，核心原因有 2 点：

1. **执行时机不同**：`args` 是「触发时」的参数，而节流的 trailing 逻辑是「延迟一段时间后（节流窗口结束）」执行，此时原有的 `args` 已经不是最后一次触发的参数，甚至可能失效。
2. **作用域绑定不同**：每次调用节流包装后的函数都会生成一个独立的 `args`（属于当前函数调用的局部变量），`setTimeout` 回调捕获的是当前调用的 `args`，而非节流窗口内最后一次触发的 `args`，直接使用会导致参数错乱。

简单说：`lastArgs` 用来「留存最后一次触发的参数」，确保延迟执行能拿到最新、最准确的一组参数。

```js
/**
 * @param {*} fun
 * @param {*} delay
 * @param {*} options
 * leading: 是否在开始时调用函数
 * trailing: 是否在结束时调用函数
 */
function throttle(fun, delay, options = { leading: true, trailing: true }) {
  let timer = null
  let lastArgs = null
  const { leading, trailing } = options
  return function (...args) {
    lastArgs = args
    if (!timer) {
      if (leading) {
        fun.apply(this, args)
      }
      timer = setTimeout(() => {
        if (trailing && lastArgs) {
          lastArgs = undefined
          fun.apply(this, args)
        }
        if (trailing && leading) {
          setTimeout(() => {
            timer = null
          }, delay)
        }
      }, delay)
    }
  }
}

const fn = function () {
  console.log('throttle')
}

const throttledFn = throttle(fn, 2000, { leading: true, trailing: true })

setInterval(() => {
  throttledFn()
}, 500)
```

# 深拷贝

## 核心定义
深拷贝（Deep Copy）是指创建一个全新的、独立的对象/数据结构，将原对象所有层级的属性（包括基本类型和引用类型）完整复制到新对象中。新对象与原对象完全隔离，修改一方不会影响另一方。

## 对比
- **浅拷贝（Shallow Copy）**：仅复制第一层属性，引用类型复制的是内存地址，深层共享。
- **深拷贝**：解决共享引用问题，实现真正独立。

## 适用场景
需要修改数据副本，同时保留原数据不被污染（如表单提交前数据留存、复杂配置复用、不可变数据处理）。

```js
function cloneDeep(target) {
  const map = new Map()
  function baseClone(value) {
    if (value === null) return value
    if (Object.prototype.toString.call(value) !== '[object Object]' && !Array.isArray(value)) return value
    if (map.get(value)) return map.get(value)
    const result = Array.isArray(value) ? [] : {}
    map.set(value, result)
    const keys = Object.keys(value)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      result[key] = cloneDeep(value[key])
    }
    return result
  }
  return baseClone(target)
}

const obj = {
  a: 1,
  b: {
    c: 2,
    d: [3, 4],
  },
}
const newObj = cloneDeep(obj)
console.log(newObj)
```

# React 中 `key` 的作用

## 一、核心作用
`key` 用于标识列表元素的唯一性，核心是优化 Diff 算法、提升渲染性能：

- 帮助 React 识别元素“身份”，在增删/排序时快速定位变化。
- 复用 DOM 节点，避免不必要的销毁与重建。
- 保持组件状态稳定（如输入框内容）。

**一句话总结**：`key` 的核心是“唯一标识，优化 Diff，复用 DOM，保持状态”。

## 二、用 `index` 作为 `key` 的问题
`index` 作为 `key` 仅在列表静态不变时安全；当列表动态变化时会出问题：

1. **DOM 被不必要重建**：头部新增/删除或排序时，后续 `index` 变化，React 误判为新元素。
2. **组件状态错乱**：React 复用组件时可能复用错对象，导致 state/DOM 状态不一致。

```jsx
function List() {
  const [list, setList] = useState([
    { id: 1, name: '张三' },
    { id: 2, name: '李四' },
  ])

  const addItem = () => {
    setList([{ id: 3, name: '王五' }, ...list])
  }

  return (
    <div>
      <button onClick={addItem}>头部添加</button>
      <ul>
        {list.map((item, index) => (
          <li key={index}>
            {item.name}
            <input type="text" placeholder="请输入内容" />
          </li>
        ))}
      </ul>
    </div>
  )
}
```

## 总结
- 核心作用：唯一标识列表元素，优化 Diff，复用 DOM 并保持状态。
- `index` 作 `key`：仅静态列表安全，动态列表会导致 DOM 重建与状态错乱。
- 最佳实践：优先使用元素自身唯一标识（如 `id`）。

# SSE 与 WebSocket 的区别

## 一、核心定位
- **SSE（Server-Sent Events）**：基于 HTTP 的**单向**推送，仅支持“服务器 → 客户端”。
- **WebSocket**：基于 TCP 的**全双工**通信，支持“服务器 ↔ 客户端”双向实时通信。

## 二、适用场景
**SSE（单向推送、简单实时需求）**：
- 服务器单向推送（如 Agent 流式回复、新闻推送、监控上报）。
- 不想引入复杂依赖、追求轻量实现。
- 兼容现有 HTTP 生态。

**WebSocket（双向实时、复杂交互）**：
- 在线聊天、多人协作、实时游戏。
- 需要传输二进制数据（音视频、分片）。
- 对实时性要求极高、低延迟。

## 三、面试补充
- SSE 是 HTTP 生态下的实时推送方案；WebSocket 是专为双向实时通信设计的独立方案。
- 在 Agent 流式交互场景中，SSE 更优（单向推送、资源消耗低）。
- 如需双向通信，可采用“**SSE + HTTP 请求**”组合。

## 总结
- **核心差异**：SSE 是 HTTP 单向推送；WebSocket 是 TCP 全双工通信。
- **场景选择**：单向实时推送优先 SSE；双向实时交互优先 WebSocket。


### 手写实现一个 Promise.all 方法
```js
function PromiseAll(target) {
  return new Promise((resolve, reject) => {
    try {
      let resolveCount = 0
      let resolveResult = []
      const interableArr = Array.isArray(target) ? target : []
      interableArr.forEach((item, index) => {
        Promise.resolve(item).then(res => {
          resolveResult[index] = res
          resolveCount++
          if (resolveCount === interableArr.length) {
            resolve(resolveResult)
          }
        }).catch(err => {
          reject(err)
        })
      })
    } catch (e) {
      throw new Error(e)
    }
  })
}

const p1 = Promise.resolve(1)
const p2 = Promise.resolve(2)
const p3 = Promise.resolve(3)

PromiseAll([p1, p2, p3]).then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
})
```
### 数组转树形结构：给定一个包含id，parentld 的扁平数组，如何高效转换成树？
```js
// 扁平数组（输入）
const flatArr = [
  { id: 1, name: "根节点1", parentId: 0 },
  { id: 2, name: "子节点1-1", parentId: 1 },
  { id: 3, name: "子节点1-2", parentId: 1 },
  { id: 4, name: "子节点1-1-1", parentId: 2 },
  { id: 5, name: "根节点2", parentId: 0 },
  { id: 6, name: "子节点2-1", parentId: 5 }
];

// 树形结构（输出）
[
  {
    "id": 1,
    "name": "根节点1",
    "parentId": 0,
    "children": [
      {
        "id": 2,
        "name": "子节点1-1",
        "parentId": 1,
        "children": [ { "id": 4, "name": "子节点1-1-1", "parentId": 2, "children": [] } ]
      },
      { "id": 3, "name": "子节点1-2", "parentId": 1, "children": [] }
    ]
  },
  {
    "id": 5,
    "name": "根节点2",
    "parentId": 0,
    "children": [ { "id": 6, "name": "子节点2-1", "parentId": 5, "children": [] } ]
  }
]
function floatTree(nodes, rootVaule=0) {
  let nodeMap = {}
  const tree = []
  for(const item of nodes) {
    nodeMap[item.id] = {...item, children: [] }
  }
  for(const t of nodes) {
    const currentNode = nodeMap[t.id]
    const parentNode = nodeMap[t.parentId]
    if (t.parentId === rootVaule) {
      tree.push(currentNode)
    } else {
      parentNode.children.push(currentNode)
    }
  }
  return tree
}
console.log(floatTree(flatArr));
```

### 谈谈浏览器的强缓存和协商缓存
浏览器的强缓存和协商缓存是HTTP 缓存机制的核心，核心目的都是减少重复的网络请求、提升页面加载速度、降低服务器压力，二者属于递进关系：优先触发强缓存，强缓存未命中时，才会触发协商缓存。
面试回答按「核心定义→核心区别→实现方式→缓存生效 / 失效场景→整体流程」梳理，逻辑闭环、重点突出，可直接背诵复用。
一、核心定义
1. 强缓存
浏览器直接从本地缓存读取资源，不发起任何网络请求到服务器，是最高效的缓存方式。
判定依据：浏览器通过请求头的缓存字段，判断资源是否在「有效期内」，有效期内直接使用本地缓存，完全跳过服务器。
核心特点：无网络请求、响应状态码为 200 OK (from disk cache/from memory cache)。
2. 协商缓存
强缓存未命中（资源过期 / 缓存配置失效）时，浏览器会发起一次 HTTP 请求到服务器，携带资源的缓存标识，由服务器判定资源是否发生变化：
若资源未变化：服务器返回304 Not Modified，不返回资源体，浏览器直接使用本地缓存；
若资源已变化：服务器返回200 OK，并携带最新的资源体和新的缓存标识，浏览器更新本地缓存并使用新资源。
核心特点：有网络请求、但大概率不返回资源体，仅做「缓存有效性协商」。
二、核心区别（面试必答，表格直观）
对比维度	强缓存	协商缓存
网络请求	无任何 HTTP 请求	必发起 HTTP 请求（仅协商，少传资源）
服务器参与	服务器完全不参与	服务器参与缓存有效性判定
响应状态码	200 OK (from cache)	304 Not Modified（未变化）/200 OK（已变化）
性能	最优（直接读本地）	次优（有请求但无 / 少资源传输）
缓存失效判定方	浏览器本地自主判定	服务器远程判定
三、实现方式（HTTP 头字段，面试核心）
HTTP 缓存的实现依赖请求头和响应头的配合，强缓存和协商缓存各有对应的核心字段，其中强缓存的 Expires 已被淘汰，优先使用 Cache-Control；协商缓存有两组字段，功能等价。
1. 强缓存：核心字段 Cache-Control（主流）、Expires（废弃）
（1）Cache-Control（HTTP/1.1 标准，推荐使用，优先级更高）
通过响应头由服务器设置，支持多个指令组合，核心指令：
max-age=秒数：资源的缓存有效期，从资源请求成功的时间开始计算（如max-age=3600表示缓存 1 小时）；
public：所有缓存节点（浏览器、CDN、代理服务器）都可缓存该资源；
private：仅浏览器可缓存（默认值），CDN / 代理服务器不缓存；
no-cache：不使用强缓存，直接触发协商缓存（易误解，不是 “不缓存”）；
no-store：完全不缓存，每次都从服务器获取最新资源，跳过所有缓存机制；
s-maxage=秒数：专门针对 CDN / 代理服务器的缓存有效期，优先级高于max-age。
示例：Cache-Control: public, max-age=3600 → 资源公网可缓存，浏览器本地缓存 1 小时。
（2）Expires（HTTP/1.0 字段，已废弃）
服务器通过响应头设置一个绝对时间戳（如Expires: Wed, 01 Feb 2026 12:00:00 GMT），浏览器判断当前时间是否在该时间之前，若是则使用强缓存。
缺点：依赖浏览器和服务器的时间同步，若时间不一致会导致缓存失效 / 过期，因此被Cache-Control替代。
2. 协商缓存：两组等价字段（资源标识）
协商缓存的核心是给资源分配唯一标识，浏览器请求时携带标识，服务器对比标识判断资源是否变化，两组字段功能完全等价，项目中选其一即可：
组合 1：Last-Modified + If-Modified-Since（基于资源修改时间）
服务器首次返回资源时，通过响应头设置Last-Modified：资源最后一次的修改时间戳（如Last-Modified: Wed, 01 Feb 2026 10:00:00 GMT）；
强缓存失效后，浏览器发起请求时，通过请求头携带If-Modified-Since：值为上一次的Last-Modified时间戳；
服务器对比：若服务器资源的最后修改时间 ≤ If-Modified-Since，说明资源未变，返回 304；否则返回 200 + 新资源 + 新的Last-Modified。
缺点：
时间精度为秒，若资源 1 秒内多次修改，无法识别；
资源修改后又恢复原状（内容不变），服务器仍会判定为 “已修改”，返回新资源，缓存失效。
组合 2：ETag + If-None-Match（基于资源唯一哈希值，推荐使用，优先级更高）
服务器首次返回资源时，通过响应头设置ETag：根据资源内容计算的唯一哈希值（如ETag: "abc123def"），资源内容只要有任何修改，哈希值就会变化；
强缓存失效后，浏览器发起请求时，通过请求头携带If-None-Match：值为上一次的ETag哈希值；
服务器对比：若哈希值一致，说明资源未变，返回 304；否则返回 200 + 新资源 + 新的ETag。
优点：
基于资源内容计算，精度远高于时间戳，能识别任意微小的内容变化；
资源内容不变时，即使修改时间变化，哈希值仍不变，缓存依然有效。
注意：ETag 优先级高于 Last-Modified，若服务器同时设置两组字段，浏览器会优先使用ETag进行协商。
四、缓存的存储位置（面试加分，解释 200 from cache 的两种情况）
强缓存的「本地缓存」分为内存缓存（memory cache） 和磁盘缓存（disk cache），浏览器会根据资源特性自动选择，二者无配置项，由浏览器内核决定：
内存缓存（from memory cache）
存储在浏览器内存中，页面关闭后缓存立即失效；
存储资源：体积小、访问频繁的资源（如 JS/CSS 核心文件、图片）；
特点：读取速度最快，无 IO 操作。
磁盘缓存（from disk cache）
存储在本地硬盘中，页面关闭后缓存仍存在，直到过期 / 被清理；
存储资源：体积大、访问频率一般的资源（如大图片、视频、第三方库）；
特点：读取速度略慢（有硬盘 IO），但缓存持久化。
五、缓存生效 / 失效的常见场景（面试落地，体现实际应用）
1. 强缓存生效
资源未过期（max-age时间未到），且未手动刷新页面；
页面普通刷新（F5）：强缓存依然生效，仅协商缓存会重新验证；
页面前进 / 后退、新标签页打开同链接：完全走强缓存。
2. 强缓存失效（触发协商缓存）
资源的max-age过期，或未设置强缓存字段；
页面普通刷新（F5）：跳过强缓存？不，强缓存仍会先判定，仅协商缓存会重新发起请求；
服务器修改了缓存配置（如缩短max-age）。
3. 所有缓存失效（强制从服务器获取新资源）
页面强制刷新（Ctrl+F5/Command+Shift+R）：浏览器会在请求头添加Cache-Control: no-cache和Pragma: no-cache，跳过强缓存和协商缓存，直接请求新资源；
手动清除浏览器缓存（Cookie 和网站数据）；
资源 URL 添加缓存击穿参数（如js/app.js?v=20260201）：URL 变化，浏览器认为是新资源，直接跳过所有缓存。
六、浏览器缓存的整体执行流程（面试闭环，梳理完整逻辑）
浏览器发起资源请求时，首先判断本地是否有该资源的缓存，若无，直接发起请求到服务器，返回 200 + 资源 + 缓存字段，浏览器缓存资源；
若有本地缓存，先执行强缓存判定：根据Cache-Control/max-age（或 Expires）判断资源是否在有效期内；
若强缓存命中：直接从内存 / 磁盘读取资源，返回 200 (from cache)，流程结束；
若强缓存未命中：进入协商缓存阶段；
协商缓存阶段：浏览器发起 HTTP 请求，在请求头携带协商缓存标识（If-None-Match/If-Modified-Since）；
服务器接收请求，对比缓存标识，判断资源是否发生变化；
若资源未变化：返回 304 Not Modified，不携带资源体，浏览器继续使用本地缓存，流程结束；
若资源已变化：返回 200 OK + 最新资源体 + 新的缓存标识，浏览器更新本地缓存并使用新资源，流程结束。
七、面试加分补充
缓存击穿参数（URL 加版本号）：实际开发中，为了快速更新资源（跳过缓存），会给静态资源 URL 添加版本号（如v=1.0.0）或哈希值（如app.abc123.js），URL 变化后浏览器会认为是新资源，直接请求服务器，这是前端最常用的缓存更新方案；
CDN 与缓存：CDN 会严格遵循Cache-Control配置，s-maxage专门用于配置 CDN 的缓存有效期，可有效降低源站压力；
no-cache 与 no-store 区别：no-cache是不使用强缓存，直接走协商缓存；no-store是完全不缓存，每次都从服务器获取，切勿混淆；
Pragma: no-cache：HTTP/1.0 的字段，作用与Cache-Control: no-cache一致，用于兼容老旧浏览器，现代项目可忽略。
总结
缓存核心：强缓存优先，协商缓存兜底，二者都是为了减少网络请求，提升性能；
核心字段：强缓存用Cache-Control/max-age，协商缓存推荐用ETag/If-None-Match；
关键状态码：200 (from cache)（强缓存）、304 Not Modified（协商缓存未变化）；
缓存更新：实际开发中通过URL 加版本 / 哈希实现资源强制更新，是最直接有效的方案。

### Typescript 中的 interface 和 type 有什么区别？
interface（接口）：TS 专门用于描述对象 / 函数的形状（结构），是一种「结构化类型」，核心聚焦于「定义数据结构」，扩展性更强。
type（类型别名）：用于给任意类型（基本类型、联合类型、交叉类型等）起一个别名，核心聚焦于「类型复用」，适用场景更广泛，灵活性更高。
简单说：interface 是「专用的对象结构定义工具」，type 是「通用的类型别名工具」。
接口合并（interface 独有，核心扩展能力）
```ts
// 1. 定义第一个同名接口
interface User {
  name: string;
  age: number;
}

// 2. 定义第二个同名接口，自动合并
interface User {
  gender: string;
}

// 3. 合并后：User 包含 name、age、gender 三个属性
const user: User = {
  name: "张三",
  age: 28,
  gender: "男"
};
```
type 无此能力，若写两个同名 type User，会直接报错 Duplicate identifier 'User'。
2. 支持所有类型（type 独有，场景更广泛）
```ts
// （1）基本类型别名（interface 不支持）
type Name = string;
type Age = number;

// （2）联合类型（interface 不支持）
type Status = "success" | "error" | "loading";

// （3）元组类型（interface 不支持直接定义）
type Tuple = [string, number]; // 第一个元素字符串，第二个元素数字

// （4）交叉类型（interface 需通过 extends 间接实现，type 更直接）
type UserBase = { name: string };
type UserExtend = { age: number };
type User = UserBase & UserExtend; // 交叉合并，包含 name 和 age
```
3. 继承与实现（两者的差异）
```ts
// （1）interface 继承 interface（支持）
interface Animal {
  name: string;
}
interface Dog extends Animal {
  bark: () => void;
}

// （2）type 实现类似继承（通过交叉类型 &，无 extends 语法）
type Animal = { name: string };
type Dog = Animal & { bark: () => void };

// （3）class 实现 interface（支持）
class DogImpl implements Dog {
  name = "旺财";
  bark() { console.log("汪汪汪"); }
}

// （4）class 实现 对象类型的 type（支持）
type Cat = { name: string; meow: () => void };
class CatImpl implements Cat {
  name = "咪咪";
  meow() { console.log("喵喵喵"); }
}

// （5）class 无法实现 联合类型的 type（报错，interface 无此场景）
type UnionType = string | number;
// class Test implements UnionType {} // 报错：A class can only implement an object type or intersection of object types with statically known members.
```
三、 适用场景（面试落地加分，体现实际应用能力）
1. 优先使用 interface 的场景
定义对象 / 函数的结构（如接口返回数据、组件 Props、函数入参 / 返回值），追求扩展性（后续可能新增属性）；
定义类的接口（供 class 实现），符合面向对象的设计思想；
团队协作中，需要同名接口自动合并（如第三方库的类型扩展、全局类型声明）。
示例（React 组件 Props 定义）：
```ts
interface ButtonProps {
  type: "primary" | "default" | "danger";
  size?: "large" | "middle" | "small";
  onClick?: () => void;
}

const Button = (props: ButtonProps) => {
  return <button {...props} />;
};
```
2. 优先使用 type 的场景
定义基本类型、联合类型、交叉类型、元组类型（interface 不支持）；
定义不可扩展的类型（后续无需新增属性，追求类型的不可变）；
对现有类型进行复用和组合（如提取部分属性、交叉多个类型）。
示例（状态类型定义）：
```ts
// 联合类型：接口返回状态
type ApiStatus = "idle" | "pending" | "success" | "fail";

// 元组类型：坐标数据
type Coordinate = [number, number];

// 交叉类型：组合多个类型
type BaseResponse = { code: number; msg: string };
type UserResponse = BaseResponse & { data: { name: string; age: number } };
```
四、 面试加分补充（体现深度思考）
优先级无绝对：TS 官方推荐「能用 interface 就用 interface，无法满足时用 type」，但实际开发中，type 灵活性更高，使用频率也更高，两者并无绝对优劣。
映射类型的配合：type 可配合 TS 内置映射类型（如 Partial、Required、Pick）使用，实现类型的动态转换，interface 不支持此场景。
```ts
interface User {
  name: string;
  age: number;
}
// type 配合 Partial，将 User 所有属性变为可选
type PartialUser = Partial<User>;
```
全局类型声明：在 d.ts 声明文件中，interface 的合并能力更适合扩展第三方库的类型（如扩展 window 对象）。
```ts
// 扩展 window 对象的属性
interface Window {
  myGlobal: string;
}
```
不可混淆的点：interface 始终是「结构」，type 始终是「别名」，type 定义后无法修改，interface 可通过合并扩展。
总结
核心差异：interface 专用于对象结构，支持合并和继承；type 通用所有类型，支持联合 / 交叉，不支持合并。
场景选择：定义对象 / 类结构优先 interface，定义基本 / 联合 / 元组类型优先 type。
面试要点：回答时既要讲清维度差异，也要结合实际场景，体现对 TS 类型系统的实际使用经验。


