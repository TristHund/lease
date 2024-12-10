"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Home, Key, ArrowRight } from "lucide-react";

const WelcomePage = () => {
  const router = useRouter();
  const [walletConnected, setWalletConnected] = useState(false);
  const [selectedChain, setSelectedChain] = useState("");
  const [selectedChainName, setSelectedChainName] = useState("");

  const chains = [
    { id: "ethereum", name: "Ethereum", icon: "⟠" },
    { id: "solana", name: "Solana", icon: "◎" },
    { id: "avalanche", name: "Avalanche", icon: "𝗔" },
    { id: "polygon", name: "Polygon", icon: "⬡" },
  ];

  const handleWalletConnect = (chainId: string, chainName: string) => {
    setSelectedChain(chainId);
    setSelectedChainName(chainName);
    // Here you would implement actual wallet connection logic
    setWalletConnected(true);
  };

  const navigateToPortal = (portalType: string) => {
    router.push(`/${portalType}?chain=${selectedChainName}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome to CRCT</CardTitle>
          <p className="text-slate-600 mt-2">
            Streamlined Crypto Lease Management
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Wallet Connection Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">1. Choose your network</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {chains.map((chain) => (
                <Button
                  key={chain.id}
                  variant={selectedChain === chain.id ? "default" : "outline"}
                  className="h-24 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleWalletConnect(chain.id, chain.name)}
                >
                  <span className="text-2xl">{chain.icon}</span>
                  <span className="text-sm">{chain.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Portal Selection Section */}
          {walletConnected && (
            <div className="space-y-4 animate-in fade-in-50">
              <h3 className="text-lg font-semibold">2. Select Portal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-32 flex flex-col items-center justify-center space-y-2"
                  onClick={() => navigateToPortal("lessor")}
                >
                  <Key className="h-8 w-8" />
                  <span>Lessor Portal</span>
                  <span className="text-sm text-slate-500">
                    I want to manage my properties
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="h-32 flex flex-col items-center justify-center space-y-2"
                  onClick={() => navigateToPortal("lessee")}
                >
                  <Home className="h-8 w-8" />
                  <span>Lessee Portal</span>
                  <span className="text-sm text-slate-500">
                    I want to manage my lease payments
                  </span>
                </Button>
              </div>
            </div>
          )}

          {/* Status Bar */}
          <div className="mt-6 p-4 rounded-lg bg-slate-50">
            <div className="flex items-center space-x-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  walletConnected ? "bg-green-500" : "bg-slate-300"
                }`}
              />
              <span className="text-sm">
                {walletConnected
                  ? `Connected to ${
                      chains.find((c) => c.id === selectedChain)?.name
                    }`
                  : "Please connect your wallet"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomePage;
