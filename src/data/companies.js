// Enhanced Company data for KarbonX platform with BEE compliance
export const companies = {
  'BEE-KA-S001': {
    id: 'BEE-KA-S001',
    password: 'jsw2025',
    name: 'JSW Steel',
    type: 'Steel Manufacturing',
    sector: 'Iron & Steel',
    location: 'Bengaluru, Karnataka',
    established: '1982',
    employees: 42000,
    logo: '🏭',
    primaryColor: '#1e40af', // Blue
    secondaryColor: '#3b82f6',
    bgGradient: 'from-blue-50 to-indigo-50',
    lastUpdate: '2024-12-12T14:30:00Z',
    targetYear: 2030,
    beeData: {
      currentSEC: 6.85, // GJ/tonne crude steel (Specific Energy Consumption)
      targetSEC: 5.48, // BEE mandated target
      governmentTarget: 5.48,
      beeRating: 4, // Current BEE star rating (1-5)
      previousRatings: [3, 3, 4, 4], // Last 4 years
      complianceStatus: 'Compliant',
      certificationDate: '2024-03-15'
    },
    emissions: {
      current: 2850000, // tonnes CO2
      target: 2280000,
      reduction: 20,
      baseline: 2850000,
      previousYear: 3100000, // 2023 emissions
      yearlyReduction: 250000, // tonnes reduced from previous year
      tillDate2024: 2850000 // emissions till date in 2024
    },
    credits: {
      balance: 45000,
      purchased: 85000,
      sold: 40000,
      value: 1147500,
      gainedThisYear: 12000, // credits gained from efficiency improvements
      previousYearGained: 8500
    },
    metrics: {
      energyEfficiency: 78,
      renewableEnergy: 35,
      wasteReduction: 62,
      carbonIntensity: 2.4
    },
    sustainabilitySuggestions: [
      {
        title: "Implement Waste Heat Recovery Systems",
        description: "Install advanced waste heat recovery systems in blast furnaces and coke ovens to reduce energy consumption by 15-20%",
        impact: "Potential SEC reduction: 1.0 GJ/tonne",
        priority: "High",
        timeline: "12-18 months",
        sdgAlignment: [7, 9, 13] // Affordable Clean Energy, Industry Innovation, Climate Action
      },
      {
        title: "Increase Solar & Wind Energy Integration",
        description: "Expand renewable energy capacity to 60% by installing 500MW solar parks and wind farms",
        impact: "Reduce emissions by 180,000 tonnes CO₂/year",
        priority: "High", 
        timeline: "18-24 months",
        sdgAlignment: [7, 13] // Affordable Clean Energy, Climate Action
      },
      {
        title: "Deploy Carbon Capture & Utilization",
        description: "Implement carbon capture technology for blast furnace gases and convert CO₂ to useful chemicals",
        impact: "Capture 200,000 tonnes CO₂/year",
        priority: "Medium",
        timeline: "24-36 months", 
        sdgAlignment: [9, 13] // Industry Innovation, Climate Action
      }
    ],
    sdgGoals: [
      { id: 7, name: "Affordable and Clean Energy", progress: 35 },
      { id: 9, name: "Industry, Innovation and Infrastructure", progress: 72 },
      { id: 13, name: "Climate Action", progress: 68 }
    ],
    hourlyEmissions: [
      { hour: '00:00', emission: 11875, efficiency: 76 },
      { hour: '01:00', emission: 10200, efficiency: 78 },
      { hour: '02:00', emission: 9800, efficiency: 79 },
      { hour: '03:00', emission: 9500, efficiency: 80 },
      { hour: '04:00', emission: 10100, efficiency: 78 },
      { hour: '05:00', emission: 11200, efficiency: 77 },
      { hour: '06:00', emission: 14500, efficiency: 74 }, // Morning shift peak
      { hour: '07:00', emission: 16800, efficiency: 72 }, // Peak production
      { hour: '08:00', emission: 18200, efficiency: 70 }, // Highest peak
      { hour: '09:00', emission: 17500, efficiency: 71 },
      { hour: '10:00', emission: 16200, efficiency: 73 },
      { hour: '11:00', emission: 15800, efficiency: 74 },
      { hour: '12:00', emission: 15000, efficiency: 75 },
      { hour: '13:00', emission: 14200, efficiency: 76 },
      { hour: '14:00', emission: 16500, efficiency: 72 }, // Afternoon peak
      { hour: '15:00', emission: 17200, efficiency: 71 },
      { hour: '16:00', emission: 16800, efficiency: 72 },
      { hour: '17:00', emission: 15500, efficiency: 74 },
      { hour: '18:00', emission: 14000, efficiency: 76 },
      { hour: '19:00', emission: 12800, efficiency: 77 },
      { hour: '20:00', emission: 11500, efficiency: 78 },
      { hour: '21:00', emission: 10800, efficiency: 79 },
      { hour: '22:00', emission: 10200, efficiency: 80 },
      { hour: '23:00', emission: 11000, efficiency: 78 }
    ],
    yearlyComparison: [
      { year: '2023', emissions: 3100000, credits: 33000, reduction: 5.2 },
      { year: '2024', emissions: 2850000, credits: 45000, reduction: 8.1 }
    ],
    monthlyData: [
      { month: 'Jan', emissions: 240000, credits: 42000, efficiency: 76, previousYear: 258000 },
      { month: 'Feb', emissions: 235000, credits: 43500, efficiency: 77, previousYear: 255000 },
      { month: 'Mar', emissions: 230000, credits: 44000, efficiency: 78, previousYear: 252000 },
      { month: 'Apr', emissions: 225000, credits: 44500, efficiency: 79, previousYear: 248000 },
      { month: 'May', emissions: 220000, credits: 45000, efficiency: 78, previousYear: 245000 },
      { month: 'Jun', emissions: 215000, credits: 45000, efficiency: 80, previousYear: 242000 }
    ]
  },
  'BEE-KA-C001': {
    id: 'BEE-KA-C001',
    password: 'acc2025',
    name: 'ACC Cement',
    type: 'Cement Manufacturing',
    sector: 'Cement',
    location: 'Bengaluru, Karnataka',
    established: '1936',
    employees: 9500,
    logo: '🏗️',
    primaryColor: '#059669', // Green
    secondaryColor: '#10b981',
    bgGradient: 'from-green-50 to-emerald-50',
    lastUpdate: '2024-12-12T15:45:00Z',
    targetYear: 2030,
    beeData: {
      currentSEC: 3.28, // GJ/tonne cement (Specific Energy Consumption)
      targetSEC: 2.95, // BEE mandated target
      governmentTarget: 2.95,
      beeRating: 5, // Current BEE star rating (1-5)
      previousRatings: [3, 4, 4, 5], // Last 4 years
      complianceStatus: 'Exceeds Target',
      certificationDate: '2024-04-20'
    },
    emissions: {
      current: 1450000, // tonnes CO2
      target: 1160000,
      reduction: 20,
      baseline: 1450000,
      previousYear: 1620000, // 2023 emissions
      yearlyReduction: 170000, // tonnes reduced from previous year
      tillDate2024: 1450000 // emissions till date in 2024
    },
    credits: {
      balance: 28000,
      purchased: 52000,
      sold: 24000,
      value: 714000,
      gainedThisYear: 15000, // credits gained from efficiency improvements
      previousYearGained: 10200
    },
    metrics: {
      energyEfficiency: 72,
      renewableEnergy: 45,
      wasteReduction: 58,
      carbonIntensity: 0.85
    },
    sustainabilitySuggestions: [
      {
        title: "Alternative Fuel Integration Program",
        description: "Replace 30% of coal with biomass and waste-derived fuels in cement kilns to reduce fossil fuel dependency",
        impact: "Reduce SEC by 0.25 GJ/tonne cement",
        priority: "High",
        timeline: "8-12 months",
        sdgAlignment: [7, 12, 13] // Clean Energy, Responsible Consumption, Climate Action
      },
      {
        title: "Circular Economy - Waste to Resource",
        description: "Utilize industrial waste like fly ash and slag as supplementary cementing materials to reduce clinker ratio",
        impact: "Reduce emissions by 85,000 tonnes CO₂/year",
        priority: "High",
        timeline: "6-10 months",
        sdgAlignment: [9, 11, 12] // Industry Innovation, Sustainable Cities, Responsible Consumption
      },
      {
        title: "Smart Energy Management System",
        description: "Deploy AI-powered energy optimization and predictive maintenance to improve overall plant efficiency",
        impact: "Improve energy efficiency by 8%",
        priority: "Medium",
        timeline: "12-15 months",
        sdgAlignment: [7, 9] // Clean Energy, Industry Innovation
      }
    ],
    sdgGoals: [
      { id: 7, name: "Affordable and Clean Energy", progress: 45 },
      { id: 9, name: "Industry, Innovation and Infrastructure", progress: 78 },
      { id: 11, name: "Sustainable Cities and Communities", progress: 62 },
      { id: 12, name: "Responsible Consumption and Production", progress: 58 },
      { id: 13, name: "Climate Action", progress: 75 }
    ],
    hourlyEmissions: [
      { hour: '00:00', emission: 5200, efficiency: 74 },
      { hour: '01:00', emission: 4800, efficiency: 76 },
      { hour: '02:00', emission: 4500, efficiency: 77 },
      { hour: '03:00', emission: 4200, efficiency: 78 },
      { hour: '04:00', emission: 4800, efficiency: 76 },
      { hour: '05:00', emission: 5500, efficiency: 74 },
      { hour: '06:00', emission: 7200, efficiency: 71 }, // Morning peak
      { hour: '07:00', emission: 8500, efficiency: 69 },
      { hour: '08:00', emission: 9200, efficiency: 67 }, // Highest peak
      { hour: '09:00', emission: 8800, efficiency: 68 },
      { hour: '10:00', emission: 8200, efficiency: 70 },
      { hour: '11:00', emission: 7800, efficiency: 71 },
      { hour: '12:00', emission: 7500, efficiency: 72 },
      { hour: '13:00', emission: 7200, efficiency: 73 },
      { hour: '14:00', emission: 8000, efficiency: 70 }, // Afternoon peak
      { hour: '15:00', emission: 8400, efficiency: 69 },
      { hour: '16:00', emission: 8200, efficiency: 70 },
      { hour: '17:00', emission: 7600, efficiency: 71 },
      { hour: '18:00', emission: 6800, efficiency: 73 },
      { hour: '19:00', emission: 6200, efficiency: 74 },
      { hour: '20:00', emission: 5800, efficiency: 75 },
      { hour: '21:00', emission: 5400, efficiency: 76 },
      { hour: '22:00', emission: 5100, efficiency: 77 },
      { hour: '23:00', emission: 5400, efficiency: 76 }
    ],
    yearlyComparison: [
      { year: '2023', emissions: 1620000, credits: 18000, reduction: 3.8 },
      { year: '2024', emissions: 1450000, credits: 28000, reduction: 10.5 }
    ],
    monthlyData: [
      { month: 'Jan', emissions: 125000, credits: 26000, efficiency: 70, previousYear: 140000 },
      { month: 'Feb', emissions: 120000, credits: 26500, efficiency: 71, previousYear: 138000 },
      { month: 'Mar', emissions: 118000, credits: 27000, efficiency: 72, previousYear: 135000 },
      { month: 'Apr', emissions: 115000, credits: 27500, efficiency: 73, previousYear: 132000 },
      { month: 'May', emissions: 112000, credits: 28000, efficiency: 72, previousYear: 130000 },
      { month: 'Jun', emissions: 110000, credits: 28000, efficiency: 74, previousYear: 128000 }
    ]
  },
  'BEE-KA-R001': {
    id: 'BEE-KA-R001',
    password: 'hpcl2025',
    name: 'HPCL',
    type: 'Oil & Gas Refinery',
    sector: 'Petroleum Refining',
    location: 'Bengaluru, Karnataka',
    established: '1952',
    employees: 11000,
    logo: '⛽',
    primaryColor: '#dc2626', // Red
    secondaryColor: '#ef4444',
    bgGradient: 'from-red-50 to-orange-50',
    lastUpdate: '2024-12-12T16:20:00Z',
    targetYear: 2030,
    beeData: {
      currentSEC: 28.5, // GJ/tonne crude oil processed (Specific Energy Consumption)
      targetSEC: 26.2, // BEE mandated target
      governmentTarget: 26.2,
      beeRating: 3, // Current BEE star rating (1-5)
      previousRatings: [2, 2, 3, 3], // Last 4 years
      complianceStatus: 'On Track',
      certificationDate: '2024-05-10'
    },
    emissions: {
      current: 3200000, // tonnes CO2
      target: 2560000,
      reduction: 20,
      baseline: 3200000,
      previousYear: 3450000, // 2023 emissions
      yearlyReduction: 250000, // tonnes reduced from previous year
      tillDate2024: 3200000 // emissions till date in 2024
    },
    credits: {
      balance: 52000,
      purchased: 98000,
      sold: 46000,
      value: 1326000,
      gainedThisYear: 18000, // credits gained from efficiency improvements
      previousYearGained: 12800
    },
    metrics: {
      energyEfficiency: 81,
      renewableEnergy: 25,
      wasteReduction: 45,
      carbonIntensity: 0.32
    },
    sustainabilitySuggestions: [
      {
        title: "Advanced Methane Leak Detection & Recovery",
        description: "Deploy optical gas imaging technology and automated systems to detect and capture methane emissions from refining processes",
        impact: "Reduce emissions by 120,000 tonnes CO₂ equivalent/year",
        priority: "High",
        timeline: "10-14 months",
        sdgAlignment: [7, 9, 13] // Clean Energy, Industry Innovation, Climate Action
      },
      {
        title: "Green Hydrogen Production Integration",
        description: "Install electrolysis units powered by renewable energy to produce green hydrogen for refining processes",
        impact: "Reduce SEC by 2.0 GJ/tonne crude oil",
        priority: "High",
        timeline: "18-24 months",
        sdgAlignment: [7, 9, 12] // Clean Energy, Industry Innovation, Responsible Consumption
      },
      {
        title: "Process Heat Optimization & Recovery",
        description: "Implement advanced heat integration networks and steam optimization to maximize energy recovery across units",
        impact: "Improve overall energy efficiency by 6%",
        priority: "Medium",
        timeline: "8-12 months",
        sdgAlignment: [9, 12, 13] // Industry Innovation, Responsible Consumption, Climate Action
      }
    ],
    sdgGoals: [
      { id: 7, name: "Affordable and Clean Energy", progress: 25 },
      { id: 9, name: "Industry, Innovation and Infrastructure", progress: 81 },
      { id: 12, name: "Responsible Consumption and Production", progress: 45 },
      { id: 13, name: "Climate Action", progress: 58 }
    ],
    hourlyEmissions: [
      { hour: '00:00', emission: 12500, efficiency: 82 },
      { hour: '01:00', emission: 11800, efficiency: 83 },
      { hour: '02:00', emission: 11200, efficiency: 84 },
      { hour: '03:00', emission: 10800, efficiency: 85 },
      { hour: '04:00', emission: 11500, efficiency: 83 },
      { hour: '05:00', emission: 12800, efficiency: 81 },
      { hour: '06:00', emission: 15200, efficiency: 79 }, // Morning peak
      { hour: '07:00', emission: 17500, efficiency: 77 },
      { hour: '08:00', emission: 19200, efficiency: 75 }, // Highest peak
      { hour: '09:00', emission: 18800, efficiency: 76 },
      { hour: '10:00', emission: 17800, efficiency: 77 },
      { hour: '11:00', emission: 17200, efficiency: 78 },
      { hour: '12:00', emission: 16500, efficiency: 79 },
      { hour: '13:00', emission: 16000, efficiency: 80 },
      { hour: '14:00', emission: 17800, efficiency: 77 }, // Afternoon peak
      { hour: '15:00', emission: 18400, efficiency: 76 },
      { hour: '16:00', emission: 18000, efficiency: 77 },
      { hour: '17:00', emission: 16800, efficiency: 78 },
      { hour: '18:00', emission: 15500, efficiency: 79 },
      { hour: '19:00', emission: 14200, efficiency: 81 },
      { hour: '20:00', emission: 13500, efficiency: 82 },
      { hour: '21:00', emission: 12800, efficiency: 83 },
      { hour: '22:00', emission: 12200, efficiency: 84 },
      { hour: '23:00', emission: 12800, efficiency: 83 }
    ],
    yearlyComparison: [
      { year: '2023', emissions: 3450000, credits: 34000, reduction: 4.2 },
      { year: '2024', emissions: 3200000, credits: 52000, reduction: 7.2 }
    ],
    monthlyData: [
      { month: 'Jan', emissions: 275000, credits: 50000, efficiency: 79, previousYear: 295000 },
      { month: 'Feb', emissions: 270000, credits: 50500, efficiency: 80, previousYear: 290000 },
      { month: 'Mar', emissions: 265000, credits: 51000, efficiency: 81, previousYear: 285000 },
      { month: 'Apr', emissions: 260000, credits: 51500, efficiency: 82, previousYear: 280000 },
      { month: 'May', emissions: 255000, credits: 52000, efficiency: 81, previousYear: 275000 },
      { month: 'Jun', emissions: 250000, credits: 52000, efficiency: 83, previousYear: 270000 }
    ]
  }
};

// Mock marketplace listings
export const marketplaceListings = [
  // Marketplace listings will be populated dynamically by users
  // No pre-existing demo listings
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