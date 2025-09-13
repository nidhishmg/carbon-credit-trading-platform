import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  ShoppingCart, 
  TrendingUp, 
  Leaf, 
  CheckCircle, 
  AlertCircle,
  MapPin,
  Calendar,
  Tag
} from 'lucide-react';
import { marketplaceListings } from '../data/companies';
import { useRealTimeNetwork } from '../hooks/useRealTimeNetwork';
import type { Company } from '../App';

interface MarketplaceProps {
  company: Company | null;
  walletBalance: number;
  onBuyCredits: (quantity: number, price: number, seller: string, listingId?: string) => boolean;
  onSellCredits: (quantity: number, price: number, buyer: string) => boolean;
  onNavigate: (page: string) => void;
  defaultTab?: 'buy' | 'sell';
  isConnected?: boolean;
  activeUsers?: number;
  onLogout?: () => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ 
  company, 
  walletBalance, 
  onBuyCredits, 
  onSellCredits, 
  onNavigate,
  defaultTab = 'buy',
  isConnected = false,
  activeUsers = 0,
  onLogout = () => {}
}) => {
  const [sellQuantity, setSellQuantity] = useState('');
  const [sellPrice, setSellPrice] = useState('25.50');
  const [buyMessage, setBuyMessage] = useState('');
  const [sellMessage, setSellMessage] = useState('');
  const [dynamicListings, setDynamicListings] = useState<any[]>([]);

  // Get real-time network data
  const { getMarketplaceListings } = useRealTimeNetwork(company);

  // Load listings excluding user's own listings
  useEffect(() => {
    if (!company) return;
    
    const listings = getMarketplaceListings(company.id);
    // Combine static listings with dynamic ones, excluding own listings
    const staticListings = marketplaceListings.filter(listing => 
      listing.seller !== company.name
    );
    const allListings = [...staticListings, ...listings];
    setDynamicListings(allListings);
  }, [company?.id, company?.name, getMarketplaceListings]);

  if (!company) return null;

  const handleBuyCredits = (listing: any) => {
    // seller should be sellerId for wallet processing
    const success = onBuyCredits(listing.quantity, listing.price, listing.sellerId, listing.id);
    if (success) {
      setBuyMessage(`Successfully purchased ${listing.quantity.toLocaleString()} credits from ${listing.seller}`);
      setTimeout(() => setBuyMessage(''), 3000);
      
      // Refresh listings after purchase
      if (company) {
        const updatedListings = getMarketplaceListings(company.id);
        const staticListings = marketplaceListings.filter(l => l.seller !== company.name);
        setDynamicListings([...staticListings, ...updatedListings]);
      }
    } else {
      setBuyMessage('Insufficient wallet balance. Please add funds to continue.');
      setTimeout(() => setBuyMessage(''), 3000);
    }
  };

  const handleSellCredits = () => {
    const quantity = parseInt(sellQuantity);
    const price = parseFloat(sellPrice);
    
    if (!quantity || !price || quantity <= 0 || price <= 0) return;
    
    const success = onSellCredits(quantity, price, 'Market Buyer');
    if (success) {
      setSellMessage(`Successfully listed ${quantity.toLocaleString()} credits for sale at ₹${price.toFixed(2)} each`);
      setSellQuantity('');
      setTimeout(() => setSellMessage(''), 3000);
    } else {
      setSellMessage('Insufficient credits balance. Cannot sell more than you own.');
      setTimeout(() => setSellMessage(''), 3000);
    }
  };

  const marketPrice = 25.50;
  const sellTotal = parseInt(sellQuantity || '0') * parseFloat(sellPrice);

  return (
    <div className="min-h-screen">
      <Navbar 
        company={company} 
        currentPage="marketplace" 
        onNavigate={onNavigate} 
        onLogout={onLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-gray-900">Carbon Credit Marketplace</h1>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-600">
                {isConnected ? `Live Market • ${activeUsers} traders` : 'Market Offline'}
              </span>
            </div>
          </div>
          <p className="text-gray-600">Buy and sell verified carbon credits from trusted sources</p>
        </div>

        {/* Market Summary */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-green-600">Market Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-green-800">₹{marketPrice.toFixed(2)}</div>
              <p className="text-xs text-gray-600">per credit</p>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-blue-600">Your Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-blue-800">{company.credits.balance.toLocaleString()}</div>
              <p className="text-xs text-gray-600">credits owned</p>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-purple-600">Wallet Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-purple-800">₹{walletBalance.toLocaleString()}</div>
              <p className="text-xs text-gray-600">available funds</p>
            </CardContent>
          </Card>
          
          <Card className="border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-orange-600">Available Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-orange-800">{marketplaceListings.length}</div>
              <p className="text-xs text-gray-600">active offers</p>
            </CardContent>
          </Card>
        </div>

        {/* Messages */}
        {buyMessage && (
          <Alert className={`mb-6 ${buyMessage.includes('Successfully') ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
            {buyMessage.includes('Successfully') ? 
              <CheckCircle className="h-4 w-4 text-green-600" /> : 
              <AlertCircle className="h-4 w-4 text-red-600" />
            }
            <AlertDescription className={buyMessage.includes('Successfully') ? 'text-green-700' : 'text-red-700'}>
              {buyMessage}
            </AlertDescription>
          </Alert>
        )}

        {sellMessage && (
          <Alert className={`mb-6 ${sellMessage.includes('Successfully') ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
            {sellMessage.includes('Successfully') ? 
              <CheckCircle className="h-4 w-4 text-green-600" /> : 
              <AlertCircle className="h-4 w-4 text-red-600" />
            }
            <AlertDescription className={sellMessage.includes('Successfully') ? 'text-green-700' : 'text-red-700'}>
              {sellMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Marketplace Tabs */}
        <Tabs defaultValue={defaultTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy" className="flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4" />
              <span>Buy Credits</span>
            </TabsTrigger>
            <TabsTrigger value="sell" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Sell Credits</span>
            </TabsTrigger>
          </TabsList>

          {/* Buy Credits Tab */}
          <TabsContent value="buy">
            <div className="grid gap-6">
              {dynamicListings.length > 0 ? (
                dynamicListings.map((listing) => (
                  <Card key={listing.id} className="border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <span className="text-2xl">{listing.sellerLogo}</span>
                            <div>
                              <h3 className="text-gray-900">{listing.seller}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {listing.location}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {listing.vintage}
                                </span>
                                <Badge variant="outline">
                                  <Tag className="h-3 w-3 mr-1" />
                                  {listing.type}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h4 className="text-sm text-gray-700 mb-1">Project Details</h4>
                            <p className="text-gray-900">{listing.project}</p>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Quantity</span>
                              <div className="text-gray-900">{listing.quantity.toLocaleString()} credits</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Price per Credit</span>
                              <div className="text-gray-900">₹{listing.price.toFixed(2)}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Total Value</span>
                              <div className="text-gray-900">₹{listing.total.toLocaleString()}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-6 text-right">
                          <Button
                            onClick={() => handleBuyCredits(listing)}
                            className="bg-green-600 hover:bg-green-700"
                            disabled={walletBalance < listing.total}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Buy Credits
                          </Button>
                          {walletBalance < listing.total && (
                            <p className="text-xs text-red-600 mt-2">Insufficient balance</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-gray-200">
                  <CardContent className="p-6 text-center">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No credits available for purchase right now.</p>
                    <p className="text-sm text-gray-500 mt-2">Check back later or encourage other companies to list their credits!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Sell Credits Tab */}
          <TabsContent value="sell">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-800">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Create Sell Order
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="sellQuantity" className="text-gray-700">Quantity to Sell</Label>
                    <Input
                      id="sellQuantity"
                      type="number"
                      placeholder="Enter number of credits"
                      value={sellQuantity}
                      onChange={(e) => setSellQuantity(e.target.value)}
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      min="1"
                      max={company.credits.balance}
                    />
                    <p className="text-xs text-gray-600">
                      Available: {company.credits.balance.toLocaleString()} credits
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sellPrice" className="text-gray-700">Price per Credit (₹)</Label>
                    <Input
                      id="sellPrice"
                      type="number"
                      step="0.01"
                      placeholder="25.50"
                      value={sellPrice}
                      onChange={(e) => setSellPrice(e.target.value)}
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      min="0.01"
                    />
                    <p className="text-xs text-gray-600">
                      Market price: ₹{marketPrice.toFixed(2)}
                    </p>
                  </div>

                  <Button 
                    onClick={handleSellCredits}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={
                      !sellQuantity || 
                      !sellPrice || 
                      parseInt(sellQuantity) <= 0 || 
                      parseInt(sellQuantity) > company.credits.balance ||
                      parseFloat(sellPrice) <= 0
                    }
                  >
                    List for Sale
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantity</span>
                      <span>{parseInt(sellQuantity || '0').toLocaleString()} credits</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price per Credit</span>
                      <span>₹{parseFloat(sellPrice || '0').toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Platform Fee</span>
                      <span>₹0.00</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="text-gray-900">Total Proceeds</span>
                        <span className="text-blue-800">₹{sellTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center text-blue-700 mb-2">
                      <Leaf className="h-4 w-4 mr-2" />
                      <span className="text-sm">Environmental Impact</span>
                    </div>
                    <p className="text-blue-700 text-sm">
                      {parseInt(sellQuantity || '0') > 0 
                        ? `This sale represents ${parseInt(sellQuantity || '0').toLocaleString()} tonnes of CO₂ offset`
                        : 'Enter quantity to see environmental impact'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};