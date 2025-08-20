import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ticket, User, ZkTLSProof } from '@/types';

interface AppState {
  user: User | null;
  tickets: Ticket[];
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
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  tickets: [],
  isAuthenticated: false,
  isLoading: true,

  setUser: (user: User) => {
    set({ user, isAuthenticated: true });
    AsyncStorage.setItem('user', JSON.stringify(user));
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, tickets: [] });
    AsyncStorage.multiRemove(['user', 'tickets']);
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
    
    // Update user map on blockchain (mocked for now)
    console.log('Updating User Map with new ticket:', newTicket);
  },

  updateTicket: (id, updates) => {
    const updatedTickets = get().tickets.map(ticket =>
      ticket.id === id ? { ...ticket, ...updates } : ticket
    );
    set({ tickets: updatedTickets });
    AsyncStorage.setItem('tickets', JSON.stringify(updatedTickets));
  },

  checkInToEvent: (ticketId, location) => {
    const { updateTicket } = get();
    updateTicket(ticketId, {
      attendanceStatus: 'checked-in',
      checkedInAt: new Date().toISOString(),
      location,
    });
    
    // Mock zkTLS proof generation
    const proof: ZkTLSProof = {
      proofData: `zkproof_${Date.now()}`,
      timestamp: new Date().toISOString(),
      source: location ? 'gps' : 'qr',
      verified: true,
    };
    
    console.log('Generated zkTLS proof for check-in:', proof);
  },

  setLoading: (loading) => set({ isLoading: loading }),

  initializeStore: async () => {
    try {
      const [userData, ticketsData] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('tickets')
      ]);
      
      if (userData) {
        const user = JSON.parse(userData);
        set({ user, isAuthenticated: true });
      }
      
      if (ticketsData) {
        const tickets = JSON.parse(ticketsData);
        set({ tickets });
      }
    } catch (error) {
      console.error('Failed to initialize store:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));