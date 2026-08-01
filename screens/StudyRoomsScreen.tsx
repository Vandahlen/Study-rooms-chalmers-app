/**
 * screens/StudyRoomsScreen.tsx
 *
 * Top-level "Lediga grupprum" screen: owns tab/filter state via
 * useStudyRooms and renders the bookable-rooms / open-areas list.
 */
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import ChalmersText from '../components/ChalmersText';
import ChalmersButton from '../components/ChalmersButton';
import { spacing } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { useI18n } from '../i18n/I18nContext';
import { useStudyRooms } from '../hooks/useStudyRooms';
import { IStudyRoomRepository, StudyRoom } from '../types/studyRoom';
import RoomCard from '../components/RoomCard';
import TabSwitcher from '../components/TabSwitcher';
import FilterBar from '../components/FilterBar';

export interface StudyRoomsScreenProps {
  repository: IStudyRoomRepository;
}

const StudyRoomsScreen: React.FC<StudyRoomsScreenProps> = ({ repository }) => {
  const theme = useTheme();
  const { t } = useI18n();
  const {
    loadState,
    tab,
    setTab,
    filters,
    setSearch,
    setMinCapacity,
    setWhiteboardOnly,
    visibleRooms,
    reload,
  } = useStudyRooms({ repository });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ChalmersText variant="heading1" style={styles.title}>
        {t.studyRoomsTitle}
      </ChalmersText>

      <TabSwitcher tab={tab} onChange={setTab} />

      <FilterBar
        search={filters.search}
        onSearchChange={setSearch}
        minCapacity={filters.minCapacity}
        onMinCapacityChange={setMinCapacity}
        whiteboardOnly={filters.whiteboardOnly}
        onWhiteboardOnlyChange={setWhiteboardOnly}
      />

      {loadState === 'error' && (
        <View style={styles.centered}>
          <ChalmersText color={theme.subText}>{t.studyRoomsLoadError}</ChalmersText>
          <ChalmersButton label={t.studyRoomsTryAgain} onPress={reload} variant="secondary" />
        </View>
      )}

      {loadState === 'ready' && visibleRooms.length === 0 && (
        <View style={styles.centered}>
          <ChalmersText color={theme.subText}>{t.studyRoomsEmpty}</ChalmersText>
        </View>
      )}

      <FlatList
        data={visibleRooms}
        keyExtractor={(room: StudyRoom) => room.id}
        renderItem={({ item }) => <RoomCard room={item} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  title: {
    marginBottom: spacing.md,
  },
  centered: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  list: {
    paddingBottom: spacing.lg,
  },
});

export default StudyRoomsScreen;
