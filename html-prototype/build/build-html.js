// Generates a static HTML + CSS version of the SideQuest design from the same source as the Figma plugin
// (../../../figma-plugin/src). Run: node build/build-html.js
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", "..", "SideQuest-Figma", "src");
// FLASK_OUT=<folder> builds the Flask version: Jinja templates + /static files + route links.
const FLASK = process.env.FLASK_OUT || "";
const OUT = FLASK || path.join(__dirname, "..");
const code = ["tokens.js", "screens.js", "designsystem.js"].map((f) => fs.readFileSync(path.join(SRC, f), "utf8")).join("\n");
const D = new Function(code + "\nreturn { TOKENS, SCREENS, DESIGN_SYSTEM, FLOWS, BUTTON_VARIANTS, BUTTON_STATES, BUTTON_LABEL, buttonLook, typeStyle, iconSvg, colorHex, Tx, V, H, Btn, W, HGT };")();

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// The first screen (Log in) is the app's start page: index.html
const base = (name) => name.replace(/[·()&]/g, "").trim().toLowerCase().replace(/\s+/g, "-").replace(/-+/g, "-");
const route = (name) => (name === D.SCREENS[0].name ? "/" : "/" + base(name).replace(/^\d+-/, ""));
const slug = (name) => (FLASK ? route(name) : name === D.SCREENS[0].name ? "index.html" : base(name) + ".html");
const fileFor = (name) => (FLASK ? path.join("templates", base(name).replace(/^\d+-/, "") + ".html") : slug(name));
const asset = (f) => (FLASK ? "/static/" + f : f);
const fieldName = (label) => label.toLowerCase().replace(/\(.*?\)/g, "").trim().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
// Buttons that send data to Flask (FLASK build only): label -> /api/<action>
const ACTIONS = { "Log in": "login", "Create account": "signup", "Verify": "verify", "Post task": "tasks", "Submit review": "reviews", "Send offer · ₱450": "offers", "Accept": "accept" };
const typeClass = (style) => "t-" + style.toLowerCase().replace(/\s+/g, "-");
const href = (to) => (to === "BACK" ? "javascript:history.back()" : slug(to));

// ---------- styles.css ----------
function buildCss() {
  const vars = D.TOKENS.colors.map(([n, hex]) => `  --${n}: ${hex};`).join("\n");
  const types = D.TOKENS.type.map(([name]) => {
    const s = D.typeStyle(name);
    return `.${typeClass(name)} { font-family: "${s.family}", sans-serif; font-size: ${s.size}px; line-height: ${s.line}px; font-weight: ${({ Regular: 400, Medium: 500, SemiBold: 600, Bold: 700, ExtraBold: 800 })[s.weight]}; letter-spacing: ${s.tracking / 100}em;${name === "Overline" ? " text-transform: uppercase;" : ""} }`;
  }).join("\n");
  const colorUtils = D.TOKENS.colors.map(([n]) => `.c-${n} { color: var(--${n}); }`).join("\n");
  return `/* SideQuest design system — generated from the Figma design tokens */
@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap");

:root {
${vars}
  --radius-chip: 999px;
  --radius-control: 10px;
  --radius-card: 14px;
  --radius-panel: 16px;
}

* { box-sizing: border-box; margin: 0; }
body { background: #050508; color: var(--text); font-family: "DM Sans", sans-serif; min-height: 100vh; }
a { color: inherit; text-decoration: none; }
p { margin: 0; }

/* Type scale */
${types}

/* Text colors */
${colorUtils}

/* Page shell */
.page { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 24px 16px 48px; }
.page.app { min-height: 100vh; justify-content: center; padding: 24px 16px; }
.topbar { width: 100%; max-width: 1280px; display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
.topbar a { color: var(--accent-text); font: 600 13px "DM Sans", sans-serif; }
.topbar.narrow { max-width: ${D.W}px; }
.topbar .title { color: var(--text-muted); font: 600 13px "DM Sans", sans-serif; }

/* Phone frame */
.phone { position: relative; width: ${D.W}px; height: ${D.HGT}px; background: var(--bg); border-radius: 40px; overflow: hidden; box-shadow: 0 0 0 8px #1B1B22, 0 24px 60px rgba(0, 0, 0, .5); flex-shrink: 0; }
.phone .scroll { overflow-y: auto; scrollbar-width: none; }
.phone .scroll::-webkit-scrollbar { display: none; }
@media (max-width: 430px) { .page, .page.app { padding: 0; } .topbar { padding: 12px 16px 0; } .phone { width: 100vw; height: 100dvh; border-radius: 0; box-shadow: none; } }

/* Layout primitives */
.f { position: relative; box-sizing: border-box; }
.row { display: flex; flex-direction: row; }
.col { display: flex; flex-direction: column; }
.nowrap { white-space: nowrap; }
.svg { display: flex; flex-shrink: 0; }

/* Buttons */
.btn { display: flex; align-items: center; justify-content: center; height: 44px; padding: 0 18px; border-radius: var(--radius-control); border: 1px solid transparent; cursor: pointer; transition: background .15s, box-shadow .15s; font: 600 13px/16px "DM Sans", sans-serif; }
.btn-primary { background: var(--primary); color: var(--on-primary); }
.btn-primary:hover { background: var(--primary-hover); }
.btn-purple { background: var(--accent-soft); color: var(--accent-text); }
.btn-purple:hover { background: var(--card-purple); border-color: var(--accent-text); }
.btn-outline { background: transparent; color: var(--text); border-color: var(--border-strong); }
.btn-outline:hover { background: var(--card); }
.btn:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--accent-text); }
.btn.is-disabled { opacity: .35; pointer-events: none; }
a.link, .link { cursor: pointer; }
a.link:hover { filter: brightness(1.12); }

/* Typable fields */
.input { flex: 1 1 0; min-width: 0; align-self: stretch; background: transparent; border: 0; outline: 0; padding: 0; color: var(--text); resize: none; }
.input::placeholder { color: var(--text-subtle); opacity: 1; }
textarea.input { padding: 12px 0; height: 100%; }
.input.otp { width: 100%; height: 100%; text-align: center; caret-color: var(--accent-text); }
.field { cursor: text; transition: box-shadow .15s; }
.field:focus-within { box-shadow: inset 0 0 0 2px var(--accent-text) !important; }
.pw-toggle { background: none; border: 0; padding: 0; cursor: pointer; }
.input[type=search]::-webkit-search-cancel-button { filter: invert(1); }

/* Index */
.gallery { width: 100%; max-width: 1280px; display: flex; flex-direction: column; gap: 32px; }
.gallery h1 { font: 700 36px/1.1 "Manrope", sans-serif; }
.gallery h2 { font: 700 20px "Manrope", sans-serif; color: var(--primary); margin-bottom: 14px; }
.gallery p.lead { color: var(--text-muted); max-width: 720px; line-height: 1.5; }
.cards { display: flex; flex-wrap: wrap; gap: 14px; }
.cards a { display: flex; flex-direction: column; gap: 6px; padding: 16px; width: 220px; border-radius: var(--radius-card); background: var(--panel); border: 1px solid var(--border); }
.cards a:hover { border-color: var(--primary); }
.cards a span { color: var(--text-muted); font-size: 12px; }
`;
}

const FLASK_CSS = `
/* Flask: feedback message from the server */
.flash { position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%); max-width: 360px; padding: 12px 16px; border-radius: 12px; font: 600 13px "DM Sans", sans-serif; box-shadow: 0 8px 24px rgba(0,0,0,.4); z-index: 10; }
.flash.ok { background: var(--primary); color: var(--on-primary); }
.flash.err { background: var(--error); color: #1a0b0b; }
`;

// ---------- node rendering ----------
const ALIGN = { start: "flex-start", center: "center", end: "flex-end" };
const JUSTIFY = { start: "flex-start", center: "center", end: "flex-end", between: "space-between" };
const pad = (p) => (p === undefined ? "" : typeof p === "number" ? `${p}px` : p.length === 2 ? `${p[0]}px ${p[1]}px` : p.map((v) => v + "px").join(" "));

function sizeStyles(node, parentLayout, defW, defH) {
  const st = [];
  const w = node.w !== undefined ? node.w : defW;
  const h = node.h !== undefined ? node.h : defH;
  if (typeof w === "number") st.push(`width:${w}px`, "flex-shrink:0");
  else if (w === "fill") st.push(parentLayout === "H" ? "flex:1 1 0;min-width:0" : "align-self:stretch");
  if (typeof h === "number") st.push(`height:${h}px`, "flex-shrink:0");
  else if (h === "fill") st.push(parentLayout === "V" ? "flex:1 1 0" : "align-self:stretch");
  if ((parentLayout === null || node.abs) && (node.x !== undefined || node.y !== undefined)) {
    st.push("position:absolute", `left:${node.x || 0}px`, node.y === "bottom" ? "bottom:0" : `top:${node.y || 0}px`);
  }
  return st;
}

function wrapLink(html, node, cls) {
  return node.to ? html.replace(/^<div class="/, `<a href="${href(node.to)}" class="link `).replace(/<\/div>$/, "</a>") : html;
}

function render(node, parentLayout, ctx) {
  // a link can't contain another link: inside a linked card, inner elements stay plain
  if (node.to && ctx.inLink) node = { ...node, to: undefined };
  switch (node.t) {
    case "text": {
      if (ctx.field && !ctx.field.used && (node.w === "fill" || ctx.field.kind === "Digit")) {
        ctx.field.used = true;
        return renderInput(node, ctx.field);
      }
      const w = node.w !== undefined ? node.w : parentLayout === "V" ? "fill" : "hug";
      const st = sizeStyles({ ...node, w }, parentLayout);
      if (node.align && node.align !== "left") st.push(`text-align:${node.align}`);
      const cls = `${typeClass(node.style)} c-${node.color}${w === "hug" ? " nowrap" : ""}`;
      const tag = node.to ? `a href="${href(node.to)}" class="link ${cls}"` : `p class="${cls}"`;
      return `<${tag}${st.length ? ` style="${st.join(";")}"` : ""}>${esc(node.text)}</${node.to ? "a" : "p"}>`;
    }
    case "icon":
    case "svg": {
      const w = node.t === "icon" ? node.size : node.w, h = node.t === "icon" ? node.size : node.h;
      const svg = node.t === "icon" ? D.iconSvg(node.name, D.colorHex(node.color), node.size, node.filled) : node.svg;
      const st = sizeStyles({ ...node, w, h }, parentLayout);
      if (ctx.field && node.name === "eye") return `<button type="button" class="pw-toggle svg" aria-label="Show password" style="${st.join(";")}">${svg}</button>`;
      return `<span class="svg" aria-hidden="true" style="${st.join(";")}">${svg.replace(/^<svg /, '<svg aria-hidden="true" ')}</span>`;
    }
    case "button": {
      const look = D.buttonLook(node.variant, node.state);
      const w = node.w !== undefined ? node.w : parentLayout === "H" ? "hug" : "fill";
      const st = sizeStyles({ ...node, w }, parentLayout);
      const cls = `btn btn-${node.variant.toLowerCase()}${node.state === "Disabled" ? " is-disabled" : ""}`;
      const act = FLASK && ACTIONS[node.label] ? ` data-action="${ACTIONS[node.label]}"` : "";
      const ring = node.state === "Focus" ? ";box-shadow:0 0 0 2px var(--accent-text)" : node.state === "Hover" && look.fill ? `;background:var(--${look.fill})${look.stroke ? `;border-color:var(--${look.stroke})` : ""}` : "";
      return node.to
        ? `<a href="${href(node.to)}" class="${cls}"${act} style="${st.join(";")}${ring}">${esc(node.label)}</a>`
        : `<button type="button" class="${cls}"${act} style="${st.join(";")}${ring}">${esc(node.label)}</button>`;
    }
    case "buttonSet":
      return render(D.V({ name: "Button set", gap: 20 }, D.BUTTON_VARIANTS.map((v) => D.H({ name: v, w: "fill", gap: 24, align: "start" }, D.BUTTON_STATES.map((s) =>
        D.V({ name: s, w: 200, gap: 10, align: "center" }, [D.Btn(D.BUTTON_LABEL[v], v, { state: s, w: "fill" }), D.Tx(`${v} · ${s}`, "Caption", "text-muted", { w: "hug" })]))))), "V", ctx);
  }

  // frame
  const layout = node.layout || null;
  const st = [];
  if (layout) {
    st.push(`gap:${node.gap || 0}px`);
    if ((node.align || "start") !== "start") st.push(`align-items:${ALIGN[node.align]}`); else st.push("align-items:flex-start");
    if ((node.justify || "start") !== "start") st.push(`justify-content:${JUSTIFY[node.justify]}`);
  }
  if (node.pad !== undefined) st.push(`padding:${pad(node.pad)}`);
  if (node.fill) st.push(`background:var(--${node.fill})`);
  const shadows = [];
  if (node.stroke) shadows.push(`inset 0 0 0 ${node.strokeW || 1}px var(--${node.stroke})`);
  if (node.ring) shadows.push(`0 0 0 2px var(--${node.ring})`);
  if (shadows.length) st.push(`box-shadow:${shadows.join(",")}`);
  if (node.radius) st.push(`border-radius:${node.radius}px`);
  if (node.clip) st.push("overflow:hidden");
  if (node.opacity !== undefined) st.push(`opacity:${node.opacity}`);

  let extraClass = "";
  if (ctx.scrollContent) {
    // first child of a screen: make it the scrollable area between the status bar and the bottom
    ctx.scrollContent = false;
    st.push("position:absolute", "left:0", `top:${node.y}px`, "bottom:0", `width:${node.w}px`);
    extraClass = " scroll";
  } else {
    st.push(...sizeStyles(node, parentLayout, parentLayout === "V" ? "fill" : "hug", layout ? "hug" : undefined));
  }
  const inner = { ...ctx, inLink: ctx.inLink || !!node.to };
  if (node.name && node.name.startsWith("Input / ")) inner.inputLabel = node.name.slice(8);
  const isField = FIELD_FRAMES.includes(node.name);
  if (isField) inner.field = { kind: node.name, label: inner.inputLabel || (node.name === "Composer" ? "Message" : node.name === "Search" ? "Search" : "Digit"), used: false };
  if (isField) extraClass += " field";
  const kids = node.children.map((c) => render(c, layout, inner)).join("");
  ctx.scrollContent = inner.scrollContent;
  const cls = `f${layout === "V" ? " col" : layout === "H" ? " row" : ""}${extraClass}`;
  const label = node.name ? ` data-name="${esc(node.name)}"` : "";
  return wrapLink(`<div class="${cls}"${label}${st.length ? ` style="${st.join(";")}"` : ""}>${kids}</div>`, node);
}

const FIELD_FRAMES = ["Field", "Search", "Composer", "Digit"];
let digitCount = 0;

/** A real <input>/<textarea> styled like the design's text. */
function renderInput(node, field) {
  const isValue = node.color === "text";
  const cls = `input ${typeClass(node.style)}`;
  const label = field.label;
  const text = esc(node.text);
  if (field.kind === "Digit") {
    digitCount++;
    return `<input class="${cls} otp" inputmode="numeric" maxlength="1" autocomplete="one-time-code" aria-label="Digit ${digitCount}" name="digit${digitCount}" value="${text}">`;
  }
  const valueOrPlaceholder = (isValue ? `value="${text}"` : `placeholder="${text}"`) + ` name="${fieldName(label)}"`;
  if (/^(Details|Review)/.test(label)) return `<textarea class="${cls}" rows="2" name="${fieldName(label)}" aria-label="${esc(label)}" ${isValue ? "" : `placeholder="${text}"`}>${isValue ? text : ""}</textarea>`;
  const type = /Password/.test(label) ? "password" : /Email/.test(label) ? "email" : /Mobile/.test(label) ? "tel" : field.kind === "Search" ? "search" : "text";
  const extra = /pay/i.test(label) ? ' inputmode="decimal"' : field.kind === "Composer" ? ' data-chat enterkeyhint="send"' : "";
  return `<input class="${cls}" type="${type}" aria-label="${esc(label)}" ${valueOrPlaceholder}${extra}>`;
}

function renderScreen(s) {
  const kids = s.children.map((c, i) => render(c, null, { scrollContent: i === 0 })).join("");
  return `<div class="phone" role="main" aria-label="${esc(s.name)}">${kids}</div>`;
}

// ---------- pages ----------
const page = (title, body) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<link rel="stylesheet" href="${asset("styles.css")}">
</head>
<body>
${body}
${FLASK ? '<p class="flash" role="status" aria-live="polite" hidden></p>' : ""}<script src="${asset("app.js")}"></script>
</body>
</html>
`;

if (FLASK) ["templates", "static"].forEach((d) => fs.mkdirSync(path.join(OUT, d), { recursive: true }));
fs.writeFileSync(path.join(OUT, FLASK ? "static/styles.css" : "styles.css"), buildCss() + (FLASK ? FLASK_CSS : ""));

const order = D.SCREENS;
order.forEach((s, i) => {
  const title = i === 0 ? "SideQuest" : `SideQuest · ${s.name.replace(/^\d+ · /, "")}`;
  fs.writeFileSync(path.join(OUT, fileFor(s.name)), page(title, `<div class="page app">${renderScreen(s)}</div>`));
});

const ds = render(D.DESIGN_SYSTEM, undefined, {});
fs.writeFileSync(path.join(OUT, FLASK ? "templates/design-system.html" : "design-system.html"), page("SideQuest · Design System", `<div class="page"><nav class="topbar"><a href="${FLASK ? "/" : "index.html"}">← Back to the app</a><span class="title">Design system</span><span></span></nav>${ds}</div>`));

if (FLASK) {
  const routes = D.SCREENS.map((s) => ({ path: route(s.name), template: path.basename(fileFor(s.name)), endpoint: base(s.name).replace(/^\d+-/, "").replace(/-/g, "_"), title: s.name.replace(/^\d+ · /, "") }));
  routes.push({ path: "/design-system", template: "design-system.html", endpoint: "design_system", title: "Design system" });
  fs.writeFileSync(path.join(OUT, "routes.json"), JSON.stringify(routes, null, 2));
  fs.writeFileSync(path.join(OUT, "templates/404.html"), page("SideQuest · Page not found", `<div class="page app"><div class="phone"><div class="f col" style="position:absolute;inset:0;padding:32px 24px;gap:14px;justify-content:center;align-items:flex-start"><p class="t-overline c-accent-text">Error 404</p><p class="t-h1 c-text">Page not found</p><p class="t-body c-text-muted">We couldn't find that page. It may have moved, or the link is wrong.</p><a class="btn btn-primary" style="align-self:stretch" href="/discover-worker">Go to Discover</a><a class="btn btn-outline" style="align-self:stretch" href="/">Back to Log in</a></div></div></div>`));
}
console.log(`Wrote ${order.length} screens (index.html = Log in), design-system.html and styles.css to ${OUT}`);
