#!/usr/bin/env bash

# 简单的清理脚本：删除 Jekyll 构建产物与缓存目录
# 目标目录：_site、.jekyll-cache、.sass-cache、vendor/bundle
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

TARGETS=(
  "_site"
  ".jekyll-cache"
  ".sass-cache"
  "vendor/bundle"
)

echo "开始清理构建产物与缓存..."
for path in "${TARGETS[@]}"; do
  if [ -e "$path" ]; then
    rm -rf "$path"
    echo "已删除：${path}"
  else
    echo "未发现：${path}（跳过）"
  fi
done

echo "完成。可重新运行 bundle install 与 bundle exec jekyll build/serve 进行验证。"
