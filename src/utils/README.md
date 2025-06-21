# MLB Spot Color Mapping

This directory contains the official MLB team spot color mapping for use throughout the XR Branding Guide application.

## Files

- `spotColorMapping.js` - Main mapping file with official spot color hex values
- `spotColorTest.js` - Test utilities for validating the mapping

## Usage

### Basic Usage

```javascript
import { getTeamSpotColor } from '../utils/spotColorMapping';

// Get spot color for a team
const yankeeSpotColor = getTeamSpotColor(147); // Returns: #132448
const dodgerSpotColor = getTeamSpotColor(119); // Returns: #005A9C
```

### React Hook Integration

The mapping is already integrated into the React hooks in `/src/hooks/useTeamData.js`:

```javascript
import { useTeamSpotColor } from '../hooks/useTeamData';

function TeamComponent({ teamId }) {
  const spotColor = useTeamSpotColor(teamId);
  
  return (
    <div style={{ backgroundColor: spotColor }}>
      Team content with official spot color background
    </div>
  );
}
```

### All Available Functions

```javascript
import { 
  getTeamSpotColor, 
  getAllTeamSpotColors, 
  hasTeamSpotColor 
} from '../utils/spotColorMapping';

// Get spot color for a specific team
getTeamSpotColor(147); // #132448

// Check if a team has a spot color defined
hasTeamSpotColor(147); // true
hasTeamSpotColor(999); // false

// Get all teams with their spot colors
getAllTeamSpotColors(); // Array of {teamId, spotColor} objects
```

## Spot Color Reference

The spot colors are organized by division:

### American League East
- 110: Baltimore Orioles - `#df4601` (Orange)
- 111: Boston Red Sox - `#0d2b56` (Navy)
- 147: New York Yankees - `#132448` (Navy)
- 139: Tampa Bay Rays - `#8fbce6` (Light Blue)
- 141: Toronto Blue Jays - `#134a8e` (Blue)

### American League Central
- 145: Chicago White Sox - `#333333` (Gray)
- 114: Cleveland Guardians - `#002b5c` (Navy)
- 116: Detroit Tigers - `#0c2c56` (Navy)
- 118: Kansas City Royals - `#004687` (Blue)
- 142: Minnesota Twins - `#002b5c` (Navy)

### American League West
- 117: Houston Astros - `#eb6e1f` (Orange)
- 108: Los Angeles Angels - `#862633` (Red)
- 133: Oakland Athletics - `#003831` (Green)
- 136: Seattle Mariners - `#0c2c56` (Navy)
- 140: Texas Rangers - `#003278` (Blue)

### National League East
- 144: Atlanta Braves - `#0c2340` (Navy)
- 146: Miami Marlins - `#00a3e0` (Blue)
- 121: New York Mets - `#002d72` (Navy)
- 143: Philadelphia Phillies - `#e81828` (Red)
- 120: Washington Nationals - `#ab0003` (Red)

### National League Central
- 112: Chicago Cubs - `#0e3386` (Blue)
- 113: Cincinnati Reds - `#c6011f` (Red)
- 158: Milwaukee Brewers - `#13294b` (Navy)
- 134: Pittsburgh Pirates - `#333333` (Gray)
- 138: St. Louis Cardinals - `#be0a14` (Red)

### National League West
- 109: Arizona Diamondbacks - `#aa182c` (Red)
- 115: Colorado Rockies - `#33006f` (Purple)
- 119: Los Angeles Dodgers - `#005a9c` (Blue)
- 135: San Diego Padres - `#ffc425` (Yellow)
- 137: San Francisco Giants - `#fd5a1e` (Orange)

### Additional Teams
- 159: Team 159 - `#bc0022` (Red)
- 160: Team 160 - `#041e42` (Navy)

## Important Notes

1. **Spot Colors vs Secondary Colors**: These are the official spot colors, not the secondary colors from the BigData API. The spot color is the primary brand color used behind team logos and in branded elements.

2. **Future Reference**: This mapping should be used throughout the application instead of trying to extract colors from images or using secondary colors from the API.

3. **Consistency**: All components using team colors should use this mapping to ensure consistent branding across the application.

4. **Testing**: Run the test utilities in `spotColorTest.js` to validate the mapping after any changes.

## Components Updated

The following components have been updated to use this mapping:

- `/src/components/MLBSchedule.jsx` - Schedule cards now use official spot colors
- `/src/components/AnchorMenu.js` - Team buttons use official spot colors  
- `/src/hooks/useTeamData.js` - React hooks now use the mapping
- `/src/App.jsx` - Main app components use the mapping

This ensures consistent, official MLB branding throughout the entire application.
