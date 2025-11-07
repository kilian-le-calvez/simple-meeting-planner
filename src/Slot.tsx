// Slot.tsx
import React from "react";

const EQUIPE_NB_MAX = 6;
const EQUIPE_NB_BOF = 4;

interface SlotProps {
  day: string;
  hour: number;
  selected: boolean;
  count: number;
  names: string[];
  hoveredSlot: string | null;
  setHoveredSlot: (key: string | null) => void;
  onMouseDown: () => void;
  onMouseEnter: () => void;
}

const Slot: React.FC<SlotProps> = ({
  day,
  hour,
  selected,
  count,
  names,
  hoveredSlot,
  setHoveredSlot,
  onMouseDown,
  onMouseEnter,
}) => {
  let bgClass = "bg-transparent";
  if (selected) bgClass = "bg-blue-400 bg-opacity-50";
  else if (count > 0) {
    if (count >= EQUIPE_NB_MAX) bgClass = "bg-green-400 bg-opacity-75";
    else if (count >= EQUIPE_NB_BOF) bgClass = "bg-yellow-400 bg-opacity-75";
    else bgClass = "bg-red-400 bg-opacity-75";
  }

  return (
    <div
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={() => setHoveredSlot(null)}
      onMouseOver={() => setHoveredSlot(names.length ? `${day}-${hour}` : null)}
      className={`border h-8 cursor-pointer flex items-center justify-center text-sm relative ${bgClass}`}
    >
      {count > 0 ? count : ""}

      {hoveredSlot === `${day}-${hour}` && names.length > 0 && (
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
          {names.join(", ")}
        </div>
      )}
    </div>
  );
};

export default Slot;
