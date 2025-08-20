// Abstraction layer for XION / Abstraxion SDK
import {
  useAbstraxionAccount,
  useAbstraxionSigningClient,
} from "@burnt-labs/abstraxion-react-native";

/**
 * Hook-based service wrapper for Abstraxion.
 * Your components can import this instead of directly using the SDK.
 */
export function useXIONService() {
  const {
    data: account,
    login,
    logout,
    isConnected,
    isConnecting,
  } = useAbstraxionAccount();

  const { client, signArb } = useAbstraxionSigningClient();

  // ✅ Authentication
  async function authenticateWithMeta(): Promise<{
    walletAddress: string;
    success: boolean;
  }> {
    try {
      await login(); // Triggers Abstraxion login flow
      if (!account?.bech32Address) throw new Error("No wallet returned");
      return { walletAddress: account.bech32Address, success: true };
    } catch (e) {
      console.error("XION login error:", e);
      return { walletAddress: "", success: false };
    }
  }

  // ✅ Store ticket data (example: sending a tx to your UserMap contract)
  async function storeTicketData(ticketData: any): Promise<boolean> {
    if (!client || !account?.bech32Address) return false;
    try {
      const res = await client.execute(
        account.bech32Address,
        process.env.EXPO_PUBLIC_USER_MAP_CONTRACT_ADDRESS!,
        { store_ticket: ticketData }, // <-- adapt to your contract schema
        "auto"
      );
      console.log("Ticket stored:", res.transactionHash);
      return true;
    } catch (e) {
      console.error("StoreTicketData error:", e);
      return false;
    }
  }

  // ✅ Verify attendance (example: contract call)
  async function verifyAttendance(proofData: any): Promise<boolean> {
    if (!client || !account?.bech32Address) return false;
    try {
      const res = await client.execute(
        account.bech32Address,
        process.env.EXPO_PUBLIC_TREASURY_CONTRACT_ADDRESS!,
        { verify_attendance: proofData },
        "auto"
      );
      console.log("Attendance verified:", res.transactionHash);
      return true;
    } catch (e) {
      console.error("VerifyAttendance error:", e);
      return false;
    }
  }

  // ✅ Generate zkTLS proof (accepts object or string)
  async function generateZkTLSProof(
    data: string | Record<string, any>
  ): Promise<string> {
    if (!signArb || !client?.granteeAddress) {
      throw new Error("No signer available");
    }

    // Auto stringify objects before signing
    const message = typeof data === "string" ? data : JSON.stringify(data);

    const response = await signArb(client.granteeAddress, message);
    return response || "";
  }

  return {
    account,
    isConnected,
    isConnecting,
    authenticateWithMeta,
    logout,
    storeTicketData,
    verifyAttendance,
    generateZkTLSProof,
  };
}
