/* global process */
import { list } from "@vercel/blob";

export const config = {
  runtime: "nodejs20.x",
};

export default async function handler(req, res) {
  const listResponse = await list({
    token: process.env.SECRET_BLOBBY_READ_WRITE_TOKEN, // ← le token ici
  });

  const file = listResponse.blobs.find((b) => b.pathname === "data.json");

  if (!file) {
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json([]);
  }

  const data = await fetch(file.url).then((r) => r.json());
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json(data);
}
