import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Progress } from './ui/progress';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
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
  Activity,
  AlertTriangle,
  CheckCircle,
  Info
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

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  correctedData: any;
  estimatedCost: number;
  estimatedGeneration: number;
}

interface RenewableSource {
  id: string;
  type: 'solar' | 'wind' | 'hydro' | 'biomass';
  name: string;
  capacity: number; // kW
  currentOutput: number; // kWh
  creditsGenerated: number;
  installDate: string;
  location: string;
  technology?: string;
  status: 'active' | 'maintenance' | 'offline';
  estimatedAnnualGeneration?: number;
  installationCost?: number;
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
    type: 'solar' as 'solar' | 'wind' | 'hydro' | 'biomass',
    name: '',
    capacity: '',
    location: '',
    technology: ''
  });
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } | null>(null);

  // Predefined renewable energy options (matching our database structure)
  const predefinedSources = {
    solar: [
      { id: 'SOLAR-ROOF-001', name: 'Solar Roof System A1', capacity: 1500, technology: 'Monocrystalline Silicon' },
      { id: 'SOLAR-GROUND-002', name: 'Ground Mount Solar Farm B2', capacity: 2000, technology: 'Polycrystalline Silicon' },
      { id: 'SOLAR-FLOATING-003', name: 'Floating Solar Array C3', capacity: 1200, technology: 'Bifacial Monocrystalline' }
    ],
    wind: [
      { id: 'WIND-ONSHORE-001', name: 'Wind PPA Farm D1', capacity: 2500, technology: 'Horizontal Axis Wind Turbine' },
      { id: 'WIND-OFFSHORE-002', name: 'Offshore Wind PPA E2', capacity: 3000, technology: 'Offshore Wind Turbine' }
    ],
    hydro: [
      { id: 'HYDRO-SMALL-001', name: 'Small Hydro Plant F1', capacity: 800, technology: 'Run-of-River' },
      { id: 'HYDRO-MICRO-002', name: 'Micro Hydro Unit G2', capacity: 150, technology: 'Cross-Flow Turbine' }
    ],
    biomass: [
      { id: 'BIOMASS-GASIFIER-001', name: 'Biomass Gasifier Power Plant H1', capacity: 1000, technology: 'Downdraft Gasification' },
      { id: 'BIOMASS-BOILER-002', name: 'Biomass Steam Boiler I2', capacity: 500, technology: 'Fluidized Bed Combustion' }
    ]
  };

  const validLocations = {
    solar: ['Main Factory Roof', 'Administration Building Roof', 'Warehouse Roof Block A', 'Factory Compound Open Area'],
    wind: ['External Wind Farm - Tamil Nadu', 'External Wind Farm - Gujarat', 'External Wind Farm - Karnataka'],
    hydro: ['Factory Cooling Water Reservoir', 'River Tributary Near Factory', 'Industrial Water Channel'],
    biomass: ['Industrial Area - Fuel Storage Zone', 'Factory Backyard - Biomass Processing', 'Main Boiler House']
  };

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

  // Real-time validation as user types
  useEffect(() => {
    if (showAddSourceDialog && newSource.name && newSource.capacity && newSource.location) {
      const validation = validateSource(newSource);
      setValidationResult(validation);
    } else {
      setValidationResult(null);
    }
  }, [newSource, showAddSourceDialog]);

  const loadRenewableSources = () => {
    // Load initial renewable sources with variety
    const initialSources: RenewableSource[] = [
      {
        id: 'SOLAR-001',
        type: 'solar',
        name: 'Solar Roof System A1',
        capacity: 1500,
        currentOutput: 1805,
        creditsGenerated: 200,
        installDate: '2024-01-15',
        location: 'Main Factory Roof',
        technology: 'Monocrystalline Silicon',
        status: 'active'
      },
      {
        id: 'WIND-001',
        type: 'wind',
        name: 'Wind PPA Farm D1',
        capacity: 2500,
        currentOutput: 2150,
        creditsGenerated: 320,
        installDate: '2024-02-10',
        location: 'External Wind Farm - Tamil Nadu',
        technology: 'Horizontal Axis Wind Turbine',
        status: 'active'
      },
      {
        id: 'HYDRO-001',
        type: 'hydro',
        name: 'Micro Hydro Unit G2',
        capacity: 150,
        currentOutput: 140,
        creditsGenerated: 85,
        installDate: '2024-03-05',
        location: 'Factory Cooling Water Reservoir',
        technology: 'Cross-Flow Turbine',
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

  // Simple validation function
  const validateSource = (sourceData: any) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    if (!sourceData.name || sourceData.name.trim().length < 5) {
      errors.push('Source name must be at least 5 characters long');
    }
    
    if (!sourceData.capacity || parseInt(sourceData.capacity) <= 0) {
      errors.push('Capacity must be a positive number');
    }
    
    const capacity = parseInt(sourceData.capacity);
    if (capacity && capacity < 50) {
      errors.push('Minimum capacity is 50 kW');
    }
    if (capacity && capacity > 50000) {
      errors.push('Maximum capacity is 50,000 kW');
    }
    
    if (!sourceData.location || sourceData.location.trim().length < 3) {
      errors.push('Installation location must be specified');
    }
    
    const typeValidLocations = validLocations[sourceData.type as keyof typeof validLocations] || [];
    if (!typeValidLocations.includes(sourceData.location)) {
      warnings.push(`Consider using one of these validated locations: ${typeValidLocations.join(', ')}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };

  const handleAddSource = () => {
    const validation = validateSource(newSource);
    setValidationResult(validation);
    
    if (!validation.isValid) {
      return; // Don't proceed if validation fails
    }
    
    const source: RenewableSource = {
      id: `${newSource.type.toUpperCase()}-${Date.now()}`,
      type: newSource.type,
      name: newSource.name,
      capacity: parseInt(newSource.capacity),
      currentOutput: 0,
      creditsGenerated: 0,
      installDate: new Date().toISOString().split('T')[0],
      location: newSource.location,
      technology: newSource.technology,
      status: 'active'
    };

    setRenewableSources(prev => [...prev, source]);
    setShowAddSourceDialog(false);
    setNewSource({ type: 'solar', name: '', capacity: '', location: '', technology: '' });
    setValidationResult(null);
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
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        company={company} 
        currentPage="earnings" 
        onNavigate={onNavigate || (() => {})} 
        onLogout={onLogout || (() => {})}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Earnings</h1>
            <p className="text-gray-600">Track your renewable energy credits and earnings</p>
          </div>

          {/* Add Earnings Section */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-600">Add Earnings</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex space-x-4">
                <Button
                  variant="outline" 
                  className="border-gray-400 text-gray-600 hover:bg-gray-50"
                  onClick={() => {/* Handle Carbon Reduction Challenge */}}
                  disabled
                >
                  Carbon Reduction Challenge
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
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
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Earnings</h2>
            
            {/* Main Earnings Card */}
            <Card className="border-green-200 bg-white">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">EARNINGS</h3>
                  <Activity className="h-6 w-6 inline-block ml-2 text-green-500" />
                </div>

                {/* Progress Sections */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Switch 20% of grid power to renewable :</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={renewableProgress.gridPowerSwitch} className="w-32" />
                      <span className="text-sm font-medium text-gray-600">({renewableProgress.gridPowerSwitch.toFixed(2)}% PROGRESS)</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Cut peak-hour electricity load by 10% :</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={renewableProgress.peakLoadReduction} className="w-32" />
                      <span className="text-sm font-medium text-gray-600">({renewableProgress.peakLoadReduction.toFixed(2)}% PROGRESS)</span>
                    </div>
                  </div>
                </div>

                {/* Renewable Integration Title */}
                <div className="text-center mb-4">
                  <h4 className="text-xl font-bold text-gray-800">RENEWABLE INTEGRATION</h4>
                </div>

                {/* Live Renewable Sources */}
                <div className="space-y-3">
                  {renewableSources.map((source) => (
                    <div key={source.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {source.type === 'solar' ? (
                            <Sun className="h-5 w-5 text-yellow-500" />
                          ) : source.type === 'wind' ? (
                            <Wind className="h-5 w-5 text-blue-500" />
                          ) : source.type === 'hydro' ? (
                            <Activity className="h-5 w-5 text-cyan-500" />
                          ) : (
                            <Zap className="h-5 w-5 text-green-500" />
                          )}
                          <div>
                            <span className="font-medium text-gray-700">{source.name}</span>
                            {source.technology && (
                              <p className="text-xs text-gray-500">{source.technology}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-lg text-gray-800">{source.currentOutput} kWh</span>
                              <span className="text-gray-400">→</span>
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-bold">
                                {source.creditsGenerated}
                              </span>
                              <span className="text-sm text-gray-600">credits</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Capacity: {source.capacity} kW | Location: {source.location}
                            </div>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${
                            source.status === 'active' ? 'bg-green-400 animate-pulse' : 
                            source.status === 'maintenance' ? 'bg-yellow-400' : 'bg-red-400'
                          }`} />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {renewableSources.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>No renewable energy sources added yet.</p>
                      <p className="text-sm">Click "Renewable Integration" to add your first source.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={showAddSourceDialog} onOpenChange={setShowAddSourceDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Renewable Energy Source</DialogTitle>
          </DialogHeader>
          
          {/* Validation Alerts */}
          {validationResult && validationResult.errors.length > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <AlertTitle className="text-red-700">Validation Errors</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside text-red-600">
                  {validationResult.errors.map((error, index) => (
                    <li key={index} className="text-sm">{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          
          {validationResult && validationResult.warnings.length > 0 && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <Info className="h-4 w-4 text-yellow-500" />
              <AlertTitle className="text-yellow-700">Recommendations</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside text-yellow-600">
                  {validationResult.warnings.map((warning, index) => (
                    <li key={index} className="text-sm">{warning}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {validationResult && validationResult.isValid && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-700">Validation Passed</AlertTitle>
              <AlertDescription className="text-green-600">
                All inputs are valid. Ready to add renewable energy source.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sourceType">Energy Source Type</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={newSource.type}
                onChange={(e) => setNewSource({ ...newSource, type: e.target.value as any, name: '', location: '', technology: '' })}
              >
                <option value="solar">Solar Power</option>
                <option value="wind">Wind Power</option>
                <option value="hydro">Hydroelectric Power</option>
                <option value="biomass">Biomass Power</option>
              </select>
            </div>

            {/* Predefined Sources Selection */}
            <div className="space-y-2">
              <Label>Use Predefined Source (Optional)</Label>
              <select
                className="w-full p-2 border rounded-md bg-gray-50"
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    const selectedSource = predefinedSources[newSource.type].find(s => s.id === e.target.value);
                    if (selectedSource) {
                      setNewSource({
                        ...newSource,
                        name: selectedSource.name,
                        capacity: selectedSource.capacity.toString(),
                        technology: selectedSource.technology
                      });
                    }
                  }
                }}
              >
                <option value="">Select a predefined source template...</option>
                {predefinedSources[newSource.type].map((source) => (
                  <option key={source.id} value={source.id}>
                    {source.name} ({source.capacity} kW - {source.technology})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sourceName">Source Name *</Label>
              <Input
                id="sourceName"
                value={newSource.name}
                onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                placeholder="e.g., Solar Roof System A1"
                className={validationResult?.errors.some(e => e.includes('name')) ? 'border-red-300' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="technology">Technology</Label>
              <Input
                id="technology"
                value={newSource.technology}
                onChange={(e) => setNewSource({ ...newSource, technology: e.target.value })}
                placeholder="e.g., Monocrystalline Silicon"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (kW) *</Label>
              <Input
                id="capacity"
                type="number"
                value={newSource.capacity}
                onChange={(e) => setNewSource({ ...newSource, capacity: e.target.value })}
                placeholder="e.g., 1500"
                min="50"
                max="50000"
                className={validationResult?.errors.some(e => e.includes('Capacity')) ? 'border-red-300' : ''}
              />
              <p className="text-xs text-gray-500">Range: 50 - 50,000 kW</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Installation Location *</Label>
              <select
                className={`w-full p-2 border rounded-md ${validationResult?.errors.some(e => e.includes('location')) ? 'border-red-300' : ''}`}
                value={newSource.location}
                onChange={(e) => setNewSource({ ...newSource, location: e.target.value })}
              >
                <option value="">Select installation location...</option>
                {validLocations[newSource.type].map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500">
                Choose from validated locations for {newSource.type} installations
              </p>
            </div>

            {/* Advanced Information Display */}
            <div className="bg-gray-50 p-3 rounded-md space-y-2">
              <h4 className="font-medium text-sm text-gray-700">System Information</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div>Type: {newSource.type.charAt(0).toUpperCase() + newSource.type.slice(1)}</div>
                <div>Status: Active</div>
                <div>Warranty: Standard ({newSource.type === 'solar' ? '25' : newSource.type === 'wind' ? '20' : '15'} years)</div>
                <div>Installation Date: {new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddSourceDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddSource}
              className="bg-green-600 hover:bg-green-700"
              disabled={!validationResult?.isValid}
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