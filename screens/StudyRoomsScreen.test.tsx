import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import StudyRoomsScreen from './StudyRoomsScreen';
import { createMockStudyRoomRepository } from '../services/MockStudyRoomRepository';
import { ThemeProvider } from 'kar-ui-kit';
import { I18nProvider } from '../i18n/I18nContext';

// VirtualizedList schedules an internal setTimeout (_updateCellsToRender)
// that outlives the test unless unmounted, occasionally firing after Jest
// tears the test env down and logging "Cannot log after tests are done" -
// which Jest treats as a hard process failure regardless of test results.
let activeRenderer: ReactTestRenderer.ReactTestRenderer | undefined;

afterEach(() => {
  ReactTestRenderer.act(() => {
    activeRenderer?.unmount();
  });
  activeRenderer = undefined;
});

function renderScreen(): ReactTestRenderer.ReactTestRenderer {
  const repository = createMockStudyRoomRepository();
  activeRenderer = ReactTestRenderer.create(
    <ThemeProvider>
      <I18nProvider>
        <StudyRoomsScreen repository={repository} />
      </I18nProvider>
    </ThemeProvider>,
  );
  return activeRenderer;
}

test('shows bookable rooms by default, longest-available-first', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderScreen();
  });

  const output = JSON.stringify(renderer!.toJSON());
  expect(output).toContain('EDIT 5128');
  expect(output).toContain('SB-H3');
  expect(output).not.toContain('Vasa A');

  const idxSbH3 = output.indexOf('SB-H3');
  const idxEdit3103 = output.indexOf('EDIT 3103');
  const idxEdit5128 = output.indexOf('EDIT 5128');
  const idxMl2 = output.indexOf('ML2');
  expect(idxSbH3).toBeLessThan(idxEdit3103);
  expect(idxEdit3103).toBeLessThan(idxEdit5128);
  expect(idxEdit5128).toBeLessThan(idxMl2);
});

test('switching to the open areas tab shows non-bookable rooms', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderScreen();
  });

  // findAllByType(Pressable) cannot match RN's memo-wrapped Pressable
  // under React 19 + react-test-renderer 19.2.3 (a fiber-internals
  // incompatibility, unrelated to this screen's wiring) - look the tab
  // button up by testID instead. TabSwitcher renders `testID={`tab-${value}`}`
  // on each tab Pressable.
  const openTabButton = renderer!.root.findByProps({ testID: 'tab-open' });
  await ReactTestRenderer.act(async () => {
    openTabButton.props.onPress();
  });

  const output = JSON.stringify(renderer!.toJSON());
  expect(output).toContain('Vasa A');
  expect(output).not.toContain('EDIT 5128');
});

test('switching sort order to soonest reorders the bookable rooms', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderScreen();
  });

  // I18nProvider defaults to Swedish ('sv') with no override in renderScreen(),
  // so the rendered label is the Swedish translation, not the English one.
  const soonestButton = renderer!.root.findByProps({ children: 'Snarast ledigt' });
  // ChalmersText -> View -> View -> Pressable: onPress lives 3 levels up
  // from the matched ChalmersText instance (mirrors the testID-based
  // lookup workaround noted above for the same Pressable/fiber quirk).
  await ReactTestRenderer.act(async () => {
    soonestButton.parent!.parent!.parent!.props.onPress();
  });

  const output = JSON.stringify(renderer!.toJSON());
  const idxMl2 = output.indexOf('ML2');
  const idxEdit5128 = output.indexOf('EDIT 5128');
  const idxEdit3103 = output.indexOf('EDIT 3103');
  const idxSbH3 = output.indexOf('SB-H3');
  expect(idxMl2).toBeLessThan(idxEdit5128);
  expect(idxEdit5128).toBeLessThan(idxEdit3103);
  expect(idxEdit3103).toBeLessThan(idxSbH3);
});

test('shows an error state with a working retry when the repository rejects', async () => {
  let attempts = 0;
  const failingRepository: import('../types/studyRoom').IStudyRoomRepository = {
    getRooms: async () => {
      attempts += 1;
      if (attempts === 1) throw new Error('network down');
      return [];
    },
  };

  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(
      <ThemeProvider>
        <I18nProvider>
          <StudyRoomsScreen repository={failingRepository} />
        </I18nProvider>
      </ThemeProvider>,
    );
  });
  activeRenderer = renderer!;

  let output = JSON.stringify(renderer!.toJSON());
  expect(output).toContain("Kunde inte hämta lediga grupprum.");

  const retryButton = renderer!.root.findByProps({ children: 'Försök igen' });
  await ReactTestRenderer.act(async () => {
    retryButton.parent!.parent!.parent!.props.onPress();
  });

  output = JSON.stringify(renderer!.toJSON());
  expect(output).toContain('Inga rum matchar dina filter just nu.');
  expect(attempts).toBe(2);
});

test('typing in the search box filters the visible rooms', async () => {
  const { TextInput } = require('react-native');
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderScreen();
  });

  const searchInput = renderer!.root.findByType(TextInput);
  await ReactTestRenderer.act(async () => {
    searchInput.props.onChangeText('Sven Hultin');
  });

  const output = JSON.stringify(renderer!.toJSON());
  expect(output).toContain('SB-H3');
  expect(output).not.toContain('EDIT 5128');
  expect(output).not.toContain('ML2');
});
