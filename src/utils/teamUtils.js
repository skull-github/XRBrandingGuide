// Team division mappings and utilities
export const TEAM_DIVISIONS = {
  'AL East': [110, 111, 147, 139, 141], // BAL, BOS, NYY, TB, TOR
  'AL Central': [145, 114, 116, 118, 142], // CWS, CLE, DET, KC, MIN
  'AL West': [117, 108, 133, 136, 140], // HOU, LAA, OAK, SEA, TEX
  'NL East': [144, 146, 121, 143, 120], // ATL, MIA, NYM, PHI, WAS
  'NL Central': [112, 113, 158, 134, 138], // CHC, CIN, MIL, PIT, STL
  'NL West': [109, 115, 119, 135, 137] // ARI, COL, LAD, SD, SF
};

export const LEAGUES = [
  { name: 'American League', divisions: ['AL East', 'AL Central', 'AL West'] },
  { name: 'National League', divisions: ['NL East', 'NL Central', 'NL West'] }
];

// Team abbreviation mapping for MLB Schedule
export const TEAM_ABBREVIATIONS = {
  108: 'LAA', 109: 'ARI', 110: 'BAL', 111: 'BOS', 112: 'CHC', 113: 'CIN', 114: 'CLE',
  115: 'COL', 116: 'DET', 117: 'HOU', 118: 'KC', 119: 'LAD', 120: 'WAS', 121: 'NYM',
  133: 'OAK', 134: 'PIT', 135: 'SD', 136: 'SEA', 137: 'SF', 138: 'STL', 139: 'TB',
  140: 'TEX', 141: 'TOR', 142: 'MIN', 143: 'PHI', 144: 'ATL', 145: 'CWS', 146: 'MIA',
  147: 'NYY', 158: 'MIL'
};

// Logo variants configuration
export const CAP_LOGO_VARIANTS = [
  { key: 'rasterDarkActive', label: 'Raster Dark Active' },
  { key: 'rasterDarkInactive', label: 'Raster Dark Inactive' },
  { key: 'rasterLightActive', label: 'Raster Light Active' },
  { key: 'rasterLightInactive', label: 'Raster Light Inactive' },
  { key: 'svgDarkActive', label: 'SVG Dark Active' },
  { key: 'svgDarkInactive', label: 'SVG Dark Inactive' },
  { key: 'svgLightActive', label: 'SVG Light Active' },
  { key: 'svgLightInactive', label: 'SVG Light Inactive' },
];

export const SPOT_LOGO_VARIANTS = [
  { key: 'rasterActive', label: 'Spot Active' },
  { key: 'rasterInactive', label: 'Spot Inactive' },
  { key: 'svgActive', label: 'Spot SVG Active' },
  { key: 'svgInactive', label: 'Spot SVG Inactive' },
];

// Utility functions
export function getTeamAbbr(teamId) {
  return TEAM_ABBREVIATIONS[teamId] || 'UNK';
}

export function organizeTeamsByDivision(teams) {
  const organized = {};
  Object.entries(TEAM_DIVISIONS).forEach(([division, teamIds]) => {
    organized[division] = teams.filter(team => teamIds.includes(parseInt(team.teamID)));
  });
  return organized;
}

export function getLogoBgColor({ teamID, variantKey, colors }) {
  if (!colors) return '#000';
  
  // Special handling for different logo variants
  if (variantKey?.includes('Light')) {
    return colors.primaryDark || colors.primary || '#000';
  }
  
  return colors.primaryLight || colors.primary || '#fff';
}
