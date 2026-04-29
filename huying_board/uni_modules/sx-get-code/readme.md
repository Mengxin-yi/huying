# SxGetCode 获取验证码
> **组件名：sx-get-code**

### 介绍

实现根据手机号获取验证码效果并倒计时。



### 安装方式

本组件符合[easycom](https://uniapp.dcloud.io/collocation/pages?id=easycom)规范，`HBuilderX 2.5.5`起，只需将本组件导入项目，在页面`template`中即可直接使用，无需在页面中`import`和注册`components`。

### 基本用法 

更多示例请下载示例安装查看。该组件依赖官方ui组件[uni-icons](https://ext.dcloud.net.cn/plugin?id=28)、[uni-easyinput](https://ext.dcloud.net.cn/plugin?id=3455)、[uni-load-more](https://ext.dcloud.net.cn/plugin?id=29)、[uni-countdown](https://ext.dcloud.net.cn/plugin?id=25)，如果项目本身已导入uni-ui，请忽略。

至于文本框的样式完全可以自定义样式去显示，不必用本组件的哦。

```html
<sx-get-code v-model="formData.code" :phone="formData.mobile" :http-method="getCode" :data="{scene:'login'}" />
```

## API

### Props

| 属性名    | 类型           | 默认值 | 说明                            |
| --------- | -------------- | ------ | ------------------------------- |
| value | String | - | 输入的验证码，可使用v-model进行控制。 |
| phone | String    | -    | 手机号码 |
| name | String | phone | 请求获取验证码手机号字段名 |
| data | Object | - | 请求获取验证码时附带的额外参数 |
| httpMethod | Function |  | 请求获取验证码的http请求函数 |
| second | Number | 59 | 请求成功之后的倒计时秒数，最大支持59 |

### Events

| 事件称名 | 说明 | 返回参数 |
| -------- | ---- | -------- |
| 无       |      |          |

### 名人语录

当你为错过太阳而哭泣的时候，你也要再错过群星了。——**泰戈尔（印度）**
