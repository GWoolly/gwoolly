---
layout: default
modal-id: CR2
title: "Chicken Run: Eggstraction"
category:
  - QA
  - Design
img: CR2.png
alt: Chicken Run 2 Eggstraction
video: https://www.youtube.com/watch?v=EBDOVwlRBxo
release: TBA
platforms: 
client: Aardman Animations / Netflix
description: I'm currently wrapping up the final touches on this game as QA Lead!
secret: true
steam: .
---
While working as QA Lead on **Chicken Run 2: Eggstraction**, I was given the opportunity to develop and apply my level design skills thanks to the supportive, cross-disciplinary culture at **Aardman Animations**. The Games & Interactive team encouraged personal growth and creative contribution across roles, which allowed me to take a more active hand in shaping gameplay spaces and systems.

{% columns %}
{% column %}
Early on, I proposed a PC and console-focused training hub, a compact, explorable space where players could freely practice mechanics and experiment with equipment, whilst engaging in light challenges. Though scope limitations led to a scaled-down version, this idea laid the foundation for the final **Training Ground** level: a safe, standalone area where players could try out weapons and abilities against training dummies that resembled in-game enemies, without any threat of failure or consequence.

The foundation for this level came from my work on the **Test Quad**, a large internal test environment I built and maintained to support both QA and design. Using our custom procedural generation tools, I created targeted scenarios to validate features, troubleshoot edge cases, and simulate gameplay loops. I also implemented **interactive logic** between level elements such as doors, switches, and other level interactions; allowing for more complex, repeatable test conditions.
{% endcolumn %}
{% column %}
![[img/cr2/miro.png|caption= First pass of the hub world designed in Miro|class= bordered]]
{% endcolumn %}
{% endcolumns %}

{% columns %}
{% column %}
To streamline our playtesting and debugging process, I improved and extended the debug UI using **Unreal Engine’s Blueprint and Widget Blueprint (WBP)** systems. This included building interactive panels to control game states, teleport to test areas, and adjust live variables. I also worked directly with data tables, updating parameters and ensuring test environments could quickly adapt to design changes.

In addition to QA tools and prototyping, I contributed to polish tasks like creating and importing level previews for the level select screen, and applying minor level fixes across the project.
{% endcolumn %}
{% endcolumns %}

{% text % }
