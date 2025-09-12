import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Leaf, ArrowLeft, History, Download } from 'lucide-react';
import type { Trade } from '../App';

interface TradeHistoryProps {
  trades: Trade[];
  onNavigate: (page: string) => void;
}

export const TradeHistory: React.FC<TradeHistoryProps> = ({ trades, onNavigate }) => {
  const totalBought = trades.filter(t => t.type === 'buy').reduce((sum, t) => sum + t.quantity, 0);
  const totalSold = trades.filter(t => t.type === 'sell').reduce((sum, t) => sum + t.quantity, 0);
  const totalVolume = trades.reduce((sum, t) => sum + t.total, 0);

  const exportTrades = () => {
    const csvContent = [
      ['Trade ID', 'Type', 'Quantity', 'Price', 'Total', 'Date'].join(','),
      ...trades.map(trade => [
        trade.id,
        trade.type.toUpperCase(),
        trade.quantity,
        trade.price.toFixed(2),
        trade.total.toFixed(2),
        trade.date
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trade-history.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-green-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => onNavigate('dashboard')}
                className="text-green-600 hover:text-green-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <div className="flex items-center space-x-2">
                <Leaf className="h-8 w-8 text-green-600" />
                <span className="text-xl text-green-800">CarbonX</span>
              </div>
            </div>
            {trades.length > 0 && (
              <Button 
                variant="outline" 
                onClick={exportTrades}
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Trade History</h1>
          <p className="text-gray-600">View all your carbon credit trading activity</p>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Total Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-gray-900">{trades.length}</div>
            </CardContent>
          </Card>
          
          <Card className="border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-green-600">Credits Purchased</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-green-800">{totalBought.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card className="border-red-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-red-600">Credits Sold</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-red-800">{totalSold.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-blue-600">Total Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-blue-800">${totalVolume.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Trade Table */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900">
              <History className="h-5 w-5 mr-2" />
              All Trades
            </CardTitle>
          </CardHeader>
          <CardContent>
            {trades.length > 0 ? (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Trade ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Price/Credit</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trades.map((trade) => (
                      <TableRow 
                        key={trade.id} 
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <TableCell className="text-sm text-gray-600">
                          #{trade.id.slice(-6)}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={trade.type === 'buy' ? 'default' : 'destructive'}
                            className={
                              trade.type === 'buy' 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }
                          >
                            {trade.type.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {trade.quantity.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          ${trade.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={trade.type === 'buy' ? 'text-green-700' : 'text-red-700'}>
                            ${trade.total.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {new Date(trade.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <History className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-gray-900 mb-2">No Trading History</h3>
                <p className="text-gray-600 mb-6">You haven't made any trades yet. Start by buying or selling carbon credits.</p>
                <div className="space-x-4">
                  <Button onClick={() => onNavigate('buy')} className="bg-green-600 hover:bg-green-700">
                    Buy Credits
                  </Button>
                  <Button onClick={() => onNavigate('sell')} variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                    Sell Credits
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};