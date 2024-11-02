import { fileURLToPath, URL } from 'node:url'
import vitePluginPrerenderer from 'vite-plugin-prerenderer'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
const config = {
    routes: ['/',"/about"],
    options: {
        '/': {
            title: "我是首页标题",
            keyWords: "首页关键词",
            description: "首页的描述",
        },
        '/about': {
            title: "我是关于页标题",
            keyWords: "关于页关键词",
            description: "关于页的描述",
        }
    }
}
export default defineConfig({
  plugins: [vue(), vitePluginPrerenderer(config)],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
