import React, { useState, useEffect } from 'react';
import { formatDateForAPI, formatDateForDisplay, formatTime } from '../hooks/useTeamData';
import { getTeamAbbr } from '../utils/teamUtils';
import { playClickSound } from '../utils/audio';

export function MLBSchedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // Fetch games for selected date
  useEffect(() => {
    async function fetchGames() {
      setLoading(true);
      try {
        const dateStr = formatDateForAPI(selectedDate);
        const response = await fetch(`https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${dateStr}&hydrate=game(content(editorial(recap))),decisions,person,probablePitcher,stats,homeRuns,previousPlay,team`);
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

    fetchGames();
  }, [selectedDate]);

  // Calendar component
  const Calendar = () => {
    const today = new Date();
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Add day headers
    dayNames.forEach(day => {
      days.push(
        <div key={day} style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', padding: '4px' }}>
          {day}
        </div>
      );
    });

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} style={{ padding: '4px' }}></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const isToday = date.toDateString() === today.toDateString();

      days.push(
        <div
          key={day}
          onClick={() => {
            setSelectedDate(date);
            setShowCalendar(false);
            playClickSound();
          }}
          style={{
            padding: '4px',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isSelected ? '#4fd1c5' : isToday ? 'rgba(79, 209, 197, 0.3)' : 'transparent',
            color: isSelected ? '#000' : '#fff',
            borderRadius: '4px',
            fontSize: '12px'
          }}
        >
          {day}
        </div>
      );
    }

    return (
      <div style={{
        position: 'absolute',
        top: '100%',
        right: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '6px',
        padding: '8px',
        zIndex: 1000,
        minWidth: '200px',
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '2px'
      }}>
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#fff', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
          {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        {days}
        <button
          onClick={() => {
            setSelectedDate(today);
            setShowCalendar(false);
            playClickSound();
          }}
          style={{
            gridColumn: '1 / -1',
            marginTop: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            color: '#fff',
            padding: '4px',
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
      padding: '16px',
      marginBottom: '2rem',
      border: 'none',
      width: '100%'
    }}>
      {/* Header with Date Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowCalendar(!showCalendar);
              playClickSound();
            }}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              color: '#fff',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500'
            }}
          >
            📅 Select Date
          </button>
          {showCalendar && <Calendar />}
        </div>
        <h2 style={{ color: '#4fd1c5', margin: 0, fontSize: '18px', fontWeight: 600 }}>
          {formatDateForDisplay(selectedDate)}
        </h2>
      </div>

      {/* Games Display */}
      {loading ? (
        <div style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', padding: '20px' }}>
          Loading games...
        </div>
      ) : games.length === 0 ? (
        <div style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', padding: '20px' }}>
          No games scheduled for this date.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {games.map((game, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              padding: '12px',
              gap: '16px'
            }}>
              {/* Away Team */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'flex-end',
                gap: '10px',
                flex: 1
              }}>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '4px'
                }}>
                  <span style={{ 
                    color: '#fff', 
                    fontSize: '14px', 
                    fontWeight: '700',
                    lineHeight: '1'
                  }}>
                    {getTeamAbbr(game.teams.away.team.id)}
                  </span>
                  {game.linescore && (
                    <span style={{ 
                      color: game.status.statusCode === 'F' && game.teams.away.score > game.teams.home.score ? '#4fd1c5' : '#fff', 
                      fontSize: '16px', 
                      fontWeight: game.status.statusCode === 'F' && game.teams.away.score > game.teams.home.score ? '900' : '800',
                      lineHeight: '1'
                    }}>
                      {game.teams.away.score || 0}
                    </span>
                  )}
                </div>
                <img
                  src={game.status.statusCode === 'F' && game.teams.away.score < game.teams.home.score 
                    ? `https://img.mlbstatic.com/mlb-photos/image/upload/w_50,f_png,q_auto/v1/team/${game.teams.away.team.id}/logo/cap/dark/inactive`
                    : `https://img.mlbstatic.com/mlb-photos/image/upload/w_50,f_png,q_auto/v1/team/${game.teams.away.team.id}/logo/spot/current`
                  }
                  alt={`${game.teams.away.team.name} logo`}
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    objectFit: 'contain',
                    display: 'block',
                    opacity: game.status.statusCode === 'F' && game.teams.away.score < game.teams.home.score ? 0.4 : 1,
                    filter: game.status.statusCode === 'F' && game.teams.away.score < game.teams.home.score ? 'grayscale(100%) brightness(0.7)' : 'none'
                  }}
                  onError={(e) => {
                    if (e.target.src.includes('/inactive')) {
                      e.target.src = `https://img.mlbstatic.com/mlb-photos/image/upload/w_50,f_png,q_auto/v1/team/${game.teams.away.team.id}/logo/spot/current`;
                      e.target.style.filter = 'grayscale(100%) brightness(0.7) contrast(0.8)';
                      e.target.style.opacity = '0.4';
                    } else {
                      e.target.style.display = 'none';
                    }
                  }}
                />
              </div>

              {/* Game Time, State & Inning in Center */}
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '80px',
                gap: '4px'
              }}>
                <div style={{ 
                  color: '#fff', 
                  fontSize: '12px', 
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  {game.status.statusCode === 'F' ? 'FINAL' :
                   game.status.statusCode === 'I' ? 'LIVE' :
                   game.status.statusCode === 'P' ? 'POSTPONED' :
                   formatTime(game.gameDate)}
                </div>
                {game.linescore && game.status.statusCode === 'I' && (
                  <div style={{ 
                    color: '#4fd1c5', 
                    fontSize: '10px', 
                    fontWeight: '500',
                    textAlign: 'center'
                  }}>
                    {game.linescore.inningState} {game.linescore.currentInning}
                  </div>
                )}
              </div>

              {/* Home Team */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '10px',
                flex: 1
              }}>
                <img
                  src={game.status.statusCode === 'F' && game.teams.home.score < game.teams.away.score 
                    ? `https://img.mlbstatic.com/mlb-photos/image/upload/w_50,f_png,q_auto/v1/team/${game.teams.home.team.id}/logo/cap/dark/inactive`
                    : `https://img.mlbstatic.com/mlb-photos/image/upload/w_50,f_png,q_auto/v1/team/${game.teams.home.team.id}/logo/spot/current`
                  }
                  alt={`${game.teams.home.team.name} logo`}
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    objectFit: 'contain',
                    display: 'block',
                    opacity: game.status.statusCode === 'F' && game.teams.home.score < game.teams.away.score ? 0.4 : 1,
                    filter: game.status.statusCode === 'F' && game.teams.home.score < game.teams.away.score ? 'grayscale(100%) brightness(0.7)' : 'none'
                  }}
                  onError={(e) => {
                    if (e.target.src.includes('/inactive')) {
                      e.target.src = `https://img.mlbstatic.com/mlb-photos/image/upload/w_50,f_png,q_auto/v1/team/${game.teams.home.team.id}/logo/spot/current`;
                      e.target.style.filter = 'grayscale(100%) brightness(0.7) contrast(0.8)';
                      e.target.style.opacity = '0.4';
                    } else {
                      e.target.style.display = 'none';
                    }
                  }}
                />
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '4px'
                }}>
                  <span style={{ 
                    color: '#fff', 
                    fontSize: '14px', 
                    fontWeight: '700',
                    lineHeight: '1'
                  }}>
                    {getTeamAbbr(game.teams.home.team.id)}
                  </span>
                  {game.linescore && (
                    <span style={{ 
                      color: game.status.statusCode === 'F' && game.teams.home.score > game.teams.away.score ? '#4fd1c5' : '#fff', 
                      fontSize: '16px', 
                      fontWeight: game.status.statusCode === 'F' && game.teams.home.score > game.teams.away.score ? '900' : '800',
                      lineHeight: '1'
                    }}>
                      {game.teams.home.score || 0}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
