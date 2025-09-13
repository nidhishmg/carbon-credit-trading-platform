import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  X
} from 'lucide-react';
import type { Company } from '../App';

interface MyEarningsProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company | null;
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

export const MyEarnings: React.FC<MyEarningsProps> = ({ 
  isOpen, 
  onClose, 
  company 
}) => {
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
    // Mock earnings calculation
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
        type: 'buy',
        quantity: 150,
        price: 26.00,
        total: 3900,
        date: '2024-01-08',
        counterparty: 'Adani Power',
        status: 'completed'
      }
    ];

    setRecentTransactions(mockTransactions);

    // Calculate metrics
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

  return (
    <div>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Side Panel */}
      <div 
        className={`fixed right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 z-50 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <h2 className="text-lg font-semibold">My Earnings</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Overview Card */}
          <Card className="mb-6 border-l-4 border-l-green-500">
            <CardContent className="p-4">
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

          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-3">
                <div className="text-center">
                  <p className="text-xs text-gray-600">Net Profit</p>
                  <p className={`text-lg font-semibold ${
                    earnings.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(earnings.netProfit)}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3">
                <div className="text-center">
                  <p className="text-xs text-gray-600">Transactions</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {earnings.transactionCount}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3">
                <div className="text-center">
                  <p className="text-xs text-gray-600">Credits Sold</p>
                  <p className="text-lg font-semibold text-purple-600">
                    {earnings.creditsSold.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3">
                <div className="text-center">
                  <p className="text-xs text-gray-600">Avg. Sell Price</p>
                  <p className="text-lg font-semibold text-orange-600">
                    ₹{earnings.averageSellPrice.toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-semibold flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Recent Sales
              </h3>
              <Badge variant="secondary">
                {recentTransactions.filter(t => t.type === 'sell').length} sales
              </Badge>
            </div>

            {recentTransactions.filter(t => t.type === 'sell').length === 0 ? (
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-gray-500">No recent sales</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {recentTransactions
                  .filter(transaction => transaction.type === 'sell')
                  .map((transaction) => (
                    <Card key={transaction.id} className="border-l-4 border-l-green-500">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <ArrowUpRight className="h-4 w-4 text-green-600" />
                              <span className="font-medium text-sm">
                                Sold {transaction.quantity} credits
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {transaction.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">
                              To: {transaction.counterparty}
                            </p>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {transaction.date}
                              </span>
                              <span className="text-xs">₹{transaction.price}/credit</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-green-600">
                              +{formatCurrency(transaction.total || 0)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};