<!-- study-rooms/README.md -->
# Free Study Rooms Module

Standalone React Native (TypeScript) package for Chalmers Studentkår
that lists bookable group rooms and first-come-first-served open study
areas. Lives as its own top-level folder, a sibling to the `agila` app
rather than inside it - it type-checks and tests independently and is
not wired into `agila` (no `android`/`ios`/entry point). A host app
integrates it by rendering `StudyRoomsScreen` with a repository.

## Folder structure

```
study-rooms/
├── package.json / tsconfig.json / babel.config.js / jest.config.js
├── theme/
│   ├── theme.ts                       # Chalmers brand tokens (copied from agila/weekly-evaluation)
│   └── ThemeContext.tsx
├── i18n/
│   ├── translations.ts                # this module's own EN/SV copy only
│   └── I18nContext.tsx
├── components/
│   ├── ChalmersText.tsx               # copied typography primitive
│   ├── ChalmersButton.tsx             # copied button primitive
│   ├── TabSwitcher.tsx                # Group rooms / Open areas toggle
│   ├── FilterBar.tsx                  # search + building/size/whiteboard filters
│   └── RoomCard.tsx                   # one room row, full info, no "click in"
├── types/
│   └── studyRoom.ts                   # StudyRoom, IStudyRoomRepository
├── services/
│   ├── roomFilters.ts                 # pure filter/sort logic
│   ├── MockStudyRoomRepository.ts     # reads fixtures/rooms.json
│   └── fixtures/
│       └── rooms.json                 # editable mock room list
├── hooks/
│   └── useStudyRooms.ts               # fetch + tab + filter state
├── screens/
│   └── StudyRoomsScreen.tsx           # top-level screen
└── example/
    └── ExampleUsage.tsx               # illustrative wiring, not a required file
```

## Why this is a separate folder from `agila`

Metro only bundles within a project's own root, so this package can't
cross-import `agila/src/weekly-evaluation`'s theme/i18n/typography
components. The small pieces it needs are copied in instead
(`theme/theme.ts`, `theme/ThemeContext.tsx`, `components/ChalmersText.tsx`,
`components/ChalmersButton.tsx`) - keep both copies in sync if the
Chalmers brand profile changes. `i18n/translations.ts` here only
carries this module's own `studyRooms*` keys, not `agila`'s unrelated
evaluation copy.

## Repository pattern (the TimeEdit seam)

Nothing outside `services/MockStudyRoomRepository.ts` knows the data is
mocked. Every component/hook depends only on `IStudyRoomRepository`:

```ts
interface IStudyRoomRepository {
  getRooms(): Promise<StudyRoom[]>;
}
```

Once TimeEdit API access is confirmed, add a
`TimeEditStudyRoomRepository` implementing this same interface and pass
it to `StudyRoomsScreen` instead of `createMockStudyRoomRepository()` -
no component, hook, or filter/sort logic needs to change.

To hand-edit the mock room list (buildings, sizes, whiteboards, shared
status), just edit `services/fixtures/rooms.json` - no code changes
needed.

## Running

```bash
npm install
npm test        # jest
npm run typecheck  # tsc --noEmit
```

## Known gaps / extension points

- **Program-based building sort** ("sortera beroende på var olika
  program oftare håller hus") is not implemented - it needs a
  building↔program mapping that doesn't exist as data yet.
- **Real TimeEdit integration** - see "Repository pattern" above.
- **Live occupancy for open study areas** - nothing currently tracks
  first-come space occupancy, so the "Open areas" tab is static
  directory info (building/size/whiteboard) only.
- **Integration into `agila`** - this package isn't wired into the
  `agila` app yet; that's a separate step once a host navigation
  structure exists there.
- **Dedicated building filter chip** - there's no separate filter
  chip for building name; free-text search covers building/room name
  lookup instead. Could be added later if wanted.
- **No auth/session identity** - `IStudyRoomRepository` assumes an
  already-configured client, same as `weekly-evaluation`. A real
  TimeEdit integration requiring per-user identity would add that as
  a new parameter to the repository factory, not something this
  interface currently provides.
