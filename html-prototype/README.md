# SideQuest – HTML/CSS version

Static HTML + CSS version of the SideQuest Figma design (17 screens + design system). No framework and no build step needed to view it.

## Open it
All fields can be typed in: log in, sign up, code boxes, search bars, the post-task form, the review box and the chat (press Enter to send). Nothing is saved; it's a design prototype.

Double-click **index.html**. It opens straight into the app's Log in screen. Buttons, tabs, cards and back arrows link to the right screens. On a phone-sized window, the screens fill the whole screen.

## Files
| File | What it is |
|---|---|
| `index.html` | The app's first screen: Log in |
| `02-sign-up.html` … `17-profile.html` | One page per screen (390 × 844 phone frame; content scrolls) |
| `design-system.html` (open directly) | Colors, type scale, spacing, radius, buttons, controls, cards |
| `app.js` | Small script for typing: password eye toggle, auto-advancing code boxes, sending chat messages with Enter |
| `styles.css` | Shared styles: color variables (`--primary`, `--panel`, …), type classes (`.t-h1`, `.t-body`, …), buttons (`.btn-primary`, `.btn-purple`, `.btn-outline`) |
| `build/build-html.js` | Generator. It reads the same design source as the Figma plugin (`../SideQuest-Figma/src`) |

## Regenerate after design changes
```bash
node build/build-html.js
```
Fonts (Manrope, DM Sans) load from Google Fonts, so you need internet for the exact typography.
