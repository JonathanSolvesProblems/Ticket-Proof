import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { useXIONService } from '@/services/xionService';
import { Shield, Zap } from 'lucide-react-native';

export function AuthScreen() {
  const { setUser, setLoading } = useAppStore();
  const [email, setEmail] = useState('');
  const [loading, setAuthLoading] = useState(false);
  const { authenticateWithMeta } = useXIONService();

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setAuthLoading(true);
    setLoading(true);

    try {
      // Authenticate with Meta Account via Abstraxion
      const result = await authenticateWithMeta();

      if (result.success) {
        const user = {
          id: Date.now().toString(),
          email: email.trim(),
          walletAddress: result.walletAddress,
          tickets: [],
        };

        setUser(user);
        Alert.alert('Success', 'Logged in successfully with XION wallet!');
      } else {
        Alert.alert('Error', 'Authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      Alert.alert(
        'Error',
        'Failed to authenticate. Please check your connection.'
      );
    } finally {
      setAuthLoading(false);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#3B82F6', '#06B6D4']}
        style={styles.background}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Shield size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.appName}>TicketProof</Text>
            <Text style={styles.tagline}>
              Blockchain-verified event attendance
            </Text>
          </View>

          <Card style={styles.loginCard}>
            <Text style={styles.loginTitle}>Welcome Back</Text>
            <Text style={styles.loginSubtitle}>
              Sign in with your Meta Account to access XION blockchain
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <Button
              title="Connect with Meta Account"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />

            <View style={styles.features}>
              <View style={styles.featureItem}>
                <Zap size={16} color="#8B5CF6" />
                <Text style={styles.featureText}>zkTLS Verification</Text>
              </View>
              <View style={styles.featureItem}>
                <Shield size={16} color="#8B5CF6" />
                <Text style={styles.featureText}>XION Blockchain</Text>
              </View>
            </View>
          </Card>

          <Text style={styles.disclaimer}>
            Powered by XION's Mobile Developer Kit
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  loginCard: {
    marginBottom: 30,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  loginSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#111827',
  },
  loginButton: {
    marginBottom: 20,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    fontWeight: '500',
  },
  disclaimer: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontWeight: '500',
  },
});
