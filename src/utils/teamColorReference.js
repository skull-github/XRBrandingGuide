/**
 * MLB Team Spot Color Reference
 * Complete list of all MLB teams with their official spot colors
 * Generated from spotColorMapping.js
 */

export const MLB_TEAM_COLOR_REFERENCE = [
  // American League East
  { teamId: 110, teamName: 'Baltimore Orioles', abbreviation: 'BAL', spotColor: '#df4601', division: 'AL East' },
  { teamId: 111, teamName: 'Boston Red Sox', abbreviation: 'BOS', spotColor: '#0d2b56', division: 'AL East' },
  { teamId: 147, teamName: 'New York Yankees', abbreviation: 'NYY', spotColor: '#132448', division: 'AL East' },
  { teamId: 139, teamName: 'Tampa Bay Rays', abbreviation: 'TB', spotColor: '#8fbce6', division: 'AL East' },
  { teamId: 141, teamName: 'Toronto Blue Jays', abbreviation: 'TOR', spotColor: '#134a8e', division: 'AL East' },

  // American League Central
  { teamId: 145, teamName: 'Chicago White Sox', abbreviation: 'CWS', spotColor: '#333333', division: 'AL Central' },
  { teamId: 114, teamName: 'Cleveland Guardians', abbreviation: 'CLE', spotColor: '#002b5c', division: 'AL Central' },
  { teamId: 116, teamName: 'Detroit Tigers', abbreviation: 'DET', spotColor: '#0c2c56', division: 'AL Central' },
  { teamId: 118, teamName: 'Kansas City Royals', abbreviation: 'KC', spotColor: '#004687', division: 'AL Central' },
  { teamId: 142, teamName: 'Minnesota Twins', abbreviation: 'MIN', spotColor: '#002b5c', division: 'AL Central' },

  // American League West
  { teamId: 117, teamName: 'Houston Astros', abbreviation: 'HOU', spotColor: '#eb6e1f', division: 'AL West' },
  { teamId: 108, teamName: 'Los Angeles Angels', abbreviation: 'LAA', spotColor: '#862633', division: 'AL West' },
  { teamId: 133, teamName: 'Oakland Athletics', abbreviation: 'ATH', spotColor: '#003831', division: 'AL West' },
  { teamId: 136, teamName: 'Seattle Mariners', abbreviation: 'SEA', spotColor: '#0c2c56', division: 'AL West' },
  { teamId: 140, teamName: 'Texas Rangers', abbreviation: 'TEX', spotColor: '#003278', division: 'AL West' },

  // National League East
  { teamId: 144, teamName: 'Atlanta Braves', abbreviation: 'ATL', spotColor: '#0c2340', division: 'NL East' },
  { teamId: 146, teamName: 'Miami Marlins', abbreviation: 'MIA', spotColor: '#00a3e0', division: 'NL East' },
  { teamId: 121, teamName: 'New York Mets', abbreviation: 'NYM', spotColor: '#002d72', division: 'NL East' },
  { teamId: 143, teamName: 'Philadelphia Phillies', abbreviation: 'PHI', spotColor: '#e81828', division: 'NL East' },
  { teamId: 120, teamName: 'Washington Nationals', abbreviation: 'WSH', spotColor: '#ab0003', division: 'NL East' },

  // National League Central
  { teamId: 112, teamName: 'Chicago Cubs', abbreviation: 'CHC', spotColor: '#0e3386', division: 'NL Central' },
  { teamId: 113, teamName: 'Cincinnati Reds', abbreviation: 'CIN', spotColor: '#c6011f', division: 'NL Central' },
  { teamId: 158, teamName: 'Milwaukee Brewers', abbreviation: 'MIL', spotColor: '#13294b', division: 'NL Central' },
  { teamId: 134, teamName: 'Pittsburgh Pirates', abbreviation: 'PIT', spotColor: '#333333', division: 'NL Central' },
  { teamId: 138, teamName: 'St. Louis Cardinals', abbreviation: 'STL', spotColor: '#be0a14', division: 'NL Central' },

  // National League West
  { teamId: 109, teamName: 'Arizona Diamondbacks', abbreviation: 'AZ', spotColor: '#aa182c', division: 'NL West' },
  { teamId: 115, teamName: 'Colorado Rockies', abbreviation: 'COL', spotColor: '#33006f', division: 'NL West' },
  { teamId: 119, teamName: 'Los Angeles Dodgers', abbreviation: 'LAD', spotColor: '#005a9c', division: 'NL West' },
  { teamId: 135, teamName: 'San Diego Padres', abbreviation: 'SD', spotColor: '#ffc425', division: 'NL West' },
  { teamId: 137, teamName: 'San Francisco Giants', abbreviation: 'SF', spotColor: '#fd5a1e', division: 'NL West' },

  // Additional Teams
  { teamId: 159, teamName: 'Team 159', abbreviation: 'T159', spotColor: '#bc0022', division: 'Additional' },
  { teamId: 160, teamName: 'Team 160', abbreviation: 'T160', spotColor: '#041e42', division: 'Additional' },
];

/**
 * Get team color reference by team ID
 * @param {number} teamId - The MLB team ID
 * @returns {object|null} Team color reference object or null if not found
 */
export const getTeamColorReference = (teamId) => {
  return MLB_TEAM_COLOR_REFERENCE.find(team => team.teamId === teamId) || null;
};

/**
 * Get all teams by division
 * @param {string} division - The division name (e.g., 'AL East', 'NL Central')
 * @returns {array} Array of teams in the specified division
 */
export const getTeamsByDivision = (division) => {
  return MLB_TEAM_COLOR_REFERENCE.filter(team => team.division === division);
};

/**
 * Get all divisions
 * @returns {array} Array of unique division names
 */
export const getAllDivisions = () => {
  return [...new Set(MLB_TEAM_COLOR_REFERENCE.map(team => team.division))];
};

/**
 * Export as CSV format
 * @returns {string} CSV formatted team color reference
 */
export const exportAsCSV = () => {
  const headers = 'Team ID,Team Name,Abbreviation,Spot Color,Division\n';
  const rows = MLB_TEAM_COLOR_REFERENCE.map(team => 
    `${team.teamId},"${team.teamName}",${team.abbreviation},${team.spotColor},"${team.division}"`
  ).join('\n');
  return headers + rows;
};

/**
 * Export as JSON format
 * @returns {string} JSON formatted team color reference
 */
export const exportAsJSON = () => {
  return JSON.stringify(MLB_TEAM_COLOR_REFERENCE, null, 2);
};
