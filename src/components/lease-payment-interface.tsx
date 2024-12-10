"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  ArrowRight,
  Wallet,
  Check,
  Clock,
  AlertTriangle,
} from "lucide-react";

const LeasePaymentInterface = () => {
  const [formData, setFormData] = useState({
    monthlyRent: "",
    leaseTerm: 12,
    preferredChain: "ethereum",
    telegramUsername: "",
  });

  // Simulate payment status for demonstration
  const paymentStatus = [
    { month: 1, status: "completed", dueDate: "2024-11-01", amount: 1000 },
    { month: 2, status: "due", dueDate: "2024-12-01", amount: 1000 },
    { month: 3, status: "upcoming", dueDate: "2025-01-01", amount: 1000 },
  ];

  const chains = [
    { id: "ethereum", name: "Ethereum", symbol: "ETH" },
    { id: "solana", name: "Solana", symbol: "SOL" },
    { id: "polygon", name: "Polygon", symbol: "MATIC" },
    { id: "avalanche", name: "Avalanche", symbol: "AVAX" },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <Check className="h-5 w-5 text-green-500" />;
      case "due":
        return <Clock className="h-5 w-5 text-orange-500" />;
      case "upcoming":
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "completed":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "due":
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case "upcoming":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return baseClasses;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Lessor Setup Section */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Lease Payment Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Monthly Rent (USDC)</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={formData.monthlyRent}
                onChange={(e) =>
                  setFormData({ ...formData, monthlyRent: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Preferred Chain</label>
              <select
                className="w-full mt-1 p-2 border rounded-md"
                value={formData.preferredChain}
                onChange={(e) =>
                  setFormData({ ...formData, preferredChain: e.target.value })
                }
              >
                {chains.map((chain) => (
                  <option key={chain.id} value={chain.id}>
                    {chain.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Telegram Username Field */}
          <div>
            <label className="text-sm font-medium">Telegram Username</label>
            <div className="mt-1 relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                @
              </span>
              <Input
                type="text"
                placeholder="username"
                value={formData.telegramUsername}
                onChange={(e) =>
                  setFormData({ ...formData, telegramUsername: e.target.value })
                }
                className="pl-8"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-md">
            <AlertCircle className="text-blue-500" />
            <span className="text-sm text-blue-700">
              Payment notifications will be sent to your Telegram account
            </span>
          </div>

          <Button className="w-full">
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet to Continue
          </Button>
        </CardContent>
      </Card>

      {/* Payment Schedule with Status */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <div>
                <p className="text-sm font-medium">Monthly Payment</p>
                <p className="text-2xl font-bold">
                  {formData.monthlyRent || "0"} USDC
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Total Lease Value</p>
                <p className="text-2xl font-bold">
                  {Number(formData.monthlyRent) * 12 || "0"} USDC
                </p>
              </div>
            </div>

            {/* Payment Status Table */}
            <div className="overflow-hidden border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Month
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paymentStatus.map((payment) => (
                    <tr key={payment.month}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Month {payment.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.dueDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.amount} USDC
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(payment.status)}
                          <span className={getStatusBadge(payment.status)}>
                            {payment.status.charAt(0).toUpperCase() +
                              payment.status.slice(1)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeasePaymentInterface;
