// Renewable Energy Sources Master Data for KarbonX Platform
// This file contains predefined renewable energy sources with validation rules

// 1. SOLAR ENERGY SOURCES DATASET
export const solarEnergySources = {
  'SOLAR-ROOF-001': {
    id: 'SOLAR-ROOF-001',
    name: 'Solar Roof System A1',
    type: 'solar',
    category: 'rooftop',
    capacity: 1500, // kW
    technology: 'Monocrystalline Silicon',
    efficiency: 22.1, // %
    installationCost: 112500000, // ₹ (₹7.5 crore per MW)
    maintenanceCost: 1125000, // ₹ per year (1% of installation cost)
    lifespan: 25, // years
    warrantyYears: 10,
    certifications: ['IEC 61215', 'IEC 61730', 'BIS IS 14286'],
    validLocations: [
      'Main Factory Roof',
      'Administration Building Roof', 
      'Warehouse Roof Block A',
      'Warehouse Roof Block B',
      'Parking Canopy Structure'
    ],
    peakSunHours: 5.5, // hours per day average
    annualGeneration: 2920000, // kWh (capacity × peak sun hours × 365 × 0.85 system efficiency)
    carbonCreditsPerYear: 2190, // credits (annualGeneration × 0.00075 emission factor)
    climateZones: ['tropical', 'subtropical'],
    minCapacity: 100, // kW
    maxCapacity: 5000, // kW
    gridConnectionRequired: true,
    batteryStorageCompatible: true
  },
  'SOLAR-GROUND-002': {
    id: 'SOLAR-GROUND-002', 
    name: 'Ground Mount Solar Farm B2',
    type: 'solar',
    category: 'ground-mount',
    capacity: 2000, // kW
    technology: 'Polycrystalline Silicon',
    efficiency: 19.8, // %
    installationCost: 140000000, // ₹ (₹7 crore per MW)
    maintenanceCost: 1400000, // ₹ per year
    lifespan: 25, // years
    warrantyYears: 12,
    certifications: ['IEC 61215', 'IEC 61730', 'BIS IS 14286', 'MNRE Approved'],
    validLocations: [
      'Factory Compound Open Area',
      'Unused Land Plot East',
      'Unused Land Plot West',
      'Employee Parking Extension Area'
    ],
    peakSunHours: 5.8, // hours per day average
    annualGeneration: 4234000, // kWh
    carbonCreditsPerYear: 3176, // credits
    climateZones: ['tropical', 'subtropical', 'arid'],
    minCapacity: 500, // kW
    maxCapacity: 10000, // kW
    gridConnectionRequired: true,
    batteryStorageCompatible: true
  },
  'SOLAR-FLOATING-003': {
    id: 'SOLAR-FLOATING-003',
    name: 'Floating Solar Array C3', 
    type: 'solar',
    category: 'floating',
    capacity: 1200, // kW
    technology: 'Bifacial Monocrystalline',
    efficiency: 24.2, // %
    installationCost: 108000000, // ₹ (₹9 crore per MW - higher due to floating infrastructure)
    maintenanceCost: 1620000, // ₹ per year (1.5% due to water maintenance)
    lifespan: 20, // years (slightly less due to water exposure)
    warrantyYears: 8,
    certifications: ['IEC 61215', 'IEC 61730', 'Marine Grade Certification'],
    validLocations: [
      'Factory Cooling Water Reservoir',
      'Rainwater Harvesting Pond',
      'Effluent Treatment Plant Lagoon'
    ],
    peakSunHours: 6.2, // hours per day (better cooling from water)
    annualGeneration: 2720000, // kWh
    carbonCreditsPerYear: 2040, // credits
    climateZones: ['tropical', 'subtropical'],
    minCapacity: 300, // kW
    maxCapacity: 3000, // kW
    gridConnectionRequired: true,
    batteryStorageCompatible: false // Due to water proximity
  }
};

// 2. WIND ENERGY SOURCES DATASET  
export const windEnergySources = {
  'WIND-ONSHORE-001': {
    id: 'WIND-ONSHORE-001',
    name: 'Wind PPA Farm D1',
    type: 'wind',
    category: 'onshore',
    capacity: 2500, // kW
    technology: 'Horizontal Axis Wind Turbine',
    turbineModel: 'Suzlon S128-2.5MW',
    hubHeight: 120, // meters
    rotorDiameter: 128, // meters
    cutInSpeed: 3.0, // m/s
    ratedSpeed: 12.0, // m/s
    cutOutSpeed: 25.0, // m/s
    installationCost: 200000000, // ₹ (₹8 crore per MW)
    maintenanceCost: 4000000, // ₹ per year (2% of installation cost)
    lifespan: 20, // years
    warrantyYears: 5,
    certifications: ['IEC 61400', 'GL 2010', 'MNRE Type Approved'],
    validLocations: [
      'External Wind Farm - Tamil Nadu',
      'External Wind Farm - Gujarat', 
      'External Wind Farm - Karnataka',
      'External Wind Farm - Rajasthan'
    ],
    averageWindSpeed: 8.5, // m/s
    capacityFactor: 35, // %
    annualGeneration: 7665000, // kWh (capacity × 8760 × capacity factor)
    carbonCreditsPerYear: 5749, // credits
    climateZones: ['coastal', 'hills', 'plains'],
    minCapacity: 1000, // kW
    maxCapacity: 25000, // kW
    gridConnectionRequired: true,
    environmentalImpactAssessment: true
  },
  'WIND-OFFSHORE-002': {
    id: 'WIND-OFFSHORE-002',
    name: 'Offshore Wind PPA E2',
    type: 'wind', 
    category: 'offshore',
    capacity: 3000, // kW
    technology: 'Offshore Wind Turbine',
    turbineModel: 'Vestas V164-3.0MW',
    hubHeight: 140, // meters
    rotorDiameter: 164, // meters
    cutInSpeed: 3.5, // m/s
    ratedSpeed: 13.0, // m/s
    cutOutSpeed: 25.0, // m/s
    installationCost: 450000000, // ₹ (₹15 crore per MW - higher due to offshore complexity)
    maintenanceCost: 9000000, // ₹ per year (3% due to marine environment)
    lifespan: 25, // years
    warrantyYears: 3,
    certifications: ['IEC 61400-3', 'DNV GL Marine Certification'],
    validLocations: [
      'Gujarat Offshore Wind Farm',
      'Tamil Nadu Offshore Wind Farm'
    ],
    averageWindSpeed: 12.5, // m/s (better offshore winds)
    capacityFactor: 45, // %
    annualGeneration: 11826000, // kWh
    carbonCreditsPerYear: 8870, // credits
    climateZones: ['coastal'],
    minCapacity: 2000, // kW
    maxCapacity: 50000, // kW
    gridConnectionRequired: true,
    environmentalImpactAssessment: true,
    marinePermitsRequired: true
  }
};

// 3. HYDROELECTRIC ENERGY SOURCES DATASET
export const hydroElectricSources = {
  'HYDRO-SMALL-001': {
    id: 'HYDRO-SMALL-001',
    name: 'Small Hydro Plant F1',
    type: 'hydro',
    category: 'small-hydro',
    capacity: 800, // kW
    technology: 'Run-of-River',
    turbineType: 'Kaplan Turbine',
    headHeight: 15, // meters
    flowRate: 8.5, // cubic meters per second
    installationCost: 200000000, // ₹ (₹25 crore per MW - higher due to civil works)
    maintenanceCost: 4000000, // ₹ per year
    lifespan: 35, // years (longer than solar/wind)
    warrantyYears: 10,
    certifications: ['IS 12837', 'CEA Approval', 'Environmental Clearance'],
    validLocations: [
      'River Tributary Near Factory',
      'Irrigation Canal Diversion',
      'Industrial Water Channel'
    ],
    capacityFactor: 55, // % (higher than wind/solar)
    annualGeneration: 3854400, // kWh
    carbonCreditsPerYear: 2891, // credits
    climateZones: ['riverine', 'hilly'],
    minCapacity: 100, // kW
    maxCapacity: 5000, // kW (small hydro definition)
    gridConnectionRequired: true,
    waterRightsRequired: true,
    environmentalClearanceRequired: true,
    fishLadderRequired: true
  },
  'HYDRO-MICRO-002': {
    id: 'HYDRO-MICRO-002',
    name: 'Micro Hydro Unit G2',
    type: 'hydro',
    category: 'micro-hydro', 
    capacity: 150, // kW
    technology: 'Cross-Flow Turbine',
    turbineType: 'Banki-Mitchell Turbine',
    headHeight: 8, // meters
    flowRate: 2.8, // cubic meters per second
    installationCost: 22500000, // ₹ (₹15 crore per MW)
    maintenanceCost: 450000, // ₹ per year
    lifespan: 30, // years
    warrantyYears: 8,
    certifications: ['IS 12837', 'BIS Standards'],
    validLocations: [
      'Factory Process Water Outfall',
      'Cooling Water Discharge Channel',
      'Stormwater Management System'
    ],
    capacityFactor: 70, // % (very high for controlled water flow)
    annualGeneration: 918000, // kWh
    carbonCreditsPerYear: 689, // credits
    climateZones: ['any'],
    minCapacity: 25, // kW
    maxCapacity: 500, // kW
    gridConnectionRequired: false,
    waterRightsRequired: false, // Using process water
    environmentalClearanceRequired: false,
    fishLadderRequired: false
  }
};

// 4. BIOMASS ENERGY SOURCES DATASET
export const biomassEnergySources = {
  'BIOMASS-GASIFIER-001': {
    id: 'BIOMASS-GASIFIER-001',
    name: 'Biomass Gasifier Power Plant H1',
    type: 'biomass',
    category: 'gasifier',
    capacity: 1000, // kW
    technology: 'Downdraft Gasification',
    fuelType: 'Rice Husk',
    fuelConsumption: 1500, // kg per hour
    gasifierEfficiency: 75, // %
    engineEfficiency: 35, // %
    installationCost: 150000000, // ₹ (₹15 crore per MW)
    maintenanceCost: 4500000, // ₹ per year (3% due to fuel handling)
    lifespan: 15, // years
    warrantyYears: 3,
    certifications: ['MNRE Approved', 'Pollution Control Board NOC'],
    validFuelSources: [
      'Rice Husk',
      'Wheat Straw', 
      'Cotton Stalks',
      'Sugarcane Bagasse',
      'Wood Chips',
      'Coconut Shells'
    ],
    validLocations: [
      'Industrial Area - Fuel Storage Zone',
      'Factory Backyard - Biomass Processing',
      'Dedicated Biomass Power Block'
    ],
    capacityFactor: 85, // % (baseload power)
    annualGeneration: 7446000, // kWh
    carbonCreditsPerYear: 5585, // credits
    climateZones: ['any'],
    minCapacity: 100, // kW
    maxCapacity: 10000, // kW
    gridConnectionRequired: true,
    fuelSupplyChainRequired: true,
    pollutionControlSystemRequired: true,
    ashDisposalSystemRequired: true,
    fuelStorageAreaRequired: 500 // square meters minimum
  },
  'BIOMASS-BOILER-002': {
    id: 'BIOMASS-BOILER-002',
    name: 'Biomass Steam Boiler I2',
    type: 'biomass',
    category: 'steam-boiler',
    capacity: 2000, // kW thermal (equivalent)
    electricalCapacity: 500, // kW electrical (25% conversion efficiency)
    technology: 'Fluidized Bed Combustion',
    fuelType: 'Multi-fuel',
    steamPressure: 40, // bar
    steamTemperature: 400, // °C
    boilerEfficiency: 85, // %
    turbineEfficiency: 25, // %
    installationCost: 120000000, // ₹ (₹24 crore per MW electrical)
    maintenanceCost: 3600000, // ₹ per year
    lifespan: 20, // years
    warrantyYears: 5,
    certifications: ['IBR Approval', 'Pollution Control Board NOC', 'MNRE Standards'],
    validFuelSources: [
      'Agricultural Residues',
      'Forest Residues',
      'Energy Crops',
      'Industrial Organic Waste'
    ],
    validLocations: [
      'Main Boiler House',
      'Auxiliary Power Block',
      'Cogeneration Plant Area'
    ],
    capacityFactor: 90, // % (industrial steam demand)
    annualGeneration: 3942000, // kWh electrical equivalent
    thermalGeneration: 15768000, // kWh thermal
    carbonCreditsPerYear: 2957, // credits (electrical only)
    climateZones: ['any'],
    minCapacity: 250, // kW
    maxCapacity: 25000, // kW
    gridConnectionRequired: false, // Can be captive
    fuelSupplyChainRequired: true,
    pollutionControlSystemRequired: true,
    ashDisposalSystemRequired: true,
    waterTreatmentRequired: true,
    fuelStorageAreaRequired: 1000 // square meters minimum
  }
};

// VALIDATION RULES AND CONSTRAINTS
export const renewableEnergyValidation = {
  solar: {
    capacityRange: { min: 25, max: 50000 }, // kW
    validTechnologies: ['Monocrystalline Silicon', 'Polycrystalline Silicon', 'Thin Film', 'Bifacial'],
    validCategories: ['rooftop', 'ground-mount', 'floating', 'agri-voltaic'],
    requiredCertifications: ['IEC 61215', 'IEC 61730'],
    minEfficiency: 15, // %
    maxEfficiency: 26, // %
    standardWarranty: { min: 5, max: 25 },
    climateCompatibility: ['tropical', 'subtropical', 'arid', 'temperate']
  },
  wind: {
    capacityRange: { min: 100, max: 100000 }, // kW
    validTechnologies: ['Horizontal Axis', 'Vertical Axis'],
    validCategories: ['onshore', 'offshore'],
    requiredCertifications: ['IEC 61400'],
    minWindSpeed: 3.0, // m/s cut-in
    maxWindSpeed: 25.0, // m/s cut-out
    standardWarranty: { min: 2, max: 10 },
    climateCompatibility: ['coastal', 'hills', 'plains']
  },
  hydro: {
    capacityRange: { min: 10, max: 25000 }, // kW (up to small hydro)
    validTechnologies: ['Pelton', 'Francis', 'Kaplan', 'Cross-Flow', 'Turgo'],
    validCategories: ['run-of-river', 'canal-based', 'micro-hydro'],
    requiredCertifications: ['IS 12837'],
    minHead: 2, // meters
    maxHead: 1000, // meters
    standardWarranty: { min: 5, max: 15 },
    climateCompatibility: ['riverine', 'hilly', 'any']
  },
  biomass: {
    capacityRange: { min: 50, max: 50000 }, // kW
    validTechnologies: ['Gasification', 'Combustion', 'Pyrolysis', 'Anaerobic Digestion'],
    validCategories: ['gasifier', 'steam-boiler', 'biogas', 'waste-to-energy'],
    requiredCertifications: ['MNRE Approved', 'Pollution Control Board NOC'],
    validFuels: ['Agricultural Residues', 'Forest Residues', 'Energy Crops', 'Organic Waste'],
    standardWarranty: { min: 2, max: 8 },
    climateCompatibility: ['any']
  }
};

// LOCATION VALIDATION DATABASE
export const validInstallationLocations = {
  rooftop: [
    'Main Factory Roof',
    'Administration Building Roof',
    'Warehouse Roof Block A',
    'Warehouse Roof Block B', 
    'Parking Canopy Structure',
    'Utility Building Roof'
  ],
  ground: [
    'Factory Compound Open Area',
    'Unused Land Plot East',
    'Unused Land Plot West', 
    'Employee Parking Extension Area',
    'Buffer Zone Area'
  ],
  water: [
    'Factory Cooling Water Reservoir',
    'Rainwater Harvesting Pond',
    'Effluent Treatment Plant Lagoon'
  ],
  external: [
    'External Wind Farm - Tamil Nadu',
    'External Wind Farm - Gujarat',
    'External Wind Farm - Karnataka', 
    'External Wind Farm - Rajasthan',
    'Gujarat Offshore Wind Farm',
    'Tamil Nadu Offshore Wind Farm'
  ],
  industrial: [
    'Industrial Area - Fuel Storage Zone',
    'Factory Backyard - Biomass Processing',
    'Main Boiler House',
    'Auxiliary Power Block',
    'Cogeneration Plant Area',
    'Dedicated Biomass Power Block'
  ]
};

// CAPACITY AND COST CALCULATION FUNCTIONS
export const calculateInstallationCost = (energyType, capacity, technology) => {
  const costPerKW = {
    solar: {
      'Monocrystalline Silicon': 75000,
      'Polycrystalline Silicon': 70000,
      'Thin Film': 65000,
      'Bifacial': 85000
    },
    wind: {
      'Horizontal Axis': 80000,
      'Vertical Axis': 85000
    },
    hydro: {
      'Run-of-River': 150000,
      'Canal-based': 120000,
      'Micro-hydro': 100000
    },
    biomass: {
      'Gasification': 150000,
      'Combustion': 120000,
      'Pyrolysis': 180000
    }
  };

  return costPerKW[energyType]?.[technology] * capacity || 0;
};

export const calculateAnnualGeneration = (energyType, capacity, location, technology) => {
  const generationFactors = {
    solar: {
      'tropical': 0.19,
      'subtropical': 0.18,
      'arid': 0.21
    },
    wind: {
      'coastal': 0.35,
      'hills': 0.40,
      'plains': 0.30
    },
    hydro: {
      'riverine': 0.55,
      'hilly': 0.60
    },
    biomass: {
      'any': 0.85
    }
  };

  const factor = generationFactors[energyType]?.['any'] || 0.20;
  return Math.floor(capacity * 8760 * factor); // kWh per year
};

// EXPORT ALL DATASETS
export const renewableEnergyDatabase = {
  solar: solarEnergySources,
  wind: windEnergySources, 
  hydro: hydroElectricSources,
  biomass: biomassEnergySources,
  validation: renewableEnergyValidation,
  locations: validInstallationLocations
};

export default renewableEnergyDatabase;