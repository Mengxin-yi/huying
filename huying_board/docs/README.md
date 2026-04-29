# 时代呼应 (HuYing Board) 项目文档

> 本文档整理于 2026-03-25，用于项目重构参考

## 项目概述

**时代呼应** 是一款基于 uni-app 开发的跨平台移动应用，使用 Vue 3 构建。支持 H5、微信小程序、App（iOS/Android）等多端运行。

### 技术栈

| 技术 | 说明 |
|------|------|
| uni-app | 跨平台框架 |
| Vue 3 | 前端框架 |
| FirstUI | 主要 UI 组件库 |
| uni-ui | 官方 UI 组件 |
| nvue | 原生渲染（性能优化） |

### 目录结构

```
huying_board/
├── pages/              # 页面组件
│   ├── note/           # 今日事模块
│   ├── weiguang/       # 微逛模块
│   ├── order/          # 订阅模块
│   ├── publish/        # 发布模块
│   ├── prefer/         # 我的（个人中心）
│   └── kefu/           # 客服模块
├── components/         # 公共组件
├── common/             # 公共资源
│   └── js/utils/       # 工具函数
│       ├── request.js  # 请求封装
│       ├── webapi.js   # API 接口
│       ├── common.js   # 通用工具
│       ├── constant.js # 常量定义
│       └── sysdict.js  # 数据字典
├── uni_modules/        # uni-app 插件
├── static/             # 静态资源
├── pages.json          # 页面路由配置
└── manifest.json       # 应用配置
```

## 文档索引

| 文档 | 说明 |
|------|------|
| [01-业务模块详解](./01-业务模块详解.md) | 各功能模块的业务逻辑 |
| [02-API接口文档](./02-API接口文档.md) | 所有 API 接口定义 |
| [03-数据字典](./03-数据字典.md) | 枚举值、类型定义 |
| [04-用户流程](./04-用户流程.md) | 核心业务流程图 |
| [05-技术架构](./05-技术架构.md) | 技术实现细节 |
| [06-重构建议](./06-重构建议.md) | 代码优化建议 |

## 快速开始

### 开发环境

1. 安装 HBuilderX IDE
2. 打开项目目录
3. 运行到浏览器/模拟器/设备

### 依赖安装

```bash
npm install
```

### 打包发布

使用 HBuilderX 的「发行」菜单进行打包：
- H5 版本
- 微信小程序
- App (iOS/Android)
