---
layout: page
title: Games
description: HTML5 游戏合集：2048、贪吃蛇、打砖块、俄罗斯方块、井字棋、记忆翻牌和猜数字。
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
