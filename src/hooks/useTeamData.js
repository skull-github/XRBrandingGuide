import { useState, useEffect } from 'react';
import { getTeamSpotColor } from '../utils/spotColorMapping';

// Custom hook for team spot color - now uses official spot color mapping
export function useTeamSpotColor(teamID) {
  const [spotColor, setSpotColor] = useState('#fff');
  
  useEffect(() => {
    if (!teamID) return;
    
    // Use the official spot color mapping
    const officialSpotColor = getTeamSpotColor(teamID);
    setSpotColor(officialSpotColor);
  }, [teamID]);
  
  return spotColor;
}

// Custom hook for bigpapi spot color - now uses official spot color mapping
export function useBigpapiSpotColor(teamID) {
  const [spotColor, setSpotColor] = useState('#fff');
  
  useEffect(() => {
    if (!teamID) return;
    
    // Use the official spot color mapping (same as regular spot color)
    const officialSpotColor = getTeamSpotColor(teamID);
    setSpotColor(officialSpotColor);
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
