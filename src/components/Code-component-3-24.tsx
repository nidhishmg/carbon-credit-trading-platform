import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  History, 
  Download, 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus
} from 'lucide-react';
import type { Company, Transaction } from '../App';

interface TransactionsProps {
  company: Company | null;
  transactions: Transaction[];
  onNavigate: (page: string) => void;
}

export const Transactions: React.FC<TransactionsProps> = ({ 
  company, 
  transactions, 
  onNavigate 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  if (!company) return null;

  // Filter and search transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.counterparty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.method?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || transaction.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'amount':
        const aAmount = a.total || a.amount || 0;
        const bAmount = b.total || b.amount || 0;
        return bAmount - aAmount;
      case 'type':
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  // Calculate summary stats
  const totalBuy = transactions.filter(t => t.type === 'buy').reduce((sum, t) => sum + (t.total || 0), 0);
  const totalSell = transactions.filter(t => t.type === 'sell').reduce((sum, t) => sum + (t.total || 0), 0);
  const totalDeposits = transactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalWithdrawals = transactions.filter(t => t.type === 'withdraw').reduce((sum, t) => sum + (t.amount || 0), 0);

  const exportTransactions = () => {
    const csvContent = [
      ['Transaction ID', 'Type', 'Quantity', 'Price', 'Total', 'Amount', 'Date', 'Counterparty', 'Method', 'Status'].join(','),
      ...sortedTransactions.map(transaction => [
        transaction.id,
        transaction.type.toUpperCase(),
        transaction.quantity || '',
        transaction.price?.toFixed(2) || '',
        transaction.total?.toFixed(2) || '',
        transaction.amount?.toFixed(2) || '',
        transaction.date,
        transaction.counterparty || '',
        transaction.method || '',
        transaction.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${company.name.replace(/\s+/g, '_')}_transactions.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'buy':
        return <TrendingDown className="h-4 w-4 text-green-600" />;
      case 'sell':
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'deposit':
        return <Plus className="h-4 w-4 text-purple-600" />;
      case 'withdraw':
        return <Minus className="h-4 w-4 text-red-600" />;
      default:
        return <History className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'buy':
        return 'bg-green-100 text-green-800';
      case 'sell':
        return 'bg-blue-100 text-blue-800';
      case 'deposit':
        return 'bg-purple-100 text-purple-800';
      case 'withdraw':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar 
        company={company} 
        currentPage="transactions" 
        onNavigate={onNavigate} 
        onLogout={() => {}} 
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Transaction History</h1>
          <p className="text-gray-600">View and manage all your trading and financial activities</p>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-green-600">Total Purchases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-green-800">₹{totalBuy.toLocaleString()}</div>
              <p className="text-xs text-gray-600">{transactions.filter(t => t.type === 'buy').length} transactions</p>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-blue-600">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-blue-800">₹{totalSell.toLocaleString()}</div>
              <p className="text-xs text-gray-600">{transactions.filter(t => t.type === 'sell').length} transactions</p>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-purple-600">Total Deposits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-purple-800">₹{totalDeposits.toLocaleString()}</div>
              <p className="text-xs text-gray-600">{transactions.filter(t => t.type === 'deposit').length} deposits</p>
            </CardContent>
          </Card>
          
          <Card className="border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-orange-600">Net Position</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-orange-800">₹{(totalSell - totalBuy + totalDeposits - totalWithdrawals).toLocaleString()}</div>
              <p className="text-xs text-gray-600">profit/loss</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-gray-900">
              <div className="flex items-center">
                <History className="h-5 w-5 mr-2" style={{ color: company.primaryColor }} />
                All Transactions
              </div>
              <Button 
                variant="outline" 
                onClick={exportTransactions}
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="buy">Buy Credits</SelectItem>
                  <SelectItem value="sell">Sell Credits</SelectItem>
                  <SelectItem value="deposit">Deposits</SelectItem>
                  <SelectItem value="withdraw">Withdrawals</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date (Newest)</SelectItem>
                  <SelectItem value="amount">Amount (Highest)</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Transaction Table */}
            {sortedTransactions.length > 0 ? (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Transaction</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Counterparty</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTransactions.map((transaction) => (
                      <TableRow 
                        key={transaction.id} 
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="text-sm text-gray-600">
                          #{transaction.id.slice(-6)}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getTransactionColor(transaction.type)} flex items-center w-fit`}>
                            {getTransactionIcon(transaction.type)}
                            <span className="ml-2">{transaction.type.toUpperCase()}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {transaction.quantity ? transaction.quantity.toLocaleString() : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {transaction.price ? `₹${transaction.price.toFixed(2)}` : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={
                            transaction.type === 'buy' || transaction.type === 'withdraw' 
                              ? 'text-red-700' 
                              : 'text-green-700'
                          }>
                            {transaction.type === 'buy' || transaction.type === 'withdraw' ? '-' : '+'}
                            ₹{(transaction.total || transaction.amount || 0).toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {transaction.counterparty || transaction.method || '-'}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {new Date(transaction.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                            className={transaction.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {transaction.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <History className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-gray-900 mb-2">No Transactions Found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || filterType !== 'all' 
                    ? 'No transactions match your current filters.' 
                    : 'You haven\'t made any transactions yet.'
                  }
                </p>
                {(!searchTerm && filterType === 'all') && (
                  <div className="space-x-4">
                    <Button onClick={() => onNavigate('marketplace')} className="bg-green-600 hover:bg-green-700">
                      Visit Marketplace
                    </Button>
                    <Button onClick={() => onNavigate('wallet')} variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                      Manage Wallet
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};