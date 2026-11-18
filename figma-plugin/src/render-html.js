// Renders the layout tree to HTML so the design can be previewed in a browser.

function hRender(node, parentLayout) {
  if (node.t === "text") return hText(node, parentLayout);
  if (node.t === "icon") return hSvgBox(iconSvg(node.name, colorHex(node.color), node.size, node.filled), node.size, node.size, node, parentLayout);
  if (node.t === "svg") return hSvgBox(node.svg, node.w, node.h, node, parentLayout);
  if (node.t === "button") return hButton(node.variant, node.state, node.label, node.w, parentLayout);
  if (node.t === "buttonSet") return hButtonSet();
  return hFrame(node, parentLayout);
}

function hSize(el, node, parentLayout, defW, defH) {
  const w = node.w !== undefined ? node.w : defW;
  const h = node.h !== undefined ? node.h : defH;
  if (typeof w === "number") { el.style.width = w + "px"; el.style.flexShrink = "0"; }
  else if (w === "fill") {
    if (parentLayout === "H") { el.style.flex = "1 1 0"; el.style.minWidth = "0"; } else el.style.alignSelf = "stretch";
  }
  if (typeof h === "number") { el.style.height = h + "px"; el.style.flexShrink = "0"; }
  else if (h === "fill") {
    if (parentLayout === "V") el.style.flex = "1 1 0"; else el.style.alignSelf = "stretch";
  }
  const absolute = parentLayout === null || node.abs;
  if (absolute && (node.x !== undefined || node.y !== undefined)) {
    el.style.position = "absolute";
    el.style.left = (node.x || 0) + "px";
    if (node.y === "bottom") el.style.bottom = "0"; else el.style.top = (node.y || 0) + "px";
  }
}

function hPad(p) {
  if (p === undefined) return "0";
  if (typeof p === "number") return p + "px";
  if (p.length === 2) return `${p[0]}px ${p[1]}px`;
  return p.map((v) => v + "px").join(" ");
}

const ALIGN = { start: "flex-start", center: "center", end: "flex-end" };
const JUSTIFY = { start: "flex-start", center: "center", end: "flex-end", between: "space-between" };

function hFrame(node, parentLayout) {
  const el = document.createElement("div");
  el.className = "f";
  el.title = node.name || "";
  const layout = node.layout || null;
  if (layout) {
    el.style.display = "flex";
    el.style.flexDirection = layout === "V" ? "column" : "row";
    el.style.gap = (node.gap || 0) + "px";
    el.style.alignItems = ALIGN[node.align || "start"];
    el.style.justifyContent = JUSTIFY[node.justify || "start"];
  }
  el.style.padding = hPad(node.pad);
  if (node.fill) el.style.background = `var(--${node.fill})`;
  const shadows = [];
  if (node.stroke) shadows.push(`inset 0 0 0 ${node.strokeW || 1}px var(--${node.stroke})`);
  if (node.ring) shadows.push(`0 0 0 3px var(--${node.ring})`);
  if (shadows.length) el.style.boxShadow = shadows.join(",");
  if (node.radius) el.style.borderRadius = node.radius + "px";
  if (node.clip) el.style.overflow = "hidden";
  if (node.opacity !== undefined) el.style.opacity = node.opacity;
  if (node.to) el.style.cursor = "pointer";
  el.style.position = "relative";
  const defW = parentLayout === "V" ? "fill" : "hug";
  hSize(el, node, parentLayout, defW, layout ? "hug" : undefined);
  for (const c of node.children) el.appendChild(hRender(c, layout));
  return el;
}

function hTextCss(el, styleName, color) {
  const s = typeStyle(styleName);
  el.style.fontFamily = `"${s.family}", sans-serif`;
  el.style.fontSize = s.size + "px";
  el.style.lineHeight = s.line + "px";
  el.style.fontWeight = WEIGHT_CSS[s.weight];
  el.style.letterSpacing = s.tracking / 100 + "em";
  el.style.color = `var(--${color})`;
}

function hText(node, parentLayout) {
  const el = document.createElement("div");
  el.textContent = node.text;
  hTextCss(el, node.style, node.color);
  el.style.textAlign = node.align || "left";
  const w = node.w !== undefined ? node.w : parentLayout === "V" ? "fill" : "hug";
  if (w === "hug") el.style.whiteSpace = "nowrap";
  hSize(el, Object.assign({}, node, { w }), parentLayout);
  return el;
}

function hSvgBox(svg, w, h, node, parentLayout) {
  const el = document.createElement("div");
  el.innerHTML = svg;
  el.style.display = "flex";
  hSize(el, Object.assign({}, node, { w, h }), parentLayout);
  return el;
}

function hButton(variant, state, label, w, parentLayout) {
  const look = buttonLook(variant, state);
  const node = { t: "frame", name: "Button", layout: "H", h: 44, pad: [0, 18], radius: 10, justify: "center", align: "center",
    fill: look.fill, stroke: look.stroke, ring: look.ring, opacity: look.opacity, w: w === undefined ? (parentLayout === "H" ? "hug" : "fill") : w,
    children: [Tx(label, "Button", look.text, { w: "hug" })] };
  return hFrame(node, parentLayout);
}

function hButtonSet() {
  const node = V({ name: "Button set", gap: 20 }, BUTTON_VARIANTS.map((v) => H({ name: v, w: "fill", gap: 24, align: "start" }, BUTTON_STATES.map((s) =>
    V({ name: s, w: 200, gap: 10, align: "center" }, [Btn(BUTTON_LABEL[v], v, { state: s, w: "fill" }), Tx(`${v} · ${s}`, "Caption", "text-muted", { w: "hug" })])))));
  return hFrame(node, "V");
}
