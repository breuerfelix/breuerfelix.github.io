---
layout: about
comments: false
---

I am Felix, a **Cloud Platform Engineer** living in Cologne _(Germany)_ and born 1994 in Aachen.

After finishing my apprenticeship in Mechatronics at [Schwarze Robitec](https://www.schwarze-robitec.com),
I spent some time working as a Software Developer in different companies while studying Computer Science at the [University of Cologne](https://www.th-koeln.de).
Currently, I enjoy working full-time as a Cloud Platform Engineer at [inovex](https://www.inovex.de/en).

Trying out new technologies is one of the things I love most in my spare time.  
I also enjoy solving challenging bouldering problems and strumming the guitar.  
If you are not already doing so, try it out yourself! It's worth it :)

Now take a step back, relax, and have fun exploring!

### Open Source Projects

[JuiceFS Webhook](https://github.com/breuerfelix/juicefs-volume-hook) - Kubernetes webhook that annotates JuiceFS volumes  
[Medusa Operator](https://github.com/breuerfelix/medusa-operator) - Manages Medusa installations on Kubernetes  
[YAWOL](https://github.com/stackitcloud/yawol) - Yet another Openstack Loadbalancer  
[Elo Hell](https://github.com/breuerfelix/elo-hell) - Elo ranking system built with Svelte and Sapper  
[InstaPy GUI](https://github.com/breuerfelix/instapy-gui) - Platform for managing Instagram automation tools, microservices architecture with a web frontend  
[King Bot API](https://github.com/breuerfelix/king-bot-api) - Reverse engineered Travian Kingdoms API, bot in TypeScript with a PreactJS web frontend  
[AnyNews](https://github.com/breuerfelix/any-news) - HackerNews Clone in Mithril.js  
[King Bot](https://github.com/breuerfelix/king-bot) - Selenium Bot for Travian Kingdoms Browsergame in Python  
[ReactJs GraphQL Authentication](https://github.com/breuerfelix/react-graphql-authentication) - Authentication template with JWT, ReactJS and GraphQL  
[Honey Bee](https://github.com/breuerfelix/honey-bee) - Calculation of Homing Vectors which simulate how Bees orientate themselves  
[Async Socket TCP](https://github.com/breuerfelix/Async-Socket-TCP) - TCP client and server written in C\# for Web- or MMORPG-Server  
[Series Monitor](https://github.com/breuerfelix/Series-Monitor) - JavaFX project to track your series progression and inform you about the latest episodes

### Reference Projects

[danielkueffler.de](https://danielkueffler.de) - Bootstrapped and hosted a personal influencer website with Ghost  
[yoga.elfri.ch](https://yoga.elfri.ch) - Created and hosted a landing page for my girlfriend  
[DasWerkHaus Online Shop](https://daswerkhaus.com) - Set up a Shopify webshop  
[Twitch Highlights](https://www.youtube.com/channel/UC0M8qvpFLG_QoimeBih_6nA) - Automated YouTube channel by [highzer](https://github.com/breuerfelix/highzer)

### Skills

<div class="skills-grid">
{% for skill in site.data.skills %}
  <div class="skill-badge">
    <i class="{{ skill.icon }}"></i>
    <span>{{ skill.name }}</span>
  </div>
{% endfor %}
</div>
