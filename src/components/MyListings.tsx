import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { 
  ShoppingBag, 
  X, 
  Calendar, 
  MapPin, 
  Tag, 
  TrendingUp,
  Trash2 
} from 'lucide-react';
import { useRealTimeNetwork } from '../hooks/useRealTimeNetwork';
import type { Company } from '../App';

interface MyListingsProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company | null;
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

export const MyListings: React.FC<MyListingsProps> = ({ 
  isOpen, 
  onClose, 
  company 
}) => {
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const { getMarketplaceListings } = useRealTimeNetwork(company);

  useEffect(() => {
    if (!company || !isOpen) return;
    
    // Load user's own listings from network
    const networkData = localStorage.getItem('carbonx_network');
    if (networkData) {
      const data = JSON.parse(networkData);
      const listings = data.marketplaceListings?.filter((listing: Listing) => 
        listing.sellerId === company.id
      ) || [];
      setUserListings(listings);
    }
  }, [company, isOpen]);

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

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Side Panel */}
      <div 
        className={`fixed right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5" />
              <h2 className="text-lg font-semibold">My Listings</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Manage your carbon credit listings in the marketplace
          </p>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-600">Active Value</p>
                    <p className="text-lg font-semibold text-green-600">₹{totalValue.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600">Sold Value</p>
                    <p className="text-lg font-semibold text-blue-600">₹{soldValue.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Listings */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">
              All Listings ({userListings.length})
            </h3>
            
            {userListings.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-2">No listings yet</h3>
                <p className="text-sm text-gray-500">
                  Create your first listing in the marketplace to start selling carbon credits.
                </p>
              </div>
            ) : (
              userListings.map((listing) => (
                <Card key={listing.id} className="border">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(listing.status)}>
                              {listing.status}
                            </Badge>
                            <span className="text-xs text-gray-500">{listing.type}</span>
                          </div>
                          <h4 className="text-sm font-medium">{listing.project}</h4>
                        </div>
                        
                        {listing.status === 'active' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelListing(listing.id)}
                            className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      {/* Details */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Quantity:</span>
                          <span className="font-medium">{listing.quantity.toLocaleString()} credits</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Price per credit:</span>
                          <span className="font-medium">₹{listing.price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total value:</span>
                          <span className="font-semibold text-green-600">₹{listing.total.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{listing.dateCreated}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{listing.location}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};