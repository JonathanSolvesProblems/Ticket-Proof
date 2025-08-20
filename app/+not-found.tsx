import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { TriangleAlert as AlertTriangle } from 'lucide-react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <AlertTriangle size={48} color="#8B5CF6" />
        <Text style={styles.title}>Screen not found</Text>
        <Text style={styles.text}>This screen doesn't exist in TicketProof.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  link: {
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '600',
  },
});