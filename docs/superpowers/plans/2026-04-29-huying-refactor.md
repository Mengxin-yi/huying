# HuYing 深度重构实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 huying_board (FirstUI) 全部业务逻辑迁移至 huying (uview-plus)，UI 全部重新设计为简洁现代风格。

**Architecture:** 分层架构：Pages → Components → Hooks → Store → API → Utils。使用 Pinia 替代 vuex/localStorage 状态管理，uview-plus 替代 FirstUI。三套 API 前缀 `/cpi/`(status_code:200)、`/bpi/`(status:200)、`/wpi/` 保持不变。

**Tech Stack:** uni-app (Vue 3) + uview-plus + Pinia + pinia-plugin-persistedstate + dayjs + SCSS

**Spec:** `重构方案.md` | **Source:** `huying_board/` | **Target:** `huying/`

---

## 阶段 1：基础设施搭建

### Task 1.1: 安装依赖 & 更新配置

**Files:**
- Modify: `huying/package.json`

- [ ] **Step 1: 安装 Pinia 及持久化插件**

```bash
cd huying && npm install pinia pinia-plugin-persistedstate
```

- [ ] **Step 2: 验证依赖安装成功**

```bash
cd huying && cat package.json | grep -A5 dependencies
```

Expected: `pinia` 和 `pinia-plugin-persistedstate` 出现在 dependencies 中

- [ ] **Step 3: 添加 vite.config.js（H5 开发代理）**

Create `huying/vite.config.js`，从源项目迁移代理配置（`/bpi` → `https://ugoo.ugoolink.com`，`/cpi` 同上，`/api` → `http://voice.ugoolink.com`）

---

### Task 1.2: 更新全局 SCSS 变量

**Files:**
- Modify: `huying/uni.scss`

- [ ] **Step 1: 替换 uni.scss 内容**

按重构方案 §4.5，在现有 uni-app 变量基础上追加自定义主题变量（`$primary-color`、`$bg-color`、`$text-color`、`$card-radius`、`$spacing-*` 等）。保留底部 uview-plus theme 导入。

---

### Task 1.3: 创建工具函数层

**Files:**
- Create: `huying/common/js/utils/common.js`
- Create: `huying/common/js/utils/auth.js`
- Create: `huying/common/js/utils/page.js`
- Create: `huying/common/js/constants.js`

- [ ] **Step 1: 创建 common/js/utils/common.js**

从源项目 `common/js/utils/common.js` 迁移核心工具函数：
- `dateUtils`（formatDateTime、humanize、format、parse、addDays、addHours、convertSecondsToTime）
- `newGuid()`
- `isEmpty(str)`
- `isMobileNumber(phone)`
- `desensitizePhoneNumber(phone)`
- `formatLocation(longitude, latitude)`

注意：去除 `window/document` 依赖（copyToClipboard 改用 uni.setClipboardData），去除 qrcode import

- [ ] **Step 2: 创建 common/js/utils/auth.js**

Token 管理工具：
- `getToken()` — 从 Pinia store 或 uni.getStorageSync 读取
- `setToken(token)` — 存入 uni.setStorageSync
- `removeToken()` — 清除
- `isLoggedIn()` — 判断登录状态
- `clearLoginState()` — 清除所有登录相关缓存

- [ ] **Step 3: 创建 common/js/utils/page.js**

页面导航工具（多端兼容版，去除 window/document/H5-only 代码）：
- `gotoPage(path)` — 自动判断 switchTab/navigateTo
- `goBack()` — uni.navigateBack
- `toast(text)` — uni.showToast 封装
- `checkAuth(path)` — 登录拦截

- [ ] **Step 4: 创建 common/js/constants.js**

常量定义，从源项目迁移：
- `MAX_IMAGE_SIZE = 3 * 1024 * 1024`
- `PAGE_SIZE = 20`
- `TOKEN_KEY = 'huying_token'`

---

### Task 1.4: 创建 API 请求封装层

**Files:**
- Create: `huying/api/request.js`

- [ ] **Step 1: 创建 api/request.js**

按重构方案 §3.1 设计，创建工厂函数：

```javascript
// 核心设计：
// 1. createRequest(prefix, successKey) 工厂函数
// 2. 内部 request(method, url, data, successKey) 函数
// 3. 自动从 store 读取 token 注入 header
// 4. Token 过期 → 自动刷新 → 重试（最多 1 次）
// 5. 401/403 → 清除登录态 → reLaunch 到登录页
// 6. 统一 Loading/Toast 处理（支持 _silent 静默）
// 7. 15s 超时
// 8. header 固定带 app-name: 'huying'
// 9. 导出 cpi / bpi / wpi 三个请求实例
```

关键差异对比源项目 `request.js`：
- 源项目有 `postReqeust` / `postReqeustSys` / `wcqPostReqeust` 等多个函数 → 新项目统一为一个 `request()` 函数 + 工厂
- 源项目用 `queryWithToken()` 手动注入 → 新项目自动从 Pinia store 读取
- 源项目 `Content-Type: application/x-www-form-urlencoded` → 新项目默认 `application/json`（POST 请求）
- 新增 upload 方法封装

---

### Task 1.5: 创建 API 模块定义

**Files:**
- Create: `huying/api/modules/user.js`
- Create: `huying/api/modules/task.js`
- Create: `huying/api/modules/social.js`
- Create: `huying/api/modules/subscribe.js`
- Create: `huying/api/modules/publish.js`
- Create: `huying/api/modules/common.js`
- Create: `huying/api/index.js`

- [ ] **Step 1: 创建 api/modules/user.js**

从源项目 webapi.js 迁移用户相关接口：
- `login(data)` — POST /bpi/login
- `loginByMobile(data)` — POST /bpi/tel_login
- `register(data)` — POST /bpi/register
- `logout()` — POST /bpi/logout
- `getProfile()` — POST /bpi/user_info_editor_get
- `editProfile(data)` — POST /bpi/user_info_editor（支持 upload）
- `changePassword(data)` — POST /bpi/user_reset_pw
- `forgotPassword(data)` — POST /bpi/forgot_pw
- `getSmsCode(data)` — POST /bpi/tel_code
- `getRegisterCode(data)` — POST /bpi/register_tel_code
- `checkUsername(data)` — POST /bpi/user_check_username
- `checkTel(data)` — POST /bpi/user_check_tel
- `editUsername(data)` — POST /bpi/username_editor
- `getMobile()` — POST /bpi/user_tel_editor_get
- `changeMobile(data)` — POST /bpi/user_tel_editor
- `getNewTelCode(data)` — POST /bpi/user_new_tel_code
- `getUserCode(data)` — POST /bpi/user_tel_code
- `checkMobileBind(data)` — POST /bpi/user_tel_check
- `unbindWechat()` — POST /bpi/wx_unbind
- `getWechatBindLink()` — POST /bpi/bind_qrcode
- `getAuthDetail()` — POST /bpi/user_verify_get
- `editAuth(data)` — POST /bpi/user_verify（upload）
- `cancelVerify()` — POST /bpi/user_cancel_verify

- [ ] **Step 2: 创建 api/modules/task.js**

- `getNoteList(data)` — POST /bpi/note_list
- `getNoteDetail(data)` — POST /bpi/note_editor_get
- `addNote(data)` — POST /bpi/note_add
- `editNote(data)` — POST /bpi/note_editor
- `deleteNote(data)` — POST /bpi/note_del
- `editNoteStatus(data)` — POST /bpi/note_state_set
- `getNoteCalendar(data)` — POST /bpi/note_num
- `getPushNoticeStatus()` — POST /bpi/news_set_get
- `editPushNoticeStatus(data)` — POST /bpi/news_set

- [ ] **Step 3: 创建 api/modules/social.js**

- `getWeiguangList(data)` — POST /cpi/get_weiguang_list
- `getWeiguangDetail(data)` — POST /cpi/get_note_data_detail
- `getWeiguangSupplyment(data)` — POST /cpi/get_data_detail
- `getWeiguangCommentList(data)` — POST /cpi/get_commnet_detail
- `getWeiguangRelative(data)` — POST /cpi/change_similar
- `addWeiguangLike(data)` — POST /cpi/set_like_num
- `addWeiguangComment(data)` — POST /cpi/set_comment_msg
- `getWeiguangChannel()` — POST /cpi/get_columns
- `updateWeiguangChannel(data)` — POST /cpi/save_columns
- `updateWeiguangReadNum(data)` — POST /cpi/set_read_num
- `updateWeiguangShareClick(data)` — POST /cpi/set_share_click_num
- `getSourceData(data)` — POST /cpi/set_source_data

- [ ] **Step 4: 创建 api/modules/subscribe.js**

- `getOrderList(data)` — POST /cpi/get_order_list
- `getOrderIndex(data)` — POST /cpi/get_order_data
- `addOrder(data)` — POST /cpi/set_order
- `updateOrder(data)` — POST /cpi/update_order
- `deleteOrder(data)` — POST /cpi/delete_order
- `getCompanyList(data)` — POST /cpi/get_company_list
- `getOrderTimeList(data)` — POST /cpi/get_push_time_list

- [ ] **Step 5: 创建 api/modules/publish.js**

- `getPublishList(data)` — POST /cpi/get_publish_list
- `getPublishDetail(data)` — POST /cpi/get_publish_detail
- `addPublish(data)` — POST /cpi/set_publish_data（upload）
- `deletePublish(data)` — POST /cpi/delete_publish_data
- `getCommentLikeNum(data)` — POST /cpi/get_publish_comment_like_num
- `setCommentLikeNum(data)` — POST /cpi/set_publish_comment_like_num
- `getCommentLikeData(data)` — POST /cpi/get_publish_comment_like_data
- `getPushNum()` — POST /cpi/get_push_num
- `getPublishNum()` — POST /cpi/get_publish_num

- [ ] **Step 6: 创建 api/modules/common.js**

- `addFeedback(data)` — POST /cpi/set_feedback
- `getVipList(data)` — POST /bpi/vip_list
- `getUserVip()` — POST /bpi/user_vip_info
- `getPayConfig(data)` — POST /bpi/pay_js_info
- `getBillList(data)` — POST /bpi/order_list
- `myOrderList(data)` — POST /bpi/my_order_list
- `getWordCheck(data)` — POST /bpi/word_check
- `getAppInfoList(data)` — POST /cpi/get_app_info_list

- [ ] **Step 7: 创建 api/index.js 统一导出**

```javascript
export * as userApi from './modules/user'
export * as taskApi from './modules/task'
export * as socialApi from './modules/social'
export * as subscribeApi from './modules/subscribe'
export * as publishApi from './modules/publish'
export * as commonApi from './modules/common'
```

---

### Task 1.6: 创建 Pinia Store

**Files:**
- Create: `huying/store/index.js`
- Create: `huying/store/modules/user.js`
- Create: `huying/store/modules/app.js`
- Create: `huying/store/modules/subscribe.js`

- [ ] **Step 1: 创建 store/index.js**

按重构方案 §3.2，创建 Pinia 实例 + persistedstate 插件（使用 uni storage 适配器）

- [ ] **Step 2: 创建 store/modules/user.js**

```javascript
// State: token, userInfo, isLoggedIn, permissions, credential
// Actions: login, loginByMobile, logout, fetchProfile, updateProfile
// 持久化: token, userInfo, isLoggedIn, permissions
```

- [ ] **Step 3: 创建 store/modules/app.js**

```javascript
// State: systemInfo, navBarHeight, appVersion
// 持久化: 无（或部分）
```

- [ ] **Step 4: 创建 store/modules/subscribe.js**

```javascript
// State: subscribeList, currentSubscribe
// 持久化: 否
```

---

### Task 1.7: 创建全局公共组件

**Files:**
- Create: `huying/components/PageEmpty.vue`
- Create: `huying/components/PageLoading.vue`

- [ ] **Step 1: 创建 PageEmpty.vue**

使用 uview-plus `u-empty` 组件封装，支持 props: `text`、`icon`

- [ ] **Step 2: 创建 PageLoading.vue**

使用 uview-plus `u-loading-icon` 封装

---

### Task 1.8: 更新入口文件 & 路由配置

**Files:**
- Modify: `huying/main.js`
- Modify: `huying/App.vue`
- Modify: `huying/pages.json`
- Create: `huying/common/css/base.css`

- [ ] **Step 1: 更新 main.js**

注册 Pinia + uview-plus

- [ ] **Step 2: 更新 App.vue**

导入全局样式，去除 console.log

- [ ] **Step 3: 创建 common/css/base.css**

基础 reset 样式（page 背景色、字体、rpx 基准）

- [ ] **Step 4: 更新 pages.json**

配置所有 35 个页面路由 + 5 个 TabBar。先创建所有页面的占位文件（空模板），再配置路由。

页面路由列表（按重构方案 §3.3）：
- TabBar: index/index, weiguang/index, subscribe/index, publish/index, prefer/index
- 登录: login/index, login/register, login/forgot
- 今日事: index/detail, index/add, index/calendar
- 微逛: weiguang/detail, weiguang/search
- 订阅: subscribe/add, subscribe/detail
- 发布: publish/editor, publish/preview
- 我的: prefer/profile, prefer/vip, prefer/settings, prefer/about, prefer/feedback, prefer/company, prefer/order
- 客服: kefu/index

- [ ] **Step 5: 创建所有页面占位 .vue 文件**

为每个路由创建最小 Vue 文件（template + script setup + style scoped）

- [ ] **Step 6: 创建 TabBar 图标文件**

复制现有 static/icon/ 中的图标，确认命名与 pages.json tabBar 配置匹配

---

## 阶段 2：登录模块

### Task 2.1: 登录页

**Files:**
- Modify: `huying/pages/login/index.vue`

- [ ] **Step 1: 实现登录页 UI**

按重构方案 §5.3 布局：
- Logo/品牌图 + 应用名称
- Tab 切换（账号登录 / 验证码登录）
- 账号登录：用户名输入 + 密码输入 + 记住密码 + 忘记密码入口
- 验证码登录：手机号输入 + 验证码输入 + 获取验证码按钮
- 协议勾选 + 登录按钮 + 注册入口
- 使用 uview-plus: `u-input`, `u-button`, `u-tabs`, `u-checkbox`

- [ ] **Step 2: 实现登录逻辑**

- 调用 `userApi.login()` / `userApi.loginByMobile()`
- 成功：写入 Pinia user store → `uni.reLaunch('/pages/index/index')`
- 失败：Toast 提示
- 记住密码：`uni.setStorageSync('remembered_credential', ...)`

### Task 2.2: 注册页

**Files:**
- Modify: `huying/pages/login/register.vue`

- [ ] **Step 1: 实现注册页**

从源项目 `pages/prefer/user/signup` 迁移：用户名 + 手机号 + 验证码 + 密码 + 确认密码

### Task 2.3: 忘记密码页

**Files:**
- Modify: `huying/pages/login/forgot.vue`

- [ ] **Step 1: 实现忘记密码页**

从源项目 `pages/prefer/user/recover` 迁移：手机号 + 验证码 + 新密码 + 确认密码

---

## 阶段 3：今日事模块

### Task 3.1: 任务列表首页

**Files:**
- Modify: `huying/pages/index/index.vue`
- Create: `huying/pages/index/hooks/useTaskList.js`
- Create: `huying/pages/index/components/TaskCard.vue`
- Create: `huying/pages/index/components/WeekSelector.vue`

- [ ] **Step 1: 实现 WeekSelector 组件** — 横向日期选择器
- [ ] **Step 2: 实现 TaskCard 组件** — 卡片式任务项 + 左滑操作
- [ ] **Step 3: 实现 useTaskList hook** — 列表数据、分页、刷新逻辑
- [ ] **Step 4: 组装首页** — 统计卡片 + 日期选择 + 任务列表 + FAB 按钮

### Task 3.2: 任务详情页

**Files:**
- Modify: `huying/pages/index/detail.vue`

- [ ] **Step 1: 实现任务详情** — 从源项目 note/detail 迁移

### Task 3.3: 新增/编辑任务页

**Files:**
- Modify: `huying/pages/index/add.vue`

- [ ] **Step 1: 实现任务表单** — 从源项目 note/add 迁移

### Task 3.4: 日历视图页

**Files:**
- Modify: `huying/pages/index/calendar.vue`
- Create: `huying/components/Calendar/index.vue`

- [ ] **Step 1: 实现 Calendar 公共组件**
- [ ] **Step 2: 组装日历页面** — 月历 + 日期任务标记 + 点击筛选

---

## 阶段 4：微逛模块

### Task 4.1: 微逛首页

**Files:**
- Modify: `huying/pages/weiguang/index.vue`
- Create: `huying/pages/weiguang/hooks/useArticleList.js`
- Create: `huying/pages/weiguang/components/ArticleCard.vue`

- [ ] **Step 1: 实现 ArticleCard 组件**
- [ ] **Step 2: 实现 useArticleList hook**
- [ ] **Step 3: 组装首页** — 搜索入口 + 分类 Tab + 信息流

### Task 4.2: 微逛详情页

**Files:**
- Modify: `huying/pages/weiguang/detail.vue`

- [ ] **Step 1: 实现详情页** — 从源项目 weiguang/detail 迁移

### Task 4.3: 搜索页

**Files:**
- Modify: `huying/pages/weiguang/search.vue`

- [ ] **Step 1: 实现搜索页** — 新增页面

---

## 阶段 5：订阅模块

### Task 5.1: 订阅首页

**Files:**
- Modify: `huying/pages/subscribe/index.vue`

- [ ] **Step 1: 实现订阅列表** — 从源项目 order/index 迁移

### Task 5.2: 添加订阅页

**Files:**
- Modify: `huying/pages/subscribe/add.vue`

- [ ] **Step 1: 实现添加订阅表单** — 从源项目 order/add 迁移

### Task 5.3: 订阅详情页

**Files:**
- Modify: `huying/pages/subscribe/detail.vue`

- [ ] **Step 1: 实现订阅详情** — 从源项目 order/kuozeng 迁移（合并扩增功能）

---

## 阶段 6：发布模块

### Task 6.1: 发布首页

**Files:**
- Modify: `huying/pages/publish/index.vue`

- [ ] **Step 1: 实现发布列表** — 从源项目 publish/index 迁移

### Task 6.2: 内容编辑器

**Files:**
- Modify: `huying/pages/publish/editor.vue`

- [ ] **Step 1: 实现编辑器** — 从源项目 publish/add + add2 合并迁移

### Task 6.3: 预览页

**Files:**
- Modify: `huying/pages/publish/preview.vue`

- [ ] **Step 1: 实现预览页** — 从源项目 publish/leo-list 迁移

---

## 阶段 7：我的模块

### Task 7.1: 个人中心首页

**Files:**
- Modify: `huying/pages/prefer/index.vue`

- [ ] **Step 1: 实现个人中心** — 用户卡片 + 功能宫格 + 功能列表

### Task 7.2-7.8: 子页面

依次实现 profile.vue、vip.vue、order.vue、settings.vue、about.vue、feedback.vue、company.vue，每个从源项目对应页面迁移业务逻辑。

---

### Task 7.9: 客服模块

**Files:**
- Modify: `huying/pages/kefu/index.vue`

- [ ] **Step 1: 实现客服页** — 从源项目 kefu/index 迁移
