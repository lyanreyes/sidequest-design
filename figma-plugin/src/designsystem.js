// "Design System" page: colors, type scale, spacing, radius and components.

function section(num, title, sub, children) {
  return V({ name: "Section / " + title, gap: 20 }, [
    H({ name: "Heading", w: "fill", gap: 12, align: "end" }, [
      Tx(num, "Overline", "primary", { w: "hug" }),
      Tx(title, "H2", "text", { w: "hug" }),
      sub ? Tx(sub, "Body Small", "text-muted", { w: "fill", align: "right" }) : null,
    ].filter(Boolean)),
    Divider(),
  ].concat(children));
}

function swatch(c) {
  return V({ name: "Swatch / " + c[0], w: 140, gap: 6 }, [
    F({ name: "Color", w: "fill", h: 64, radius: 10, fill: c[0], stroke: "border" }),
    Tx(c[0], "Button", "text"),
    Tx(c[1], "Caption", "text-muted"),
    Tx(c[2], "Caption", "text-subtle"),
  ]);
}

function grid(items, perRow, gap) {
  const out = [];
  for (let i = 0; i < items.length; i += perRow) out.push(H({ name: "Row", w: "fill", gap, align: "start" }, items.slice(i, i + perRow)));
  return V({ name: "Grid", gap }, out);
}

const TYPE_SAMPLES = { Display: "₱2,340.00", H1: "Find your next gig", H2: "Deliver printed thesis", H3: "Gigs around you", Brand: "SideQuest", Metric: "₱450  42  4.9", Title: "Pick up art supplies", Button: "Log in", Body: "Enter your email address", "Body Small": "Browse flexible work available in your area.", Caption: "Today, 4:30 PM", Overline: "CURATED FOR YOU" };

function typeRow(t) {
  const s = typeStyle(t[0]);
  return H({ name: "Type / " + t[0], w: "fill", gap: 20, pad: [10, 0] }, [
    V({ name: "Spec", w: 150, gap: 2 }, [Tx(t[0], "Button", "primary"), Tx(s.family, "Caption", "text-muted")]),
    Tx(TYPE_SAMPLES[t[0]], t[0], "text", { w: "fill" }),
    Tx(`${s.size}/${s.line} · ${s.weight}${s.tracking ? " · " + s.tracking + "%" : ""}`, "Caption", "text-muted", { w: "hug" }),
  ]);
}

const DESIGN_SYSTEM = V({ name: "SideQuest · Design System", w: 1280, pad: 56, gap: 52, fill: "bg", radius: 24, ds: true }, [
  H({ name: "Top", w: "fill", justify: "between" }, [H({ name: "Brand", w: "hug", gap: 10 }, [logo(30), Tx("SideQuest", "Brand", "text", { w: "hug" })]), Tx("VISUAL INVENTORY", "Overline", "text-muted", { w: "hug" })]),
  H({ name: "Hero", w: "fill", gap: 40, align: "end" }, [
    V({ name: "Title", w: "fill", gap: 10 }, [
      Tx("Small details. SideQuest energy.", "Display", "text"),
      Tx("A mini design system for the SideQuest app: color, type, space and controls. Saved as Figma variables, text styles and components.", "Body", "text-muted"),
    ]),
    V({ name: "Note", w: 320, gap: 4 }, [Tx("SAVED IN THIS FILE", "Overline", "primary"), Tx("21 color variables · 12 text styles · spacing and radius variables · Button component set", "Body Small", "text-muted")]),
  ]),
  F({ name: "Rule", w: "fill", h: 2, fill: "primary" }),
  section("01", "Color palette", "Variables in the “SideQuest” collection. Every screen is bound to them.", [grid(TOKENS.colors.map(swatch), 7, 16)]),
  section("02", "Typography", "Manrope for headings and identity · DM Sans for content and controls", [V({ name: "Type list", gap: 0 }, TOKENS.type.map(typeRow))]),
  H({ name: "Space + radius", w: "fill", gap: 48, align: "start" }, [
    V({ name: "Col", w: "fill" }, [section("03", "Spacing", null, [
      H({ name: "Spacing", w: "fill", gap: 14, align: "end" }, TOKENS.spacing.map((s) => V({ name: "Space / " + s, w: "hug", gap: 8, align: "center" }, [
        F({ name: "Box", w: 14, h: s * 2, fill: "primary", radius: 2 }), Tx(String(s), "Caption", "text-muted", { w: "hug" }),
      ]))),
    ])]),
    V({ name: "Col", w: "fill" }, [section("04", "Corner radii", null, [
      H({ name: "Radius", w: "fill", gap: 16, align: "end" }, TOKENS.radius.map((r) => V({ name: "Radius / " + r[0], w: "hug", gap: 8, align: "center" }, [
        F({ name: "Box", w: 52, h: 52, radius: Math.min(r[1], 26), fill: "card", stroke: "border-strong" }),
        Tx(`${r[0]} · ${r[1] === 999 ? "pill" : r[1]}`, "Caption", "text-muted", { w: "hug" }),
      ]))),
    ])]),
  ]),
  section("05", "Buttons & controls", "Button is a component set: Variant × State", [
    { t: "buttonSet" },
    H({ name: "Controls", w: "fill", gap: 24, align: "start" }, [
      V({ name: "Col", w: "fill", gap: 8 }, [Tx("Password input", "Caption", "text-muted"), input("Password", "Enter your password", { trailing: "eye" })]),
      V({ name: "Col", w: "fill", gap: 8 }, [Tx("Role switcher", "Caption", "text-muted"), segmented("Worker")]),
      V({ name: "Col", w: "fill", gap: 8 }, [Tx("Category filters", "Caption", "text-muted"), H({ name: "Chips", w: "fill", gap: 8 }, [chip("All gigs", true), chip("Errands")])]),
      V({ name: "Col", w: "fill", gap: 8 }, [Tx("Skill chip", "Caption", "text-muted"), H({ name: "Chips", w: "fill", gap: 8 }, [skillChip("Errands"), skillChip("Delivery")])]),
    ]),
  ]),
  section("06", "Cards", "Gig card, quest status and escrow note", [
    H({ name: "Cards", w: "fill", gap: 24, align: "start" }, [
      V({ name: "Col", w: 360 }, [gigCard(GIGS[0])]),
      V({ name: "Col", w: 360, gap: 12 }, [escrowNote("SideQuest holds the client’s GCash payment and releases it when the task is confirmed."), H({ name: "States", w: "fill", gap: 16 }, [statusLabel("In transit", "primary"), statusLabel("3 offers waiting", "accent-text")])]),
      V({ name: "Col", w: 390 }, [bottomNav("Discover")]),
    ]),
  ]),
]);

// Button visuals per variant/state (used by both renderers)
const BUTTON_VARIANTS = ["Primary", "Purple", "Outline"];
const BUTTON_STATES = ["Default", "Hover", "Disabled", "Focus"];
const BUTTON_LABEL = { Primary: "Log in", Purple: "Message", Outline: "Edit profile" };
function buttonLook(variant, state) {
  const look = {
    Primary: { fill: state === "Hover" ? "primary-hover" : "primary", text: "on-primary", stroke: null },
    Purple: { fill: state === "Hover" ? "card-purple" : "accent-soft", text: "accent-text", stroke: state === "Hover" ? "accent-text" : null },
    Outline: { fill: state === "Hover" ? "card" : null, text: "text", stroke: "border-strong" },
  }[variant];
  if (state === "Disabled") look.opacity = 0.35;
  if (state === "Focus") look.ring = "accent-text";
  return look;
}
