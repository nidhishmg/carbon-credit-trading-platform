import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Leaf, ArrowLeft, ShoppingCart, TrendingUp } from 'lucide-react';
import type { User } from '../App';

interface BuyCreditsProps {
  user: User | null;
  currentPrice: number;
  onBuy: (quantity: number) => void;
  onNavigate: (page: string) => void;
}

export const BuyCredits: React.FC<BuyCreditsProps> = ({ user, currentPrice, onBuy, onNavigate }) => {
  const [quantity, setQuantity] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!user) return null;

  const quantityNum = parseInt(quantity) || 0;
  const totalCost = quantityNum * currentPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantityNum > 0) {
      setIsProcessing(true);
      // Simulate processing delay
      setTimeout(() => {
        onBuy(quantityNum);
        setIsProcessing(false);
        setQuantity('');
        onNavigate('dashboard');
      }, 1000);
    }
  };

  const presetQuantities = [10, 50, 100, 500];

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
          <h1 className="text-gray-900 mb-2">Buy Carbon Credits</h1>
          <p className="text-gray-600">Purchase verified carbon credits to offset your environmental impact</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Buy Form */}
          <Card className="border-green-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Purchase Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-gray-700">Quantity of Credits</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Enter number of credits"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="border-green-200 focus:border-green-500 focus:ring-green-500"
                    min="1"
                    required
                  />
                </div>

                {/* Preset Quantities */}
                <div className="space-y-2">
                  <Label className="text-gray-700">Quick Select</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {presetQuantities.map((preset) => (
                      <Button
                        key={preset}
                        type="button"
                        variant="outline"
                        onClick={() => setQuantity(preset.toString())}
                        className="border-green-200 text-green-600 hover:bg-green-50"
                      >
                        {preset} credits
                      </Button>
                    ))}
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 transition-colors"
                  disabled={quantityNum <= 0 || isProcessing}
                >
                  {isProcessing ? 'Processing...' : `Buy ${quantityNum.toLocaleString()} Credits`}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-800">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Market Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Price</span>
                  <span className="text-blue-800">${currentPrice.toFixed(2)} / credit</span>
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
                <CardTitle className="text-gray-900">Order Summary</CardTitle>
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
                    <span className="text-gray-900">Total Cost</span>
                    <span className="text-green-800">${totalCost.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Leaf className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <h3 className="text-green-800 mb-2">Environmental Impact</h3>
                  <p className="text-green-700 text-sm">
                    {quantityNum > 0 ? `${quantityNum} credits will offset approximately ${quantityNum} tons of CO₂` : 'Enter quantity to see impact'}
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