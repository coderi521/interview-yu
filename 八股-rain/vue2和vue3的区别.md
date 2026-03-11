1、**底层响应式的实现不同**
- Vue2：`Object.defineProperty`，对数组和属性新增/删除支持不彻底，需要用 `Vue.set / Vue.delete` 补救。
- Vue3：`Proxy`，能完整拦截读写、删除、遍历等操作，对数组、Map、Set 等原生支持更好，性能也更高。
2、**开发范式**：
    
    - Vue2：Options API（`data / methods / computed / watch / lifecycle`），一个功能的逻辑容易分散在多个配置项中。
    - Vue3：Composition API + `<script setup>`，按「功能」组织代码，更适合中大型项目，也更方便抽取成可复用的 `useXxx` 组合函数。
3、 **TypeScript 支持**：
    
    - Vue2：TS 支持偏“补救”，类型推断不够自然。
    - Vue3：源码用 TS 重写，`<script setup lang="ts">` 体验好，类型推断精准。
4、 **新特性**：
    
    - Teleport：对话框、全局弹窗等可以“传送”到任意 DOM 节点。
    - Suspense：支持异步组件加载时的占位内容。
    - Fragment：组件支持多根节点，无需外包一层 div。