---
layout: page
title: Projects
lead: Curated work across product, design systems, and creative coding.
permalink: /projects/
---
<div class="post-list">
  {% for project in site.data.projects %}
  <article class="post-card">
    <h2><a href="{{ project.url }}" target="_blank" rel="noopener">{{ project.name }}</a></h2>
    <p>{{ project.summary }}</p>
    {% if project.stack %}
    {% assign first_tag = project.stack | first %}
    <div class="project-tags" aria-label="Tech stack">
      <span class="tag">{{ first_tag }}</span>
    </div>
    {% endif %}
    <a class="read-more" href="{{ project.url }}" target="_blank" rel="noopener">View project →</a>
  </article>
  {% endfor %}
</div>
