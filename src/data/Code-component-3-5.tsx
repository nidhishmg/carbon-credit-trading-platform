// Company data for KarbonX platform
export const companies = {
  'BEE-KA-S001': {
    id: 'BEE-KA-S001',
    password: 'jsw2025',
    name: 'JSW Steel',
    type: 'Steel Manufacturing',
    location: 'Bengaluru, Karnataka',
    established: '1982',
    employees: 42000,
    logo: '🏭',
    primaryColor: '#1e40af', // Blue
    secondaryColor: '#3b82f6',
    bgGradient: 'from-blue-50 to-indigo-50',
    emissions: {
      current: 2850000, // tonnes CO2
      target: 2280000,
      reduction: 20,
      baseline: 2850000
    },
    credits: {
      balance: 45000,
      purchased: 85000,
      sold: 40000,
      value: 1147500 // credits * 25.50
    },
    metrics: {
      energyEfficiency: 78,
      renewableEnergy: 35,
      wasteReduction: 62,
      carbonIntensity: 2.4
    },
    monthlyData: [
      { month: 'Jan', emissions: 240000, credits: 42000, efficiency: 76 },
      { month: 'Feb', emissions: 235000, credits: 43500, efficiency: 77 },
      { month: 'Mar', emissions: 230000, credits: 44000, efficiency: 78 },
      { month: 'Apr', emissions: 225000, credits: 44500, efficiency: 79 },
      { month: 'May', emissions: 220000, credits: 45000, efficiency: 78 },
      { month: 'Jun', emissions: 215000, credits: 45000, efficiency: 80 }
    ]
  },
  'BEE-KA-C001': {
    id: 'BEE-KA-C001',
    password: 'acc2025',
    name: 'ACC Cement',
    type: 'Cement Manufacturing',
    location: 'Bengaluru, Karnataka',
    established: '1936',
    employees: 9500,
    logo: '🏗️',
    primaryColor: '#059669', // Green
    secondaryColor: '#10b981',
    bgGradient: 'from-green-50 to-emerald-50',
    emissions: {
      current: 1450000, // tonnes CO2
      target: 1160000,
      reduction: 20,
      baseline: 1450000
    },
    credits: {
      balance: 28000,
      purchased: 52000,
      sold: 24000,
      value: 714000
    },
    metrics: {
      energyEfficiency: 72,
      renewableEnergy: 45,
      wasteReduction: 58,
      carbonIntensity: 0.85
    },
    monthlyData: [
      { month: 'Jan', emissions: 125000, credits: 26000, efficiency: 70 },
      { month: 'Feb', emissions: 120000, credits: 26500, efficiency: 71 },
      { month: 'Mar', emissions: 118000, credits: 27000, efficiency: 72 },
      { month: 'Apr', emissions: 115000, credits: 27500, efficiency: 73 },
      { month: 'May', emissions: 112000, credits: 28000, efficiency: 72 },
      { month: 'Jun', emissions: 110000, credits: 28000, efficiency: 74 }
    ]
  },
  'BEE-KA-R001': {
    id: 'BEE-KA-R001',
    password: 'hpcl2025',
    name: 'HPCL',
    type: 'Oil & Gas Refinery',
    location: 'Bengaluru, Karnataka',
    established: '1952',
    employees: 11000,
    logo: '⛽',
    primaryColor: '#dc2626', // Red
    secondaryColor: '#ef4444',
    bgGradient: 'from-red-50 to-orange-50',
    emissions: {
      current: 3200000, // tonnes CO2
      target: 2560000,
      reduction: 20,
      baseline: 3200000
    },
    credits: {
      balance: 52000,
      purchased: 98000,
      sold: 46000,
      value: 1326000
    },
    metrics: {
      energyEfficiency: 81,
      renewableEnergy: 25,
      wasteReduction: 45,
      carbonIntensity: 0.32
    },
    monthlyData: [
      { month: 'Jan', emissions: 275000, credits: 50000, efficiency: 79 },
      { month: 'Feb', emissions: 270000, credits: 50500, efficiency: 80 },
      { month: 'Mar', emissions: 265000, credits: 51000, efficiency: 81 },
      { month: 'Apr', emissions: 260000, credits: 51500, efficiency: 82 },
      { month: 'May', emissions: 255000, credits: 52000, efficiency: 81 },
      { month: 'Jun', emissions: 250000, credits: 52000, efficiency: 83 }
    ]
  }
};

// Mock marketplace listings
export const marketplaceListings = [
  {
    id: 'ML001',
    seller: 'JSW Steel',
    sellerLogo: '🏭',
    quantity: 5000,
    price: 25.50,
    total: 127500,
    type: 'VCS', // Verified Carbon Standard
    vintage: '2024',
    project: 'Renewable Energy - Wind Farm',
    location: 'Karnataka, India'
  },
  {
    id: 'ML002',
    seller: 'ACC Cement',
    sellerLogo: '🏗️',
    quantity: 3000,
    price: 26.00,
    total: 78000,
    type: 'CDM', // Clean Development Mechanism
    vintage: '2024',
    project: 'Energy Efficiency - Industrial',
    location: 'Tamil Nadu, India'
  },
  {
    id: 'ML003',
    seller: 'HPCL',
    sellerLogo: '⛽',
    quantity: 8000,
    price: 25.25,
    total: 202000,
    type: 'VCS',
    vintage: '2024',
    project: 'Methane Capture - Refinery',
    location: 'Maharashtra, India'
  },
  {
    id: 'ML004',
    seller: 'External Supplier',
    sellerLogo: '🌱',
    quantity: 12000,
    price: 24.75,
    total: 297000,
    type: 'Gold Standard',
    vintage: '2024',
    project: 'Reforestation - Afforestation',
    location: 'Odisha, India'
  },
  {
    id: 'ML005',
    seller: 'Green Energy Corp',
    sellerLogo: '🔋',
    quantity: 7500,
    price: 26.50,
    total: 198750,
    type: 'VCS',
    vintage: '2024',
    project: 'Solar Power Generation',
    location: 'Rajasthan, India'
  }
];

// Mock transaction history
export const generateMockTransactions = (companyId) => {
  const baseTransactions = [
    {
      id: 'TXN001',
      type: 'buy',
      quantity: 2500,
      price: 25.50,
      total: 63750,
      date: '2024-01-15',
      counterparty: 'Green Energy Corp',
      status: 'completed'
    },
    {
      id: 'TXN002',
      type: 'sell',
      quantity: 1000,
      price: 26.00,
      total: 26000,
      date: '2024-01-20',
      counterparty: 'Industrial Solutions Ltd',
      status: 'completed'
    },
    {
      id: 'TXN003',
      type: 'buy',
      quantity: 5000,
      price: 24.75,
      total: 123750,
      date: '2024-02-05',
      counterparty: 'Carbon Offset Inc',
      status: 'completed'
    },
    {
      id: 'TXN004',
      type: 'deposit',
      amount: 500000,
      date: '2024-02-10',
      method: 'Bank Transfer',
      status: 'completed'
    },
    {
      id: 'TXN005',
      type: 'sell',
      quantity: 3000,
      price: 25.75,
      total: 77250,
      date: '2024-02-15',
      counterparty: 'EcoTrade Solutions',
      status: 'completed'
    }
  ];
  
  return baseTransactions;
};