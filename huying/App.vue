<script>
	import { useUserStore } from '@/store/modules/user.js'
	import { useAppStore } from '@/store/modules/app.js'

	export default {
		onLaunch: function() {
			// 初始化系统信息
			const appStore = useAppStore()
			appStore.initSystemInfo()

			// 恢复登录态
			const userStore = useUserStore()
			userStore.restoreLoginState()
		},
		onShow: function() {},
		onHide: function() {}
	}
</script>

<style lang="scss">
	@import "@/uni_modules/uview-plus/index.scss";
	@import "@/common/css/base.css";
</style>
