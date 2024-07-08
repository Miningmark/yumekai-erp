export const allColumns = [
  { id: "id", name: "ID" },
  { id: "con_name", name: "Name" },
  { id: "location", name: "Ort" },
  { id: "start_date", name: "Von" },
  { id: "end_date", name: "Bis" },
  { id: "website", name: "Webseite" },
  { id: "hotel", name: "Hotel" },
  { id: "helpers", name: "Helfer" },
  { id: "special_notes", name: "Notizen" },
  { id: "workshops", name: "Workshops" },
  { id: "created_at", name: "Erstellt am" },
];

export const newConStandTemplate = allColumns.reduce((acc, column) => {
  if (column.id !== "id" && column.id !== "created_at" && column.id !== "helpers") {
    acc[column.id] = null;
  }
  if (column.id == "helpers") {
    acc[column.id] = [];
  }
  return acc;
}, {});
