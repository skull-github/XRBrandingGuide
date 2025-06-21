import React, { useState, useEffect } from 'react';
import { getTeamSpotColor } from '../utils/spotColorMapping';
import './BoxScore.css';
import iconScoreboard from '../assets/icons/icon_scoreboard.svg';
import iconClose from '../assets/icons/icon_close.svg';
import iconTimer from '../assets/icons/icon_timer.svg';
import iconAlert from '../assets/icons/icon_alert_solid.svg';
import iconInfo from '../assets/icons/icon_info_outline.svg';

export function BoxScore({ gamePk, onClose, isVisible }) {
  const [boxScoreData, setBoxScoreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('away');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (gamePk && isVisible) {
      setBoxScoreData(null); // Reset data when opening or changing game
      fetchBoxScore();
    } else {
      setBoxScoreData(null); // Clear data if closed
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
      console.log('BoxScore API Response:', data); // Debug log
      setBoxScoreData(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching box score:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTeamSpotLogo = (teamId) => {
    return `https://img.mlbstatic.com/mlb-photos/image/upload/w_120,f_png,q_auto/v1/team/${teamId}/logo/spot/current`;
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
      return { ab: 0, r: 0, h: 0, rbi: 0, bb: 0, so: 0, avg: '.000', ops: '.000' };
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
      return { ip: '0.0', h: 0, r: 0, er: 0, bb: 0, so: 0, hr: 0, whip: '0.00', era: '0.00' };
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

  const renderBattingTable = (batters, teamData) => {
    if (!batters || batters.length === 0) {
      return <div className="no-data">No batting data available</div>;
    }

    return (
      <div className="stats-table-container">
        <table className="stats-table">
          <thead>
            <tr>
              <th className="name-column">First and Last Name</th>
              <th className="pos-column">POS</th>
              <th>AB</th>
              <th>R</th>
              <th>H</th>
              <th>RBI</th>
              <th>BB</th>
              <th>SO</th>
              <th>K</th>
              <th>LOB</th>
              <th>AVG</th>
              <th>OPS</th>
              <th className="lineup-column">LINEUP</th>
            </tr>
          </thead>
          <tbody>
            {batters.map((player, index) => {
              const stats = formatBattingStats(player.stats);
              return (
                <tr key={`${player.person?.id || index}`}>
                  <td className="name-cell">{formatPlayerName(player)}</td>
                  <td className="pos-cell">{formatPosition(player.position)}</td>
                  <td>{stats.ab}</td>
                  <td>{stats.r}</td>
                  <td>{stats.h}</td>
                  <td>{stats.rbi}</td>
                  <td>{stats.bb}</td>
                  <td>{stats.so}</td>
                  <td>{stats.k}</td>
                  <td>{stats.lob}</td>
                  <td>{stats.avg}</td>
                  <td>{stats.ops}</td>
                  <td className="lineup-cell">{player.battingOrder || (index + 1)}</td>
                </tr>
              );
            })}
          </tbody>
          {teamData?.teamStats?.batting && (
            <tfoot>
              <tr className="totals-row">
                <td className="totals-label"><strong>TOTALS</strong></td>
                <td></td>
                <td><strong>{teamData.teamStats.batting.atBats || 0}</strong></td>
                <td><strong>{teamData.teamStats.batting.runs || 0}</strong></td>
                <td><strong>{teamData.teamStats.batting.hits || 0}</strong></td>
                <td><strong>{teamData.teamStats.batting.rbi || 0}</strong></td>
                <td><strong>{teamData.teamStats.batting.baseOnBalls || 0}</strong></td>
                <td><strong>{teamData.teamStats.batting.strikeOuts || 0}</strong></td>
                <td><strong>{teamData.teamStats.batting.strikeOuts || 0}</strong></td>
                <td><strong>{teamData.teamStats.batting.leftOnBase || 0}</strong></td>
                <td><strong>{teamData.teamStats.batting.avg || '.000'}</strong></td>
                <td><strong>{teamData.teamStats.batting.ops || '.000'}</strong></td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    );
  };

  const renderPitchingTable = (pitchers, teamData) => {
    if (!pitchers || pitchers.length === 0) {
      return <div className="no-data">No pitching data available</div>;
    }

    return (
      <div className="stats-table-container">
        <table className="stats-table">
          <thead>
            <tr>
              <th className="name-column">First and Last Name</th>
              <th className="pos-column">RH</th>
              <th>IP</th>
              <th>H</th>
              <th>R</th>
              <th>ER</th>
              <th>BB</th>
              <th>SO</th>
              <th>HR</th>
              <th></th>
              <th>WHIP</th>
              <th>ERA</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pitchers.map((player, index) => {
              const stats = formatPitchingStats(player.stats);
              const pitchHand = player.person?.pitchHand?.code || 'R';
              return (
                <tr key={`${player.person?.id || index}`}>
                  <td className="name-cell">{formatPlayerName(player)}</td>
                  <td className="pos-cell">{pitchHand}H</td>
                  <td>{stats.ip}</td>
                  <td>{stats.h}</td>
                  <td>{stats.r}</td>
                  <td>{stats.er}</td>
                  <td>{stats.bb}</td>
                  <td>{stats.so}</td>
                  <td>{stats.hr}</td>
                  <td></td>
                  <td>{stats.whip}</td>
                  <td>{stats.era}</td>
                  <td></td>
                </tr>
              );
            })}
          </tbody>
          {teamData?.teamStats?.pitching && (
            <tfoot>
              <tr className="totals-row">
                <td className="totals-label"><strong>TOTALS</strong></td>
                <td></td>
                <td><strong>{teamData.teamStats.pitching.inningsPitched || '0.0'}</strong></td>
                <td><strong>{teamData.teamStats.pitching.hits || 0}</strong></td>
                <td><strong>{teamData.teamStats.pitching.runs || 0}</strong></td>
                <td><strong>{teamData.teamStats.pitching.earnedRuns || 0}</strong></td>
                <td><strong>{teamData.teamStats.pitching.baseOnBalls || 0}</strong></td>
                <td><strong>{teamData.teamStats.pitching.strikeOuts || 0}</strong></td>
                <td><strong>{teamData.teamStats.pitching.homeRuns || 0}</strong></td>
                <td></td>
                <td><strong>{teamData.teamStats.pitching.whip || '0.00'}</strong></td>
                <td><strong>{teamData.teamStats.pitching.era || '0.00'}</strong></td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    );
  };

  const renderBenchTable = (bench) => {
    if (!bench || bench.length === 0) {
      return null;
    }

    return (
      <div className="stats-table-container">
        <table className="stats-table">
          <thead>
            <tr>
              <th className="name-column">First and Last Name</th>
              <th className="pos-column">RH</th>
              <th>AVG</th>
              <th>GP</th>
              <th>R</th>
              <th>H</th>
              <th>HR</th>
              <th>RBI</th>
              <th>SB</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bench.map((player, index) => {
              const seasonStats = player.seasonStats?.batting || {};
              const batHand = player.person?.batSide?.code || 'R';
              return (
                <tr key={`bench-${player.person?.id || index}`}>
                  <td className="name-cell">{formatPlayerName(player)}</td>
                  <td className="pos-cell">{batHand}H</td>
                  <td>{seasonStats.avg || '.000'}</td>
                  <td>{seasonStats.gamesPlayed || 0}</td>
                  <td>{seasonStats.runs || 0}</td>
                  <td>{seasonStats.hits || 0}</td>
                  <td>{seasonStats.homeRuns || 0}</td>
                  <td>{seasonStats.rbi || 0}</td>
                  <td>{seasonStats.stolenBases || 0}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderBullpenTable = (bullpen) => {
    if (!bullpen || bullpen.length === 0) {
      return null;
    }

    return (
      <div className="stats-table-container">
        <table className="stats-table">
          <thead>
            <tr>
              <th className="name-column">First and Last Name</th>
              <th className="pos-column">LH</th>
              <th>ERA</th>
              <th>IP</th>
              <th>H</th>
              <th>BB</th>
              <th>SO</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bullpen.map((player, index) => {
              const seasonStats = player.seasonStats?.pitching || {};
              const pitchHand = player.person?.pitchHand?.code || 'L';
              return (
                <tr key={`bullpen-${player.person?.id || index}`}>
                  <td className="name-cell">{formatPlayerName(player)}</td>
                  <td className="pos-cell">{pitchHand}H</td>
                  <td>{seasonStats.era || '0.00'}</td>
                  <td>{seasonStats.inningsPitched || '0.0'}</td>
                  <td>{seasonStats.hits || 0}</td>
                  <td>{seasonStats.baseOnBalls || 0}</td>
                  <td>{seasonStats.strikeOuts || 0}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderGameInfo = (gameData) => {
    if (!gameData) return null;

    const gameInfo = gameData.gameInfo || {};
    const venue = gameData.gameData?.venue?.name || 'Unknown Venue';
    const weather = gameInfo.weather || {};
    const wind = gameInfo.wind || {};
    const gameDate = gameData.gameData?.datetime?.originalDate || '';
    const attendance = gameInfo.attendance || 0;
    
    return (
      <div className="game-info">
        {gameInfo.pitchesStrikes && (
          <div className="game-info-row">
            <span>Pitches-strikes: {gameInfo.pitchesStrikes}</span>
          </div>
        )}
        {gameInfo.groundoutsFlyouts && (
          <div className="game-info-row">
            <span>Groundouts-flyouts: {gameInfo.groundoutsFlyouts}</span>
          </div>
        )}
        {gameInfo.umpires && (
          <div className="game-info-row">
            <span>Umpires: {gameInfo.umpires}</span>
          </div>
        )}
        {weather.condition && weather.temp && (
          <div className="game-info-row">
            <span>Weather: {weather.temp}°F, {weather.condition}.</span>
          </div>
        )}
        {wind.speed && wind.direction && (
          <div className="game-info-row">
            <span>Wind: {wind.speed} mph, {wind.direction}.</span>
          </div>
        )}
        {gameInfo.firstPitch && (
          <div className="game-info-row">
            <span>First pitch: {gameInfo.firstPitch}.</span>
          </div>
        )}
        {gameInfo.timeOfGame && (
          <div className="game-info-row">
            <span>T: {gameInfo.timeOfGame}.</span>
          </div>
        )}
        {attendance > 0 && (
          <div className="game-info-row">
            <span>Att: {attendance.toLocaleString()}.</span>
          </div>
        )}
        <div className="game-info-row">
          <span>Venue: {venue}.</span>
        </div>
        {gameDate && (
          <div className="game-info-row">
            <span>{new Date(gameDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        )}
      </div>
    );
  };

  if (!isVisible) return null;

  return (
    <div className="boxscore-overlay">
      <div className="boxscore-modal">
        {/* Header */}
        <div className="boxscore-header">
          <div className="boxscore-title">
            <img 
              src={iconScoreboard}
              alt="Box Score" 
              className="title-icon"
            />
            <h2>Box Score</h2>
          </div>
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="Close Box Score"
          >
            <img src={iconClose} alt="Close" />
          </button>
        </div>

        {/* Content */}
        <div className="boxscore-content">
          {loading && (
            <div className="loading-state">
              <img 
                src={iconTimer}
                alt="Loading" 
                className="loading-icon"
              />
              Loading box score...
            </div>
          )}

          {error && (
            <div className="error-state">
              <img 
                src={iconAlert}
                alt="Error" 
                className="error-icon"
              />
              Error: {error}
            </div>
          )}

          {boxScoreData && !loading && !error && boxScoreData.teams && boxScoreData.teams.away && boxScoreData.teams.home ? (
            <div className="boxscore-data">
              {/* Team Selection Buttons */}
              <div className="team-tabs">
                <button
                  className={`team-tab ${activeTab === 'away' ? 'active' : ''}`}
                  onClick={() => setActiveTab('away')}
                  style={{ 
                    '--team-color': getTeamSpotColor(boxScoreData.teams.away.team.id)
                  }}
                >
                  <img 
                    src={getTeamSpotLogo(boxScoreData.teams.away.team.id)}
                    alt={`${boxScoreData.teams.away.team.name} Logo`}
                    className="team-logo"
                  />
                  <span className="team-name">{boxScoreData.teams.away.team.name}</span>
                </button>
                <button
                  className={`team-tab ${activeTab === 'home' ? 'active' : ''}`}
                  onClick={() => setActiveTab('home')}
                  style={{ 
                    '--team-color': getTeamSpotColor(boxScoreData.teams.home.team.id)
                  }}
                >
                  <img 
                    src={getTeamSpotLogo(boxScoreData.teams.home.team.id)}
                    alt={`${boxScoreData.teams.home.team.name} Logo`}
                    className="team-logo"
                  />
                  <span className="team-name">{boxScoreData.teams.home.team.name}</span>
                </button>
              </div>

              {/* Team Stats */}
              <div className="team-stats">
                {activeTab === 'away' && boxScoreData.teams.away && (
                  <div className="team-section">
                    <div className="stats-section">
                      <div className="section-header">
                        <span className="section-label">BATTING</span>
                      </div>
                      {renderBattingTable(boxScoreData.teams.away.batters, boxScoreData.teams.away)}
                    </div>
                    <div className="stats-section">
                      <div className="section-header">
                        <span className="section-label">PITCHERS</span>
                      </div>
                      {renderPitchingTable(boxScoreData.teams.away.pitchers, boxScoreData.teams.away)}
                    </div>
                    {boxScoreData.teams.away.bench && boxScoreData.teams.away.bench.length > 0 && (
                      <div className="stats-section">
                        <div className="section-header">
                          <span className="section-label">BENCH</span>
                        </div>
                        {renderBenchTable(boxScoreData.teams.away.bench)}
                      </div>
                    )}
                    {boxScoreData.teams.away.bullpen && boxScoreData.teams.away.bullpen.length > 0 && (
                      <div className="stats-section">
                        <div className="section-header">
                          <span className="section-label">BULLPEN</span>
                        </div>
                        {renderBullpenTable(boxScoreData.teams.away.bullpen)}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'home' && boxScoreData.teams.home && (
                  <div className="team-section">
                    <div className="stats-section">
                      <div className="section-header">
                        <span className="section-label">BATTING</span>
                      </div>
                      {renderBattingTable(boxScoreData.teams.home.batters, boxScoreData.teams.home)}
                    </div>
                    <div className="stats-section">
                      <div className="section-header">
                        <span className="section-label">PITCHERS</span>
                      </div>
                      {renderPitchingTable(boxScoreData.teams.home.pitchers, boxScoreData.teams.home)}
                    </div>
                    {boxScoreData.teams.home.bench && boxScoreData.teams.home.bench.length > 0 && (
                      <div className="stats-section">
                        <div className="section-header">
                          <span className="section-label">BENCH</span>
                        </div>
                        {renderBenchTable(boxScoreData.teams.home.bench)}
                      </div>
                    )}
                    {boxScoreData.teams.home.bullpen && boxScoreData.teams.home.bullpen.length > 0 && (
                      <div className="stats-section">
                        <div className="section-header">
                          <span className="section-label">BULLPEN</span>
                        </div>
                        {renderBullpenTable(boxScoreData.teams.home.bullpen)}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Game Info */}
              {renderGameInfo(boxScoreData)}

              {/* Mobile scroll hint */}
              {isMobile && (
                <div className="mobile-scroll-hint">
                  <img 
                    src={iconInfo}
                    alt="Info" 
                    className="hint-icon"
                  />
                  Tip: Scroll horizontally within tables to view all stats
                </div>
              )}
            </div>
          ) : null}

          {/* Fallback if no data is available after loading */}
          {!loading && !error && (!boxScoreData || !boxScoreData.teams) && (
            <div className="no-data">No box score data available for this game.</div>
          )}
        </div>
      </div>
    </div>
  );
}