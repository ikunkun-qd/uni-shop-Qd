<script setup>
// App 级生命周期当前由 uni-app 默认处理，公共样式放在本文件统一维护。
</script>

<style lang="scss">
	page {
		background: $shop-bg;
		color: $shop-text;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
		font-size: 14px;
	}

	button {
		box-sizing: border-box;
		font-family: inherit;
	}

	button::after {
		border: 0;
	}

	.uni-page-head {
		box-shadow: 0 1px 0 rgba(28, 42, 58, .04);
	}

	/* H5 端原生 tabbar 默认过于扁平，放大图标和点击区域，保持与小程序端设计一致。 */
	.uni-tabbar {
		height: 64px !important;
		border-top: 1px solid $shop-border !important;
		box-shadow: 0 -8rpx 24rpx rgba(28, 42, 58, .06);
	}

	.uni-tabbar__bd {
		height: 64px !important;
		padding-top: 4px;
		box-sizing: border-box;
	}

	.uni-tabbar__icon,
	.uni-tabbar__icon__diff {
		width: 30px !important;
		height: 30px !important;
	}

	.uni-tabbar__label {
		font-size: 11px !important;
		line-height: 16px !important;
	}
</style>
