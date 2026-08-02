// components/FilterBar.tsx
/**
 * components/FilterBar.tsx
 *
 * Search + building/size/whiteboard filters. Capacity uses a fixed
 * set of preset thresholds rather than a free-form number input,
 * matching the spec's "storlek" filter without needing a stepper.
 */
import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { ChalmersText, SearchIcon, FilterIcon, colors, radii, spacing, useTheme } from 'kar-ui-kit';
import { useI18n } from '../i18n/I18nContext';

const CAPACITY_OPTIONS: Array<number | null> = [null, 2, 4, 8];

export interface FilterBarProps {
  search: string;
  onSearchChange: (search: string) => void;
  minCapacity: number | null;
  onMinCapacityChange: (minCapacity: number | null) => void;
  whiteboardOnly: boolean;
  onWhiteboardOnlyChange: (whiteboardOnly: boolean) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  minCapacity,
  onMinCapacityChange,
  whiteboardOnly,
  onWhiteboardOnlyChange,
}) => {
  const theme = useTheme();
  const { t } = useI18n();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.searchRow,
          { borderColor: theme.border, backgroundColor: theme.inputBg },
        ]}
      >
        <SearchIcon size={16} color={theme.subText} />
        <TextInput
          value={search}
          onChangeText={onSearchChange}
          placeholder={t.studyRoomsSearchPlaceholder}
          placeholderTextColor={theme.subText}
          style={[styles.search, { color: theme.text }]}
          accessibilityLabel={t.studyRoomsSearchPlaceholder}
        />
      </View>

      <View style={styles.chipRow}>
        <FilterIcon size={16} color={theme.subText} style={styles.filterIcon} />
        {CAPACITY_OPTIONS.map((option) => {
          const selected = minCapacity === option;
          return (
            <Pressable
              key={String(option)}
              onPress={() => onMinCapacityChange(option)}
              style={[
                styles.chip,
                { borderColor: theme.border },
                selected && { backgroundColor: colors.bla, borderColor: colors.bla },
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected }}
            >
              <ChalmersText variant="caption1" color={selected ? colors.white : theme.text}>
                {option === null ? t.studyRoomsCapacityAny : t.studyRoomsCapacityAtLeast(option)}
              </ChalmersText>
            </Pressable>
          );
        })}

        <Pressable
          onPress={() => onWhiteboardOnlyChange(!whiteboardOnly)}
          style={[
            styles.chip,
            { borderColor: theme.border },
            whiteboardOnly && { backgroundColor: colors.bla, borderColor: colors.bla },
          ]}
          accessibilityRole="button"
          accessibilityState={{ selected: whiteboardOnly }}
        >
          <ChalmersText variant="caption1" color={whiteboardOnly ? colors.white : theme.text}>
            {t.studyRoomsWhiteboardBadge}
          </ChalmersText>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },
  search: {
    flex: 1,
    paddingVertical: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.xs,
  },
  filterIcon: {
    marginRight: spacing.xs / 2,
  },
  chip: {
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
});

export default FilterBar;
