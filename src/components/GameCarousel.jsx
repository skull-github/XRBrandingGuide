import React, { useState, useEffect } from 'react';
import { getTeamSpotColor } from '../utils/spotColorMapping';

export function TeamGameCarousel({ teamId, teamName }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch games for this specific team
  useEffect(() => {
    async function fetchTeamGames() {
      setLoading(true);
      try {
        const today = new Date();
        const upcoming = [];
        
        // Fetch games for today and next 10 days
        for (let i = 0; i < 11; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          const dateStr = date.toISOString().split('T')[0];
          
          const response = await fetch(`https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${dateStr}&teamId=${teamId}&hydrate=team,linescore,decisions`);
          const data = await response.json();
          
          if (data.dates && data.dates.length > 0) {
            data.dates[0].games.forEach(game => {
              upcoming.push({
                ...game,
                gameDate: dateStr
              });
            });
          }
        }
        
        setGames(upcoming);
      } catch (error) {
        console.error('Error fetching team games:', error);
        setGames([]);
      } finally {
        setLoading(false);
      }
    }

    if (teamId) {
      fetchTeamGames();
    }
  }, [teamId]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get game status display
  const getGameStatus = (game) => {
    const statusCode = game.status.statusCode;
    if (statusCode === 'I') return 'Live';
    if (statusCode === 'F') return 'Final';
    if (statusCode === 'S') return 'Scheduled';
    if (statusCode === 'P') return 'Pre-Game';
    if (statusCode === 'D') return 'Delayed';
    if (statusCode === 'PO') return 'Postponed';
    return 'Scheduled';
  };

  // Get team spot logo from MLB Photos API
  const getTeamSpotLogo = (teamId) => {
    return `https://img.mlbstatic.com/mlb-photos/image/upload/w_40,f_png,q_auto/v1/team/${teamId}/logo/spot/current`;
  };

  // Get team abbreviation
  const getTeamAbbr = (teamId) => {
    // This should ideally come from team data, but for now using a simple fallback
    return `T${teamId}`;
  };

  // SpotLogo component similar to schedule
  const SpotLogo = ({ teamId, size = 40, style = {} }) => {
    const spotLogo = getTeamSpotLogo(teamId);
    
    return (
      <div style={{ position: 'relative', ...style }}>
        <img
          src={spotLogo}
          alt={`Team ${teamId} spot logo`}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            objectFit: 'contain',
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
            position: 'relative',
            zIndex: 1
          }}
          onError={(e) => {
            // Fallback to team abbreviation
            e.target.style.display = 'none';
            const textDiv = document.createElement('div');
            textDiv.style.cssText = `color: #fff; font-size: ${size * 0.3}px; font-weight: 700; text-align: center; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center; position: relative; z-index: 1;`;
            textDiv.textContent = getTeamAbbr(teamId);
            e.target.parentNode.insertBefore(textDiv, e.target);
          }}
        />
      </div>
    );
  };

  // Separate live and upcoming games
  const liveGames = games.filter(game => game.status.statusCode === 'I');
  const upcomingGames = games.filter(game => ['S', 'P'].includes(game.status.statusCode));

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        alignItems: 'stretch'
      }}>
        <div style={{ flex: '1 1 0%', minWidth: '300px', display: 'flex' }}>
          <div style={{
            background: '#1a1a1a',
            borderRadius: '8px',
            padding: '1rem',
            border: '1px solid #333',
            marginBottom: '1rem',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', padding: '2rem' }}>
              Loading games...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      gap: '20px',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      alignItems: 'stretch'
    }}>
      {/* Live Game Context */}
      <div style={{ flex: '1 1 0%', minWidth: '300px', display: 'flex' }}>
        <div style={{
          background: '#1a1a1a',
          borderRadius: '8px',
          padding: '1rem',
          border: '1px solid #333',
          marginBottom: '1rem',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h5 style={{
            color: '#4fd1c5',
            marginBottom: '0.5rem',
            fontSize: '16px'
          }}>
            Live Game Context
          </h5>
          <div style={{
            color: '#fff',
            fontSize: '14px',
            lineHeight: '1.6',
            flex: '1 1 0%'
          }}>
            {liveGames.length > 0 ? (
              <div style={{
                display: 'flex',
                gap: '16px',
                overflowX: 'auto',
                paddingBottom: '10px'
              }}>
                {liveGames.slice(0, 3).map((game) => {
                  const awayTeamColor = getTeamSpotColor(game.teams.away.team.id);
                  const homeTeamColor = getTeamSpotColor(game.teams.home.team.id);
                  
                  return (
                    <div
                      key={game.gamePk}
                      style={{
                        minWidth: '240px',
                        flexShrink: 0
                      }}
                    >
                      {/* Game Card - Similar to schedule spotlight */}
                      <div style={{
                        width: '240px',
                        height: '80px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        overflow: 'hidden',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
                      }}>
                        {/* Away Team Section */}
                        <div style={{
                          width: '80px',
                          height: '80px',
                          background: `linear-gradient(135deg, ${awayTeamColor}E6 0%, ${awayTeamColor}B3 100%)`,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          boxShadow: 'inset -4px 0 8px rgba(0, 0, 0, 0.3)'
                        }}>
                          <SpotLogo teamId={game.teams.away.team.id} size={32} />
                        </div>

                        {/* Center Score Section */}
                        <div style={{
                          width: '80px',
                          height: '80px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#2d2d2d',
                          color: '#fff',
                          position: 'relative'
                        }}>
                          <div style={{
                            fontSize: '9px',
                            fontWeight: '600',
                            color: '#4fd1c5',
                            marginBottom: '4px',
                            textAlign: 'center',
                            letterSpacing: '0.5px'
                          }}>
                            LIVE
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '18px',
                            fontWeight: '700',
                            color: '#fff',
                            marginBottom: '4px'
                          }}>
                            <span>{game.linescore ? (game.teams.away.score || 0) : '0'}</span>
                            <span style={{color: 'rgba(255, 255, 255, 0.4)', fontSize: '14px'}}>|</span>
                            <span>{game.linescore ? (game.teams.home.score || 0) : '0'}</span>
                          </div>
                          {game.linescore && game.linescore.currentInning && (
                            <div style={{
                              fontSize: '7px',
                              color: 'rgba(255, 255, 255, 0.6)',
                              textAlign: 'center'
                            }}>
                              {game.linescore.inningState} {game.linescore.currentInning}
                            </div>
                          )}
                        </div>

                        {/* Home Team Section */}
                        <div style={{
                          width: '80px',
                          height: '80px',
                          background: `linear-gradient(135deg, ${homeTeamColor}E6 0%, ${homeTeamColor}B3 100%)`,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          boxShadow: 'inset 4px 0 8px rgba(0, 0, 0, 0.3)'
                        }}>
                          <SpotLogo teamId={game.teams.home.team.id} size={32} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>
                <div><strong>Game:</strong> No live games</div>
                <div><strong>Status:</strong> --</div>
                <div><strong>Date:</strong> --</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Games */}
      <div style={{ flex: '1 1 0%', minWidth: '300px', display: 'flex' }}>
        <div style={{
          background: '#1a1a1a',
          borderRadius: '8px',
          padding: '1rem',
          border: '1px solid #333',
          marginBottom: '1rem',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h5 style={{
            color: '#4fd1c5',
            marginBottom: '1rem',
            fontSize: '16px'
          }}>
            Upcoming Games
          </h5>
          <div style={{
            maxHeight: '200px',
            overflowY: 'auto',
            flex: '1 1 0%'
          }}>
            {upcomingGames.length > 0 ? (
              upcomingGames.slice(0, 8).map((game, index) => (
                <div key={game.gamePk} style={{ marginBottom: '1rem' }}>
                  <div style={{
                    color: '#fff',
                    fontWeight: '600',
                    fontSize: '13px',
                    marginBottom: '0.5rem'
                  }}>
                    {formatDate(game.gameDate)}
                  </div>
                  <div style={{
                    color: '#ccc',
                    fontSize: '12px',
                    marginLeft: '1rem',
                    marginBottom: '0.25rem'
                  }}>
                    {game.teams.away.team.name} @ {game.teams.home.team.name} - {getGameStatus(game)}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: '#ccc', fontSize: '12px' }}>
                No upcoming games scheduled
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
