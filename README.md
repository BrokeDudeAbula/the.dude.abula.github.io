# the.dude.abula.github.io

Personal site for The Dude Abula powered by [Jekyll](https://jekyllrb.com/), Liquid templates, and SCSS.

## Getting Started

```bash
bundle install
bundle exec jekyll serve
```

The default server runs at <http://localhost:4000> with live reload enabled.

## 本地验证

1. 在仓库根目录执行 `bundle install` 安装依赖（需要本机已经安装 Ruby 与 Bundler）。
2. 运行 `bundle exec jekyll serve`，Jekyll 会构建网站并启动本地服务器（默认端口 `4000`）。
3. 打开浏览器访问 `http://localhost:4000`，即可查看站点效果；保存文件后页面会自动刷新。
4. 如需排查问题，可在命令末尾追加 `--trace` 查看详细日志，或使用 `--livereload` 强制启用即时刷新。

## Project Structure

- `_config.yml` — global site settings, plugins, and collections
- `_layouts/` — page skeletons (`default`, `page`, `post`, `blog`)
- `_includes/` — reusable components (head, header, footer, hero)
- `_sass/` — modular SCSS partials loaded into `assets/css/main.scss`
- `assets/` — compiled CSS and client-side JavaScript
- `content/_posts/` — Markdown posts with front matter
- `pages/` — standalone pages (`/about`, `/projects`, `/blog`)
- `_data/` — structured data for navigation, projects, and other content

## Deployment

Pushes to `main` are ready for GitHub Pages. Configure the repository to build with GitHub Pages using GitHub Actions or the Pages settings panel.
