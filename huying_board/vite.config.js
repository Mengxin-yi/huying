import {
	defineConfig
} from 'vite';
import uni from '@dcloudio/vite-plugin-uni';

export default defineConfig({
	plugins: [uni()],
	define: {
		'process.env': {},
		'process': {
			env: {}
		}
	},
	server: {
		proxy: {
			'/bpi': {
				target: 'https://ugoo.ugoolink.com',
				changeOrigin: true,
				secure: false,
				rewrite: path => path.replace(/^\/bpi/, '')
			},
			'/cpi': {
				target: 'https://ugoo.ugoolink.com',
				changeOrigin: true,
				secure: false,
				rewrite: path => path.replace(/^\/cpi/, '')
			},
			'/media': {
				target: 'https://ugoo.ugoolink.com',
				changeOrigin: true,
				secure: false,
				rewrite: path => path.replace(/^\/cpi/, '')
			},
			'/api': {
				// target: 'http://192.168.1.102:7576',
				target: 'http://voice.ugoolink.com',
				changeOrigin: true,
				secure: false,
				rewrite: path => path.replace(/^\/api/, '') // 去掉 /api，变成 /users
			}

		}
	}
});