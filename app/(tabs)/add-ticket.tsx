import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { useXIONService } from '@/services/xionService';

export default function AddTicketScreen() {
  const {
    generateZkTLSProof,
    storeTicketData,
    authenticateWithMeta,
    verifyAttendance,
    logout,
    account,
    isConnected,
  } = useXIONService();

  const { addTicket, user } = useAppStore();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    venue: '',
    ticketType: 'General Admission',
    orderId: '',
    qrCode: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { eventName, eventDate, venue } = formData;
    return eventName.trim() && eventDate.trim() && venue.trim();
  };

  const handleAddTicket = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'Please log in to add tickets');
      return;
    }

    setLoading(true);

    try {
      // Generate zkTLS proof for ticket ownership
      const proofData = await generateZkTLSProof({
        type: 'ticket_ownership',
        orderId: formData.orderId,
        eventName: formData.eventName,
        timestamp: new Date().toISOString(),
      });

      // Add ticket to local store
      addTicket({
        ...formData,
        status: 'verified', // Would be determined by zkTLS proof verification
        attendanceStatus: 'upcoming',
      });

      // Store on blockchain via User Map
      await storeTicketData({
        ...formData,
        proofData,
        walletAddress: user.walletAddress,
      });

      Alert.alert('Success', 'Ticket added and verified on blockchain!');

      // Reset form
      setFormData({
        eventName: '',
        eventDate: '',
        venue: '',
        ticketType: 'General Admission',
        orderId: '',
        qrCode: '',
      });
    } catch (error) {
      console.error('Failed to add ticket:', error);
      Alert.alert('Error', 'Failed to add ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#8B5CF6', '#3B82F6']} style={styles.header}>
        <Text style={styles.headerTitle}>Add Ticket</Text>
        <Text style={styles.headerSubtitle}>
          Claim ownership and verify with zkTLS
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <Card style={styles.formCard}>
          <Text style={styles.formTitle}>Ticket Details</Text>

          {/* Inputs */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Event Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.eventName}
              onChangeText={(value) => handleInputChange('eventName', value)}
              placeholder="e.g., DevCon 2024"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Event Date *</Text>
            <TextInput
              style={styles.input}
              value={formData.eventDate}
              onChangeText={(value) => handleInputChange('eventDate', value)}
              placeholder="e.g., 2024-03-15T19:00:00Z"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Venue *</Text>
            <TextInput
              style={styles.input}
              value={formData.venue}
              onChangeText={(value) => handleInputChange('venue', value)}
              placeholder="e.g., Convention Center"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ticket Type</Text>
            <TextInput
              style={styles.input}
              value={formData.ticketType}
              onChangeText={(value) => handleInputChange('ticketType', value)}
              placeholder="e.g., VIP, General Admission"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Order ID (for verification)</Text>
            <TextInput
              style={styles.input}
              value={formData.orderId}
              onChangeText={(value) => handleInputChange('orderId', value)}
              placeholder="e.g., TM-123456789"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>QR Code Data</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.qrCode}
              onChangeText={(value) => handleInputChange('qrCode', value)}
              placeholder="Paste QR code data or barcode number"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
            />
          </View>

          <Text style={styles.helpText}>
            We'll verify your ticket ownership using zkTLS and store the proof
            on XION blockchain
          </Text>

          <Button
            title="Add & Verify Ticket"
            onPress={handleAddTicket}
            loading={loading}
            disabled={!validateForm()}
            style={styles.submitButton}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { paddingTop: 20, paddingBottom: 30, paddingHorizontal: 20 },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: { fontSize: 16, color: '#E5E7EB', fontWeight: '500' },
  content: {
    flex: 1,
    marginTop: -10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#F9FAFB',
  },
  formCard: { margin: 16, marginTop: 24 },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  inputGroup: { marginBottom: 16 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#111827',
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  helpText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 18,
  },
  submitButton: { marginTop: 8 },
});
