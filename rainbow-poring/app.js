const SCOPE = "https://www.googleapis.com/auth/calendar.events.readonly";
const STORAGE = {
  clientId: "poring.googleClientId",
  leadMinutes: "poring.leadMinutes",
  muted: "poring.muted",
};
const WAKE_MS = 30 * 60 * 1000;
const POLL_MS = 60 * 1000;
const MEETING_URL = /https?:\/\/[^\s<>"']*(meet\.google\.com|zoom\.us|teams\.microsoft\.com|teams\.live\.com|webex\.com)/i;

const pet = document.getElementById("pet");
const speech = document.getElementById("speech");
const statusEl = document.getElementById("status");
const stageLabel = document.getElementById("stage-label");
const signInBtn = document.getElementById("signin-btn");
const signOutBtn = document.getElementById("signout-btn");
const refreshBtn = document.getElementById("refresh-btn");
const muteBtn = document.getElementById("mute-btn");
const liveBtn = document.getElementById("live-btn");
const clientIdInput = document.getElementById("client-id");
const leadInput = document.getElementById("lead-minutes");
const originChip = document.getElementById("origin-chip");
const setup = document.getElementById("setup");

const faces = {
  nap: document.getElementById("face-nap"),
  idle: document.getElementById("face-idle"),
  antsy: document.getElementById("face-antsy"),
};

const state = {
  mode: "live",
  mood: "nap",
  accessToken: null,
  tokenClient: null,
  events: [],
  nextEvent: null,
  muted: localStorage.getItem(STORAGE.muted) === "1",
  lastAntsyKey: null,
};

function getClientId() {
  return (
    clientIdInput.value.trim() ||
    window.PORING_GOOGLE_CLIENT_ID ||
    localStorage.getItem(STORAGE.clientId) ||
    ""
  );
}

function getLeadMs() {
  const minutes = Number(leadInput.value);
  return (Number.isFinite(minutes) && minutes > 0 ? minutes : 5) * 60 * 1000;
}

function waitForGoogle() {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    (function poll() {
      if (window.google?.accounts?.oauth2) return resolve();
      if (Date.now() - started > 12000) {
        return reject(new Error("Google Identity Services failed to load."));
      }
      setTimeout(poll, 50);
    })();
  });
}

function setMood(mood, line) {
  state.mood = mood;
  pet.className = "pet-wrap " + mood + (joinUrl() ? " joinable" : "");
  speech.textContent = line || (mood === "antsy" ? "meetiiing!!" : "");
  for (const [name, node] of Object.entries(faces)) {
    node.hidden = name !== mood;
  }
}

function joinUrl(event = state.nextEvent) {
  if (!event) return "";
  if (event.hangoutLink) return event.hangoutLink;
  const video = (event.conferenceData?.entryPoints || []).find(
    (entry) => entry.entryPointType === "video" && entry.uri
  );
  if (video) return video.uri;
  const blob = [event.location, event.description, event.summary]
    .filter(Boolean)
    .join("\n");
  const match = blob.match(MEETING_URL);
  return match ? match[0] : event.htmlLink || "";
}

function isDeclined(event) {
  const self = (event.attendees || []).find((person) => person.self);
  return self?.responseStatus === "declined";
}

function eventTimes(event) {
  if (!event?.start?.dateTime || !event?.end?.dateTime) return null;
  return {
    start: Date.parse(event.start.dateTime),
    end: Date.parse(event.end.dateTime),
  };
}

function pickNext(events, now) {
  return events.find((event) => {
    const times = eventTimes(event);
    return times && times.end > now && !isDeclined(event);
  }) || null;
}

function moodFor(event, now) {
  if (!event) return { mood: "nap", line: "" };
  const times = eventTimes(event);
  if (!times) return { mood: "nap", line: "" };
  if (now >= times.start && now < times.end) {
    return { mood: "idle", line: "" };
  }
  if (now < times.start && times.start - now <= getLeadMs()) {
    return { mood: "antsy", line: shorten(event.summary || "meetiiing!!") };
  }
  if (now < times.start && times.start - now <= WAKE_MS) {
    return { mood: "idle", line: "" };
  }
  return { mood: "nap", line: "" };
}

function shorten(text) {
  return text.length > 22 ? text.slice(0, 20) + "…" : text;
}

function formatCountdown(ms) {
  if (ms <= 0) return "now";
  const totalSec = Math.floor(ms / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  if (hours > 0) return `in ${hours}h ${minutes}m`;
  if (minutes >= 5) return `in ${minutes} min`;
  return `in ${minutes}:${String(seconds).padStart(2, "0")}`;
}

function describeEvent(event, now) {
  if (!event) return "No timed events in the next day and a half.";
  const times = eventTimes(event);
  const title = event.summary || "(no title)";
  if (now >= times.start && now < times.end) {
    return `On a call: <strong>${escapeHtml(title)}</strong> <span class="muted">· Poring is calm until it ends</span>`;
  }
  return `Next: <strong>${escapeHtml(title)}</strong> <span class="muted">· ${formatCountdown(times.start - now)}</span>`;
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function setStatus(html, isError = false) {
  statusEl.className = "status" + (isError ? " warn" : "");
  statusEl.innerHTML = html;
}

function applyCalendarMood() {
  const now = Date.now();
  state.nextEvent = pickNext(state.events, now);
  if (state.mode !== "live") {
    pet.classList.toggle("joinable", Boolean(joinUrl()));
    stageLabel.textContent = "previewing mood";
    return;
  }
  const { mood, line } = moodFor(state.nextEvent, now);
  const prev = state.mood;
  setMood(mood, line);
  stageLabel.textContent = state.accessToken ? "following Google Calendar" : "waiting for Google Calendar";
  if (mood === "antsy" && prev !== "antsy") {
    ping(state.nextEvent);
  }
  if (state.accessToken) {
    setStatus(
      (state.accessToken ? "Calendar connected. " : "") +
        describeEvent(state.nextEvent, now)
    );
  }
}

function ping(event) {
  const key = event?.id + ":" + event?.start?.dateTime;
  if (key && key === state.lastAntsyKey) return;
  state.lastAntsyKey = key;
  if (!state.muted) chirp();
  if (Notification.permission === "granted") {
    const title = event?.summary || "Meeting starting soon";
    new Notification("Rainbow Poring", {
      body: title + " — click the Poring to join",
    });
  }
}

function chirp() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = 660;
    gain.gain.value = 0.05;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.frequency.exponentialRampToValueAtTime(990, ctx.currentTime + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);
    osc.stop(ctx.currentTime + 0.3);
    osc.onended = () => ctx.close();
  } catch {
    // Autoplay can be blocked until a click; ignore.
  }
}

function loadLocalConfig() {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "config.local.js";
    script.onload = resolve;
    script.onerror = resolve;
    document.head.appendChild(script);
  });
}

async function fetchEvents(retried = false) {
  if (!state.accessToken) return;
  const timeMin = new Date().toISOString();
  const timeMax = new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString();
  const params = new URLSearchParams({
    timeMin,
    timeMax,
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "30",
    conferenceDataVersion: "1",
  });
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
    { headers: { Authorization: `Bearer ${state.accessToken}` } }
  );
  if (res.status === 401) {
    if (retried) throw new Error("Calendar access expired. Sign in again.");
    await requestToken("");
    return fetchEvents(true);
  }
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Calendar API ${res.status}: ${body.slice(0, 180)}`);
  }
  const data = await res.json();
  state.events = data.items || [];
  state.mode = "live";
  syncLiveButtons();
  applyCalendarMood();
}

function requestToken(prompt = "") {
  return new Promise((resolve, reject) => {
    if (!state.tokenClient) {
      reject(new Error("Sign-in is not ready."));
      return;
    }
    const previous = state.tokenClient.callback;
    state.tokenClient.callback = (response) => {
      state.tokenClient.callback = previous;
      if (response.error) {
        reject(new Error(response.error_description || response.error));
        return;
      }
      state.accessToken = response.access_token;
      signInBtn.hidden = true;
      signOutBtn.hidden = false;
      refreshBtn.hidden = false;
      setup.open = false;
      resolve(response);
    };
    state.tokenClient.requestAccessToken({ prompt });
  });
}

function initTokenClient() {
  const clientId = getClientId();
  if (!clientId || !window.google?.accounts?.oauth2) return;
  state.tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: SCOPE,
    callback: () => {},
  });
}

async function signIn() {
  try {
    const clientId = getClientId();
    if (!clientId) {
      setStatus("Paste your Google OAuth client ID in the setup panel first.", true);
      setup.open = true;
      clientIdInput.focus();
      return;
    }
    localStorage.setItem(STORAGE.clientId, clientId);
    if (location.protocol === "file:") {
      setStatus(
        'Open this page over HTTP first: <code>python3 -m http.server 8787</code> in the rainbow-poring folder, then visit <a href="http://localhost:8787">http://localhost:8787</a>.',
        true
      );
      return;
    }
    await waitForGoogle();
    initTokenClient();
    await requestToken("");
    if (Notification.permission === "default") Notification.requestPermission();
    await fetchEvents();
  } catch (error) {
    setStatus(escapeHtml(error.message || String(error)), true);
  }
}

function signOut() {
  const token = state.accessToken;
  if (token && window.google?.accounts?.oauth2) {
    google.accounts.oauth2.revoke(token, () => {});
  }
  state.accessToken = null;
  state.events = [];
  state.nextEvent = null;
  signInBtn.hidden = false;
  signOutBtn.hidden = true;
  refreshBtn.hidden = true;
  setMood("nap", "");
  setStatus("Signed out. Calendar access revoked in this browser.");
  stageLabel.textContent = "waiting for Google Calendar";
}

function saveSettings() {
  const clientId = clientIdInput.value.trim();
  if (clientId) localStorage.setItem(STORAGE.clientId, clientId);
  localStorage.setItem(STORAGE.leadMinutes, String(leadInput.value || "5"));
  initTokenClient();
  setStatus("Settings saved in this browser.");
}

function openMeeting() {
  const url = joinUrl();
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
}

function syncLiveButtons() {
  liveBtn.setAttribute("aria-pressed", String(state.mode === "live"));
  document.querySelectorAll("[data-mood]").forEach((btn) => {
    btn.setAttribute(
      "aria-pressed",
      String(state.mode === "preview" && btn.dataset.mood === state.mood)
    );
  });
}

function previewMood(mood) {
  state.mode = "preview";
  const line = mood === "antsy" ? "meetiiing!!" : "";
  setMood(mood, line);
  stageLabel.textContent = "previewing mood";
  setStatus("Previewing a mood. Follow calendar to sync with Google again.");
  syncLiveButtons();
}

function followCalendar() {
  state.mode = "live";
  syncLiveButtons();
  applyCalendarMood();
  if (!state.accessToken) {
    setStatus("Sign in with Google to drive the Poring from your calendar.");
  }
}

function updateMuteLabel() {
  muteBtn.textContent = state.muted ? "Unmute" : "Mute";
  muteBtn.setAttribute("aria-pressed", String(state.muted));
}

originChip.textContent =
  location.protocol === "file:" ? "http://localhost:8787" : location.origin;
if (location.protocol !== "file:") {
  document.getElementById("local-link").href = location.href;
}

loadLocalConfig().then(() => {
  clientIdInput.value =
    localStorage.getItem(STORAGE.clientId) || window.PORING_GOOGLE_CLIENT_ID || "";
  initTokenClient();
});
leadInput.value = localStorage.getItem(STORAGE.leadMinutes) || "5";
updateMuteLabel();

if (location.protocol === "file:") {
  setStatus(
    'Google Sign-In needs HTTP. Run <code>python3 -m http.server 8787</code> in <code>rainbow-poring</code>, then open <a href="http://localhost:8787">http://localhost:8787</a>.',
    true
  );
}

signInBtn.addEventListener("click", signIn);
signOutBtn.addEventListener("click", signOut);
refreshBtn.addEventListener("click", () => {
  fetchEvents().catch((error) => setStatus(escapeHtml(error.message), true));
});
muteBtn.addEventListener("click", () => {
  state.muted = !state.muted;
  localStorage.setItem(STORAGE.muted, state.muted ? "1" : "0");
  updateMuteLabel();
});
liveBtn.addEventListener("click", followCalendar);
document.getElementById("save-settings").addEventListener("click", saveSettings);
document.querySelectorAll("[data-mood]").forEach((btn) => {
  btn.addEventListener("click", () => previewMood(btn.dataset.mood));
});
pet.addEventListener("click", openMeeting);
pet.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openMeeting();
  }
});

setInterval(applyCalendarMood, 1000);
setInterval(() => {
  if (state.accessToken) {
    fetchEvents().catch((error) => setStatus(escapeHtml(error.message), true));
  }
}, POLL_MS);

waitForGoogle().then(initTokenClient).catch(() => {});
applyCalendarMood();
syncLiveButtons();
