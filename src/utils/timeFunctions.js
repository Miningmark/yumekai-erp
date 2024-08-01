export function convertDateFormat(dateStr) {
  // Überprüfen, ob der Eingabestring im Format 'yyyy-mm-dd' vorliegt
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) {
    throw new Error("Ungültiges Datumsformat. Erwartet: yyyy-mm-dd");
  }

  // Datum in Jahr, Monat und Tag aufteilen
  const [year, month, day] = dateStr.split("-");

  // Das Datum im Format 'dd.mm.yyyy' formatieren
  return `${day}.${month}.${year}`;
}

export function convertDateUTCtoCEST(dateStr) {
  const options = {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit", //  "2-digit" für führende Nullen
    day: "2-digit", //  "numeric" für keine führenden Nullen
  };
  const parts = new Intl.DateTimeFormat("de-DE", options).formatToParts(dateStr);

  // Extrahiere Jahr, Monat und Tag aus den formatierten Teilen
  const year = parts.find((part) => part.type === "year").value;
  const month = parts.find((part) => part.type === "month").value;
  const day = parts.find((part) => part.type === "day").value;

  // Formatieren im Format yyyy-mm-dd
  return `${year}-${month}-${day}`;
}

export function convertTimeStampFormat(dateStr) {
  const options = {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit", //  "2-digit" für führende Nullen
    day: "2-digit", //  "numeric" für keine führenden Nullen
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return new Intl.DateTimeFormat("de-DE", options).format(dateStr);
}
