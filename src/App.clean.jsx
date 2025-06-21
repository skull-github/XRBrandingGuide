import { useState, useEffect } from 'react'
import './App.css'
import teamExtras from './team-extras.json'
import { MLBSchedule } from './components/MLBSchedule'
import { AnchorMenu } from './components/AnchorMenu'
import { setupAudioInteraction } from './utils/audio'
import { TEAM_DIVISIONS, LEAGUES } from './utils/teamUtils'

// Import the main TeamCard component (we'll need to extract this too)
import { TeamCard } from './components/TeamCard'

function AppV2() {
  const [teams, setTeams] = useState([])
  const [alAllStars, setAlAllStars] = useState([])
  const [nlAllStars, setNlAllStars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPlayers, setSelectedPlayers] = useState({});

  // Setup audio interaction
  useEffect(() => {
    const cleanup = setupAudioInteraction();
    return cleanup;
  }, []);

  // Fetch team data
  useEffect(() => {
    async function fetchBranding() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('https://storage.mobile.mlbinfra.com/atbatconfig/branding.json')
        if (!res.ok) throw new Error('Failed to fetch branding data')
        const data = await res.json()
        
        // Merge teamExtras into each team
        const mergedTeams = data.teams
          .filter(team => String(team.teamID) !== '0')
          .map(team => {
            const extras = teamExtras[String(team.teamID)] || {};
            return { ...team, ...extras };
          });
          
        setTeams(mergedTeams)
        setAlAllStars(data.allstarTeams.filter(t => t.club === 'al').map(team => ({ ...team, ...(teamExtras[String(team.teamID)] || {}) })));
        setNlAllStars(data.allstarTeams.filter(t => t.club === 'nl').map(team => ({ ...team, ...(teamExtras[String(team.teamID)] || {}) })));
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchBranding()
  }, [])

  if (loading) return <div className="App"><p>Loading branding data...</p></div>
  if (error) {
    console.error('Branding fetch error:', error);
    return (
      <div className="App" style={{ background: '#fff', color: '#e74c3c', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <h2 style={{ color: '#e74c3c', marginBottom: 16 }}>Error loading branding data</h2>
        <p style={{ color: '#e74c3c', fontSize: 18, fontWeight: 600 }}>Error: {error}</p>
        <p style={{ color: '#333', marginTop: 24 }}>Check your network connection or try again later.</p>
      </div>
    );
  }

  const colorPriority = ['primaryLight', 'primaryDark', 'secondary', 'tertiary'];

  return (
    <div className="App" style={{ 
      padding: '2.5rem', 
      maxWidth: 1200, 
      margin: '0 auto', 
      alignItems: 'flex-start', 
      justifyContent: 'flex-start', 
      minHeight: '100vh' 
    }}>
      {/* Anchor menu at very top */}
      {teams.length > 0 && (
        <AnchorMenu teams={teams} />
      )}
      
      {/* MLB Schedule below anchor menu */}
      <MLBSchedule />
      
      {/* Teams organized by league and division */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '40px', 
        width: '100%', 
        marginBottom: '3rem', 
        alignItems: 'flex-start' 
      }}>
        {LEAGUES.map(league => (
          <div key={league.name} style={{ width: '100%' }}>
            <h2 style={{ 
              color: '#4fd1c5', 
              fontSize: 28, 
              fontWeight: 800, 
              marginBottom: '1rem', 
              textAlign: 'left', 
              letterSpacing: 1 
            }}>
              {league.name}
            </h2>
            
            {league.divisions.map(division => (
              <div key={division} style={{ marginBottom: '2rem' }}>
                <h3 style={{ 
                  color: '#fff', 
                  fontSize: 20, 
                  fontWeight: 600, 
                  marginBottom: '1rem', 
                  textAlign: 'left' 
                }}>
                  {division}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  {teams.filter(team => TEAM_DIVISIONS[division]?.includes(parseInt(team.teamID))).map(team => (
                    <section 
                      key={team.teamID || team.clubFullName} 
                      id={`team-${team.teamID || team.clubFullName.replace(/\s+/g, '-').toLowerCase()}`}
                      style={{ 
                        width: '100%', 
                        marginBottom: 0, 
                        padding: '32px 0', 
                        alignItems: 'flex-start', 
                        display: 'flex', 
                        flexDirection: 'column' 
                      }}
                    >
                      <TeamCard
                        team={team}
                        opts={{ showPlayer: true }}
                        selectedPlayerId={selectedPlayers[team.teamID] || ''}
                        setSelectedPlayers={setSelectedPlayers}
                        colorPriority={colorPriority}
                      />
                    </section>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* All-Star teams */}
      <div style={{ marginTop: '3rem', width: '100%', alignItems: 'flex-start' }}>
        <div id="al-allstars" style={{ minWidth: 320, marginBottom: '2.5rem' }}>
          <h3 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.5rem', textAlign: 'center' }}>
            American League All-Stars
          </h3>
          <div className="branding-grid">
            {alAllStars.map(team => (
              <TeamCard
                key={team.teamID || team.clubFullName}
                team={team}
                opts={{ showPlayer: false }}
                selectedPlayerId={selectedPlayers[team.teamID] || ''}
                setSelectedPlayers={setSelectedPlayers}
                colorPriority={colorPriority}
              />
            ))}
          </div>
        </div>
        <div id="nl-allstars" style={{ minWidth: 320 }}>
          <h3 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.5rem', textAlign: 'center' }}>
            National League All-Stars
          </h3>
          <div className="branding-grid">
            {nlAllStars.map(team => (
              <TeamCard
                key={team.teamID || team.clubFullName}
                team={team}
                opts={{ showPlayer: false }}
                selectedPlayerId={selectedPlayers[team.teamID] || ''}
                setSelectedPlayers={setSelectedPlayers}
                colorPriority={colorPriority}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ 
        marginTop: '3rem', 
        padding: '2rem', 
        textAlign: 'center', 
        color: '#888', 
        fontSize: 14, 
        borderTop: '1px solid #333' 
      }}>
        <p>MLB XR Branding Guide - Updated {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default AppV2;
