/* global process */
import { list } from "@vercel/blob";

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
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const todayISO = new Date().toISOString();

  const listResponse = await list({
    token: process.env.SECRET_BLOBBY_READ_WRITE_TOKEN,
  });
  const file = listResponse.blobs.find((b) => b.pathname === "data.json");

  if (!file) return res.status(200).json({ date: todayISO, users: [] });

  const resFile = await fetch(file.url);
  const json = await resFile.json();

  const cleaned = cleanupOldSlots(json);
  return res.status(200).json(cleaned);
}
