import { useState, useEffect, useCallback } from 'react';
import RealTimeNetwork from '../utils/RealTimeNetwork';
import type { Company } from '../App';

interface UseRealTimeNetworkReturn {
  isConnected: boolean;
  activeUsers: number;
  updateCompanyCredits: (companyId: string, newCredits: number) => void;
  updateWalletBalance: (companyId: string, newBalance: number) => void;
  broadcastTransaction: (transaction: any) => void;
  addMarketplaceListing: (listing: any) => any;
  removeMarketplaceListing: (listingId: string) => boolean;
  getMarketplaceListings: (excludeSellerId?: string) => any[];
  getUserWallet: (userId: string) => number;
  processPurchaseTransaction: (buyerId: string, sellerId: string, amount: number, listingId: string) => Promise<boolean>;
  networkData: any;
}

export const useRealTimeNetwork = (
  currentCompany: Company | null,
  onWalletUpdate?: (balance: number) => void,
  onCompanyUpdate?: (companyData: Company) => void,
  onTransactionUpdate?: (transaction: any) => void,
  onMarketplaceUpdate?: (listings: any[]) => void
): UseRealTimeNetworkReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState(0);
  const [networkData, setNetworkData] = useState<any>(null);
  const [network] = useState(() => RealTimeNetwork.getInstance());

  useEffect(() => {
    setIsConnected(true);

    // Subscribe to network updates
    const unsubscribeData = network.subscribe((data) => {
      setNetworkData(data);
      setActiveUsers(network.getActiveUsersCount());
    });

    const unsubscribeUpdates = network.subscribeToUpdates((update) => {
      // Handle different types of updates
      switch (update.type) {
        case 'WALLET_UPDATE': {
          const targetId = update.data.companyId ?? update.data.userId;
          if (targetId === currentCompany?.id && onWalletUpdate) {
            onWalletUpdate(update.data.balance);
          }
          break;
        }
          
        case 'CREDIT_UPDATE':
          if (update.data.companyId === currentCompany?.id && onCompanyUpdate) {
            onCompanyUpdate(update.data.companyData);
          }
          break;
          
        case 'TRANSACTION': {
          // Ignore backend 'purchase' here; we synthesize user-facing 'buy'/'sell' on SALE_COMPLETED
          if (update.data?.type === 'purchase') break;
          if (onTransactionUpdate) {
            onTransactionUpdate(update.data);
          }
          break;
        }

        case 'SALE_COMPLETED': {
          const { listing, buyerId } = update.data || {};
          if (!listing) break;

          // For seller: reduce credits and add a 'sell' transaction
          if (currentCompany && currentCompany.id === listing.sellerId) {
            const curr = currentCompany;
            const newCredits = Math.max(0, (curr.credits.balance || 0) - (listing.quantity || 0));
            const updatedCompany = {
              ...curr,
              credits: {
                ...curr.credits,
                balance: newCredits,
                sold: (curr.credits.sold || 0) + (listing.quantity || 0),
                value: newCredits * 25.5,
              },
            } as Company;
            onCompanyUpdate?.(updatedCompany);

            onTransactionUpdate?.({
              id: `TXN${Date.now()}`,
              type: 'sell',
              quantity: listing.quantity,
              price: listing.price,
              total: listing.total,
              date: new Date().toISOString().split('T')[0],
              counterparty: buyerId,
              status: 'completed',
            });
          }

          // For buyer: increase credits and add a 'buy' transaction
          if (currentCompany && currentCompany.id === buyerId) {
            const curr = currentCompany;
            const newCredits = (curr.credits.balance || 0) + (listing.quantity || 0);
            const updatedCompany = {
              ...curr,
              credits: {
                ...curr.credits,
                balance: newCredits,
                purchased: (curr.credits.purchased || 0) + (listing.quantity || 0),
                value: newCredits * 25.5,
              },
            } as Company;
            onCompanyUpdate?.(updatedCompany);

            onTransactionUpdate?.({
              id: `TXN${Date.now()}`,
              type: 'buy',
              quantity: listing.quantity,
              price: listing.price,
              total: listing.total,
              date: new Date().toISOString().split('T')[0],
              counterparty: listing.sellerId,
              status: 'completed',
            });
          }

          break;
        }
          
        case 'MARKETPLACE_UPDATE':
          if (onMarketplaceUpdate) {
            onMarketplaceUpdate(update.data);
          }
          break;
      }
    });

    return () => {
      unsubscribeData();
      unsubscribeUpdates();
      setIsConnected(false);
    };
  }, [network, currentCompany, onWalletUpdate, onCompanyUpdate, onTransactionUpdate, onMarketplaceUpdate]);

  const updateCompanyCredits = useCallback((companyId: string, newCredits: number) => {
    if (currentCompany && companyId === currentCompany.id) {
      const updatedCompany = {
        ...currentCompany,
        credits: {
          ...currentCompany.credits,
          balance: newCredits
        }
      };
      network.updateCompany(companyId, updatedCompany);
    }
  }, [network, currentCompany]);

  const updateWalletBalance = useCallback((companyId: string, newBalance: number) => {
    network.updateWallet(companyId, newBalance);
  }, [network]);

  const broadcastTransaction = useCallback((transaction: any) => {
    network.addTransaction(transaction);
  }, [network]);

  const addMarketplaceListing = useCallback((listing: any) => {
    return network.addMarketplaceListing(listing);
  }, [network]);

  const removeMarketplaceListing = useCallback((listingId: string) => {
    return network.removeMarketplaceListing(listingId);
  }, [network]);

  const getMarketplaceListings = useCallback((excludeSellerId?: string) => {
    return network.getMarketplaceListings(excludeSellerId);
  }, [network]);

  const getUserWallet = useCallback((userId: string) => {
    return network.getUserWallet(userId);
  }, [network]);

  const processPurchaseTransaction = useCallback((buyerId: string, sellerId: string, amount: number, listingId: string) => {
    return Promise.resolve(network.processPurchaseTransaction(buyerId, sellerId, amount, listingId));
  }, [network]);

  return {
    isConnected,
    activeUsers,
    updateCompanyCredits,
    updateWalletBalance,
    broadcastTransaction,
    addMarketplaceListing,
    removeMarketplaceListing,
    getMarketplaceListings,
    getUserWallet,
    processPurchaseTransaction,
    networkData
  };
};

export default useRealTimeNetwork;