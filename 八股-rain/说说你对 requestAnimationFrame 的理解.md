1、是什么
- 浏览器提供的动画 API，回调在下一帧渲染前执行，跟随屏幕刷新率。
2、解决了什么问题（对比 setTimeout）
    **时间不精确、丢帧、卡顿、页面隐藏时白白占用 CPU 等。
- setTimeout/setInterval：只是「在某个时间后把回调丢进事件队列排队」，执行时间受主线程忙不忙影响，不保证准时。
- requestAnimationFrame：由浏览器在每一帧渲染前统一调度，天然和渲染节奏对齐。
- **节能与性能**
	- 页面**不可见/标签页切到后台**时，`requestAnimationFrame` 通常会**暂停调用**回调，省 CPU / GPU / 电量。
	- `setTimeout` 不会自动暂停，只要计时到了就往队列里塞任务，容易浪费资源。
	**不卡顿、不丢帧**
	- setTimeout 的时间不精确，主线程一忙，回调可能堆在一起执行，导致多次 DOM 更新挤在同一帧甚至错帧 → 卡顿、丢帧。
	- requestAnimationFrame 会帮我们合并一帧内的多次 DOM 更新，在一次重绘或回流里搞定，更平滑。
3、为什么性能更好
- 和刷新率同步
- 自动暂停不可见页面
- 把同一帧 DOM 操作合并，减少重排重绘
4、典型用法 + 一小段伪代码
- 递归调用实现动画、使用 `timestamp` 计算进度
```
- <!doctype html>

<html lang="en">

<head>

<meta charset="UTF-8" />

<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<title>Document</title>

</head>

<body>

<div class="box" id="box"></div>

<style>

.box {

width: 50px;

height: 50px;

background-color: red;

}

</style>

<script>

let start = null;

  

function step(timestamp) {

console.log("Timestamp:", timestamp);

// 第一次调用时记录起始时间

if (start === null) start = timestamp;

  

const elapsed = timestamp - start; // 已经过去的时间（ms）

  

// 根据时间计算位置，这里是匀速，从 0 移动到 200px，持续 2 秒

const distance = Math.min(0.1 * elapsed, 200);

const box = document.getElementById("box");

box.style.transform = `translateX(${distance}px)`;

  

if (elapsed < 2000) {

// 动画未结束，继续下一帧

requestAnimationFrame(step);

}

}

// 启动动画

requestAnimationFrame(step);

</script>

</body>

</html>
```
- 或说一个你在项目里用它优化滚动/动画性能的真实例子
- 我可以举一个我在电商项目里用 `requestAnimationFrame` 优化滚动性能的真实例子。

**项目背景：​**  
之前在做一个电商活动页（类似双11大促），首页有上千个商品卡片，瀑布流布局，还有图片懒加载、吸顶导航这类滚动相关的效果。  
刚开始的实现是直接在 `scroll` 事件里做一堆计算和 DOM 更新，包括：

- 根据 `scrollTop` 计算哪些卡片需要高亮 / 显示动画
- 处理吸顶导航的样式切换
- 触发懒加载逻辑等

结果是：滚动的时候 `scroll` 事件一秒触发几十上百次，主线程压力很大，FPS 经常掉到 30 多，肉眼能看到卡顿，尤其在中低端机上体验很差。
### 我怎么用 requestAnimationFrame 优化的

我做了两层优化：

#### 1. 用 requestAnimationFrame 对滚动做「节流」

核心思路是：  
**滚动事件只负责记录最新的滚动位置，真正的 DOM 更新放到 `requestAnimationFrame` 里，一帧只更新一次。​**

代码大致是这样的：

js复制

`let lastScrollY = 0; let ticking = false; function onScroll() { // 只存数据，不做重逻辑 lastScrollY = window.scrollY; if (!ticking) { window.requestAnimationFrame(() => { // 在这里做所有跟滚动相关的 DOM 更新 updateByScroll(lastScrollY); ticking = false; }); ticking = true; } } function updateByScroll(scrollY) { // 例如：更新吸顶导航 / 回到顶部按钮显隐等 updateStickyHeader(scrollY); updateBackToTop(scrollY); // 其他轻量的样式更新…… } window.addEventListener('scroll', onScroll, { passive: true });`

这样有几个好处：

- 再快的滚动，一帧最多只执行一次 `updateByScroll`
- DOM 更新和浏览器重绘是在同一个节奏里，减少抖动和丢帧
- 页面切到后台时 `requestAnimationFrame` 会自动暂停，白给一波省电和省 CPU

#### 2. 对滚动动画 / 无限滚动用 rAF 做平滑过渡

我们还有一个「滚动播报/榜单」的小组件，是一个**垂直无限滚动的列表**（类似右下角不断往上滚的成交榜单）。  
一开始用 `setInterval` 去每 16ms 改一次 `top`，在某些设备上会出现忽快忽慢、滚动不均匀的问题。

后来我改成用 `requestAnimationFrame` 做逐帧位移，大致逻辑是：

- 用一个变量 `y` 记录当前偏移量，每帧累加一点
- 当偏移量刚好滚完一条的高度时，把数组第一个元素移到最后，`top` 归零，继续下一轮
- 滚动速度通过「每帧 `y` 增加多少」来控制

简化版伪代码：

```
let rafId;
let y = 0; // 当前偏移

function loop() {
  rafId = requestAnimationFrame(loop);

  y += 1; // 调整这个值可以控制滚动速度
  listEl.style.top = `${-y}px`;

  // 假设一条的高度是 40px
  if (y !== 0 && y % 40 === 0) {
    cancelAnimationFrame(rafId);

    // 把第一个元素移到最后，模拟无限滚动
    data.push(data[0]);
    data.shift();

    // 视图归位
    listEl.style.top = '0px';
    y = 0;

    // 继续下一轮
    rafId = requestAnimationFrame(loop);
  }
}

// 组件挂载后启动
rafId = requestAnimationFrame(loop);
```

实际效果是：

- 滚动非常平滑，不会像 `setInterval` 那样因为时间不准导致有时一顿一顿的
- 在标签页不活跃时，动画自动暂停，CPU 占用明显下降

---

### 优化前后效果

我们当时用性能面板和 FPS 监控做了对比：

- 滚动相关的 JS 执行时间明显下降，**平均 FPS 从 30 多提升到接近 60**
- 高峰时主线程占用从七十多％降到了三十多％
- 在一些中低端安卓机上，用户反馈从「明显卡顿」变成「感觉顺滑很多」

---

### 总结（可以作为收尾）

我自己的经验是，涉及滚动和动画的场景里：

- **高频事件（`scroll`、`resize` 等）基本都会用 `requestAnimationFrame` 做一层节流**
- **持续动画（例如轮播、榜单滚动、视差效果）优先用 rAF 做时间驱动**

这样既能跟浏览器渲染节奏对齐，又能避免不必要的计算和重绘，对滚动/动画性能提升非常明显。
- 用 requestAnimationFrame 实现一个类似 setInterval 的计时器？
5、1. 进阶一点
    宏任务，不是微任务
     兼容性现在基本没问题，老浏览器可用 polyfill