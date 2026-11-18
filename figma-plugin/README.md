# SideQuest – Figma design

This folder builds the SideQuest UI inside Figma, styled after the team's own screens (dark panels, lime actions, purple eyebrows, Manrope + DM Sans). It creates:

- a **Design System** page (color variables, text styles, spacing, radius, Button component set, controls, cards)
- a **Screens** page with 17 mobile screens, all linked as a clickable prototype

## How to load it into Figma (one time, about 2 minutes)

You need the **Figma desktop app**. Development plugins can't be imported in the browser version.

1. Open the Figma desktop app and log in.
2. Create a **new design file**. Name it `SideQuest`.
3. In the top menu, go to **Plugins → Development → Import plugin from manifest…** and pick `plugin/manifest.json` from this folder.
4. Run it from **Plugins → Development → SideQuest Design Builder**.
5. Wait about 20 seconds until Figma says *"design system + 17 screens created, 70 prototype links ✔"*.
6. Open the **📱 Screens** page and press **▶ Present** (top right) to click through the app.

To send the design to groupmates, share the Figma file link, or use **File → Save local copy…** for a `.fig` file.

## Clickable prototype

The prototype starts at **01 Log in**. Every link only works in Present mode.

| From | Click | Goes to |
|---|---|---|
| Log in | Log in / Sign up | Discover / Sign up |
| Sign up | Create account / Log in | Verify number / Log in |
| Verify number | Verify | Discover |
| Any screen with the bottom bar | Discover · Quests · ➕ · Messages · Profile | Discover · My quests · Post a task · Messages · Profile |
| Any screen with ‹ back | ‹ | Previous screen |
| Discover | Worker / Client switch | Home (Client) |
| Discover | Gig card, Save, View map | Gig details |
| Gig details | Send offer / chat icon | My quests / Conversation |
| My quests | Find a gig / Message Kai / View details | Discover / Conversation / Gig details |
| Home (Client) | Post a task / View offers / Track | Post a task / Worker offers / Track task |
| Post a task | Post task | Worker offers |
| Worker offers | Accept | Pay with GCash |
| Pay with GCash | Pay ₱420 with GCash | Scan GCash QR |
| Scan GCash QR | I’ve paid · Check status | Track task |
| Track task | Confirm task completion / chat icon | Rate & review / Conversation |
| Rate & review | Submit review | Home (Client) |
| Messages | Any conversation | Conversation |
| Conversation | Briefcase / quest pill | My quests |
| Profile | Earnings and withdrawals / Log out | Earnings / Log in |

Long screens scroll in Present mode, while the status bar, bottom nav and bottom buttons stay fixed.

## Colors (Figma variables, collection "SideQuest")

| Token | Hex | Use |
|---|---|---|
| bg / header / panel / card | #0A090D / #0C0A11 / #100E13 / #151219 | Dark surfaces |
| card-purple | #1F162B | Active quest card, profile hero |
| input / border / border-strong | #141217 / #221E28 / #2E2936 | Fields and outlines |
| primary / primary-hover / on-primary | #9CFF27 / #86E21A / #0A090D | Lime actions |
| accent / accent-text / accent-soft | #743BD2 / #A985F7 / #2A1E3A | Purple fills, purple text, purple tint |
| avatar-lime / avatar-blue | #B8FF62 / #7EC9FF | Avatars |
| text / text-muted / text-subtle | #F5F3F7 / #8E8896 / #837D8C | Text |
| success / error | #4ADE80 / #F87171 | Status |

All text and background pairs used in the screens pass WCAG AA (4.5:1).

## Type scale (text styles "SideQuest/…")

| Style | Font | Size / line | Weight |
|---|---|---|---|
| Display | Manrope | 32/38 | Bold |
| H1 | Manrope | 28/32 | SemiBold |
| H2 | Manrope | 20/26 | SemiBold |
| H3 | Manrope | 17/22 | Bold |
| Brand | Manrope | 16/20 | Bold |
| Metric | DM Sans | 22/28 | Bold |
| Title | DM Sans | 14/18 | Bold |
| Button | DM Sans | 13/16 | SemiBold |
| Body | DM Sans | 13/18 | Regular |
| Body Small | DM Sans | 12/16 | Regular |
| Caption | DM Sans | 10/14 | Medium |
| Overline | DM Sans | 9/12 | Bold, 8% tracking, caps |

## Button component

`Button`, with **Variant** = Primary (lime) / Purple / Outline and **State** = Default / Hover / Disabled (35% opacity) / Focus (purple ring). Every button in the screens is an instance of it.

## Files

- `plugin/`: the Figma plugin (`manifest.json` + `code.js`)
- `preview.html`: browser preview of everything
- `screens-png/`: PNG of each screen and the design system
- `src/` + `build.js`: source. Edit `src/`, then run `node build.js`.

## GCash QR payment (how it works in the real app)

Screen **12 · Scan GCash QR** shows a one-time QR code. The code in the design is a sample. In the app, it comes from PayMongo's QR Ph API:

1. When the client taps **Pay ₱420 with GCash**, the server creates a PayMongo Payment Intent for ₱420 with `qrph` allowed, then attaches a `qrph` payment method.
2. PayMongo returns the QR image in `next_action.code.image_url`. The app shows it on screen.
3. The client scans it with GCash (**Pay QR**), or saves it and uses **Upload QR** if paying from the same phone.
4. PayMongo sends a `payment.paid` webhook to the server. The task is marked **Payment held**, and the app moves on to tracking.
5. Each code is single-use, fixed to the exact amount, and expires after 30 minutes (a `qrph.expired` webhook is sent). The app then offers a new code.

Docs: https://developers.paymongo.com/docs/payment-acceptance-qr-ph-api
