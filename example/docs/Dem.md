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