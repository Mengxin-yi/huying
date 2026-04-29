# 个人资料页面设计文档

## 概述

重新设计「我的」模块中的个人资料页面（`pages/prefer/profile.vue`），基于 `huying_board` 现有实现进行重构，美化整体页面并优化布局。采用简洁卡片式风格，所有编辑操作在页面内完成。

## 设计决策

| 决策项 | 选择 | 理由 |
|--------|------|------|
| 布局方案 | 头像卡片 + 分组列表 | 简洁清晰，信息层级分明 |
| 信息分组 | 三个卡片（个人信息/联系与账号/会员信息） | 每卡片职责单一，按功能划分 |
| 编辑方式 | 页面内编辑（查看/编辑模式切换） | 减少页面跳转，操作更便捷 |
| 配色风格 | 蓝色主题 `$primary-color` | 沿用项目现有风格 |

## 页面结构

### 文件

只需一个文件：`huying/pages/prefer/profile.vue`

### 页面布局（从上到下）

1. **导航栏**：标题「个人资料」，右侧「编辑/取消」按钮
2. **头像卡片**：居中圆形头像（128rpx），下方姓名、@用户名、用户类型标签、VIP 徽章
3. **卡片 — 个人信息**：昵称、性别、简介、城市
4. **卡片 — 联系与账号**：邮箱、用户名（只读）
5. **卡片 — 会员信息**：积分（只读）、等级（只读）
6. **保存按钮**（仅编辑模式显示，固定在视口底部）

### 页面两种状态

**查看模式（默认）**：
- 所有信息只读展示
- 导航栏右侧显示「编辑」文字按钮（`$primary-color`）
- 可编辑字段右侧显示 `›` 箭头（纯视觉提示，不跳转）

**编辑模式**：
- 导航栏右侧变为「取消」按钮（点击放弃修改，恢复原始数据，回到查看模式）
- 可编辑字段变为输入框或可点击状态
- 底部固定出现「保存」按钮

### 未登录状态处理

- 页面 `onShow` 时检查 `userStore.isLoggedIn`
- 未登录时显示 `PageEmpty` 组件，提示「请先登录」，提供跳转登录页按钮

## 字段详情

### 头像卡片区域

| 字段 | API 字段 | 编辑方式 | 备注 |
|------|---------|---------|------|
| 头像 | `avatar_img` | 点击弹 ActionSheet（拍照/从相册选择） | 编辑模式才能点击 |
| 姓名 | `surname` | 行内输入框 | 编辑模式可编辑 |
| 用户类型 | `user_type` | 只读 | 显示为标签（个人用户/单位用户） |
| VIP 状态 | 来自 `useUserStore().vipInfo` | 只读 | 金色渐变徽章，非 VIP 不显示 |

### 卡片 — 个人信息

| 字段 | API 字段 | 编辑方式 | 备注 |
|------|---------|---------|------|
| 昵称 | `nickname` | 行内输入框 | |
| 性别 | `gender` | 点击弹 ActionSheet（男/女/保密） | |
| 简介 | `intro` | 行内输入框 | 支持多行，最多 200 字 |
| 城市 | `province` + `city` | 点击弹城市选择器 | 编辑模式可点击 |

### 卡片 — 联系与账号

| 字段 | API 字段 | 编辑方式 | 备注 |
|------|---------|---------|------|
| 邮箱 | `email` | 行内输入框 | 编辑模式可编辑 |
| 用户名 | `username` | 不可编辑 | `$text-color-weak` 灰色文字 |

### 卡片 — 会员信息

| 字段 | API 字段 | 编辑方式 | 备注 |
|------|---------|---------|------|
| 积分 | `user_score` | 不可编辑 | `$primary-color` 蓝色高亮数字 |
| 等级 | `user_level` | 不可编辑 | 等级标签来自 store `vipInfo.current_vip_label` 或 profile 返回字段 |

> **注意**：`user_score` 和 `user_level` 字段名以 API 实际返回为准。`vipInfo` 中的 `current_vip_label` 可作为等级回退数据源。

## 数据流

### 数据获取

- 页面 `onShow` 时调用 `userApi.getProfile()` 获取最新用户资料
- 同时从 `useUserStore()` 读取 `userInfo`（本地缓存）和 `vipInfo`（会员信息）
- 加载中显示 `PageLoading` 组件

### 页面响应式数据

```js
const profile = ref({})     // 用户资料对象（来自 getProfile API）
const loading = ref(true)   // 加载状态
const isEditing = ref(false) // 是否处于编辑模式
const tempAvatar = ref('')  // 编辑模式中暂存的新头像路径（有变更时非空）
```

### 保存流程

1. 用户点击「保存」按钮
2. 前端校验必填项（昵称不能为空）
3. 构造参数对象：
   ```js
   {
     nickname: '...',
     surname: '...',
     gender: '...',
     intro: '...',
     province: '...',
     city: '...',
     email: '...',
     // 头像有变更时附加：
     img: 1,
     files: [{ name: 'file', uri: tempAvatar }]
   }
   ```
4. 调用 `userApi.editProfile(data)`
5. 成功后调用 `userStore.updateUserInfo()` 更新本地状态
6. 显示成功提示，切回查看模式
7. 失败显示错误提示，保持编辑模式

### 头像上传流程

1. 编辑模式下点击头像 → `uni.showActionSheet`（拍照/从相册选择）
2. `uni.chooseImage` 获取临时图片路径
3. 检查图片大小不超过 `MAX_IMAGE_SIZE`（3MB，来自 `common/js/constants.js`）
4. 超过大小提示用户压缩或重选
5. 将临时路径存入 `tempAvatar`，预览新头像
6. 保存时在 `editProfile` 参数中附带 `files: [{name:'file', uri: tempAvatar}]`

## 样式规范

- 页面背景：`$bg-color`
- 卡片：`$card-bg` 白色背景，圆角 `$card-radius`，`box-shadow: $shadow-light`
- 卡片间距：`$spacing-md`，左右 padding `$spacing-md`
- 每行高度：100rpx，左右 padding `$spacing-lg`
- 可编辑行右侧：`$uni-text-color-disable` 箭头 `›`（查看模式）
- 只读值文字：`$text-color-weak`
- 可编辑值文字：`$text-color`
- VIP 徽章：`$vip-color-start` → `$vip-color-end` 渐变
- 保存按钮：固定定位在视口底部，左右 padding `$spacing-md`，高度 88rpx
- 尺寸单位统一使用 `rpx`
- 样式使用 `<style lang="scss" scoped>`

## 组件规范

- 使用 `<script setup>` Composition API
- 导入：`useUserStore`、`userApi`、`MAX_IMAGE_SIZE`
- 页面根容器使用 `.page` 类名
- 颜色和间距使用 `uni.scss` 中定义的变量，禁止硬编码
- 注释使用中文

## pages.json 配置

在 `pages.json` 的 `pages` 数组中注册：

```json
{
  "path": "pages/prefer/profile",
  "style": {
    "navigationBarTitleText": "个人资料",
    "app-plus": {
      "titleNView": {
        "buttons": [
          {
            "text": "编辑",
            "fontSize": "14px",
            "color": "#007AFF",
            "width": "40px"
          }
        ]
      }
    }
  }
}
```

导航栏右侧按钮通过 `onNavigationBarButtonTap` 生命周期监听点击，切换编辑/查看模式。H5 端使用页面内自定义顶部按钮作为兼容方案。

## 交互细节

### 性别选择

点击性别行 → 底部弹出 `uni.showActionSheet`，选项：男、女、保密。选择后立即更新表单值。

### 城市选择

点击城市行 → 使用 uni-app 内置 `<picker mode="region">` 组件，原生支持省市选择。选择后显示「省份 + 城市」格式。

### 简介编辑

简介输入框支持多行输入，最大长度 200 字，右下角显示字数统计（如 `45/200`）。

### 导航栏按钮

- 查看模式：右侧显示「编辑」（`$primary-color` 蓝色文字）
- 编辑模式：右侧显示「取消」（点击放弃编辑，恢复原始数据，回到查看模式）
