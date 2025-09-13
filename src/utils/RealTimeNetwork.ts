// Real-time network synchronization system
interface NetworkData {
  companies: Record<string, any>;
  marketplaceListings: MarketplaceListing[];
  globalTransactions: any[];
  userWallets: Record<string, number>; // userId -> wallet balance
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
  type: 'TRANSACTION' | 'WALLET_UPDATE' | 'CREDIT_UPDATE' | 'MARKETPLACE_UPDATE' | 'USER_JOIN' | 'USER_LEAVE' | 'SALE_COMPLETED';
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
  // Backend integration
  private ws: WebSocket | null = null;
  private backendUrl: string;
  private wsUrl: string;
  private backendEnabled = false;
  private backendListings: MarketplaceListing[] = [];
  private backendWallets: Record<string, number> = {};

  constructor() {
    this.userId = this.generateUserId();
    // Resolve backend endpoints from env or localStorage
    const envHttp = (import.meta as any)?.env?.VITE_BACKEND_URL as string | undefined;
    const stored = (() => { try { return localStorage.getItem('carbonx_backend_url') || undefined; } catch { return undefined; } })();
    this.backendUrl = (envHttp || stored || 'http://localhost:5178').replace(/\/$/, '');
    this.wsUrl = this.backendUrl.replace('http://', 'ws://').replace('https://', 'wss://');
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
        userWallets: {},
        lastUpdated: Date.now(),
        activeUsers: []
      });
    }

    // Start polling for updates
    this.startPolling();
    this.startHeartbeat();
    this.connectWebSocket();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      this.disconnect();
    });
  }

  private connectWebSocket() {
    try {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => {
        this.backendEnabled = true;
      };
      this.ws.onmessage = (evt) => {
        try {
          const msg = JSON.parse(evt.data as string);
          switch (msg.type) {
            case 'SNAPSHOT': {
              const { listings, wallets, transactions } = msg.data || {};
              this.backendListings = listings || [];
              this.backendWallets = wallets || {};
              // Seed local network data for UI binding
              const data = this.getNetworkData();
              if (data) {
                data.marketplaceListings = this.backendListings as any;
                data.userWallets = { ...data.userWallets, ...this.backendWallets };
                data.globalTransactions = [
                  ...(data.globalTransactions || []),
                  ...((transactions || []) as any[])
                ].slice(-100);
                data.lastUpdated = Date.now();
                this.setNetworkData(data);
                this.subscribers.forEach(cb => cb(data));
              }
              break;
            }
            case 'MARKETPLACE_UPDATE': {
              const { action, listing, listingId } = msg.data || {};
              if (action === 'add' && listing) {
                this.backendListings = [listing, ...this.backendListings];
              }
              if (action === 'remove' && listingId) {
                this.backendListings = this.backendListings.map(l => l.id === listingId ? { ...l, status: 'sold' } : l);
              }
              // Reflect into local data and notify
              const data = this.getNetworkData();
              if (data) {
                data.marketplaceListings = this.backendListings as any;
                data.lastUpdated = Date.now();
                this.setNetworkData(data);
                this.broadcast({ type: 'MARKETPLACE_UPDATE', data: msg.data });
              }
              break;
            }
            case 'WALLET_UPDATE': {
              const { userId, balance } = msg.data || {};
              if (userId) this.backendWallets[userId] = balance;
              const data = this.getNetworkData();
              if (data) {
                data.userWallets[userId] = balance;
                data.lastUpdated = Date.now();
                this.setNetworkData(data);
                this.broadcast({ type: 'WALLET_UPDATE', data: { userId, balance } });
              }
              break;
            }
            case 'TRANSACTION': {
              const txn = msg.data;
              const data = this.getNetworkData();
              if (data) {
                data.globalTransactions.push(txn);
                data.lastUpdated = Date.now();
                this.setNetworkData(data);
                this.broadcast({ type: 'TRANSACTION', data: txn });
              }
              break;
            }
            case 'SALE_COMPLETED': {
              const { listing, buyerId } = msg.data || {};
              const data = this.getNetworkData();
              if (data && listing) {
                // Reduce seller credits locally (buyer credit add is handled in App after success)
                const sellerId = listing.sellerId;
                const sellerCompany = data.companies[sellerId];
                if (sellerCompany?.credits) {
                  const newBal = Math.max(0, (sellerCompany.credits.balance || 0) - (listing.quantity || 0));
                  data.companies[sellerId] = {
                    ...sellerCompany,
                    credits: {
                      ...sellerCompany.credits,
                      balance: newBal,
                      sold: (sellerCompany.credits.sold || 0) + (listing.quantity || 0),
                      value: newBal * 25.5,
                    }
                  };
                }
                data.lastUpdated = Date.now();
                this.setNetworkData(data);
                this.broadcast({ type: 'CREDIT_UPDATE', data: { companyId: sellerId, companyData: data.companies[sellerId] } });
                // Also broadcast the sale event so UI can synthesize user-facing buy/sell transactions
                this.broadcast({ type: 'SALE_COMPLETED', data: { listing, buyerId } });
              }
              break;
            }
          }
        } catch {}
      };
      this.ws.onerror = () => {
        this.backendEnabled = false;
      };
      this.ws.onclose = () => {
        this.backendEnabled = false;
        // Retry connection after delay
        setTimeout(() => this.connectWebSocket(), 3000);
      };
    } catch {
      this.backendEnabled = false;
    }
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
    // Keep local broadcast for UI
    this.broadcast({ type: 'WALLET_UPDATE', data: { companyId, balance: newBalance } });
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
    if (this.backendEnabled) {
      return this.httpPost(`${this.backendUrl}/listings`, listing)
        .then((res) => res as MarketplaceListing)
        .catch(() => null);
    }
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
      this.broadcast({ type: 'MARKETPLACE_UPDATE', data: { action: 'add', listing: newListing } });
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
    if (this.backendEnabled) {
      return this.backendListings
        .filter(l => l.status === 'active' && (!excludeSellerId || l.sellerId !== excludeSellerId));
    }
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

  // Wallet transaction methods
  getUserWallet(userId: string): number {
    if (this.backendEnabled) {
      const cached = this.backendWallets[userId];
      if (typeof cached === 'number') return cached;
      // Fire and forget fetch to update cache
      this.httpGet(`${this.backendUrl}/wallet/${encodeURIComponent(userId)}`).then((res: any) => {
        if (res && typeof res.balance === 'number') {
          this.backendWallets[userId] = res.balance;
          const data = this.getNetworkData();
          if (data) {
            data.userWallets[userId] = res.balance;
            data.lastUpdated = Date.now();
            this.setNetworkData(data);
            this.broadcast({ type: 'WALLET_UPDATE', data: { userId, balance: res.balance } });
          }
        }
      }).catch(() => {});
      return cached ?? 2500000;
    }
    const data = this.getNetworkData();
    return data?.userWallets[userId] || 2500000; // Default wallet balance
  }

  updateUserWallet(userId: string, balance: number) {
    const data = this.getNetworkData();
    if (data) {
      data.userWallets[userId] = balance;
      data.lastUpdated = Date.now();
      this.setNetworkData(data);
      
      this.broadcast({
        type: 'WALLET_UPDATE',
        data: { userId, balance }
      });
    }
  }

  // Process a purchase transaction with wallet updates
  processPurchaseTransaction(buyerId: string, sellerId: string, amount: number, listingId: string) {
    if (this.backendEnabled) {
      return this.httpPost(`${this.backendUrl}/purchase`, { buyerId, listingId })
        .then(() => true)
        .catch(() => false);
    }
    const data = this.getNetworkData();
    if (data) {
      const buyerWallet = data.userWallets[buyerId] || 2500000;
      const sellerWallet = data.userWallets[sellerId] || 2500000;
      if (buyerWallet >= amount) {
        data.userWallets[buyerId] = buyerWallet - amount;
        data.userWallets[sellerId] = sellerWallet + amount;
        const listingIndex = data.marketplaceListings.findIndex(l => l.id === listingId);
        if (listingIndex >= 0) {
          data.marketplaceListings[listingIndex].status = 'sold';
        }
        const transaction = {
          id: `TXN${Date.now()}`,
          buyerId,
          sellerId,
          amount,
          listingId,
          timestamp: Date.now(),
          type: 'purchase'
        };
        data.globalTransactions.push(transaction);
        data.lastUpdated = Date.now();
        this.setNetworkData(data);
        this.broadcast({ type: 'TRANSACTION', data: transaction });
        return true;
      }
    }
    return false;
  }

  private async httpGet(url: string) {
    const res = await fetch(url, { credentials: 'omit' });
    if (!res.ok) throw new Error('HTTP error');
    return res.json();
  }

  private async httpPost(url: string, body: any) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('HTTP error');
    return res.json();
  }

  // Disconnect from network
  disconnect() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    try { this.ws?.close(); } catch {}
    
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