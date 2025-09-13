import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  ShoppingBag, 
  Calendar, 
  MapPin, 
  Tag, 
  TrendingUp,
  Trash2,
  Edit
} from 'lucide-react';
import { useRealTimeNetwork } from '../hooks/useRealTimeNetwork';
import type { Company } from '../App';

interface ListingsProps {
  company: Company | null;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

interface Listing {
  id: string;
  sellerId: string;
  seller: string;
  sellerLogo: string;
  quantity: number;
  price: number;
  total: number;
  type: string;
  vintage: string;
  project: string;
  location: string;
  dateCreated: string;
  status: 'active' | 'sold' | 'cancelled';
}

export const Listings: React.FC<ListingsProps> = ({ 
  company,
  onNavigate,
  onLogout
}) => {
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const { getMarketplaceListings } = useRealTimeNetwork(company);

  useEffect(() => {
    if (!company) return;
    
    // Load user's own listings from network
    const networkData = localStorage.getItem('carbonx_network');
    if (networkData) {
      const data = JSON.parse(networkData);
      const listings = data.marketplaceListings?.filter((listing: Listing) => 
        listing.sellerId === company.id
      ) || [];
      setUserListings(listings);
    }
  }, [company]);

  const handleCancelListing = (listingId: string) => {
    // Update listing status to cancelled
    const networkData = localStorage.getItem('carbonx_network');
    if (networkData) {
      const data = JSON.parse(networkData);
      const listingIndex = data.marketplaceListings?.findIndex((l: Listing) => l.id === listingId);
      if (listingIndex !== -1) {
        data.marketplaceListings[listingIndex].status = 'cancelled';
        data.lastUpdated = Date.now();
        localStorage.setItem('carbonx_network', JSON.stringify(data));
        
        // Update local state
        setUserListings(prev => prev.map(listing => 
          listing.id === listingId 
            ? { ...listing, status: 'cancelled' as const }
            : listing
        ));
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalValue = userListings
    .filter(listing => listing.status === 'active')
    .reduce((sum, listing) => sum + listing.total, 0);

  const soldValue = userListings
    .filter(listing => listing.status === 'sold')
    .reduce((sum, listing) => sum + listing.total, 0);

  if (!company) return null;

  return (
    <div className="min-h-screen">
      <Navbar 
        company={company} 
        currentPage="listings" 
        onNavigate={onNavigate} 
        onLogout={onLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-gray-900 flex items-center">
              <ShoppingBag className="h-8 w-8 mr-3" />
              My Listings
            </h1>
            <Button
              onClick={() => onNavigate('marketplace')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create New Listing
            </Button>
          </div>
          <p className="text-gray-600">Manage your carbon credit listings in the marketplace</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-green-600">Active Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-green-800">₹{totalValue.toLocaleString()}</div>
              <p className="text-xs text-gray-600">from active listings</p>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-blue-600">Sold Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-blue-800">₹{soldValue.toLocaleString()}</div>
              <p className="text-xs text-gray-600">from completed sales</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-purple-600">Total Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-purple-800">{userListings.length}</div>
              <p className="text-xs text-gray-600">all time</p>
            </CardContent>
          </Card>
        </div>

        {/* Listings Grid */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            All Listings ({userListings.length})
          </h2>
          
          {userListings.length === 0 ? (
            <Card className="border-gray-200">
              <CardContent className="p-8 text-center">
                <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
                <p className="text-gray-500 mb-4">
                  Create your first listing in the marketplace to start selling carbon credits.
                </p>
                <Button
                  onClick={() => onNavigate('marketplace')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create First Listing
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {userListings.map((listing) => (
                <Card key={listing.id} className="border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-2xl">{listing.sellerLogo}</span>
                          <div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColor(listing.status)}>
                                {listing.status}
                              </Badge>
                              <span className="text-sm text-gray-500">{listing.type}</span>
                            </div>
                            <h3 className="text-gray-900 font-medium">{listing.project}</h3>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-gray-600">Quantity</span>
                            <div className="text-gray-900 font-medium">{listing.quantity.toLocaleString()} credits</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Price per Credit</span>
                            <div className="text-gray-900 font-medium">₹{listing.price.toFixed(2)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Total Value</span>
                            <div className="text-gray-900 font-medium">₹{listing.total.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Vintage</span>
                            <div className="text-gray-900 font-medium">{listing.vintage}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>Listed: {new Date(listing.dateCreated).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{listing.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-6 flex space-x-2">
                        {listing.status === 'active' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Could implement edit functionality here
                                console.log('Edit listing:', listing.id);
                              }}
                              className="h-8"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelListing(listing.id)}
                              className="text-red-600 hover:text-red-700 hover:border-red-300 h-8"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};