// Calendar.tsx
import React, { useState, useMemo } from "react";
import Slot from "./Slot";

const hours = Array.from({ length: 16 }, (_, i) => i + 8);

interface CalendarProps {
  availability: Record<string, boolean>;
  combined: Record<string, number>;
  namesBySlot: Record<string, string[]>;
  hoveredSlot: string | null;
  setHoveredSlot: (key: string | null) => void;
  toggleSlot: (key: string, forceValue?: boolean) => void;
}

export function prettifySlot(isoKey: string) {
  const d = new Date(isoKey);
  const day = d.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const hour = d.getHours();
  return `${day} - ${hour}h`;
}

/** Génère les 30 prochains jours */
const getNext30Days = (): { label: string; iso: string }[] => {
  const today = new Date();
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const label = d.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
    });
    const iso = d.toISOString().split("T")[0];
    return { label, iso };
  });
};

const Calendar: React.FC<CalendarProps> = ({
  availability,
  combined,
  namesBySlot,
  hoveredSlot,
  setHoveredSlot,
  toggleSlot,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState<boolean | null>(null);

  const days = useMemo(() => getNext30Days(), []);

  React.useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setDragValue(null);
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  const handleMouseDown = (isoDay: string, hour: number) => {
    const key = `${isoDay}T${hour.toString().padStart(2, "0")}:00:00.000Z`;
    const newValue = !availability[key];
    setDragValue(newValue);
    toggleSlot(key, newValue);
    setIsDragging(true);
  };

  const handleMouseEnter = (isoDay: string, hour: number) => {
    if (!isDragging || dragValue === null) return;
    const key = `${isoDay}T${hour.toString().padStart(2, "0")}:00:00.000Z`;
    toggleSlot(key, dragValue);
  };

  const handleMouseUpCell = (isoDay: string, hour: number) => {
    if (isDragging && dragValue !== null) {
      const key = `${isoDay}T${hour.toString().padStart(2, "0")}:00:00.000Z`;
      toggleSlot(key, dragValue);
    }
    setIsDragging(false);
    setDragValue(null);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragValue(null);
  };

  return (
    <div className="flex flex-row justify-center items-start w-full">
      {/* Colonne fixe pour les heures */}
      <div className="flex flex-col items-end mr-1">
        {/* Espace réservé pour l’en-tête vide (au-dessus des heures) */}
        <div className="h-6"></div>

        {hours.map((h) => (
          <div
            key={h}
            className="font-bold text-right pr-2"
            style={{
              height: "32px", // 👈 même hauteur que tes Slot pour aligner
              lineHeight: "32px",
            }}
          >
            {h}h
          </div>
        ))}
      </div>

      {/* Tableau scrollable des jours × heures */}
      <div
        className="overflow-x-auto max-w-[60vw] border rounded-md shadow-inner border-gray-300"
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
      >
        <div
          className="grid select-none min-w-max"
          style={{
            gridTemplateColumns: `repeat(${days.length}, 1fr)`,
          }}
        >
          {/* En-tête des jours */}
          {days.map((d) => (
            <div
              key={d.iso}
              className="font-bold text-center sticky top-0"
              style={{ height: "24px" }}
            >
              {d.label}
            </div>
          ))}

          {/* Corps : 16 lignes (heures) × 30 colonnes (jours) */}
          {hours.map((h) =>
            days.map((d) => {
              const key = `${d.iso}T${h.toString().padStart(2, "0")}:00:00.000Z`;
              return (
                <Slot
                  key={key}
                  day={d.iso}
                  hour={h}
                  selected={!!availability[key]}
                  count={combined[key] || 0}
                  names={namesBySlot[key] || []}
                  hoveredSlot={hoveredSlot}
                  setHoveredSlot={setHoveredSlot}
                  onMouseDown={() => handleMouseDown(d.iso, h)}
                  onMouseEnter={() => handleMouseEnter(d.iso, h)}
                  onMouseUp={() => handleMouseUpCell(d.iso, h)}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
