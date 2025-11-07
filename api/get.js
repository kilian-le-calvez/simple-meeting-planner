import { list } from "@vercel/blob";

export const config = {
  runtime: "edge",
};

export default async function handler() {
  const listResponse = await list();
  const file = listResponse.blobs.find((b) => b.pathname === "data.json");

  if (!file)
    return new Response("[]", {
      headers: { "Content-Type": "application/json" },
    });

  const res = await fetch(file.url);
  const data = await res.json();

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
