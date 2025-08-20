import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatusBadgeProps {
  status: 'verified' | 'unverified' | 'checked-in' | 'upcoming' | 'missed';
  type: 'verification' | 'attendance';
}

export function StatusBadge({ status, type }: StatusBadgeProps) {
  const getStatusConfig = () => {
    if (type === 'verification') {
      return status === 'verified'
        ? { text: '✅ Verified', style: styles.verified }
        : { text: '❌ Unverified', style: styles.unverified };
    }
    
    switch (status) {
      case 'checked-in':
        return { text: '✅ Checked In', style: styles.checkedIn };
      case 'upcoming':
        return { text: '🕐 Upcoming', style: styles.upcoming };
      case 'missed':
        return { text: '❌ Missed', style: styles.missed };
      default:
        return { text: '🕐 Upcoming', style: styles.upcoming };
    }
  };

  const { text, style } = getStatusConfig();

  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  verified: {
    backgroundColor: '#D1FAE5',
  },
  unverified: {
    backgroundColor: '#FEE2E2',
  },
  checkedIn: {
    backgroundColor: '#D1FAE5',
  },
  upcoming: {
    backgroundColor: '#FEF3C7',
  },
  missed: {
    backgroundColor: '#FEE2E2',
  },
});