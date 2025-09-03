import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Award, Share2 } from 'lucide-react-native';

export default function BadgesScreen() {
  const handleShare = async () => {
    try {
      await Share.share({
        message: 'I just unlocked my NFT Event Badge on XION! 🚀 #XIONProof',
      });
    } catch (error) {
      console.log('Error sharing badge:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#8B5CF6', '#3B82F6']} style={styles.header}>
        <Text style={styles.headerTitle}>Badges</Text>
        <Text style={styles.headerSubtitle}>Your NFT event achievements</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <Card style={styles.badgeCard}>
          <View style={styles.badgeIcon}>
            <Award size={48} color="#8B5CF6" />
          </View>
          <Text style={styles.badgeTitle}>First Check-In!</Text>
          <Text style={styles.badgeDescription}>
            You earned this badge for attending your first event.
          </Text>

          <Button
            title="Share Badge"
            icon={<Share2 size={18} color="#fff" />}
            onPress={handleShare}
            style={styles.shareButton}
          />
        </Card>

        {/* Add more badges here */}
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
  badgeCard: {
    marginHorizontal: 16,
    alignItems: 'center',
    paddingVertical: 24,
  },
  badgeIcon: {
    marginBottom: 12,
  },
  badgeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  badgeDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  shareButton: {
    marginTop: 12,
  },
});
