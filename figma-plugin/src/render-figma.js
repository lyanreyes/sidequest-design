// Renders the layout tree into Figma: variables, text styles, Button component set, screens and prototype links.

const VARS = {};
const TEXT_STYLES = {};
const BUTTONS = {};
const SCREEN_NODES = {};
const LINKS = [];
const FONT = {}; // family -> { family, styles: { Regular: "...", ... } }

function rgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}

function paint(token) {
  const p = { type: "SOLID", color: rgb(colorHex(token)) };
  return VARS[token] ? figma.variables.setBoundVariableForPaint(p, "color", VARS[token]) : p;
}

async function loadFonts() {
  const norm = (s) => s.replace(/\s+/g, "").toLowerCase();
  const fonts = await figma.listAvailableFontsAsync();
  const missing = [];
  for (const want of FAMILIES) {
    const weights = Array.from(new Set(TOKENS.type.filter((t) => t[5] === want).map((t) => t[3])));
    let chosen = null;
    for (const family of [want, "Inter"]) {
      const styles = fonts.filter((f) => f.fontName.family === family).map((f) => f.fontName.style);
      const found = weights.map((w) => styles.find((s) => norm(s) === norm(w)));
      if (found.every(Boolean)) {
        chosen = { family, styles: {} };
        weights.forEach((w, i) => (chosen.styles[w] = found[i]));
        break;
      }
    }
    if (!chosen) throw new Error(`Font ${want} (and the Inter fallback) is not available.`);
    if (chosen.family !== want) missing.push(want);
    for (const s of Object.values(chosen.styles)) await figma.loadFontAsync({ family: chosen.family, style: s });
    FONT[want] = chosen;
  }
  if (missing.length) figma.notify(missing.join(" and ") + " not found, so Inter is used instead.");
}

function fontFor(styleName) {
  const s = typeStyle(styleName);
  const f = FONT[s.family];
  return { family: f.family, style: f.styles[s.weight] };
}

function createVariables() {
  const coll = figma.variables.createVariableCollection("SideQuest");
  const mode = coll.modes[0].modeId;
  coll.renameMode(mode, "Dark");
  const make = (name, type, value, desc) => {
    const v = figma.variables.createVariable(name, coll, type);
    v.setValueForMode(mode, value);
    if (desc) v.description = desc;
    return v;
  };
  for (const [name, hex, desc] of TOKENS.colors) VARS[name] = make("color/" + name, "COLOR", rgb(hex), desc);
  for (const s of TOKENS.spacing) make("space/" + s, "FLOAT", s);
  for (const [name, r] of TOKENS.radius) make("radius/" + name, "FLOAT", r);
}

function createTextStyles() {
  for (const t of TOKENS.type) {
    const s = typeStyle(t[0]);
    const st = figma.createTextStyle();
    st.name = `SideQuest/${s.name}`;
    st.description = `${s.family} ${s.weight} ${s.size}/${s.line}`;
    st.fontName = fontFor(s.name);
    st.fontSize = s.size;
    st.lineHeight = { unit: "PIXELS", value: s.line };
    st.letterSpacing = { unit: "PERCENT", value: s.tracking };
    TEXT_STYLES[s.name] = st;
  }
}

async function makeText(str, styleName, color) {
  const t = figma.createText();
  t.fontName = fontFor(styleName);
  t.characters = str;
  const st = TEXT_STYLES[styleName];
  if (t.setTextStyleIdAsync) await t.setTextStyleIdAsync(st.id); else t.textStyleId = st.id;
  t.fills = [paint(color)];
  return t;
}

function sizing(n, node, parentLayout, defW, defH, selfAuto) {
  const inAuto = parentLayout === "V" || parentLayout === "H";
  if (node.abs && inAuto) n.layoutPositioning = "ABSOLUTE";
  const apply = (key, v) => {
    try {
      if (typeof v === "number") { if (inAuto || selfAuto) n[key] = "FIXED"; }
      else if (v === "fill") { if (inAuto && !node.abs) n[key] = "FILL"; }
      else if (v === "hug") { if (selfAuto || n.type === "TEXT") n[key] = "HUG"; }
    } catch (e) { /* sizing mode not allowed in this context */ }
  };
  apply("layoutSizingHorizontal", node.w !== undefined ? node.w : defW);
  apply("layoutSizingVertical", node.h !== undefined ? node.h : defH);
  if ((parentLayout === null || node.abs) && (node.x !== undefined || node.y !== undefined)) {
    n.x = node.x || 0;
    if (node.y !== "bottom") n.y = node.y || 0;
  }
}

const F_ALIGN = { start: "MIN", center: "CENTER", end: "MAX" };
const F_JUSTIFY = { start: "MIN", center: "CENTER", end: "MAX", between: "SPACE_BETWEEN" };

function setPadding(f, p) {
  if (p === undefined) return;
  let t, r, b, l;
  if (typeof p === "number") t = r = b = l = p;
  else if (p.length === 2) { t = b = p[0]; r = l = p[1]; }
  else [t, r, b, l] = p;
  f.paddingTop = t; f.paddingRight = r; f.paddingBottom = b; f.paddingLeft = l;
}

function ringEffect(token) {
  return [{ type: "DROP_SHADOW", color: Object.assign(rgb(colorHex(token)), { a: 1 }), offset: { x: 0, y: 0 }, radius: 0, spread: 2, visible: true, blendMode: "NORMAL", showShadowBehindNode: false }];
}

function styleFrame(f, node) {
  f.name = node.name || "Frame";
  f.fills = node.fill ? [paint(node.fill)] : [];
  f.clipsContent = !!node.clip;
  if (node.radius) f.cornerRadius = node.radius;
  if (node.stroke) { f.strokes = [paint(node.stroke)]; f.strokeWeight = node.strokeW || 1; f.strokeAlign = "INSIDE"; }
  if (node.ring) f.effects = ringEffect(node.ring);
  if (node.opacity !== undefined) f.opacity = node.opacity;
  if (node.layout) {
    f.layoutMode = node.layout === "V" ? "VERTICAL" : "HORIZONTAL";
    f.itemSpacing = node.gap || 0;
    f.primaryAxisAlignItems = F_JUSTIFY[node.justify || "start"];
    f.counterAxisAlignItems = F_ALIGN[node.align || "start"];
    setPadding(f, node.pad);
  }
}

async function fRender(node, parent, parentLayout) {
  const n = await fRenderNode(node, parent, parentLayout);
  if (node.to) LINKS.push([n, node.to]);
  return n;
}

async function fRenderNode(node, parent, parentLayout) {
  let n;
  if (node.t === "text") {
    n = await makeText(node.text, node.style, node.color);
    n.name = node.name || node.text.slice(0, 40);
    n.textAlignHorizontal = { left: "LEFT", center: "CENTER", right: "RIGHT" }[node.align || "left"];
    parent.appendChild(n);
    const w = node.w !== undefined ? node.w : parentLayout === "V" ? "fill" : "hug";
    if (w === "fill" && (parentLayout === "V" || parentLayout === "H")) { n.layoutSizingHorizontal = "FILL"; n.textAutoResize = "HEIGHT"; }
    else if (typeof w === "number") { n.resize(w, n.height); n.textAutoResize = "HEIGHT"; }
    else n.textAutoResize = "WIDTH_AND_HEIGHT";
    sizing(n, Object.assign({}, node, { w: undefined, h: undefined }), parentLayout);
    return n;
  }
  if (node.t === "icon" || node.t === "svg") {
    const svg = node.t === "icon" ? iconSvg(node.name, colorHex(node.color), node.size, node.filled) : node.svg;
    n = figma.createNodeFromSvg(svg);
    n.name = node.t === "icon" ? "Icon / " + node.name : node.name;
    n.fills = [];
    if (node.t === "icon") {
      for (const v of n.findAll(() => true)) {
        if ("strokes" in v && v.strokes.length) v.strokes = [paint(node.color)];
        if ("fills" in v && v.fills.length) v.fills = [paint(node.color)];
      }
    }
    parent.appendChild(n);
    sizing(n, Object.assign({}, node, { w: node.t === "icon" ? node.size : node.w, h: node.t === "icon" ? node.size : node.h }), parentLayout);
    return n;
  }
  if (node.t === "button") {
    n = BUTTONS[node.variant + "/" + node.state].createInstance();
    n.name = "Button / " + node.label;
    n.findOne((c) => c.type === "TEXT").characters = node.label;
    parent.appendChild(n);
    const w = node.w !== undefined ? node.w : parentLayout === "H" ? "hug" : "fill";
    sizing(n, Object.assign({}, node, { w, h: 44 }), parentLayout, w, 44, true);
    return n;
  }
  if (node.t === "buttonSet") return buildButtonSet(parent);

  n = figma.createFrame();
  styleFrame(n, node);
  n.resize(typeof node.w === "number" ? node.w : 100, typeof node.h === "number" ? node.h : 100);
  parent.appendChild(n);
  const selfAuto = !!node.layout;
  sizing(n, node, parentLayout, parentLayout === "V" ? "fill" : "hug", selfAuto ? "hug" : undefined, selfAuto);
  for (const c of node.children) await fRender(c, n, node.layout || null);
  for (let i = 0; i < node.children.length; i++) {
    const spec = node.children[i], child = n.children[i];
    if (spec.y === "bottom") { child.y = n.height - child.height; child.constraints = { horizontal: "STRETCH", vertical: "MAX" }; }
    if (spec.name === "Bottom nav") child.constraints = { horizontal: "STRETCH", vertical: "MAX" };
  }
  if (node.screen) {
    // Scroll the content in prototypes while the status bar, header, nav and bottom buttons stay put.
    n.overflowDirection = "VERTICAL";
    if (node.fixed) n.numberOfFixedChildren = node.fixed;
    const content = n.children[0];
    if (content.y + content.height > n.height) n.clipsContent = true;
  }
  return n;
}

function pageOf(node) {
  let p = node;
  while (p && p.type !== "PAGE") p = p.parent;
  return p;
}

async function buildButtonSet(parent) {
  const page = pageOf(parent);
  const comps = [];
  for (const v of BUTTON_VARIANTS) {
    for (const s of BUTTON_STATES) {
      const look = buttonLook(v, s);
      const c = figma.createComponent();
      page.appendChild(c); // combineAsVariants needs the components on the same page as the set
      c.name = `Variant=${v}, State=${s}`;
      styleFrame(c, { name: c.name, layout: "H", justify: "center", align: "center", pad: [0, 18], radius: 10, fill: look.fill, stroke: look.stroke, ring: look.ring, opacity: look.opacity });
      c.resize(200, 44);
      c.primaryAxisSizingMode = "FIXED";
      c.counterAxisSizingMode = "FIXED";
      const t = await makeText(BUTTON_LABEL[v], "Button", look.text);
      t.name = "Label";
      c.appendChild(t);
      t.textAutoResize = "WIDTH_AND_HEIGHT";
      comps.push(c);
      BUTTONS[v + "/" + s] = c;
    }
  }
  const set = figma.combineAsVariants(comps, parent);
  set.name = "Button";
  set.fills = [];
  comps.forEach((c, i) => { c.x = 24 + (i % BUTTON_STATES.length) * 232; c.y = 24 + Math.floor(i / BUTTON_STATES.length) * 72; });
  set.resize(24 + BUTTON_STATES.length * 232, 24 + BUTTON_VARIANTS.length * 72);
  set.description = "SideQuest button. Variant: Primary / Purple / Outline. State: Default / Hover / Disabled (35% opacity) / Focus (purple ring).";
  return set;
}

async function addLabel(page, text, x, y) {
  const t = await makeText(text, "H1", "primary");
  page.appendChild(t);
  t.x = x; t.y = y;
}

async function addLinks() {
  let ok = 0;
  for (const [node, target] of LINKS) {
    let action;
    if (target === "BACK") action = { type: "BACK" };
    else {
      const dest = SCREEN_NODES[target];
      if (!dest) continue;
      action = { type: "NODE", destinationId: dest.id, navigation: "NAVIGATE", transition: { type: "DISSOLVE", easing: { type: "EASE_OUT" }, duration: 0.2 }, preserveScrollPosition: false };
    }
    const reaction = { trigger: { type: "ON_CLICK" }, actions: [action] };
    try {
      if (node.setReactionsAsync) await node.setReactionsAsync([reaction]); else node.reactions = [reaction];
      ok++;
    } catch (e) { console.warn("Could not link", node.name, "->", target, e); }
  }
  return ok;
}

async function main() {
  figma.notify("Building SideQuest… this takes about 20 seconds.", { timeout: 6000 });
  await loadFonts();
  createVariables();
  createTextStyles();

  const dsPage = figma.createPage(); dsPage.name = "🎨 Design System";
  const scPage = figma.createPage(); scPage.name = "📱 Screens";

  // New layers are created on the current page, so switch pages before building each one.
  if (figma.setCurrentPageAsync) await figma.setCurrentPageAsync(dsPage); else figma.currentPage = dsPage;
  const ds = await fRender(DESIGN_SYSTEM, dsPage, undefined);
  ds.x = 0; ds.y = 0;
  LINKS.length = 0; // components on the design-system page are not prototype links

  if (figma.setCurrentPageAsync) await figma.setCurrentPageAsync(scPage); else figma.currentPage = scPage;
  let y = 0;
  for (const [key, title] of FLOWS) {
    await addLabel(scPage, title, 0, y);
    const list = SCREENS.filter((s) => s.flow === key);
    for (let i = 0; i < list.length; i++) {
      const n = await fRender(list[i], scPage, undefined);
      n.x = i * (W + 80); n.y = y + 70;
      SCREEN_NODES[list[i].name] = n;
    }
    y += 70 + HGT + 160;
  }

  const linked = await addLinks();
  try {
    scPage.flowStartingPoints = [{ nodeId: SCREEN_NODES[SCREENS[0].name].id, name: "SideQuest prototype" }];
  } catch (e) { /* optional */ }

  if (figma.setCurrentPageAsync) await figma.setCurrentPageAsync(scPage); else figma.currentPage = scPage;
  figma.viewport.scrollAndZoomIntoView(scPage.children);
  figma.closePlugin(`SideQuest: design system + ${SCREENS.length} screens created, ${linked} prototype links ✔ Press Play to try it.`);
}

main().catch((e) => figma.closePlugin("SideQuest plugin error: " + (e && e.message ? e.message : e)));
