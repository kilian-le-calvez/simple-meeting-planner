// types.ts
export type Availability = Record<string, boolean>;

export interface UserAvailability {
  name: string;
  availability: Availability;
}
