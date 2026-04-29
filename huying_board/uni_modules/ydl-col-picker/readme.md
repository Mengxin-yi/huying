# ydl-col-picker

## 简介

`ydl-col-picker` 是一个基于 UniApp 的列选择器组件，支持单选多选及搜索功能。它可以用于各种 UniApp 项目中，提供灵活的列选择和过滤功能。

## 使用方法

在 `template` 中使用
```vue
<template>
  <view class="content">
    <button type="default" @click="openPicker()">打开col-picker组件</button>
    <ydl-col-picker
      ref="colPicker"
      :range="dataList"
      :checkValue="checkValue"
      :multiple="true"
      rangeKey="name"
      @confirm="confirmPicker"
    ></ydl-col-picker>
  </view>
</template>
```

在 `script` 中
```javascript
<script>
export default {
  data() {
    return {
      dataList: [
        {
          id: 1,
          name: "前端",
          children: [
            {
              id: 11,
              name: "Vue",
            },
            {
              id: 12,
              name: "React",
            },
          ],
        },
        {
          id: 2,
          name: "后端",
          children: [
            {
              id: 21,
              name: "Node",
            },
            {
              id: 22,
              name: "PHP",
            },
          ],
        }
      ],
      checkValue: {
        1: [12],
        3: [31, 33],
      },
    };
  },
  onLoad(options) {},
  methods: {
    openPicker() {
      this.$refs.colPicker.open();
    },
    confirmPicker(e) {
      console.log(e);
    },
  },
};
</script>
```


## 属性

| 属性名       | 类型      | 默认值 | 描述                                       |
| ------------ | --------- | ------ | ------------------------------------------ |
| range        | Array     | []     | 列数据。                     |
| checkValue   | Object    | {}     | 默认选中值。                               |
| idKey        | String    | "id"   | 指定 Object 中 key 的值作为单条数据的唯一id。|
| rangeKey     | String    | "label"| 指定 Object 中 key 的值作为选择器显示的内容。|
| multiple     | Boolean   | false  | 是否多选。                                 |
| closeOnClickMask | Boolean | true  | 是否允许点击蒙层关闭选择器。               |
| title        | String    | "标题" | 选择器的标题。                             |
| cancelBtn    | Object    | { text: "取消", color: "#666666", fontSize: "32rpx" } | 取消按钮自定义。   |
| confirmBtn   | Object    | { text: "确定", color: "#557FF7", fontSize: "32rpx" } | 确定按钮自定义。   |
| showSearch   | Boolean   | true   | 是否开启搜索。                             |
| searchPlaceholder | String | "请输入搜索内容" | 搜索框的占位文本。             |

## 方法

| 方法名   | 参数         | 描述                       |
| -------- | ------------ | -------------------------- |
| open     | -            | 打开选择器。               |
| close    | -            | 关闭选择器。               |
| reset    | -            | 重置选择器状态。           |
| init     | -            | 初始化选择器状态。         |

## 事件

| 事件名   | 参数         | 描述                       |
| -------- | ------------ | -------------------------- |
| confirm  | value: Object | 当用户点击确定按钮时触发，返回选中的值。返回值是一个对象，其中键是父级项的 `id`，值是一个数组，包含选中的子项的 `id`。例如：`{ 1: [12], 3: [31, 33] }`。 |

