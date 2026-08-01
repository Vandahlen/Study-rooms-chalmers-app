/**
 * types/studyRoom.ts
 *
 * Shared types for the Free Study Rooms ("Lediga grupprum") module.
 */

/**
 * A bookable group room or an open/first-come study area. `bookable`
 * distinguishes the two: bookable rooms have a live `freeUntil` and a
 * `bookingUrl`; open areas have neither (nothing tracks their live
 * occupancy yet), and are directory info only.
 */
export interface StudyRoom {
  id: string;
  name: string;
  building: string;
  capacity: number;
  hasWhiteboard: boolean;
  isShared: boolean;
  /** Only meaningful when `isShared` is true. */
  otherHalfFree?: boolean;
  bookable: boolean;
  /** ISO 8601 timestamp; null for open areas (no live booking data). */
  freeUntil: string | null;
  /** Only present when `bookable` is true. */
  bookingUrl?: string;
}

/**
 * Repository contract for the study rooms data layer. The mock
 * implementation reads a bundled JSON fixture; swap in a
 * TimeEdit-backed implementation of this same interface once API
 * access is confirmed - no other file in this module needs to change.
 */
export interface IStudyRoomRepository {
  getRooms(): Promise<StudyRoom[]>;
}
