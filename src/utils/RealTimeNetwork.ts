// Real-time network synchronization system
interface NetworkData {
  companies: Record<string, any>;
  marketplaceListings: MarketplaceListing[];
  globalTransactions: any[];
  lastUpdated: number;
  activeUsers: string[];
}

interface MarketplaceListing {
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

interface NetworkUpdate {
  type: 'TRANSACTION' | 'WALLET_UPDATE' | 'CREDIT_UPDATE' | 'MARKETPLACE_UPDATE' | 'USER_JOIN' | 'USER_LEAVE';
  data: any;
  timestamp: number;
  userId: string;
}

class RealTimeNetwork {
  private static instance: RealTimeNetwork;
  private subscribers: ((data: NetworkData) => void)[] = [];
  private updateSubscribers: ((update: NetworkUpdate) => void)[] = [];
  private userId: string;
  private pollInterval: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.userId = this.generateUserId();
    this.initializeNetwork();
  }

  static getInstance(): RealTimeNetwork {
    if (!RealTimeNetwork.instance) {
      RealTimeNetwork.instance = new RealTimeNetwork();
    }
    return RealTimeNetwork.instance;
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeNetwork() {
    // Initialize network data if it doesn't exist
    const networkData = this.getNetworkData();
    if (!networkData) {
      this.setNetworkData({
        companies: {},
        marketplaceListings: [],
        globalTransactions: [],
        lastUpdated: Date.now(),
        activeUsers: []
      });
    }

    // Start polling for updates
    this.startPolling();
    this.startHeartbeat();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      this.disconnect();
    });
  }

  private getNetworkData(): NetworkData | null {
    try {
      const data = localStorage.getItem('carbonx_network');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private setNetworkData(data: NetworkData) {
    localStorage.setItem('carbonx_network', JSON.stringify(data));
  }

  private startPolling() {
    this.pollInterval = setInterval(() => {
      this.checkForUpdates();
    }, 1000); // Poll every second
  }

  private startHeartbeat() {
    // Add this user to active users
    this.addActiveUser();
    
    // Send heartbeat every 30 seconds
    this.heartbeatInterval = setInterval(() => {
      this.addActiveUser();
    }, 30000);
  }

  private addActiveUser() {
    const data = this.getNetworkData();
    if (data) {
      const now = Date.now();
      // Remove users inactive for more than 2 minutes
      data.activeUsers = data.activeUsers.filter(user => {
        const userInfo = JSON.parse(user);
        return now - userInfo.lastSeen < 120000;
      });
      
      // Add/update current user
      const userIndex = data.activeUsers.findIndex(user => {
        const userInfo = JSON.parse(user);
        return userInfo.id === this.userId;
      });
      
      const userInfo = JSON.stringify({
        id: this.userId,
        lastSeen: now
      });
      
      if (userIndex >= 0) {
        data.activeUsers[userIndex] = userInfo;
      } else {
        data.activeUsers.push(userInfo);
      }
      
      data.lastUpdated = now;
      this.setNetworkData(data);
    }
  }

  private checkForUpdates() {
    const data = this.getNetworkData();
    if (data) {
      // Notify subscribers of current data
      this.subscribers.forEach(callback => callback(data));
    }
  }

  // Subscribe to network data updates
  subscribe(callback: (data: NetworkData) => void) {
    this.subscribers.push(callback);
    
    // Send current data immediately
    const data = this.getNetworkData();
    if (data) {
      callback(data);
    }
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  // Subscribe to specific network updates
  subscribeToUpdates(callback: (update: NetworkUpdate) => void) {
    this.updateSubscribers.push(callback);
    
    return () => {
      this.updateSubscribers = this.updateSubscribers.filter(cb => cb !== callback);
    };
  }

  // Broadcast an update to all connected users
  broadcast(update: Omit<NetworkUpdate, 'timestamp' | 'userId'>) {
    const data = this.getNetworkData();
    if (data) {
      const fullUpdate: NetworkUpdate = {
        ...update,
        timestamp: Date.now(),
        userId: this.userId
      };

      // Store the update in localStorage for other tabs/windows to pick up
      const updates = JSON.parse(localStorage.getItem('carbonx_updates') || '[]');
      updates.push(fullUpdate);
      
      // Keep only last 100 updates
      if (updates.length > 100) {
        updates.splice(0, updates.length - 100);
      }
      
      localStorage.setItem('carbonx_updates', JSON.stringify(updates));
      data.lastUpdated = Date.now();
      this.setNetworkData(data);

      // Notify local subscribers
      this.updateSubscribers.forEach(callback => callback(fullUpdate));
    }
  }

  // Update company data
  updateCompany(companyId: string, companyData: any) {
    const data = this.getNetworkData();
    if (data) {
      data.companies[companyId] = companyData;
      data.lastUpdated = Date.now();
      this.setNetworkData(data);
      
      this.broadcast({
        type: 'CREDIT_UPDATE',
        data: { companyId, companyData }
      });
    }
  }

  // Update wallet balance
  updateWallet(companyId: string, newBalance: number) {
    this.broadcast({
      type: 'WALLET_UPDATE',
      data: { companyId, balance: newBalance }
    });
  }

  // Add transaction
  addTransaction(transaction: any) {
    const data = this.getNetworkData();
    if (data) {
      data.globalTransactions.push(transaction);
      data.lastUpdated = Date.now();
      this.setNetworkData(data);
      
      this.broadcast({
        type: 'TRANSACTION',
        data: transaction
      });
    }
  }

  // Add marketplace listing
  addMarketplaceListing(listing: Omit<MarketplaceListing, 'id' | 'dateCreated' | 'status'>) {
    const data = this.getNetworkData();
    if (data) {
      const newListing: MarketplaceListing = {
        ...listing,
        id: `ML${Date.now()}`,
        dateCreated: new Date().toISOString(),
        status: 'active'
      };
      
      data.marketplaceListings.push(newListing);
      data.lastUpdated = Date.now();
      this.setNetworkData(data);
      
      this.broadcast({
        type: 'MARKETPLACE_UPDATE',
        data: { action: 'add', listing: newListing }
      });
      
      return newListing;
    }
    return null;
  }

  // Remove marketplace listing
  removeMarketplaceListing(listingId: string) {
    const data = this.getNetworkData();
    if (data) {
      const listingIndex = data.marketplaceListings.findIndex(l => l.id === listingId);
      if (listingIndex >= 0) {
        data.marketplaceListings[listingIndex].status = 'sold';
        data.lastUpdated = Date.now();
        this.setNetworkData(data);
        
        this.broadcast({
          type: 'MARKETPLACE_UPDATE',
          data: { action: 'remove', listingId }
        });
        
        return true;
      }
    }
    return false;
  }

  // Get active marketplace listings excluding seller's own listings
  getMarketplaceListings(excludeSellerId?: string): MarketplaceListing[] {
    const data = this.getNetworkData();
    if (data) {
      return data.marketplaceListings
        .filter(listing => 
          listing.status === 'active' && 
          (!excludeSellerId || listing.sellerId !== excludeSellerId)
        );
    }
    return [];
  }

  // Update marketplace listings
  updateMarketplace(listings: any[]) {
    const data = this.getNetworkData();
    if (data) {
      data.marketplaceListings = listings;
      data.lastUpdated = Date.now();
      this.setNetworkData(data);
      
      this.broadcast({
        type: 'MARKETPLACE_UPDATE',
        data: listings
      });
    }
  }

  // Get active users count
  getActiveUsersCount(): number {
    const data = this.getNetworkData();
    return data?.activeUsers.length || 0;
  }

  // Disconnect from network
  disconnect() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    // Remove this user from active users
    const data = this.getNetworkData();
    if (data) {
      data.activeUsers = data.activeUsers.filter(user => {
        const userInfo = JSON.parse(user);
        return userInfo.id !== this.userId;
      });
      this.setNetworkData(data);
    }
  }
}

export default RealTimeNetwork;