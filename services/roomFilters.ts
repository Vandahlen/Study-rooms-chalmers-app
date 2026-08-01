/**
 * services/roomFilters.ts
 *
 * Pure filtering/sorting over a StudyRoom list, kept separate from
 * useStudyRooms so this logic is unit-testable without rendering
 * React.
 */
import { StudyRoom } from '../types/studyRoom';

export interface RoomFilters {
  search: string;
  minCapacity: number | null;
  whiteboardOnly: boolean;
}

export const DEFAULT_ROOM_FILTERS: RoomFilters = {
  search: '',
  minCapacity: null,
  whiteboardOnly: false,
};

export function filterRooms(rooms: StudyRoom[], filters: RoomFilters): StudyRoom[] {
  const search = filters.search.trim().toLowerCase();

  return rooms.filter((room) => {
    if (
      search &&
      !room.building.toLowerCase().includes(search) &&
      !room.name.toLowerCase().includes(search)
    ) {
      return false;
    }
    if (filters.minCapacity !== null && room.capacity < filters.minCapacity) {
      return false;
    }
    if (filters.whiteboardOnly && !room.hasWhiteboard) {
      return false;
    }
    return true;
  });
}

export function sortByLongestAvailable(rooms: StudyRoom[]): StudyRoom[] {
  return [...rooms].sort((a, b) => {
    if (a.freeUntil === null && b.freeUntil === null) return 0;
    if (a.freeUntil === null) return 1;
    if (b.freeUntil === null) return -1;
    return new Date(b.freeUntil).getTime() - new Date(a.freeUntil).getTime();
  });
}
