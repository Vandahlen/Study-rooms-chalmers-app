import { StudyRoom } from '../types/studyRoom';
import { DEFAULT_ROOM_FILTERS, filterRooms, sortByLongestAvailable } from './roomFilters';

const room = (overrides: Partial<StudyRoom>): StudyRoom => ({
  id: 'r',
  name: 'Room',
  building: 'EDIT',
  capacity: 4,
  hasWhiteboard: false,
  isShared: false,
  bookable: true,
  freeUntil: null,
  ...overrides,
});

describe('filterRooms', () => {
  const rooms = [
    room({ id: 'a', name: 'EDIT 5128', building: 'EDIT', capacity: 6, hasWhiteboard: true }),
    room({ id: 'b', name: 'ML2', building: 'Maskin', capacity: 4, hasWhiteboard: false }),
    room({ id: 'c', name: 'SB-H3', building: 'Sven Hultin', capacity: 10, hasWhiteboard: true }),
  ];

  test('with default filters returns every room unchanged', () => {
    expect(filterRooms(rooms, DEFAULT_ROOM_FILTERS)).toEqual(rooms);
  });

  test('search matches building or name, case-insensitively', () => {
    const result = filterRooms(rooms, { ...DEFAULT_ROOM_FILTERS, search: 'edit' });
    expect(result.map((r) => r.id)).toEqual(['a']);
  });

  test('minCapacity excludes rooms below the threshold', () => {
    const result = filterRooms(rooms, { ...DEFAULT_ROOM_FILTERS, minCapacity: 6 });
    expect(result.map((r) => r.id)).toEqual(['a', 'c']);
  });

  test('whiteboardOnly excludes rooms without a whiteboard', () => {
    const result = filterRooms(rooms, { ...DEFAULT_ROOM_FILTERS, whiteboardOnly: true });
    expect(result.map((r) => r.id)).toEqual(['a', 'c']);
  });

  test('filters combine with AND semantics', () => {
    const result = filterRooms(rooms, {
      search: 'maskin',
      minCapacity: 6,
      whiteboardOnly: false,
    });
    expect(result).toEqual([]);
  });
});

describe('sortByLongestAvailable', () => {
  test('orders by descending freeUntil, nulls last', () => {
    const rooms = [
      room({ id: 'soon', freeUntil: '2026-08-01T12:00:00.000Z' }),
      room({ id: 'open', freeUntil: null }),
      room({ id: 'longest', freeUntil: '2026-08-01T18:00:00.000Z' }),
    ];

    expect(sortByLongestAvailable(rooms).map((r) => r.id)).toEqual([
      'longest',
      'soon',
      'open',
    ]);
  });

  test('does not mutate the input array', () => {
    const rooms = [room({ id: 'a', freeUntil: '2026-08-01T12:00:00.000Z' })];
    const originalOrder = [...rooms];
    sortByLongestAvailable(rooms);
    expect(rooms).toEqual(originalOrder);
  });
});
