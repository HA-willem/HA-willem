const ALARM_NAME = "jiggle";
const DEFAULT_INTERVAL_MIN = 1; // minimum allowed by chrome.alarms is ~1 min for non-persistent triggers reliably

async function getSettings() {
  const { enabled = false, intervalMinutes = DEFAULT_INTERVAL_MIN } =
    await chrome.storage.local.get(["enabled", "intervalMinutes"]);
  return { enabled, intervalMinutes };
}

async function applyAlarmState() {
  const { enabled, intervalMinutes } = await getSettings();
  await chrome.alarms.clear(ALARM_NAME);
  if (enabled) {
    chrome.alarms.create(ALARM_NAME, { periodInMinutes: Math.max(intervalMinutes, 0.5) });
  }
}

async function jiggleTeamsTabs() {
  const tabs = await chrome.tabs.query({ url: "https://teams.microsoft.com/*" });
  for (const tab of tabs) {
    if (tab.id === undefined) continue;
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: simulateActivity,
      });
    } catch (e) {
      // tab may not allow script injection (e.g. discarded/special pages)
    }
  }
}

function simulateActivity() {
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;
  const moveEvent = new MouseEvent("mousemove", {
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y,
  });
  document.dispatchEvent(moveEvent);

  const scrollEvent = new Event("scroll", { bubbles: true });
  document.dispatchEvent(scrollEvent);

  document.dispatchEvent(new Event("focus", { bubbles: true }));
  document.dispatchEvent(new Event("visibilitychange", { bubbles: true }));
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    jiggleTeamsTabs();
  }
});

chrome.runtime.onInstalled.addListener(applyAlarmState);
chrome.runtime.onStartup.addListener(applyAlarmState);

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "settings-updated") {
    applyAlarmState().then(() => sendResponse({ ok: true }));
    return true;
  }
  if (message?.type === "jiggle-now") {
    jiggleTeamsTabs().then(() => sendResponse({ ok: true }));
    return true;
  }
});
