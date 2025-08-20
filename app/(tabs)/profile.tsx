import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { User, Wallet, Shield, ChartBar as BarChart3, LogOut } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, tickets, logout } = useAppStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout, style: 'destructive' },
      ]
    );
  };

  const getStats = () => {
    const totalTickets = tickets.length;
    const verifiedTickets = tickets.filter(t => t.status === 'verified').length;
    const checkedInTickets = tickets.filter(t => t.attendanceStatus === 'checked-in').length;
    
    return { totalTickets, verifiedTickets, checkedInTickets };
  };

  const { totalTickets, verifiedTickets, checkedInTickets } = getStats();

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <User size={48} color="#8B5CF6" />
          <Text style={styles.emptyTitle}>Not logged in</Text>
          <Text style={styles.emptyText}>Please log in to view your profile</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#3B82F6']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSubtitle}>Your XION wallet & activity</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <User size={32} color="#8B5CF6" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user.email}</Text>
              <Text style={styles.userRole}>XION User</Text>
            </View>
          </View>

          <View style={styles.walletSection}>
            <View style={styles.walletHeader}>
              <Wallet size={20} color="#374151" />
              <Text style={styles.walletTitle}>Wallet Address</Text>
            </View>
            <Text style={styles.walletAddress} numberOfLines={1} ellipsizeMode="middle">
              {user.walletAddress}
            </Text>
          </View>
        </Card>

        <Card style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <BarChart3 size={20} color="#374151" />
            <Text style={styles.statsTitle}>Activity Stats</Text>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalTickets}</Text>
              <Text style={styles.statLabel}>Total Tickets</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{verifiedTickets}</Text>
              <Text style={styles.statLabel}>Verified</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{checkedInTickets}</Text>
              <Text style={styles.statLabel}>Attended</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.securityCard}>
          <View style={styles.securityHeader}>
            <Shield size={20} color="#10B981" />
            <Text style={styles.securityTitle}>Security Features</Text>
          </View>
          
          <View style={styles.securityItem}>
            <Text style={styles.securityLabel}>zkTLS Verification</Text>
            <Text style={styles.securityStatus}>✅ Active</Text>
          </View>
          
          <View style={styles.securityItem}>
            <Text style={styles.securityLabel}>Blockchain Storage</Text>
            <Text style={styles.securityStatus}>✅ XION Testnet</Text>
          </View>
          
          <View style={styles.securityItem}>
            <Text style={styles.securityLabel}>Location Proofs</Text>
            <Text style={styles.securityStatus}>✅ GPS Enabled</Text>
          </View>
        </Card>

        <View style={styles.actions}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="danger"
            style={styles.logoutButton}
          />
        </View>
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
    paddingTop: 20,
  },
  profileCard: {
    marginHorizontal: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  walletSection: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  walletTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  walletAddress: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'monospace',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statsCard: {
    marginHorizontal: 16,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#8B5CF6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  securityCard: {
    marginHorizontal: 16,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  securityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  securityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  securityLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  securityStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    padding: 16,
    marginTop: 20,
  },
  logoutButton: {
    marginBottom: 40,
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