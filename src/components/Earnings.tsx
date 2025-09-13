import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import type { Company } from '../App';

interface EarningsProps {
  company: Company | null;
  walletBalance: number;
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'deposit';
  quantity?: number;
  price?: number;
  total?: number;
  amount?: number;
  date: string;
  counterparty?: string;
  status: string;
}

interface EarningsData {
  totalEarnings: number;
  netProfit: number;
  transactionCount: number;
  successRate: number;
  creditsSold: number;
  creditsPurchased: number;
  averageSellPrice: number;
  averageBuyPrice: number;
}

export const Earnings: React.FC<EarningsProps> = ({ company, walletBalance, onNavigate, onLogout }) => {
  const [earnings, setEarnings] = useState<EarningsData>({
    totalEarnings: 0,
    netProfit: 0,
    transactionCount: 0,
    successRate: 0,
    creditsSold: 0,
    creditsPurchased: 0,
    averageSellPrice: 0,
    averageBuyPrice: 0,
  });

  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (company) {
      calculateEarnings();
    }
  }, [company]);

  const calculateEarnings = () => {
    const mockTransactions: Transaction[] = [
      {
        id: 'TXN001',
        type: 'sell',
        quantity: 100,
        price: 25.50,
        total: 2550,
        date: '2024-01-15',
        counterparty: 'Tata Steel',
        status: 'completed'
      },
      {
        id: 'TXN002',
        type: 'sell',
        quantity: 200,
        price: 24.75,
        total: 4950,
        date: '2024-01-10',
        counterparty: 'Reliance Industries',
        status: 'completed'
      },
      {
        id: 'TXN003',
        type: 'sell',
        quantity: 150,
        price: 26.00,
        total: 3900,
        date: '2024-01-08',
        counterparty: 'Adani Power',
        status: 'completed'
      }
    ];

    setRecentTransactions(mockTransactions);

    const sellTransactions = mockTransactions.filter(t => t.type === 'sell');
    const buyTransactions = mockTransactions.filter(t => t.type === 'buy');

    const totalSales = sellTransactions.reduce((sum, t) => sum + (t.total || 0), 0);
    const totalPurchases = buyTransactions.reduce((sum, t) => sum + (t.total || 0), 0);
    const totalCreditsSold = sellTransactions.reduce((sum, t) => sum + (t.quantity || 0), 0);
    const totalCreditsPurchased = buyTransactions.reduce((sum, t) => sum + (t.quantity || 0), 0);

    const avgSellPrice = totalCreditsSold > 0 ? totalSales / totalCreditsSold : 0;
    const avgBuyPrice = totalCreditsPurchased > 0 ? totalPurchases / totalCreditsPurchased : 0;

    setEarnings({
      totalEarnings: totalSales,
      netProfit: totalSales - totalPurchases,
      transactionCount: mockTransactions.length,
      successRate: 100,
      creditsSold: totalCreditsSold,
      creditsPurchased: totalCreditsPurchased,
      averageSellPrice: avgSellPrice,
      averageBuyPrice: avgBuyPrice,
    });
  };

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;

  if (!company) {
    return <div>Please log in to view earnings</div>;
  }

  return (
    <div className="min-h-screen">
      <Navbar 
        company={company} 
        currentPage="earnings" 
        onNavigate={onNavigate || (() => {})} 
        onLogout={onLogout || (() => {})}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-6 w-6" style={{ color: company.primaryColor }} />
          <h1 className="text-2xl font-bold text-gray-900">My Earnings</h1>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          Last updated: {new Date().toLocaleDateString()}
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(earnings.totalEarnings)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Net Profit</p>
                <p className={`text-2xl font-bold ${
                  earnings.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(earnings.netProfit)}
                </p>
              </div>
              <DollarSign className={`h-8 w-8 ${
                earnings.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
              }`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Credits Sold</p>
                <p className="text-2xl font-bold text-blue-600">
                  {earnings.creditsSold.toLocaleString()}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg. Sell Price</p>
                <p className="text-2xl font-bold text-orange-600">
                  ₹{earnings.averageSellPrice.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Recent Sales
            </div>
            <Badge variant="outline">
              {recentTransactions.filter(t => t.type === 'sell').length} transactions
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentTransactions.filter(t => t.type === 'sell').length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No recent sales</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTransactions
                .filter(transaction => transaction.type === 'sell')
                .map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-green-100 rounded-full">
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          Sold {transaction.quantity} credits to {transaction.counterparty}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {transaction.date}
                          </span>
                          <span>₹{transaction.price}/credit</span>
                          <Badge variant="outline" className="text-xs">
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-green-600">
                        +{formatCurrency(transaction.total || 0)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
        </div>
      </main>
    </div>
  );
};