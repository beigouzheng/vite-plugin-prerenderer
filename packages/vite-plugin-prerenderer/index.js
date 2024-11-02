import Prerenderer from "@prerenderer/prerenderer";
import PuppeteerRenderer from "@prerenderer/renderer-puppeteer";
import path from "path";
import mkdirp from "mkdirp";
import fs from "fs";
import spin from "io-spin";

function vitePluginVuePrerenderer(config = {}) {
  let viteConfig
  return {
    name: "vite-plugin-vue-prerenderer",
    configResolved(resolvedConfig) {
      // 存储最终解析的配置
      viteConfig = resolvedConfig
    },
    async closeBundle() {
      const spinner = spin("rendering......");

      const { routes = [], options } = config;
      if (!routes || routes.length == 0) {
        console.warn("[vite-plugin-vue-prerenderer] Parameter error: you have to offer a route parameter at least");
        return;
      }
      const staticDir = path.join(path.resolve(), viteConfig.build.outDir)
      spinner.start();

      const prerenderer = new Prerenderer({
        // Required - The path to the app to prerender. Should have an index.html and any other needed assets.
        staticDir,
        // The plugin that actually renders the page.
        renderer: new PuppeteerRenderer({
          // 属性名
          injectProperty: "__PRERENDER_INJECTED__",
          // 属性值
          inject: {
            isPrerender: true,
          },
          renderAfterTime: 2000,
        }),
      });
      try {
        await prerenderer.initialize()
        const renderedRoutes = await prerenderer.renderRoutes(routes);
        renderedRoutes.forEach((renderedRoute) => {
          try {
            const html = prerendererTrim(renderedRoute, options);
            if (html) {
              const _outputDir = staticDir;
              const outputDir = path.join(_outputDir, renderedRoute.route);
              const outputFile = `${outputDir}/index.html`;
              mkdirp.sync(outputDir);
              fs.writeFileSync(outputFile, html);
            }
          } catch (error) {
            console.warn("[vite-plugin-vue-prerenderer] " + error);
          }
        });
      } catch (error) {
        console.warn("[vite-plugin-vue-prerenderer] " + error);
      } finally {
        spinner.stop();
        prerenderer.destroy();
      }
    },
  };
}

function prerendererTrim(renderedRoute, options) {
  try {
    let html = renderedRoute.html.trim();
    // no any configure
    if (!options) {
      return html;
    }
    const route = renderedRoute.route;
    if (options[route] && options[route].title) {
      let _title = options[route].title;
      if (typeof _title !== "string") {
        console.warn("[vite-plugin-vue-prerenderer] The title must be a string");
        return false;
      }
      html = html.replace(/<title>(.*?)<\/title>/, `<title>${_title}</title>`);
    }
    if (options[route] && options[route].keyWords) {
      let _keyWords = options[route].keyWords;
      if (!Array.isArray(_keyWords) && typeof _keyWords !== "string") {
        console.warn("[vite-plugin-vue-prerenderer] The keyword must be an array or string");
        return false;
      }
      if (Array.isArray(_keyWords)) {
        _keyWords = _keyWords.join(",");
      }
      const meta = `<meta name="keyWords" content="${_keyWords}">`;
      html = html.replace(/<title>/, meta + "<title>");
    }
    if (options[route] && options[route].description) {
      let _description = options[route].description;
      if (typeof _description !== "string") {
        console.warn("[vite-plugin-vue-prerenderer] The description must be a string");
        return false;
      }
      const meta = `<meta name="description" content="${_description}">`;
      html = html.replace(/<title>/, meta + "<title>");
    }

    return html;
  } catch (error) {
    console.warn("[vite-plugin-vue-prerenderer] " + error);
    return false;
  }
}

export { vitePluginVuePrerenderer as default };
