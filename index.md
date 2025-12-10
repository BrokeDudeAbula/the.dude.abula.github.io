---
layout: default
title: TheDudeAbula
hero:
  title: Hey, I'm TheDudeAbula
  subtitle: I design, build, and write about delightful digital experiences.
  cta:
    label: View Projects
    url: /projects/
---
<section class="container home-overview">
  <h2>What I Do</h2>
  <p>
    I blend design sense with pragmatic engineering to bring ideas to life on the web.
    Expect thoughtful interfaces, reliable code, and stories about the journey along the way.
  </p>
</section>

<section class="container home-sections">
  <div class="home-card">
    <h3>Recent Writing</h3>
    <ul>
      {% for post in site.posts limit:3 %}
      <li>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        <span>{{ post.date | date: '%b %d, %Y' }}</span>
      </li>
      {% endfor %}
    </ul>
    <a class="button" href="/blog/">Browse all posts</a>
  </div>
  <div class="home-card">
    <h3>Featured Projects</h3>
    <ul>
      {% assign featured = site.data.projects | where: 'featured', true %}
      {% for project in featured limit:3 %}
      <li>
        <a href="{{ project.url }}" target="_blank" rel="noopener">{{ project.name }}</a>
        <span>{{ project.summary }}</span>
      </li>
      {% endfor %}
    </ul>
    <a class="button" href="/projects/">See what I'm building</a>
  </div>
  <div class="home-card">
    <h3>Say Hello</h3>
    <p>I'm always happy to chat about new ideas, collaborations, or anything interesting.</p>
    <a class="button" href="mailto:liyang@siat.ac.cn">Email me</a>
  </div>
</section>
