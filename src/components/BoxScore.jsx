import React, { useState, useEffect } from 'react';
import { getTeamSpotColor } from '../utils/spotColorMapping';

export function BoxScore({ gamePk, onClose, isVisible }) {
  const [boxScoreData, setBoxScoreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('away'); // 'away' or 'home'

  useEffect(() => {
    if (gamePk && isVisible) {
      fetchBoxScore();
    }
  }, [gamePk, isVisible]);

  const fetchBoxScore = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch box score data from MLB API
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
    return `https://img.mlbstatic.com/mlb-photos/image/upload/w_40,f_png,q_auto/v1/team/${teamId}/logo/spot/current`;
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
        ab: 0, r: 0, h: 0, rbi: 0, bb: 0, so: 0, k: 0, lob: 0, avg: '.000', ops: '.000'
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
      k: batting.strikeOuts || 0,
      lob: batting.leftOnBase || 0,
      avg: batting.avg || '.000',
      ops: batting.ops || '.000'
    };
  };

  const formatPitchingStats = (stats) => {
    if (!stats || !stats.pitching) {
      return {
        ip: '0.0', h: 0, r: 0, er: 0, bb: 0, so: 0, hr: 0, whip: '0.00', era: '0.00'
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
      hr: pitching.homeRuns || 0,
      whip: pitching.whip || '0.00',
      era: pitching.era || '0.00'
    };
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
      <div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '200px 40px 30px 30px 30px 30px 30px 30px 30px 50px 50px',
          gap: '8px',
          backgroundColor: '#1a1a1a',
          padding: '8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: '600',
          color: '#ccc',
          marginBottom: '2px'
        }}>
          <div>BATTING</div>
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

        {batters.map((player, index) => (
          <div
            key={player.person.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '200px 40px 30px 30px 30px 30px 30px 30px 30px 50px 50px',
              gap: '8px',
              padding: '6px 8px',
              backgroundColor: index % 2 === 0 ? '#2a2a2a' : '#242424',
              fontSize: '12px',
              color: '#fff',
              alignItems: 'center'
            }}
          >
            <div style={{ fontWeight: index === 0 ? '600' : '400' }}>
              {formatPlayerName(player)}
            </div>
            <div>{player.stats.ab}</div>
            <div>{player.stats.r}</div>
            <div>{player.stats.h}</div>
            <div>{player.stats.rbi}</div>
            <div>{player.stats.bb}</div>
            <div>{player.stats.so}</div>
            <div>{player.stats.k}</div>
            <div>{player.stats.lob}</div>
            <div>{player.stats.avg}</div>
            <div>{player.stats.ops}</div>
          </div>
        ))}

        {/* Team Totals */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '200px 40px 30px 30px 30px 30px 30px 30px 30px 50px 50px',
          gap: '8px',
          padding: '8px',
          backgroundColor: '#1a2a3a',
          fontSize: '12px',
          fontWeight: '600',
          color: '#fff',
          marginTop: '4px',
          borderRadius: '4px'
        }}>
          <div>TOTALS</div>
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
      <div style={{ marginTop: '20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '200px 60px 30px 30px 30px 30px 30px 30px 50px 50px',
          gap: '8px',
          backgroundColor: '#1a1a1a',
          padding: '8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: '600',
          color: '#ccc',
          marginBottom: '2px'
        }}>
          <div>PITCHERS</div>
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
              gridTemplateColumns: '200px 60px 30px 30px 30px 30px 30px 30px 50px 50px',
              gap: '8px',
              padding: '6px 8px',
              backgroundColor: index % 2 === 0 ? '#2a2a2a' : '#242424',
              fontSize: '12px',
              color: '#fff',
              alignItems: 'center'
            }}
          >
            <div style={{ fontWeight: index === 0 ? '600' : '400' }}>
              {formatPlayerName(player)}
            </div>
            <div>{player.stats.ip}</div>
            <div>{player.stats.h}</div>
            <div>{player.stats.r}</div>
            <div>{player.stats.er}</div>
            <div>{player.stats.bb}</div>
            <div>{player.stats.so}</div>
            <div>{player.stats.hr}</div>
            <div>{player.stats.whip}</div>
            <div>{player.stats.era}</div>
          </div>
        ))}

        {/* Team Totals */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '200px 60px 30px 30px 30px 30px 30px 30px 50px 50px',
          gap: '8px',
          padding: '8px',
          backgroundColor: '#1a2a3a',
          fontSize: '12px',
          fontWeight: '600',
          color: '#fff',
          marginTop: '4px',
          borderRadius: '4px'
        }}>
          <div>TOTALS</div>
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
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#1a1a1a',
        borderRadius: '12px',
        width: '95%',
        maxWidth: '1200px',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'sticky',
          top: 0,
          backgroundColor: '#1a1a1a',
          zIndex: 10
        }}>
          <h2 style={{ color: '#fff', margin: 0, fontSize: '20px', fontWeight: '600' }}>
            Box Score
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '5px 10px',
              borderRadius: '4px',
              transition: 'background-color 0.2s ease'
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
          <div style={{ padding: '20px' }}>
            {/* Team Selection Tabs */}
            <div style={{
              display: 'flex',
              marginBottom: '20px',
              backgroundColor: '#2a2a2a',
              borderRadius: '8px',
              padding: '4px'
            }}>
              <button
                onClick={() => setActiveTab('away')}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: activeTab === 'away' ? getTeamSpotColor(boxScoreData.teams.away.team.id) : 'transparent',
                  color: '#fff',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                <img 
                  src={getTeamSpotLogo(boxScoreData.teams.away.team.id)} 
                  alt="Away Team"
                  width="24"
                  height="24"
                />
                {boxScoreData.teams.away.team.name} (Away)
              </button>
              <button
                onClick={() => setActiveTab('home')}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: activeTab === 'home' ? getTeamSpotColor(boxScoreData.teams.home.team.id) : 'transparent',
                  color: '#fff',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                <img 
                  src={getTeamSpotLogo(boxScoreData.teams.home.team.id)} 
                  alt="Home Team"
                  width="24"
                  height="24"
                />
                {boxScoreData.teams.home.team.name} (Home)
              </button>
            </div>

            {/* Box Score Content */}
            <div style={{
              backgroundColor: '#242424',
              borderRadius: '8px',
              padding: '20px',
              color: '#fff'
            }}>
              {activeTab === 'away' && (
                <div>
                  <h3 style={{ 
                    margin: '0 0 16px 0', 
                    color: getTeamSpotColor(boxScoreData.teams.away.team.id),
                    fontSize: '18px',
                    fontWeight: '600'
                  }}>
                    {boxScoreData.teams.away.team.name} - Away Team
                  </h3>
                  {renderBattingTable(boxScoreData.teams.away.team, boxScoreData.teams.away)}
                  {renderPitchingTable(boxScoreData.teams.away.team, boxScoreData.teams.away)}
                </div>
              )}

              {activeTab === 'home' && (
                <div>
                  <h3 style={{ 
                    margin: '0 0 16px 0', 
                    color: getTeamSpotColor(boxScoreData.teams.home.team.id),
                    fontSize: '18px',
                    fontWeight: '600'
                  }}>
                    {boxScoreData.teams.home.team.name} - Home Team
                  </h3>
                  {renderBattingTable(boxScoreData.teams.home.team, boxScoreData.teams.home)}
                  {renderPitchingTable(boxScoreData.teams.home.team, boxScoreData.teams.home)}
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
                fontSize: '12px',
                color: '#ccc'
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Weather:</strong> {boxScoreData.gameInfo.weather || 'N/A'}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Wind:</strong> {boxScoreData.gameInfo.wind || 'N/A'}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>First Pitch:</strong> {boxScoreData.gameInfo.firstPitch || 'N/A'}
                </div>
                <div>
                  <strong>Time:</strong> {boxScoreData.gameInfo.gameDurationMinutes ? `${boxScoreData.gameInfo.gameDurationMinutes} minutes` : 'N/A'}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
