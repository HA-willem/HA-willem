const enabledEl = document.getElementById("enabled");
const intervalEl = document.getElementById("interval");
const statusEl = document.getElementById("status");
const jiggleNowEl = document.getElementById("jiggleNow");

async function load() {
  const { enabled = false, intervalMinutes = 1 } = await chrome.storage.local.get([
    "enabled",
    "intervalMinutes",
  ]);
  enabledEl.checked = enabled;
  intervalEl.value = intervalMinutes;
  updateStatus(enabled);
}

function updateStatus(enabled) {
  statusEl.textContent = enabled
    ? "Actief op teams.microsoft.com tabs."
    : "Uitgeschakeld.";
}

async function save() {
  const enabled = enabledEl.checked;
  const intervalMinutes = Math.max(parseFloat(intervalEl.value) || 1, 0.5);
  await chrome.storage.local.set({ enabled, intervalMinutes });
  await chrome.runtime.sendMessage({ type: "settings-updated" });
  updateStatus(enabled);
}

enabledEl.addEventListener("change", save);
intervalEl.addEventListener("change", save);
jiggleNowEl.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "jiggle-now" });
});

load();
