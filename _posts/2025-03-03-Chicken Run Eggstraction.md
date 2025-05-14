---
layout: default
modal-id: CR2
title: "Chicken Run: Eggstraction"
category:
  - QA
  - Design
img: CR2.png
video: https://www.youtube.com/watch?v=EBDOVwlRBxo
client: Aardman Animations / Netflix / Outright Games
description: I've just wrapped production on this game as QA Lead!
secret: true
link_info: Coming Soon
links:
  - steam
---
Thanks to Aardman’s collaborative, cross-disciplinary culture, I was selected for an internal mentorship program to develop my level-design and UI/UX skills, enabling me to transition from Lead QA on _Chicken Run 2: Eggstraction_ into a designer role. Under the guidance of senior designers, I rapidly mastered Unreal Engine blueprints, thanks to my familiarity with written programming languages and experience with various game engines, to craft compelling level layouts, integrate interactive elements and enemy encounters, and fine-tune pacing and flow. The experience rekindled my passion for creating fun, engaging user experiences first-hand, rather than contributing solely as a respected QA tester through feedback and constructive critique, setting me on a clear path towards a Junior Game Designer role.

# Designing the world hub and training level: 
{% columns %}
{% column %}
As the game’s production quality grew, we began porting it from a mobile-exclusive title to PC and console platforms. I noticed the front-end still heavily catered to mobile conventions and lacked a dedicated space for players to safely explore mechanics. In response, I proposed a **training hub**: a compact, explorable area where players could freely experiment with equipment, practice core mechanics, and engage in light challenges, whilst unwinding from the game's main campaign.

Due to scope limitations, the original concept was scaled down, but it laid the foundation for the final **Training Ground** level, which is a standalone level where players could try out weapons and abilities against training dummies modelled after in-game enemies, without the risk of failure or consequence.
{% endcolumn %}
{% column %}
![[img/cr2/miro.png|caption= First pass of the hub world designed in Miro|class= bordered]]
{% endcolumn %}
{% endcolumns %}
{% columns %}
{% column %}
Training ground image
{% endcolumn %}
{% column %}
The basis for this level design originated from a large-scale test map I had developed to support QA, engineering, and design. This map contained all unit tests used in the game and was created using our in-house procedural generation tools. I designed targeted scenarios to validate new features, simulate full gameplay loops, and troubleshoot edge cases.

To support more advanced testing conditions, I implemented interactive logic between level elements such as doors, switches, and environmental triggers. This enabled more complex, repeatable setups and improved our ability to validate systems in a controlled environment.
{% endcolumn %}
{% endcolumns %}

---
# Unreal Widget Blueprints for Improved Debugging
{% columns %}
{% column %}
To streamline playtesting and debugging, I improved and extended the debug UI using Unreal Engine’s Blueprint and Widget Blueprint (WBP) systems, along with integrated data tables. I built interactive panels that allowed testers and developers to control game states, modify user data such as character and level progress, acquire virtual currency, and obtain items.
{% endcolumn %}
{% column %}
UI image
{% endcolumn %}
{% endcolumns %}

# Visual Polish and Photoshop Automation
{% columns %}
{% column %}
Chicken portraits
{% endcolumn %}
{% column %}
Alongside level design and QA tooling, I contributed to polish and presentation tasks across the project. This included capturing in-game and promotional screenshots, which I edited in Photoshop to create bespoke level preview thumbnails for the level select screen.

I also developed custom Photoshop actions to automate the conversion of animated character portrait sequences for the in-game UI, ensuring consistent presentation of character actions and expressions throughout the user interface.
{% endcolumn %}
{% endcolumns %}