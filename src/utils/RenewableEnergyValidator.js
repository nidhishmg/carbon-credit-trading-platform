// Renewable Energy Source Validation Service
// This service validates user input against predefined data structures

import { 
  renewableEnergyDatabase, 
  renewableEnergyValidation,
  validInstallationLocations,
  calculateInstallationCost,
  calculateAnnualGeneration
} from './renewableEnergySources.js';

export class RenewableEnergyValidator {
  
  /**
   * Validates a new renewable energy source input
   * @param {Object} sourceData - User input data
   * @returns {Object} - Validation result with errors and corrected data
   */
  static validateNewSource(sourceData) {
    const errors = [];
    const warnings = [];
    let correctedData = { ...sourceData };
    let isValid = true;

    // 1. VALIDATE ENERGY TYPE
    const validTypes = ['solar', 'wind', 'hydro', 'biomass'];
    if (!validTypes.includes(sourceData.type)) {
      errors.push(`Invalid energy type "${sourceData.type}". Must be one of: ${validTypes.join(', ')}`);
      isValid = false;
    }

    // 2. VALIDATE SOURCE NAME FORMAT
    if (!sourceData.name || sourceData.name.trim().length < 5) {
      errors.push('Source name must be at least 5 characters long');
      isValid = false;
    }

    if (sourceData.name && sourceData.name.length > 50) {
      warnings.push('Source name is quite long. Consider shortening for better display');
    }

    // 3. VALIDATE CAPACITY
    if (!sourceData.capacity || sourceData.capacity <= 0) {
      errors.push('Capacity must be a positive number');
      isValid = false;
    } else {
      const typeValidation = renewableEnergyValidation[sourceData.type];
      if (typeValidation) {
        if (sourceData.capacity < typeValidation.capacityRange.min) {
          errors.push(`Capacity ${sourceData.capacity} kW is below minimum ${typeValidation.capacityRange.min} kW for ${sourceData.type}`);
          isValid = false;
        }
        if (sourceData.capacity > typeValidation.capacityRange.max) {
          errors.push(`Capacity ${sourceData.capacity} kW exceeds maximum ${typeValidation.capacityRange.max} kW for ${sourceData.type}`);
          isValid = false;
        }
      }
    }

    // 4. VALIDATE INSTALLATION LOCATION
    if (!sourceData.location || sourceData.location.trim().length < 3) {
      errors.push('Installation location must be specified');
      isValid = false;
    } else {
      const isValidLocation = this.validateLocation(sourceData.location, sourceData.type);
      if (!isValidLocation.valid) {
        errors.push(`Invalid location "${sourceData.location}" for ${sourceData.type}. ${isValidLocation.suggestion}`);
        isValid = false;
      }
    }

    // 5. VALIDATE TECHNOLOGY (if provided)
    if (sourceData.technology) {
      const validTechs = renewableEnergyValidation[sourceData.type]?.validTechnologies || [];
      if (!validTechs.includes(sourceData.technology)) {
        errors.push(`Invalid technology "${sourceData.technology}" for ${sourceData.type}. Valid options: ${validTechs.join(', ')}`);
        isValid = false;
      }
    }

    // 6. AUTO-CORRECT AND ENHANCE DATA
    if (isValid) {
      correctedData = this.enhanceSourceData(correctedData);
    }

    return {
      isValid,
      errors,
      warnings,
      correctedData,
      estimatedCost: isValid ? calculateInstallationCost(sourceData.type, sourceData.capacity, correctedData.technology) : 0,
      estimatedGeneration: isValid ? calculateAnnualGeneration(sourceData.type, sourceData.capacity, 'any', correctedData.technology) : 0
    };
  }

  /**
   * Validates installation location against predefined valid locations
   * @param {string} location - User provided location
   * @param {string} energyType - Type of renewable energy
   * @returns {Object} - Validation result with suggestions
   */
  static validateLocation(location, energyType) {
    const allLocations = Object.values(validInstallationLocations).flat();
    
    // Check exact match
    if (allLocations.includes(location)) {
      return { valid: true, category: this.getLocationCategory(location) };
    }

    // Check partial match (case insensitive)
    const partialMatches = allLocations.filter(loc => 
      loc.toLowerCase().includes(location.toLowerCase()) || 
      location.toLowerCase().includes(loc.toLowerCase())
    );

    if (partialMatches.length > 0) {
      return {
        valid: false,
        suggestion: `Did you mean one of these: ${partialMatches.slice(0, 3).join(', ')}?`
      };
    }

    // Suggest based on energy type
    const typeSuggestions = this.getLocationSuggestionsByType(energyType);
    return {
      valid: false,
      suggestion: `Valid locations for ${energyType}: ${typeSuggestions.join(', ')}`
    };
  }

  /**
   * Get location category (rooftop, ground, etc.)
   * @param {string} location - Location string
   * @returns {string} - Location category
   */
  static getLocationCategory(location) {
    for (const [category, locations] of Object.entries(validInstallationLocations)) {
      if (locations.includes(location)) {
        return category;
      }
    }
    return 'unknown';
  }

  /**
   * Get location suggestions based on energy type
   * @param {string} energyType - Type of renewable energy
   * @returns {Array} - Array of suggested locations
   */
  static getLocationSuggestionsByType(energyType) {
    switch (energyType) {
      case 'solar':
        return [...validInstallationLocations.rooftop, ...validInstallationLocations.ground].slice(0, 5);
      case 'wind':
        return validInstallationLocations.external.slice(0, 4);
      case 'hydro':
        return validInstallationLocations.water.slice(0, 3);
      case 'biomass':
        return validInstallationLocations.industrial.slice(0, 4);
      default:
        return validInstallationLocations.ground.slice(0, 3);
    }
  }

  /**
   * Enhance source data with additional calculated fields
   * @param {Object} sourceData - Basic source data
   * @returns {Object} - Enhanced source data
   */
  static enhanceSourceData(sourceData) {
    const enhanced = { ...sourceData };
    const typeValidation = renewableEnergyValidation[sourceData.type];
    
    // Auto-assign technology if not provided
    if (!enhanced.technology && typeValidation?.validTechnologies) {
      enhanced.technology = typeValidation.validTechnologies[0]; // Default to first valid technology
    }

    // Auto-assign category based on location
    const locationCategory = this.getLocationCategory(sourceData.location);
    enhanced.category = this.mapLocationToCategory(locationCategory, sourceData.type);

    // Calculate derived fields
    enhanced.installationCost = calculateInstallationCost(sourceData.type, sourceData.capacity, enhanced.technology);
    enhanced.estimatedAnnualGeneration = calculateAnnualGeneration(sourceData.type, sourceData.capacity, 'any', enhanced.technology);
    enhanced.estimatedCreditsPerYear = Math.floor(enhanced.estimatedAnnualGeneration * 0.00075); // Standard emission factor
    
    // Add timestamps
    enhanced.createdAt = new Date().toISOString();
    enhanced.status = 'active';
    enhanced.installDate = new Date().toISOString().split('T')[0];

    // Add standard warranty based on type
    if (typeValidation?.standardWarranty) {
      enhanced.warrantyYears = typeValidation.standardWarranty.min;
    }

    // Add maintenance cost (typically 1-3% of installation cost)
    const maintenanceRate = this.getMaintenanceRate(sourceData.type);
    enhanced.annualMaintenanceCost = Math.floor(enhanced.installationCost * maintenanceRate);

    // Add lifespan based on type
    enhanced.lifespan = this.getStandardLifespan(sourceData.type);

    return enhanced;
  }

  /**
   * Map location category to energy source category
   * @param {string} locationCategory - Location category
   * @param {string} energyType - Energy type
   * @returns {string} - Source category
   */
  static mapLocationToCategory(locationCategory, energyType) {
    const categoryMap = {
      solar: {
        rooftop: 'rooftop',
        ground: 'ground-mount',
        water: 'floating'
      },
      wind: {
        external: 'onshore'
      },
      hydro: {
        water: 'run-of-river'
      },
      biomass: {
        industrial: 'gasifier'
      }
    };

    return categoryMap[energyType]?.[locationCategory] || 'standard';
  }

  /**
   * Get maintenance rate percentage based on energy type
   * @param {string} energyType - Energy type
   * @returns {number} - Maintenance rate as decimal
   */
  static getMaintenanceRate(energyType) {
    const rates = {
      solar: 0.01,    // 1%
      wind: 0.02,     // 2% 
      hydro: 0.02,    // 2%
      biomass: 0.03   // 3%
    };
    return rates[energyType] || 0.02;
  }

  /**
   * Get standard lifespan based on energy type
   * @param {string} energyType - Energy type
   * @returns {number} - Lifespan in years
   */
  static getStandardLifespan(energyType) {
    const lifespans = {
      solar: 25,
      wind: 20,
      hydro: 35,
      biomass: 15
    };
    return lifespans[energyType] || 20;
  }

  /**
   * Get predefined source template by ID
   * @param {string} sourceId - Predefined source ID
   * @returns {Object|null} - Source template or null if not found
   */
  static getPredefinedSource(sourceId) {
    const allSources = {
      ...renewableEnergyDatabase.solar,
      ...renewableEnergyDatabase.wind,
      ...renewableEnergyDatabase.hydro,
      ...renewableEnergyDatabase.biomass
    };
    
    return allSources[sourceId] || null;
  }

  /**
   * Get all available predefined sources filtered by type
   * @param {string} energyType - Energy type filter (optional)
   * @returns {Array} - Array of available sources
   */
  static getAvailableSources(energyType = null) {
    if (energyType) {
      return Object.values(renewableEnergyDatabase[energyType] || {});
    }
    
    return [
      ...Object.values(renewableEnergyDatabase.solar),
      ...Object.values(renewableEnergyDatabase.wind),
      ...Object.values(renewableEnergyDatabase.hydro),
      ...Object.values(renewableEnergyDatabase.biomass)
    ];
  }

  /**
   * Validate bulk source data (for CSV imports, etc.)
   * @param {Array} sourcesArray - Array of source data objects
   * @returns {Object} - Bulk validation results
   */
  static validateBulkSources(sourcesArray) {
    const results = {
      validSources: [],
      invalidSources: [],
      totalProcessed: sourcesArray.length,
      successRate: 0
    };

    sourcesArray.forEach((sourceData, index) => {
      const validation = this.validateNewSource(sourceData);
      
      if (validation.isValid) {
        results.validSources.push({
          index,
          data: validation.correctedData,
          warnings: validation.warnings
        });
      } else {
        results.invalidSources.push({
          index,
          data: sourceData,
          errors: validation.errors
        });
      }
    });

    results.successRate = (results.validSources.length / results.totalProcessed * 100).toFixed(1);
    
    return results;
  }
}

// Export validation utilities
export const renewableEnergyValidationUtils = {
  getValidTypes: () => Object.keys(renewableEnergyValidation),
  getValidTechnologies: (type) => renewableEnergyValidation[type]?.validTechnologies || [],
  getValidCategories: (type) => renewableEnergyValidation[type]?.validCategories || [],
  getCapacityRange: (type) => renewableEnergyValidation[type]?.capacityRange || { min: 0, max: Infinity },
  getValidLocations: (category) => validInstallationLocations[category] || [],
  getAllValidLocations: () => Object.values(validInstallationLocations).flat()
};

export default RenewableEnergyValidator;