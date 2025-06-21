/**
 * Official MLB Team Spot Color Mapping
 * 
 * These are the official spot color hex values for each MLB team,
 * as defined in the MLB brand guidelines. The spot color is the primary
 * brand color used behind team logos and in branded elements.
 * 
 * Source: MLB Brand Guidelines and official team style guides
 * Last updated: 2025
 */

export const MLB_SPOT_COLORS = {
  // American League East
  110: '#df4601', // Baltimore Orioles - Orange
  111: '#0d2b56', // Boston Red Sox - Navy
  147: '#132448', // New York Yankees - Navy
  139: '#8fbce6', // Tampa Bay Rays - Light Blue
  141: '#134a8e', // Toronto Blue Jays - Blue

  // American League Central
  145: '#333333', // Chicago White Sox - Gray
  114: '#002b5c', // Cleveland Guardians - Navy
  116: '#0c2c56', // Detroit Tigers - Navy
  118: '#004687', // Kansas City Royals - Blue
  142: '#002b5c', // Minnesota Twins - Navy

  // American League West
  117: '#eb6e1f', // Houston Astros - Orange
  108: '#862633', // Los Angeles Angels - Red
  133: '#003831', // Oakland Athletics - Green
  136: '#0c2c56', // Seattle Mariners - Navy
  140: '#003278', // Texas Rangers - Blue

  // National League East
  144: '#0c2340', // Atlanta Braves - Navy
  146: '#00a3e0', // Miami Marlins - Blue
  121: '#002d72', // New York Mets - Navy
  143: '#e81828', // Philadelphia Phillies - Red
  120: '#ab0003', // Washington Nationals - Red

  // National League Central
  112: '#0e3386', // Chicago Cubs - Blue
  113: '#c6011f', // Cincinnati Reds - Red
  158: '#13294b', // Milwaukee Brewers - Navy
  134: '#333333', // Pittsburgh Pirates - Gray
  138: '#be0a14', // St. Louis Cardinals - Red

  // National League West
  109: '#aa182c', // Arizona Diamondbacks - Red
  115: '#33006f', // Colorado Rockies - Purple
  119: '#005a9c', // Los Angeles Dodgers - Blue
  135: '#ffc425', // San Diego Padres - Yellow
  137: '#fd5a1e', // San Francisco Giants - Orange

  // Additional Teams
  159: '#bc0022', // Team 159 - Red
  160: '#041e42', // Team 160 - Navy
};

/**
 * Get the official spot color for a team
 * @param {number|string} teamId - The MLB team ID
 * @returns {string} The hex color code for the team's spot color
 */
export const getTeamSpotColor = (teamId) => {
  const id = parseInt(teamId, 10);
  return MLB_SPOT_COLORS[id] || '#666666'; // Default gray if team not found
};

/**
 * Get all teams with their spot colors
 * @returns {Array} Array of team objects with id and spotColor
 */
export const getAllTeamSpotColors = () => {
  return Object.entries(MLB_SPOT_COLORS).map(([teamId, color]) => ({
    teamId: parseInt(teamId, 10),
    spotColor: color
  }));
};

/**
 * Check if a team has a spot color defined
 * @param {number|string} teamId - The MLB team ID
 * @returns {boolean} True if team has a spot color defined
 */
export const hasTeamSpotColor = (teamId) => {
  const id = parseInt(teamId, 10);
  return id in MLB_SPOT_COLORS;
};
