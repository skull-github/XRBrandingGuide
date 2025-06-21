import React, { useState, useEffect } from 'react';
import { getTeamSpotColor } from '../utils/spotColorMapping';

export function BoxScore({ gamePk, onClose, isVisible }) {
  const [boxScoreData, setBoxScoreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (gamePk && isVisible) {
      fetchBoxScore();
    }
  }, [gamePk, isVisible]);

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

  const formatBattingStats = (stats) => {
    if (!stats || !stats.batting) {
      return {
        ab: 0, r: 0, h: 0, rbi: 0, bb: 0, so: 0, avg: '.000'
      };
    }
    
    const batting = stats.batting;
    return {
      ab: batting.atBats || 0,
      r: batting.runs || 0,
      h: batting.hits || 0,
      rbi: batting.rbi || 0,
      bb: batting.baseOnBalls || 0,
      so: batting.strikeOuts || 0,
      avg: batting.avg || '.000'
    };
  };

  const formatPitchingStats = (stats) => {
    if (!stats || !stats.pitching) {
      return {
        ip: '0.0', h: 0, r: 0, er: 0, bb: 0, so: 0, era: '0.00'
      };
    }
    
    const pitching = stats.pitching;
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

  // Create inning by inning data from box score
  const getInningScores = () => {
    if (!boxScoreData || !boxScoreData.teams) return [];
    
    const { away, home } = boxScoreData.teams;
    const awayLineScore = away.teamStats?.batting?.runs || [];
    const homeLineScore = home.teamStats?.batting?.runs || [];
    
    return [
      {
        team: away.team.abbreviation || 'AWAY',
        innings: awayLineScore.length > 0 ? awayLineScore.slice(0, 9) : Array(9).fill('0'),
        r: away.teamStats?.batting?.runs?.reduce((sum, runs) => sum + (runs || 0), 0) || 0,
        h: away.teamStats?.batting?.hits || 0,
        e: away.teamStats?.fielding?.errors || 0
      },
      {
        team: home.team.abbreviation || 'HOME', 
        innings: homeLineScore.length > 0 ? homeLineScore.slice(0, 9) : Array(9).fill('0'),
        r: home.teamStats?.batting?.runs?.reduce((sum, runs) => sum + (runs || 0), 0) || 0,
        h: home.teamStats?.batting?.hits || 0,
        e: home.teamStats?.fielding?.errors || 0
      }
    ];
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div style={{
        backgroundColor: '#1a1a1a',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '1400px',
        maxHeight: '95vh',
        overflow: 'auto',
        position: 'relative',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
      }}>
        {/* Close Button */}
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
                      }}>R</th>
                      <th style={{
                        color: '#fff',
                        fontWeight: '700',
                        fontSize: '24px',
                        lineHeight: '1.3',
                        padding: '12px',
                        textAlign: 'center',
                        width: '48px'
                      }}>H</th>
                      <th style={{
                        color: '#fff',
                        fontWeight: '700',
                        fontSize: '24px',
                        lineHeight: '1.3',
                        padding: '12px',
                        textAlign: 'center',
                        width: '48px'
                      }}>E</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getInningScores().map((team, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #666' }}>
                        <td style={{
                          fontWeight: '700',
                          fontSize: '17px',
                          color: getTeamSpotColor(boxScoreData.teams[index === 0 ? 'away' : 'home'].team.id),
                          padding: '12px 16px'
                        }}>
                          {team.team}
                        </td>
                        {team.innings.map((score, i) => (
                          <td key={i} style={{
                            textAlign: 'center',
                            fontWeight: '400',
                            fontSize: '17px',
                            color: '#fff',
                            padding: '12px'
                          }}>
                            {score}
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
                  <div>
                    <strong style={{ 
                      color: '#fff',
                      fontWeight: '600'
                    }}>Venue:</strong> {boxScoreData.gameInfo.venue || 'N/A'}
                  </div>
                  <div>
                    <strong style={{ 
                      color: '#fff',
                      fontWeight: '600'
                    }}>Weather:</strong> {boxScoreData.gameInfo.weather || 'N/A'}
                  </div>
                  <div>
                    <strong style={{ 
                      color: '#fff',
                      fontWeight: '600'
                    }}>Wind:</strong> {boxScoreData.gameInfo.wind || 'N/A'}
                  </div>
                  <div>
                    <strong style={{ 
                      color: '#fff',
                      fontWeight: '600'
                    }}>First Pitch:</strong> {boxScoreData.gameInfo.firstPitch || 'N/A'}
                  </div>
                  <div>
                    <strong style={{ 
                      color: '#fff',
                      fontWeight: '600'
                    }}>Duration:</strong> {boxScoreData.gameInfo.gameDurationMinutes ? `${boxScoreData.gameInfo.gameDurationMinutes} minutes` : 'N/A'}
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
                  display: 'block',
                  lineHeight: '1.4',
                  letterSpacing: '0'
                }}>
                  💡 Tip: Scroll horizontally within tables to view all stats
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  // Helper functions
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
      <div style={{ 
        overflowX: 'auto',
        minWidth: '100%',
        borderRadius: '4px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ minWidth: '720px' }}>
          {/* Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 50px 40px 35px 35px 40px 40px 35px 35px 50px 50px',
            gap: '4px',
            backgroundColor: '#1a1a1a',
            padding: '8px 12px',
            fontFamily: '"MLB HEX Franklin", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
            fontSize: '11px', // Slightly larger for better readability
            fontWeight: '600',
            color: '#ccc',
            textAlign: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            lineHeight: '1.4',
            letterSpacing: '0.01em' // Wide tracking for headers
          }}>
            <div style={{ textAlign: 'left', minWidth: '140px', fontWeight: '700' }}>BATTING</div>
            <div>POS</div>
            <div>AB</div>
            <div>R</div>
            <div>H</div>
            <div>RBI</div>
            <div>BB</div>
            <div>SO</div>
            <div>K</div>
            <div>LOB</div>
            <div>AVG</div>
            <div>OPS</div>
          </div>

          {/* Batting lineup */}
          {batters.map((player, index) => (
            <div
              key={player.person.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 50px 40px 35px 35px 40px 40px 35px 35px 50px 50px',
                gap: '4px',
                padding: '6px 12px',
                backgroundColor: index % 2 === 0 ? '#2a2a2a' : '#242424',
                fontFamily: '"MLB HEX Franklin", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
                fontSize: '12px', // Using system font size from MLB typography
                color: '#fff',
                alignItems: 'center',
                textAlign: 'center',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                lineHeight: '1.4',
                letterSpacing: '0'
              }}
            >
              <div style={{ 
                fontWeight: '400',
                textAlign: 'left',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                minWidth: '140px'
              }}>
                {formatPlayerName(player)}
              </div>
              <div style={{ 
                fontSize: '10px', 
                color: '#ccc',
                fontWeight: '500' // Medium weight for position labels
              }}>
                {formatPosition(player.position)}
              </div>
              <div style={{ fontWeight: '500' }}>{player.stats.ab}</div>
              <div style={{ fontWeight: '500' }}>{player.stats.r}</div>
              <div style={{ fontWeight: '500' }}>{player.stats.h}</div>
              <div style={{ fontWeight: '500' }}>{player.stats.rbi}</div>
              <div style={{ fontWeight: '500' }}>{player.stats.bb}</div>
              <div style={{ fontWeight: '500' }}>{player.stats.so}</div>
              <div style={{ fontWeight: '500' }}>{player.stats.k}</div>
              <div style={{ fontWeight: '500' }}>{player.stats.lob}</div>
              <div style={{ fontSize: '10px', fontWeight: '500' }}>{player.stats.avg}</div>
              <div style={{ fontSize: '10px', fontWeight: '500' }}>{player.stats.ops}</div>
            </div>
          ))}

          {/* Team Totals */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 50px 40px 35px 35px 40px 40px 35px 35px 50px 50px',
            gap: '4px',
            padding: '8px 12px',
            backgroundColor: '#1a2a3a',
            fontFamily: '"MLB HEX Franklin", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
            fontSize: '12px',
            fontWeight: '600',
            color: '#fff',
            textAlign: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            lineHeight: '1.4',
            letterSpacing: '0.01em'
          }}>
            <div style={{ textAlign: 'left', minWidth: '140px', fontWeight: '700' }}>TOTALS</div>
            <div>-</div>
            <div>{teamTotals.ab}</div>
            <div>{teamTotals.r}</div>
            <div>{teamTotals.h}</div>
            <div>{teamTotals.rbi}</div>
            <div>{teamTotals.bb}</div>
            <div>{teamTotals.so}</div>
            <div>{teamTotals.k}</div>
            <div>{teamTotals.lob}</div>
            <div>-</div>
            <div>-</div>
          </div>
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

    // Calculate team totals
    const teamTotals = pitchers.reduce((totals, player) => {
      const stats = player.stats;
      return {
        h: totals.h + stats.h,
        r: totals.r + stats.r,
        er: totals.er + stats.er,
        bb: totals.bb + stats.bb,
        so: totals.so + stats.so,
        hr: totals.hr + stats.hr
      };
    }, { h: 0, r: 0, er: 0, bb: 0, so: 0, hr: 0 });

    return (
      <div style={{ 
        marginTop: '20px',
        overflowX: 'auto',
        minWidth: '100%',
        borderRadius: '4px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ minWidth: '760px' }}>
          {/* Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 50px 60px 35px 35px 35px 40px 35px 35px 50px 50px',
            gap: '4px',
            backgroundColor: '#1a1a1a',
            padding: '8px 12px',
            fontFamily: '"MLB HEX Franklin", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: '600',
            color: '#ccc',
            textAlign: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            lineHeight: '1.4',
            letterSpacing: '0.01em'
          }}>
            <div style={{ textAlign: 'left', minWidth: '140px', fontWeight: '700' }}>PITCHERS</div>
            <div>POS</div>
            <div>IP</div>
            <div>H</div>
            <div>R</div>
            <div>ER</div>
            <div>BB</div>
            <div>SO</div>
            <div>HR</div>
            <div>WHIP</div>
            <div>ERA</div>
          </div>

          {pitchers.map((player, index) => (
            <div
              key={player.person.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 50px 60px 35px 35px 35px 40px 35px 35px 50px 50px',
                gap: '4px',
                padding: '6px 12px',
                backgroundColor: index % 2 === 0 ? '#2a2a2a' : '#242424',
                fontFamily: '"MLB HEX Franklin", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
                fontSize: '12px',
                color: '#fff',
                alignItems: 'center',
                textAlign: 'center',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                lineHeight: '1.4',
                letterSpacing: '0'
              }}
            >
              <div style={{ 
                fontWeight: '400',
                textAlign: 'left',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                minWidth: '140px'
              }}>
                {formatPlayerName(player)}
              </div>
              <div style={{ 
                fontSize: '10px', 
                color: '#ccc',
                fontWeight: '500'
              }}>
                {formatPosition(player.position)}
              </div>
              <div style={{ fontWeight: '500' }}>{player.stats.ip}</div>
              <div style={{ fontWeight: '500' }}>{player.stats.h}</div>
              <div style={{ fontWeight: '500' }}>{player.stats.r}</div>
              <div style={{ fontWeight: '500' }}>{player.stats.er}</div>
              <div style={{ fontWeight: '500' }}>{player.stats.bb}</div>
              <div style={{ fontWeight: '500' }}>{player.stats.so}</div>
              <div style={{ fontWeight: '500' }}>{player.stats.hr}</div>
              <div style={{ fontSize: '10px', fontWeight: '500' }}>{player.stats.whip}</div>
              <div style={{ fontSize: '10px', fontWeight: '500' }}>{player.stats.era}</div>
            </div>
          ))}

          {/* Team Totals */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 50px 60px 35px 35px 35px 40px 35px 35px 50px 50px',
            gap: '4px',
            padding: '8px 12px',
            backgroundColor: '#1a2a3a',
            fontFamily: '"MLB HEX Franklin", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
            fontSize: '12px',
            fontWeight: '600',
            color: '#fff',
            textAlign: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            lineHeight: '1.4',
            letterSpacing: '0.01em'
          }}>
            <div style={{ textAlign: 'left', minWidth: '140px', fontWeight: '700' }}>TOTALS</div>
            <div>-</div>
            <div>-</div>
            <div>{teamTotals.h}</div>
            <div>{teamTotals.r}</div>
            <div>{teamTotals.er}</div>
            <div>{teamTotals.bb}</div>
            <div>{teamTotals.so}</div>
            <div>{teamTotals.hr}</div>
            <div>-</div>
            <div>-</div>
          </div>
        </div>
      </div>
    );
  };

  const renderBenchTable = (team, teamData) => {
    if (!teamData || !teamData.bench || teamData.bench.length === 0) return null;

    const benchPlayers = teamData.bench.map(benchId => {
      const player = teamData.players[`ID${benchId}`];
      return {
        ...player,
        stats: formatBenchStats(player.seasonStats)
      };
    });

    return (
      <div style={{ 
        marginTop: '20px',
        overflowX: 'auto',
        minWidth: '100%',
        borderRadius: '4px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ minWidth: '620px' }}>
          {/* Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 60px 60px 40px 40px 40px 50px 50px 40px',
            gap: '4px',
            backgroundColor: '#1a1a1a',
            padding: '8px 12px',
            borderRadius: '4px 4px 0 0',
            fontFamily: '"MLB HEX Franklin", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: '600',
            color: '#ccc',
            textAlign: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            lineHeight: '1.4',
            letterSpacing: '0.01em'
          }}>
            <div style={{ textAlign: 'left', minWidth: '140px', fontWeight: '700' }}>BENCH</div>
            <div>POS</div>
            <div>AVG</div>
            <div>GP</div>
            <div>R</div>
            <div>H</div>
            <div>HR</div>
            <div>RBI</div>
            <div>SB</div>
          </div>

          {benchPlayers.map((player, index) => (
            <div
              key={player.person.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 60px 60px 40px 40px 40px 50px 50px 40px',
                gap: '4px',
                padding: '6px 12px',
                backgroundColor: index % 2 === 0 ? '#2a2a2a' : '#242424',
                fontFamily: '"MLB HEX Franklin", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
                fontSize: '12px',
                color: '#fff',
                alignItems: 'center',
                textAlign: 'center',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                lineHeight: '1.4',
                letterSpacing: '0'
              }}
            >
              <div style={{ 
                fontWeight: '400',
                textAlign: 'left',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                minWidth: '140px'
              }}>
                {formatPlayerName(player)}
              </div>
              <div style={{ 
                fontSize: '10px', 
                color: '#ccc',
                fontWeight: '500'
              }}>
                {formatPosition(player.position)}
              </div>
              <div style={{ fontSize: '10px', fontWeight: '500' }}>{player.stats.avg}</div>
              <div style={{ fontWeight: '500' }}>{player.stats.gp}</div>
              <div style={{ fontWeight: '500' }}>{player.stats.r}</div>
              <div style={{ fontWeight: '500' }}>{player.stats.h}</div>
              <div style={{ fontWeight: '500' }}>{player.stats.hr}</div>
              <div style={{ fontWeight: '500' }}>{player.stats.rbi}</div>
              <div style={{ fontWeight: '500' }}>{player.stats.sb}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBullpenTable = (team, teamData) => {
    if (!teamData || !teamData.bullpen || teamData.bullpen.length === 0) return null;

    const bullpenPlayers = teamData.bullpen.map(bullpenId => {
      const player = teamData.players[`ID${bullpenId}`];
      return {
        ...player,
        stats: formatBullpenStats(player.seasonStats)
      };
    });

    return (
      <div style={{ 
        marginTop: '20px',
        overflowX: 'auto',
        minWidth: '100%',
        borderRadius: '4px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ minWidth: '540px' }}>
          {/* Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 60px 60px 40px 40px 40px 40px',
            gap: '4px',
            backgroundColor: '#1a1a1a',
            padding: '8px 12px',
            borderRadius: '4px 4px 0 0',
            fontFamily: '"MLB HEX Franklin", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: '600',
            color: '#ccc',
            textAlign: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            lineHeight: '1.4',
            letterSpacing: '0.01em'
          }}>
            <div style={{ textAlign: 'left', minWidth: '140px', fontWeight: '700' }}>BULLPEN</div>
            <div>POS</div>
            <div>ERA</div>
            <div>IP</div>
            <div>H</div>
            <div>BB</div>
            <div>SO</div>
          </div>

          {bullpenPlayers.map((player, index) => (
            <div
              key={player.person.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 60px 60px 40px 40px 40px 40px',
                gap: '4px',
                padding: '6px 12px',
                backgroundColor: index % 2 === 0 ? '#2a2a2a' : '#242424',
                fontFamily: '"MLB HEX Franklin", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
                fontSize: '12px',
                color: '#fff',
                alignItems: 'center',
                textAlign: 'center',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                lineHeight: '1.4',
                letterSpacing: '0'
              }}
            >
              <div style={{ 
                fontWeight: '400',
                textAlign: 'left',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                minWidth: '140px'
              }}>
                {formatPlayerName(player)}
              </div>
              <div style={{ 
                fontSize: '10px', 
                color: '#ccc',
                fontWeight: '500'
              }}>
                {formatPosition(player.position)}
              </div>
              <div style={{ fontSize: '10px', fontWeight: '500' }}>{player.stats.era}</div>
              <div style={{ fontWeight: '500' }}>{player.stats.ip}</div>
              <div style={{ fontWeight: '500' }}>{player.stats.h}</div>
              <div style={{ fontWeight: '500' }}>{player.stats.bb}</div>
              <div style={{ fontWeight: '500' }}>{player.stats.so}</div>
            </div>
          ))}
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
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: isMobile ? '5px' : '10px',
      overflowY: 'auto'
    }}>
      <div style={{
        backgroundColor: '#1a1a1a',
        borderRadius: isMobile ? '8px' : '12px',
        width: '100%',
        maxWidth: '1400px',
        minHeight: 'fit-content',
        maxHeight: 'calc(100vh - 20px)',
        overflow: 'hidden',
        position: 'relative',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginTop: isMobile ? '5px' : '10px'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: isMobile ? '12px 16px' : '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'sticky',
          top: 0,
          backgroundColor: '#1a1a1a',
          zIndex: 10
        }}>
          <h2 style={{ 
            color: '#fff', 
            margin: 0,
            fontFamily: '"MLB HEX Franklin", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
            fontSize: isMobile ? '19px' : '24px', // Using subheadline/headline from MLB typography
            fontWeight: '600',
            lineHeight: isMobile ? '1.35' : '1.3',
            letterSpacing: '0'
          }}>
            Box Score
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: isMobile ? '20px' : '24px',
              cursor: 'pointer',
              padding: '5px 10px',
              borderRadius: '4px',
              transition: 'background-color 0.2s ease',
              fontFamily: '"MLB HEX Franklin", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ×
          </button>
        </div>

        {loading && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            color: '#fff',
            fontSize: '16px'
          }}>
            Loading box score...
          </div>
        )}

        {error && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            color: '#ff6b6b',
            fontSize: '16px'
          }}>
            Error: {error}
          </div>
        )}

        {boxScoreData && (
          <div style={{ 
            padding: isMobile ? '12px' : '20px',
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 120px)'
          }}>
            {/* Team Selection Tabs */}
            <div style={{
              display: 'flex',
              marginBottom: isMobile ? '16px' : '20px',
              backgroundColor: '#2a2a2a',
              borderRadius: '8px',
              padding: '4px',
              flexWrap: 'wrap',
              gap: '4px'
            }}>
              <button
                onClick={() => setActiveTab('away')}
                style={{
                  flex: '1 1 250px',
                  minWidth: isMobile ? '120px' : '250px',
                  padding: isMobile ? '10px 12px' : '12px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: activeTab === 'away' ? getTeamSpotColor(boxScoreData.teams.away.team.id) : 'transparent',
                  color: '#fff',
                  fontFamily: '"MLB HEX Franklin", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: isMobile ? '6px' : '10px',
                  fontSize: isMobile ? '13px' : '15px', // Using system font size from MLB typography
                  lineHeight: '1.4',
                  letterSpacing: '0'
                }}
              >
                <img 
                  src={getTeamSpotLogo(boxScoreData.teams.away.team.id)} 
                  alt="Away Team"
                  width={isMobile ? '20' : '24'}
                  height={isMobile ? '20' : '24'}
                />
                <span>{boxScoreData.teams.away.team.name} (Away)</span>
              </button>
              <button
                onClick={() => setActiveTab('home')}
                style={{
                  flex: '1 1 250px',
                  minWidth: isMobile ? '120px' : '250px',
                  padding: isMobile ? '10px 12px' : '12px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: activeTab === 'home' ? getTeamSpotColor(boxScoreData.teams.home.team.id) : 'transparent',
                  color: '#fff',
                  fontFamily: '"MLB HEX Franklin", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: isMobile ? '6px' : '10px',
                  fontSize: isMobile ? '13px' : '15px', // Using system font size from MLB typography
                  lineHeight: '1.4',
                  letterSpacing: '0'
                }}
              >
                <img 
                  src={getTeamSpotLogo(boxScoreData.teams.home.team.id)} 
                  alt="Home Team"
                  width={isMobile ? '20' : '24'}
                  height={isMobile ? '20' : '24'}
                />
                <span>{boxScoreData.teams.home.team.name} (Home)</span>
              </button>
            </div>

            {/* Box Score Content */}
            <div style={{
              backgroundColor: '#242424',
              borderRadius: '8px',
              padding: isMobile ? '12px' : '20px',
              color: '#fff'
            }}>
              {activeTab === 'away' && (
                <div>
                  {renderBattingTable(boxScoreData.teams.away.team, boxScoreData.teams.away)}
                  {renderPitchingTable(boxScoreData.teams.away.team, boxScoreData.teams.away)}
                  {renderBenchTable(boxScoreData.teams.away.team, boxScoreData.teams.away)}
                  {renderBullpenTable(boxScoreData.teams.away.team, boxScoreData.teams.away)}
                </div>
              )}

              {activeTab === 'home' && (
                <div>
                  {renderBattingTable(boxScoreData.teams.home.team, boxScoreData.teams.home)}
                  {renderPitchingTable(boxScoreData.teams.home.team, boxScoreData.teams.home)}
                  {renderBenchTable(boxScoreData.teams.home.team, boxScoreData.teams.home)}
                  {renderBullpenTable(boxScoreData.teams.home.team, boxScoreData.teams.home)}
                </div>
              )}
            </div>

            {/* Game Info */}
            {boxScoreData.gameInfo && (
              <div style={{
                marginTop: '20px',
                padding: '16px',
                backgroundColor: '#2a2a2a',
                borderRadius: '8px',
                fontFamily: '"MLB HEX Franklin", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
                fontSize: '13px', // Using legal font size from MLB typography
                color: '#ccc',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                lineHeight: '1.4',
                letterSpacing: '0'
              }}>
                <div>
                  <strong style={{ 
                    color: '#fff',
                    fontWeight: '600'
                  }}>Weather:</strong> {boxScoreData.gameInfo.weather || 'N/A'}
                </div>
                <div>
                  <strong style={{ 
                    color: '#fff',
                    fontWeight: '600'
                  }}>Wind:</strong> {boxScoreData.gameInfo.wind || 'N/A'}
                </div>
                <div>
                  <strong style={{ 
                    color: '#fff',
                    fontWeight: '600'
                  }}>First Pitch:</strong> {boxScoreData.gameInfo.firstPitch || 'N/A'}
                </div>
                <div>
                  <strong style={{ 
                    color: '#fff',
                    fontWeight: '600'
                  }}>Duration:</strong> {boxScoreData.gameInfo.gameDurationMinutes ? `${boxScoreData.gameInfo.gameDurationMinutes} minutes` : 'N/A'}
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
                display: 'block',
                lineHeight: '1.4',
                letterSpacing: '0'
              }}>
                💡 Tip: Scroll horizontally within tables to view all stats
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
