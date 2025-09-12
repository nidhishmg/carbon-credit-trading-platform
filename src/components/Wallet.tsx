import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  CreditCard, 
  Plus, 
  Minus, 
  TrendingUp, 
  TrendingDown,
  Banknote,
  University,
  Smartphone,
  CheckCircle,
  AlertCircle,
  History
} from 'lucide-react';
import type { Company, Transaction } from '../App';

interface WalletProps {
  company: Company | null;
  balance: number;
  transactions: Transaction[];
  onAddFunds: (amount: number, method: string) => void;
  onWithdrawFunds: (amount: number, method: string) => boolean;
  onNavigate: (page: string) => void;
  onLogout?: () => void;
  onShowMyListings?: () => void;
  onShowMyEarnings?: () => void;
}

export const Wallet: React.FC<WalletProps> = ({ 
  company, 
  balance, 
  transactions, 
  onAddFunds, 
  onWithdrawFunds, 
  onNavigate,
  onLogout = () => {},
  onShowMyListings,
  onShowMyEarnings
}) => {
  const [depositAmount, setDepositAmount] = useState('');
  const [depositMethod, setDepositMethod] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('');
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [message, setMessage] = useState('');

  if (!company) return null;

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (amount > 0 && depositMethod) {
      onAddFunds(amount, depositMethod);
      setMessage(`Successfully deposited ₹${amount.toLocaleString()} via ${depositMethod}`);
      setDepositAmount('');
      setDepositMethod('');
      setDepositOpen(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount > 0 && withdrawMethod) {
      const success = onWithdrawFunds(amount, withdrawMethod);
      if (success) {
        setMessage(`Successfully withdrew ₹${amount.toLocaleString()} via ${withdrawMethod}`);
        setWithdrawAmount('');
        setWithdrawMethod('');
        setWithdrawOpen(false);
      } else {
        setMessage('Insufficient balance for withdrawal');
      }
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Calculate wallet statistics
  const totalDeposits = transactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  
  const totalWithdrawals = transactions
    .filter(t => t.type === 'withdraw')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalSpent = transactions
    .filter(t => t.type === 'buy')
    .reduce((sum, t) => sum + (t.total || 0), 0);

  const totalEarned = transactions
    .filter(t => t.type === 'sell')
    .reduce((sum, t) => sum + (t.total || 0), 0);

  const recentFinancialTransactions = transactions
    .filter(t => t.type === 'deposit' || t.type === 'withdraw')
    .slice(0, 5);

  const paymentMethods = [
    { id: 'bank_transfer', name: 'Bank Transfer', icon: University },
    { id: 'upi', name: 'UPI Payment', icon: Smartphone },
    { id: 'net_banking', name: 'Net Banking', icon: Banknote },
    { id: 'card', name: 'Debit/Credit Card', icon: CreditCard }
  ];

  return (
    <div className="min-h-screen">
      <Navbar 
        company={company} 
        currentPage="wallet" 
        onNavigate={onNavigate} 
        onLogout={onLogout}
        onShowMyListings={onShowMyListings}
        onShowMyEarnings={onShowMyEarnings}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Wallet & Finances</h1>
          <p className="text-gray-600">Manage your funds and track financial activity</p>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <Alert className={`mb-6 ${message.includes('Successfully') ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
            {message.includes('Successfully') ? 
              <CheckCircle className="h-4 w-4 text-green-600" /> : 
              <AlertCircle className="h-4 w-4 text-red-600" />
            }
            <AlertDescription className={message.includes('Successfully') ? 'text-green-700' : 'text-red-700'}>
              {message}
            </AlertDescription>
          </Alert>
        )}

        {/* Wallet Overview */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Main Balance Card */}
          <Card className="lg:col-span-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800">
                <CreditCard className="h-6 w-6 mr-3" />
                Wallet Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl text-green-800 mb-4">₹{balance.toLocaleString()}</div>
              <p className="text-green-700 mb-6">Available for trading and withdrawals</p>
              
              <div className="flex space-x-4">
                <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Funds
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Funds to Wallet</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="depositAmount">Amount (₹)</Label>
                        <Input
                          id="depositAmount"
                          type="number"
                          placeholder="Enter amount"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          min="1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="depositMethod">Payment Method</Label>
                        <Select value={depositMethod} onValueChange={setDepositMethod}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentMethods.map((method) => {
                              const Icon = method.icon;
                              return (
                                <SelectItem key={method.id} value={method.name}>
                                  <div className="flex items-center">
                                    <Icon className="h-4 w-4 mr-2" />
                                    {method.name}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        onClick={handleDeposit} 
                        className="w-full bg-green-600 hover:bg-green-700"
                        disabled={!depositAmount || !depositMethod || parseFloat(depositAmount) <= 0}
                      >
                        Confirm Deposit
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50">
                      <Minus className="h-4 w-4 mr-2" />
                      Withdraw
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Withdraw Funds</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="withdrawAmount">Amount (₹)</Label>
                        <Input
                          id="withdrawAmount"
                          type="number"
                          placeholder="Enter amount"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          min="1"
                          max={balance}
                        />
                        <p className="text-xs text-gray-600">Available: ₹{balance.toLocaleString()}</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="withdrawMethod">Withdrawal Method</Label>
                        <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select withdrawal method" />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentMethods.map((method) => {
                              const Icon = method.icon;
                              return (
                                <SelectItem key={method.id} value={method.name}>
                                  <div className="flex items-center">
                                    <Icon className="h-4 w-4 mr-2" />
                                    {method.name}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        onClick={handleWithdraw} 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={
                          !withdrawAmount || 
                          !withdrawMethod || 
                          parseFloat(withdrawAmount) <= 0 || 
                          parseFloat(withdrawAmount) > balance
                        }
                      >
                        Confirm Withdrawal
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="space-y-4">
            <Card className="border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-blue-600">Credits Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-blue-800">{company.credits.balance.toLocaleString()}</div>
                <p className="text-xs text-gray-600">₹{company.credits.value.toLocaleString()} value</p>
              </CardContent>
            </Card>
            
            <Card className="border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-purple-600">Total Deposits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-purple-800">₹{totalDeposits.toLocaleString()}</div>
                <p className="text-xs text-gray-600">lifetime deposits</p>
              </CardContent>
            </Card>
            
            <Card className="border-orange-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-orange-600">Net Trading</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl ${totalEarned - totalSpent >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                  ₹{(totalEarned - totalSpent).toLocaleString()}
                </div>
                <p className="text-xs text-gray-600">profit/loss</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Trading Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Total Earned (Sales)</div>
                    <div className="text-green-800">₹{totalEarned.toLocaleString()}</div>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  {transactions.filter(t => t.type === 'sell').length} sales
                </Badge>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <TrendingDown className="h-5 w-5 text-red-600 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Total Spent (Purchases)</div>
                    <div className="text-red-800">₹{totalSpent.toLocaleString()}</div>
                  </div>
                </div>
                <Badge className="bg-red-100 text-red-800">
                  {transactions.filter(t => t.type === 'buy').length} purchases
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <History className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentFinancialTransactions.length > 0 ? (
                <div className="space-y-3">
                  {recentFinancialTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {transaction.type === 'deposit' ? (
                          <Plus className="h-4 w-4 text-green-600" />
                        ) : (
                          <Minus className="h-4 w-4 text-red-600" />
                        )}
                        <div>
                          <div className="text-sm">{transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}</div>
                          <div className="text-xs text-gray-600">{transaction.method}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm ${transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'deposit' ? '+' : '-'}₹{(transaction.amount || 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600">{transaction.date}</div>
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    onClick={() => onNavigate('transactions')}
                    className="w-full mt-4 border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    View All Transactions
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <History className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No recent financial activity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};