# 项目概述

这是 TheDudeAbula 的个人站点，基于 Jekyll 静态站点生成器构建，使用 Liquid 模板引擎和 SCSS 样式预处理器。项目托管在 GitHub Pages 上，用于展示个人博客文章、项目作品集和网页小游戏。

## 技术栈

- **Jekyll**: 静态站点生成器
- **Liquid**: 模板引擎
- **SCSS**: CSS 预处理器
- **Ruby**: 运行环境（需要 Ruby 和 Bundler）
- **Markdown**: 内容编写（使用 Kramdown 解析器）
- **JavaScript**: 交互功能和游戏逻辑

## 项目结构

```
the.dude.abula.github.io/
├── _config.yml              # Jekyll 全局配置（URL、插件、集合等）
├── Gemfile                  # Ruby 依赖管理
├── Gemfile.lock             # 依赖版本锁定
├── index.md                 # 首页
├── clean_cache.sh           # 缓存清理脚本
├── README.md                # 项目说明文档
├── game-recommendations.md  # 游戏推荐参考文档
├── opt_suggest.md           # 站点优化建议文档
├── IFLOW.md                 # 项目文档（本文件）
├── _data/                   # 结构化数据
│   ├── navigation.yml       # 站点导航菜单
│   └── projects.yml         # 项目列表（含精选项目）
├── _games/                  # 游戏内容集合
│   ├── 2048.md             # 2048 游戏页面
│   ├── breakout.md         # 打砖块游戏页面
│   ├── snake.md            # 贪吃蛇游戏页面
│   └── tictactoe.md        # 井字棋游戏页面
├── _includes/               # 可复用的 HTML 片段
│   ├── head.html           # HTML 头部（meta、样式、SEO）
│   ├── header.html         # 站点头部导航
│   ├── hero.html           # 首页 Hero 区域
│   └── footer.html         # 站点页脚
├── _layouts/                # 页面布局模板
│   ├── default.html        # 默认布局
│   ├── page.html           # 独立页面布局
│   ├── post.html           # 博客文章布局
│   ├── blog.html           # 博客列表页布局
│   ├── game.html           # 单个游戏页面布局
│   └── games.html          # 游戏列表页布局
├── _posts/                  # 博客文章集合
│   ├── 2025-12-09-占位符.md
│   ├── 2025-12-10-自我介绍.md
│   └── 2025-12-11-提示词分享.md
├── _sass/                   # SCSS 样式模块
│   ├── base/               # 基础样式（重置、排版）
│   ├── components/         # 组件样式（布局、首页、项目、文章、游戏）
│   └── utilities/          # 工具类（变量）
├── assets/                  # 静态资源
│   ├── css/
│   │   └── main.scss       # 样式入口文件
│   ├── img/                # 图片资源
│   └── js/
│       ├── main.js         # 主题切换等通用 JavaScript
│       └── games/          # 游戏逻辑脚本
│           ├── 2048.js     # 2048 游戏逻辑
│           ├── breakout.js # 打砖块游戏逻辑
│           ├── snake.js    # 贪吃蛇游戏逻辑
│           └── tictactoe.js # 井字棋游戏逻辑
└── pages/                   # 独立页面
    ├── about.md            # 关于页面
    ├── blog.md             # 博客列表页
    ├── projects.md         # 项目展示页
    └── games.md            # 游戏列表页
└── _site/                   # Jekyll 构建输出目录（生成后）
```

## 环境要求

- **Ruby**: 已安装 Ruby
- **Bundler**: 版本 2.7.2（根据 Gemfile.lock）
- **依赖包**: github-pages 及相关插件

## 构建和运行

### 安装依赖

```bash
bundle install
```

### 本地开发服务器

```bash
# 使用默认配置（baseurl: /the.dude.abula.github.io）
bundle exec jekyll serve

# 或使用根路径预览
bundle exec jekyll serve --baseurl ''
```

- 默认端口：4000
- LiveReload：已启用
- 访问地址：
  - 默认配置：`http://localhost:4000/the.dude.abula.github.io/`
  - 根路径配置：`http://localhost:4000/`

### 本地构建验证

```bash
# 构建站点
bundle exec jekyll build

# 构建并显示详细错误信息（用于调试）
bundle exec jekyll build --trace
```

### 清理缓存

```bash
# 使用提供的清理脚本
./clean_cache.sh

# 或手动删除以下目录：
# - _site/
# - .jekyll-cache/
# - .sass-cache/
# - vendor/bundle/
```

## 内容管理

### 博客文章

- **位置**: `_posts/` 目录
- **命名格式**: `YYYY-MM-DD-标题.md`
- **Front Matter 必需字段**:
  - `layout: post`
  - `title`: 文章标题
  - `date`: 发布日期
- **Front Matter 可选字段**:
  - `tags`: 标签数组
  - `description`: 文章描述（用于 SEO 和 RSS）
  - `author`: 作者（默认为 TheDudeAbula）

**示例**:
```yaml
---
layout: post
title: 我的博客文章
date: 2025-01-06
tags: [技术, Jekyll]
description: 这是一篇关于 Jekyll 的文章
---
文章内容...
```

### 网页游戏

- **位置**: `_games/` 目录
- **命名格式**: `游戏名称.md`（如 `snake.md`、`2048.md`、`breakout.md`、`tictactoe.md`）
- **Front Matter 必需字段**:
  - `layout: game`
  - `title`: 游戏标题
  - `date`: 创建日期
- **Front Matter 可选字段**:
  - `description`: 游戏描述
  - `tags`: 标签数组
- **游戏逻辑**: 放置在 `assets/js/games/` 目录下，对应的 JavaScript 文件

**示例**:
```yaml
---
title: 贪吃蛇
description: 经典的贪吃蛇游戏
date: 2026-01-06
tags:
  - 经典游戏
  - 策略
  - 休闲
---
游戏说明和 HTML 结构...

<script src="{{ '/assets/js/games/snake.js' | relative_url }}"></script>
```

### 独立页面

- **位置**: `pages/`
- **Front Matter 必需字段**:
  - `layout: page`
  - `title`: 页面标题

**示例**:
```yaml
---
layout: page
title: 关于我
---
页面内容...
```

### 导航菜单

编辑 `_data/navigation.yml` 文件来管理站点导航：

```yaml
- title: Home
  url: /
- title: Blog
  url: /blog/
- title: Projects
  url: /projects/
- title: Games
  url: /games/
- title: About
  url: /about/
```

### 项目展示

编辑 `_data/projects.yml` 文件来管理项目列表：

```yaml
- name: 项目名称
  summary: 项目简介
  url: https://github.com/username/repo
  date: 2025-01-06
  featured: true  # 设为 true 会在首页显示
```

**当前项目列表**:
- taw-ys-zsh: 基于 taw-ys-zsh 改进的 Zsh 主题
- the.dude.abula.github.io: 本站点的 GitHub 仓库

## 样式定制

### 样式架构

- **入口文件**: `assets/css/main.scss`
- **模块化结构**: `_sass/` 目录按功能组织
  - `base/`: 重置样式和排版
  - `components/`: 页面组件样式（包括游戏样式）
  - `utilities/`: 变量和工具类

### 修改样式

1. 编辑 `_sass/` 目录下的对应 SCSS 文件
2. 或直接修改 `assets/css/main.scss` 导入顺序
3. 样式会自动编译为压缩的 CSS（`style: compressed`）

### 布局模板

- **default.html**: 基础布局，包含头部、主体、页脚
- **page.html**: 独立页面布局
- **post.html**: 博客文章布局
- **blog.html**: 博客列表页布局
- **game.html**: 单个游戏页面布局
- **games.html**: 游戏列表页布局

### 可复用组件

- **head.html**: HTML 头部（meta 标签、样式、SEO）
- **header.html**: 站点导航
- **hero.html**: 首页 Hero 区域
- **footer.html**: 站点页脚

## 配置说明

### Jekyll 配置 (_config.yml)

关键配置项：

```yaml
url: "https://brokedudeabula.github.io"
baseurl: "/the.dude.abula.github.io"
lang: zh-CN
timezone: Asia/Shanghai
permalink: pretty
collections:
  posts:
    output: true
    permalink: /blog/:slug/
  games:
    output: true
    permalink: /games/:slug/
```

### 插件

- `jekyll-feed`: 生成 RSS 订阅源
- `jekyll-seo-tag`: SEO 优化
- `jekyll-sitemap`: 生成站点地图

### 默认值

- 博客文章默认使用 `layout: post`
- 游戏页面默认使用 `layout: game`
- 独立页面默认使用 `layout: page`
- 所有页面默认使用 `layout: default` 作为基础

## 功能特性

### 主题切换

站点支持自动检测系统主题偏好（深色/浅色模式），通过 `assets/js/main.js` 实现。

### 网页游戏

当前支持的游戏：

1. **贪吃蛇** (`/games/snake/`)
   - 使用方向键或 WASD 控制
   - 支持暂停/继续
   - 记录得分和最高分

2. **2048** (`/games/2048/`)
   - 使用方向键或 WASD 滑动方块
   - 数字合并机制
   - 目标是达到 2048

3. **打砖块** (`/games/breakout/`)
   - 使用方向键或鼠标移动挡板
   - 反弹球消除砖块
   - 支持生命系统和得分记录
   - 支持图片砖块功能（拼图效果）

4. **井字棋** (`/games/tictactoe/`)
   - 点击棋盘放置棋子
   - 支持人机对战和双人对战
   - 人机模式可选择简单或困难难度
   - 记录胜负统计

游戏特性：
- 响应式设计，支持移动端
- 实时得分显示
- 游戏说明和操作指引
- 游戏结束提示

## 部署

### GitHub Pages 部署

1. 推送到 `main` 分支
2. GitHub Pages 会自动构建和部署
3. 访问地址：`https://brokedudeabula.github.io/the.dude.abula.github.io/`

### 自定义域名

如需使用自定义域名或用户页（username.github.io 而非 username.github.io/repo）：

1. 修改 `_config.yml` 中的 `url` 和 `baseurl`
2. 在仓库设置中配置自定义域名
3. 更新 README.md 中的访问路径说明

## 开发约定

### 文件命名

- 博客文章：`YYYY-MM-DD-标题.md`（使用英文标题或拼音）
- 游戏页面：使用游戏名称，如 `snake.md`、`2048.md`、`breakout.md`、`tictactoe.md`
- 页面文件：使用小写字母和连字符，如 `about.md`、`blog.md`、`games.md`、`projects.md`

### Front Matter

- 所有内容文件必须包含 Front Matter
- 使用 YAML 格式
- 必需字段：`layout`、`title`
- 日期格式：`YYYY-MM-DD`

### 代码风格

- SCSS：使用 2 空格缩进
- HTML：使用 Liquid 模板语法
- Markdown：使用 Kramdown（GitHub Flavored Markdown）
- JavaScript：使用 IIFE 模式避免全局污染

### 游戏开发规范

- 游戏逻辑文件放在 `assets/js/games/` 目录
- 使用 Canvas API 进行渲染
- 支持键盘和触摸操作（移动端）
- 实现得分和最高分记录（使用 localStorage）
- 提供清晰的游戏说明

### 提交规范

- 提交前运行构建验证：`bundle exec jekyll build`
- 确保没有构建错误
- 使用清晰的提交信息

## 常见问题

### 构建失败

1. 运行 `bundle exec jekyll build --trace` 查看详细错误
2. 检查 Ruby 和 Bundler 版本
3. 运行 `./clean_cache.sh` 清理缓存
4. 重新安装依赖：`bundle install`

### 样式未更新

1. 清理缓存：`./clean_cache.sh`
2. 检查 SCSS 文件语法
3. 确认 `assets/css/main.scss` 正确导入模块

### 本地预览路径问题

- 使用 `--baseurl ''` 参数以根路径访问
- 或在浏览器中使用完整路径：`http://localhost:4000/the.dude.abula.github.io/`

### 游戏无法加载

1. 检查 JavaScript 文件路径是否正确
2. 确认游戏逻辑文件在 `assets/js/games/` 目录
3. 检查浏览器控制台是否有错误信息
4. 确保 Canvas 元素 ID 与 JavaScript 代码匹配

## 参考文档

项目包含以下参考文档：

- **game-recommendations.md**: 基于 HTML5 Canvas + JavaScript 的游戏开发推荐列表，按难度和类型分类
- **opt_suggest.md**: 站点优化建议，包括技术栈分析、设计改进、性能优化等方面的详细建议

## 联系方式

- Email: liyang@siat.ac.cn
- GitHub: https://github.com/BrokeDudeAbula