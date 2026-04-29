# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在本仓库中工作时提供指导。

## 项目概述

**huying** 是一款基于 **uni-app + Vue 3 + uView Plus + Pinia** 的跨平台移动应用，目标平台包括 H5、iOS、Android 和微信小程序。全局导航栏标题为"时代呼应"。工作目录是 `huying/`（非仓库根目录）。

应用采用 5 个 Tab 布局：今日事（任务管理）、微逛（社交浏览）、订阅（订阅管理）、发布（内容发布）、我的（个人中心/设置）。

## 开发环境

本项目使用 **HBuilderX** 作为主要 IDE 和构建工具，没有定义 npm scripts，所有构建、开发服务器和平台编译均通过 HBuilderX 的 UI 或 CLI 完成。

- 应用源码位于 `huying/`（非仓库根目录）
- API 设计参考文档位于 `apiDosc/`（登录、注册、忘记密码流程的 UI 原型图）

## 架构

### 状态管理 — Pinia

Pinia store 位于 `store/`，使用 `pinia-plugin-persistedstate` 插件，以 `uni.getStorageSync`/`setStorageSync` 作为存储适配器（兼容三端）。

- `store/modules/user.js` — 管理 token、userInfo、isLoggedIn、permissions。配置了 `persist` 进行选择性持久化。处理登录/登出/恢复登录态。
- `store/modules/app.js` — 管理 systemInfo、navBarHeight。
- `store/modules/subscribe.js` — 管理订阅列表状态。

Store 在 `main.js` 中通过 `app.use(pinia)` 注册。应用启动时（`App.vue onLaunch`），初始化系统信息并从存储恢复登录态。

### API 层

所有 API 调用通过 `api/request.js` 发起，该文件创建了三个请求实例：

| 实例 | 前缀 | 成功判断字段 | 用途 |
|------|------|-------------|------|
| `cpi` | `/cpi/` | `status_code: 200` | 业务接口 |
| `bpi` | `/bpi/` | `status: 200` | 系统接口（认证、用户、任务） |
| `wpi` | `/wpi/` | `status_code: 200` | 数字人接口 |

请求层核心特性：
- 自动将 `auth.js` 中的 token 附加到每次请求
- 对相同的进行中请求进行去重
- 认证错误时自动刷新 token：用存储的凭证重新登录，然后重试原请求一次
- 请求参数中 `_silent: true` 可抑制 loading 弹窗
- `_no_disturb: true` 可抑制认证错误时的页面跳转（用于后台请求）
- `postPage()` 方法自动填充分页默认值（`kw`、`page: 1`、`size: 20`）
- `upload()` 处理文件上传（通过 `files` 数组），无文件时退化为普通 POST

API 模块位于 `api/modules/`，通过 `api/index.js` 统一导出为 `userApi`、`taskApi`、`socialApi`、`subscribeApi`、`publishApi`、`commonApi`。

### 认证系统

`common/js/utils/auth.js` 通过 `uni.storage` 管理 token、登录凭证和用户名。发生认证错误时，`request.js` 会尝试用保存的凭证（用户名/密码 或 手机号/验证码）自动重新登录，然后重试失败的请求。

`common/js/utils/page.js` 处理带权限校验的导航跳转 — `PUBLIC_PAGES`（登录页、微逛详情/搜索）无需登录；其他页面未登录时跳转到登录页。`gotoPage()` 自动识别 tab 页和普通页。

### 关键配置文件（均位于 `huying/`）

- `pages.json` — 页面路由、导航栏配置、tabBar 配置及 easycom 规则。新增页面需在此注册。
- `manifest.json` — 应用 ID（`__UNI__4A40F02`）、平台配置、Android 权限、Vue 版本（3）。
- `uni.scss` — 全局 SCSS 变量，由 uni-app 自动导入。底部为自定义主题变量（`$primary-color`、`$bg-color`、`$spacing-*` 等）。**不要在此文件添加 `@import`** — uView 主题在文件末尾导入。
- `main.js` — 应用入口，注册 Pinia 和 uView Plus。使用条件编译（`#ifdef VUE3`）适配 Vue 3 模式。
- `App.vue` — 根组件，导入 uView Plus 样式和 `common/css/base.css`。

### UI 框架

uView Plus 3.x（`uni_modules/uview-plus/`）— 通过 `pages.json` 中的 easycom 配置自动扫描。在模板中直接使用 `u-` 或 `up-` 前缀组件，无需手动导入。

### 共享组件

`components/PageEmpty.vue` 和 `components/PageLoading.vue` — 页面级共享组件。`PageEmpty` 使用 `<script setup>` 风格。

### 工具函数

`common/js/utils/common.js` — 日期格式化（`dateUtils`）、GUID 生成、手机号校验/脱敏、剪贴板、坐标格式化。
`common/js/constants.js` — `MAX_IMAGE_SIZE`（3MB）、`PAGE_SIZE`（20）、`REQUEST_TIMEOUT`（15秒）。

## 新增页面

1. 创建 `huying/pages/<模块>/<页面名>.vue`
2. 在 `pages.json` 的 `"pages"` 数组中注册路径
3. 如果是 Tab 页，在 `pages.json` 的 `"tabBar"` 中添加配置，图标放在 `static/icon/`
4. 导航跳转使用 `page.gotoPage(path)` — 会自动处理权限校验和 Tab 页检测

## 组件规范

- 文件命名：页面用 kebab-case（如 `forgot-password.vue`），共享组件用 PascalCase（如 `PageEmpty.vue`）
- 所有 Vue 文件使用 `<script setup>` Composition API 风格
- Vue 文件块顺序：`<template>` → `<script setup>` → `<style lang="scss" scoped>`
- Props 用 `defineProps()` 定义，带 type/default；Emits 用 `defineEmits()` 定义
- 组件内响应式变量用 `ref()` / `reactive()`，命名语义化（`loading`、`list`、`formData`）
- 组件按功能分目录：`components/`（全局共享）、`pages/模块/components/`（页面私有）
- uView Plus 组件直接用 `<u-xxx>` / `<up-xxx>`，遵循 easycom 模式，无需手动导入

## 样式规范

- 所有样式使用 `<style lang="scss" scoped>`，避免全局污染
- 尺寸单位统一用 `rpx`（跨平台响应式）
- 类名使用 BEM 风格：`.block__element--modifier`（如 `.card__title--active`）
- 页面根容器统一用 `.page` 类名
- 颜色、间距、圆角等使用 `uni.scss` 中定义的变量（`$primary-color`、`$spacing-sm` 等），禁止硬编码
- 自定义全局样式放在 `common/css/`，通过 `@import` 引入

## 代码规范

- JS 变量/函数用 camelCase，全局常量用 UPPER_SNAKE_CASE（如 `MAX_IMAGE_SIZE`、`PAGE_SIZE`）
- API 模块按功能域拆分（`user.js`、`task.js`），命名导出，函数名用动词开头（如 `getUserInfo`、`createTask`）
- Store 用 Pinia Options API 模式（`defineStore`），命名格式为 `use模块Store`（如 `useUserStore`）
- 异步操作用 `async/await`，避免 `.then()` 链
- 工具函数按职责分组到 `common/js/utils/`，使用命名导出
- 路径别名用 `@/`（如 `@/api/`、`@/store/`、`@/common/`）
- 使用条件编译指令（`#ifdef` / `#ifndef`）处理平台差异代码
- 注释使用中文，与项目文档保持一致
- 编写代码时必须添加注释：函数/方法需添加 `/** */` 文档注释说明用途，变量和常量声明时添加注释说明含义和用途，关键业务逻辑和复杂算法处添加行内注释说明意图

## 目录结构规范

```
huying/
├── api/modules/       # 按功能域拆分的 API 模块
├── common/
│   ├── css/           # 全局样式、reset、工具类
│   └── js/
│       ├── constants.js   # 全局常量
│       └── utils/         # 工具函数（auth、page、common）
├── components/        # 全局共享组件（PascalCase）
├── pages/             # 页面（kebab-case），私有组件放 pages/模块/components/
└── store/modules/     # Pinia store 模块
```
