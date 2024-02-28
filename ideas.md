---
layout: page
title: Inside my Mind
---

Here are ChatGPT generated articles about all the project ideas i had and never got time to implement.  
Feel free to get straight into coding and maybe earn some money with any of my ideas! I would love to see them being built.

<h3 class="posts-item-note">Project Ideas</h3>

{% assign pages = site.pages | where: 'dir', '/ideas/' %}
{% for page in pages %}
<article class="post-item">
  <span class="post-item-date post-item-short">{{ page.short }}</span>
  <h4 class="post-item-title">
    <a href="{{ page.url }}">{{ page.title | escape }}</a>
  </h4>
</article>
{% endfor %}
