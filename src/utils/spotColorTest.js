/**
 * Test and validation utilities for the MLB Spot Color Mapping
 * 
 * This file contains functions to validate and test the spot color mapping
 * to ensure all teams have proper spot colors defined.
 */

import { MLB_SPOT_COLORS, getTeamSpotColor, getAllTeamSpotColors, hasTeamSpotColor } from './spotColorMapping.js';

/**
 * Validate that all expected MLB teams have spot colors defined
 * @returns {Object} Validation results
 */
export const validateSpotColorMapping = () => {
  const expectedTeams = [
    // American League East
    110, 111, 147, 139, 141,
    // American League Central  
    145, 114, 116, 118, 142,
    // American League West
    117, 108, 133, 136, 140,
    // National League East
    144, 146, 121, 143, 120,
    // National League Central
    112, 113, 158, 134, 138,
    // National League West
    109, 115, 119, 135, 137
  ];

  const results = {
    totalExpected: expectedTeams.length,
    totalDefined: Object.keys(MLB_SPOT_COLORS).length,
    missing: [],
    extra: [],
    valid: true
  };

  // Check for missing teams
  expectedTeams.forEach(teamId => {
    if (!hasTeamSpotColor(teamId)) {
      results.missing.push(teamId);
      results.valid = false;
    }
  });

  // Check for extra teams (not in expected list)
  Object.keys(MLB_SPOT_COLORS).forEach(teamId => {
    const id = parseInt(teamId, 10);
    if (!expectedTeams.includes(id)) {
      results.extra.push(id);
    }
  });

  return results;
};

/**
 * Test spot color hex format validation
 * @returns {Object} Format validation results
 */
export const validateSpotColorFormats = () => {
  const results = {
    valid: true,
    invalidColors: []
  };

  const hexColorRegex = /^#[0-9A-F]{6}$/i;

  Object.entries(MLB_SPOT_COLORS).forEach(([teamId, color]) => {
    if (!hexColorRegex.test(color)) {
      results.invalidColors.push({
        teamId: parseInt(teamId, 10),
        color,
        reason: 'Invalid hex format'
      });
      results.valid = false;
    }
  });

  return results;
};

/**
 * Generate a test report for the spot color mapping
 * @returns {string} Test report
 */
export const generateSpotColorTestReport = () => {
  const mappingValidation = validateSpotColorMapping();
  const formatValidation = validateSpotColorFormats();
  
  let report = '=== MLB Spot Color Mapping Test Report ===\n\n';
  
  // Mapping validation
  report += `Mapping Validation:\n`;
  report += `- Total expected teams: ${mappingValidation.totalExpected}\n`;
  report += `- Total defined teams: ${mappingValidation.totalDefined}\n`;
  report += `- Mapping valid: ${mappingValidation.valid ? 'YES' : 'NO'}\n`;
  
  if (mappingValidation.missing.length > 0) {
    report += `- Missing teams: ${mappingValidation.missing.join(', ')}\n`;
  }
  
  if (mappingValidation.extra.length > 0) {
    report += `- Extra teams: ${mappingValidation.extra.join(', ')}\n`;
  }
  
  // Format validation
  report += `\nFormat Validation:\n`;
  report += `- All colors valid hex format: ${formatValidation.valid ? 'YES' : 'NO'}\n`;
  
  if (formatValidation.invalidColors.length > 0) {
    report += `- Invalid colors:\n`;
    formatValidation.invalidColors.forEach(item => {
      report += `  - Team ${item.teamId}: ${item.color} (${item.reason})\n`;
    });
  }
  
  // Sample colors
  report += `\nSample Team Colors:\n`;
  const sampleTeams = [147, 111, 119, 138, 144]; // Yankees, Red Sox, Dodgers, Cardinals, Braves
  sampleTeams.forEach(teamId => {
    const color = getTeamSpotColor(teamId);
    report += `- Team ${teamId}: ${color}\n`;
  });
  
  return report;
};

/**
 * Console helper to run spot color tests
 */
export const runSpotColorTests = () => {
  console.log(generateSpotColorTestReport());
  
  // Test individual functions
  console.log('\n=== Function Tests ===');
  console.log('getTeamSpotColor(147):', getTeamSpotColor(147)); // Yankees
  console.log('hasTeamSpotColor(147):', hasTeamSpotColor(147));
  console.log('hasTeamSpotColor(999):', hasTeamSpotColor(999)); // Invalid team
  console.log('getAllTeamSpotColors() length:', getAllTeamSpotColors().length);
};
