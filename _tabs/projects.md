---
layout: page
title: Projects
icon: fas fa-project-diagram
order: 4
---

{% assign projects = site.data.projects | sort: 'date' | reverse %}

{% for project in projects %}

## {{ project.name }}

{% if project.date %}
<p class="text-muted">{{ project.date | date: '%Y-%m-%d' }}</p>
{% endif %}

{{ project.summary }}

{% if project.url %}
<p><a href="{{ project.url }}" target="_blank" rel="noopener">查看项目</a></p>
{% endif %}

{% unless forloop.last %}
---
{% endunless %}

{% endfor %}
