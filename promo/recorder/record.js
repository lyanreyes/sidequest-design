// Records video/video.html frame by frame (deterministic timeline) and encodes an MP4 with ffmpeg.
// node record.js stills 3,10,20      → PNG stills at those seconds (for checking)
// node record.js video <ffmpeg.exe>  → ../SideQuest-Promo.mp4 (1920x1080, 30 fps)
const puppeteer = require("puppeteer-core");
const { spawn } = require("child_process");
const path = require("path");

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PAGE = "file:///" + path.join(__dirname, "..", "video", "video.html").replace(/\\/g, "/");
const FPS = 30;

(async () => {
  const [mode, arg] = process.argv.slice(2);
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--allow-file-access-from-files", "--hide-scrollbars"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.goto(PAGE, { waitUntil: "networkidle0" });
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map((i) => i.decode().catch(() => {}))); });

  if (mode === "stills") {
    for (const s of arg.split(",").map(Number)) {
      await page.evaluate((t) => window.render(t), s);
      await page.screenshot({ path: path.join(__dirname, "..", `still-${String(s).padStart(5, "0")}.png`) });
    }
  } else {
    const duration = await page.evaluate(() => window.DURATION);
    const out = path.join(__dirname, "..", "SideQuest-Promo.mp4");
    const ff = spawn(arg, ["-y", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out], { stdio: ["pipe", "ignore", "inherit"] });
    const total = Math.round(duration * FPS);
    for (let i = 0; i < total; i++) {
      await page.evaluate((t) => window.render(t), i / FPS);
      const buf = await page.screenshot({ type: "jpeg", quality: 92 });
      if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
      if (i % 300 === 0) console.log(`frame ${i}/${total}`);
    }
    ff.stdin.end();
    await new Promise((r) => ff.on("close", r));
    console.log("saved", out);
  }
  await browser.close();
})();
