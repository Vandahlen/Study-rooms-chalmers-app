// study-rooms/components/TabSwitcher.tsx
/**
 * components/TabSwitcher.tsx
 *
 * Toggles between the "Group rooms" (bookable) and "Open areas"
 * (first-come-first-served) tabs.
 *
 * A thin adapter over kar-ui-kit's ChalmersSegmentedControl, which carries the
 * measured Karappen geometry and the section-accent active pill. This file only
 * maps RoomTab values to segment indices and supplies the translated labels.
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import { ChalmersSegmentedControl, spacing } from 'kar-ui-kit';
import { useI18n } from '../i18n/I18nContext';
import { RoomTab } from '../hooks/useStudyRooms';

export interface TabSwitcherProps {
  tab: RoomTab;
  onChange: (tab: RoomTab) => void;
}

// Order defines segment indices, and so the testIDs `tab-segment-<index>`.
const TABS: RoomTab[] = ['bookable', 'open'];

const TabSwitcher: React.FC<TabSwitcherProps> = ({ tab, onChange }) => {
  const { t } = useI18n();

  return (
    <ChalmersSegmentedControl
      testID="tab"
      segments={[t.studyRoomsTabBookable, t.studyRoomsTabOpen]}
      selectedIndex={TABS.indexOf(tab)}
      onChange={index => onChange(TABS[index])}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
});

export default TabSwitcher;
