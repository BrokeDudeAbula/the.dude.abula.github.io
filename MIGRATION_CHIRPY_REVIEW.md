# Chirpy 迁移方案 Review 意见

> 审阅对象：`MIGRATION_CHIRPY.md`（用户修订版）
>
> 审阅时间：2026-05-26

---

## 整体评价

修改后的方案比初版严谨很多，几个关键改进值得肯定：

- 策略声明改为"先导入 Starter 再迁移"，避免在旧主题上局部拼接 Chirpy
- M2 新增 `_migration_backup` 内部备份 + 从 Starter clone 复制骨架文件，兼顾灾难回滚与迁移过程中的查阅需求
- M4 引入自定义 `_layouts/game.html` 继承 `page` 布局，比直接用 `page` 更有扩展空间
- 回滚方案更安全（rsync 保留 `.git`，明确禁止 `rm -rf ./*`）
- 附录文件变更表反映了新增的 `_plugins`、`_data/contact.yml`、`.nojekyll` 等

---

## 需要注意的问题

### 问题 1：`jekyll-archives` 插件声明可能缺失

**位置**：M2 T2.8 `_config.yml`

**现象**：当前配置有 `jekyll-archives` 配置块，但没有在 `plugins:` 列表中显式声明该 gem。

**分析**：Chirpy Starter 本身不含 `plugins:` 键，它依赖 `jekyll-theme-chirpy` gemspec 将 `jekyll-archives` 作为 runtime dependency 传递引入。理论上 Gem 方式安装后会自动加载，但如果 Bundler 解析顺序或 Jekyll 版本差异导致未加载，构建会报 `Unknown tag 'archives'`。

**建议**：
- M2 验收时留意构建日志中是否有 `jekyll-archives` 相关 warning
- 如果报错，在 `Gemfile` 中补充：`gem "jekyll-archives", "~> 2.2"`

---

### 问题 2：`compress_html` 配置与 Chirpy 7.x 版本兼容性

**位置**：M2 T2.8 `_config.yml` 第 224-231 行

**现象**：文档中手写了 `compress_html` 配置块。

**分析**：Chirpy 7.x 的 HTML 压缩行为已内建在其布局链中（`_layouts/compress.html`）。如果 Starter 最新版的 `_config.yml` 已移除或调整了该配置项，保留它可能无害但也无效；若字段语义变更则可能产生冲突。

**建议**：
- T2.8 执行时以 `/tmp/chirpy-starter/_config.yml` 的实际内容为准，不要凭本文档代码块盲写
- 如果 Starter 中没有 `compress_html` 块，就不要加

---

### 问题 3（高风险）：`compress.html` 可能破坏游戏内联脚本

**位置**：M4 T4.3 `_layouts/game.html`

**现象**：game layout 声明 `layout: page`，页面会经过 `page.html` → `default.html` → `compress.html` 的完整布局链。

**分析**：Chirpy 的 `compress.html` 会压缩 HTML 输出，移除注释和多余空白。如果游戏 Markdown 文件中有**内联 `<script>` 块**且包含 `</` 字符串（例如正则表达式 `/</g`、字符串比较 `"</"` 等），压缩逻辑可能错误截断脚本内容，导致 JS syntax error。

**建议（按优先级排序）**：
1. **首选**：确保所有游戏脚本都通过外链 `<script src="...">` 引入，不内联 JS 代码。检查 `_games/*.md` 中是否有 `<script>...</script>` 内联逻辑块（非空的）
2. **备选**：如果确有内联脚本无法移除，在 `_layouts/game.html` front matter 中尝试禁用压缩：
   ```yaml
   ---
   layout: default
   ---
   ```
   直接继承 `default` 而非 `page`，然后手动包裹页面结构。但这会失去 page 布局的样式
3. **兜底**：在 `_config.yml` 的 `compress_html.ignore.envs` 中追加 `production`（影响全站，不推荐）

**验收关注点**：M4 验收时在浏览器 Console 中重点检查是否有 `Uncaught SyntaxError` 或 `Unexpected token` 报错。

---

### 问题 4：CSS 入口的 Liquid 模板在 production 环境依赖 `main.bundle`

**位置**：M4 T4.8 `assets/css/jekyll-theme-chirpy.scss`

**现象**：
```scss
@use 'main
{%- if jekyll.environment == 'production' -%}
  .bundle
{%- endif -%}
';
```

**分析**：这是 Chirpy 的特殊设计——在 production 环境加载预打包的 `_sass/main.bundle.scss`（或 `.css`）。该文件来自 Chirpy gem 内部。如果 gem 安装不完整或版本不匹配，production build 会报 `Can't find stylesheet to import 'main.bundle'`。

**建议**：
- 在 M4 或 M6 完成后，额外跑一次 production 模式构建验证：
  ```bash
  JEKYLL_ENV=production bundle exec jekyll build --trace
  ```
- 如果失败，检查 gem 安装路径下是否存在对应文件：
  ```bash
  find $(bundle show jekyll-theme-chirpy) -name "main.bundle*"
  ```

---

### 问题 5（中风险）：`htmlproofer` 可能因游戏页面而失败

**位置**：M7 T7.1 workflow 中的 `Test site` 步骤

**现象**：`html-proofer` 会检查所有内部链接和锚点。

**分析**：
- 游戏页面中如果有 `<a href="#game-wrapper">` 之类的锚点，但对应 ID 是由 JS 动态创建的，proofer 会报 "internal link to #game-wrapper does not exist"
- 游戏页面中可能有空的 `<a>` 标签或无 `alt` 的 `<img>`，proofer 也会报错
- 游戏列表页中 `{{ game.url | relative_url }}` 如果生成的路径有中文字符，proofer 的 URL 编码检查可能误报

**建议（二选一）**：
- **方案 A（推荐）**：初期先注释掉 `Test site` 步骤，等迁移稳定后再启用并逐步修复
- **方案 B**：给 htmlproofer 加忽略规则：
  ```yaml
  - name: Test site
    run: |
      bundle exec htmlproofer _site \
        --disable-external \
        --ignore-urls "/^http:\/\/127.0.0.1/,/^http:\/\/0.0.0.0/,/^http:\/\/localhost/" \
        --ignore-files "/games/"
  ```

---

### 问题 6：M5 Projects tab 的 Liquid 循环输出 Markdown 需要空行

**位置**：M5 T5.3 `_tabs/projects.md`

**现象**：
```liquid
{% for project in site.data.projects %}
### {{ project.name }}
{{ project.summary }}
{% if project.url %}[查看项目]({{ project.url }}){:target="_blank"}{% endif %}
{% endfor %}
```

**分析**：Kramdown 要求 Markdown 块级元素（如 `###` heading）前后有空行才能被正确解析。Liquid 循环输出的内容如果没有空行分隔，`###` 可能被当作普通文本而非 heading。

**修正**：
```liquid
{% for project in site.data.projects %}

### {{ project.name }}

{{ project.summary }}

{% if project.url %}[查看项目]({{ project.url }}){:target="_blank"}{% endif %}
{% if project.date %}<small>{{ project.date | date: '%Y-%m-%d' }}</small>{% endif %}

---

{% endfor %}
```

---

### 问题 7（低风险）：T7.2 `.gitignore` 代码块缩进错位

**位置**：M7 T7.2

**现象**：文档中 `.gitignore` 代码块第 5-10 行有 tab 缩进：
```
  .bundle/
  .DS_Store
  node_modules/
  vendor/
  Gemfile.lock
  _migration_backup/
  *.gem
```

**影响**：直接从文档复制到文件时会引入行首 tab/空格，`.gitignore` 的匹配模式会失效（`  .bundle/` 不等于 `.bundle/`）。

**修正**：确保代码块中所有行顶格书写，无前导空白。

---

## 风险等级汇总

| # | 问题 | 风险 | 影响阶段 | 是否阻塞 |
|---|------|------|----------|----------|
| 1 | `jekyll-archives` 声明 | 低 | M2 | 可能（构建报错） |
| 2 | `compress_html` 兼容性 | 低 | M2 | 不阻塞 |
| 3 | compress 破坏内联脚本 | **高** | M4 | 可能（游戏不可玩） |
| 4 | production 模式 CSS 入口 | 中 | M4/M7 | 可能（线上构建失败） |
| 5 | htmlproofer 误报 | **中** | M7 | 可能（CI 红灯） |
| 6 | Liquid 循环空行 | 低 | M5 | 不阻塞（视觉问题） |
| 7 | .gitignore 缩进 | 低 | M7 | 不阻塞（复制时注意） |

---

## 建议的额外验收动作

在现有验收测试基础上，建议补充以下检查：

1. **M2 完成后**：跑一次 `JEKYLL_ENV=production bundle exec jekyll build --trace` 确认 production 模式也正常
2. **M4 完成后**：在浏览器 Console 中逐个游戏页面检查 JS 报错，特别关注有内联 `<script>` 的页面
3. **M7 合并前**：在迁移分支本地模拟 CI 流程（`bundle exec htmlproofer _site --disable-external`），提前发现 proofer 报错
