<template>
	<view class="sx-get-code">
		<view class="sx-get-code__content">
			<view v-if="isCountdown" class="sx-get-code__countdown">
				<uni-countdown :second="second" :show-day="false" @timeup="timeup"></uni-countdown>S
			</view>
			<uni-load-more v-else-if="codeLoading" status="loading" :showText="false" :iconSize="18"></uni-load-more>
			<text v-else @click="getCode">
				获取验证码
			</text>
		</view>
		<uni-easyinput v-model="model" type="digit" :clearable="false" placeholder="请输入验证码" />
	</view> 
</template>
<script>
	/**
	 * SxGetCode 获取验证码
	 * @description 此组件可以实现根据手机号获取验证码功能，倒计时。
	 * @tutorial 待补充
	 * @property {String}	value	输入的验证码
	 * @property {String}	phone	手机号码
	 * @property {String}	name	请求获取验证码手机号字段名	
	 * @property {Object}	data	请求获取验证码时附带的额外参数	
	 * @property {Function}	httpMethod	请求获取验证码的http请求函数
	 * @property {Number}	second	请求成功之后的倒计时秒数，最大支持59
	
	 * @example <sx-get-code v-model="formData.code" :phone="formData.mobile" :http-method="getCode":data="{scene:'login'}" />
	 */
	
	// 电话号码验证
	function validateMoblie(val) {
		var reg = /^(?:(?:\+|00)86)?1\d{10}$/
		return reg.test(val)
	}
	export default {
		props: {
			value: {
				type: String,
				default: ''
			},
			phone: {
				type: String,
			},
			name: {
				type: String,
				default: 'phone'
			},
			data: {
				type: Object,
				default () {
					return {}
				}
			},
			httpMethod: {
				type: Function
			},
			second: {
				type: Number,
				default: 59
			}
		},
		data() {
			return {
				isCountdown: false,
				codeLoading: false,
			}
		},
		methods: {
			getCode() {
				if (validateMoblie(this.phone)) {
					this.codeLoading = true
					const params = {
						...this.data
					}
					params[this.name] = this.phone
					this.httpMethod(params).then(() => {
						this.isCountdown = true
					}).finally(() => {
						this.codeLoading = false
					})
				} else {
					uni.showToast({
						title: '手机号格式不正确',
						icon: 'none'
					});
				}
			},
			timeup() {
				this.isCountdown = false
			}
		},
		computed: {
			model: {
				get() {
					return this.value
				},
				set(val) {
					this.$emit('input', val)
				}
			}
		}
	}
</script>
<style lang="scss">
	.sx-get-code {
		display: flex;
		align-items: center;
		position: relative;

		&__content {
			color: $uni-color-primary;
			position: absolute;
			z-index: 1;
			right: 12px;
			font-weight: 500;
			font-size: 14px;
		}

		&__countdown {
			color: #ccc;
			display: flex;
		}

		/deep/ {
			.uni-forms-item__content {
				display: flex;
				align-items: center;
			}

			.uni-load-more {
				height: initial;
			}


			.uni-countdown {
				.uni-countdown__splitor {
					display: none;
				}


				.uni-countdown__number {
					display: none;

					&:last-child {
						display: inline;
					}

					span {
						color: #ccc;
					}
				}

			}

		}
	}

	.uni-code-input .uni-code-input-get {
		right: 12px;
	}
</style>