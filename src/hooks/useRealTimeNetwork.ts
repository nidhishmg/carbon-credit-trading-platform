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
        case 'WALLET_UPDATE':
          if (update.data.companyId === currentCompany?.id && onWalletUpdate) {
            onWalletUpdate(update.data.balance);
          }
          break;
          
        case 'CREDIT_UPDATE':
          if (update.data.companyId === currentCompany?.id && onCompanyUpdate) {
            onCompanyUpdate(update.data.companyData);
          }
          break;
          
        case 'TRANSACTION':
          if (onTransactionUpdate) {
            onTransactionUpdate(update.data);
          }
          break;
          
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

  return {
    isConnected,
    activeUsers,
    updateCompanyCredits,
    updateWalletBalance,
    broadcastTransaction,
    addMarketplaceListing,
    removeMarketplaceListing,
    getMarketplaceListings,
    networkData
  };
};

export default useRealTimeNetwork;