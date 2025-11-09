import { UserAvailability, Availability } from "./types";

interface ServerData {
  date: string;
  users: UserAvailability[];
}

const isProd = process.env.NODE_ENV === "production";

export async function getServerDataDebug(): Promise<ServerData | string> {
  if (isProd) {
    const res = await fetch("/api/get");
    const json: ServerData = await res.json();
    return json;
  } else {
    return "Debug info not available in development mode.";
  }
}

export async function getData(): Promise<UserAvailability[]> {
  if (isProd) {
    const res = await fetch("/api/get");
    const json: ServerData = await res.json();
    return json.users || [];
  } else {
    return [];
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
  }
}
