# vue-docgen-component

一个基于 vue-docgen-api 的小型组件库项目的简易文档生成工具。与 Vue Styleguisist 的 vue-docgen-cli 相比，更简单，不用去记那么多配置。并且可以搭配自己原先的 vitepress/vuepress 文档项目使用，只用当前插件获取 Props，Events等配置数据，组件文档编写更加自由。

## 特性

- 🚀 简单易用，零配置即可开始
- 📦 支持与 VitePress/VuePress 集成
- 🔍 自动解析 Vue 组件的 Props、Events、Methods 和 Slots
- 🎨 保持原有文档结构，只更新自动生成部分
- ⚡️ 支持扁平化或保持原目录结构的输出

## 环境要求

- Node.js >= 18.0.0

## 安装
```bash
npm install vue-docgen-component
```

## 使用

在项目根目录下创建配置文件 `vue-doc.json`（可选）。不创建则使用默认配置：

```json
{
  "include": [
    "components/**/*.vue"  // 需要生成文档的 Vue 文件匹配模式，支持 glob 匹配模式
  ],
  "exclude": [
    "**/node_modules/" // 需要排除的目录或文件匹配模式
  ],
  "inputDir": "components", // 组件源码目录
  "outputDir": "docs",      // 文档输出目录
  "options": {
    "flat": false,          // 是否使用扁平化输出结构
    "indexUseDirName": false // 是否使用目录名称作为index索引文件名称
  }
}
```

运行命令生成文档：

```bash
vue-docgen-component
```

## 配置说明

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|---------|------|
| include | string[] | [] | 需要包含的文件匹配模式，支持 glob 语法 |
| exclude | string[] | [] | 需要排除的文件匹配模式，支持 glob 语法 |
| inputDir | string | "components" | 输入目录路径 |
| outputDir | string | "docs" | 输出目录路径 |
| options.flat | boolean | false | 是否使用扁平化输出结构。为 true 时所有文档都会输出到 outputDir 根目录，为 false 时会保持原有的目录结构 |
| options.indexUseDirName | boolean | false | 是否使用目录名称作为index索引文件名称。当组件文件名为index.vue时，如果此配置为true，则使用所在目录名作为组件名称 |


## 文档注释规范

本工具支持以下类型的文档注释：

### Props 属性
```vue
/**
 * 音乐数据
 */
musicData: {
  type: Object,
  default: () => ({}),
},

/**
 * 大小
 * @ignore 下面是可选值
 * @values small, medium, large, normal
 */
size: {
  default: 'normal',
},
```

### Events 事件
```vue
const emit = defineEmits([
  /**
   * 提交数据
   * @param {string} val 名称入参
   * @param {number} val2 名称2
   */
  'submit',
]);
```

### Expose 暴露方法
```vue
defineExpose({
  /**
   * 展示方法
   * @type {function}
   * @param {string} val 入参
   * @param {number} val2 入参2
   */
  show,
});
```

### Slots 插槽
```vue
<!-- @slot 默认插槽 -->
<slot></slot>

<!-- 
  @slot 子插槽
  @binding {object} data 数据
  @binding {string} title 标题
-->
<slot name="child" :data="data" :title="title"></slot>
```

### 最后的生成示例
```markdown
<!-- vue-docgen-start -->
## Props

| name  | type | default | values | description |
| ---- | ---- | ---- | ------ | ------ |
| musicData | object | {} |  | 音乐数据 |
| size | string | 'normal' | small, medium, large, normal | 大小 |

## Events

| name  | param | description|
| -------- | ---- | ---- |
| submit | (val: string, val2: number) | 提交数据 |
| updateName | () | 更新事件 |

## Expose

| name | type | param | description  |
| ------ | ---- | ---- | ---- |
| show | function | (val: string,  val2: number) | 展示方法 |
| title | string | () | 暴露的标题 |

## Slots

| name | param  | description|
| ---- | ---- | ---- |
| default | () | 默认插槽 |
| child | (data: object,  title: string) | 子插槽 |

<!-- vue-docgen-end -->
```

## 与现有文档集成

生成的文档会被包含在特殊标记之间：

```markdown
<!-- 其他自定义内容 -->

<!-- vue-docgen-start -->
<!-- 自动生成的文档内容 -->
<!-- vue-docgen-end -->

<!-- 其他自定义内容 -->
```

这些标记之外的内容不会被更新，你可以自由添加其他说明或示例。

## 常见问题

1. 如何在现有文档中保留自定义内容？
   - 只需将内容放在 `vue-docgen-start` 和 `vue-docgen-end` 标记之外即可

2. 支持哪些 glob 匹配模式？
   - 支持标准的 glob 语法，如 `**/*.vue`、`components/**/*.vue` 等

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 致谢

感谢 [vue-styleguidist](https://github.com/vue-styleguidist/vue-styleguidist) 提供的一系列工具方法。

## License

MIT