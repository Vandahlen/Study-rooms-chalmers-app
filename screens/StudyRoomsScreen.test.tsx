import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import StudyRoomsScreen from './StudyRoomsScreen';
import { createMockStudyRoomRepository } from '../services/MockStudyRoomRepository';
import { ThemeProvider } from '../theme/ThemeContext';
import { I18nProvider } from '../i18n/I18nContext';

function renderScreen(): ReactTestRenderer.ReactTestRenderer {
  const repository = createMockStudyRoomRepository();
  return ReactTestRenderer.create(
    <ThemeProvider>
      <I18nProvider>
        <StudyRoomsScreen repository={repository} />
      </I18nProvider>
    </ThemeProvider>,
  );
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
