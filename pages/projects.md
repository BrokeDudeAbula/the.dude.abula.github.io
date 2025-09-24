---
layout: page
title: Projects
lead: Curated work across product, design systems, and creative coding.
permalink: /projects/
---
<section class="projects-grid">
  {% for project in site.data.projects %}
  <article class="project-card">
    <h2><a href="{{ project.url }}" target="_blank" rel="noopener">{{ project.name }}</a></h2>
    <p>{{ project.summary }}</p>
    {% if project.stack %}
    <p class="project-stack">Stack: {{ project.stack | join: ', ' }}</p>
    {% endif %}
  </article>
  {% endfor %}
</section>
