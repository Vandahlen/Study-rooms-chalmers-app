/**
 * services/MockStudyRoomRepository.ts
 *
 * Standing in for a TimeEdit-backed repository until API access is
 * confirmed - reads a bundled fixture instead of calling a live
 * schedule. Swap this for a TimeEditStudyRoomRepository implementing
 * the same IStudyRoomRepository interface once that access exists;
 * no other file in this module needs to change.
 */
import { IStudyRoomRepository, StudyRoom } from '../types/studyRoom';
import fixtureRooms from './fixtures/rooms.json';

export class MockStudyRoomRepository implements IStudyRoomRepository {
  async getRooms(): Promise<StudyRoom[]> {
    return fixtureRooms as StudyRoom[];
  }
}

export function createMockStudyRoomRepository(): IStudyRoomRepository {
  return new MockStudyRoomRepository();
}
