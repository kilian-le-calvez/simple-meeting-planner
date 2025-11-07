// Calendar.tsx
import React, { useState } from "react";
import Slot from "./Slot";

const days = ["Sat8", "Sun9", "Mon10", "Tue11", "Wed12", "Thu13", "Fri14"];
const hours = Array.from({ length: 16 }, (_, i) => i + 8);

interface CalendarProps {
  availability: Record<string, boolean>;
  combined: Record<string, number>;
  namesBySlot: Record<string, string[]>;
  hoveredSlot: string | null;
  setHoveredSlot: (key: string | null) => void;
  toggleSlot: (day: string, hour: number, forceValue?: boolean) => void;
}

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

  const handleMouseDown = (day: string, hour: number) => {
    const key = `${day}-${hour}`;
    const currentlySelected = !!availability[key];
    const newValue = !currentlySelected;
    setDragValue(newValue);
    toggleSlot(day, hour, newValue);
    setIsDragging(true);
  };

  const handleMouseEnter = (day: string, hour: number) => {
    if (!isDragging || dragValue === null) return;
    toggleSlot(day, hour, dragValue);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragValue(null);
  };

  return (
    <div
      className="grid grid-cols-8 gap-1 relative select-none"
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
    >
      <div></div>
      {days.map((d) => (
        <div key={d} className="font-bold">
          {d}
        </div>
      ))}
      {hours.map((h) => (
        <React.Fragment key={h}>
          <div className="font-bold">{h}h</div>
          {days.map((d) => (
            <Slot
              key={`${d}-${h}`}
              day={d}
              hour={h}
              selected={!!availability[`${d}-${h}`]}
              count={combined[`${d}-${h}`] || 0}
              names={namesBySlot[`${d}-${h}`] || []}
              hoveredSlot={hoveredSlot}
              setHoveredSlot={setHoveredSlot}
              onMouseDown={() => handleMouseDown(d, h)}
              onMouseEnter={() => handleMouseEnter(d, h)}
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Calendar;
