# the.dude.abula.github.io

TheDudeAbula 的个人站点，基于 [Jekyll](https://jekyllrb.com/) + Liquid + SCSS。

## 环境准备

- 需要本机安装 Ruby 与 Bundler（当前 `Gemfile.lock` 使用 `BUNDLED WITH 2.7.2`）。
- 安装依赖：`bundle install`（依赖 `github-pages` 套件）。

## 本地开发

```bash
# 默认配置会使用 _config.yml 中的 baseurl（/the.dude.abula.github.io）
bundle exec jekyll serve
# 如希望本地以根路径预览，可覆写 baseurl
bundle exec jekyll serve --baseurl ''
```

- 默认端口 `4000`，LiveReload 已启用。
- 使用默认配置时，访问路径为 `http://localhost:4000/the.dude.abula.github.io/`；使用 `--baseurl ''` 时可直接访问 `http://localhost:4000/`。

## 本地构建验证

```bash
bundle exec jekyll build --trace
```

出现构建异常时，`--trace` 会输出完整堆栈便于排查。

## 目录结构

- `_config.yml`：站点全局配置（`url`/`baseurl`、插件、集合等）。
- `_layouts/`：页面骨架（`default`、`page`、`post`、`blog`）。
- `_includes/`：可复用片段（`head`、`header`、`footer`、`hero` 等）。
- `_sass/` + `assets/css/main.scss`：样式入口与模块化 SCSS。
- `assets/`：编译产物与静态资源。
- `content/_posts/`：文章内容集合（Front Matter 见下）。
- `pages/`：独立页面（`/about`、`/projects`、`/blog`）。
- `_data/`：结构化数据（导航、项目等）。

## 内容与数据编辑

- 博客文章：位于 `content/_posts/`，Front Matter 最小字段建议：
  - `layout: post`, `title`, `date`；可选 `tags`, `description` 以配合 `jekyll-feed` 与 `jekyll-seo-tag`。
- 独立页面：位于 `pages/`，使用 `layout: page`。
- 导航：`_data/navigation.yml` 控制顶部菜单。
- 首页精选项目：`_data/projects.yml` 中 `featured: true` 的项目会出现在首页「Featured Projects」区块。

## 样式定制

- 样式入口在 `assets/css/main.scss`，模块按功能拆分在 `_sass/` 目录。
- 公共组件结构可在 `_includes/`（如 `hero.html`、`header.html`）与 `_layouts/` 中调整。

## 构建缓存清理

如遇到异常缓存，可运行 `./clean_cache.sh` 清理 `_site`、`.jekyll-cache`、`.sass-cache`、`vendor/bundle`。

## 部署说明

- 推送到 `main` 分支即可用于 GitHub Pages；默认配置适用于项目页（`url: https://brokedudeabula.github.io` + `baseurl: /the.dude.abula.github.io`）。
- 若改用自定义域名或用户页，请同步调整 `_config.yml` 中的 `url`/`baseurl`，并在 README 更新访问路径说明。
