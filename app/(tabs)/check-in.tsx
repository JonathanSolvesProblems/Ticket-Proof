import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { locationService } from '@/services/locationService';
import { useXIONService } from '@/services/xionService';
import { Ticket } from '@/types';
import { MapPin, Clock, Zap } from 'lucide-react-native';

export default function CheckInScreen() {
  const { tickets, checkInToEvent } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const upcomingTickets = tickets.filter(
    (ticket) =>
      ticket.attendanceStatus === 'upcoming' && ticket.status === 'verified'
  );

  const { generateZkTLSProof, verifyAttendance } = useXIONService();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    const location = await locationService.getCurrentLocation();
    setCurrentLocation(location);
  };

  const handleQuickCheckIn = async (ticket: Ticket) => {
    if (!currentLocation) {
      Alert.alert(
        'Location Required',
        'Please enable location services to check in',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Retry', onPress: getCurrentLocation },
        ]
      );
      return;
    }

    setLoading(true);

    try {
      // Generate zkTLS proof for attendance
      const proofData = await generateZkTLSProof({
        type: 'attendance',
        ticketId: ticket.id,
        location: currentLocation,
        timestamp: new Date().toISOString(),
        eventName: ticket.eventName,
      });

      // Verify attendance on blockchain
      await verifyAttendance({
        ticketId: ticket.id,
        proofData,
        location: currentLocation,
      });

      checkInToEvent(ticket.id, currentLocation);

      Alert.alert(
        'Check-in Successful! ✅',
        `You've been checked in to ${ticket.eventName}. Your attendance is now verified on XION blockchain.`
      );
    } catch (error) {
      console.error('Check-in failed:', error);
      Alert.alert('Error', 'Failed to check in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderTicketItem = ({ item: ticket }: { item: Ticket }) => (
    <Card style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <View style={styles.ticketInfo}>
          <Text style={styles.eventName}>{ticket.eventName}</Text>
          <View style={styles.detailRow}>
            <Clock size={14} color="#6B7280" />
            <Text style={styles.eventDate}>
              {new Date(ticket.eventDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.venue}>{ticket.venue}</Text>
          </View>
        </View>
      </View>

      <Button
        title="Check In Now"
        onPress={() => handleQuickCheckIn(ticket)}
        loading={loading}
        style={styles.checkInButton}
      />
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#8B5CF6', '#3B82F6']} style={styles.header}>
        <Text style={styles.headerTitle}>Check In</Text>
        <Text style={styles.headerSubtitle}>
          Verify your attendance with zkTLS proof
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        {currentLocation && (
          <Card style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <MapPin size={20} color="#10B981" />
              <Text style={styles.locationTitle}>Location Ready</Text>
            </View>
            <Text style={styles.locationText}>
              Lat: {currentLocation.latitude.toFixed(6)}, Lng:{' '}
              {currentLocation.longitude.toFixed(6)}
            </Text>
          </Card>
        )}

        {upcomingTickets.length === 0 ? (
          <View style={styles.emptyState}>
            <Zap size={48} color="#8B5CF6" />
            <Text style={styles.emptyTitle}>No upcoming events</Text>
            <Text style={styles.emptyText}>
              Add verified tickets to check in to events
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>
              Ready to Check In ({upcomingTickets.length})
            </Text>
            <FlatList
              data={upcomingTickets}
              renderItem={renderTicketItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}
      </View>
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
    paddingTop: 20,
  },
  locationCard: {
    marginHorizontal: 16,
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
    borderWidth: 1,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'monospace',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginHorizontal: 16,
    marginVertical: 20,
  },
  ticketCard: {
    marginHorizontal: 16,
  },
  ticketHeader: {
    marginBottom: 16,
  },
  ticketInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
    fontWeight: '500',
  },
  venue: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
    fontWeight: '500',
  },
  checkInButton: {
    backgroundColor: '#10B981',
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
    marginTop: 16,
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
