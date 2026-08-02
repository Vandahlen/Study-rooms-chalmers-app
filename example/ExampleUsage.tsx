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
import { ThemeProvider } from 'kar-ui-kit';
import { I18nProvider } from '../i18n/I18nContext';

const repository = createMockStudyRoomRepository();

function StudyRoomsExample(): React.JSX.Element {
  return (
    <ThemeProvider>
      <I18nProvider>
        <SafeAreaView style={styles.safeArea}>
          <StudyRoomsScreen repository={repository} />
        </SafeAreaView>
      </I18nProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});

export default StudyRoomsExample;
