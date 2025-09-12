import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Leaf, ArrowLeft, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import type { User } from '../App';

interface SellCreditsProps {
  user: User | null;
  currentPrice: number;
  onSell: (quantity: number) => void;
  onNavigate: (page: string) => void;
}

export const SellCredits: React.FC<SellCreditsProps> = ({ user, currentPrice, onSell, onNavigate }) => {
  const [quantity, setQuantity] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!user) return null;

  const quantityNum = parseInt(quantity) || 0;
  const totalProceeds = quantityNum * currentPrice;
  const canSell = quantityNum > 0 && quantityNum <= user.credits;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (canSell) {
      setIsProcessing(true);
      // Simulate processing delay
      setTimeout(() => {
        onSell(quantityNum);
        setIsProcessing(false);
        setQuantity('');
        onNavigate('dashboard');
      }, 1000);
    }
  };

  const presetPercentages = [25, 50, 75, 100];

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
            <div className="text-gray-700">
              Balance: {user.credits.toLocaleString()} credits
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Sell Carbon Credits</h1>
          <p className="text-gray-600">Convert your carbon credits to cash at current market rates</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Sell Form */}
          <Card className="border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800">
                <TrendingDown className="h-5 w-5 mr-2" />
                Sell Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-gray-700">Quantity of Credits to Sell</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Enter number of credits"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    min="1"
                    max={user.credits}
                    required
                  />
                  <p className="text-xs text-gray-600">
                    Available: {user.credits.toLocaleString()} credits
                  </p>
                </div>

                {/* Preset Percentages */}
                <div className="space-y-2">
                  <Label className="text-gray-700">Quick Select</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {presetPercentages.map((percentage) => {
                      const amount = Math.floor((user.credits * percentage) / 100);
                      return (
                        <Button
                          key={percentage}
                          type="button"
                          variant="outline"
                          onClick={() => setQuantity(amount.toString())}
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                          disabled={amount === 0}
                        >
                          {percentage}% ({amount.toLocaleString()})
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {quantityNum > user.credits && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                      You cannot sell more credits than you own. Available: {user.credits.toLocaleString()} credits
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
                  disabled={!canSell || isProcessing}
                >
                  {isProcessing ? 'Processing...' : `Sell ${quantityNum.toLocaleString()} Credits`}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Market Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Price</span>
                  <span className="text-green-800">${currentPrice.toFixed(2)} / credit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Market Status</span>
                  <span className="text-green-600">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">24h Change</span>
                  <span className="text-green-600">+2.5%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Sale Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity</span>
                  <span>{quantityNum.toLocaleString()} credits</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per Credit</span>
                  <span>${currentPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction Fee</span>
                  <span>$0.00</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-900">Total Proceeds</span>
                    <span className="text-blue-800">${totalProceeds.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Remaining Credits</span>
                  <span>{(user.credits - quantityNum).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <TrendingDown className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-blue-800 mb-2">Portfolio Impact</h3>
                  <p className="text-blue-700 text-sm">
                    {quantityNum > 0 
                      ? `Selling ${quantityNum} credits will reduce your portfolio by ${((quantityNum / user.credits) * 100).toFixed(1)}%`
                      : 'Enter quantity to see portfolio impact'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};