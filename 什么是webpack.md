重点：
1、简单解释webpack
2、解释下loader和plugin
3、生成 bundle + 注入 runtime
可以把 Webpack 理解为：**基于依赖图的“资源编译器 + 打包器”**，核心就是两件事：

1. 把你的项目看成一张依赖图（所有 JS/CSS/图片等都是“模块”）
2. 按这张依赖图，做各种转换和优化，最后生成少量可在浏览器直接运行的 bundle 文件
```
Webpack 做的第一步是：

1. **读取入口文件 `entry`**
2. 用解析器把源码转成 AST，静态分析其中的 `import` / `export`、`require()`、`import()` 等语句
3. 每发现一个依赖，就：
    - 解析出依赖模块的路径
    - 递归读取那个文件
    - 再分析其依赖……

就这样，Webpack **递归构建出一张完整的依赖图**，里面包含了“你的应用运行起来需要的每一个模块”[1]。

> 关键点：这一步解决的是“文件依赖、加载顺序、模块组织”问题——再也不用手动考虑 `<script>` 的依赖顺序。
> 
> 
>2. Loader：把各种资源变成 JS 模块

Webpack 自己只“懂 JS 模块”，但前端项目里有 TS、CSS、图片、字体、甚至 Vue/React 单文件组件，这就靠 Loader 来处理。

module: {
  rules: [
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'sass-loader']
    }
  ]
}

含义是：**当 Webpack 在依赖图里遇到 `.css` 文件时，按从右到左的顺序调用这些 loader**：

1. `sass-loader`：Sass → CSS
2. `css-loader`：把 CSS 转成一个 JS 模块（导出 style 字符串 / className 映射）
3. `style-loader`：运行时往 `<style>` 里插入样式

### 3. Plugin：在整个编译生命周期“插钩子”

Loader 解决的是“一个文件怎么变”，而很多事情是“整个构建过程的逻辑”：  
比如：

- 生成 html（`html-webpack-plugin`）
- 把 CSS 抽离成独立文件
- 压缩、Tree-shaking、代码分割
- 输出前对 assets 做最后处理

这些由 **Plugins 完成**。

Plugin 其实就是这样一个对象：
class MyPlugin {
  apply(compiler) {
    compiler.hooks.run.tap('MyPlugin', (compilation) => {
      console.log('Webpack 开始编译了')
    })
  }
}

Webpack 内部用一个“事件系统”（基于 Tapable）管理大量生命周期钩子，  
常见钩子有：`run`、`compile`、`emit`、`done` 等。

其实就是把插件实例挂到这些钩子上，让它们在合适时机介入构建流程[2]。

> 关键点：**Plugin 是全局的、跨模块的扩展机制，Loader 是局部的、针对单文件的。​**
> 
> 
> ### 4. 生成 bundle + 注入 runtime

当所有模块都被解析并经过 Loader 处理后，Webpack 会：

1. 根据依赖图把模块分组成一个或多个 chunk（支持代码分割）
2. 为每个 chunk 生成最终的 JS 文件（bundle）
3. 在 bundle 里面注入一段 **Webpack Runtime**，用来：
    - 定义 `__webpack_require__` 来加载模块
    - 管理模块缓存
    - 支持按需加载（动态 `import()`）
    - 支持 HMR（热更新）等高级功能
      
(() => {
  var __webpack_modules__ = {
    "./src/index.js": (module, exports, __webpack_require__) => {
      const foo = __webpack_require__("./src/foo.js")
      // ...
    },
    "./src/foo.js": (module, exports) => {
      module.exports = 'foo'
    }
  }

  var __webpack_cache__ = {}

  function __webpack_require__(moduleId) {
    if (__webpack_cache__[moduleId]) return __webpack_cache__[moduleId].exports
    var module = __webpack_cache__[moduleId] = { exports: {} }
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__)
    return module.exports
  }

  // 入口执行
  __webpack_require__("./src/index.js")
})()
关键点：**Webpack，把所有模块打包在一个（或少量）文件中，用 runtime 进行加载和管理。​**

```

### 在webpack之前是如何处理这些问题的
```
- **完全手动时代**： `<script>` 顺序 + 全局变量，开发体验和维护成本都很差；
- **RequireJS（AMD）时代**：通过 `define/require` 声明模块依赖，由运行时脚本加载器动态插 `<script>` 来解决依赖管理，但打包优化能力有限；
- **Browserify 时代**：用 Node 的 CommonJS 语法和 npm 生态，构建时扫描 `require()` 并打包成单一文件，解决了“浏览器端用 npm 包 + 减少请求数”，但对非 JS 资源和高级优化支持有限；
- **Grunt/Gulp 时代**：通过任务流自动化各种构建步骤（合并、压缩、编译等），但本身并不懂模块依赖，需要和 RequireJS/Browserify 等配合使用。

**Webpack 的出现本质上就是：把“模块化 + 打包 + 资源处理 + 优化 + 自动化”合成一套统一的、以依赖图为核心的构建体系，从而取代了之前需要多个工具组合才能完成的工作。​**
```
