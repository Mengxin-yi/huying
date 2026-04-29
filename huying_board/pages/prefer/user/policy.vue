<template>
	<view class="content-inner" v-html="data">
		
	</view>
</template>

<script>
	import pageUtil from '../../../common/js/utils/page.js';
	
	export default {
		data() {
			return {
				data: '<div style="margin-top: 0%; margin-left: 1%; margin-right: 1%;"><div class="title">1. 协议前言概述</div><p class="box3" style="font-size: 14rpx;"> 本协议（以下简称“协议”）由[时代呼应]（以下简称“本公司”或“平台”）与用户（以下简称“您”）共同缔结，旨在明确双方在使用本平台服务过程中的权利、义务与责任。在您注册成为本平台用户之前，请仔细阅读本协议内容。您的注册行为将被视为对本协议全部条款的接受与认可，并同意遵守本协议的各项规定。若您不同意本协议中的任何条款，请勿进行注册或使用本平台提供的任何服务。</p><p>2. 服务内容范围</p><p class="box3" style="font-size: 14rpx;">本平台提供包括但不限于[具体服务内容，如信息发布、商品交易、社交互动、在线学习等]等服务（以下简称“服务”）。我们致力于为用户提供便捷、高效、安全的网络环境。服务的具体范围、功能及形式可能因技术更新、政策调整等因素而有所变化，请以本平台最新公告或页面展示为准。</p><p style="font-size: 20rpx;">3. 用户注册信息</p><p class="box3" style="font-size: 14rpx;"> 3.1 您在注册时，需按照平台要求提供真实、准确、完整的个人信息，包括但不限于姓名、身份证号（或其他合法身份证明）、联系方式等。</p><p class="box3" style="font-size: 14rpx;"> 3.2 您有义务保持注册信息的时效性，及时更新因时间变化而失效的信息。</p><p class="box3" style="font-size: 14rpx;"> 3.3 本平台对您的个人信息负有保密义务，但为提供服务所必需或法律法规要求的情况除外。</p><p style="font-size: 20rpx;">4. 账户安全责任</p><p class="box3" style="font-size: 14rpx;"> 4.1 您应对自己的账户及密码安全负责，不得将账户信息泄露给第三方，也不得允许他人使用您的账户。</p><p class="box3" style="font-size: 14rpx;"> 4.2 如发现账户被盗用或有异常登录情况，应立即通知本平台并采取必要措施防止损失扩大。</p><p class="box3" style="font-size: 14rpx;"> 4.3 因您自身原因导致的账户安全问题，包括但不限于密码泄露、被盗用等，相关责任由您自行承担。</p><p style="font-size: 20rpx;">5. 使用规则条款</p><p class="box3" style="font-size: 14rpx;"> 5.1 您在使用服务时，应遵守国家法律法规、社会公德及本协议约定，不得发布违法、色情、暴力、欺诈、侵权等内容。</p><p class="box3" style="font-size: 14rpx;"> 5.2 禁止利用本平台从事任何形式的商业推广活动，除非事先获得本平台的书面同意。</p><p class="box3" style="font-size: 14rpx;"> 5.3 本平台有权根据需要对服务内容、规则进行调整，并通过公告或邮件等方式通知用户。</p><p style="font-size: 20rpx;">6. 知识产权归属</p><p class="box3" style="font-size: 14rpx;"> 6.1 本平台上的所有内容（包括但不限于文字、图片、音频、视频等）的知识产权归本公司或其合法权利人所有。</p><p class="box3" style="font-size: 14rpx;"> 6.2 未经本公司书面许可，您不得擅自复制、修改、传播或以其他方式使用本平台上的任何内容。</p><p style="font-size: 20rpx;">7. 隐私保护与声明</p><p class="box3" style="font-size: 14rpx;"> 7.1 本公司尊重并保护用户的隐私权，将按照《个人信息保护法》及相关法律法规的规定，合法、正当、必要地收集、使用、存储及保护您的个人信息。</p><p class="box3" style="font-size: 14rpx;"> 7.2 我们可能通过技术手段收集您的使用行为数据，用于优化服务体验、提升服务质量，但不会用于除此之外的其他目的。</p><p class="box3" style="font-size: 14rpx;"> 7.3 您同意本平台在遵守法律法规的前提下，将您的个人信息用于内部研究分析、提升服务品质等合法用途。</p><p style="font-size: 20rpx;">8. 违约责任处理</p><p class="box3" style="font-size: 14rpx;"> 8.1 若您违反本协议任何条款，本公司有权视情节轻重采取包括但不限于警告、限制功能、暂停或永久封禁账户等措施。</p><p class="box3" style="font-size: 14rpx;"> 8.2 对于因您违反本协议而给本公司或其他用户造成的损失，您应承担相应的法律责任，包括但不限于赔偿损失、支付违约金等。</p><p class="box3" style="font-size: 14rpx;"> 8.3 如双方就本协议发生争议，应首先通过友好协商解决；协商不成时，任何一方均可向本公司所在地人民法院提起诉讼。</p><p></p></div>'
			}
		},
		mounted() {
			pageUtil.checkWechatAll();
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	.content-inner {
		padding: 20rpx 20rpx;
	}

</style>
