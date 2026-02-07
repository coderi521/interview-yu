
一、什么是虚拟列表（Virtual List）？
虚拟列表（Virtual List / Virtual Scrolling / Windowing） 是一种“长列表渲染性能优化”技术：

在任意时刻，只渲染可视区域（视口）内的列表项 + 少量缓冲项，其他不可见的数据只用一个“占位高度”表示，不生成真实 DOM。

效果是：

不管总数据是 1,000 条、10,000 条还是 1,000,000 条：
页面上真实存在的 DOM 节点数保持在几十个左右
首屏渲染时间与“可见项数量”相关，而几乎与“总数据量”无关
滚动流畅，内存占用稳定
典型应用场景：聊天记录、商品/新闻/评论长列表、表格大数据列表、无限滚动加载等。

二、为什么需要虚拟列表？
传统列表渲染方式：直接 v-for / map 把所有数据一次性渲染为 DOM：

10 万条数据 = 10 万个 DOM 节点
问题：
首屏渲染非常慢
滚动时频繁重排重绘，掉帧、卡顿
占用大量内存
而用户在任何时刻“屏幕上真正能看到的”通常只有 10～50 条。虚拟列表就是利用这个事实：

只为看得见的那一小部分数据创建 DOM，其余数据不渲染，只用一个看不见的“占位容器”撑住滚动条。
不管是 React / Vue / 原生 JS，本质思路都一样：

滚动条 → 计算在视口中应该显示哪一段索引（startIndex, endIndex） → 截取这段数据渲染 → 用一个总高度占位元素 + 偏移量让它看起来像是完整列表在滚动。

1. 几个关键概念
   视口（Viewport / 可视区域）
   列表外层的固定高度可滚动容器，例如高度 500px 的 div，overflow-y: auto;。

可滚动区域（滚动内容总高度）
假设：

总条数：N
每项高度：itemHeight
则总高度约为 N * itemHeight
这个高度由一个“占位元素”来撑起，保证滚动条长度正确。
滚动位置（scrollTop）
视口顶部距离整个内容顶部的偏移量，用来推算当前可见的是第几条开始。

起始索引 / 结束索引

startIndex：当前视口中第一个可见列表项的索引
endIndex：当前视口中最后一个可见列表项的索引
实际渲染的数据就是 data.slice(startIndex, endIndex)。
缓冲区（上/下缓冲）
为了避免快速滚动时出现“闪一下的空白”，通常会在可视区域上下多渲染几条，称为 overscan / buffer。
固定高度虚拟列表的实现原理（最常见，也是面试高频）
假设所有列表项高度都相同，这是最简单的情况。

（1）关键公式
设：

viewportHeight：视口高度（容器高度，比如 500px）
itemHeight：每项高度（比如 50px）
scrollTop：当前滚动距离
buffer：缓冲条数（比如 2～5 条）
`
// 一屏最多能显示多少条
visibleCount = Math.ceil(viewportHeight / itemHeight)

// 当前滚动到第几条开始
startIndex = Math.floor(scrollTop / itemHeight)

// 结束索引（不含）
endIndex = startIndex + visibleCount

// 加上缓冲
startIndex = Math.max(0, startIndex - buffer)
endIndex   = Math.min(total, endIndex + buffer)

// 当前这次要渲染的数据列表
visibleData = data.slice(startIndex, endIndex)

// 内容块的垂直偏移量（让这段渲染结果“挂到正确高度”）
offset = startIndex * itemHeight
`DOM 结构思路 可以抽象成 3 层： 外层可滚动容器（固定高度，overflow: auto） └── 占位元素（phantom，占用真实总高度 N * itemHeight，通常不显示） └── 渲染容器（content，position: absolute; transform/ top 控制偏移） └── 真实渲染的若干条列表项（只有几十条）`

<div class="viewport" @scroll="handleScroll" style="height: 500px; overflow-y: auto; position: relative;">
  <!-- 占位元素：撑起滚动条，总高度 = N * itemHeight -->
  <div class="phantom" :style="{ height: totalHeight + 'px' }"></div>

<!-- 实际渲染元素：absolute 定位到 offset 处 -->

<div class="content" :style="{ transform: `translateY(${offset}px)` }">
    <div v-for="item in visibleData" :key="item.id" class="row">
      {{ item }}
    </div>
  </div>
</div>
`
其中：


`
其中：`
其中：totalHeight = N * itemHeight
offset = startIndex * itemHeight
visibleData = data.slice(startIndex, endIndex)
滚动时只更新 startIndex / endIndex / offset / visibleData 即可。
简短结论
虚拟列表是什么？
一种“按需渲染长列表”的技术，只渲染视口内的少量项，通过占位高度 + 索引计算 + DOM 复用，让超大数据列表也能保持很高的渲染与滚动性能。

实现原理概括一句话：

根据滚动位置算出“当前应该显示的数据索引区间”，只渲染这一小段数据到一个绝对定位的容器中，并用一个高度等于“所有项目总高度”的占位元素撑起滚动条，看起来就像整个长列表都在滚动，但实际上 DOM 只有几十个。

### 如何一次性渲染5000条数据

字节这边在大数据表格场景确实是用 Canvas 做的，比如他们开源的VTable 表格组件，就是基于自家的 VRender 可视化引擎，用 Canvas 来渲染当前视图里的单元格，实现虚拟滚动和百万级数据的高性能展示；这比传统DOM 虚拟列表还要激进一步，相当于是“虚拟列表+Canvas 渲染”的组合。” 如果你是在权衡技术方案，可以参考：
•一般业务长列表（如评论流、消息流）：优先用 DOM 虚拟列表（更通用、改造成本小）。
•极致性能的大数据表格/ BI 场景：可以学习VTable 的路线，考虑 Canvas 甚至WebGL 方案。






# 白屏监控方案

## 一、 白屏确认方法

采用「超时检测 + DOM 节点校验」的组合策略：

1. 预先设置合理的超时时间（需结合项目实际渲染速度配置，如 3s/5s）；
2. 超时时间到达后，检测指定根元素（如`#app`、`body`）的子节点数量；
3. 若子节点数量≤预设阈值`x`（需根据项目初始 DOM 结构标定，如 1/2），则判定为白屏并上报异常。

## 二、 白屏常见原因及对应捕获 / 定位方案

### （一） JS 错误导致的白屏

此类白屏由页面核心 JS 执行异常（未捕获报错、Promise 未捕获拒绝）引发，导致渲染流程中断。

#### 捕获方案

通过全局事件监听捕获两类核心错误：

* 捕获同步 / 普通 JS 错误：`window?.addEventListener('error', callback)`
* 捕获未处理的 Promise 拒绝错误：`window?.addEventListener('unhandledrejection', callback)`

### （二） 网络异常导致的白屏

#### 说明

移动端运行环境复杂，极端弱网条件下（如偏远地区、网络切换），资源加载 / 接口请求耗时过长，会在白屏检测节点到来时仍未完成渲染，导致 DOM 校验异常（如浏览器模拟 Slow 3G 环境下的误报）。

#### 定位方案

上报白屏异常时，需同步携带用户当前网络环境信息，用于区分真实白屏与弱网误报。

#### 捕获方案（双方案兼容，保障覆盖率）

1. 方案一：基于`Navigator.connection`（优先使用，数据更精准）
   * 可获取核心网络指标：网络往返延迟（`rtt`）、下载速度（`downlink`）；
   * 弱网判定阈值：`rtt > 800ms` 或 `downlink < 1Mbps`（基于 Slow 3G 环境模拟验证）。
2. 方案二：基于`PerformanceNavigationTiming`（兼容不支持`Navigator.connection`的浏览器）
   * 计算核心指标：首字节时间（TTFB）；
   * 弱网判定阈值：`TTFB > 1000ms`（基于 Slow 3G 环境模拟验证）。

### （三） 性能差导致的白屏

#### 说明

部分低性能设备（如老旧手机）页面渲染流程缓慢，白屏检测节点触发时，主流程尚未完成渲染（如条件渲染节点未生成、loading 状态未消失），导致 DOM 校验误报。

#### 定位方案

上报白屏异常时，同步携带项目`domReady`性能埋点的执行状态，用于区分真实白屏与性能延迟误报（若`domReady`未上报，大概率为性能差导致的误报）。

#### 捕获方案

1. 项目中正常埋点并上报`domReady`性能节点；
2. 将`domReady`的执行状态（是否触发、触发时间戳）存入全局监控链路缓存；
3. 白屏上报时，从缓存中提取该状态，随白屏异常信息一并上报。

### 总结

1. 白屏确认核心是「超时时间 + DOM 节点数量」的双重校验，阈值需结合项目实际标定。
2. 三类白屏原因对应不同捕获逻辑，其中网络和性能问题需额外携带辅助信息避免误报。
3. 网络信息捕获采用「`Navigator.connection`优先，TTFB 兜底」的兼容方案，保障覆盖更多浏览器环境。


**1、如何确认白屏**

- 设置超时时间，在设置的时间内，指定根元素的子节点数量不超过x，则认定为白屏

2、出现白屏的原因

- **js错误导致的白屏**

- 同步：window?.addEventListener('error'
- window?.addEventListener('unhandledrejection'

- 网络异常导致的白屏

- 说明：移动端环境无法统一，存在极端网络条件下，导致打开时间过长，上报白屏错误。例子：浏览器模拟slow 3G情况，资源加载就进行检测，导致监控dom元素异常。
- 定位：定位此类白屏错误需要在上报白屏的同时记录用户的网络情况信息，并上报。
- 捕获：
- Navigator.connection：使用connection我们可以查看到用户的网络延迟rtt与用户的下载速度downlink等信息，通过在浏览器模拟弱网情况（slow3g）得出数值在rtt > 800 或者 downlink < 1 的情况下满足我们的弱网标准。
- 首字节时间(ttfb): Navigator.connection在浏览器的兼容性不是特别友好，若浏览器不支持，我们可以使用PerformanceNavigationTiming中相关属性计算出用户的首字节时间，通过在浏览器模拟弱网情况（slow3g）得出数值在ttfb > 1000 的情况下满足我们的弱网标准。

- 性能差导致的白屏

说明：存在部分用户在页面加载过程中，由于性能导致在检测时数据还没渲染完。例子：在检测时还没有完成页面主流程，条件渲染节点未渲染或loading未消失。

定位：上报这类白屏时，项目的domeReady性能埋点节点，实际未进行上报，故定位此类白屏错误需要在上报白屏错误的时候，需同时记录我们此时的性能埋点上报的节点。

捕获： 在上报性能埋点的同时记录到我们的链路中，上报时一并上报。
