import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Profile } from './components/Profile';
import { Marketplace } from './components/Marketplace';
import { Listings } from './components/Listings';
import { Earnings } from './components/Earnings';
import { Transactions } from './components/Transactions';
import { Wallet } from './components/Wallet';
import { companies, generateMockTransactions } from './data/companies';
import { useRealTimeNetwork } from './hooks/useRealTimeNetwork';

export type Company = {
  id: string;
  password: string;
  name: string;
  type: string;
  sector: string;
  location: string;
  established: string;
  employees: number;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  bgGradient: string;
  lastUpdate: string;
  targetYear: number;
  beeData: {
    currentSEC: number;
    targetSEC: number;
    governmentTarget: number;
    beeRating: number;
    previousRatings: number[];
    complianceStatus: string;
    certificationDate: string;
  };
  emissions: {
    current: number;
    target: number;
    reduction: number;
    baseline: number;
    previousYear: number;
    yearlyReduction: number;
    tillDate2024: number;
  };
  credits: {
    balance: number;
    purchased: number;
    sold: number;
    value: number;
    gainedThisYear: number;
    previousYearGained: number;
  };
  metrics: {
    energyEfficiency: number;
    renewableEnergy: number;
    wasteReduction: number;
    carbonIntensity: number;
  };
  sustainabilitySuggestions: Array<{
    title: string;
    description: string;
    impact: string;
    priority: string;
    timeline: string;
    sdgAlignment: number[];
  }>;
  sdgGoals: Array<{
    id: number;
    name: string;
    progress: number;
  }>;
  hourlyEmissions: Array<{
    hour: string;
    emission: number;
    efficiency: number;
  }>;
  yearlyComparison: Array<{
    year: string;
    emissions: number;
    credits: number;
    reduction: number;
  }>;
  monthlyData: Array<{
    month: string;
    emissions: number;
    credits: number;
    efficiency: number;
    previousYear: number;
  }>;
};

export type Transaction = {
  id: string;
  type: 'buy' | 'sell' | 'deposit' | 'withdraw' | 'list';
  quantity?: number;
  price?: number;
  total?: number;
  amount?: number;
  date: string;
  counterparty?: string;
  method?: string;
  status: string;
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletBalance, setWalletBalance] = useState(2500000); // Initial wallet balance in INR
  const [marketplaceTab, setMarketplaceTab] = useState<'buy' | 'sell'>('buy');

  // Real-time network integration
  const {
    isConnected,
    activeUsers,
    updateCompanyCredits,
    updateWalletBalance: broadcastWalletUpdate,
    broadcastTransaction,
    addMarketplaceListing,
    removeMarketplaceListing,
    getMarketplaceListings,
    getUserWallet,
    processPurchaseTransaction
  } = useRealTimeNetwork(
    currentCompany,
    // On wallet update received
    (balance: number) => {
      setWalletBalance(balance);
    },
    // On company update received
    (companyData: Company) => {
      setCurrentCompany(companyData);
    },
    // On transaction update received
    (transaction: any) => {
      setTransactions(prev => [...prev, transaction]);
    }
  );

  // Navigation function that can handle parameters
  const navigate = (page: string, params?: any) => {
    if (page === 'marketplace' && params?.tab) {
      setMarketplaceTab(params.tab);
    }
    setCurrentPage(page);
  };

  // Load session from localStorage on app start
  useEffect(() => {
    const savedSession = localStorage.getItem('karbonx_session');
    if (savedSession) {
      const { companyId, transactions: savedTransactions, walletBalance: savedBalance } = JSON.parse(savedSession);
      const company = companies[companyId as keyof typeof companies];
      if (company) {
        setCurrentCompany(company);
        setTransactions(savedTransactions || generateMockTransactions(companyId));
        setWalletBalance(savedBalance || 2500000);
        setCurrentPage('profile');
      }
    }
  }, []);

  // Save session to localStorage whenever company or data changes
  useEffect(() => {
    if (currentCompany) {
      const sessionData = {
        companyId: currentCompany.id,
        transactions,
        walletBalance,
        timestamp: Date.now()
      };
      localStorage.setItem('karbonx_session', JSON.stringify(sessionData));
    }
  }, [currentCompany, transactions, walletBalance]);

  // BEE ID login function
  const login = (beeId: string, password: string) => {
    const company = companies[beeId as keyof typeof companies];
    if (company && company.password === password) {
      setCurrentCompany(company);
      setTransactions(generateMockTransactions(beeId) as Transaction[]);
      
      // Load wallet balance from real-time network
      const networkWalletBalance = getUserWallet(company.id);
      console.log('Loading wallet balance from network:', networkWalletBalance, 'for company:', company.id);
      setWalletBalance(networkWalletBalance);
      
      setCurrentPage('profile');
      return true;
    }
    return false;
  };

  // Buy credits function - now uses real-time transaction processing
  const buyCredits = (quantity: number, price: number, seller: string, listingId?: string) => {
    if (!currentCompany) return false;
    
    const total = quantity * price;
    if (walletBalance < total) return false;

    console.log('Processing purchase transaction:', {
      buyerId: currentCompany.id,
      sellerId: seller,
      amount: total,
      quantity,
      listingId
    });

    // Use the new real-time transaction processing system
    if (listingId) {
      // process via backend if available
      // Note: hook returns Promise<boolean>
      const success = (processPurchaseTransaction as any)(currentCompany.id, seller, total, listingId) as Promise<boolean> | boolean;
      if (success instanceof Promise) {
        // Fire-and-forget optimistic add of user-visible txn after success
        success.then((ok) => {
          if (ok) {
            const newTransaction: Transaction = {
              id: `TXN${Date.now()}`,
              type: 'buy',
              quantity,
              price,
              total,
              date: new Date().toISOString().split('T')[0],
              counterparty: seller,
              status: 'completed'
            };
            setTransactions(prev => [newTransaction, ...prev]);
          }
        });
        return true;
      }
      if (!success) {
        console.error('Failed to process purchase transaction');
        return false;
      }
      // With sync return true, add user-visible txn
      const newTransaction: Transaction = {
        id: `TXN${Date.now()}`,
        type: 'buy',
        quantity,
        price,
        total,
        date: new Date().toISOString().split('T')[0],
        counterparty: seller,
        status: 'completed'
      };
      setTransactions(prev => [newTransaction, ...prev]);
      return true;
    }

    const newTransaction: Transaction = {
      id: `TXN${Date.now()}`,
      type: 'buy',
      quantity,
      price,
      total,
      date: new Date().toISOString().split('T')[0],
      counterparty: seller,
      status: 'completed'
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    const newWalletBalance = walletBalance - total;
    setWalletBalance(newWalletBalance);
    
    // Update company credits
    const newCreditBalance = currentCompany.credits.balance + quantity;
    const updatedCompany = {
      ...currentCompany,
      credits: {
        ...currentCompany.credits,
        balance: newCreditBalance,
        purchased: currentCompany.credits.purchased + quantity,
        value: newCreditBalance * 25.50
      }
    };
    setCurrentCompany(updatedCompany);

    // For manual transactions (not using marketplace listing)
    if (!listingId) {
      // Broadcast updates to network manually
      broadcastTransaction(newTransaction);
      broadcastWalletUpdate(currentCompany.id, newWalletBalance);
      updateCompanyCredits(currentCompany.id, newCreditBalance);
    }
    
    return true;
  };

  // Sell credits function
  // Sell credits function - creates marketplace listing
  const sellCredits = (quantity: number, price: number, buyer: string = '') => {
    if (!currentCompany || currentCompany.credits.balance < quantity) return false;
    
    // Create marketplace listing
    const listing = addMarketplaceListing({
      sellerId: currentCompany.id,
      seller: currentCompany.name,
      sellerLogo: currentCompany.logo,
      quantity: quantity,
      price: price,
      total: quantity * price,
      type: 'VCS', // Default type
      vintage: '2024',
      project: `Carbon Credits - ${currentCompany.name}`,
      location: currentCompany.location
    });

    if (listing) {
      // Reserve the credits (they're still in balance but listed for sale)
      const newTransaction: Transaction = {
        id: `TXN${Date.now()}`,
        type: 'list',
        quantity,
        price,
        total: quantity * price,
        date: new Date().toISOString().split('T')[0],
        counterparty: 'Marketplace',
        status: 'listed'
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      broadcastTransaction(newTransaction);
      
      return true;
    }
    
    return false;
  };

  // Wallet operations
  const addFunds = (amount: number, method: string) => {
    if (!currentCompany) return;
    
    const newTransaction: Transaction = {
      id: `TXN${Date.now()}`,
      type: 'deposit',
      amount,
      date: new Date().toISOString().split('T')[0],
      method,
      status: 'completed'
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    const newBalance = walletBalance + amount;
    setWalletBalance(newBalance);
    
    // Broadcast updates
    broadcastTransaction(newTransaction);
    broadcastWalletUpdate(currentCompany.id, newBalance);
  };

  const withdrawFunds = (amount: number, method: string) => {
    if (!currentCompany || walletBalance < amount) return false;
    
    const newTransaction: Transaction = {
      id: `TXN${Date.now()}`,
      type: 'withdraw',
      amount,
      date: new Date().toISOString().split('T')[0],
      method,
      status: 'completed'
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    const newBalance = walletBalance - amount;
    setWalletBalance(newBalance);
    
    // Broadcast updates
    broadcastTransaction(newTransaction);
    broadcastWalletUpdate(currentCompany.id, newBalance);
    
    return true;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('karbonx_session');
    setCurrentCompany(null);
    setTransactions([]);
    setWalletBalance(2500000);
    setCurrentPage('login');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'profile':
        return (
          <Profile 
            company={currentCompany} 
            transactions={transactions}
            onNavigate={setCurrentPage} 
            onLogout={logout}
            isConnected={isConnected}
            activeUsers={activeUsers}
          />
        );
      case 'marketplace':
        return (
          <Marketplace 
            company={currentCompany}
            walletBalance={walletBalance}
            onBuyCredits={buyCredits}
            onSellCredits={sellCredits}
            onNavigate={setCurrentPage}
            defaultTab={marketplaceTab}
            isConnected={isConnected}
            activeUsers={activeUsers}
            onLogout={logout}
          />
        );
      case 'listings':
        return (
          <Listings 
            company={currentCompany}
            onNavigate={setCurrentPage}
            onLogout={logout}
          />
        );
      case 'earnings':
        return (
          <Earnings 
            company={currentCompany}
            walletBalance={walletBalance}
            onNavigate={setCurrentPage}
            onLogout={logout}
          />
        );
      case 'transactions':
        return (
          <Transactions 
            company={currentCompany}
            transactions={transactions}
            onNavigate={setCurrentPage}
            onLogout={logout}
          />
        );
      case 'wallet':
        return (
          <Wallet 
            company={currentCompany}
            balance={walletBalance}
            transactions={transactions}
            onAddFunds={addFunds}
            onWithdrawFunds={withdrawFunds}
            onNavigate={setCurrentPage}
            onLogout={logout}
          />
        );
      default:
        return <Login onLogin={login} />;
    }
  };

  return (
    <div className={`min-h-screen ${currentCompany ? `bg-gradient-to-br ${currentCompany.bgGradient}` : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      {renderPage()}
    </div>
  );
}