// Utility to map team names to team IDs using team-extras.json
import teamExtras from './appv2/team-extras.json';

// This mapping should be extended to cover all teams as needed
const teamNameToId = {
  'Arizona Diamondbacks': '109',
  'Baltimore Orioles': '110',
  'Boston Red Sox': '111',
  // ...add all other teams here
};

export function getTeamIdByName(name) {
  return teamNameToId[name] || null;
}

export function getTeamExtrasById(id) {
  return teamExtras[id] || null;
}
