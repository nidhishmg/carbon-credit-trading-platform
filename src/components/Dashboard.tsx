import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Leaf, ShoppingCart, TrendingUp, History, User, LogOut } from 'lucide-react';
import type { User, Trade } from '../App';

interface DashboardProps {
  user: User | null;
  trades: Trade[];
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, trades, onNavigate }) => {
  if (!user) return null;

  const recentTrades = trades.slice(0, 5);
  const totalBought = trades.filter(t => t.type === 'buy').reduce((sum, t) => sum + t.quantity, 0);
  const totalSold = trades.filter(t => t.type === 'sell').reduce((sum, t) => sum + t.quantity, 0);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-green-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-xl text-green-800">CarbonX</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}</span>
              <Button variant="outline" onClick={() => onNavigate('profile')} className="border-green-600 text-green-600 hover:bg-green-50">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your carbon credit portfolio</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-green-600">Total Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-green-800">{user.credits.toLocaleString()}</div>
              <p className="text-xs text-gray-600">Available for trading</p>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-blue-600">Portfolio Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-blue-800">${(user.credits * 25.50).toLocaleString()}</div>
              <p className="text-xs text-gray-600">At current market price</p>
            </CardContent>
          </Card>
          
          <Card className="border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-green-600">Credits Purchased</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-green-800">{totalBought.toLocaleString()}</div>
              <p className="text-xs text-gray-600">Total lifetime purchases</p>
            </CardContent>
          </Card>
          
          <Card className="border-red-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-red-600">Credits Sold</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-red-800">{totalSold.toLocaleString()}</div>
              <p className="text-xs text-gray-600">Total lifetime sales</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Button 
            onClick={() => onNavigate('buy')} 
            className="h-24 bg-green-600 hover:bg-green-700 transition-colors"
          >
            <div className="text-center">
              <ShoppingCart className="h-8 w-8 mx-auto mb-2" />
              <div>Buy Credits</div>
            </div>
          </Button>
          
          <Button 
            onClick={() => onNavigate('sell')} 
            className="h-24 bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <div className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2" />
              <div>Sell Credits</div>
            </div>
          </Button>
          
          <Button 
            onClick={() => onNavigate('history')} 
            variant="outline"
            className="h-24 border-green-600 text-green-600 hover:bg-green-50 transition-colors"
          >
            <div className="text-center">
              <History className="h-8 w-8 mx-auto mb-2" />
              <div>Trade History</div>
            </div>
          </Button>
        </div>

        {/* Recent Activity */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTrades.length > 0 ? (
              <div className="space-y-3">
                {recentTrades.map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge 
                        variant={trade.type === 'buy' ? 'default' : 'destructive'}
                        className={trade.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      >
                        {trade.type.toUpperCase()}
                      </Badge>
                      <div>
                        <div className="text-sm">{trade.quantity.toLocaleString()} credits</div>
                        <div className="text-xs text-gray-600">{trade.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">${trade.total.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">${trade.price}/credit</div>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  onClick={() => onNavigate('history')}
                  className="w-full mt-4 border-green-600 text-green-600 hover:bg-green-50"
                >
                  View All Trades
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <History className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No trading activity yet</p>
                <Button onClick={() => onNavigate('buy')} className="bg-green-600 hover:bg-green-700">
                  Make Your First Trade
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};