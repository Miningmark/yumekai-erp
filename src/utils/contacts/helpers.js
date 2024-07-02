export const countries = [
  "Belgium",
  "Bulgaria",
  "Czech Republic",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Hungary",
  "Ireland",
  "Italy",
  "Latvia",
  "Lithuania",
  "Luxembourg",
  "Malta",
  "Netherlands",
  "Poland",
  "Portugal",
  "Romania",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
  "Switzerland",
  "Austria",
  "Croatia",
  "Cyprus",
];
export const sortedCountries = [
  "Germany",
  ...countries.filter((country) => country !== "Germany").sort(),
];

export const genders = ["Männlich", "Weiblich", "Divers"];

export const allColumns = [
  { id: "id", name: "ID" },
  { id: "category", name: "Kategorie" },
  { id: "name", name: "Name" },
  { id: "nickname", name: "Rufname" },
  { id: "artist_name", name: "Künstlername" },
  { id: "company", name: "Firma" },
  { id: "club", name: "Verein" },
  { id: "email", name: "E-Mail" },
  { id: "phone", name: "Telefon" },
  { id: "website", name: "Website" },
  { id: "instagram", name: "Instagram" },
  { id: "postal_code", name: "PLZ" },
  { id: "city", name: "Stadt" },
  { id: "street", name: "Straße" },
  { id: "house_number", name: "Hausnr." },
  { id: "country", name: "Land" },
  { id: "contact_by", name: "Kontakt durch" },
  { id: "notes", name: "Notizen" },
  { id: "previous_collaboration", name: "Frühere Zusammenarbeit" },
  { id: "created_at", name: "Erstellt am" },
  { id: "birth_date", name: "Geburtsdatum" },
  { id: "discord_name", name: "Discord Name" },
  { id: "gender", name: "Geschlecht" },
];

export const newContactTemplate = allColumns.reduce((acc, column) => {
  if (column.id !== "id" && column.id !== "created_at") {
    acc[column.id] = null;
  }
  return acc;
}, {});
