// SideQuest screens, following the team's Figma layouts (panels, purple eyebrows, lime actions).
// Layout tree: frames use auto layout ("V"/"H"); sizes are "fill", "hug" or a number.
// `to` = prototype link target (screen name, or "BACK").

const F = (p, children) => Object.assign({ t: "frame", children: children || [] }, p);
const V = (p, c) => F(Object.assign({ layout: "V" }, p), c);
const H = (p, c) => F(Object.assign({ layout: "H", align: "center" }, p), c);
const Tx = (text, style, color, p) => Object.assign({ t: "text", text, style, color: color || "text" }, p);
const Ic = (name, color, size, filled) => ({ t: "icon", name, color: color || "text", size: size || 18, filled: !!filled });
const Svg = (name, svg, w, h, p) => Object.assign({ t: "svg", name, svg, w, h }, p);
const Btn = (label, variant, p) => Object.assign({ t: "button", label, variant: variant || "Primary", state: "Default" }, p);
const Divider = () => F({ name: "Divider", w: "fill", h: 1, fill: "border" });

const W = 390, HGT = 844;
const S = {
  login: "01 · Log in", signup: "02 · Sign up", verify: "03 · Verify number",
  discover: "04 · Discover (Worker)", gig: "05 · Gig details", quests: "06 · My quests", earnings: "07 · Earnings",
  client: "08 · Home (Client)", post: "09 · Post a task", offers: "10 · Worker offers", pay: "11 · Pay with GCash",
  qr: "12 · Scan GCash QR", track: "13 · Track task", review: "14 · Rate & review",
  messages: "15 · Messages", chat: "16 · Conversation", profile: "17 · Profile",
};

// ---------- building blocks ----------
function statusBar() {
  return H({ name: "Status bar", w: W, h: 44, pad: [0, 28], justify: "between", fill: "bg", x: 0, y: 0 }, [
    Tx("9:41", "Button", "text", { w: "hug" }),
    Svg("Status icons", statusBarSvg(colorHex("text")), 68, 12),
  ]);
}

function logo(size) {
  size = size || 34;
  return H({ name: "Logo", w: size, h: size, fill: "primary", radius: size * 0.26, justify: "center" }, [
    Tx("S", size > 40 ? "H2" : "Brand", "on-primary", { w: "hug" }),
  ]);
}

function iconBtn(name, o) {
  o = o || {};
  return H({ name: "Icon button / " + name, w: 36, h: 36, stroke: "border", radius: 10, justify: "center", to: o.to }, [Ic(name, o.color || "text", 18)].concat(
    o.dot ? [F({ name: "Dot", w: 6, h: 6, fill: "primary", radius: 3, x: 23, y: 8, abs: true })] : []));
}

function brandBar() {
  return V({ name: "Brand bar", w: W, gap: 0, fill: "header", x: 0, y: 44 }, [
    H({ name: "Bar", w: "fill", h: 60, pad: [0, 20], gap: 10 }, [logo(30), Tx("SideQuest", "Brand", "text", { w: "hug" })]),
    Divider(),
  ]);
}

function appHeader() {
  return H({ name: "App header", w: "fill", justify: "between" }, [
    H({ name: "Brand + area", w: "hug", gap: 12 }, [
      logo(34),
      Ic("pin", "primary", 16),
      V({ name: "Area", w: "hug", gap: 1 }, [
        Tx("YOUR AREA", "Overline", "text-muted", { w: "hug" }),
        H({ name: "Area picker", w: "hug", gap: 6 }, [Tx("Tanauan City", "Title", "text", { w: "hug" }), Ic("chevronDown", "text-muted", 14)]),
      ]),
    ]),
    iconBtn("bell", { dot: true }),
  ]);
}

function backHeader(title, right) {
  return H({ name: "Top bar", w: "fill", justify: "between" }, [
    iconBtn("chevronLeft", { to: "BACK" }),
    Tx(title, "H3", "text", { w: "hug" }),
    right || F({ name: "Spacer", w: 36, h: 36 }),
  ]);
}

function heading(eyebrow, title, sub, right) {
  const text = V({ name: "Heading", w: right ? "fill" : undefined, gap: 6 }, [
    Tx(eyebrow, "Overline", "accent-text"),
    Tx(title, "H1", "text"),
    sub ? Tx(sub, "Body Small", "text-muted") : null,
  ].filter(Boolean));
  return right ? H({ name: "Heading row", w: "fill", gap: 12, align: "end" }, [text, right]) : text;
}

function panel(p, children) {
  return V(Object.assign({ name: "Panel", pad: 16, gap: 14, fill: "panel", stroke: "border", radius: 16 }, p), children);
}
function card(p, children) {
  return V(Object.assign({ name: "Card", pad: 14, gap: 12, fill: "card", stroke: "border", radius: 14 }, p), children);
}

function segmented(active) {
  const item = (label, to) => H({ name: label, w: "fill", h: 34, radius: 9, justify: "center", fill: active === label ? "accent-soft" : null, to: active === label ? undefined : to }, [
    Tx(label, "Button", active === label ? "text" : "text-muted", { w: "hug" }),
  ]);
  return H({ name: "Role switcher", w: "fill", pad: 4, gap: 4, fill: "panel", stroke: "border", radius: 12 }, [
    item("Worker", S.discover), item("Client", S.client),
  ]);
}

function input(label, placeholder, o) {
  o = o || {};
  return V({ name: "Input / " + label, gap: 8 }, [
    Tx(label, "Button", "text"),
    H({ name: "Field", w: "fill", h: 44, pad: [0, 14], gap: 10, fill: "input", radius: 10,
      stroke: o.error ? "error" : o.focus ? "accent-text" : "border", strokeW: o.focus || o.error ? 2 : 1 }, [
      o.icon ? Ic(o.icon, "text-subtle", 16) : null,
      Tx(o.value || placeholder, "Body", o.value ? "text" : "text-subtle", { w: "fill" }),
      o.trailing ? Ic(o.trailing, "text-muted", 18) : null,
    ].filter(Boolean)),
    o.help ? Tx(o.help, "Caption", o.error ? "error" : "text-muted") : null,
  ].filter(Boolean));
}

function chip(label, active, to) {
  return H({ name: "Chip / " + label, w: "hug", h: 30, pad: [0, 12], radius: 999, fill: active ? "primary" : "card", stroke: active ? null : "border-strong", to }, [
    Tx(label, "Body Small", active ? "on-primary" : "text-muted", { w: "hug" }),
  ]);
}
function skillChip(label) {
  return H({ name: "Skill / " + label, w: "hug", h: 26, pad: [0, 10], radius: 999, fill: "card", stroke: "border-strong" }, [Tx(label, "Caption", "accent-text", { w: "hug" })]);
}

function avatar(initials, color, size) {
  size = size || 40;
  const dark = color === "accent";
  return H({ name: "Avatar / " + initials, w: size, h: size, radius: size / 2, fill: color || "avatar-lime", justify: "center" }, [
    Tx(initials, size >= 56 ? "H3" : "Button", dark ? "text" : "on-primary", { w: "hug" }),
  ]);
}

function smallBtn(label, kind, to) {
  const lime = kind === "lime";
  return H({ name: "Button / small / " + label, w: "hug", h: 28, pad: [0, 12], radius: 8, justify: "center", fill: lime ? "primary" : null, stroke: lime ? null : "border-strong", to }, [
    Tx(label, "Caption", lime ? "on-primary" : "accent-text", { w: "hug" }),
  ]);
}

function gigCard(g) {
  return card({ name: "Gig card / " + g.title, to: g.to }, [
    H({ name: "Top", w: "fill", gap: 12, align: "start" }, [
      avatar(g.initials, g.color, 44),
      V({ name: "Info", w: "fill", gap: 6 }, [
        H({ name: "Eyebrow", w: "fill", gap: 6 }, [Tx(g.category, "Overline", "accent-text", { w: "hug" }), Ic("pin", "text-muted", 11), Tx(g.distance, "Overline", "text-muted", { w: "hug" })]),
        Tx(g.title, "Title", "text"),
        H({ name: "Client", w: "fill", gap: 6 }, [Tx(g.client, "Caption", "text-muted", { w: "hug" }), Ic("star", "primary", 12), Tx(g.rating, "Caption", "text", { w: "hug" })]),
        H({ name: "When", w: "fill", gap: 6 }, [Ic("clock", "text-muted", 12), Tx(g.time, "Caption", "text-muted", { w: "hug" })]),
      ]),
    ]),
    Divider(),
    H({ name: "Bottom", w: "fill", justify: "between" }, [Tx(g.pay, "Metric", "text", { w: "hug" }), smallBtn(g.action || "Save", g.actionKind, g.actionTo)]),
  ]);
}

function bottomNav(active) {
  const item = (icon, label, to) => V({ name: "Tab / " + label, w: "fill", gap: 4, align: "center", to: active === label ? undefined : to }, [
    Ic(icon, active === label ? "primary" : "text-muted", 20),
    Tx(label, "Caption", active === label ? "primary" : "text-muted", { w: "hug" }),
  ]);
  return H({ name: "Bottom nav", w: W, h: 82, pad: [10, 10, 22, 10], fill: "header", stroke: "border", x: 0, y: HGT - 82, align: "start" }, [
    item("home", "Discover", S.discover), item("briefcase", "Quests", S.quests),
    V({ name: "Tab / Post", w: "fill", align: "center", to: S.post }, [
      H({ name: "Post button", w: 44, h: 44, radius: 12, fill: "primary", justify: "center" }, [Ic("plus", "on-primary", 22)]),
    ]),
    item("message", "Messages", S.messages), item("user", "Profile", S.profile),
  ]);
}

function stickyCta(children) {
  return V({ name: "Bottom action", w: W, pad: [14, 20, 30, 20], gap: 10, fill: "header", stroke: "border", x: 0, y: "bottom" }, children);
}

// Screen: content first, then status bar / nav / CTA on top (these stay fixed when scrolling in prototypes).
function screen(name, content, o) {
  o = o || {};
  const kids = [V({ name: "Content", w: W, gap: o.gap || 18, pad: [8, 20, o.nav || o.cta ? 110 : 24, 20], x: 0, y: 44 }, content), statusBar()];
  if (o.nav) kids.push(bottomNav(o.nav));
  if (o.cta) kids.push(stickyCta(o.cta));
  return F({ name, w: W, h: HGT, fill: "bg", clip: true, screen: true, flow: o.flow, fixed: kids.length - 1 }, kids);
}

function authScreen(name, children) {
  return F({ name, w: W, h: HGT, fill: "bg", clip: true, screen: true, flow: "Start", fixed: 3 }, [
    V({ name: "Content", w: W, pad: [20, 16, 80, 16], x: 0, y: 104, gap: 16 }, children),
    statusBar(), brandBar(), authFooter(),
  ]);
}

function timelineStep(title, sub, state, last) {
  const dot = state === "done" ? "primary" : state === "now" ? "accent-text" : null;
  return H({ name: "Step / " + title, w: "fill", gap: 12, align: "start" }, [
    V({ name: "Rail", w: 12, align: "center", pad: [4, 0, 0, 0] }, [
      F({ name: "Dot", w: 10, h: 10, radius: 5, fill: dot, stroke: dot ? null : "border-strong", strokeW: 2 }),
      last ? null : F({ name: "Line", w: 2, h: 30, fill: state === "done" ? "primary" : "border" }),
    ].filter(Boolean)),
    V({ name: "Text", w: "fill", gap: 2 }, [
      Tx(title, "Title", state === "todo" ? "text-muted" : "text"),
      Tx(sub, "Caption", "text-muted"),
    ]),
  ]);
}

function row(icon, label, value) {
  return H({ name: "Row / " + label, w: "fill", justify: "between" }, [
    H({ name: "Label", w: "hug", gap: 8 }, [Ic(icon, "text-muted", 16), Tx(label, "Body", "text-muted", { w: "hug" })]),
    Tx(value, "Title", "text", { w: "hug" }),
  ]);
}

function statusLabel(text, color) {
  return H({ name: "Status / " + text, w: "hug", gap: 6 }, [F({ name: "Dot", w: 6, h: 6, radius: 3, fill: color }), Tx(text, "Caption", "text", { w: "hug" })]);
}

function escrowNote(text) {
  return H({ name: "Escrow note", w: "fill", pad: 14, gap: 10, radius: 12, fill: "accent-soft", align: "start" }, [
    Ic("shield", "accent-text", 18), Tx(text, "Body Small", "text", { w: "fill" }),
  ]);
}

function starsRow(n, size) {
  const kids = [];
  for (let i = 0; i < 5; i++) kids.push(Ic("star", i < n ? "primary" : "border-strong", size || 12, size > 20));
  return H({ name: "Stars", w: "hug", gap: 4 }, kids);
}

function authFooter() {
  return H({ name: "Support", w: W, h: 60, justify: "center", gap: 4, fill: "bg", x: 0, y: "bottom" }, [Tx("Need help?", "Body Small", "text-muted", { w: "hug" }), Tx("Contact support", "Body Small", "accent-text", { w: "hug" })]);
}

// ---------- data ----------
const GIGS = [
  { initials: "MD", color: "avatar-lime", category: "ERRANDS", distance: "0.8 KM", title: "Pick up art supplies", client: "Mara D.", rating: "4.9", time: "Today, 4:30 PM", pay: "₱450", to: S.gig, actionTo: S.gig },
  { initials: "TR", color: "accent", category: "CREATIVE", distance: "1.4 KM", title: "Product photos for a small shop", client: "Theo R.", rating: "5.0", time: "Tomorrow", pay: "₱800", to: S.gig, actionTo: S.gig },
];

const SCREENS = [];

// 01 Log in (first screen)
SCREENS.push(authScreen(S.login, [
  panel({ name: "Log in card", pad: 18, gap: 16 }, [
    V({ name: "Heading", gap: 6 }, [Tx("LOG IN", "Overline", "accent-text"), Tx("Welcome back", "H1", "text"), Tx("Log in to pick up where you left off.", "Body Small", "text-muted")]),
    input("Email", "Enter your email address"),
    input("Password", "Enter your password", { trailing: "eye" }),
    H({ name: "Forgot", w: "fill", justify: "end" }, [Tx("Forgot password?", "Button", "accent-text", { w: "hug" })]),
    Btn("Log in", "Primary", { to: S.discover }),
  ]),
  H({ name: "Sign up link", w: "fill", gap: 4, justify: "center", to: S.signup }, [Tx("New to SideQuest?", "Body Small", "text-muted", { w: "hug" }), Tx("Sign up", "Button", "accent-text", { w: "hug" })]),
]));

// 02 Sign up
SCREENS.push(authScreen(S.signup, [
  panel({ name: "Sign up card", pad: 18, gap: 16 }, [
    V({ name: "Heading", gap: 6 }, [Tx("SIGN UP", "Overline", "accent-text"), Tx("Create your account", "H1", "text"), Tx("Join SideQuest to find gigs or get things done.", "Body Small", "text-muted")]),
    input("Full name", "Enter your full name"),
    input("Email", "Enter your email address"),
    input("Mobile number", "+63 9XX XXX XXXX"),
    input("Password", "Create a password", { trailing: "eye", help: "Use at least 8 characters." }),
    Btn("Create account", "Primary", { to: S.verify }),
    Tx("By creating an account, you confirm you are 18 or older and agree to our Terms of service and Privacy policy.", "Caption", "text-muted", { align: "center" }),
  ]),
  H({ name: "Log in link", w: "fill", gap: 4, justify: "center", to: S.login }, [Tx("Already have an account?", "Body Small", "text-muted", { w: "hug" }), Tx("Log in", "Button", "accent-text", { w: "hug" })]),
]));

// 03 Verify number
const otp = (d, active) => H({ name: "Digit", w: "fill", h: 48, radius: 10, fill: "input", stroke: active ? "accent-text" : "border", strokeW: active ? 2 : 1, justify: "center" }, [Tx(d, "Metric", "text", { w: "hug" })]);
SCREENS.push(authScreen(S.verify, [
  panel({ name: "Verify card", pad: 18, gap: 16 }, [
    V({ name: "Heading", gap: 6 }, [Tx("VERIFY", "Overline", "accent-text"), Tx("Enter the 6-digit code", "H1", "text"), Tx("We sent it to +63 917 ••• 4821. It expires in 5 minutes.", "Body Small", "text-muted")]),
    H({ name: "Code", w: "fill", gap: 8 }, [otp("4"), otp("8"), otp("2"), otp("", true), otp(""), otp("")]),
    Btn("Verify", "Primary", { to: S.discover }),
    H({ name: "Resend", w: "fill", gap: 4, justify: "center" }, [Tx("Didn’t get it?", "Body Small", "text-muted", { w: "hug" }), Tx("Resend in 0:42", "Button", "text-muted", { w: "hug" })]),
  ]),
  panel({ name: "ID card", gap: 12 }, [
    H({ name: "Row", w: "fill", gap: 12 }, [
      H({ name: "Icon", w: 40, h: 40, radius: 10, fill: "accent-soft", justify: "center" }, [Ic("idCard", "accent-text", 20)]),
      V({ name: "Text", w: "fill", gap: 2 }, [Tx("Get the Verified badge", "Title", "text"), Tx("Upload a valid ID or school ID. You can do this later.", "Caption", "text-muted")]),
    ]),
    Btn("Upload ID", "Outline"),
  ]),
]));

// 04 Discover (Worker)
SCREENS.push(screen(S.discover, [
  appHeader(),
  segmented("Worker"),
  panel({ name: "Discover panel" }, [
    V({ name: "Heading", gap: 6 }, [Tx("DISCOVER", "Overline", "accent-text"), Tx("Find your next gig", "H1", "text"), Tx("Browse flexible work available in your area.", "Body Small", "text-muted")]),
    H({ name: "Search", w: "fill", h: 44, pad: [0, 14], gap: 10, fill: "input", stroke: "border", radius: 10 }, [Ic("search", "text-subtle", 16), Tx("Search tasks or skills", "Body", "text-subtle", { w: "fill" }), H({ name: "Within", w: "hug", h: 22, pad: [0, 8], radius: 6, stroke: "border-strong", justify: "center" }, [Tx("5 km", "Caption", "text-muted", { w: "hug" })])]),
    V({ name: "Section", gap: 4 }, [
      Tx("CURATED FOR YOU", "Overline", "accent-text"),
      H({ name: "Title", w: "fill", justify: "between" }, [Tx("Gigs around you", "H3", "text", { w: "hug" }), H({ name: "Map link", w: "hug", gap: 4, to: S.gig }, [Tx("View map", "Button", "accent-text", { w: "hug" }), Ic("chevronRight", "accent-text", 14)])]),
    ]),
    H({ name: "Filters", w: "fill", gap: 8 }, [chip("All gigs", true), chip("Errands"), chip("Creative"), chip("Delivery")]),
    gigCard(GIGS[0]),
    gigCard(GIGS[1]),
  ]),
], { nav: "Discover", gap: 14, flow: "Worker" }));

// 05 Gig details
SCREENS.push(screen(S.gig, [
  backHeader("Gig details"),
  F({ name: "Map", w: "fill", h: 140, radius: 14, clip: true, stroke: "border" }, [Svg("Map", mapSvg(350, 140), 350, 140, { x: 0, y: 0 })]),
  panel({ name: "Gig panel" }, [
    H({ name: "Eyebrow", w: "fill", gap: 6 }, [Tx("ERRANDS", "Overline", "accent-text", { w: "hug" }), Ic("pin", "text-muted", 11), Tx("0.8 KM", "Overline", "text-muted", { w: "hug" })]),
    H({ name: "Title row", w: "fill", gap: 12, align: "start" }, [Tx("Pick up art supplies", "H2", "text", { w: "fill" }), Tx("₱450", "Metric", "primary", { w: "hug" })]),
    Divider(),
    row("calendar", "When", "Today, 4:30 PM"),
    row("clock", "Estimated time", "45 minutes"),
    row("pin", "Drop-off", "FAITH main gate"),
    Divider(),
    Tx("Buy the art supplies on the list (sent in chat) from the bookstore in Poblacion and bring them to the main gate. Keep the receipt.", "Body", "text-muted"),
  ]),
  card({ name: "Client" }, [
    H({ name: "Row", w: "fill", gap: 12 }, [avatar("MD", "avatar-lime", 40), V({ name: "Text", w: "fill", gap: 2 }, [Tx("Mara D.", "Title", "text"), H({ name: "Meta", w: "fill", gap: 4 }, [Ic("star", "primary", 12), Tx("4.9 · 18 tasks posted · Verified", "Caption", "text-muted", { w: "hug" })])]), iconBtn("message", { to: S.chat })]),
  ]),
  escrowNote("The client pays through GCash when they accept you. SideQuest holds it and releases it once the task is confirmed."),
], { flow: "Worker", gap: 14, cta: [Btn("Send offer · ₱450", "Primary", { to: S.quests })] }));

// 06 My quests
SCREENS.push(screen(S.quests, [
  appHeader(),
  heading("MY WORK", "My quests", "Track every task from acceptance to completion.", H({ name: "Find a gig", w: "hug", h: 36, pad: [0, 12], gap: 6, radius: 10, fill: "primary", to: S.discover }, [Ic("search", "on-primary", 14), Tx("Find a gig", "Button", "on-primary", { w: "hug" })])),
  panel({ name: "Active panel" }, [
    H({ name: "Head", w: "fill", justify: "between" }, [Tx("Active", "H3", "text", { w: "hug" }), Tx("2 QUESTS", "Overline", "accent-text", { w: "hug" })]),
    V({ name: "Quest card", pad: 16, gap: 12, radius: 14, fill: "card-purple", stroke: "border-strong" }, [
      H({ name: "Status", w: "fill", justify: "between" }, [statusLabel("In transit", "primary"), Tx("ACTIVE", "Overline", "primary", { w: "hug" })]),
      H({ name: "Title row", w: "fill", gap: 12, align: "end" }, [
        V({ name: "Title", w: "fill", gap: 4 }, [Tx("DELIVERY", "Overline", "accent-text"), Tx("Deliver printed thesis", "H2", "text")]),
        Tx("₱420", "Metric", "text", { w: "hug" }),
      ]),
      H({ name: "For", w: "fill", gap: 8 }, [avatar("KR", "accent", 24), Tx("For Kai Reyes", "Body Small", "text", { w: "hug" }), Tx("4.9 rating", "Caption", "text-muted", { w: "hug" })]),
      V({ name: "Timeline", gap: 0 }, [
        timelineStep("Picked up at Print Hub, Darasa", "Completed at 3:42 PM", "done"),
        timelineStep("FAITH Colleges main gate", "Estimated arrival 4:05 PM", "now", true),
      ]),
      Btn("Message Kai", "Purple", { to: S.chat }),
      Btn("View details", "Outline", { to: S.gig }),
    ]),
    card({ name: "Upcoming quest" }, [
      H({ name: "Row", w: "fill", gap: 12 }, [
        H({ name: "Icon", w: 36, h: 36, radius: 10, fill: "panel", stroke: "border", justify: "center" }, [Ic("clock", "primary", 16)]),
        V({ name: "Text", w: "fill", gap: 2 }, [Tx("CREATIVE · TOMORROW", "Overline", "accent-text"), Tx("Edit a short presentation", "Title", "text"), Tx("Due at 6:00 PM", "Caption", "text-muted")]),
        Tx("₱650", "Title", "text", { w: "hug" }),
      ]),
    ]),
  ]),
], { nav: "Quests", gap: 14, flow: "Worker" }));

// 07 Earnings
const txRow = (title, sub, amount, positive) => H({ name: "Transaction", w: "fill", gap: 12 }, [
  H({ name: "Icon", w: 36, h: 36, radius: 10, fill: "card", stroke: "border", justify: "center" }, [Ic(positive ? "check" : "wallet", positive ? "primary" : "text-muted", 16)]),
  V({ name: "Text", w: "fill", gap: 2 }, [Tx(title, "Title", "text"), Tx(sub, "Caption", "text-muted")]),
  Tx(amount, "Title", positive ? "primary" : "text", { w: "hug" }),
]);
SCREENS.push(screen(S.earnings, [
  backHeader("Earnings"),
  panel({ name: "Balance" }, [
    Tx("AVAILABLE BALANCE", "Overline", "accent-text"),
    Tx("₱2,340.00", "Display", "primary"),
    Tx("₱420 is on hold until Kai confirms your active quest.", "Body Small", "text-muted"),
    H({ name: "Stats", w: "fill", gap: 10 }, [
      card({ name: "Stat", w: "fill", gap: 2 }, [Tx("42", "Metric", "text"), Tx("Gigs completed", "Caption", "text-muted")]),
      card({ name: "Stat", w: "fill", gap: 2 }, [Tx("₱9,850", "Metric", "text"), Tx("Earned this month", "Caption", "text-muted")]),
    ]),
  ]),
  panel({ name: "History" }, [
    H({ name: "Head", w: "fill", justify: "between" }, [Tx("Recent activity", "H3", "text", { w: "hug" }), Tx("View all", "Button", "accent-text", { w: "hug" })]),
    txRow("Pick up art supplies", "Released · Today, 5:02 PM", "+₱450", true),
    txRow("Product photos", "Released · Oct 18", "+₱800", true),
    txRow("Withdrawal to GCash", "0917 ••• 4821 · Oct 17", "−₱1,000", false),
  ]),
], { flow: "Worker", gap: 14, cta: [Btn("Withdraw to GCash", "Primary")] }));

// 08 Home (Client)
const taskCard = (t) => card({ name: "Task / " + t.title, to: t.to }, [
  H({ name: "Status", w: "fill", justify: "between" }, [statusLabel(t.status, t.dot), Tx(t.pay, "Title", "text", { w: "hug" })]),
  V({ name: "Title", gap: 4 }, [Tx(t.category, "Overline", "accent-text"), Tx(t.title, "Title", "text")]),
  H({ name: "Footer", w: "fill", justify: "between" }, [Tx(t.note, "Caption", "text-muted", { w: "hug" }), smallBtn(t.action, t.kind, t.to)]),
]);
SCREENS.push(screen(S.client, [
  appHeader(),
  segmented("Client"),
  panel({ name: "Client panel" }, [
    V({ name: "Heading", gap: 6 }, [Tx("CLIENT MODE", "Overline", "accent-text"), Tx("Get things done fast", "H1", "text"), Tx("Post a task in under 2 minutes and pick a trusted worker nearby.", "Body Small", "text-muted")]),
    Btn("Post a task", "Primary", { to: S.post }),
  ]),
  panel({ name: "Your tasks" }, [
    H({ name: "Head", w: "fill", justify: "between" }, [Tx("Your tasks", "H3", "text", { w: "hug" }), Tx("2 OPEN", "Overline", "accent-text", { w: "hug" })]),
    taskCard({ status: "3 offers waiting", dot: "accent-text", pay: "₱420", category: "DELIVERY", title: "Deliver printed thesis", note: "Posted 10 min ago", action: "View offers", kind: "lime", to: S.offers }),
    taskCard({ status: "In progress", dot: "primary", pay: "₱180", category: "ERRANDS", title: "Grocery run to Savemore", note: "Bea is on the way", action: "Track", to: S.track }),
  ]),
], { nav: "Discover", gap: 14, flow: "Client" }));

// 09 Post a task
SCREENS.push(screen(S.post, [
  backHeader("Post a task"),
  panel({ name: "Form" }, [
    input("Task title", "e.g. Pick up a parcel", { value: "Deliver printed thesis" }),
    V({ name: "Category", gap: 8 }, [Tx("Category", "Button", "text"), H({ name: "Chips", w: "fill", gap: 8 }, [chip("Errands"), chip("Delivery", true), chip("Creative"), chip("Tech")])]),
    input("Details", "", { value: "Pick up 3 bound copies at Print Hub, bring to FAITH Room 304." }),
    H({ name: "Row", w: "fill", gap: 10 }, [V({ name: "Half", w: "fill" }, [input("Location", "", { icon: "pin", value: "Darasa" })]), V({ name: "Half", w: "fill" }, [input("Schedule", "", { icon: "calendar", value: "Today, 3 PM" })])]),
    input("Offered pay", "", { icon: "wallet", value: "₱420", help: "Similar tasks nearby pay ₱300–₱450." }),
  ]),
  escrowNote("You’ll pay through GCash when you accept a worker. SideQuest holds the payment until you confirm the task is done."),
], { flow: "Client", gap: 14, cta: [Btn("Post task", "Primary", { to: S.offers })] }));

// 10 Worker offers
const offer = (name, initials, color, rating, gigs, dist, msg, top) => card({ name: "Offer / " + name, stroke: top ? "primary" : "border" }, [
  H({ name: "Head", w: "fill", gap: 12 }, [
    avatar(initials, color, 40),
    V({ name: "Name", w: "fill", gap: 3 }, [
      H({ name: "Line", w: "fill", gap: 6 }, [Tx(name, "Title", "text", { w: "hug" }), Ic("shield", "success", 13)]),
      H({ name: "Meta", w: "fill", gap: 6 }, [Ic("star", "primary", 12), Tx(`${rating} · ${gigs} · ${dist}`, "Caption", "text-muted", { w: "hug" })]),
    ]),
  ]),
  Tx(msg, "Body Small", "text-muted"),
  H({ name: "Actions", w: "fill", gap: 10 }, [Btn("Decline", "Outline", { w: "fill" }), Btn("Accept", "Primary", { w: "fill", to: S.pay })]),
]);
SCREENS.push(screen(S.offers, [
  backHeader("Offers"),
  heading("YOUR TASK · ₱420", "Deliver printed thesis", "3 workers sent an offer. Pick one to continue."),
  offer("Bea Santos", "BS", "avatar-lime", "4.9", "42 gigs", "0.6 km", "I’m near Darasa right now and can bring it in 20 minutes.", true),
  offer("Miguel Ramos", "MR", "accent", "4.7", "15 gigs", "1.4 km", "Free after my 2 PM class. I have a motorbike."),
], { flow: "Client", gap: 14 }));

// 11 Pay with GCash
SCREENS.push(screen(S.pay, [
  backHeader("Payment"),
  panel({ name: "Summary" }, [
    H({ name: "Worker", w: "fill", gap: 12 }, [avatar("BS", "avatar-lime", 40), V({ name: "Text", w: "fill", gap: 2 }, [Tx("Bea Santos", "Title", "text"), Tx("Deliver printed thesis", "Caption", "text-muted")])]),
    Divider(),
    row("briefcase", "Task pay", "₱420.00"),
    row("wallet", "Pay with", "GCash · QR Ph"),
    Divider(),
    H({ name: "Total", w: "fill", justify: "between" }, [Tx("Total", "H3", "text", { w: "hug" }), Tx("₱420.00", "Metric", "primary", { w: "hug" })]),
  ]),
  panel({ name: "Protection" }, [
    Tx("How your payment is protected", "H3", "text"),
    V({ name: "Steps", gap: 0 }, [
      timelineStep("You pay through GCash", "SideQuest holds the amount", "done"),
      timelineStep("Bea completes the task", "Track it live", "now"),
      timelineStep("You confirm, Bea gets paid", "Or report an issue for a refund", "todo", true),
    ]),
  ]),
], { flow: "Client", gap: 14, cta: [Btn("Pay ₱420 with GCash", "Primary", { to: S.qr }), Tx("We’ll show a one-time GCash QR code for this payment.", "Caption", "text-muted", { align: "center" })] }));

// 12 Scan GCash QR
const qrStep = (n, text) => H({ name: "Step " + n, w: "fill", gap: 12, align: "start" }, [
  H({ name: "Number", w: 22, h: 22, radius: 11, fill: "accent-soft", justify: "center" }, [Tx(String(n), "Caption", "accent-text", { w: "hug" })]),
  Tx(text, "Body Small", "text", { w: "fill" }),
]);
SCREENS.push(screen(S.qr, [
  backHeader("Scan to pay"),
  panel({ name: "QR panel", align: "center", gap: 12 }, [
    Tx("GCASH · QR PH", "Overline", "accent-text", { align: "center" }),
    Tx("₱420.00", "Display", "text", { align: "center" }),
    Tx("Pay to SideQuest · held for Bea Santos", "Body Small", "text-muted", { align: "center" }),
    H({ name: "QR card", w: "hug", pad: 12, radius: 14, fill: "text" }, [Svg("QR code (sample)", qrSvg(200, 11), 200, 200)]),
    H({ name: "Expiry", w: "hug", gap: 6, pad: [6, 12], radius: 999, fill: "card", stroke: "border" }, [Ic("clock", "primary", 14), Tx("Expires in 29:41", "Caption", "text", { w: "hug" })]),
    statusLabel("Waiting for payment…", "accent-text"),
  ]),
  panel({ name: "How to pay", gap: 12 }, [
    Tx("How to pay", "H3", "text"),
    qrStep(1, "Open the GCash app and tap Pay QR."),
    qrStep(2, "Scan this code. On the same phone? Save it, then choose Upload QR in GCash."),
    qrStep(3, "Check that the amount is ₱420.00 and confirm. We’ll detect it automatically."),
  ]),
  escrowNote("SideQuest holds this payment and only releases it to Bea after you confirm the task is done."),
], { flow: "Client", gap: 14, cta: [Btn("I’ve paid · Check status", "Primary", { to: S.track }), Btn("Save QR to gallery", "Outline")] }));

// 13 Track task
SCREENS.push(screen(S.track, [
  backHeader("Track task"),
  F({ name: "Live map", w: "fill", h: 220, radius: 14, clip: true, stroke: "border" }, [Svg("Map", mapSvg(350, 220, { route: true }), 350, 220, { x: 0, y: 0 })]),
  panel({ name: "Status" }, [
    H({ name: "Head", w: "fill", justify: "between" }, [statusLabel("On the way", "primary"), Tx("ETA 4:05 PM", "Button", "primary", { w: "hug" })]),
    H({ name: "Worker", w: "fill", gap: 12 }, [avatar("BS", "avatar-lime", 40), V({ name: "Text", w: "fill", gap: 2 }, [Tx("Bea Santos", "Title", "text"), Tx("0.3 km away · Updated just now", "Caption", "text-muted")]), iconBtn("message", { to: S.chat })]),
  ]),
  escrowNote("₱420 is held by SideQuest. Confirm only after you receive the printed copies."),
], { flow: "Client", gap: 14, cta: [Btn("Confirm task completion", "Primary", { to: S.review }), Btn("Report an issue", "Outline")] }));

// 14 Rate & review
SCREENS.push(screen(S.review, [
  backHeader("Review"),
  V({ name: "Done", gap: 10, align: "center", pad: [6, 0] }, [
    H({ name: "Check", w: 56, h: 56, radius: 28, fill: "primary", justify: "center" }, [Ic("check", "on-primary", 26)]),
    Tx("Payment released", "H2", "text", { align: "center" }),
    Tx("₱420 was sent to Bea Santos’s GCash.", "Body Small", "text-muted", { align: "center" }),
  ]),
  panel({ name: "Rating", align: "center" }, [
    avatar("BS", "avatar-lime", 56),
    Tx("How was Bea?", "H3", "text", { align: "center" }),
    starsRow(5, 28),
    H({ name: "Tags", w: "fill", gap: 8, justify: "center" }, [chip("On time", true), chip("Friendly", true), chip("Careful")]),
  ]),
  input("Review (optional)", "Write something about this task…"),
], { flow: "Client", gap: 14, cta: [Btn("Submit review", "Primary", { to: S.client })] }));

// 15 Messages
const convo = (initials, color, name, task, last, time, unread, to) => H({ name: "Conversation / " + name, w: "fill", gap: 12, pad: [12, 0], to }, [
  V({ name: "Avatar wrap", w: "hug" }, [avatar(initials, color, 40)].concat(unread ? [F({ name: "Online", w: 10, h: 10, radius: 5, fill: "primary", stroke: "panel", strokeW: 2, x: 30, y: 30, abs: true })] : [])),
  V({ name: "Text", w: "fill", gap: 2 }, [
    H({ name: "Top", w: "fill", justify: "between" }, [Tx(name, "Title", "text", { w: "hug" }), Tx(time, "Caption", "text-muted", { w: "hug" })]),
    Tx(task, "Body Small", "text"),
    Tx(last, "Caption", "text-muted"),
  ]),
  Ic("chevronRight", "text-muted", 14),
]);
SCREENS.push(screen(S.messages, [
  appHeader(),
  heading("INBOX", "Messages", "Keep every quest conversation in one place."),
  panel({ name: "Inbox", gap: 6 }, [
    H({ name: "Search", w: "fill", h: 44, pad: [0, 14], gap: 10, fill: "input", stroke: "border", radius: 10 }, [Ic("search", "text-subtle", 16), Tx("Search messages", "Body", "text-subtle", { w: "fill" })]),
    H({ name: "Label", w: "fill", justify: "between", pad: [10, 0, 4, 0] }, [Tx("Recent conversations", "Caption", "text-muted", { w: "hug" }), Tx("3 MESSAGES", "Overline", "accent-text", { w: "hug" })]),
    convo("KR", "accent", "Kai Reyes", "Deliver printed thesis", "I’m waiting by the main gate.", "3:54 PM", true, S.chat),
    Divider(),
    convo("MD", "avatar-lime", "Mara D.", "Art supplies pickup", "Thanks for accepting the gig.", "Yesterday", false, S.chat),
    Divider(),
    convo("TR", "avatar-blue", "Theo R.", "Product photography", "The sample shots look great.", "Mon", false, S.chat),
  ]),
], { nav: "Messages", gap: 14, flow: "Shared" }));

// 16 Conversation
const bubble = (text, time, mine) => H({ name: mine ? "Sent" : "Received", w: "fill", justify: mine ? "end" : "start" }, [
  V({ name: "Bubble", w: 230, pad: [10, 12], gap: 4, radius: 12, fill: mine ? "accent" : "card" }, [Tx(text, "Body Small", "text"), Tx(time, "Caption", mine ? "text" : "text-muted", { align: mine ? "right" : "left" })]),
]);
SCREENS.push(screen(S.chat, [
  appHeader(),
  heading("INBOX", "Messages", "Keep every quest conversation in one place."),
  panel({ name: "Chat panel", pad: 0, gap: 0 }, [
    H({ name: "Chat header", w: "fill", pad: 12, gap: 10 }, [iconBtn("chevronLeft", { to: "BACK" }), avatar("KR", "accent", 34), V({ name: "Name", w: "fill", gap: 2 }, [Tx("Kai Reyes", "Title", "text"), statusLabel("Active now", "primary")]), iconBtn("briefcase", { to: S.quests })]),
    Divider(),
    V({ name: "Thread", pad: 14, gap: 12 }, [
      Tx("TODAY", "Overline", "text-muted", { align: "center" }),
      H({ name: "Quest pill wrap", w: "fill", justify: "center" }, [H({ name: "Quest pill", w: "hug", pad: [8, 12], gap: 8, radius: 10, stroke: "border-strong", to: S.quests }, [Ic("briefcase", "accent-text", 14), V({ name: "Text", w: "hug", gap: 0 }, [Tx("QUEST", "Overline", "text-muted", { w: "hug" }), Tx("Deliver printed thesis", "Caption", "accent-text", { w: "hug" })])])]),
      bubble("Hi Bea, are you still on schedule for the drop-off at the main gate?", "3:47 PM", false),
      bubble("Yes, I’ve picked everything up. I should be there in about 12 minutes.", "3:49 PM", true),
      bubble("Perfect. I’m waiting by the main gate.", "3:54 PM", false),
    ]),
    V({ name: "Composer wrap", pad: [0, 12, 12, 12] }, [
      H({ name: "Composer", w: "fill", h: 44, pad: [0, 6, 0, 14], gap: 10, radius: 10, fill: "input", stroke: "border" }, [Ic("plus", "text-muted", 16), Tx("Write a message…", "Body Small", "text-subtle", { w: "fill" }), H({ name: "Send", w: 32, h: 32, radius: 8, fill: "primary", justify: "center" }, [Ic("chevronRight", "on-primary", 16)])]),
    ]),
  ]),
], { nav: "Messages", gap: 14, flow: "Shared" }));

// 17 Profile
SCREENS.push(screen(S.profile, [
  appHeader(),
  V({ name: "Profile hero", pad: 16, gap: 14, radius: 16, fill: "card-purple", stroke: "border-strong" }, [
    H({ name: "Row", w: "fill", gap: 14 }, [
      avatar("BS", "avatar-lime", 56),
      V({ name: "Name", w: "fill", gap: 4 }, [
        Tx("WORKER PROFILE", "Overline", "accent-text"),
        Tx("Bea Santos", "H1", "text"),
        H({ name: "Meta", w: "fill", gap: 4 }, [Ic("pin", "text-muted", 12), Tx("Tanauan City · Joined October 2026", "Caption", "text-muted", { w: "hug" })]),
      ]),
    ]),
    Btn("Edit profile", "Outline"),
  ]),
  panel({ name: "Stats + about" }, [
    H({ name: "Stats", w: "fill", gap: 0, align: "start" }, [
      V({ name: "Rating", w: "fill", gap: 4 }, [Tx("4.9", "Metric", "text"), starsRow(5, 12), Tx("38 reviews", "Caption", "text-muted")]),
      F({ name: "Divider", w: 1, h: 60, fill: "border" }),
      V({ name: "Gigs", w: "fill", gap: 4, pad: [0, 0, 0, 16] }, [Tx("42", "Metric", "text"), Tx("Gigs completed", "Caption", "text-muted")]),
      F({ name: "Divider", w: 1, h: 60, fill: "border" }),
      V({ name: "Completion", w: "fill", gap: 4, pad: [0, 0, 0, 16] }, [Tx("100%", "Metric", "text"), Tx("Completion", "Caption", "text-muted")]),
    ]),
    Divider(),
    H({ name: "About head", w: "fill", justify: "between" }, [Tx("About", "Title", "text", { w: "hug" }), Tx("Edit", "Caption", "accent-text", { w: "hug" })]),
    Tx("BSCS student at FAITH Colleges with experience in deliveries, errands and basic design work. Free weekday afternoons and weekends.", "Body Small", "text-muted"),
    Divider(),
    H({ name: "Skills head", w: "fill", justify: "between" }, [Tx("Skills", "Title", "text", { w: "hug" }), Tx("Edit", "Caption", "accent-text", { w: "hug" })]),
    H({ name: "Skills", w: "fill", gap: 6 }, [skillChip("Errands"), skillChip("Delivery"), skillChip("Photo editing"), skillChip("Canva")]),
  ]),
  panel({ name: "Account", gap: 12 }, [
    H({ name: "Verified", w: "fill", gap: 10 }, [Ic("check", "primary", 16), Tx("Identity verified · GCash linked", "Body Small", "text", { w: "fill" })]),
    Divider(),
    H({ name: "Earnings link", w: "fill", gap: 10, to: S.earnings }, [Ic("wallet", "accent-text", 16), Tx("Earnings and withdrawals", "Body Small", "text", { w: "fill" }), Ic("chevronRight", "text-muted", 14)]),
    Divider(),
    H({ name: "Log out", w: "fill", gap: 10, to: S.login }, [Ic("logout", "error", 16), Tx("Log out", "Body Small", "error", { w: "fill" })]),
  ]),
], { nav: "Profile", gap: 14, flow: "Shared" }));

const FLOWS = [
  ["Start", "Start · Log in & sign up"],
  ["Worker", "Worker flow"],
  ["Client", "Client flow"],
  ["Shared", "Shared · Messages & profile"],
];
