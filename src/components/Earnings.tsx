import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Progress } from './ui/progress';
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Zap,
  Wind,
  Sun,
  Activity
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

interface RenewableSource {
  id: string;
  type: 'solar' | 'wind';
  name: string;
  capacity: number; // kW
  currentOutput: number; // kWh
  creditsGenerated: number;
  installDate: string;
  location: string;
  status: 'active' | 'maintenance' | 'offline';
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
  const [renewableSources, setRenewableSources] = useState<RenewableSource[]>([]);
  const [showAddSourceDialog, setShowAddSourceDialog] = useState(false);
  const [newSource, setNewSource] = useState({
    type: 'solar' as 'solar' | 'wind',
    name: '',
    capacity: '',
    location: '',
  });

  // Progress tracking
  const [renewableProgress, setRenewableProgress] = useState({
    gridPowerSwitch: 42.44, // 20% renewable target progress
    peakLoadReduction: 32.44, // 10% peak load reduction progress
  });

  useEffect(() => {
    if (company) {
      calculateEarnings();
      loadRenewableSources();
      // Simulate live data updates
      const interval = setInterval(updateLiveData, 3000);
      return () => clearInterval(interval);
    }
  }, [company]);

  const loadRenewableSources = () => {
    // Load initial renewable sources
    const initialSources: RenewableSource[] = [
      {
        id: 'SOLAR-001',
        type: 'solar',
        name: 'Solar Roof (100293bh70)',
        capacity: 1500,
        currentOutput: 1805,
        creditsGenerated: 200,
        installDate: '2024-01-15',
        location: 'Main Factory Roof',
        status: 'active'
      },
      {
        id: 'WIND-001',
        type: 'wind',
        name: 'Wind PPA (106748jk70)',
        capacity: 2000,
        currentOutput: 1805,
        creditsGenerated: 200,
        installDate: '2024-02-10',
        location: 'External Wind Farm',
        status: 'active'
      }
    ];
    setRenewableSources(initialSources);
  };

  const updateLiveData = () => {
    setRenewableSources(prev => prev.map(source => ({
      ...source,
      currentOutput: Math.floor(Math.random() * 200) + source.capacity * 0.6,
      creditsGenerated: source.creditsGenerated + Math.floor(Math.random() * 2)
    })));
  };

  const handleAddSource = () => {
    if (!newSource.name || !newSource.capacity || !newSource.location) return;
    
    const source: RenewableSource = {
      id: `${newSource.type.toUpperCase()}-${Date.now()}`,
      type: newSource.type,
      name: newSource.name,
      capacity: parseInt(newSource.capacity),
      currentOutput: 0,
      creditsGenerated: 0,
      installDate: new Date().toISOString().split('T')[0],
      location: newSource.location,
      status: 'active'
    };

    setRenewableSources(prev => [...prev, source]);
    setShowAddSourceDialog(false);
    setNewSource({ type: 'solar', name: '', capacity: '', location: '' });
  };

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
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #a7f3d0 0%, #86efac 100%)' }}>
      <Navbar 
        company={company} 
        currentPage="earnings" 
        onNavigate={onNavigate || (() => {})} 
        onLogout={onLogout || (() => {})}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-green-800 mb-2">EARNINGS</h1>
          </div>

          {/* Add Earnings Section */}
          <Card className="bg-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">ADD EARNINGS</h2>
              </div>
              <div className="flex space-x-4">
                <Button
                  variant="secondary" 
                  className="bg-white text-green-800 hover:bg-gray-100"
                  onClick={() => {/* Handle Carbon Reduction Challenge */}}
                  disabled
                >
                  Carbon Reduction Challenge
                </Button>
                <Button
                  variant="secondary" 
                  className="bg-white text-green-800 hover:bg-gray-100"
                  onClick={() => setShowAddSourceDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Renewable Integration
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Current Earnings Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Current earnings</h2>
            
            {/* Main Earnings Card */}
            <Card className="bg-green-400 text-green-900 mb-6">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-bold">EARNINGS</h3>
                  <Activity className="h-6 w-6 inline-block ml-2 text-red-500" />
                </div>

                {/* Progress Sections */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Switch 20% of grid power to renewable :</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={renewableProgress.gridPowerSwitch} className="w-32" />
                      <span className="text-sm font-medium">({renewableProgress.gridPowerSwitch.toFixed(2)}% PROGRESS)</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Cut peak-hour electricity load by 10% :</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={renewableProgress.peakLoadReduction} className="w-32" />
                      <span className="text-sm font-medium">({renewableProgress.peakLoadReduction.toFixed(2)}% PROGRESS)</span>
                    </div>
                  </div>
                </div>

                {/* Renewable Integration Title */}
                <div className="text-center mb-4">
                  <h4 className="text-2xl font-bold">RENEWABLE INTEGRATION</h4>
                </div>

                {/* Live Renewable Sources */}
                <div className="space-y-3">
                  {renewableSources.map((source) => (
                    <div key={source.id} className="bg-green-500 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {source.type === 'solar' ? (
                            <Sun className="h-5 w-5 text-yellow-600" />
                          ) : (
                            <Wind className="h-5 w-5 text-blue-600" />
                          )}
                          <span className="font-medium">{source.name}:</span>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-lg">{source.currentOutput} kWh</span>
                            <span>→</span>
                            <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded font-bold">
                              {source.creditsGenerated}
                            </span>
                            <span className="text-sm">credits</span>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${
                            source.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                          }`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Add Renewable Source Dialog */}
      <Dialog open={showAddSourceDialog} onOpenChange={setShowAddSourceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Renewable Energy Source</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sourceType">Energy Source Type</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={newSource.type}
                onChange={(e) => setNewSource({ ...newSource, type: e.target.value as 'solar' | 'wind' })}
              >
                <option value="solar">Solar Power</option>
                <option value="wind">Wind Power</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sourceName">Source Name</Label>
              <Input
                id="sourceName"
                value={newSource.name}
                onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                placeholder="e.g., Solar Roof System A1"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (kW)</Label>
              <Input
                id="capacity"
                type="number"
                value={newSource.capacity}
                onChange={(e) => setNewSource({ ...newSource, capacity: e.target.value })}
                placeholder="e.g., 1500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Installation Location</Label>
              <Input
                id="location"
                value={newSource.location}
                onChange={(e) => setNewSource({ ...newSource, location: e.target.value })}
                placeholder="e.g., Factory Roof Block A"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddSourceDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddSource}
              className="bg-green-600 hover:bg-green-700"
              disabled={!newSource.name || !newSource.capacity || !newSource.location}
            >
              Add Source
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Earnings;