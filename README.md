# TicketProof - XION Blockchain Event Verification

A React Native Expo app that enables users to buy, store, and prove ownership of event tickets with blockchain-verified attendance using XION's Mobile Developer Kit.

## Features

🎫 **Ticket Management**
- Claim tickets via QR scan, barcode, or order ID
- Store tickets securely with User Map smart contracts
- Verify ticket ownership with zkTLS proofs

🔐 **Authentication**
- Meta Account login via Abstraxion SDK
- Wallet-based identity management
- Secure blockchain integration

📍 **Attendance Verification**
- GPS-based location verification
- QR code scanning at events
- zkTLS proofs for tamper-proof attendance records

⚡ **Blockchain Integration**
- XION Testnet smart contracts
- User Map for per-user ticket storage
- Treasury Contract for fee management

## Quick Start

### Prerequisites

- Node.js 18+ 
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (macOS) or Android Emulator

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Setup environment variables:**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your XION contract addresses and endpoints.

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Run on device/simulator:**
   ```bash
   # iOS Simulator
   npx expo run:ios
   
   # Android Emulator  
   npx expo run:android
   ```

### Environment Configuration

The app requires the following environment variables:

- `EXPO_PUBLIC_USER_MAP_CONTRACT_ADDRESS` - XION User Map contract
- `EXPO_PUBLIC_TREASURY_CONTRACT_ADDRESS` - XION Treasury contract  
- `EXPO_PUBLIC_RPC_ENDPOINT` - XION RPC endpoint
- `EXPO_PUBLIC_REST_ENDPOINT` - XION REST API endpoint
- `EXPO_PUBLIC_META_CLIENT_ID` - Meta Account client ID

## Architecture

### Tech Stack

- **Frontend**: React Native with Expo
- **State Management**: Zustand
- **Authentication**: Abstraxion SDK (Meta Account)
- **Blockchain**: XION Testnet
- **Verification**: zkTLS proofs
- **Storage**: AsyncStorage + User Map contracts

### Project Structure

```
├── app/
│   ├── (tabs)/           # Main app tabs
│   └── _layout.tsx       # Root layout with auth
├── components/
│   ├── ui/               # Reusable UI components
│   ├── TicketCard.tsx    # Ticket display component
│   └── AuthScreen.tsx    # Authentication interface
├── services/
│   ├── xionService.ts    # XION blockchain integration
│   └── locationService.ts # GPS/location utilities
├── store/
│   └── useAppStore.ts    # Zustand state management
└── types/
    └── index.ts          # TypeScript definitions
```

## Core Functionality

### 1. Authentication Flow

- Users log in with Meta Account email
- Abstraxion SDK generates XION wallet
- User data stored in User Map contract

### 2. Ticket Claiming

- Upload proof (QR, barcode, order ID)
- zkTLS verification of ticket ownership
- Store verified tickets on-chain

### 3. Attendance Verification

- GPS location verification at event
- Generate zkTLS proof of attendance  
- Anchor proof to XION blockchain
- Update attendance status

### 4. Dashboard & Profile

- View all tickets with verification status
- Track attendance history
- Manage wallet and security settings

## Testing & Development

The app includes mock implementations for testing:

- **Mock XION Service**: Simulates blockchain interactions
- **Mock zkTLS**: Generates test proofs
- **Sample Data**: Pre-populated test tickets

### Running Tests

```bash
npm run test
```

### Building for Production

```bash
# Web build
npm run build:web

# Native builds (requires Expo CLI)
npx eas build --platform ios
npx eas build --platform android
```

## Integration with XION

This app is built on XION's Mobile Developer Kit:

- **Abstraxion SDK**: Meta Account authentication
- **User Map Contracts**: Per-user data storage
- **Treasury Contracts**: Fee management
- **zkTLS Integration**: Tamper-proof verification

## Security Features

- **zkTLS Proofs**: Cryptographic proof of data integrity
- **Blockchain Anchoring**: Immutable attendance records
- **Location Verification**: GPS-based event attendance
- **Wallet Security**: Non-custodial user control

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For technical support:
- XION Documentation: [docs.xion.burnt.com](https://docs.xion.burnt.com)
- Issue Tracker: GitHub Issues
- Community: XION Discord

---

Built with ❤️ using XION's Mobile Developer Kit