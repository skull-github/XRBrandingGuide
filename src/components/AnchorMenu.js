import React from 'react';
import { TEAM_DIVISIONS, organizeTeamsByDivision } from '../utils/teamUtils';
import { useTeamSpotColor } from '../hooks/useTeamData';
import { playClickSound } from '../utils/audio';

function TeamButton({ team }) {
  const spotColor = useTeamSpotColor(team.teamID);
  
  // Get spot logo from MLB Photos API (the correct spot logo endpoint)
  const getSpotLogo = (teamData) => {
    if (!teamData || !teamData.teamID) return null;
    return `https://img.mlbstatic.com/mlb-photos/image/upload/w_28,f_png,q_auto/v1/team/${teamData.teamID}/logo/spot/current`;
  };

  const spotLogo = getSpotLogo(team);
  
  return (
    <a
      key={team.teamID}
      href={`#team-${team.teamID || team.clubFullName.replace(/\s+/g, '-').toLowerCase()}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
        padding: '0',
        borderRadius: '50%',
        backgroundColor: 'transparent',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        width: '36px',
        height: '36px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.15)';
        e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
        e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
        e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
      }}
      onClick={() => playClickSound()}
    >
      {/* Spot Logo - circular for anchor menu */}
      <div
        style={{
          width: '28px',
          height: '28px',
          backgroundColor: spotColor,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        {spotLogo ? (
          <img
            src={spotLogo}
            alt={`${team.clubFullName} spot logo`}
            style={{
              width: '20px', // 70% of 28px
              height: '20px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              // Show team abbreviation as fallback
              const textDiv = document.createElement('div');
              textDiv.style.cssText = 'color: #fff; font-size: 7px; font-weight: 700; text-align: center;';
              textDiv.textContent = team.abbreviation || team.teamCode?.toUpperCase() || 'TBD';
              e.target.parentNode.appendChild(textDiv);
            }}
          />
        ) : (
          <div style={{
            color: '#fff',
            fontSize: '7px',
            fontWeight: '700',
            textAlign: 'center'
          }}>
            {team.abbreviation || team.teamCode?.toUpperCase() || 'TBD'}
          </div>
        )}
      </div>
    </a>
  );
}

export function AnchorMenu({ teams }) {
  if (!teams || teams.length === 0) return null;

  const organizedTeams = organizeTeamsByDivision(teams);

  return (
    <div style={{
      position: 'sticky',
      top: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      borderRadius: '12px',
      padding: '12px 16px',
      marginBottom: '1.5rem',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(12px)',
      zIndex: 1000,
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        alignItems: 'flex-start'
      }}>
        {/* American League Row */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px',
          width: '100%',
          justifyContent: 'flex-start',
          flexWrap: 'wrap'
        }}>
          <a 
            href="#al-allstars"
            style={{
              color: '#4fd1c5',
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '0.5px',
              minWidth: '80px',
              textAlign: 'center',
              textDecoration: 'none',
              borderBottom: '1px solid transparent',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderBottomColor = '#4fd1c5';
              e.target.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderBottomColor = 'transparent';
              e.target.style.color = '#4fd1c5';
            }}
            onClick={() => playClickSound()}
          >
            AMERICAN
          </a>
          {['AL East', 'AL Central', 'AL West'].map(division => (
            <div key={division} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '9px',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                minWidth: '30px'
              }}>
                {division.replace('AL ', '')}
              </span>
              <div style={{
                display: 'flex',
                gap: '5px'
              }}>
                {organizedTeams[division]?.map(team => (
                  <TeamButton key={team.teamID} team={team} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* National League Row */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px',
          width: '100%',
          justifyContent: 'flex-start',
          flexWrap: 'wrap'
        }}>
          <a 
            href="#nl-allstars"
            style={{
              color: '#4fd1c5',
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '0.5px',
              minWidth: '80px',
              textAlign: 'center',
              textDecoration: 'none',
              borderBottom: '1px solid transparent',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderBottomColor = '#4fd1c5';
              e.target.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderBottomColor = 'transparent';
              e.target.style.color = '#4fd1c5';
            }}
            onClick={() => playClickSound()}
          >
            NATIONAL
          </a>
          {['NL East', 'NL Central', 'NL West'].map(division => (
            <div key={division} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '9px',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                minWidth: '30px'
              }}>
                {division.replace('NL ', '')}
              </span>
              <div style={{
                display: 'flex',
                gap: '5px'
              }}>
                {organizedTeams[division]?.map(team => (
                  <TeamButton key={team.teamID} team={team} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
