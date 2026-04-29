# API 接口文档

## 一、请求架构

### 1.1 API 端点

| 端点前缀 | 用途 | 响应格式 |
|---------|------|---------|
| `/bpi/` | 系统接口（用户、认证） | `{ status: 200, ... }` |
| `/cpi/` | 业务接口（内容、订阅） | `{ status_code: 200, ... }` |
| `/wpi/` | 数字人接口 | - |

### 1.2 请求头

所有请求自动携带：
```
app-name: huying
token: <用户token>
```

### 1.3 Token 管理

- Token 存储在 localStorage
- 401/403 自动重试登录
- 登录凭证缓存用于自动重试

---

## 二、用户认证 API

### 2.1 登录

**接口：** `login`
**方法：** POST
**端点：** `/bpi/`

**请求参数：**
```json
{
  "username": "用户名",
  "password": "密码"
}
```

**响应：**
```json
{
  "status": 200,
  "token": "jwt_token",
  "message": "登录成功"
}
```

### 2.2 手机号登录

**接口：** `tel_login`

**请求参数：**
```json
{
  "tel": "手机号",
  "code": "验证码"
}
```

### 2.3 注册

**接口：** `register`

**请求参数：**
```json
{
  "username": "用户名",
  "password": "密码",
  "tel": "手机号",
  "code": "验证码"
}
```

### 2.4 登出

**接口：** `logout`
**方法：** POST

### 2.5 获取用户信息

**接口：** `user_info_editor_get`

### 2.6 编辑用户信息

**接口：** `user_info_editor`
**类型：** 上传接口

### 2.7 修改密码

**接口：** `user_reset_pw`

**请求参数：**
```json
{
  "old_password": "旧密码",
  "new_password": "新密码"
}
```

### 2.8 找回密码

**接口：** `forgot_pw`

### 2.9 发送验证码

| 接口 | 用途 |
|------|------|
| `tel_code` | 通用验证码 |
| `register_tel_code` | 注册验证码 |
| `user_tel_code` | 用户验证码 |
| `user_new_tel_code` | 新手机验证码 |

### 2.10 校验接口

| 接口 | 用途 |
|------|------|
| `user_check_username` | 检查用户名 |
| `user_check_tel` | 检查手机号 |
| `user_tel_check` | 校验手机验证码 |

### 2.11 用户名/手机号修改

| 接口 | 用途 |
|------|------|
| `username_editor` | 修改用户名 |
| `user_tel_editor` | 修改手机号 |
| `user_tel_editor_get` | 获取当前手机号 |

---

## 三、事程管理 API

### 3.1 获取事程列表

**接口：** `note_list`

**请求参数：**
```json
{
  "date": "2026-03-25",
  "page": 1,
  "size": 20
}
```

### 3.2 新增事程

**接口：** `note_add`

**请求参数：**
```json
{
  "title": "事程标题",
  "content": "事程内容",
  "start_time": "2026-03-25 10:00:00",
  "end_time": "2026-03-25 11:00:00",
  "is_all_day": false,
  "remind_type": 3,
  "push_notice": false
}
```

### 3.3 获取事程详情

**接口：** `note_editor_get`

### 3.4 编辑事程

**接口：** `note_editor`

### 3.5 删除事程

**接口：** `note_del`

### 3.6 修改事程状态

**接口：** `note_state_set`

**请求参数：**
```json
{
  "id": "事程ID",
  "state": 1  // 0: 待完成, 1: 已完成
}
```

### 3.7 获取日历事程数量

**接口：** `note_num`

**响应：**
```json
{
  "status": 200,
  "items": [
    { "date": "2026-03-25", "count": 3 },
    { "date": "2026-03-26", "count": 1 }
  ]
}
```

---

## 四、微逛内容 API

### 4.1 获取内容列表

**接口：** `get_weiguang_list`

**请求参数：**
```json
{
  "page": 1,
  "size": 20,
  "type": "bid",        // 内容类型
  "time_filter": 3,     // 时间筛选
  "data_type": 10,      // 数据类型
  "source_type": 20,    // 来源类型
  "sort_name": 12,      // 排序字段
  "sort_order": "default",  // 排序方式
  "kw": "关键词"
}
```

### 4.2 获取内容详情

**接口：** `get_note_data_detail`

### 4.3 获取补充信息

**接口：** `get_data_detail`

### 4.4 点赞

**接口：** `set_like_num`

**请求参数：**
```json
{
  "id": "内容ID",
  "type": "like"  // like: 点赞, unlike: 取消
}
```

### 4.5 获取评论列表

**接口：** `get_commnet_detail`

### 4.6 发表评论

**接口：** `set_comment_msg`

**请求参数：**
```json
{
  "id": "内容ID",
  "content": "评论内容",
  "reply_to": "回复对象ID"  // 可选
}
```

### 4.7 获取相关内容

**接口：** `change_similar`

### 4.8 增加阅读量

**接口：** `set_read_num`

### 4.9 增加分享点击

**接口：** `set_share_click_num`

### 4.10 频道管理

| 接口 | 用途 |
|------|------|
| `get_columns` | 获取频道列表 |
| `save_columns` | 保存频道设置 |

---

## 五、订阅 API

### 5.1 获取订阅列表

**接口：** `get_order_list`

### 5.2 获取订阅首页数据

**接口：** `get_order_data`

### 5.3 创建订阅

**接口：** `set_order`

**请求参数：**
```json
{
  "keyword": "关键词",
  "type": ["bid", "job"],
  "source": [20, 21],
  "push_time": "09:00",
  "push_notice": true
}
```

### 5.4 更新订阅

**接口：** `update_order`

### 5.5 删除订阅

**接口：** `delete_order`

### 5.6 获取推送时间列表

**接口：** `get_push_time_list`

### 5.7 获取推送数量

**接口：** `get_push_num`

---

## 六、发布 API

### 6.1 获取发布列表

**接口：** `get_publish_list`

### 6.2 获取发布详情

**接口：** `get_publish_detail`

### 6.3 创建发布

**接口：** `set_publish_data`
**类型：** 上传接口

**请求参数：**
```json
{
  "title": "标题",
  "content": "内容",
  "type": "publish",
  "address": "地址",
  "company": "公司",
  "images": ["图片1", "图片2"],
  "video": "视频链接"
}
```

### 6.4 删除发布

**接口：** `delete_publish_data`

### 6.5 获取发布数量

**接口：** `get_publish_num`

### 6.6 评论点赞

| 接口 | 用途 |
|------|------|
| `get_publish_comment_like_num` | 获取点赞数 |
| `set_publish_comment_like_num` | 设置点赞 |
| `get_publish_comment_like_data` | 获取点赞数据 |

---

## 七、会员 API

### 7.1 VIP 列表

**接口：** `vip_list`

### 7.2 用户 VIP 信息

**接口：** `user_vip_info`

### 7.3 订单列表

**接口：** `order_list`

### 7.4 我的订单

**接口：** `my_order_list`

### 7.5 我的优惠券

**接口：** `my_coupon`

### 7.6 优惠券详情

**接口：** `coupon_editor_get`

### 7.7 支付配置

**接口：** `pay_js_info`

---

## 八、认证 API

### 8.1 获取认证信息

**接口：** `user_verify_get`

### 8.2 提交认证

**接口：** `user_verify`
**类型：** 上传接口

### 8.3 取消认证

**接口：** `user_cancel_verify`

---

## 九、名片 API

### 9.1 获取名片

**接口：** `card_get`

### 9.2 编辑名片

**接口：** `card_editor`
**类型：** 上传接口

---

## 十、学历/技能 API

| 接口 | 用途 |
|------|------|
| `my_edu_list` | 学历列表 |
| `my_skill_list` | 技能列表 |
| `edu_del` | 删除学历 |
| `skill_del` | 删除技能 |

---

## 十一、微信 API

| 接口 | 用途 |
|------|------|
| `wx_config` | 获取微信配置 |
| `wx_unbind` | 解绑微信 |
| `bind_qrcode` | 获取绑定二维码 |

---

## 十二、推送设置 API

| 接口 | 用途 |
|------|------|
| `news_set_get` | 获取推送状态 |
| `news_set` | 设置推送状态 |

---

## 十三、数字人 API

| 接口 | 端点 | 用途 |
|------|------|------|
| `new/index_media` | /wpi/ | 每日报告 |
| `transcribe` | /wpi/ | 语音转文字 |
| `tts` | /wpi/ | 文字转语音 |

---

## 十四、其他 API

| 接口 | 用途 |
|------|------|
| `set_feedback` | 提交反馈 |
| `word_check` | 敏感词检测 |
| `get_app_info_list` | 应用信息列表 |
| `get_long_lat` | 获取经纬度 |
| `ad_msg_list` | 广告列表 |
| `ad_msg_editor_get` | 广告详情 |
| `ad_msg_read_num_add` | 广告阅读数 |
| `ad_msg_share_num_add` | 广告分享数 |
| `set_source_data` | 设置来源数据 |
| `user_default_avatar_list` | 默认头像列表 |
