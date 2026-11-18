"""Writes the SideQuest promo voiceover script (DOCX) matched to the video's scene timings."""
from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor

SCENES = [
    ("0:00–0:06", "Intro", "SideQuest logo pops in; “Find gigs. Earn fast. Near you.” appears word by word.",
     "This is SideQuest. Find gigs. Earn fast. Near you."),
    ("0:06–0:16", "The problem", "Two cards: “Need extra money between classes?” and “Need help with a quick errand?”. Then “No tracking / No reviews / No payment protection” get crossed out.",
     "Students need extra money, but jobs want fixed shifts. Neighbors need quick help, but group chats have no tracking, no reviews, and no protection."),
    ("0:16–0:24", "Meet SideQuest", "“Small tasks. Nearby people. Fair pay.” The Discover screen rises in.",
     "SideQuest connects them: small tasks, nearby people, fair pay, right here in Batangas."),
    ("0:24–0:38", "Gigs on a map", "Real OpenStreetMap of Tanauan with gig pins; distance chips 1 / 3 / 5 km; stats count up to 1.2 km, ~6 min ride, ~21 min walk.",
     "Every open gig appears on a real map, with its pay. Pick how far you'll go, and SideQuest estimates the distance and travel time before you say yes."),
    ("0:38–0:48", "Nearby alerts", "Radius chips move to 3 km; a “New gig · 0.8 km away” banner drops onto the phone.",
     "Set your alert radius, from one to five kilometers. The moment someone posts a gig nearby, you get a heads-up."),
    ("0:48–1:04", "Post a task", "Title types itself, a pin is dropped on the map, the calendar picks November 18, suggested pay ₱200 is chosen; timer runs to 1:45.",
     "Need help instead? Post a task in under two minutes. Pick a title, drop a pin, choose a time, and set your pay. SideQuest even suggests a fair price."),
    ("1:04–1:19", "GCash, held", "Scan-to-pay screen with the QR; the GCash simulation sheet spins, then shows a check. Steps light up: paid, held.",
     "When you accept a worker, you pay with GCash. SideQuest holds the money, so the worker knows they'll get paid, and the client knows the job comes first."),
    ("1:19–1:33", "Track and chat", "Bea's dot travels along the route to FAITH Colleges main gate; “km left” counts down; chat bubbles appear.",
     "Workers tap “I'm on my way” and share their location. You can watch them get closer, and chat inside the quest if anything changes."),
    ("1:33–1:43", "Confirm and rate", "“Confirm task completion” is pressed; five stars fill; +₱420 counts up.",
     "When it's done, confirm. The payment is released, both of you leave a rating, and it's saved in your order history."),
    ("1:43–1:51", "Two roles", "The Worker / Client switch flips between the worker and client home screens.",
     "One account, two roles. Earn when you're free. Get help when you're busy."),
    ("1:51–2:00", "Outro", "Logo, tagline, “Pilot launching in Batangas · November 2026”, team credits and the download QR code.",
     "SideQuest launches in Batangas, starting at FAITH Colleges. Scan to download. Find gigs, earn fast, near you."),
]


def shade(cell, hex_fill):
    tc = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd"); shd.set(qn("w:val"), "clear"); shd.set(qn("w:fill"), hex_fill); tc.append(shd)


d = Document()
sec = d.sections[0]
sec.left_margin = sec.right_margin = Inches(0.8)
st = d.styles["Normal"]; st.font.name = "Calibri"; st.font.size = Pt(11)

d.add_heading("SideQuest promo video · voiceover script", level=1)
p = d.add_paragraph("Group 5 · BSCS 3A · FAITH Colleges · Video length 2:00 (SideQuest-Promo.mp4, 1920×1080, no audio)")
p.runs[0].font.color.rgb = RGBColor(0x55, 0x55, 0x55)

d.add_heading("How to record", level=2)
for line in [
    "Read the “Voiceover” column at a calm, friendly pace (about 2 words per second). Each line fits inside its time range with room to breathe.",
    "Record one take per scene, then line each take up with the start time in the first column (CapCut, Canva or any video editor).",
    "Add soft background music at about 15–20% volume under the voice. Keep music without lyrics so it doesn't fight the narration.",
    "Speak “GCash” as “G-Cash” and “₱420” as “four hundred twenty pesos”.",
]:
    d.add_paragraph(line, style="List Bullet")

d.add_heading("Script", level=2)
t = d.add_table(rows=1, cols=4)
t.style = "Table Grid"
widths = [Inches(0.9), Inches(1.1), Inches(2.4), Inches(2.6)]
for c, (h, w) in enumerate(zip(["Time", "Scene", "On screen", "Voiceover"], widths)):
    cell = t.rows[0].cells[c]; cell.width = w; cell.text = ""
    r = cell.paragraphs[0].add_run(h); r.bold = True
    shade(cell, "D9F99D")
for time, scene, screen, vo in SCENES:
    row = t.add_row().cells
    for c, (val, w) in enumerate(zip([time, scene, screen, vo], widths)):
        row[c].width = w
        row[c].text = val
    row[3].paragraphs[0].runs[0].bold = True

words = sum(len(s[3].split()) for s in SCENES)
d.add_paragraph().add_run(f"Total narration: {words} words for 120 seconds (≈ {words / 120:.1f} words per second).").italic = True

d.add_heading("Full narration (read-through)", level=2)
d.add_paragraph(" ".join(s[3] for s in SCENES))

d.save("SideQuest-Promo-Voiceover-Script.docx")
print("saved, words:", words)
