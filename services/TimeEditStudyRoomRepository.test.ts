import {
  buildAvailableRooms,
  createTimeEditStudyRoomRepository,
  TimeEditRoom,
} from './TimeEditStudyRoomRepository';

const room = (id: string, extra: Partial<TimeEditRoom> = {}): TimeEditRoom => ({
  id,
  name: id,
  building: 'EDIT',
  capacity: 4,
  hasWhiteboard: false,
  ...extra,
});

const now = new Date('2026-09-16T10:00:00.000Z');
const windowEnd = new Date('2026-09-16T21:59:59.999Z');

test('leaves out rooms occupied now and sets freeUntil to the next reservation', () => {
  const rooms = buildAvailableRooms(
    [room('busy'), room('free-later-booked'), room('free-all-day'), room('just-ended')],
    [
      { roomId: 'busy', start: '2026-09-16T09:00:00.000Z', end: '2026-09-16T11:00:00.000Z' },
      { roomId: 'free-later-booked', start: '2026-09-16T15:00:00.000Z', end: '2026-09-16T16:00:00.000Z' },
      { roomId: 'free-later-booked', start: '2026-09-16T13:00:00.000Z', end: '2026-09-16T14:00:00.000Z' },
      { roomId: 'just-ended', start: '2026-09-16T08:00:00.000Z', end: '2026-09-16T10:00:00.000Z' },
    ],
    now,
    windowEnd,
  );

  expect(rooms.map((r) => [r.id, r.freeUntil])).toEqual([
    ['free-later-booked', '2026-09-16T13:00:00.000Z'],
    ['free-all-day', windowEnd.toISOString()],
    ['just-ended', windowEnd.toISOString()],
  ]);
  expect(rooms.every((r) => r.bookable)).toBe(true);
});

test('reports whether the other half of a shared room is free', () => {
  const rooms = buildAvailableRooms(
    [room('ml2-a', { otherHalfId: 'ml2-b' }), room('ml2-b', { otherHalfId: 'ml2-a' }), room('solo')],
    [{ roomId: 'ml2-b', start: '2026-09-16T09:30:00.000Z', end: '2026-09-16T10:30:00.000Z' }],
    now,
    windowEnd,
  );

  expect(rooms.find((r) => r.id === 'ml2-a')).toMatchObject({ isShared: true, otherHalfFree: false });
  expect(rooms.find((r) => r.id === 'ml2-b')).toBeUndefined();
  expect(rooms.find((r) => r.id === 'solo')).toMatchObject({ isShared: false });
  expect(rooms.find((r) => r.id === 'solo')).not.toHaveProperty('otherHalfFree');
});

test('repository queries reservations from now and appends open areas', async () => {
  const loadReservations = jest.fn(async () => []);
  const openArea = {
    id: 'vasa-a', name: 'Vasa A', building: 'Vasa', capacity: 8, hasWhiteboard: false,
    isShared: false, bookable: false, freeUntil: null,
  };

  const rooms = await createTimeEditStudyRoomRepository({
    loadRooms: async () => [room('edit-5128')],
    loadReservations,
    openAreas: [openArea],
    now: () => now,
  }).getRooms();

  expect(loadReservations).toHaveBeenCalledWith(now, expect.any(Date));
  expect(rooms.map((r) => r.id)).toEqual(['edit-5128', 'vasa-a']);
});
