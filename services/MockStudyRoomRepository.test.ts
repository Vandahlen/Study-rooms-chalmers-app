import { createMockStudyRoomRepository } from './MockStudyRoomRepository';

test('resolves the fixture room list', async () => {
  const repository = createMockStudyRoomRepository();
  const rooms = await repository.getRooms();

  expect(rooms.length).toBe(7);
  expect(rooms[0]).toMatchObject({ id: 'edit-5128', building: 'EDIT', bookable: true });
  expect(rooms.some((r) => r.bookable === false)).toBe(true);
});
