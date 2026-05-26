# Repository Guidelines

## 项目结构与模块
- `_config.yml`：站点配置（`url`/`baseurl`、插件、集合），发布前请确认域名与路径。
- `_layouts/` 与 `_includes/`：页面骨架与可复用片段；调整全局结构或 SEO 标签时修改这里。
- `_sass/` + `assets/css/main.scss`：样式入口与分层 SCSS；`assets/` 存放编译产物与静态资源。
- `content/_posts/`：博客正文，文件名遵循 `YYYY-MM-DD-title.md`；`pages/` 存放独立页面；`_data/` 维护导航、项目等结构化数据。
- `_site/` 为构建输出，勿提交；`clean_cache.sh` 用于清理构建缓存。

## 构建、测试与本地开发
```bash
bundle install                         # 初始化依赖（Bundler 2.7.2 环境）
bundle exec jekyll serve               # 本地预览，使用配置中的 baseurl
bundle exec jekyll serve --baseurl ''  # 本地根路径预览
bundle exec jekyll build --trace       # 构建与错误追踪
./clean_cache.sh                       # 清理 _site/.jekyll-cache/.sass-cache/vendor
```
- 默认端口 4000，LiveReload 已启用。

## 编码风格与命名
- Markdown/HTML/Liquid 使用 2 空格缩进，避免行尾空格；尽量复用 `_includes` 片段而非内联样式。
- Front Matter 最小字段：`layout`、`title`、`date`，推荐补充 `tags`、`description` 以配合 `jekyll-feed`、`jekyll-seo-tag`。
- YAML 数据键名使用 `snake_case`，页面/资源命名使用小写短横线风格。
- SCSS 分层：变量/混入放在 `_sass`，入口仅做导入与少量全局覆盖。

## 测试与校验
- 无单独单测框架，变更后必跑 `bundle exec jekyll build --trace`；如涉及依赖升级，可加跑 `bundle exec jekyll doctor`。
- UI 调整请在本地预览确认导航、代码高亮与移动端布局。

## 提交规范
- 单次提交必须聚焦一组相关变更，避免把内容更新、样式调整、依赖升级、重构混在同一个 commit 中。
- 提交标题使用简洁英文祈使句，首字母大写，不以句号结尾，长度建议控制在 72 字符以内。
- 推荐标题格式：`<Type>: <Imperative summary>`；涉及明确模块时可写成 `<Type>(scope): <Imperative summary>`。
- 常用 `Type`：
  - `Add`：新增文章、页面、组件、数据或功能。
  - `Fix`：修复链接、布局、构建错误、内容错误或兼容性问题。
  - `Update`：更新已有内容、文案、图片、配置或依赖版本。
  - `Refactor`：重构结构，不改变页面行为或最终内容。
  - `Style`：仅调整视觉样式、排版、格式化或 SCSS 组织。
  - `Docs`：更新 README、AGENTS、说明文档或注释。
  - `Chore`：清理缓存、维护脚本、整理工程配置等非用户可见变更。
- 示例：
  - `Add blog post on CUDA profiling`
  - `Fix mobile navigation spacing`
  - `Update homepage GitHub activity card`
  - `Style(home): Improve project card layout`
  - `Docs: Expand commit guidelines`
- 如变更较复杂，提交正文应说明：
  - 背景：为什么需要这次修改。
  - 内容：主要改了哪些文件或行为。
  - 验证：运行过哪些命令，例如 `bundle exec jekyll build --trace`。
  - 风险：是否涉及外部服务、URL、SEO、GitHub Pages 发布路径或移动端布局。
- 提交前检查：
  - 使用 `git status --short` 确认只包含本次意图相关文件。
  - 使用 `git diff` 或 `git diff --cached` 复查实际改动。
  - 不提交 `_site/`、`.jekyll-cache/`、`.sass-cache/`、`vendor/`、本地密钥、Token 或临时文件。
  - 内容或页面变更后运行 `bundle exec jekyll build --trace`；UI 变更还需本地预览确认桌面端与移动端效果。
- 对于 AI 协作生成的修改，提交前需要人工确认 diff；不要把未审阅的大段生成内容直接提交。

## PR 指南
- PR 需包含：变更摘要、影响范围、截图（UI 改动必附）、关联 Issue/任务号，以及本地构建结果说明。
- PR 描述中应明确是否影响首页、导航、RSS、SEO、GitHub Pages 路径、外部链接或移动端布局。
- 推送到 `main` 即触发 GitHub Pages 发布；若改用自定义域名或用户页，请同步更新 `_config.yml` 的 `url`/`baseurl` 并在 README 说明访问路径。

## 内容编辑与部署提示
- 新文章放在 `content/_posts/`，标签与摘要会影响 RSS 与 SEO；首页精选项目由 `_data/projects.yml` 中 `featured: true` 控制。
- 避免将密钥、Token 写入配置或数据文件；需要外部链接时使用 https 并检查可用性。
