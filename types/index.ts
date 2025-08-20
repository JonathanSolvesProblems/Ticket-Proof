export interface Ticket {
  id: string;
  eventName: string;
  eventDate: string;
  venue: string;
  ticketType: string;
  qrCode?: string;
  orderId?: string;
  price?: number;
  status: 'verified' | 'unverified';
  attendanceStatus: 'checked-in' | 'upcoming' | 'missed';
  createdAt: string;
  checkedInAt?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface User {
  id: string;
  email: string;
  walletAddress: string;
  tickets: Ticket[];
}

export interface ZkTLSProof {
  proofData: string;
  timestamp: string;
  source: 'gps' | 'qr' | 'external';
  verified: boolean;
}