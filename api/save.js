import { put, list } from "@vercel/blob";

export const config = {
  runtime: "nodejs",
};

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { name, availability } = req.body;

  const listResponse = await list();
  const file = listResponse.blobs.find((b) => b.pathname === "data.json");

  let current = [];
  if (file) {
    const resFile = await fetch(file.url);
    current = await resFile.json();
  }

  const existing = current.find((u) => u.name === name);
  if (existing) existing.availability = availability;
  else current.push({ name, availability });

  await put("data.json", JSON.stringify(current), {
    contentType: "application/json",
  });

  return res.status(200).json({ ok: true });
}
