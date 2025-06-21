import { useState, useEffect } from 'react';

// Custom hook for team spot color
export function useTeamSpotColor(teamID) {
  const [spotColor, setSpotColor] = useState('#fff');
  
  useEffect(() => {
    if (!teamID) return;
    
    async function fetchTeamColors() {
      try {
        const response = await fetch('https://storage.mobile.mlbinfra.com/atbatconfig/branding.json');
        const data = await response.json();
        const team = data.teams.find(t => t.teamID === parseInt(teamID));
        
        if (team?.teamColors?.primaryLight) {
          setSpotColor(team.teamColors.primaryLight);
        }
      } catch (error) {
        console.error('Error fetching team colors:', error);
      }
    }
    
    fetchTeamColors();
  }, [teamID]);
  
  return spotColor;
}

// Custom hook for bigpapi spot color
export function useBigpapiSpotColor(teamID) {
  const [spotColor, setSpotColor] = useState('#fff');
  
  useEffect(() => {
    if (!teamID) return;
    
    async function fetchBigpapiColor() {
      try {
        const response = await fetch('https://storage.mobile.mlbinfra.com/atbatconfig/branding.json');
        const data = await response.json();
        const team = data.teams.find(t => t.teamID === parseInt(teamID));
        
        if (team?.teamColors?.primaryLight) {
          setSpotColor(team.teamColors.primaryLight);
        }
      } catch (error) {
        console.error('Error fetching bigpapi color:', error);
      }
    }
    
    fetchBigpapiColor();
  }, [teamID]);
  
  return spotColor;
}

// Date formatting utilities
export function formatDateForAPI(date) {
  return date.toISOString().split('T')[0];
}

export function formatDateForDisplay(date) {
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
}

export function formatTime(dateTimeString) {
  if (!dateTimeString) return 'TBD';
  try {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      timeZoneName: 'short'
    });
  } catch (e) {
    return 'TBD';
  }
}
