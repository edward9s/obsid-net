"use strict";

function parseLink(fragment) {
  if (!fragment.startsWith("obsidian://open?") || fragment.length > 4096) return null;

  let uri;
  try {
    uri = new URL(fragment);
  } catch {
    return null;
  }

  const params = uri.searchParams;
  if (
    uri.protocol !== "obsidian:" ||
    uri.hostname !== "open" ||
    uri.pathname || uri.hash || uri.username || uri.password || uri.port ||
    [...params].length !== 2 ||
    !params.has("vault") || !params.has("file")
  ) return null;

  const vault = params.get("vault");
  const file = params.get("file");
  if (
    !vault.trim() || !file.endsWith(".md") ||
    /[\u0000-\u001f]/.test(vault) ||
    file.split("/").some(segment =>
      !segment || segment === "." || segment === ".." ||
      /[\\\u0000-\u001f]/.test(segment)
    )
  ) return null;

  return uri.href;
}

const link = parseLink(window.location.hash.slice(1));
const status = document.getElementById("status");
const button = document.getElementById("open");

if (link === null) {
  status.textContent = "連結無效。";
} else {
  try { history.replaceState(null, "", window.location.pathname); } catch {}
  button.href = link;
  button.hidden = false;
  status.textContent = "若未自動開啟，請點擊下方按鈕。";
  try {
    window.location.assign(link);
  } catch {
    status.textContent = "請點擊下方按鈕。";
  }
}
