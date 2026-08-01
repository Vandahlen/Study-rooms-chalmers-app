// study-rooms/components/RoomCard.tsx
/**
 * components/RoomCard.tsx
 *
 * One row in the study rooms list: name, building, capacity,
 * whiteboard flag, shared-room badge, and (for bookable rooms) a
 * free-until time plus a "Book this room" link. Shows the full card
 * in the feed - per the spec, nothing here requires "clicking in"
 * for full info.
 */
import React from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import ChalmersText from './ChalmersText';
import { colors, radii, spacing } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { useI18n } from '../i18n/I18nContext';
import { StudyRoom } from '../types/studyRoom';

export interface RoomCardProps {
  room: StudyRoom;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const theme = useTheme();
  const { t } = useI18n();

  const handleBookPress = () => {
    if (room.bookingUrl) {
      Linking.openURL(room.bookingUrl);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <ChalmersText variant="heading2">{room.name}</ChalmersText>
      <ChalmersText variant="paragraph2" color={theme.subText}>
        {room.building}
      </ChalmersText>

      <View style={styles.metaRow}>
        <ChalmersText variant="caption1" color={theme.subText}>
          {t.studyRoomsCapacityLabel(room.capacity)}
        </ChalmersText>
        {room.hasWhiteboard && (
          <ChalmersText variant="caption1" color={theme.subText}>
            {t.studyRoomsWhiteboardBadge}
          </ChalmersText>
        )}
        {room.freeUntil && (
          <ChalmersText variant="caption1" color={colors.gron}>
            {t.studyRoomsFreeUntil(formatTime(room.freeUntil))}
          </ChalmersText>
        )}
      </View>

      {room.isShared && (
        <View style={[styles.badge, { backgroundColor: theme.badgeBg }]}>
          <ChalmersText variant="caption2" color={theme.subText}>
            {room.otherHalfFree ? t.studyRoomsOtherHalfFree : t.studyRoomsOtherHalfTaken}
          </ChalmersText>
        </View>
      )}

      {room.bookable && room.bookingUrl && (
        <Pressable onPress={handleBookPress} accessibilityRole="button">
          <ChalmersText variant="paragraph2" color={colors.bla}>
            {t.studyRoomsBookButton}
          </ChalmersText>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radii.card,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginTop: spacing.xs,
  },
});

export default RoomCard;
