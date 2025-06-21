import React, { useState, useEffect } from 'react';
import { getTeamSpotColor } from '../utils/spotColorMapping';
import { BoxScore } from './BoxScore.jsx';

export function MLBSchedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [games, setGames] = useState([]);
  const [teams, setTeams] = useState([]);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedGamePk, setSelectedGamePk] = useState(null);
  const [showBoxScore, setShowBoxScore] = useState(false);

  // Fetch team branding data and standings on component mount
  useEffect(() => {
    async function fetchTeamData() {
      try {
        // Fetch branding data
        const brandingRes = await fetch('https://storage.mobile.mlbinfra.com/atbatconfig/branding.json');
        if (!brandingRes.ok) throw new Error('Failed to fetch branding data');
        const brandingData = await brandingRes.json();
        setTeams(brandingData.teams.filter(team => String(team.teamID) !== '0'));

        // Fetch standings data
        const standingsRes = await fetch('https://statsapi.mlb.com/api/v1/standings?leagueId=103,104&season=2025');
        if (!standingsRes.ok) throw new Error('Failed to fetch standings data');
        const standingsData = await standingsRes.json();
        
        // Flatten all team records from all divisions
        const allRecords = [];
        standingsData.records.forEach(division => {
          division.teamRecords.forEach(record => {
            allRecords.push({
              teamId: record.team.id,
              wins: record.wins,
              losses: record.losses
            });
          });
        });
        setStandings(allRecords);
      } catch (error) {
        console.error('Error fetching team data:', error);
        setTeams([]);
        setStandings([]);
      }
    }
    fetchTeamData();
  }, []);

  // Format date for MLB API (YYYY-MM-DD)
  const formatDateForAPI = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Format date for display
  const formatDateForDisplay = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format time for display
  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return 'TBD';
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).replace(/\s/, ' ').toUpperCase();
    } catch (e) {
      return 'TBD';
    }
  };

  // Get team data from branding API
  const getTeamData = (teamId) => {
    const team = teams.find(t => t.teamID === teamId);
    return team || null;
  };

  // Get team spot color from official mapping
  const getTeamSpotColorFromMapping = (teamId) => {
    return getTeamSpotColor(teamId);
  };

  // Get team spot logo from MLB Photos API (the correct spot logo endpoint)
  const getTeamSpotLogo = (teamId) => {
    // Use the MLB Photos API spot logo endpoint - this provides the actual spot logos
    return `https://img.mlbstatic.com/mlb-photos/image/upload/w_40,f_png,q_auto/v1/team/${teamId}/logo/spot/current`;
  };

  // Create a spot logo implementation - logo floats on top of spot color background
  // Note: Logo floats on the spot color, not contained in a box
  const SpotLogo = ({ teamId, size = 40, style = {} }) => {
    const spotLogo = getTeamSpotLogo(teamId);
    
    return (
      <div style={{ position: 'relative', ...style }}>
        {spotLogo ? (
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
        ) : (
          <div style={{
            color: '#fff',
            fontSize: `${size * 0.3}px`,
            fontWeight: '700',
            textAlign: 'center',
            width: `${size}px`,
            height: `${size}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1
          }}>
            {getTeamAbbr(teamId)}
          </div>
        )}
      </div>
    );
  };

  // Get team abbreviation
  const getTeamAbbr = (teamId) => {
    const team = getTeamData(teamId);
    return team?.abbreviation || team?.teamCode?.toUpperCase() || 'TBD';
  };

  // Get team record (wins-losses) from standings data
  const getTeamRecord = (teamId) => {
    const record = standings.find(s => s.teamId === teamId);
    if (!record) return '';
    
    // Format as "00-00"
    const wins = String(record.wins).padStart(2, '0');
    const losses = String(record.losses).padStart(2, '0');
    return `${wins}-${losses}`;
  };

  // Fetch games for selected date
  useEffect(() => {
    async function fetchGames() {
      setLoading(true);
      try {
        const dateStr = formatDateForAPI(selectedDate);
        const response = await fetch(`https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${dateStr}&hydrate=team,linescore,decisions`);
        const data = await response.json();
        
        if (data.dates && data.dates.length > 0) {
          setGames(data.dates[0].games || []);
        } else {
          setGames([]);
        }
      } catch (error) {
        console.error('Error fetching games:', error);
        setGames([]);
      } finally {
        setLoading(false);
      }
    }

    // Only fetch games if we have team data and standings
    if (teams.length > 0 && standings.length > 0) {
      fetchGames();
    }
  }, [selectedDate, teams, standings]); // Add standings as dependency

  // Calendar component
  const Calendar = () => {
    const today = new Date();
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];

    return (
      <div style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        padding: '16px',
        zIndex: 1000,
        minWidth: '300px',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Calendar Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <button
            onClick={() => setSelectedDate(new Date(currentYear, currentMonth - 1, selectedDate.getDate()))}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px' }}
          >
            ‹
          </button>
          <span style={{ color: '#fff', fontWeight: 600 }}>
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button
            onClick={() => setSelectedDate(new Date(currentYear, currentMonth + 1, selectedDate.getDate()))}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px' }}
          >
            ›
          </button>
        </div>

        {/* Day Headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', padding: '4px' }}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
          {days.map((day, index) => {
            const isCurrentMonth = day.getMonth() === currentMonth;
            const isToday = day.toDateString() === today.toDateString();
            const isSelected = day.toDateString() === selectedDate.toDateString();

            return (
              <button
                key={index}
                onClick={() => {
                  setSelectedDate(new Date(day));
                  setShowCalendar(false);
                }}
                style={{
                  padding: '8px 4px',
                  border: 'none',
                  backgroundColor: isSelected ? 'rgba(0, 123, 255, 0.8)' : 
                                   isToday ? 'rgba(255, 255, 255, 0.2)' : 
                                   'transparent',
                  color: isCurrentMonth ? '#fff' : 'rgba(255, 255, 255, 0.4)',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  fontSize: '12px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected && isCurrentMonth) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.target.style.backgroundColor = isToday ? 'rgba(255, 255, 255, 0.2)' : 'transparent';
                  }
                }}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>

        {/* Today Button */}
        <button
          onClick={() => {
            setSelectedDate(new Date());
            setShowCalendar(false);
          }}
          style={{
            marginTop: '12px',
            width: '100%',
            padding: '8px',
            backgroundColor: 'rgba(0, 123, 255, 0.6)',
            border: 'none',
            borderRadius: '6px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500'
          }}
        >
          Today
        </button>
      </div>
    );
  };

  return (
    <div style={{
      backgroundColor: 'transparent',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '2rem',
      border: 'none',
      width: '100%'
    }}>
      {/* Header with Date Selector */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        color: '#fff'
      }}>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#fff',
              padding: '10px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            📅 {formatDateForDisplay(selectedDate)}
          </button>
          {showCalendar && <Calendar />}
        </div>
        <div style={{ 
          fontSize: '24px', 
          fontWeight: '700',
          color: '#fff',
          textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
        }}>
          spotlightSchedule
        </div>
      </div>

      {/* Games Display */}
      {loading ? (
        <div style={{ 
          color: 'rgba(255, 255, 255, 0.7)', 
          textAlign: 'center', 
          padding: '40px',
          fontSize: '16px'
        }}>
          Loading games...
        </div>
      ) : games.length === 0 ? (
        <div style={{ 
          color: 'rgba(255, 255, 255, 0.7)', 
          textAlign: 'center', 
          padding: '40px',
          fontSize: '16px'
        }}>
          No games scheduled for this date
        </div>
      ) : (
        <div style={{ 
          display: 'flex',
          gap: '16px',
          overflowX: 'auto',
          overflowY: 'hidden',
          paddingBottom: '10px',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent'
        }}>
          {games.map((game) => {
            const isScheduled = game.status.statusCode === 'S';
            const isLive = game.status.statusCode === 'I';
            const isPreGame = game.status.statusCode === 'P';
            const isDelay = game.status.statusCode === 'D';
            const isFinal = game.status.statusCode === 'F';
            const isPostponed = game.status.statusCode === 'PO';
            
            const awayTeamColor = getTeamSpotColorFromMapping(game.teams.away.team.id);
            const homeTeamColor = getTeamSpotColorFromMapping(game.teams.home.team.id);
            
            // Determine winner for final games
            const awayWin = isFinal && game.teams.away.score > game.teams.home.score;
            const homeWin = isFinal && game.teams.home.score > game.teams.away.score;

            return (
              <div
                key={game.gamePk}
                style={{
                  minWidth: '240px',
                  flexShrink: 0,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => {
                  setSelectedGamePk(game.gamePk);
                  setShowBoxScore(true);
                }}
                onMouseEnter={(e) => {
                  const card = e.currentTarget.querySelector('.game-card');
                  card.style.transform = 'translateY(-2px)';
                  card.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  const card = e.currentTarget.querySelector('.game-card');
                  card.style.transform = 'translateY(0)';
                  card.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
                }}
              >
                {/* Game Card */}
                <div
                  className="game-card"
                  style={{
                    width: '240px',
                    height: '80px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
                  }}
                >
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
                    <div style={{ marginBottom: '4px' }}>
                      <SpotLogo teamId={game.teams.away.team.id} size={40} />
                    </div>
                    <div style={{
                      color: '#fff',
                      fontSize: '10px',
                      fontWeight: '600',
                      textAlign: 'center',
                      position: 'relative',
                      zIndex: 1
                    }}>
                      {getTeamRecord(game.teams.away.team.id)}
                    </div>
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
                  {/* Game Status */}
                  <div style={{
                    fontSize: '9px',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginBottom: '4px',
                    textAlign: 'center',
                    letterSpacing: '0.5px'
                  }}>
                    {isLive && game.linescore ? 
                      `${game.linescore.inningState || ''} ${game.linescore.currentInning || ''}`.trim() :
                      isLive ? 'LIVE' :
                      isPreGame ? 'PRE GAME' :
                      isDelay ? 'DELAY' :
                      isFinal ? 'FINAL' :
                      isPostponed ? 'PPD' :
                      'SCHEDULED'
                    }
                  </div>

                  {/* Scores */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#fff',
                    marginBottom: '4px'
                  }}>
                    <span style={{
                      color: '#fff',
                      minWidth: '20px',
                      textAlign: 'center'
                    }}>
                      {game.linescore ? (game.teams.away.score || 0) : '0'}
                    </span>
                    <span style={{
                      color: 'rgba(255, 255, 255, 0.4)',
                      fontSize: '16px',
                      fontWeight: '400'
                    }}>
                      |
                    </span>
                    <span style={{
                      color: '#fff',
                      minWidth: '20px',
                      textAlign: 'center'
                    }}>
                      {game.linescore ? (game.teams.home.score || 0) : '0'}
                    </span>
                  </div>

                  {/* Game Time or Additional Status */}
                  {!isFinal && !isLive && (
                    <div style={{
                      fontSize: '8px',
                      color: 'rgba(255, 255, 255, 0.5)',
                      textAlign: 'center',
                      letterSpacing: '0.5px'
                    }}>
                      {formatTime(game.gameDate)}
                    </div>
                  )}
                  
                  {/* Current Inning Status for Live Games */}
                  {isLive && (
                    <div style={{
                      fontSize: '7px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      textAlign: 'center',
                      letterSpacing: '0.5px'
                    }}>
                      LIVE
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
                  <div style={{ marginBottom: '4px' }}>
                    <SpotLogo teamId={game.teams.home.team.id} size={40} />
                  </div>
                  <div style={{
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: '600',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    {getTeamRecord(game.teams.home.team.id)}
                  </div>
                </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Box Score Overlay */}
      <BoxScore 
        gamePk={selectedGamePk}
        isVisible={showBoxScore}
        onClose={() => {
          setShowBoxScore(false);
          setSelectedGamePk(null);
        }}
      />
    </div>
  );
}
