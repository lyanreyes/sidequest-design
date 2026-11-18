// SideQuest design tokens — single source of truth for the Figma plugin and the HTML preview.

const TOKENS = {
  colors: [
    // name, hex, description — sampled from the team's SideQuest screens
    ["bg", "#0A090D", "App background"],
    ["header", "#0C0A11", "Top bars"],
    ["panel", "#100E13", "Main panels that group a section"],
    ["card", "#151219", "Cards inside panels, nav bar"],
    ["card-purple", "#1F162B", "Highlighted cards: active quest, profile hero"],
    ["input", "#141217", "Input and search fields"],
    ["border", "#221E28", "Panel, card and input borders"],
    ["border-strong", "#2E2936", "Outlined buttons, chips"],
    ["primary", "#9CFF27", "Lime — primary actions, active tab, ratings"],
    ["primary-hover", "#86E21A", "Primary hover/pressed"],
    ["on-primary", "#0A090D", "Text and icons on lime"],
    ["accent", "#743BD2", "Purple fill — avatars, sent messages, Client role"],
    ["accent-text", "#A985F7", "Purple text: eyebrows, links, task names"],
    ["accent-soft", "#2A1E3A", "Purple tint: secondary buttons, skill chips, active switch"],
    ["avatar-lime", "#B8FF62", "Avatar fill"],
    ["avatar-blue", "#7EC9FF", "Avatar fill"],
    ["text", "#F5F3F7", "Primary text"],
    ["text-muted", "#8E8896", "Secondary text"],
    ["text-subtle", "#837D8C", "Placeholders and hints"],
    ["success", "#4ADE80", "Verified, payment released"],
    ["error", "#F87171", "Errors"],
  ],
  // name, size, lineHeight, weight, letterSpacing(%), family
  type: [
    ["Display", 32, 38, "Bold", -1, "Manrope"],
    ["H1", 28, 32, "SemiBold", -1, "Manrope"],
    ["H2", 20, 26, "SemiBold", -0.5, "Manrope"],
    ["H3", 17, 22, "Bold", 0, "Manrope"],
    ["Brand", 16, 20, "Bold", 0, "Manrope"],
    ["Metric", 22, 28, "Bold", -0.5, "DM Sans"],
    ["Title", 14, 18, "Bold", 0, "DM Sans"],
    ["Button", 13, 16, "SemiBold", 0, "DM Sans"],
    ["Body", 13, 18, "Regular", 0, "DM Sans"],
    ["Body Small", 12, 16, "Regular", 0, "DM Sans"],
    ["Caption", 10, 14, "Medium", 0, "DM Sans"],
    ["Overline", 9, 12, "Bold", 8, "DM Sans"],
  ],
  spacing: [4, 6, 8, 10, 12, 14, 16, 20, 24, 32],
  radius: [["chip", 999], ["control", 10], ["card", 14], ["panel", 16], ["avatar", 999]],
};

const FAMILIES = ["Manrope", "DM Sans"];
const WEIGHT_CSS = { Regular: 400, Medium: 500, SemiBold: 600, Bold: 700, ExtraBold: 800 };

function colorHex(name) {
  const c = TOKENS.colors.find((c) => c[0] === name);
  if (!c) throw new Error("Unknown color token: " + name);
  return c[1];
}
function typeStyle(name) {
  const t = TOKENS.type.find((t) => t[0] === name);
  if (!t) throw new Error("Unknown type style: " + name);
  return { name: t[0], size: t[1], line: t[2], weight: t[3], tracking: t[4], family: t[5] };
}

// ---------- Icons (24x24, stroke 2, round) ----------
const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
  message: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  bell: '<path d="M6 9a6 6 0 1 1 12 0c0 6 3 7 3 7H3s3-1 3-7M10 20h4"/>',
  pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  chevronRight: '<path d="m9 6 6 6-6 6"/>',
  chevronLeft: '<path d="m15 6-6 6 6 6"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
  wallet: '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18M16 15h2"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
  navigation: '<path d="m3 11 18-8-8 18-2-8z"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
  idCard: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M6 16a3 3 0 0 1 6 0M15 10h3M15 14h3"/>',
  package: '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>',
  laptop: '<rect x="4" y="5" width="16" height="11" rx="1"/><path d="M2 19h20"/>',
  paw: '<circle cx="7" cy="10" r="1.6"/><circle cx="11" cy="6.5" r="1.6"/><circle cx="15.5" cy="7.5" r="1.6"/><circle cx="18" cy="11.5" r="1.6"/><path d="M8.5 17.5c0-2.5 2-4.5 4-4.5s3.5 1.5 3.5 3.5-1.5 2.5-3.5 2.5-4 .5-4-1.5z"/>',
  sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
  logout: '<path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l-5-5 5-5M5 12h11"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
};

function iconSvg(name, hex, size, filled) {
  const body = ICONS[name];
  if (!body) throw new Error("Unknown icon: " + name);
  const paint = filled
    ? `fill="${hex}" stroke="${hex}" stroke-width="1.5"`
    : `fill="none" stroke="${hex}" stroke-width="2"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" ${paint} stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

// Stylized map used for gig location and live tracking
function mapSvg(w, h, opts) {
  opts = opts || {};
  const bg = colorHex("input"), road = "#2A2531", block = "#1A1720";
  const lime = colorHex("primary"), violet = colorHex("accent");
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">`;
  s += `<rect width="${w}" height="${h}" fill="${bg}"/>`;
  const blocks = [[0.05, 0.08, 0.25, 0.3], [0.38, 0.06, 0.22, 0.26], [0.7, 0.1, 0.26, 0.22], [0.08, 0.55, 0.3, 0.35], [0.5, 0.48, 0.18, 0.4], [0.76, 0.5, 0.2, 0.4]];
  for (const b of blocks) s += `<rect x="${b[0] * w}" y="${b[1] * h}" width="${b[2] * w}" height="${b[3] * h}" rx="6" fill="${block}"/>`;
  s += `<path d="M0 ${h * 0.45} H${w} M${w * 0.34} 0 V${h} M${w * 0.68} 0 L${w * 0.72} ${h}" stroke="${road}" stroke-width="10" fill="none"/>`;
  if (opts.route) {
    s += `<path d="M${w * 0.18} ${h * 0.75} L${w * 0.34} ${h * 0.75} L${w * 0.34} ${h * 0.45} L${w * 0.7} ${h * 0.45} L${w * 0.7} ${h * 0.25}" stroke="${violet}" stroke-width="4" stroke-dasharray="8 7" stroke-linecap="round" fill="none"/>`;
    s += `<circle cx="${w * 0.34}" cy="${h * 0.55}" r="14" fill="${violet}" fill-opacity="0.25"/><circle cx="${w * 0.34}" cy="${h * 0.55}" r="7" fill="${violet}" stroke="#fff" stroke-width="2"/>`;
  }
  const px = w * (opts.route ? 0.7 : 0.55), py = h * (opts.route ? 0.25 : 0.42);
  s += `<circle cx="${px}" cy="${py}" r="26" fill="${lime}" fill-opacity="0.15"/>`;
  s += `<path transform="translate(${px - 14} ${py - 30}) scale(1.17)" d="M12 23s-9-7.6-9-13.5a9 9 0 1 1 18 0C21 15.4 12 23 12 23z" fill="${lime}"/><circle cx="${px}" cy="${py - 19}" r="4" fill="${colorHex("on-primary")}"/>`;
  return s + "</svg>";
}

function statusBarSvg(hex) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="68" height="12" viewBox="0 0 68 12" fill="${hex}"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/><path d="M28 3.5a9 9 0 0 1 12 0l-1.4 1.5a7 7 0 0 0-9.2 0zM30.8 6.6a5 5 0 0 1 6.4 0L34 10z"/><rect x="45" y="0.5" width="20" height="11" rx="3" fill="none" stroke="${hex}" stroke-opacity="0.5"/><rect x="47" y="2.5" width="14" height="7" rx="1.5"/><rect x="66" y="4" width="1.5" height="4" rx="0.7" fill-opacity="0.5"/></svg>`;
}

// Sample QR code graphic (placeholder — the real one comes from PayMongo's QR Ph API at payment time)
function qrSvg(size, seed) {
  const n = 29, m = size / n;
  let x = seed || 7, s = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="#FFFFFF"/>`;
  const rnd = () => ((x = (x * 1103515245 + 12345) % 2147483648) / 2147483648);
  const finder = (r, c) => r < 8 && c < 8 || r < 8 && c >= n - 8 || r >= n - 8 && c < 8;
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    if (finder(r, c)) continue;
    if (r >= 12 && r <= 16 && c >= 12 && c <= 16) continue; // centre logo space
    if (rnd() < 0.5) s += `<rect x="${(c * m).toFixed(2)}" y="${(r * m).toFixed(2)}" width="${m.toFixed(2)}" height="${m.toFixed(2)}" fill="#0A090D"/>`;
  }
  for (const [r, c] of [[0, 0], [0, n - 7], [n - 7, 0]]) {
    s += `<rect x="${c * m}" y="${r * m}" width="${7 * m}" height="${7 * m}" fill="#0A090D"/><rect x="${(c + 1) * m}" y="${(r + 1) * m}" width="${5 * m}" height="${5 * m}" fill="#FFFFFF"/><rect x="${(c + 2) * m}" y="${(r + 2) * m}" width="${3 * m}" height="${3 * m}" fill="#0A090D"/>`;
  }
  const c0 = 12.3 * m, w0 = 4.4 * m;
  s += `<rect x="${c0}" y="${c0}" width="${w0}" height="${w0}" rx="${m}" fill="${colorHex("primary")}"/><rect x="${c0 + 1.4 * m}" y="${c0 + 1.4 * m}" width="${1.6 * m}" height="${1.6 * m}" rx="${0.4 * m}" fill="#0A090D"/>`;
  return s + "</svg>";
}
