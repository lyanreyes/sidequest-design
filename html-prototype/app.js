// Small interactions for the SideQuest HTML prototype. The pages work without it; this just makes typing feel real.

// Click anywhere on a field box to type in it
document.querySelectorAll(".field").forEach((field) => {
  field.addEventListener("click", (e) => {
    if (e.target.closest("button, input, textarea")) return;
    field.querySelector("input, textarea")?.focus();
  });
});

// Show / hide password
document.querySelectorAll(".pw-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = btn.closest(".field").querySelector("input");
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
    btn.style.opacity = show ? "0.6" : "1";
  });
});

// One-time code: digits only, jump to the next box, backspace goes back
const digits = [...document.querySelectorAll(".input.otp")];
digits.forEach((box, i) => {
  box.addEventListener("input", () => {
    box.value = box.value.replace(/\D/g, "").slice(-1);
    if (box.value && digits[i + 1]) digits[i + 1].focus();
  });
  box.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !box.value && digits[i - 1]) digits[i - 1].focus();
  });
  box.addEventListener("paste", (e) => {
    const code = (e.clipboardData.getData("text").match(/\d/g) || []).slice(0, digits.length);
    if (!code.length) return;
    e.preventDefault();
    code.forEach((d, k) => digits[k] && (digits[k].value = d));
    digits[Math.min(code.length, digits.length - 1)].focus();
  });
});
digits.find((d) => !d.value)?.focus();

// Chat: press Enter (or the send button) to add your message to the thread
const chatInput = document.querySelector("[data-chat]");
if (chatInput) {
  const thread = document.querySelector('[data-name="Thread"]');
  const send = () => {
    const text = chatInput.value.trim();
    const template = [...thread.querySelectorAll('[data-name="Sent"]')].pop();
    if (!text || !template) return;
    const msg = template.cloneNode(true);
    const [body, time] = msg.querySelectorAll("p");
    body.textContent = text;
    time.textContent = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    thread.appendChild(msg);
    chatInput.value = "";
    msg.scrollIntoView({ behavior: "smooth", block: "end" });
  };
  chatInput.addEventListener("keydown", (e) => e.key === "Enter" && send());
  document.querySelector('[data-name="Send"]')?.addEventListener("click", send);
}

// Forms in the prototype don't submit anywhere
document.querySelectorAll("button.btn").forEach((b) => b.addEventListener("click", (e) => e.preventDefault()));
