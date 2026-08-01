// study-rooms/components/TabSwitcher.tsx
/**
 * components/TabSwitcher.tsx
 *
 * Toggles between the "Group rooms" (bookable) and "Open areas"
 * (first-come-first-served) tabs.
 */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import ChalmersText from './ChalmersText';
import { colors, radii, spacing } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { useI18n } from '../i18n/I18nContext';
import { RoomTab } from '../hooks/useStudyRooms';

export interface TabSwitcherProps {
  tab: RoomTab;
  onChange: (tab: RoomTab) => void;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({ tab, onChange }) => {
  const theme = useTheme();
  const { t } = useI18n();

  const renderTab = (value: RoomTab, label: string) => {
    const selected = tab === value;
    return (
      <Pressable
        key={value}
        onPress={() => onChange(value)}
        style={[styles.tab, selected && { backgroundColor: colors.bla }]}
        accessibilityRole="button"
        accessibilityState={{ selected }}
      >
        <ChalmersText variant="paragraph2" color={selected ? colors.white : theme.text}>
          {label}
        </ChalmersText>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { borderColor: theme.border }]}>
      {renderTab('bookable', t.studyRoomsTabBookable)}
      {renderTab('open', t.studyRoomsTabOpen)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: radii.pill,
    borderWidth: 1,
    padding: 4,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    borderRadius: radii.pill,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
});

export default TabSwitcher;
