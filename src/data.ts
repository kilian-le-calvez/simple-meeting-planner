import { UserAvailability, Availability } from "./types";

let db: UserAvailability[] = []; // fallback local

const isProd = process.env.NODE_ENV === "production";

export async function getData(): Promise<UserAvailability[]> {
  if (isProd) {
    const res = await fetch("/api/get");
    const text = await res.text();

    try {
      return JSON.parse(text);
    } catch {
      console.error("Réponse reçue non JSON :", text);
      throw new Error("La réponse du serveur n'était pas du JSON !");
    }
  } else {
    return db;
  }
}

export async function saveData(name: string, availability: Availability) {
  if (!name) return;

  if (isProd) {
    await fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, availability }),
    });
  } else {
    // local fallback: remplace exactement les dispos pour ce nom
    const existingIndex = db.findIndex((u) => u.name === name);
    if (existingIndex !== -1) {
      db[existingIndex] = { name, availability };
    } else {
      db.push({ name, availability });
    }
  }
}
