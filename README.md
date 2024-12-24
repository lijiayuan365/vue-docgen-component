# vue-docgen-component

[中文文档](./README-CN.md)

A simple documentation generation tool for small component libraries based on vue-docgen-api. Compared to vue-docgen-cli from Vue Styleguidist, it's simpler and requires less configuration. It can be integrated with your existing VitePress/VuePress documentation project, using this plugin only to get Props, Events, and other configuration data, making component documentation writing more flexible.

## Features

- 🚀 Simple to use, start with zero configuration
- 📦 Support integration with VitePress/VuePress
- 🔍 Automatically parse Vue component Props, Events, Methods, and Slots
- 🎨 Maintain existing documentation structure, only update auto-generated parts
- ⚡️ Support flat or original directory structure output

## Requirements

- Node.js >= 18.0.0

## Installation
```bash
npm install vue-docgen-component
```

## Usage

Create a configuration file `vue-doc.json` in the project root directory (optional). If not created, default configuration will be used:

```json
{
  "include": [
    "components/**/*.vue"  // Vue file matching patterns for documentation generation, supports glob patterns
  ],
  "exclude": [
    "**/node_modules/" // Directory or file patterns to exclude
  ],
  "inputDir": "components", // Component source directory
  "outputDir": "docs",      // Documentation output directory
  "options": {
    "flat": false,          // Whether to use flat output structure
    "indexUseDirName": false  // Whether to use directory name as index file name
  }
}
```

Run command to generate documentation:

```bash
vue-docgen-component
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| include | string[] | [] | File patterns to include, supports glob syntax |
| exclude | string[] | [] | File patterns to exclude, supports glob syntax |
| inputDir | string | "components" | Input directory path |
| outputDir | string | "docs" | Output directory path |
| options.flat | boolean | false | Whether to use flat output structure. When true, all docs will output to outputDir root, when false, maintains original directory structure |
| options.indexUseDirName | boolean | false | Whether to use the directory name as the index file name. When a component file is named index.vue, if this option is true, the directory name will be used as the component name |

## Documentation Comment Standards

This tool supports the following types of documentation comments:

### Props
```vue
/**
 * Music data
 */
musicData: {
  type: Object,
  default: () => ({}),
},

/**
 * Size
 * @ignore Below are optional values
 * @values small, medium, large, normal
 */
size: {
  default: 'normal',
},
```

### Events
```vue
const emit = defineEmits([
  /**
   * Submit data
   * @param {string} val Name parameter
   * @param {number} val2 Name2
   */
  'submit',
]);
```

### Expose Methods
```vue
defineExpose({
  /**
   * Show method
   * @type {function}
   * @param {string} val Parameter
   * @param {number} val2 Parameter2
   */
  show,
});
```

### Slots
```vue
<!-- @slot Default slot -->
<slot></slot>

<!-- 
  @slot Child slot
  @binding {object} data Data
  @binding {string} title Title
-->
<slot name="child" :data="data" :title="title"></slot>
```

### Generated Example
```markdown
<!-- vue-docgen-start -->
## Props

| name  | type | default | values | description |
| ---- | ---- | ---- | ------ | ------ |
| musicData | object | {} |  | Music data |
| size | string | 'normal' | small, medium, large, normal | Size |

## Events

| name  | param | description|
| -------- | ---- | ---- |
| submit | (val: string, val2: number) | Submit data |
| updateName | () | Update event |

## Expose

| name | type | param | description  |
| ------ | ---- | ---- | ---- |
| show | function | (val: string,  val2: number) | Show method |
| title | string | () | Exposed title |

## Slots

| name | param  | description|
| ---- | ---- | ---- |
| default | () | Default slot |
| child | (data: object,  title: string) | Child slot |

<!-- vue-docgen-end -->
```

## Integration with Existing Documentation

Generated documentation will be enclosed within special markers:

```markdown
<!-- Other custom content -->

<!-- vue-docgen-start -->
<!-- Auto-generated documentation content -->
<!-- vue-docgen-end -->

<!-- Other custom content -->
```

Content outside these markers won't be updated, you can freely add other descriptions or examples.

## FAQ

1. How to preserve custom content in existing documentation?
   - Just place the content outside the `vue-docgen-start` and `vue-docgen-end` markers

2. What glob patterns are supported?
   - Supports standard glob syntax, such as `**/*.vue`, `components/**/*.vue`, etc.

## Contributing

Issues and Pull Requests are welcome!

## Acknowledgments

Thanks to [vue-styleguidist](https://github.com/vue-styleguidist/vue-styleguidist) for providing a series of utility methods.

## License

MIT