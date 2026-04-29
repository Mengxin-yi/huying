import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
	plugins: [uni()],
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
				rewrite: path => path.replace(/^\/media/, '')
			},
			'/wpi': {
				target: 'http://voice.ugoolink.com',
				changeOrigin: true,
				secure: false,
				rewrite: path => path.replace(/^\/wpi/, '')
			}
		}
	}
})
