/**
 * hooks/useStudyRooms.ts
 *
 * All data-fetching, tab, and filter state for the study rooms
 * screen. StudyRoomsScreen only renders what this hook exposes - it
 * holds no business logic of its own.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IStudyRoomRepository, StudyRoom } from '../types/studyRoom';
import {
  DEFAULT_ROOM_FILTERS,
  RoomFilters,
  filterRooms,
  sortByLongestAvailable,
} from '../services/roomFilters';

export type LoadState = 'loading' | 'ready' | 'error';
export type RoomTab = 'bookable' | 'open';

export interface UseStudyRoomsArgs {
  repository: IStudyRoomRepository;
}

export function useStudyRooms({ repository }: UseStudyRoomsArgs) {
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [rooms, setRooms] = useState<StudyRoom[]>([]);
  const [tab, setTab] = useState<RoomTab>('bookable');
  const [filters, setFilters] = useState<RoomFilters>(DEFAULT_ROOM_FILTERS);

  const load = useCallback(async () => {
    setLoadState('loading');
    try {
      const fetched = await repository.getRooms();
      setRooms(fetched);
      setLoadState('ready');
    } catch {
      setLoadState('error');
    }
  }, [repository]);

  useEffect(() => {
    load();
  }, [load]);

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const setMinCapacity = useCallback((minCapacity: number | null) => {
    setFilters((prev) => ({ ...prev, minCapacity }));
  }, []);

  const setWhiteboardOnly = useCallback((whiteboardOnly: boolean) => {
    setFilters((prev) => ({ ...prev, whiteboardOnly }));
  }, []);

  const visibleRooms = useMemo(() => {
    const wantBookable = tab === 'bookable';
    const scoped = rooms.filter((room) => room.bookable === wantBookable);
    const filtered = filterRooms(scoped, filters);
    return wantBookable ? sortByLongestAvailable(filtered) : filtered;
  }, [rooms, tab, filters]);

  return {
    loadState,
    tab,
    setTab,
    filters,
    setSearch,
    setMinCapacity,
    setWhiteboardOnly,
    visibleRooms,
    reload: load,
  };
}
