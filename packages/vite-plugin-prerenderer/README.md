# Vite Plugin Prerenderer

`vite-plugin-prerenderer` 是一个用于 Vite 的插件，旨在为应用程序提供预渲染功能，不限使用的框架。它使用 Puppeteer 渲染页面并生成静态 HTML 文件，以便于 SEO 和更快的页面加载。支持各种层级的路由。

### 安装

---

```
npm install vite-plugin-prerenderer -D

or

yarn add vite-plugin-prerenderer -D
```

### 使用

---

```
// vite.config.js

import vitePluginPrerenderer from 'vite-plugin-prerenderer'

const config = {
    routes: ['/'],
    options: {
        '/': {
            title: "我是首页标题",
            keyWords: "首页关键词",
            description: "首页的描述",
        }
    }
}

export default defineConfig({
  plugins: [
    vitePluginPrerenderer(config),
  ],
});
```

### 输出到指定文件夹

vite中build.outDir选项

### Config

---

|  Name   |  Type  | Required |                                         Description                                          |
| :-----: | :----: | :------: | :------------------------------------------------------------------------------------------: |
| routes  | Array  |   true   |                                       需要预渲染的路由                                       |
| options | Object |  false   | 每个路由对应渲染的配置信息，其中 keyWords 支持为字符串数组，同样是支持逗号隔开的字符串。可选 |
