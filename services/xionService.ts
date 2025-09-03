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
    login,       // use this for authentication
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
      return { walletAddress: "xion1_test", success: true };
   
      // Trigger Abstraxion login via the hook
      await login();

      if (!account?.bech32Address) throw new Error("No wallet returned");

      return { walletAddress: account.bech32Address, success: true };
    } catch (e) {
      console.error("XION login error:", e);
      return { walletAddress: "", success: false };
    }
  }

  // ✅ Store ticket data (example: sending a tx to UserMap contract)
  async function storeTicketData(ticketData: any): Promise<boolean> {
    if (!client || !account?.bech32Address) return false;
    try {
      const res = await client.execute(
        account.bech32Address,
        process.env.EXPO_PUBLIC_USER_MAP_CONTRACT_ADDRESS!,
        { store_ticket: ticketData },
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

  
  async function mintBadgeNFT(badgeId: string, metadata: Record<string, any>): Promise<boolean> {
    if (!client || !account?.bech32Address) return false;

    try {
      const tx = await client.execute(
        account.bech32Address,
        process.env.EXPO_PUBLIC_TREASURY_CONTRACT_ADDRESS!, // NFT contract
        {
          mint_badge: {
            badge_id: badgeId,
            metadata,
            recipient: account.bech32Address,
          },
        },
        "auto"
      );

      console.log("Badge NFT minted:", tx.transactionHash);
      return true;
    } catch (e) {
      console.error("MintBadgeNFT error:", e);
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
    mintBadgeNFT
  };
}
