// Captures crisp 2x images of real SideQuest screens (HTML prototype) and OpenStreetMap map views.
const puppeteer = require("puppeteer-core");
const path = require("path");
const fs = require("fs");

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const HTML = "C:/Users/User/Downloads/Lyan/SideQuest-HTML";
const MAPS = process.argv[2]; // folder with gigs.html / post.html / track.html (Leaflet + OSM)
const OUT = path.join(__dirname, "..", "assets");
fs.mkdirSync(OUT, { recursive: true });

const SCREENS = {
  login: "index.html", discover: "04-discover-worker.html", gig: "05-gig-details.html", quests: "06-my-quests.html",
  client: "08-home-client.html", post: "09-post-a-task.html", offers: "10-worker-offers.html", pay: "11-pay-with-gcash.html",
  qr: "12-scan-gcash-qr.html", track: "13-track-task.html", review: "14-rate-review.html", messages: "15-messages.html",
  chat: "16-conversation.html", profile: "17-profile.html",
};

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--hide-scrollbars"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 520, height: 960, deviceScaleFactor: 2 });
  for (const [name, file] of Object.entries(SCREENS)) {
    await page.goto("file:///" + path.join(HTML, file).replace(/\\/g, "/"), { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    const phone = await page.$(".phone");
    await page.evaluate((el) => { el.style.boxShadow = "none"; el.style.borderRadius = "36px"; }, phone);
    await phone.screenshot({ path: path.join(OUT, `screen-${name}.png`), omitBackground: true });
  }
  if (MAPS) {
    await page.setViewport({ width: 400, height: 420, deviceScaleFactor: 2 });
    for (const m of ["gigs", "post", "track"]) {
      await page.goto(`http://localhost:8791/${m}.html`, { waitUntil: "networkidle0" });
      await new Promise((r) => setTimeout(r, 1500));
      const el = await page.$("#m");
      await el.screenshot({ path: path.join(OUT, `map-${m}.png`) });
    }
  }
  await browser.close();
  console.log(fs.readdirSync(OUT).join(", "));
})();
