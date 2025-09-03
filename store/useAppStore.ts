import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ticket, User, ZkTLSProof } from '@/types';
import { useXIONService } from '@/services/xionService';

interface Badge {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

interface AppState {
  user: User | null;
  tickets: Ticket[];
  badges: Badge[];
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User) => void;
  logout: () => void;
  addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt'>) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  checkInToEvent: (ticketId: string, location?: { latitude: number; longitude: number }) => void;
  setLoading: (loading: boolean) => void;
  initializeStore: () => Promise<void>;
  checkAndGrantBadges: () => void;
}

const defaultBadges: Badge[] = [
  {
    id: 'first-checkin',
    title: 'First Check-In!',
    description: 'Awarded for attending your first event.',
    unlocked: false,
  },
  {
    id: 'event-collector',
    title: 'Event Collector',
    description: 'Attend 5 events to unlock.',
    unlocked: false,
  },
  {
    id: 'verified-pro',
    title: 'Verified Pro',
    description: 'Verify 5 tickets to unlock.',
    unlocked: false,
  },
];

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  tickets: [],
  badges: defaultBadges,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user: User) => {
    set({ user, isAuthenticated: true });
    AsyncStorage.setItem('user', JSON.stringify(user));
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, tickets: [], badges: defaultBadges });
    AsyncStorage.multiRemove(['user', 'tickets', 'badges']);
  },

  addTicket: (ticketData) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const updatedTickets = [...get().tickets, newTicket];
    set({ tickets: updatedTickets });
    AsyncStorage.setItem('tickets', JSON.stringify(updatedTickets));

    console.log('Updating User Map with new ticket:', newTicket);

    // re-check badges
    get().checkAndGrantBadges();
  },

  updateTicket: (id, updates) => {
    const updatedTickets = get().tickets.map(ticket =>
      ticket.id === id ? { ...ticket, ...updates } : ticket
    );
    set({ tickets: updatedTickets });
    AsyncStorage.setItem('tickets', JSON.stringify(updatedTickets));

    get().checkAndGrantBadges();
  },

  checkInToEvent: async (ticketId, location) => {
    const { updateTicket } = get();
    updateTicket(ticketId, {
      attendanceStatus: 'checked-in',
      checkedInAt: new Date().toISOString(),
      location,
    });

    const proof: ZkTLSProof = {
      proofData: `zkproof_${Date.now()}`,
      timestamp: new Date().toISOString(),
      source: location ? 'gps' : 'qr',
      verified: true,
    };

    console.log('Generated zkTLS proof for check-in:', proof);

    // Mint NFT badge for first-time check-in
    const { mintBadgeNFT } = useXIONService();
    const badges = get().badges;

    if (!badges.find(b => b.id === "first-check-in")) {
      const success = await mintBadgeNFT("first-check-in", {
        name: "First Check-In Badge",
        description: "Awarded for attending your first event",
        image: "https://cdn.example.com/badges/first-checkin.png",
        proof: proof.proofData,
        date: proof.timestamp,
      });

      if (success) {
        set({
          badges: [...badges, {
            id: "first-check-in",
            title: "First Check-In!",
            description: "You earned this badge for attending your first event.",
            unlocked: true,
          }],
        });
      }
    }
  },

  checkAndGrantBadges: () => {
    const { tickets, badges } = get();

    const verifiedTickets = tickets.filter(t => t.status === 'verified').length;
    const checkedInTickets = tickets.filter(t => t.attendanceStatus === 'checked-in').length;

    const updatedBadges = badges.map(badge => {
      if (badge.id === 'first-checkin' && checkedInTickets >= 1) {
        return { ...badge, unlocked: true };
      }
      if (badge.id === 'event-collector' && checkedInTickets >= 5) {
        return { ...badge, unlocked: true };
      }
      if (badge.id === 'verified-pro' && verifiedTickets >= 5) {
        return { ...badge, unlocked: true };
      }
      return badge;
    });

    set({ badges: updatedBadges });
    AsyncStorage.setItem('badges', JSON.stringify(updatedBadges));
  },

  setLoading: (loading) => set({ isLoading: loading }),

  initializeStore: async () => {
    try {
      const [userData, ticketsData, badgesData] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('tickets'),
        AsyncStorage.getItem('badges'),
      ]);

      if (userData) {
        const user = JSON.parse(userData);
        set({ user, isAuthenticated: true });
      }

      if (ticketsData) {
        const tickets = JSON.parse(ticketsData);
        set({ tickets });
      }

      if (badgesData) {
        set({ badges: JSON.parse(badgesData) });
      }
    } catch (error) {
      console.error('Failed to initialize store:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
