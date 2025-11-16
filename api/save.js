/* global process */
import { put, list } from "@vercel/blob";

export const config = { runtime: "nodejs" };

function cleanupOldSlots(data) {
  if (!data?.users) return data;

  const now = new Date();
  const cleanedUsers = data.users.map((u) => {
    const newAvailability = Object.fromEntries(
      Object.entries(u.availability).filter(([iso]) => {
        const d = new Date(iso);
        return d >= now;
      })
    );
    return { ...u, availability: newAvailability };
  });

  return { ...data, users: cleanedUsers, date: new Date().toISOString() };
}

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { name, availability } = req.body;
  const type = req.query.type || "default";
  const filename = `data_${type}.json`;
  const todayISO = new Date().toISOString();

  const listResponse = await list({
    token: process.env.SECRET_BLOBBY_READ_WRITE_TOKEN,
  });
  const file = listResponse.blobs.find((b) => b.pathname === filename);

  let current = { date: todayISO, users: [] };
  if (file) {
    const resFile = await fetch(file.url);
    try {
      current = await resFile.json();
    } catch {
      current = { date: todayISO, users: [] };
    }
  }

  current = cleanupOldSlots(current);

  const existing = current.users.find((u) => u.name === name);
  if (existing) existing.availability = availability;
  else current.users.push({ name, availability });

  await put(filename, JSON.stringify(current), {
    contentType: "application/json",
    token: process.env.SECRET_BLOBBY_READ_WRITE_TOKEN,
    access: "public",
    allowOverwrite: true,
  });

  return res.status(200).json({ ok: true, date: todayISO });
}
