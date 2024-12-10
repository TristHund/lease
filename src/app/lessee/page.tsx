"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Home,
  Calendar,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Building2,
  MessageSquare,
  FileText,
} from "lucide-react";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionSignature,
} from "@solana/web3.js";
import {
  WalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import PhantomWalletButton from "@/components/phantom-wallet-button/PhantomWalletButton";
import { getProvider } from "@/utils/getProvider";
import { circleTransfer } from "@/utils/circle-manual-transfer";
import { useSearchParams } from "next/navigation";
import handleQueryParams from "@/utils/handleQueryParams";

interface PropertyDetails {
  address: string;
  monthlyRent: number;
  leaseStart: string;
  leaseEnd: string;
  landlordName: string;
  preferredChain: string;
  nextPaymentDue: string;
  balance: number;
}

interface PaymentRecord {
  date: string;
  amount: number;
  status: "completed" | "pending" | "upcoming";
  chain: string;
}

interface WalletResponse {
  publicKey: PublicKey;
}

const LesseePortal: React.FC = () => {
  const checkConnection = async (): Promise<void> => {

    const provider = getProvider();
    try {
      const resp = (await provider?.connect()) as WalletResponse;
      console.log(resp.publicKey.toString());
    } catch (error: unknown) {
      console.error("Connection error:", error);
    }
  };

  const sendTransaction = async (): Promise<void> => {
    try {
      const provider = getProvider();
      if (!provider) throw new Error("No provider found");

      const resp = (await provider.connect()) as WalletResponse;
      const sender = resp.publicKey;
      const connection = new Connection(clusterApiUrl("devnet"));

      const transaction = new Transaction();
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: sender,
          toPubkey: sender,
          lamports: 0,
        }),
      );

      transaction.feePayer = sender;
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;

      const usdcTransfer = await circleTransfer();
      console.log("transfer: ", usdcTransfer);

      const { signature } = await provider.signAndSendTransaction(transaction);
      await connection.getSignatureStatus(signature);
    } catch (error) {
      console.error("Transaction error:", error);
    }
  };

  const [activeProperty] = useState<PropertyDetails>({
    address: "123 Crypto Street, Block #1337",
    monthlyRent: 1500,
    leaseStart: "2024-01-01",
    leaseEnd: "2024-12-31",
    landlordName: "Alice Nakamoto",
    preferredChain: "Ethereum",
    nextPaymentDue: "2024-11-01",
    balance: 1,
  });

  const [paymentHistory] = useState<PaymentRecord[]>([
    { date: "2024-10-01", amount: 1500, status: "completed", chain: "Polygon" },
    {
      date: "2024-09-01",
      amount: 1500,
      status: "completed",
      chain: "Ethereum",
    },
    { date: "2024-08-01", amount: 1500, status: "completed", chain: "Solana" },
  ]);

  const getStatusColor = (status: PaymentRecord["status"]): string => {
    const colors = {
      completed: "text-green-600",
      pending: "text-orange-600",
      upcoming: "text-blue-600",
    };
    return colors[status] || "text-gray-600";
  };

  return (
    <ConnectionProvider endpoint={clusterApiUrl("devnet")}>
      <WalletProvider wallets={[new PhantomWalletAdapter()]}>
        <div className="min-h-screen bg-slate-50">
          {/* Navigation */}
          <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <Building2 className="h-6 w-6 text-blue-600 mr-2" />
                  <h1 className="text-xl font-semibold">Lessee Portal</h1>
                </div>
                <div className="flex items-center space-x-4">
                  <PhantomWalletButton />
                </div>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Landlord
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    View Lease
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Landlord
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                View Lease
              </Button>
            </div>
          </div>
        </div>
      </nav>
          {/* Main Content */}
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Property Details Column */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Home className="mr-2 h-5 w-5 text-blue-600" />
                      Current Lease Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">
                          Property Address
                        </p>
                        <p className="font-medium">{activeProperty.address}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Landlord</p>
                        <p className="font-medium">
                          {activeProperty.landlordName}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Lease Period</p>
                        <p className="font-medium">
                          {new Date(
                            activeProperty.leaseStart,
                          ).toLocaleDateString()}{" "}
                          -
                          {new Date(
                            activeProperty.leaseEnd,
                          ).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          via {payment.chain}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment History */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-blue-600" />
                      Payment History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {paymentHistory.map((payment, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <div>
                              <p className="font-medium">
                                ${payment.amount} USDC
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(payment.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-medium ${getStatusColor(payment.status)}`}
                            >
                              {payment.status.charAt(0).toUpperCase() +
                                payment.status.slice(1)}
                            </p>
                            <p className="text-sm text-gray-500">
                              via {payment.chain}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions Column */}
              <div className="space-y-6">
                {/* Next Payment Card */}
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Next Payment Due
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Amount Due</span>
                        <span className="text-2xl font-bold">
                          ${activeProperty.balance}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Due Date</span>
                        <span>
                          {new Date(
                            activeProperty.nextPaymentDue,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <Button
                        onClick={sendTransaction}
                        className="w-full bg-white text-blue-600 hover:bg-blue-50"
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      <span className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        Set Up Auto-Pay
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      <span className="flex items-center">
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Report an Issue
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Payment Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Preferred Chain
                      </label>
                      <select className="w-full p-2 border rounded-md">
                        <option>Ethereum</option>
                        <option>Solana</option>
                        <option>Polygon</option>
                        <option>Avalanche</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Payment Notifications
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">
                          Enable email notifications
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </main>
    </div>
  );
};

export default LesseePortal;
