import { UserAvailability, Availability } from "./types";

interface ServerData {
  date: string;
  users: UserAvailability[];
}

const isProd = process.env.NODE_ENV === "production";

export async function getServerDataDebug(
  type: string
): Promise<ServerData | string> {
  if (isProd) {
    const res = await fetch(`/api/get?type=${type}`);
    const json: ServerData = await res.json();
    return json;
  } else {
    return "Debug info not available in development mode.";
  }
}

export async function getData(type: string): Promise<UserAvailability[]> {
  if (!isProd) return [];
  const res = await fetch(`/api/get?type=${type}`);
  const json = await res.json();
  return json.users || [];
}

export async function saveData(
  name: string,
  availability: Availability,
  type: string
) {
  if (!name || !isProd) return;
  await fetch(`/api/save?type=${type}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, availability }),
  });
}
