/**
 * services/TimeEditStudyRoomRepository.ts
 *
 * TimeEdit-backed IStudyRoomRepository, prepared ahead of API access.
 *
 * Split in two so only the TimeEdit-specific part is left to write:
 * - `loadRooms` / `loadReservations` (injected): call TimeEdit and map
 *   its response into the plain shapes below. Not written yet - the
 *   response format is unknown until the API docs arrive.
 * - `buildAvailableRooms` (done, tested): turns rooms + reservations
 *   into the StudyRoom list the screen renders.
 */
import { IStudyRoomRepository, StudyRoom } from '../types/studyRoom';

/** A bookable room as TimeEdit describes it, minus live availability. */
export interface TimeEditRoom {
  id: string;
  name: string;
  building: string;
  capacity: number;
  hasWhiteboard: boolean;
  bookingUrl?: string;
  /** For shared rooms split into two bookable halves: the other half's id. */
  otherHalfId?: string;
}

/** One booking/lecture occupying a room. ISO 8601 timestamps. */
export interface TimeEditReservation {
  roomId: string;
  start: string;
  end: string;
}

export interface TimeEditLoaders {
  loadRooms(): Promise<TimeEditRoom[]>;
  /** Reservations overlapping [from, to]. */
  loadReservations(from: Date, to: Date): Promise<TimeEditReservation[]>;
  /**
   * Open/first-come areas aren't booked through TimeEdit, so they're
   * supplied as static directory info (`bookable: false`).
   */
  openAreas?: StudyRoom[];
  now?: () => Date;
}

// ponytail: availability window ends at local midnight; switch to the
// rooms' real closing hours if TimeEdit exposes them.
function endOfDay(now: Date): Date {
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  return end;
}

/**
 * Rooms free right now, each with `freeUntil` = start of its next
 * reservation (or the window end). Rooms occupied right now are left
 * out - the screen lists free rooms only.
 */
export function buildAvailableRooms(
  rooms: TimeEditRoom[],
  reservations: TimeEditReservation[],
  now: Date,
  windowEnd: Date,
): StudyRoom[] {
  const nowMs = now.getTime();

  const isOccupied = (roomId: string) =>
    reservations.some(
      (r) =>
        r.roomId === roomId &&
        new Date(r.start).getTime() <= nowMs &&
        new Date(r.end).getTime() > nowMs,
    );

  const nextStart = (roomId: string): number => {
    let next = windowEnd.getTime();
    for (const r of reservations) {
      const start = new Date(r.start).getTime();
      if (r.roomId === roomId && start > nowMs && start < next) next = start;
    }
    return next;
  };

  return rooms
    .filter((room) => !isOccupied(room.id))
    .map((room) => ({
      id: room.id,
      name: room.name,
      building: room.building,
      capacity: room.capacity,
      hasWhiteboard: room.hasWhiteboard,
      isShared: room.otherHalfId !== undefined,
      ...(room.otherHalfId !== undefined && {
        otherHalfFree: !isOccupied(room.otherHalfId),
      }),
      bookable: true,
      freeUntil: new Date(nextStart(room.id)).toISOString(),
      bookingUrl: room.bookingUrl,
    }));
}

export class TimeEditStudyRoomRepository implements IStudyRoomRepository {
  constructor(private readonly loaders: TimeEditLoaders) {}

  async getRooms(): Promise<StudyRoom[]> {
    const now = (this.loaders.now ?? (() => new Date()))();
    const windowEnd = endOfDay(now);
    const [rooms, reservations] = await Promise.all([
      this.loaders.loadRooms(),
      this.loaders.loadReservations(now, windowEnd),
    ]);
    return [
      ...buildAvailableRooms(rooms, reservations, now, windowEnd),
      ...(this.loaders.openAreas ?? []),
    ];
  }
}

export function createTimeEditStudyRoomRepository(
  loaders: TimeEditLoaders,
): IStudyRoomRepository {
  return new TimeEditStudyRoomRepository(loaders);
}
