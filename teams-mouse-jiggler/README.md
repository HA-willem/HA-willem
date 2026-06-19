# Teams Mouse Jiggler (Chrome-extensie)

Simuleert lichte activiteit (mousemove/scroll events) op open `teams.microsoft.com`-tabs,
zodat de browser-versie van Teams niet automatisch op "Away" springt.

## Belangrijke beperking

Deze extensie beweegt **niet** je echte muiscursor en werkt **niet** voor de Teams
desktop-app. Chrome-extensies hebben geen toegang tot OS-niveau input — Windows
detecteert "away" voor de desktop-app via systeembrede idle-detectie, die alleen
een native tool (bv. een klein PowerShell- of AutoHotkey-scriptje dat de muis
echt verplaatst) kan beïnvloeden. Deze extensie simuleert events binnen de
Teams-webpagina zelf, wat alleen relevant is als je Teams in de browser gebruikt.

## Installatie (developer mode)

1. Open Chrome en ga naar `chrome://extensions`.
2. Zet rechtsboven "Developer mode" aan.
3. Klik "Load unpacked" en selecteer deze map (`teams-mouse-jiggler`).
4. Open `https://teams.microsoft.com` in een tab.
5. Klik op het extensie-icoon en zet "Actief" aan. Stel het interval (in minuten) in.

## Hoe het werkt

- `background.js` gebruikt `chrome.alarms` om periodiek een script te injecteren
  in elke open `teams.microsoft.com`-tab.
- Dat script dispatcht synthetische `mousemove`-, `scroll`-, `focus`- en
  `visibilitychange`-events op het document.
- Instellingen (aan/uit, interval) worden opgeslagen via `chrome.storage.local`.

## Gebruik op eigen risico

Controleer of het gebruik van zo'n tool toegestaan is binnen je organisatie —
sommige bedrijven verbieden het bewust omzeilen van aanwezigheidsstatus.
