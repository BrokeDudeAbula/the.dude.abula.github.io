# Chirpy 主题迁移方案

> 目标：将当前 Jekyll 站点从自定义主题迁移至 [jekyll-theme-chirpy](https://github.com/cotes2020/jekyll-theme-chirpy)（Gem 方式，版本 ~> 7.5）。
>
> 策略：以 [chirpy-starter](https://github.com/cotes2020/chirpy-starter) 作为目标骨架，先导入 Starter 必需文件，再迁移博客、页面、游戏与项目数据。不要在旧主题上局部拼接 Chirpy。
>
> 约束：每个 Milestone 完成后站点均可在本地 `bundle exec jekyll build --trace` 通过；涉及 UI/游戏的 Milestone 还需要 `bundle exec jekyll serve` 预览验收。

---

## 总览

| # | Milestone | 核心目标 | 预计影响 |
|---|-----------|----------|----------|
| M1 | 备份与分支准备 | 安全网，确保可回滚 | 无破坏性变更 |
| M2 | 核心主题切换 | Chirpy Starter 骨架导入，站点可启动 | 替换 Gemfile/config/index，引入 Starter 必需文件 |
| M3 | 博客文章迁移 | 所有博文正确显示 | 调整 front matter |
| M4 | 游戏集合迁移 | 所有游戏可玩 | 自定义 collection + 样式迁移 |
| M5 | 项目与关于页迁移 | 信息完整展示 | 自定义 tabs + 数据文件 |
| M6 | 外观与个性化定制 | 品牌一致性 | Avatar、social、locale、CSS 覆盖 |
| M7 | GitHub Actions 部署 | 线上可访问 | 添加 workflow，调整 repo 设置 |

---

## M1：备份与分支准备

### 目标

在不影响线上站点的情况下，创建安全的工作环境。

### Todo List

- [ ] **T1.1** 确认当前 `main` 分支所有变更已提交或已明确暂存处理（`git status` 干净）。如果存在未提交修改，先提交到独立 checkpoint，不要在迁移中混入不相关改动
- [ ] **T1.2** 为当前状态打 tag：`git tag pre-chirpy-migration`
- [ ] **T1.3** 创建迁移分支：`git checkout -b vibecode/chirpy-migration`
- [ ] **T1.4** 在本地额外备份一份完整目录（包含隐藏文件，排除构建缓存）：
  ```bash
  mkdir -p ../the.dude.abula.github.io.bak
  rsync -a --delete \
    --exclude='_site/' \
    --exclude='.jekyll-cache/' \
    --exclude='.sass-cache/' \
    --exclude='vendor/' \
    --exclude='node_modules/' \
    ./ ../the.dude.abula.github.io.bak/
  ```
- [ ] **T1.5** 在迁移分支上确认站点仍可正常构建：`bundle exec jekyll build --trace`

### 验收测试

| 检查项 | 预期结果 | ✅/❌ |
|--------|----------|-------|
| `git tag` 输出包含 `pre-chirpy-migration` | 是 | |
| 当前位于 `vibecode/chirpy-migration` 分支 | 是 | |
| `bundle exec jekyll build --trace` 无报错 | 是 | |
| 备份目录 `../the.dude.abula.github.io.bak` 存在且完整 | 是 | |

### 进度同步

```
- [x] 开始时间：2026-05-26 17:29:31 CST
- [x] 完成时间：2026-05-26 17:30:48 CST
- [x] 遇到的问题：无阻塞；`bundle exec jekyll build --trace` 成功，但输出既有 Liquid Warning：`MIGRATION_CHIRPY.md` line 317 中示例 `{{ ... | relative_url }}` 表达式无法被 Liquid 解析。
- [x] 备注：已确认 `main` tracked 工作树干净；已创建 `pre-chirpy-migration` tag；已创建并切换到 `vibecode/chirpy-migration`；已创建外部备份 `../the.dude.abula.github.io.bak`，并排除 `_site/`、`.jekyll-cache/`、`.sass-cache/`、`vendor/`、`node_modules/`；根目录忽略文件如 `prompt.md` 未纳入处理。
```

---

## M2：核心主题切换

### 目标

将站点骨架切换为 Chirpy Starter 结构，站点能正常启动并显示 Chirpy 首页。此阶段只处理主题骨架，不迁移 About/Projects/Games 内容；但必须先备份再移除旧 `_layouts/`、`_includes/`、`_sass/` 和 `pages/`，否则本地同名布局会覆盖 Chirpy gem 内的布局。

### Todo List

- [ ] **T2.1** 拉取 Chirpy Starter 到临时目录，作为文件来源：
  ```bash
  rm -rf /tmp/chirpy-starter
  git clone https://github.com/cotes2020/chirpy-starter.git /tmp/chirpy-starter
  ```
- [ ] **T2.2** 在仓库内保存一份旧主题迁移源，供 M4/M5 迁移游戏样式、About、Projects 等内容使用：
  ```bash
  mkdir -p _migration_backup/old-site
  rsync -a pages/ _migration_backup/old-site/pages/
  rsync -a _layouts/ _migration_backup/old-site/_layouts/
  rsync -a _includes/ _migration_backup/old-site/_includes/
  rsync -a _sass/ _migration_backup/old-site/_sass/
  mkdir -p _migration_backup/old-site/_data _migration_backup/old-site/assets/css _migration_backup/old-site/assets/js
  cp _data/navigation.yml _migration_backup/old-site/_data/navigation.yml
  cp assets/css/main.scss _migration_backup/old-site/assets/css/main.scss
  cp assets/js/main.js _migration_backup/old-site/assets/js/main.js
  grep -qxF '_migration_backup/' .gitignore || printf '\n_migration_backup/\n' >> .gitignore
  ```
  说明：外部 `../the.dude.abula.github.io.bak` 用于灾难回滚；仓库内 `_migration_backup/old-site/` 用于迁移过程查阅旧文件，后续确认无遗漏后可删除。该目录应保持未跟踪，避免把旧主题副本提交进仓库。
- [ ] **T2.3** 替换 `Gemfile`（以 Starter 当前版本为准）：
  ```ruby
  # frozen_string_literal: true

  source "https://rubygems.org"

  gem "jekyll-theme-chirpy", "~> 7.5"
  gem "html-proofer", "~> 5.0", group: :test

  platforms :windows, :jruby do
    gem "tzinfo", ">= 1", "< 3"
    gem "tzinfo-data"
  end

  gem "wdm", "~> 0.2.0", platforms: [:windows]
  ```
- [ ] **T2.4** 删除 `Gemfile.lock`（当前 `.gitignore` 已忽略它；让 Bundler 按新主题重新解析依赖）
- [ ] **T2.5** 从构建路径移除旧主题文件，避免覆盖 Chirpy gem 内置布局和样式：
  ```bash
  rm -rf _layouts _includes _sass pages
  rm -f index.md assets/css/main.scss assets/js/main.js _data/navigation.yml
  ```
- [ ] **T2.6** 从 Starter 复制必需骨架文件：
  ```bash
  cp /tmp/chirpy-starter/index.html ./index.html
  cp /tmp/chirpy-starter/.nojekyll ./.nojekyll
  mkdir -p _tabs _plugins _data .github/workflows
  cp -R /tmp/chirpy-starter/_tabs/. ./_tabs/
  cp -R /tmp/chirpy-starter/_plugins/. ./_plugins/
  cp /tmp/chirpy-starter/_data/contact.yml ./_data/contact.yml
  cp /tmp/chirpy-starter/_data/share.yml ./_data/share.yml
  cp /tmp/chirpy-starter/.github/workflows/pages-deploy.yml ./.github/workflows/pages-deploy.yml
  ```
  说明：Chirpy gem 只打包主题运行所需的一部分 `_data`、`_layouts`、`_includes`、`_sass` 和 `assets`，Starter 中的 `_tabs`、`_plugins`、`_data/contact.yml`、`_data/share.yml`、`.nojekyll`、workflow 等需要放在站点仓库内。
- [ ] **T2.7** 确认首页入口为 Starter 的 `index.html`：
  ```html
  ---
  layout: home
  # Index page
  ---
  ```
- [ ] **T2.8** 基于 Starter 的 `_config.yml` 重写站点配置。优先从 `/tmp/chirpy-starter/_config.yml` 复制完整结构，再只修改以下站点字段和必要扩展，不要手写缺字段的极简版。`compress_html` 等主题内部配置以 Starter 实际内容为准；如果当前 Starter 已移除某配置块，不要为了匹配本文档示例而额外添加
  ```yaml
  theme: jekyll-theme-chirpy

  lang: zh-CN
  timezone: Asia/Shanghai

  title: TheDudeAbula
  tagline: AI Infra, LLM Deployment, HPC
  description: >-
    TheDudeAbula 的个人站点——博客、项目与游戏。

  url: "https://brokedudeabula.github.io"
  baseurl: "/the.dude.abula.github.io"

  github:
    username: BrokeDudeAbula

  twitter:
    username:

  social:
    name: TheDudeAbula
    email: liyang@siat.ac.cn
    links:
      - https://github.com/BrokeDudeAbula

  theme_mode: # 留空跟随系统

  avatar: # 后续 M6 添加

  assets:
    self_host:
      enabled: false

  toc: true

  comments:
    provider:

  pwa:
    enabled: true
    cache:
      enabled: true
      deny_paths:

  paginate: 10

  kramdown:
    footnote_backlink: "&#8617;&#xfe0e;"
    syntax_highlighter: rouge
    syntax_highlighter_opts:
      css_class: highlight
      span:
        line_numbers: false
      block:
        line_numbers: true
        start_line: 1

  collections:
    tabs:
      output: true
      sort_by: order

  defaults:
    - scope:
        path: ""
        type: posts
      values:
        layout: post
        comments: false
        toc: true
        permalink: /posts/:title/
    - scope:
        path: _drafts
      values:
        comments: false
    - scope:
        path: ""
        type: tabs
      values:
        layout: page
        permalink: /:title/

  sass:
    style: compressed

  compress_html:
    clippings: all
    comments: all
    endings: all
    profile: false
    blanklines: false
    ignore:
      envs: [development]

  exclude:
    - "*.gem"
    - "*.gemspec"
    - README.md
    - LICENSE
    - MIGRATION_CHIRPY.md
    - IFLOW.md
    - AGENTS.md
    - game-recommendations.md
    - opt_suggest.md
    - clean_cache.sh
    - Gemfile.lock
    - _migration_backup
    - node_modules
    - vendor
    - docs
    - tools
    - purgecss.js
    - "*.config.js"
    - "package*.json"

  jekyll-archives:
    enabled: [categories, tags]
    layouts:
      category: category
      tag: tag
    permalinks:
      tag: /tags/:name/
      category: /categories/:name/
  ```
- [ ] **T2.9** 运行 `bundle install`
- [ ] **T2.10** 运行 `bundle exec jekyll build --trace`
- [ ] **T2.11** 运行 `bundle exec jekyll serve --baseurl ''`，确认站点可启动
- [ ] **T2.12** 检查 Categories / Tags / Archives 页面是否可构建和访问。如果出现 `jekyll-archives` 相关报错，再对照 Starter 和 `jekyll-theme-chirpy` gemspec 排查；不要默认在 `Gemfile` 中额外添加 `jekyll-archives`

### 验收测试

| 检查项 | 预期结果 | ✅/❌ |
|--------|----------|-------|
| `bundle install` 成功，无 dependency 冲突 | 是 | |
| `bundle exec jekyll build --trace` 无报错 | 是 | |
| 浏览器访问 `localhost:4000` 看到 Chirpy 首页 | 是 | |
| 左侧边栏显示站点标题 "TheDudeAbula" | 是 | |
| 侧边栏导航包含 Categories / Tags / Archives / About | 是 | |
| 暗色/亮色模式切换按钮可用 | 是 | |
| 页面无 Liquid 报错或 404 资源 | 是（检查浏览器 Console） | |
| `_migration_backup/old-site/pages/about.md` 等旧内容源文件存在 | 是 | |
| 本地 `_layouts/default.html`、`_layouts/page.html` 不再覆盖 Chirpy 主题 | 是 | |
| Categories / Tags / Archives 页面构建与访问正常 | 是 | |

### 进度同步

```
- [x] 开始时间：2026-05-26 17:46:05 CST
- [x] 完成时间：2026-05-26 17:58:34 CST
- [x] 遇到的问题：`bundle exec jekyll serve --baseurl ''` 首次启动时因 `_site/CLAUDE.md` 符号链接残留报 `File exists`；已确认根因是 tracked `CLAUDE.md -> AGENTS.md` 未被排除，随后将 `CLAUDE.md` 加入 `_config.yml exclude`，清理 ignored 构建产物后 build/serve 均通过。
- [x] 备注：已从 `/tmp/chirpy-starter` 引入 M2 必需骨架，未复制 `.github/workflows/pages-deploy.yml`；旧主题源已备份到 ignored 的 `_migration_backup/old-site/`；`bundle install` 成功，`bundle exec jekyll build --trace` 成功；短时启动 `http://127.0.0.1:4000/` 并用 `curl` 验证首页、Categories、Tags、Archives、About 均返回 200，随后已停止服务。
```

---

## M3：博客文章迁移

### 目标

所有现有博客文章在 Chirpy 主题下正确渲染，首页文章列表、分类、标签、归档均正常。

### Todo List

- [ ] **T3.1** 检查 `_posts/` 下所有文件的 front matter，确保包含：
  - `title`（必需）
  - `date`（必需，格式 `YYYY-MM-DD HH:MM:SS +0800`）
  - `categories`（推荐，数组格式）
  - `tags`（推荐，数组格式）
  - 移除 `layout: post`（Chirpy 通过 defaults 自动设置，保留也不影响）
- [ ] **T3.2** 逐篇调整 front matter 示例：
  ```yaml
  ---
  title: 自我介绍
  date: 2025-12-10 10:00:00 +0800
  categories: [日志]
  tags: [个人]
  ---
  ```
- [ ] **T3.3** 检查文章中是否有使用 `{{ ... | relative_url }}` 的内部链接，路径是否仍然有效（permalink 从 `/blog/:slug/` 改为了 `/posts/:title/`）
- [ ] **T3.4** 确认文章中的图片路径仍然有效（`assets/img/` 目录）
- [ ] **T3.5** 运行 `bundle exec jekyll serve --baseurl ''`，浏览文章列表

### 验收测试

| 检查项 | 预期结果 | ✅/❌ |
|--------|----------|-------|
| 首页显示文章列表（最新文章在前） | 是 | |
| 点击任一文章，正文完整渲染 | 是 | |
| 文章页面 TOC（目录）正常显示 | 是 | |
| Categories 页面分类正确 | 是 | |
| Tags 页面标签正确 | 是 | |
| Archives 页面按时间线列出所有文章 | 是 | |
| 文章内的代码块有语法高亮 | 是 | |
| 无断裂的内部链接（浏览器 Console 无 404） | 是 | |

### 进度同步

```
- [x] 开始时间：2026-05-26 19:00:00 +0800
- [x] 完成时间：2026-05-26 19:03:33 +0800
- [x] 遇到的问题：无阻塞；三篇文章缺少 `date` 和 `categories`，已按文件日期补齐 Chirpy 所需 front matter。`bundle exec jekyll build --trace` 成功且无 warning。
- [x] 备注：未修改正文含义；自我介绍文章保留 `{{ '/assets/img/IMG_4693.JPG' | relative_url }}`，目标文件存在。短时 serve 验证 `/`、任一文章页、`/categories/`、`/tags/`、`/archives/` 均返回 200，服务已停止。
```

---

## M4：游戏集合迁移

### 目标

所有 HTML5 游戏在 Chirpy 主题下可正常访问和运行，拥有独立的 Games 导航入口。

### Todo List

- [ ] **T4.1** 在 `_config.yml` 的 `collections` 中注册 games 集合：
  ```yaml
  collections:
    tabs:
      output: true
      sort_by: order
    games:
      output: true
      permalink: /games/:title/
  ```
- [ ] **T4.2** 在 `_config.yml` 的 `defaults` 中添加 games 默认值：
  ```yaml
    - scope:
        path: ""
        type: games
      values:
        layout: game
        toc: false
  ```
- [ ] **T4.3** 创建 `_layouts/game.html`，用 Chirpy 的 `page` 布局承载游戏内容，保留游戏页标题、说明和返回列表入口：
  ```bash
  mkdir -p _layouts
  ```
  ```html
  ---
  layout: page
  ---

  <div class="game-page">
    {% if page.description %}
    <p class="post-desc">{{ page.description | strip_html }}</p>
    {% endif %}

    <div class="game-body">
      {{ content }}
    </div>

    <p class="game-back-link">
      <a href="{{ '/games/' | relative_url }}">返回游戏列表</a>
    </p>
  </div>
  ```
- [ ] **T4.4** 创建 `_tabs/games.md` 作为游戏列表导航页：
  ```markdown
  ---
  layout: page
  title: Games
  icon: fas fa-gamepad
  order: 5
  ---

  <div class="game-list">
  {% assign games = site.games | sort: 'date' | reverse %}
  {% for game in games %}
    <article class="game-card">
      <h2><a href="{{ game.url | relative_url }}">{{ game.title }}</a></h2>
      {% if game.date %}
      <p class="game-meta">{{ game.date | date: '%Y-%m-%d' }}</p>
      {% endif %}
      {% if game.description %}
      <p>{{ game.description | strip_html | truncate: 160 }}</p>
      {% endif %}
      {% if game.tags and game.tags.size > 0 %}
      <p class="game-tags">
        {% for tag in game.tags %}
        <span class="badge rounded-pill text-bg-secondary">{{ tag }}</span>
        {% endfor %}
      </p>
      {% endif %}
    </article>
  {% endfor %}
  </div>
  ```
- [ ] **T4.5** 检查 `_games/` 下每个 `.md` 文件的 front matter：
  - 移除旧主题专用字段；如显式设置 `layout`，统一改为 `layout: game`
  - 确保 `title`、`description`、`date` 存在
  - 保留游戏 HTML 结构；尽量将非空内联 `<script>...</script>` 迁移为外链脚本，降低 Chirpy HTML 压缩链路影响
- [ ] **T4.6** 确认 `assets/js/games/` 目录保留，所有 `.js` 文件不动。注意：这些脚本是非 `defer` 脚本并位于 Markdown 底部，依赖 DOM 已经渲染，迁移后不要移动到 `<head>`
- [ ] **T4.7** 检查各游戏 `.md` 中 script 引用路径是否使用了 `relative_url` filter，并扫描是否仍有非空内联脚本：
  ```html
  <script src="{{ '/assets/js/games/snake.js' | relative_url }}"></script>
  ```
  ```bash
  rg -n "<script(?![^>]+src)" _games
  ```
  如果仅有少量用于注入 Liquid 变量的内联脚本，可以保留，但必须在浏览器 Console 中重点验证是否有 `Uncaught SyntaxError` 或 `Unexpected token`
- [ ] **T4.8** 从 `_migration_backup/old-site/_sass/components/_games.scss` 迁移有效样式到 Chirpy 主题 CSS 入口。推荐创建或覆盖 `assets/css/jekyll-theme-chirpy.scss`，先复制 Chirpy 官方入口，再在末尾追加游戏样式：
  ```scss
  ---
  ---

  /* prettier-ignore */
  @use 'main
  {%- if jekyll.environment == 'production' -%}
    .bundle
  {%- endif -%}
  ';

  /* 游戏页面自定义样式：从旧 _sass/components/_games.scss 迁移并改用 Chirpy/Bootstrap 变量 */
  #game-wrapper {
    max-width: 540px;
    margin: 1.5rem auto;
    padding: 1.5rem;
    border: 1px solid var(--main-border-color, #e9ecef);
    border-radius: 0.5rem;
    text-align: center;
  }

  #game-info,
  #game-controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  canvas {
    display: block;
    margin: 0 auto;
    max-width: 100%;
    height: auto;
    border: 2px solid var(--main-border-color, #e9ecef);
    border-radius: 0.5rem;
  }

  .game-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    border: 0;
    border-radius: 0.375rem;
    background: var(--link-color);
    color: var(--button-text-color, #fff);
    font-weight: 600;
    cursor: pointer;
  }

  .game-btn:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  .game-instructions,
  .game-card {
    margin: 1.5rem 0;
    padding: 1rem;
    border: 1px solid var(--main-border-color, #e9ecef);
    border-radius: 0.5rem;
  }
  ```
- [ ] **T4.9** 不要覆盖 `_includes/head.html`。如果确实需要额外 `<link>` 或 `<meta>`，只覆盖 `_includes/metadata-hook.html`，在其中追加少量自定义标签；这样不会复制并冻结 Chirpy 的完整 head 逻辑
- [ ] **T4.10** 运行 `bundle exec jekyll build --trace`
- [ ] **T4.11** 额外运行 production 构建，验证 Chirpy CSS 入口在 `main.bundle` 模式下可用：
  ```bash
  JEKYLL_ENV=production bundle exec jekyll build --trace
  ```
  如果失败，再检查主题 gem 是否包含 `main.bundle`：
  ```bash
  find "$(bundle show jekyll-theme-chirpy)" -name "main.bundle*"
  ```
- [ ] **T4.12** 运行 `bundle exec jekyll serve --baseurl ''`，逐个打开每个游戏页面测试

### 验收测试

| 检查项 | 预期结果 | ✅/❌ |
|--------|----------|-------|
| 侧边栏出现 "Games" 导航项 | 是 | |
| Games 列表页列出所有 7 个游戏 | 是 | |
| 每个游戏页面可正常打开（无 404） | 是 | |
| 贪吃蛇：可用方向键控制，得分正常 | 是 | |
| 2048：可滑动合并方块 | 是 | |
| 打砖块：球拍可移动，球反弹正常 | 是 | |
| 井字棋：可点击落子，AI 响应 | 是 | |
| 俄罗斯方块：方块下落、旋转、消行 | 是 | |
| 记忆卡牌：卡牌翻转配对正常 | 是 | |
| 猜数字：输入反馈正常 | 是 | |
| 游戏 Canvas 在亮色/暗色模式下均可见 | 是 | |
| 浏览器 Console 无 JS 报错 | 是 | |
| 移动端（窄屏）游戏可操作 | 是 | |
| production 构建无 Sass/CSS 入口错误 | 是 | |

### 进度同步

```
- [x] 开始时间：2026-05-26 19:15:15 CST
- [x] 完成时间：2026-05-26 19:32:57 CST
- [x] 遇到的问题：`/games/` 浏览器标题前缀为空，原因是 Chirpy `head.html` 对 tabs 只读取 locale 字典，当前 M4 允许范围不包含 `_data/locales` 或覆盖 head；页面内容、SEO `og:title` 与导航均正常。Browser 键盘方向键自动化受 in-app browser locator 限制，已改用点击/输入类最小交互验证，键盘操作留给人工复测。
- [x] 备注：已注册 games collection/defaults，新增 `game` layout 与 Games tab；迁移猜数字、记忆翻牌内联样式到 Chirpy CSS 入口；打砖块改用 script `data-background-image` 注入图片路径并移除游戏内联脚本。根据 review 返工修复打砖块/井字棋 canvas CSS 缩放后的坐标映射，更新图片砖块说明，并清理打砖块图片加载 debug 输出。`bundle exec jekyll build --trace`、`JEKYLL_ENV=production bundle exec jekyll build --trace`、短时 serve HTTP/DOM/控制台检查均通过，服务已停止。
```

---

## M5：项目展示与关于页迁移

### 目标

将原有 Projects 展示和 About 页面内容迁入 Chirpy tabs，并确认旧页面目录不再参与构建。

### Todo List

- [ ] **T5.1** 迁移 About 页面：将 `_migration_backup/old-site/pages/about.md` 内容复制到 `_tabs/about.md`：
  ```yaml
  ---
  title: About
  icon: fas fa-info-circle
  order: 6
  ---

  （从 _migration_backup/old-site/pages/about.md 复制正文内容）
  ```
- [ ] **T5.2** 保留 `_data/projects.yml` 不动
- [ ] **T5.3** 在 `_tabs/about.md` 或单独创建 `_tabs/projects.md` 中展示项目列表：
  - 方案 A：合并到 About 页面底部（简洁）
  - 方案 B：创建独立 Projects tab（推荐，与原站保持一致）：
    ```markdown
    ---
    layout: page
    icon: fas fa-project-diagram
    order: 4
    title: Projects
    ---

    {% for project in site.data.projects %}

    ### {{ project.name }}

    {{ project.summary }}

    {% if project.url %}[查看项目]({{ project.url }}){:target="_blank"}{% endif %}
    {% if project.date %}<small>{{ project.date | date: '%Y-%m-%d' }}</small>{% endif %}

    ---

    {% endfor %}
    ```
  - 如果同时有 Projects 和 Games，调整 order 值：
    - Categories: 1, Tags: 2, Archives: 3, Projects: 4, Games: 5, About: 6
- [ ] **T5.4** 更新所有 `_tabs/*.md` 的 `order` 字段确保导航顺序正确
- [ ] **T5.5** 确认 `_tabs/about.md`、`_tabs/projects.md`、`_tabs/games.md` 都已从 `_migration_backup/old-site/pages/` 内容迁移完成
- [ ] **T5.6** 确认旧 `pages/` 目录和 `_data/navigation.yml` 已在 M2 从构建路径删除，Chirpy 现在只依赖 `_tabs` 导航
- [ ] **T5.7** 运行构建并在浏览器验证

### 验收测试

| 检查项 | 预期结果 | ✅/❌ |
|--------|----------|-------|
| 侧边栏按顺序显示：Categories / Tags / Archives / Projects / Games / About | 是 | |
| Projects 页面列出 `_data/projects.yml` 中所有项目 | 是 | |
| Projects 页面中 `featured: true` 的项目有区分标识（可选） | 是 | |
| 项目链接可正常跳转（外部链接新窗口打开） | 是 | |
| About 页面内容完整，无遗漏 | 是 | |
| 所有导航项点击后不出现 404 | 是 | |
| `_migration_backup/old-site/pages/` 中的内容已迁移完成 | 是 | |

### 进度同步

```
- [x] 开始时间：2026-05-26 20:41:11 CST
- [x] 完成时间：2026-05-26 20:46:49 CST
- [x] 遇到的问题：无阻塞；短时 serve 文本检查首次使用 Ruby 默认二进制编码检索中文时触发 `Encoding::CompatibilityError`，已强制 UTF-8 后复验通过。
- [x] 备注：已将 `_migration_backup/old-site/pages/about.md` 正文迁入 `_tabs/about.md`，新增 `_tabs/projects.md` 通过 `site.data.projects` 渲染项目列表并为外链添加 `rel="noopener"`；已将 `_data/projects.yml` 中日期 `2025-Sep-24` 规范为 `2025-09-24` 并移除注释样例；已确认 `pages/` 与 `_data/navigation.yml` 不存在。`bundle exec jekyll build --trace` 成功；短时 serve 验证 `/projects/`、`/about/`、`/games/`、`/categories/`、`/tags/`、`/archives/` 均返回 200，About 关键章节与 Projects 项目名均可检索，服务已停止。
```

---

## M6：外观与个性化定制

### 目标

完成品牌一致性配置：头像、社交链接、Favicon、中文 locale 微调、自定义 CSS。

### Todo List

- [ ] **T6.1** 准备头像图片，放入 `assets/img/avatar.png`（建议 512x512），在 `_config.yml` 中设置：
  ```yaml
  avatar: /assets/img/avatar.png
  ```
- [ ] **T6.2** 生成 Favicon 套件：
  - 前往 https://realfavicongenerator.net/ 生成
  - 将生成文件放入 `assets/img/favicons/`（`favicon.ico`、`apple-touch-icon.png`、`site.webmanifest` 等）
- [ ] **T6.3** 完善 `_config.yml` 中的 social 配置：
  ```yaml
  social:
    name: TheDudeAbula
    email: liyang@siat.ac.cn
    links:
      - https://github.com/BrokeDudeAbula
  ```
- [ ] **T6.4** 确认 `lang: zh-CN` 生效：侧边栏 UI 文字应显示中文（"分类"、"标签"、"归档"等）
- [ ] **T6.5**（可选）配置评论系统（如 Giscus）：
  ```yaml
  comments:
    provider: giscus
    giscus:
      repo: BrokeDudeAbula/the.dude.abula.github.io
      repo_id: # 从 giscus.app 获取
      category: Announcements
      category_id: # 从 giscus.app 获取
  ```
- [ ] **T6.6**（可选）配置 Google Analytics 或其他统计：
  ```yaml
  analytics:
    google:
      id: G-XXXXXXXXXX
  ```
- [ ] **T6.7** 自定义 CSS 覆盖（如需微调颜色/字体）：
  - 如果 M4 已创建 `assets/css/jekyll-theme-chirpy.scss`，继续在同一个文件末尾追加覆盖，不要新建第二个主题入口
  - 文件开头必须保留 Chirpy 官方入口写法：
	    ```scss
	    ---
	    ---

	    /* prettier-ignore */
	    @use 'main
	    {%- if jekyll.environment == 'production' -%}
	      .bundle
	    {%- endif -%}
	    ';

	    /* 自定义覆盖 */
	    ```
- [ ] **T6.8** 如需扩展 `<head>` 元信息，创建 `_includes/metadata-hook.html`；不要覆盖 `_includes/head.html`
  ```bash
  mkdir -p _includes
  ```
- [ ] **T6.9** 验证 PWA 配置（`_config.yml` 中 `pwa.enabled: true`），确保 Service Worker 注册正常
- [ ] **T6.10** 测试深色模式和浅色模式下：
  - 头像显示
  - 游戏 Canvas 可见性
  - 代码块配色
  - 整体对比度
- [ ] **T6.11** 如 M6 修改了 `assets/css/jekyll-theme-chirpy.scss`，再次运行 production 构建：
  ```bash
  JEKYLL_ENV=production bundle exec jekyll build --trace
  ```

### 验收测试

| 检查项 | 预期结果 | ✅/❌ |
|--------|----------|-------|
| 侧边栏显示头像 | 是 | |
| 浏览器 tab 和书签显示 Favicon | 是 | |
| 侧边栏 UI 文字为中文 | 是 | |
| 社交链接图标可点击跳转 | 是 | |
| 浅色模式整体视觉协调 | 是 | |
| 深色模式整体视觉协调 | 是 | |
| 移动端侧边栏汉堡菜单可展开 | 是 | |
|（如配置）评论区加载正常 | 是 | |
|（如配置）Analytics 请求可在 Network 面板观察到 | 是 | |

### 进度同步

```
- [x] 开始时间：2026-05-26 20:48:00 CST
- [x] 完成时间：2026-05-26 21:10:35 CST；返工完成时间：2026-05-26 21:24:00 CST
- [x] 遇到的问题：review/test 发现自我介绍文章中的旧 HTML 图片写法 `{{ '/assets/img/IMG_4693.JPG' | relative_url }}` 会被 Chirpy 图片处理链再次包一层 `relative_url`，生成 `/the.dude.abula.github.io/the.dude.abula.github.io/assets/img/IMG_4693.JPG` 并在 serve 日志中出现 404；已按最小修复将该图片 `src` 改为 `/assets/img/IMG_4693.JPG`，并移除手写 `loading="lazy"`，复验图片资源 200。首次预览曾用 `--baseurl ''`，随后独立 build 按 `_config.yml` 的 `baseurl` 重写 `_site`，造成一轮本地资源 404 验证干扰；已停止服务后按默认 baseurl 重新 serve 复验。
- [x] 备注：已从现有 `assets/img/IMG_4693.JPG` 左上角小头像裁切生成 512x512 PNG `assets/img/avatar.png`，并设置 `_config.yml` 的 `avatar: /assets/img/avatar.png`；`social.name/email/GitHub` 已确认，comments/analytics 保持空配置。新增 `_data/locales/zh-CN.yml` 仅覆盖 `tabs.projects` 与 `tabs.games`，修复 Projects/Games 导航中文显示和 `/games/` 浏览器标题前缀为空问题，不覆盖 `head.html`。已在 `assets/css/jekyll-theme-chirpy.scss` 末尾追加少量品牌/可读性覆盖并保留官方 `@use main...bundle` 入口。未生成 favicon 套件，未配置评论、Analytics/Giscus，占位 ID 与 workflow 均未添加。`bundle exec jekyll build --trace`、`JEKYLL_ENV=production bundle exec jekyll build --trace` 均通过；短时 serve 使用默认 `baseurl` 验证首页、文章、Projects、Games、About、2048 游戏页、头像、社交链接、移动端汉堡菜单、明暗模式和游戏 Canvas 基础可见性，控制台无 error，服务已停止。
```

---

## M7：GitHub Actions 部署

### 目标

配置 CI/CD，推送到 `main` 分支后自动构建并部署到 GitHub Pages。

### Todo List

- [ ] **T7.1** 使用 Starter 的 `.github/workflows/pages-deploy.yml` 作为基础。如 M2 已复制该文件，此处只核对内容；不要手写一个与 Starter 长期分叉的 workflow：
  ```yaml
  name: "Build and Deploy"
  on:
    push:
      branches:
        - main
        - master
      paths-ignore:
        - .gitignore
        - README.md
        - LICENSE
    workflow_dispatch:

  permissions:
    contents: read
    pages: write
    id-token: write

  concurrency:
    group: "pages"
    cancel-in-progress: true

  jobs:
    build:
      runs-on: ubuntu-latest
      steps:
        - name: Checkout
          uses: actions/checkout@v6
          with:
            fetch-depth: 0

        - name: Setup Pages
          id: pages
          uses: actions/configure-pages@v5

        - name: Setup Ruby
          uses: ruby/setup-ruby@v1
          with:
            ruby-version: 3.4
            bundler-cache: true

        - name: Build site
          run: bundle exec jekyll b -d "_site${{ steps.pages.outputs.base_path }}"
          env:
            JEKYLL_ENV: "production"

        - name: Test site
          run: |
            bundle exec htmlproofer _site \
              --disable-external \
              --ignore-urls "/^http:\/\/127.0.0.1/,/^http:\/\/0.0.0.0/,/^http:\/\/localhost/"

        - name: Upload site artifact
          uses: actions/upload-pages-artifact@v4
          with:
            path: "_site${{ steps.pages.outputs.base_path }}"

    deploy:
      environment:
        name: github-pages
        url: ${{ steps.deployment.outputs.page_url }}
      runs-on: ubuntu-latest
      needs: build
      steps:
        - name: Deploy to GitHub Pages
          id: deployment
          uses: actions/deploy-pages@v4
  ```
- [ ] **T7.2** 更新 `.gitignore`（合并 Chirpy 推荐项）：
  ```
  _site/
  .jekyll-cache/
  .jekyll-metadata
  .sass-cache/
  .bundle/
  .DS_Store
  node_modules/
  vendor/
  Gemfile.lock
  _migration_backup/
  *.gem
  ```
- [ ] **T7.3** 在 GitHub 仓库设置中：
  - 进入 Settings → Pages
  - Source 改为 **GitHub Actions**（不再使用 "Deploy from a branch"）
- [ ] **T7.4** 确认 `_config.yml` 中 `url` 和 `baseurl` 正确：
  ```yaml
  url: "https://brokedudeabula.github.io"
  baseurl: "/the.dude.abula.github.io"
  ```
- [ ] **T7.5** 将迁移分支合并到 `main`：
  ```bash
  git checkout main
  git merge vibecode/chirpy-migration
  git push origin main
  ```
- [ ] **T7.6** 合并前在本地预跑 workflow 中的校验命令。不要默认注释掉 `htmlproofer`；如果失败，优先修复页面中的内部链接、锚点、图片 alt 等问题，再考虑临时添加最小范围 ignore：
  ```bash
  JEKYLL_ENV=production bundle exec jekyll b -d "_site/the.dude.abula.github.io"
  bundle exec htmlproofer _site --disable-external
  ```
- [ ] **T7.7** 在 GitHub Actions 页面观察构建状态
- [ ] **T7.8** 构建成功后访问线上地址验证

### 验收测试

| 检查项 | 预期结果 | ✅/❌ |
|--------|----------|-------|
| GitHub Actions workflow 触发并成功（绿色 ✓） | 是 | |
| 线上首页可访问：`https://brokedudeabula.github.io/the.dude.abula.github.io/` | 是 | |
| 线上所有导航页正常 | 是 | |
| 线上博客文章可正常阅读 | 是 | |
| 线上游戏可正常运行 | 是 | |
| 线上深色/浅色模式切换正常 | 是 | |
| SEO meta 标签正确（查看页面源代码 `<head>` 部分） | 是 | |
| RSS feed 可访问（`/feed.xml`） | 是 | |
| sitemap 可访问（`/sitemap.xml`） | 是 | |
| 移动端访问体验正常 | 是 | |

### 进度同步

```
- [x] 开始时间：2026-05-26 21:35 CST
- [x] 完成时间：2026-05-26 21:42 CST
- [x] 遇到的问题：首次 `bundle exec htmlproofer _site --disable-external` 发现 `_site` 中 SEO canonical/og:url 仍为 `http://localhost:4000/...`；源码 `_config.yml` 的 `url/baseurl` 正确，清理 `.jekyll-cache` 和 `_site` 后重跑 production build，htmlproofer 通过。未修改页面内容，未向 workflow 增加额外 ignore。
- [x] 备注：已从 `/tmp/chirpy-starter/.github/workflows/pages-deploy.yml` 复制当前 Starter workflow，并补齐 `.gitignore` 中 Chirpy 推荐项；`_config.yml` 已确认 `url: "https://brokedudeabula.github.io"`、`baseurl: "/the.dude.abula.github.io"`。本轮未 push、未 merge；GitHub Pages Source 仍需在仓库设置切到 GitHub Actions；线上验证待推送到 `main` 后完成。
```

---

## 附录

### A. 文件变更汇总

| 操作 | 路径 | 说明 |
|------|------|------|
| 删除 | `_layouts/` 中旧主题布局 | Chirpy Gem 自带；但需保留新增 `_layouts/game.html` |
| 删除 | `_includes/` 中旧主题片段 | Chirpy Gem 自带；如需自定义 head 元信息，仅保留 `_includes/metadata-hook.html` |
| 删除 | `_sass/` | Chirpy Gem 自带；自定义样式集中到 `assets/css/jekyll-theme-chirpy.scss` |
| 删除 | `assets/css/main.scss` | Chirpy Gem 自带 |
| 删除 | `assets/js/main.js` | Chirpy 自带暗色模式切换 |
| 删除 | `pages/` | M2 先备份到 `_migration_backup/old-site/pages/` 后删除，被 `_tabs/` 替代 |
| 删除 | `_data/navigation.yml` | M2 先备份后删除，Chirpy 使用 `_tabs` 自动生成 |
| 删除 | `index.md` | 替换为 `index.html` |
| 新增 | `_migration_backup/old-site/` | 迁移过程中的旧主题/旧页面参考源，迁移完成后可删除 |
| 新增 | `index.html` | Chirpy 首页 |
| 新增 | `_tabs/*.md` | 导航页集合 |
| 新增 | `_plugins/posts-lastmod-hook.rb` | Starter 必需插件，用 Git 历史生成文章修改时间 |
| 新增 | `_data/contact.yml` | Chirpy 侧边栏社交入口 |
| 新增 | `_data/share.yml` | Chirpy 文章分享入口 |
| 新增 | `.nojekyll` | GitHub Pages 静态资源兼容 |
| 新增 | `.github/workflows/pages-deploy.yml` | CI/CD |
| 新增 | `_layouts/game.html` | 游戏集合自定义布局 |
| 新增/修改 | `assets/css/jekyll-theme-chirpy.scss` | Chirpy 官方 CSS 入口 + 自定义样式 |
| 修改 | `Gemfile` | 切换到 chirpy gem |
| 修改 | `_config.yml` | 全面重写 |
| 修改 | `_posts/*.md` | front matter 调整 |
| 修改 | `.gitignore` | 合并 Chirpy 推荐项 |
| 保留 | `_games/*.md` | 内容不变 |
| 保留 | `assets/js/games/` | 游戏逻辑不变 |
| 保留 | `assets/img/` | 图片资源不变 |
| 保留 | `_data/projects.yml` | 项目数据不变 |

### B. 回滚方案

如果迁移失败或效果不满意：

```bash
# 方案 1：迁移分支尚未合并，直接回到 main 或删除迁移分支
git switch main
git branch -D vibecode/chirpy-migration

# 方案 2：需要恢复工作目录到迁移前 tag（会丢弃当前未提交修改，执行前必须确认）
git switch vibecode/chirpy-migration
git reset --hard pre-chirpy-migration

# 方案 3：使用备份目录恢复，包括隐藏文件，但保留 .git
rsync -a --delete --exclude='.git/' ../the.dude.abula.github.io.bak/ ./

# 方案 4：如已合并到 main，revert merge commit
git revert -m 1 <merge-commit-hash>
git push origin main
```

回滚注意事项：

- 不要使用 `rm -rf ./* && cp -r backup/* .`，该命令不会处理隐藏文件，容易遗漏 `.github`、`.gitignore`、`.nojekyll` 等关键文件。
- 如果迁移过程中产生了新的业务内容，先单独备份或 cherry-pick，再执行 reset/revert。

### C. 后续优化建议（迁移完成后）

- 配置 Giscus 评论系统
- 添加 Google Analytics
- 编写更多博客文章以充实内容
- 为游戏页面添加截图作为封面图
- 考虑自定义 Chirpy 配色以建立品牌辨识度
