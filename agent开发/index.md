# Fetch API 和传统的 XMLHttpRequest 有什么区别？

## 考点
网络请求、流式处理

## 答案要点

Fetch API 提供了对 HTTP 管道的底层访问，原生支持 ReadableStream，非常适合处理 AI 的流式响应。

- **响应处理**：Fetch 的 response.body 是一个 ReadableStream，可以按块（chunk）读取数据，而 XHR 需要等待全部下载完成或监听 progress 事件。
- **语法简洁**：基于 Promise 设计，比 XHR 的事件监听模式更符合现代开发习惯。
- **中断机制**：Fetch 使用 AbortController 来中断请求，XHR 使用 .abort() 方法。
- **默认行为**：Fetch 默认不带 cookie，需要手动配置 credentials。

## 常见坑

- 认为 Fetch 在 HTTP 状态码为 404 或 500 时会抛出错误（实际上只有网络故障才会 reject）。

Fetch API 和传统的 XMLHttpRequest 有什么区别
一、先看直观对比（快速建立认知）
先通过两段实现「获取一个 JSON 数据」的代码，感受两者的直观差异：
1. 传统 XMLHttpRequest 实现
javascript
运行
// 1. 创建 XHR 实例
const xhr = new XMLHttpRequest();

// 2. 配置请求（请求方式、URL、是否异步）
xhr.open('GET', 'https://api.example.com/data.json', true);

// 3. 设置响应类型（可选，方便后续解析）
xhr.responseType = 'json';

// 4. 绑定请求状态变化事件（核心：通过事件监听处理结果）
xhr.onreadystatechange = function() {
  // 判断请求是否完成（readyState=4 表示请求已完成）
  if (xhr.readyState === 4) {
    // 判断响应是否成功（status 200-299 表示成功）
    if (xhr.status >= 200 && xhr.status < 300) {
      // 处理成功结果
      console.log('XHR 请求成功：', xhr.response);
    } else {
      // 处理失败结果
      console.error('XHR 请求失败：', xhr.status, xhr.statusText);
    }
  }
};

// 5. 绑定网络错误事件（单独处理网络层面的错误）
xhr.onerror = function() {
  console.error('XHR 网络错误');
};

// 6. 发送请求
xhr.send();
2. Fetch API 实现
javascript
运行
// 1. 直接调用 fetch 函数，传入 URL 和请求配置（可选）
fetch('https://api.example.com/data.json')
  // 2. 第一步：处理响应状态（fetch 不会自动拦截 HTTP 错误状态）
  .then(response => {
    if (!response.ok) { // response.ok 等价于 status 200-299
      throw new Error(`HTTP 错误：${response.status}`);
    }
    // 3. 解析响应数据（返回 Promise，支持链式调用）
    return response.json();
  })
  // 4. 第二步：处理解析后的成功数据
  .then(data => {
    console.log('Fetch 请求成功：', data);
  })
  // 5. 捕获所有错误（网络错误 + HTTP 错误 + 解析错误）
  .catch(error => {
    console.error('Fetch 请求失败：', error.message);
  });
从代码就能直观感受到：XHR 是事件驱动的，需要绑定多个事件、判断请求状态；Fetch 是Promise 驱动的，支持链式调用，代码更简洁、可读性更强。
二、核心区别详解（分维度梳理）
1. 语法与编程风格（最核心的差异）
XMLHttpRequest：
采用「事件驱动模型」，通过绑定 onreadystatechange、onerror、onload 等事件来处理请求的不同阶段。
代码冗余、嵌套（如果需要连续发起多个请求，容易出现「回调地狱」）。
配置和执行分离（open() 配置、send() 执行），步骤繁琐。
Fetch API：
采用「Promise 驱动模型」，返回一个 Promise 对象，天然支持 then() 链式调用和 async/await 语法，代码更简洁、扁平化。
配置和执行一体化（fetch() 函数直接传入 URL 和配置对象），步骤简洁。
支持 async/await 进一步简化代码，可读性拉满（新手更易接受）：
javascript
运行
// Fetch + async/await 实现（更优雅）
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data.json');
    if (!response.ok) {
      throw new Error(`HTTP 错误：${response.status}`);
    }
    const data = await response.json();
    console.log('Fetch 请求成功：', data);
  } catch (error) {
    console.error('Fetch 请求失败：', error.message);
  }
}
fetchData();
2. 错误处理机制
这是新手容易踩坑的点，两者的错误处理逻辑差异很大：
XMLHttpRequest：
「网络错误」（如断网、域名不存在）会触发 onerror 事件。
「HTTP 错误」（如 404、500）不会触发 onerror，而是在 onreadystatechange 中通过 status 状态码判断，属于「请求成功但业务失败」。
逻辑清晰，新手不易混淆（只要 readyState=4 就是请求完成，再通过 status 判断成败）。
Fetch API：
「网络错误」（如断网）会被 catch() 捕获。
「HTTP 错误」（如 404、500）不会被自动视为 Promise 失败（即不会进入 catch()），fetch 只认为「请求能够正常发送并收到服务器响应」就是成功的。
必须手动通过 response.ok 或 response.status 判断 HTTP 状态，手动抛出错误才能被 catch() 捕获（如上面代码所示），这是新手的常见踩坑点。
3. 功能特性支持（Fetch 更现代化、更强大）
特性	XMLHttpRequest	Fetch API	补充说明
跨域请求携带 Cookie	支持（默认不携带，需设置 withCredentials=true）	支持（默认不携带，需配置 credentials: 'include'）	Fetch 的配置更语义化（include/same-origin/omit）
响应流处理	不支持（只能等待完整响应返回）	支持（可通过 response.body 获取可读流）	适合处理大文件下载、实时数据推送（如 ChatGPT 流式响应）
请求中止	支持（调用 xhr.abort()）	支持（通过 AbortController + signal 配置）	Fetch 的中止方案更灵活，支持同时中止多个请求
Progress 进度监听	支持（onprogress 事件）	原生不支持（需通过响应流手动实现）	这是 Fetch 的小短板，上传 / 下载进度监听不如 XHR 便捷
JSON 解析	需手动设置 responseType='json'	内置 response.json() 方法	Fetch 提供了 json()/text()/blob() 等便捷解析方法，更易用
Promise 原生支持	不支持（需手动封装）	原生支持	可直接结合 async/await、Promise.all() 等现代异步工具
4. 浏览器兼容性与生态
XMLHttpRequest：
兼容性极好，支持所有现代浏览器，甚至兼容 IE7+（虽然 IE 已被淘汰）。
出现时间早，生态成熟，老项目中大量使用。
Fetch API：
支持所有现代浏览器（Chrome 42+、Firefox 39+、Edge 14+），不支持 IE 浏览器。
是 W3C 标准的新一代 HTTP 请求 API，后续浏览器的新特性都会优先支持 Fetch，生态正在快速完善。
若需兼容低版本浏览器，可引入 whatwg-fetch 垫片（polyfill）。
5. 配置灵活性
XMLHttpRequest：
配置项分散在多个方法中（open()、setRequestHeader()、withCredentials 等）。
对于复杂请求（如 POST 提交表单、设置请求头），代码繁琐。
Fetch API：
采用「配置对象」统一管理所有请求配置，更语义化、更灵活。
示例：POST 提交 JSON 数据（配置清晰）
javascript
运行
fetch('https://api.example.com/submit', {
  method: 'POST', // 请求方式
  headers: { // 请求头
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name: '张三', age: 20 }), // 请求体
  credentials: 'include' // 跨域携带 Cookie
});
---

### 三、总结（核心差异回顾）

- **核心模型**：XHR 是「事件驱动」，Fetch 是「Promise 驱动」，后者更简洁且支持 async/await，避免回调地狱。
- **错误处理**：XHR 区分网络错误和 HTTP 错误；Fetch 仅捕获网络错误，HTTP 错误需手动判断 response.ok 并抛出。
- **功能特性**：Fetch 支持响应流、更灵活的中止方案，解析数据更便捷；XHR 原生支持进度监听，兼容性更好。
- **使用场景**：老项目维护、需要兼容低版本浏览器、需要精准监听上传 / 下载进度时，可使用 XHR；新项目开发、追求简洁优雅的代码、需要处理流式数据时，优先使用 Fetch（或基于 Fetch 封装的库，如 Axios）。

### 补充小贴士

虽然 Fetch 很强大，但它也有一些小短板（如原生不支持进度监听、需要手动处理 HTTP 错误），因此实际开发中，很多人会选择基于 Fetch 或 XHR 封装的第三方库（如 Axios），它兼具了两者的优点，还提供了拦截器、请求取消、自动转换 JSON 等便捷功能，是项目开发的首选。

---

## 2. 说一下 CSS 中实现水平垂直居中的几种方式，并说明在 AI 对话框布局中哪种更推荐？

### 答案要点

- **Flex 布局**：`display: flex; justify-content: center; align-items: center;`；是目前最通用且兼容性良好的方案。
- **Grid 布局**：`display: grid; place-items: center;`；代码最简洁，适合复杂的网格布局。
- **绝对定位**：`top: 50%; left: 50%; transform: translate(-50%, -50%);`；适用于已知宽高或需要脱离文档流的场景。

### 推荐场景

在 AI 对话框中推荐 Flex，因为它能更好地处理动态内容高度和气泡自适应。

### 常见坑

- 使用 transform 居中时，可能会导致内部文字模糊。
- 忽略了 Flex 容器下子元素的 `min-width: 0` 属性导致的布局溢出。

### 追问

- Flex-basis 和 width 同时存在时，哪个优先级更高？
- 如何实现一个左侧固定宽度、右侧自适应的 AI 聊天输入框？

---

## 3. 什么是闭包？在开发 AI 相关的 Hooks 或工具函数时，闭包通常用来做什么？

### 难度
⭐⭐⭐

### 考点
JS 核心原理

### 答案要点

闭包是指一个函数可以记住并访问其词法作用域，即使该函数在当前词法作用域之外执行。

- **私有变量**：利用闭包封装 AI 模型的配置参数（如 API Key、Temperature），防止外部直接修改。
- **状态持久化**：在函数式组件中，闭包配合 useRef 或 useState 保持对话上下文（Context）的引用。
- **柯里化**：创建特定配置的 AI 请求函数，例如预设了 System Prompt 的专用对话函数。
- **内存管理**：注意闭包引用的变量不会被垃圾回收，需手动置空不再使用的上下文。

### 常见坑

- 在循环中创建闭包导致变量引用错误（虽然 let 已解决大部分问题）。
- 闭包导致的内存泄漏，尤其是在频繁创建对话实例时。

### 追问

- React 的 useEffect 依赖项缺失为什么会导致闭包陷阱？
- 如何利用闭包实现一个带缓存功能的 AI Prompt 模板函数？

---

## 4. 请手写一个基础的防抖（Debounce）函数，并解释它在 AI 搜索建议场景下的作用。


AI Agent 和前端、服务端的交互协议或格式
### 1、传输：
- 采用 SSE 或 WebSocket
- **尽量对齐 AG-UI 事件模型**（即使一开始不全实现 16 种事件）
	- ![[Pasted image 20260204132603.png]]
### **事件格式建议**
 - 至少支持：
    - `RunStarted` / `RunFinished` / `RunError`
    - `TextMessageStart` / `TextMessageContent` / `TextMessageEnd`
    - `ToolCallStart` / `ToolCallResult`
    - `StateDelta`（可选，用于复杂 UI 状态）
```
 // SSE / WebSocket 消息 data:
{
  "type": "TextMessageContent",
  "payload": {
    "messageId": "msg-001",
    "role": "assistant",
    "delta": "你好，我是你的旅行助手。"
  }
}
```
前端只需根据 `type` 做 `switch` 分发即可。
如果你考虑与外部 Agent 平台集成（Anthropic/OpenAI 等），则直接：
    
    - 封装为 **MCP Server**，让 Agent 通过 MCP 调用你的服务