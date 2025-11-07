import { put, list } from "@vercel/blob";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  if (req.method !== "POST")
    return new Response("Method not allowed", { status: 405 });

  const body = await req.json();
  const { name, availability } = body;

  // Télécharger le fichier de données existant
  const listResponse = await list();
  const file = listResponse.blobs.find((b) => b.pathname === "data.json");

  let current = [];
  if (file) {
    const res = await fetch(file.url);
    current = await res.json();
  }

  // Mettre à jour ou ajouter l'utilisateur
  const existing = current.find((u) => u.name === name);
  if (existing) existing.availability = availability;
  else current.push({ name, availability });

  // Réécrire le blob
  await put("data.json", JSON.stringify(current), {
    contentType: "application/json",
  });

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
