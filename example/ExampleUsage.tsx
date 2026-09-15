/**
 * example/ExampleUsage.tsx
 *
 * Illustrative standalone wiring, not a required file. Shows how a
 * host app would render StudyRoomsScreen inside this package's own
 * Theme/I18n providers.
 */
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import StudyRoomsScreen from '../screens/StudyRoomsScreen';
import { createMockStudyRoomRepository } from '../services/MockStudyRoomRepository';
import { ThemeProvider, ChalmersBackground } from 'kar-ui-kit';
import { I18nProvider } from '../i18n/I18nContext';

const repository = createMockStudyRoomRepository();

// Section drives the accent colour. `extra` is inferred from the karapp's
// own 'Det lilla extra' tab, not measured - the host should pass its own
// section when it embeds this module.
function StudyRoomsExample(): React.JSX.Element {
  return (
    <ThemeProvider section="extra">
      <ChalmersBackground>
      <I18nProvider>
        <SafeAreaView style={styles.safeArea}>
          <StudyRoomsScreen repository={repository} />
        </SafeAreaView>
      </I18nProvider>
      </ChalmersBackground>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});

export default StudyRoomsExample;
