import { useEffect, useState } from "react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const hours = Array.from({ length: 16 }, (_, i) => i + 8); // 8h à 19h

export default function App() {
  const [name, setName] = useState("");
  const [availability, setAvailability] = useState({});
  const [data, setData] = useState([]);

  // charger les dispos globales
  useEffect(() => {
    fetch("/api/get")
      .then((res) => res.json())
      .then(setData)
      .catch(() => {});
  }, []);

  const toggleSlot = (day, hour) => {
    const key = `${day}-${hour}`;
    setAvailability((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const submit = async () => {
    if (!name) return alert("Entre ton nom !");
    await fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, availability }),
    });
    const updated = await fetch("/api/get").then((r) => r.json());
    setData(updated);
  };

  const combined = {};
  data.forEach((u) => {
    Object.entries(u.availability).forEach(([k, v]) => {
      if (v) combined[k] = (combined[k] || 0) + 1;
    });
  });

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">🗓 When2Meet Lite</h1>
      <input
        className="border p-2 rounded w-full mb-4"
        placeholder="Ton nom"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="grid grid-cols-6 gap-1">
        <div></div>
        {days.map((d) => (
          <div key={d} className="font-bold">
            {d}
          </div>
        ))}
        {hours.map((h) => (
          <>
            <div key={h} className="font-bold">
              {h}h
            </div>
            {days.map((d) => {
              const key = `${d}-${h}`;
              const selected = availability[key];
              const count = combined[key] || 0;
              return (
                <div
                  key={key}
                  onClick={() => toggleSlot(d, h)}
                  className={`border h-8 cursor-pointer flex items-center justify-center text-sm ${
                    selected ? "bg-green-400" : count > 0 ? "bg-green-200" : ""
                  }`}
                >
                  {count > 0 ? count : ""}
                </div>
              );
            })}
          </>
        ))}
      </div>

      <button
        onClick={submit}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Enregistrer mes dispos
      </button>
    </div>
  );
}
