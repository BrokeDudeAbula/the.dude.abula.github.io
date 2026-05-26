---
layout: default
title: TheDudeAbula
hero:
  title: Hey, I'm TheDudeAbula
  subtitle: I design, build, and write about delightful digital experiences.
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
        <p class="excerpt">{{ post.excerpt | strip_html | truncate: 140 }}</p>
      </li>
      {% endfor %}
    </ul>
    <a class="button" href="{{ '/blog/' | relative_url }}">Browse all posts</a>
  </div>
  <div class="home-card">
    <h3>Featured Projects</h3>
    <ul>
      {% assign featured = site.data.projects | where: 'featured', true %}
      {% for project in featured limit:3 %}
      <li>
        <a href="{{ project.url }}" target="_blank" rel="noopener">{{ project.name }}</a>
        {% if project.date %}
        <span>{{ project.date | date: '%b %d, %Y' }}</span>
        {% else %}
        <span>Date not available</span>
        {% endif %}
        <p class="excerpt">{{ project.summary }}</p>
      </li>
      {% endfor %}
    </ul>
    <a class="button" href="{{ '/projects/' | relative_url }}">See what I'm building</a>
  </div>
  <div class="home-card">
    <h3>GitHub Activity</h3>
    <div class="github-stats">
      <img src="https://github-readme-stats.vercel.app/api?username=the-dude-abula&show_icons=true&theme=transparent&hide_border=true" alt="GitHub Stats" />
      <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=the-dude-abula&theme=transparent&hide_border=true&layout=compact" alt="Top Languages" />
    </div>
    <a class="button" href="https://github.com/the-dude-abula" target="_blank" rel="noopener">View Profile</a>
  </div>
</section>
