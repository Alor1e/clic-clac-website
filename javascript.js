const openingHours = [
  { open: 12 * 60, close: 22 * 60 + 30 },
  { open: 15 * 60, close: 2 * 60 },
  { open: 15 * 60, close: 2 * 60 },
  { open: 15 * 60, close: 2 * 60 },
  { open: 15 * 60, close: 2 * 60 },
  { open: 15 * 60, close: 2 * 60 },
  { open: 12 * 60, close: 2 * 60 },
];

const dayNames = [
  "Sonntag",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
];

function formatTime(minutes) {
  const hours = Math.floor(minutes / 60).toString().padStart(2, "0");
  const remainder = (minutes % 60).toString().padStart(2, "0");
  return `${hours}:${remainder}`;
}

function updateOpeningStatus() {
  const now = new Date();
  const day = now.getDay();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const today = openingHours[day];
  const previous = openingHours[(day + 6) % 7];
  const openToday = minutes >= today.open && (
    today.close > today.open ? minutes < today.close : true
  );
  const openFromPreviousDay =
    previous.close < previous.open && minutes < previous.close;
  const status = document.querySelector(".open-status");
  const statusText = document.querySelector("#open-status-text");

  document.querySelectorAll(".hours-row").forEach((row) => {
    row.classList.toggle("is-today", Number(row.dataset.day) === day);
  });

  if (openToday || openFromPreviousDay) {
    const closingTime = openToday ? today.close : previous.close;
    statusText.textContent = `Jetzt geöffnet · bis ${formatTime(closingTime)} Uhr`;
    status.classList.add("is-open");
    status.classList.remove("is-closed");
    return;
  }

  let daysUntilOpening = 0;
  while (daysUntilOpening < 7) {
    const candidateDay = (day + daysUntilOpening) % 7;
    const candidate = openingHours[candidateDay];
    if (daysUntilOpening > 0 || minutes < candidate.open) {
      break;
    }
    daysUntilOpening += 1;
  }

  const nextDay = (day + daysUntilOpening) % 7;
  const when = daysUntilOpening === 0
    ? "heute"
    : daysUntilOpening === 1
      ? "morgen"
      : `am ${dayNames[nextDay]}`;
  statusText.textContent = `Geschlossen · öffnet ${when} um ${formatTime(openingHours[nextDay].open)} Uhr`;
  status.classList.add("is-closed");
  status.classList.remove("is-open");
}

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Menü öffnen" : "Menü schließen");
  mainNav.classList.toggle("is-open", !isExpanded);
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Menü öffnen");
    mainNav.classList.remove("is-open");
  });
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
updateOpeningStatus();