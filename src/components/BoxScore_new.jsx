import React, { useState, useEffect } from 'react';
import { getTeamSpotColor } from '../utils/spotColorMapping';

export function BoxScore({ gamePk, onClose, isVisible }) {
  const [boxScoreData, setBoxScoreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (gamePk && isVisible) {
      fetchBoxScore();
    }
  }, [gamePk, isVisible]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchBoxScore = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://statsapi.mlb.com/api/v1/game/${gamePk}/boxscore`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch box score data');
      }
      
      const data = await response.json();
      setBoxScoreData(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching box score:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTeamSpotLogo = (teamId) => {
    return `https://img.mlbstatic.com/mlb-photos/image/upload/w_80,f_png,q_auto/v1/team/${teamId}/logo/spot/current`;
  };

  const formatPlayerName = (player) => {
    if (!player || !player.person) return 'Unknown Player';
    return player.person.fullName || 'Unknown Player';
  };

  const formatPosition = (position) => {
    if (!position) return 'UNK';
    return position.abbreviation || position.name || 'UNK';
  };

  const formatBattingStats = (playerStats) => {
    if (!playerStats || !playerStats.batting) return { ab: 0, r: 0, h: 0, rbi: 0, bb: 0, so: 0, k: 0, lob: 0 };
    const batting = playerStats.batting;
    return {
      ab: batting.atBats || 0,
      r: batting.runs || 0,
      h: batting.hits || 0,
      rbi: batting.rbi || 0,
      bb: batting.baseOnBalls || 0,
      so: batting.strikeOuts || 0,
      k: batting.strikeOuts || 0,
      lob: batting.leftOnBase || 0
    };
  };

  const formatPitchingStats = (playerStats) => {
    if (!playerStats || !playerStats.pitching) return { ip: '0.0', h: 0, r: 0, er: 0, bb: 0, so: 0, era: '0.00' };
    const pitching = playerStats.pitching;
    return {
      ip: pitching.inningsPitched || '0.0',
      h: pitching.hits || 0,
      r: pitching.runs || 0,
      er: pitching.earnedRuns || 0,
      bb: pitching.baseOnBalls || 0,
      so: pitching.strikeOuts || 0,
      era: pitching.era || '0.00'
    };
  };

  const getIconFilter = (teamId) => {
    const color = getTeamSpotColor(teamId);
    if (color === '#fff') return 'brightness(0) invert(1)';
    
    // Convert hex to RGB for filter calculation
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate hue for the filter
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    let hue = 0;
    
    if (delta !== 0) {
      if (max === r) hue = 60 * ((g - b) / delta);
      else if (max === g) hue = 60 * (2 + (b - r) / delta);
      else hue = 60 * (4 + (r - g) / delta);
    }
    
    if (hue < 0) hue += 360;
    
    return `brightness(0) saturate(100%) invert(0) sepia(1) hue-rotate(${hue}deg)`;
  };

  const getInningByInningData = () => {
    if (!boxScoreData || !boxScoreData.linescore) return [];
    
    const away = boxScoreData.teams.away;
    const home = boxScoreData.teams.home;
    
    return [
      {
        id: away.team.id,
        abbreviation: away.team.abbreviation,
        innings: boxScoreData.linescore.innings.map(inning => inning.away?.runs || 0),
        r: away.teamStats?.batting?.runs || 0,
        h: away.teamStats?.batting?.hits || 0,
        e: away.teamStats?.fielding?.errors || 0
      },
      {
        id: home.team.id,
        abbreviation: home.team.abbreviation,
        innings: boxScoreData.linescore.innings.map(inning => inning.home?.runs || 0),
        r: home.teamStats?.batting?.runs || 0,
        h: home.teamStats?.batting?.hits || 0,
        e: home.teamStats?.fielding?.errors || 0
      }
    ];
  };

  const renderBattingTable = (team, teamData) => {
    if (!teamData || !teamData.batters) return null;

    const batters = teamData.batters.map(batterId => {
      const player = teamData.players[`ID${batterId}`];
      return {
        ...player,
        stats: formatBattingStats(player.stats)
      };
    });

    // Calculate team totals
    const teamTotals = batters.reduce((totals, player) => {
      const stats = player.stats;
      return {
        ab: totals.ab + stats.ab,
        r: totals.r + stats.r,
        h: totals.h + stats.h,
        rbi: totals.rbi + stats.rbi,
        bb: totals.bb + stats.bb,
        so: totals.so + stats.so,
        k: totals.k + stats.k,
        lob: totals.lob + stats.lob
      };
    }, { ab: 0, r: 0, h: 0, rbi: 0, bb: 0, so: 0, k: 0, lob: 0 });

    return (
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontFamily: '"MLB HEX Franklin", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
          fontSize: '32px',
          fontWeight: '700',
          lineHeight: '1.2',
          letterSpacing: '-0.01em',
          color: getTeamSpotColor(teamData.team.id),
          marginBottom: '16px',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center'
        }}>
          <img 
            src="/src/Assets/icons/icon_box_solid.svg" 
            alt="" 
            style={{
              width: '24px',
              height: '24px',
              marginRight: '8px',
              filter: getIconFilter(teamData.team.id)
            }}
          />
          {teamData.team.name} Batting
        </h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            minWidth: '640px',
            borderCollapse: 'collapse',
            fontFamily: '"MLB HEX Franklin", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
          }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #666' }}>
                <th style={{
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '16px',
                  lineHeight: '1.3',
                  padding: '12px 16px',
                  textAlign: 'left',
                  minWidth: '180px'
                }}>PLAYER</th>
                <th style={{
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '16px',
                  lineHeight: '1.3',
                  padding: '12px',
                  textAlign: 'center',
                  width: '60px'
                }}>POS</th>
                <th style={{
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '16px',
                  lineHeight: '1.3',
                  padding: '12px',
                  textAlign: 'center',
                  width: '50px'
                }}>AB</th>
                <th style={{
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '16px',
                  lineHeight: '1.3',
                  padding: '12px',
                  textAlign: 'center',
                  width: '50px'
                }}>R</th>
                <th style={{
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '16px',
                  lineHeight: '1.3',
                  padding: '12px',
                  textAlign: 'center',
                  width: '50px'
                }}>H</th>
                <th style={{
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '16px',
                  lineHeight: '1.3',
                  padding: '12px',
                  textAlign: 'center',
                  width: '50px'
                }}>RBI</th>
                <th style={{
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '16px',
                  lineHeight: '1.3',
                  padding: '12px',
                  textAlign: 'center',
                  width: '50px'
                }}>BB</th>
                <th style={{
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '16px',
                  lineHeight: '1.3',
                  padding: '12px',
                  textAlign: 'center',
                  width: '50px'
                }}>SO</th>
                <th style={{
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '16px',
                  lineHeight: '1.3',
                  padding: '12px',
                  textAlign: 'center',
                  width: '50px'
                }}>LOB</th>
              </tr>
            </thead>
            <tbody>
              {batters.map((player, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{
                    padding: '12px 16px',
                    fontWeight: '500',
                    fontSize: '15px',
                    color: '#fff'
                  }}>
                    {formatPlayerName(player)}
                  </td>
                  <td style={{
                    textAlign: 'center',
                    fontWeight: '400',
                    fontSize: '15px',
                    color: '#ccc',
                    padding: '12px'
                  }}>
                    {formatPosition(player.position)}
                  </td>
                  <td style={{
                    textAlign: 'center',
                    fontWeight: '400',
                    fontSize: '15px',
                    color: '#fff',
                    padding: '12px'
                  }}>
                    {player.stats.ab}
                  </td>
                  <td style={{
                    textAlign: 'center',
                    fontWeight: '400',
                    fontSize: '15px',
                    color: '#fff',
                    padding: '12px'
                  }}>
                    {player.stats.r}
                  </td>
                  <td style={{
                    textAlign: 'center',
                    fontWeight: '400',
                    fontSize: '15px',
                    color: '#fff',
                    padding: '12px'
                  }}>
                    {player.stats.h}
                  </td>
                  <td style={{
                    textAlign: 'center',
                    fontWeight: '400',
                    fontSize: '15px',
                    color: '#fff',
                    padding: '12px'
                  }}>
                    {player.stats.rbi}
                  </td>
                  <td style={{
                    textAlign: 'center',
                    fontWeight: '400',
                    fontSize: '15px',
                    color: '#fff',
                    padding: '12px'
                  }}>
                    {player.stats.bb}
                  </td>
                  <td style={{
                    textAlign: 'center',
                    fontWeight: '400',
                    fontSize: '15px',
                    color: '#fff',
                    padding: '12px'
                  }}>
                    {player.stats.so}
                  </td>
                  <td style={{
                    textAlign: 'center',
                    fontWeight: '400',
                    fontSize: '15px',
                    color: '#fff',
                    padding: '12px'
                  }}>
                    {player.stats.lob}
                  </td>
                </tr>
              ))}
              <tr style={{ 
                borderTop: '2px solid #666',
                backgroundColor: 'rgba(255, 255, 255, 0.03)'
              }}>
                <td style={{
                  padding: '12px 16px',
                  fontWeight: '700',
                  fontSize: '15px',
                  color: '#fff'
                }}>
                  TOTALS
                </td>
                <td style={{
                  textAlign: 'center',
                  fontWeight: '400',
                  fontSize: '15px',
                  color: '#ccc',
                  padding: '12px'
                }}>
                  -
                </td>
                <td style={{
                  textAlign: 'center',
                  fontWeight: '700',
                  fontSize: '15px',
                  color: '#fff',
                  padding: '12px'
                }}>
                  {teamTotals.ab}
                </td>
                <td style={{
                  textAlign: 'center',
                  fontWeight: '700',
                  fontSize: '15px',
                  color: '#fff',
                  padding: '12px'
                }}>
                  {teamTotals.r}
                </td>
                <td style={{
                  textAlign: 'center',
                  fontWeight: '700',
                  fontSize: '15px',
                  color: '#fff',
                  padding: '12px'
                }}>
                  {teamTotals.h}
                </td>
                <td style={{
                  textAlign: 'center',
                  fontWeight: '700',
                  fontSize: '15px',
                  color: '#fff',
                  padding: '12px'
                }}>
                  {teamTotals.rbi}
                </td>
                <td style={{
                  textAlign: 'center',
                  fontWeight: '700',
                  fontSize: '15px',
                  color: '#fff',
                  padding: '12px'
                }}>
                  {teamTotals.bb}
                </td>
                <td style={{
                  textAlign: 'center',
                  fontWeight: '700',
                  fontSize: '15px',
                  color: '#fff',
                  padding: '12px'
                }}>
                  {teamTotals.so}
                </td>
                <td style={{
                  textAlign: 'center',
                  fontWeight: '700',
                  fontSize: '15px',
                  color: '#fff',
                  padding: '12px'
                }}>
                  {teamTotals.lob}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderPitchingTable = (team, teamData) => {
    if (!teamData || !teamData.pitchers) return null;

    const pitchers = teamData.pitchers.map(pitcherId => {
      const player = teamData.players[`ID${pitcherId}`];
      return {
        ...player,
        stats: formatPitchingStats(player.stats)
      };
    });

    return (
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontFamily: '"MLB HEX Franklin", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
          fontSize: '32px',
          fontWeight: '700',
          lineHeight: '1.2',
          letterSpacing: '-0.01em',
          color: getTeamSpotColor(teamData.team.id),
          marginBottom: '16px',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center'
        }}>
          <img 
            src="/src/Assets/icons/icon_baseball_outline.svg" 
            alt="" 
            style={{
              width: '24px',
              height: '24px',
              marginRight: '8px',
              filter: getIconFilter(teamData.team.id)
            }}
          />
          {teamData.team.name} Pitching
        </h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            minWidth: '640px',
            borderCollapse: 'collapse',
            fontFamily: '"MLB HEX Franklin", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
          }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #666' }}>
                <th style={{
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '16px',
                  lineHeight: '1.3',
                  padding: '12px 16px',
                  textAlign: 'left',
                  minWidth: '180px'
                }}>PITCHER</th>
                <th style={{
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '16px',
                  lineHeight: '1.3',
                  padding: '12px',
                  textAlign: 'center',
                  width: '60px'
                }}>IP</th>
                <th style={{
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '16px',
                  lineHeight: '1.3',
                  padding: '12px',
                  textAlign: 'center',
                  width: '50px'
                }}>H</th>
                <th style={{
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '16px',
                  lineHeight: '1.3',
                  padding: '12px',
                  textAlign: 'center',
                  width: '50px'
                }}>R</th>
                <th style={{
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '16px',
                  lineHeight: '1.3',
                  padding: '12px',
                  textAlign: 'center',
                  width: '50px'
                }}>ER</th>
                <th style={{
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '16px',
                  lineHeight: '1.3',
                  padding: '12px',
                  textAlign: 'center',
                  width: '50px'
                }}>BB</th>
                <th style={{
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '16px',
                  lineHeight: '1.3',
                  padding: '12px',
                  textAlign: 'center',
                  width: '50px'
                }}>SO</th>
                <th style={{
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '16px',
                  lineHeight: '1.3',
                  padding: '12px',
                  textAlign: 'center',
                  width: '60px'
                }}>ERA</th>
              </tr>
            </thead>
            <tbody>
              {pitchers.map((player, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{
                    padding: '12px 16px',
                    fontWeight: '500',
                    fontSize: '15px',
                    color: '#fff'
                  }}>
                    {formatPlayerName(player)}
                  </td>
                  <td style={{
                    textAlign: 'center',
                    fontWeight: '400',
                    fontSize: '15px',
                    color: '#fff',
                    padding: '12px'
                  }}>
                    {player.stats.ip}
                  </td>
                  <td style={{
                    textAlign: 'center',
                    fontWeight: '400',
                    fontSize: '15px',
                    color: '#fff',
                    padding: '12px'
                  }}>
                    {player.stats.h}
                  </td>
                  <td style={{
                    textAlign: 'center',
                    fontWeight: '400',
                    fontSize: '15px',
                    color: '#fff',
                    padding: '12px'
                  }}>
                    {player.stats.r}
                  </td>
                  <td style={{
                    textAlign: 'center',
                    fontWeight: '400',
                    fontSize: '15px',
                    color: '#fff',
                    padding: '12px'
                  }}>
                    {player.stats.er}
                  </td>
                  <td style={{
                    textAlign: 'center',
                    fontWeight: '400',
                    fontSize: '15px',
                    color: '#fff',
                    padding: '12px'
                  }}>
                    {player.stats.bb}
                  </td>
                  <td style={{
                    textAlign: 'center',
                    fontWeight: '400',
                    fontSize: '15px',
                    color: '#fff',
                    padding: '12px'
                  }}>
                    {player.stats.so}
                  </td>
                  <td style={{
                    textAlign: 'center',
                    fontWeight: '400',
                    fontSize: '15px',
                    color: '#fff',
                    padding: '12px'
                  }}>
                    {player.stats.era}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#1a1a1a',
        borderRadius: '12px',
        width: '95%',
        maxWidth: '1200px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '1px solid #333'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '0',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '4px',
            transition: 'background-color 0.2s ease',
            zIndex: 10,
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          aria-label="Close BoxScore"
        >
          <img 
            src="/src/Assets/icons/icon_close.svg" 
            alt="Close" 
            style={{
              width: '24px',
              height: '24px',
              filter: 'brightness(0) invert(1)'
            }}
          />
        </button>

        <div style={{ padding: '24px' }}>
          {loading && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '300px',
              color: '#fff',
              fontFamily: '"MLB HEX Franklin", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
              fontSize: '16px'
            }}>
              <img 
                src="/src/Assets/icons/icon_scoreboard.svg" 
                alt="" 
                style={{
                  width: '32px',
                  height: '32px',
                  marginRight: '12px',
                  filter: 'brightness(0) invert(1)',
                  animation: 'pulse 2s infinite'
                }}
              />
              Loading box score...
            </div>
          )}

          {error && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '300px',
              color: '#ff6b6b',
              fontFamily: '"MLB HEX Franklin", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
              fontSize: '16px'
            }}>
              <img 
                src="/src/Assets/icons/icon_alert_solid.svg" 
                alt="" 
                style={{
                  width: '24px',
                  height: '24px',
                  marginRight: '8px',
                  filter: 'brightness(0) saturate(100%) invert(46%) sepia(79%) saturate(2476%) hue-rotate(340deg) brightness(98%) contrast(95%)'
                }}
              />
              Error: {error}
            </div>
          )}

          {boxScoreData && (
            <>
              {/* Header with team logos and scores */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px',
                paddingTop: '20px'
              }}>
                {[boxScoreData.teams.away, boxScoreData.teams.home].map((teamData, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      width: '96px',
                      height: '96px',
                      marginBottom: '8px'
                    }}>
                      <img
                        src={getTeamSpotLogo(teamData.team.id)}
                        alt={`${teamData.team.name} logo`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                    <h2 style={{
                      fontFamily: '"MLB HEX Franklin", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
                      fontSize: '48px',
                      fontWeight: '700',
                      lineHeight: '1.15',
                      letterSpacing: '-0.02em',
                      color: getTeamSpotColor(teamData.team.id),
                      margin: '0 0 8px 0',
                      textAlign: 'center'
                    }}>
                      {teamData.team.name.toUpperCase()}
                    </h2>
                    <span style={{
                      fontFamily: '"MLB HEX Franklin", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
                      fontSize: '80px',
                      fontWeight: '700',
                      lineHeight: '1.1',
                      letterSpacing: '-0.02em',
                      color: '#fff',
                      margin: 0
                    }}>
                      {teamData.teamStats?.batting?.runs || 0}
                    </span>
                  </div>
                ))}
              </div>

              {/* Separator */}
              <div style={{
                height: '1px',
                backgroundColor: '#666',
                margin: '24px 0'
              }} />

              {/* Inning by inning score */}
              <div style={{
                overflowX: 'auto',
                marginBottom: '32px'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontFamily: '"MLB HEX Franklin", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
                }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #666' }}>
                      <th style={{
                        color: '#fff',
                        fontWeight: '700',
                        fontSize: '24px',
                        lineHeight: '1.3',
                        padding: '12px 16px',
                        textAlign: 'left',
                        width: '80px'
                      }}>
                        TEAM
                      </th>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((inning) => (
                        <th key={inning} style={{
                          color: '#fff',
                          fontWeight: '700',
                          fontSize: '24px',
                          lineHeight: '1.3',
                          padding: '12px',
                          textAlign: 'center',
                          width: '48px'
                        }}>
                          {inning}
                        </th>
                      ))}
                      <th style={{
                        color: '#fff',
                        fontWeight: '700',
                        fontSize: '24px',
                        lineHeight: '1.3',
                        padding: '12px',
                        textAlign: 'center',
                        width: '48px'
                      }}>
                        R
                      </th>
                      <th style={{
                        color: '#fff',
                        fontWeight: '700',
                        fontSize: '24px',
                        lineHeight: '1.3',
                        padding: '12px',
                        textAlign: 'center',
                        width: '48px'
                      }}>
                        H
                      </th>
                      <th style={{
                        color: '#fff',
                        fontWeight: '700',
                        fontSize: '24px',
                        lineHeight: '1.3',
                        padding: '12px',
                        textAlign: 'center',
                        width: '48px'
                      }}>
                        E
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getInningByInningData().map((team, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #333' }}>
                        <td style={{
                          textAlign: 'left',
                          fontWeight: '700',
                          fontSize: '17px',
                          color: getTeamSpotColor(team.id),
                          padding: '12px 16px'
                        }}>
                          {team.abbreviation}
                        </td>
                        {team.innings.map((inning, inningIndex) => (
                          <td key={inningIndex} style={{
                            textAlign: 'center',
                            fontWeight: '400',
                            fontSize: '17px',
                            color: '#fff',
                            padding: '12px'
                          }}>
                            {inning || 0}
                          </td>
                        ))}
                        <td style={{
                          textAlign: 'center',
                          fontWeight: '700',
                          fontSize: '17px',
                          color: '#fff',
                          padding: '12px'
                        }}>
                          {team.r}
                        </td>
                        <td style={{
                          textAlign: 'center',
                          fontWeight: '400',
                          fontSize: '17px',
                          color: '#fff',
                          padding: '12px'
                        }}>
                          {team.h}
                        </td>
                        <td style={{
                          textAlign: 'center',
                          fontWeight: '400',
                          fontSize: '17px',
                          color: '#fff',
                          padding: '12px'
                        }}>
                          {team.e}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Batting Tables */}
              {renderBattingTable('Away', boxScoreData.teams.away)}
              {renderBattingTable('Home', boxScoreData.teams.home)}

              {/* Pitching Tables */}
              {renderPitchingTable('Away', boxScoreData.teams.away)}
              {renderPitchingTable('Home', boxScoreData.teams.home)}

              {/* Game info */}
              {boxScoreData.gameInfo && (
                <div style={{
                  marginTop: '32px',
                  padding: '20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  fontFamily: '"MLB HEX Franklin", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
                  fontSize: '14px',
                  color: '#ccc',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img 
                      src="/src/Assets/icons/icon_stadium.svg" 
                      alt="" 
                      style={{
                        width: '16px',
                        height: '16px',
                        marginRight: '8px',
                        filter: 'brightness(0) invert(1)'
                      }}
                    />
                    <span>
                      <strong style={{ 
                        color: '#fff',
                        fontWeight: '600'
                      }}>Venue:</strong> {boxScoreData.gameInfo.venue || 'N/A'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img 
                      src="/src/Assets/icons/icon_weather_sunny.svg" 
                      alt="" 
                      style={{
                        width: '16px',
                        height: '16px',
                        marginRight: '8px',
                        filter: 'brightness(0) invert(1)'
                      }}
                    />
                    <span>
                      <strong style={{ 
                        color: '#fff',
                        fontWeight: '600'
                      }}>Weather:</strong> {boxScoreData.gameInfo.weather || 'N/A'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img 
                      src="/src/Assets/icons/icon_weather_windy.svg" 
                      alt="" 
                      style={{
                        width: '16px',
                        height: '16px',
                        marginRight: '8px',
                        filter: 'brightness(0) invert(1)'
                      }}
                    />
                    <span>
                      <strong style={{ 
                        color: '#fff',
                        fontWeight: '600'
                      }}>Wind:</strong> {boxScoreData.gameInfo.wind || 'N/A'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img 
                      src="/src/Assets/icons/icon_time_solid.svg" 
                      alt="" 
                      style={{
                        width: '16px',
                        height: '16px',
                        marginRight: '8px',
                        filter: 'brightness(0) invert(1)'
                      }}
                    />
                    <span>
                      <strong style={{ 
                        color: '#fff',
                        fontWeight: '600'
                      }}>First Pitch:</strong> {boxScoreData.gameInfo.firstPitch || 'N/A'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img 
                      src="/src/Assets/icons/icon_timer.svg" 
                      alt="" 
                      style={{
                        width: '16px',
                        height: '16px',
                        marginRight: '8px',
                        filter: 'brightness(0) invert(1)'
                      }}
                    />
                    <span>
                      <strong style={{ 
                        color: '#fff',
                        fontWeight: '600'
                      }}>Duration:</strong> {boxScoreData.gameInfo.gameDurationMinutes ? `${boxScoreData.gameInfo.gameDurationMinutes} minutes` : 'N/A'}
                    </span>
                  </div>
                </div>
              )}

              {/* Mobile scroll hint */}
              {isMobile && (
                <div style={{
                  marginTop: '16px',
                  padding: '8px 12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '4px',
                  fontFamily: '"MLB HEX Franklin", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
                  fontSize: '12px',
                  color: '#999',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: '1.4',
                  letterSpacing: '0'
                }}>
                  <img 
                    src="/src/Assets/icons/icon_info_outline.svg" 
                    alt="" 
                    style={{
                      width: '16px',
                      height: '16px',
                      marginRight: '6px',
                      filter: 'brightness(0) invert(0.6)'
                    }}
                  />
                  Tip: Scroll horizontally within tables to view all stats
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
