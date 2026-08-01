// study-rooms/i18n/translations.ts
/**
 * i18n/translations.ts
 *
 * Every user-facing string in the study-rooms module, in English and
 * Swedish.
 */

export type Language = 'en' | 'sv';

export interface Translation {
  studyRoomsTitle: string;
  studyRoomsTabBookable: string;
  studyRoomsTabOpen: string;
  studyRoomsSearchPlaceholder: string;
  studyRoomsCapacityAny: string;
  studyRoomsCapacityAtLeast: (capacity: number) => string;
  studyRoomsCapacityLabel: (capacity: number) => string;
  studyRoomsWhiteboardBadge: string;
  studyRoomsFreeUntil: (time: string) => string;
  studyRoomsOtherHalfFree: string;
  studyRoomsOtherHalfTaken: string;
  studyRoomsBookButton: string;
  studyRoomsLoadError: string;
  studyRoomsTryAgain: string;
  studyRoomsEmpty: string;
}

export const translations: Record<Language, Translation> = {
  en: {
    studyRoomsTitle: 'Free study rooms',
    studyRoomsTabBookable: 'Group rooms',
    studyRoomsTabOpen: 'Open areas',
    studyRoomsSearchPlaceholder: 'Search by building or room',
    studyRoomsCapacityAny: 'Any size',
    studyRoomsCapacityAtLeast: (capacity) => `${capacity}+`,
    studyRoomsCapacityLabel: (capacity) => `Fits ${capacity}`,
    studyRoomsWhiteboardBadge: 'Whiteboard',
    studyRoomsFreeUntil: (time) => `Free until ${time}`,
    studyRoomsOtherHalfFree: 'Shared room · other half free',
    studyRoomsOtherHalfTaken: 'Shared room · other half taken',
    studyRoomsBookButton: 'Book this room ->',
    studyRoomsLoadError: "Couldn't load study rooms.",
    studyRoomsTryAgain: 'Try again',
    studyRoomsEmpty: 'No rooms match your filters right now.',
  },
  sv: {
    studyRoomsTitle: 'Lediga grupprum',
    studyRoomsTabBookable: 'Grupprum',
    studyRoomsTabOpen: 'Öppna ytor',
    studyRoomsSearchPlaceholder: 'Sök på byggnad eller rum',
    studyRoomsCapacityAny: 'Valfri storlek',
    studyRoomsCapacityAtLeast: (capacity) => `${capacity}+`,
    studyRoomsCapacityLabel: (capacity) => `Plats för ${capacity}`,
    studyRoomsWhiteboardBadge: 'Whiteboard',
    studyRoomsFreeUntil: (time) => `Ledigt fram till ${time}`,
    studyRoomsOtherHalfFree: 'Delat grupprum · andra halvan ledig',
    studyRoomsOtherHalfTaken: 'Delat grupprum · andra halvan upptagen',
    studyRoomsBookButton: 'Boka rummet ->',
    studyRoomsLoadError: 'Kunde inte hämta lediga grupprum.',
    studyRoomsTryAgain: 'Försök igen',
    studyRoomsEmpty: 'Inga rum matchar dina filter just nu.',
  },
};
