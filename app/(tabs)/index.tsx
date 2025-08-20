import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '@/store/useAppStore';
import { TicketCard } from '@/components/TicketCard';
import { locationService } from '@/services/locationService';
import { useXIONService } from '@/services/xionService';

export default function TicketsScreen() {
  const { tickets, checkInToEvent, isLoading, initializeStore } = useAppStore();
  const [refreshing, setRefreshing] = React.useState(false);
  const { generateZkTLSProof } = useXIONService();

  useEffect(() => {
    initializeStore();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await initializeStore();
    setRefreshing(false);
  }, []);

  const handleCheckIn = async (ticketId: string) => {
    try {
      const location = await locationService.getCurrentLocation();

      if (location) {
        // Generate zkTLS proof for location
        const proofData = await generateZkTLSProof({
          type: 'location',
          coordinates: location,
          timestamp: new Date().toISOString(),
        });

        checkInToEvent(ticketId, location);
        console.log('Check-in successful with zkTLS proof:', proofData);
      } else {
        // Fallback to QR-based check-in
        checkInToEvent(ticketId);
        console.log('Check-in successful without location');
      }
    } catch (error) {
      console.error('Check-in failed:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#8B5CF6', '#3B82F6']} style={styles.header}>
        <Text style={styles.headerTitle}>TicketProof</Text>
        <Text style={styles.headerSubtitle}>Your verified event tickets</Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {tickets.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No tickets yet</Text>
            <Text style={styles.emptyText}>
              Add your first ticket to get started with blockchain-verified
              attendance
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>
              My Tickets ({tickets.length})
            </Text>
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onCheckIn={handleCheckIn}
              />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E5E7EB',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    marginTop: -10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#F9FAFB',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginHorizontal: 16,
    marginVertical: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});
