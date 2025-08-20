import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Ticket } from '@/types';
import { MapPin, Calendar, Clock } from 'lucide-react-native';

interface TicketCardProps {
  ticket: Ticket;
  onCheckIn?: (ticketId: string) => void;
  onPress?: () => void;
}

export function TicketCard({ ticket, onCheckIn, onPress }: TicketCardProps) {
  const isEventPast = new Date(ticket.eventDate) < new Date();
  const canCheckIn = ticket.status === 'verified' && 
                     ticket.attendanceStatus === 'upcoming' && 
                     !isEventPast;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.eventName}>{ticket.eventName}</Text>
            <Text style={styles.ticketType}>{ticket.ticketType}</Text>
          </View>
          <StatusBadge status={ticket.status} type="verification" />
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Calendar size={16} color="#6B7280" />
            <Text style={styles.detailText}>{formatDate(ticket.eventDate)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <MapPin size={16} color="#6B7280" />
            <Text style={styles.detailText}>{ticket.venue}</Text>
          </View>

          {ticket.checkedInAt && (
            <View style={styles.detailRow}>
              <Clock size={16} color="#6B7280" />
              <Text style={styles.detailText}>
                Checked in: {formatDate(ticket.checkedInAt)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <StatusBadge status={ticket.attendanceStatus} type="attendance" />
          
          {canCheckIn && onCheckIn && (
            <Button
              title="Check In"
              onPress={() => onCheckIn(ticket.id)}
              size="small"
              style={styles.checkInButton}
            />
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  eventName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  ticketType: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  details: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkInButton: {
    minWidth: 80,
  },
});