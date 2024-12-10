import { PhantomProvider } from "@/types/phantom";

export interface WalletProvider {
	isPhantom?: boolean;
	connect: () => Promise<{ publicKey: string }>;
	disconnect: () => Promise<void>;
	signAndSendTransaction: (
		transaction: unknown,
	) => Promise<{ signature: string }>;
}

export const getProvider = (): WalletProvider | null => {
	if (typeof window !== "undefined") {
		const provider = (window as Window & { solana?: PhantomProvider }).solana;

		if (provider?.isPhantom) {
			return provider as WalletProvider;
		}
	}

	return null;
};

export default getProvider;
