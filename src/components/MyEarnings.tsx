import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Card, CardContent } from './ui/card';
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
  method?: string;
  status: string;
}

interface EarningsSummary {
  totalEarnings: number;
  totalSales: number;
  totalPurchases: number;
  netProfit: number;
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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [earnings, setEarnings] = useState<EarningsSummary>({
    totalEarnings: 0,
    totalSales: 0,
    totalPurchases: 0,
    netProfit: 0,
    creditsSold: 0,
    creditsPurchased: 0,
    averageSellPrice: 0,
    averageBuyPrice: 0
  });

  useEffect(() => {
    if (!company || !isOpen) return;
    
    // Load user's transaction data from network
    const networkData = localStorage.getItem('carbonx_network');
    if (networkData) {
      const data = JSON.parse(networkData);
      const userTransactions = data.globalTransactions?.filter((tx: any) => 
        tx.userId === company.id
      ) || [];
      
      setTransactions(userTransactions);
      calculateEarnings(userTransactions);
    }
  }, [company, isOpen]);

  const calculateEarnings = (txList: Transaction[]) => {
    let totalSales = 0;
    let totalPurchases = 0;
    let creditsSold = 0;
    let creditsPurchased = 0;
    let sellPriceSum = 0;
    let buyPriceSum = 0;
    let sellCount = 0;
    let buyCount = 0;

    txList.forEach(tx => {
      if (tx.type === 'sell' && tx.total && tx.quantity) {
        totalSales += tx.total;
        creditsSold += tx.quantity;
        sellPriceSum += tx.price || 0;
        sellCount++;
      } else if (tx.type === 'buy' && tx.total && tx.quantity) {
        totalPurchases += tx.total;
        creditsPurchased += tx.quantity;
        buyPriceSum += tx.price || 0;
        buyCount++;
      }
    });

    setEarnings({
      totalEarnings: totalSales,
      totalSales,
      totalPurchases,
      netProfit: totalSales - totalPurchases,
      creditsSold,
      creditsPurchased,
      averageSellPrice: sellCount > 0 ? sellPriceSum / sellCount : 0,
      averageBuyPrice: buyCount > 0 ? buyPriceSum / buyCount : 0
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'sell':
        return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case 'buy':
        return <ArrowDownRight className="h-4 w-4 text-red-600" />;
      case 'deposit':
        return <DollarSign className="h-4 w-4 text-blue-600" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>My Earnings</span>
          </SheetTitle>
          <SheetDescription>
            View your trading performance and earnings summary
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4">
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-800">Total Earnings</p>
                    <p className="text-2xl font-bold text-green-900">
                      {formatCurrency(earnings.totalEarnings)}
                    </p>
                    <p className="text-xs text-green-700">
                      {earnings.creditsSold.toLocaleString()} credits sold
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
                    <p className="text-xs text-gray-600">Total Spent</p>
                    <p className="text-lg font-semibold text-red-600">
                      {formatCurrency(earnings.totalPurchases)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Avg Sell Price</p>
                    <p className="text-sm font-semibold text-green-600">
                      ₹{earnings.averageSellPrice.toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Avg Buy Price</p>
                    <p className="text-sm font-semibold text-red-600">
                      ₹{earnings.averageBuyPrice.toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">
              Recent Transactions ({transactions.length})
            </h3>
            
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-2">No transactions yet</h3>
                <p className="text-sm text-gray-500">
                  Start trading carbon credits to see your earnings here.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {transactions
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((tx) => (
                    <Card key={tx.id} className="border">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getTransactionIcon(tx.type)}
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium capitalize">{tx.type}</span>
                                <Badge variant="outline" className="text-xs">
                                  {tx.status}
                                </Badge>
                              </div>
                              {tx.counterparty && (
                                <p className="text-xs text-gray-600">{tx.counterparty}</p>
                              )}
                              {tx.quantity && (
                                <p className="text-xs text-gray-600">
                                  {tx.quantity.toLocaleString()} credits @ ₹{tx.price?.toFixed(2)}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-semibold ${
                              tx.type === 'sell' 
                                ? 'text-green-600' 
                                : tx.type === 'buy' 
                                ? 'text-red-600' 
                                : 'text-blue-600'
                            }`}>
                              {tx.type === 'sell' ? '+' : tx.type === 'buy' ? '-' : '+'}
                              {formatCurrency(tx.total || tx.amount || 0)}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(tx.date).toLocaleDateString()}
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
      </SheetContent>
    </Sheet>
  );
};