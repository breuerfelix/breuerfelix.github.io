---
layout: post
title: Search and Replace across all Repositories in a GitLab Instance
date: 2024-03-18 09:00:00 +01:00
tags: search-and-replace gitlab instance group mass-replace
category: blog
---

We recently introduced container registry mirrors in our kubernetes cluster at containerd level. Since this day, every team specified the pull-through cache directly in the image name like: `image: docker-cache.example.com/library/alpine`. To remove `docker-cache.example.com` as single point of failure, all teams need to change the image name back to `image: docker.io/library/alpine` or `image: alpine`.

Possible solutions:
- Mutating Webh


In order to reduce the work for 40+ Teams and 200+ Service
how to traverse multiple gitlab repositories and create automated MRs
