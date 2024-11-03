import { useState } from "react";

interface PhantomWindow extends Window {
  solana?: {
    isPhantom?: boolean;
    connect: () => Promise<{ publicKey: { toString: () => string } }>;
    disconnect: () => Promise<void>;
    signTransaction: (transaction: any) => Promise<any>;
    signAndSendTransaction: (
      transaction: any
    ) => Promise<{ signature: string }>;
  };
}

declare const window: PhantomWindow;

const PhantomPayButton = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [signature, setSignature] = useState<string>("");
  const [error, setError] = useState<string>("");

  const createEmptyTransaction = async () => {
    if (!window.solana || !window.solana.isPhantom) {
      setError("Phantom wallet not found! Please install Phantom wallet.");
      return;
    }

    try {
      setIsProcessing(true);
      setError("");

      // First ensure wallet is connected
      if (!window.solana.isConnected) {
        await window.solana.connect();
      }

      // Create an empty transaction (just for signature)
      const transaction = {
        feePayer: window.solana.publicKey,
        recentBlockhash: "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGg", // This is just a placeholder
        instructions: [], // Empty instructions
      };

      // Request signature
      const result = await window.solana.signAndSendTransaction(transaction);
      setSignature(result.signature);
      console.log("Transaction signed with signature:", result.signature);
    } catch (err) {
      console.error("Transaction failed:", err);
      setError(err.message || "Transaction failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={createEmptyTransaction}
        disabled={isProcessing}
        className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 
                   transition-colors disabled:bg-gray-400 font-medium"
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {signature && (
        <div className="text-sm text-gray-600">
          <p>Transaction Signature:</p>
          <p className="font-mono break-all">{signature}</p>
        </div>
      )}
    </div>
  );
};

export default PhantomPayButton;
