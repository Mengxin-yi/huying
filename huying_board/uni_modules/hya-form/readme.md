### 兼容额外说明

微信小程序、支付宝小程序、钉钉小程序、H5-Safari、Android Browser、微信浏览器(Android)、QQ 浏览器(Android)、Chrome、IE、Edge、Firefox、PC-Safari 支持使用，需要引入申明使用并使用 ts 语言，因为组件使用了类型申明，其中 hya-form 中相关组件也需要引入相关依赖组件（需手动修改，配置可参考如下说明）

### 插件使用

- 基础用法

```
<hya-form ref="hyaForm" :infoList="infoList" />
```

- 引入数据类型

```
import type { FormType } from '@/uni_modules/hya-form/libs/model/index.uts';
```

- 申明数据

```
infoList: [{
    type: 'input',
    title: '手机号码',
    placeholder: '请输入手机号码',
    key: 'phone',
    value: '',
    titleIcon: 'shouji',
    titleType: 1,
    required: true,
    errMsg: '',
    disabled: false,
    rules: [
        {
            rule: '^1[3456789]\\d{9}$',
            errMsg: '请输入正确的手机码'
        }
    ]
}] as Array<FormType>
```

### Props

#### hya-form

| 参数     | 类型  | 默认值 | 是否必填 | 说明                                        |
| -------- | ----- | ------ | -------- | ------------------------------------------- |
| infoList | Array | -      | 是       | 表单数据内容，FormType参照下表 |

#### FormType

| 参数        | 类型    | 默认值   | 是否必填 | 说明                                                                                                             |
| ----------- | ------- | -------- | -------- | ---------------------------------------------------------------------------------------------------------------- |
| type        | string  | -        | 是       | 表单类型，分为 input（输入框），password（密码输入框），picker（下拉选择框），date（日期选择），time（时间选择） |
| title       | string  | -        | 是       | 标题                                                                                                             |
| key         | string  | -        | 是       | 返回关键字，将作为参数名返回                                                                                     |
| value       | any     | -        | 是       | 返回内容，将作为参数内容返回                                                                                     |
| titleType   | number  | -        | 是       | 表单类型，1-左右分布带背景色，2-左右分布带下划线，3-上下分别显示名称                                             |
| titleIcon   | string  | yingyong | 否       | 图标名，名称可参考组件[hya-icon](https://ext.dcloud.net.cn/plugin?id=15225)                                      |
| required    | boolean | false    | 否       | 是否必填，参与检验                                                                                               |
| placeholder | string  | -        | 否       | 输入框为空时占位符                                                                                               |
| rules       | Array   | []       | 否       | 校验规则，RuleType参照下表                                                                          |
| disabled    | boolean | false    | 否       | 是否可编辑                                                                                                       |
| errMsg      | string  | -        | 否       | 错误提示信息                                                                                                     |
| pickerShow  | boolean | false    | 否       | 是否展示选择框，除输入框，其他类型必填                                                                           |
| pickerValue | Array   | []       | 否       | 选择框的默认，除输入框，其他类型必填值                                                                           |
| columns     | Array   | []       | 否       | 下拉框选项，ColumnType参照下表                                                                    |

#### RuleType

| 参数   | 类型   | 默认值 | 是否必填 | 说明                                                        |
| ------ | ------ | ------ | -------- | ----------------------------------------------------------- |
| rule   | String | -      | 是       | 校验规则，如手机号码校验、邮箱检验等，示例如下 |
| errMsg | String | -      | 是       | 检验错误提示信息                                            |

##### 校验规则示例

- 手机号码：^1[3456789]\\\d{9}$
- 邮箱： ^\\w+([-+.]\\w+)_@\\w+([-.]\\w+)_\\.\\w+([-.]\\w+)\*$

#### ColumnType

| 参数  | 类型   | 默认值 | 是否必填 | 说明           |
| ----- | ------ | ------ | -------- | -------------- |
| value | String | -      | 是       | 下拉选项实际值 |
| label | String | -      | 是       | 下拉选项展示值 |

#### 配置额外说明

如果想在 vue3+ts 中使用支持多平台，需要加入额外的引用申明，配置如下：

- 引用组件的配置项

```
import hyaForm from '@/uni_modules/hya-form/components/hya-form.uvue';

export default{
    components: { hyaForm }
}
```

- hya-form 组件的配置项

```
import hyaInput from '../hya-input/hya-input.uvue';
import hyaPwd from '../hya-pwd/hya-pwd.uvue';
import hyaPicker from '../hya-picker/hya-picker.uvue';
import hyaDate from '../hya-date/hya-date.uvue';
import hyaTime from '../hya-time/hya-time.uvue';

export default {
    components: {
        hyaInput, hyaPwd, hyaPicker, hyaDate, hyaTime
    }
}
```

- hya-input、hya-pwd、hya-picker、hya-date、hya-time 组件的配置项

```
import hyaIcon from '../hya-icon/hya-icon.uvue';

export default {
    components: { hyaIcon }
}
```

### 提交

- 通过 ref 的 getFormValue()获取表单的内容，参考如下：

```
<hya-form :infoList="infoList" ref="hyaForm" />
```

```
获取全部数据：
let res : UTSJSONObject | null = (this.$refs['hyaForm'] as HyaFormComponentPublicInstance).getFormValue();
获取具体某一个数据：
res?.getString('area');
```
