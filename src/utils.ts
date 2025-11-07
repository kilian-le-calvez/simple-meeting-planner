// utils.ts
import { UserAvailability } from "./types";

export function computeCombinedAndNames(data: UserAvailability[]) {
  const combined: Record<string, number> = {};
  const namesBySlot: Record<string, string[]> = {};

  data.forEach((u) => {
    Object.entries(u.availability).forEach(([k, v]) => {
      if (v) {
        combined[k] = (combined[k] || 0) + 1;
        namesBySlot[k] = namesBySlot[k]
          ? [...namesBySlot[k], u.name]
          : [u.name];
      }
    });
  });

  return { combined, namesBySlot };
}
