// App.tsx
import React, { useEffect, useState } from "react";
import { getData, saveData } from "./data";
import Calendar from "./Calendar";
import { computeCombinedAndNames } from "./utils";
import { UserAvailability, Availability } from "./types";

const MEMBERS = [
  "Kilian",
  "Lena",
  "Gabrielle",
  "Thomas",
  "Mojgan",
  "Redha",
  "Just see the calendar",
];

const App: React.FC = () => {
  const [name, setName] = useState<string | null>(null);
  const [availability, setAvailability] = useState<Availability>({});
  const [data, setData] = useState<UserAvailability[]>([]);
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  // Charger les données globales
  useEffect(() => {
    getData()
      .then(setData)
      .catch(() => {});
  }, []);

  // Recharger la dispo de la personne sélectionnée
  useEffect(() => {
    if (!name) return;
    const existing = data.find((u) => u.name === name);
    setAvailability(existing?.availability || {});
  }, [name, data]);

  const toggleSlot = (day: string, hour: number, forceValue?: boolean) => {
    if (!name) return; // lecture seule si pas connecté
    const key = `${day}-${hour}`;
    setAvailability((prev) => ({
      ...prev,
      [key]: forceValue !== undefined ? forceValue : !prev[key],
    }));
  };

  const submit = async () => {
    if (!name) return alert("Choisis ton nom avant d’enregistrer !");

    setSaveLoading(true);

    try {
      // Sauvegarde des données
      await saveData(name, availability);

      // Récupération des données mises à jour
      const updated = await getData();

      // Vérification simple : s'assurer que c'est bien un objet
      if (typeof updated !== "object" || updated === null) {
        throw new Error("Les données récupérées ne sont pas valides !");
      }

      setData(updated);
      alert("✅ Dispos enregistrées !");
    } catch (err) {
      console.error(
        "Erreur lors de l'enregistrement ou de la récupération :",
        err
      );
      alert("❌ Erreur lors de l’enregistrement. Réessaie ?");
    } finally {
      setSaveLoading(false);
    }
  };

  const { combined, namesBySlot } = computeCombinedAndNames(data);
  const registeredNames = data.map((u) => u.name);

  return (
    <div className="w-screen min-h-screen flex flex-row justify-between items-center p-8">
      <div></div>
      {/* Partie gauche : calendrier */}
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">
          🗓 Fin réu pacte cofondateur
          {name && name !== "Just see the calendar" && ` - ${name}`}
        </h1>

        {saveLoading && (
          <div className="mb-2 text-blue-600 font-semibold">
            Sauvegarde en cours...
          </div>
        )}

        <Calendar
          availability={availability}
          combined={combined}
          namesBySlot={namesBySlot}
          hoveredSlot={hoveredSlot}
          setHoveredSlot={setHoveredSlot}
          toggleSlot={toggleSlot}
        />

        {name && name !== "Just see the calendar" && (
          <button
            onClick={submit}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Enregistrer mes dispos
          </button>
        )}
      </div>

      {/* Partie droite : infos et sélection de nom */}
      <div className="max-w-xs">
        <h2 className="text-lg font-bold mb-2">Participants :</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {MEMBERS.map((member) => {
            const isActive = name === member;
            return (
              <button
                key={member}
                onClick={() =>
                  setName((prev) => (prev === member ? null : member))
                }
                className={`px-3 py-1 rounded border ${
                  isActive
                    ? "bg-blue-500 text-white border-blue-500"
                    : "hover:bg-blue-400"
                }`}
              >
                {member}
              </button>
            );
          })}
        </div>

        {!name && (
          <p className="text-gray-600 text-sm mb-4 italic">
            🔒 Sélectionne ton nom pour modifier tes disponibilités.
          </p>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Légende :</h3>
          <div className="mb-1">
            <span className="inline-block w-4 h-4 bg-blue-400 bg-opacity-50 mr-2 border"></span>
            Tes dispos
          </div>
          <div className="mb-1">
            <span className="inline-block w-4 h-4 bg-green-400 bg-opacity-75 mr-2 border"></span>
            Dispo maximale (6 personnes)
          </div>
          <div className="mb-1">
            <span className="inline-block w-4 h-4 bg-yellow-400 bg-opacity-75 mr-2 border"></span>
            Dispo correcte (≥ 4 personnes)
          </div>
          <div className="mb-1">
            <span className="inline-block w-4 h-4 bg-red-400 bg-opacity-75 mr-2 border"></span>
            Peu de dispos (moins de 4)
          </div>
        </div>

        <div className="text-sm text-gray-600">
          💡 Clique ou glisse sur les cases pour modifier tes dispos.
        </div>
      </div>
    </div>
  );
};

export default App;
