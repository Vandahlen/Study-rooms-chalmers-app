import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { ThemeProvider, colors } from 'kar-ui-kit';
import TabSwitcher from './TabSwitcher';
import { I18nProvider } from '../i18n/I18nContext';

let activeRenderer: ReactTestRenderer.ReactTestRenderer | undefined;

afterEach(() => {
  ReactTestRenderer.act(() => {
    activeRenderer?.unmount();
  });
  activeRenderer = undefined;
});

function render(section: 'hem' | 'mat' | 'event' | 'extra') {
  ReactTestRenderer.act(() => {
    activeRenderer = ReactTestRenderer.create(
      <ThemeProvider section={section}>
        <I18nProvider>
          <TabSwitcher tab="bookable" onChange={() => {}} />
        </I18nProvider>
      </ThemeProvider>,
    );
  });
  return activeRenderer!;
}

test('active tab uses the section accent, not hardcoded blue', () => {
  const output = JSON.stringify(render('extra').toJSON());
  expect(output).toContain(colors.turkos);
  expect(output).not.toContain(colors.bla);
});

test('the same component is blue under the hem section', () => {
  const output = JSON.stringify(render('hem').toJSON());
  expect(output).toContain(colors.bla);
});
