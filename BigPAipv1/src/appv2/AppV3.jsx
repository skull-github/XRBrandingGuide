import { useState, useEffect } from 'react';
import '../App.css';

const capLogoVariants = [
  { key: 'rasterLightActive', label: 'Raster Light Active' },
  { key: 'rasterLightInactive', label: 'Raster Light Inactive' },
  { key: 'rasterDarkActive', label: 'Raster Dark Active' },
  { key: 'rasterDarkInactive', label: 'Raster Dark Inactive' },
  { key: 'svgLightActive', label: 'SVG Light Active' },
  { key: 'svgLightInactive', label: 'SVG Light Inactive' },
  { key: 'svgDarkActive', label: 'SVG Dark Active' },
  { key: 'svgDarkInactive', label: 'SVG Dark Inactive' },
];

// Asset helpers from App v1
function SpotColorWithHex({ teamID }) {
  const [hex, setHex] = useState('');
  const url = `https://img.mlbstatic.com/mlb-photos/image/upload/w_200,f_png,q_auto/v1/team/${teamID}/fill/spot`;
  useEffect(() => {
    if (!teamID) return;
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;
    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const x = Math.floor(img.width / 2);
      const y = Math.floor(img.height / 2);
      const data = ctx.getImageData(x, y, 1, 1).data;
      const hexColor = `#${((1 << 24) + (data[0] << 16) + (data[1] << 8) + data[2]).toString(16).slice(1)}`;
      setHex(hexColor);
    };
    img.onerror = function () { setHex(''); };
  }, [teamID, url]);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <img src={url} alt={`Spot color for team ${teamID}`} style={{ maxWidth: 80, maxHeight: 80, objectFit: 'contain', background: '#fff' }} />
      {hex && <span style={{ fontFamily: 'monospace' }}>{hex}</span>}
    </div>
  );
}

function RosterDropdown({ teamID, value, onChange, autoSelectFirst }) {
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!teamID) return;
    setLoading(true);
    setError('');
    fetch(`https://statsapi.mlb.com/api/v1/teams/${teamID}/roster/Active`)
      .then(res => res.json())
      .then(data => {
        if (data && data.roster) {
          setRoster(data.roster);
          if (autoSelectFirst && data.roster.length > 0 && !value) {
            onChange({ target: { value: data.roster[0].person.id } });
          }
        } else {
          setRoster([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load roster');
        setRoster([]);
        setLoading(false);
      });
  }, [teamID]);

  return (
    <div>
      {loading ? 'Loading...' : error ? error : (
        <select style={{ minWidth: 220 }} value={value} onChange={onChange}>
          <option value="">Select Player</option>
          {roster.map(player => {
            const jersey = player.jerseyNumber ? `#${player.jerseyNumber}` : '';
            const pos = player.position?.abbreviation || '';
            return (
              <option key={player.person.id} value={player.person.id}>
                {player.person.fullName} {jersey} {pos && `(${pos})`}
              </option>
            );
          })}
        </select>
      )}
    </div>
  );
}

function ImageModal({ src, alt, open, onClose }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }} onClick={onClose}>
      <img src={src} alt={alt} style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 12, boxShadow: '0 8px 32px #000a' }} />
    </div>
  );
}

function HeadshotSilo({ playerID }) {
  const [modal, setModal] = useState({ open: false, src: '', alt: '' });
  if (!playerID) return null;
  const headshotUrl = `https://img.mlbstatic.com/mlb-photos/image/upload/w_400,q_auto/v1/people/${playerID}/headshot/silo/current`;
  const heroUrl = `https://img.mlbstatic.com/mlb-photos/image/upload/w_1200,f_png,q_auto/v1/people/${playerID}/action/hero/current`;
  const verticalUrl = `https://img.mlbstatic.com/mlb-photos/image/upload/w_720,f_png,q_auto/v1/people/${playerID}/action/vertical/current`;
  const pressboxUrl = `https://img.mlbstatic.com/mlb-photos/image/upload/w_720,f_png,q_auto/v1/people/${playerID}/pressbox/current`;
  return (
    <>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <img
          src={headshotUrl}
          alt={`Headshot for player ${playerID}`}
          style={{ maxWidth: 80, maxHeight: 80, objectFit: 'contain', background: '#fff', cursor: 'pointer' }}
          onClick={() => setModal({ open: true, src: headshotUrl, alt: `Headshot for player ${playerID}` })}
        />
        <img
          src={heroUrl}
          alt={`Hero action for player ${playerID}`}
          style={{ maxWidth: 160, maxHeight: 80, objectFit: 'contain', background: '#fff', borderRadius: 6, cursor: 'pointer' }}
          onClick={() => setModal({ open: true, src: heroUrl, alt: `Hero action for player ${playerID}` })}
        />
        <img
          src={verticalUrl}
          alt={`Vertical action for player ${playerID}`}
          style={{ maxWidth: 60, maxHeight: 80, objectFit: 'contain', background: '#fff', borderRadius: 6, cursor: 'pointer' }}
          onClick={() => setModal({ open: true, src: verticalUrl, alt: `Vertical action for player ${playerID}` })}
        />
        <img
          src={pressboxUrl}
          alt={`Pressbox for player ${playerID}`}
          style={{ maxWidth: 60, maxHeight: 80, objectFit: 'contain', background: '#fff', borderRadius: 6, cursor: 'pointer' }}
          onClick={() => setModal({ open: true, src: pressboxUrl, alt: `Pressbox for player ${playerID}` })}
        />
      </div>
      <ImageModal open={modal.open} src={modal.src} alt={modal.alt} onClose={() => setModal({ open: false, src: '', alt: '' })} />
    </>
  );
}

function PlayerCard({ player, teamColor }) {
  if (!player) return null;
  const headshotUrl = `https://img.mlbstatic.com/mlb-photos/image/upload/w_400,q_auto/v1/people/${player.person.id}/headshot/silo/current`;
  return (
    <div style={{
      background: '#18181b', color: '#fff', borderRadius: 12, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)', padding: 24, maxWidth: 340, minWidth: 260, margin: '1rem 0', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontFamily: 'inherit', border: '2px solid #444', textAlign: 'left'
    }}>
      <div style={{ width: '100%', textAlign: 'left', marginBottom: 12, display: 'flex', justifyContent: 'flex-start' }}>
        <img src={headshotUrl} alt={player.person.fullName} style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8, background: teamColor || '#fff', boxShadow: '0 2px 8px #0008' }} />
      </div>
      <h2 style={{ margin: '0.5rem 0 0.25rem 0', fontSize: 22, fontWeight: 700 }}>{player.person.fullName}</h2>
      <div style={{ fontSize: 16, marginBottom: 8 }}>
        <b>#{player.jerseyNumber}</b> &nbsp;|&nbsp; <b>{player.position.abbreviation}</b> <span style={{ color: '#aaa' }}>({player.position.name})</span>
      </div>
      <div style={{ fontSize: 15, marginBottom: 8 }}>
        <b>Status:</b> {player.status.description}
      </div>
      <div style={{ fontSize: 14, color: '#aaa', marginBottom: 4 }}>
        <b>Player ID:</b> {player.person.id}
      </div>
      <div style={{ fontSize: 14, color: '#aaa', marginBottom: 4 }}>
        <b>Position Type:</b> {player.position.type}
      </div>
      <div style={{ fontSize: 14, color: '#aaa', marginBottom: 4 }}>
        <b>Position Code:</b> {player.position.code}
      </div>
      <div style={{ fontSize: 14, color: '#aaa', marginBottom: 4 }}>
        <b>Team ID:</b> {player.parentTeamId}
      </div>
      <div style={{ fontSize: 14, color: '#aaa', marginBottom: 4 }}>
        <b>API Link:</b> <a href={`https://www.mlb.com/player/${player.person.id}`} target="_blank" rel="noopener noreferrer" style={{ color: '#4fd1c5' }}>MLB Profile</a>
      </div>
    </div>
  );
}

function SelectedPlayerCard({ teamID, playerID, teamColor }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  useEffect(() => {
    if (!playerID) return setSelectedPlayer(null);
    fetch(`https://statsapi.mlb.com/api/v1/teams/${teamID}/roster/Active`)
      .then(res => res.json())
      .then(data => {
        if (data && data.roster) {
          const found = data.roster.find(p => String(p.person.id) === String(playerID));
          setSelectedPlayer(found || null);
        } else {
          setSelectedPlayer(null);
        }
      });
  }, [playerID, teamID]);
  return selectedPlayer ? <PlayerCard player={selectedPlayer} teamColor={teamColor} /> : null;
}

function AppV3() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlayers, setSelectedPlayers] = useState({});

  useEffect(() => {
    async function fetchBranding() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('https://storage.mobile.mlbinfra.com/atbatconfig/branding.json');
        if (!res.ok) throw new Error('Failed to fetch branding data');
        const data = await res.json();
        setTeams(data.teams);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBranding();
  }, []);

  if (loading) return <div className="App"><p>Loading branding data...</p></div>;
  if (error) return <div className="App"><p>Error: {error}</p></div>;

  const colorPriority = ['primaryLight', 'primaryDark', 'secondary', 'tertiary'];

  function renderTeamCard(team) {
    if (!team.teamID) return null;
    const colors = team.teamColors || {};
    const colorPriority = ['primaryLight', 'primaryDark', 'secondary', 'tertiary'];
    const mainColors = colorPriority
      .filter(key => colors[key] && typeof colors[key] === 'string' && colors[key].startsWith('#'))
      .map(key => ({ name: key, value: colors[key] }));
    const otherColors = Object.entries(colors)
      .filter(([name, value]) =>
        typeof value === 'string' && value.startsWith('#') && !colorPriority.includes(name)
      )
      .map(([name, value]) => ({ name, value }));
    const teamColor = colors.primaryLight || '#fff';
    const selectedPlayerId = selectedPlayers[team.teamID] || '';
    return (
      <div className="branding-card" key={team.teamID} id={`team-card-${team.teamID}`}> 
        {/* Player dropdown and card moved to top */}
        <div style={{ margin: '0 0 1.5rem 0', width: '100%' }}>
          <RosterDropdown
            teamID={team.teamID}
            value={selectedPlayerId}
            onChange={e => setSelectedPlayers(sp => ({ ...sp, [team.teamID]: e.target.value }))}
            autoSelectFirst={false}
          />
          <SelectedPlayerCard teamID={team.teamID} playerID={selectedPlayerId} teamColor={teamColor} />
        </div>
        <div className="branding-header">
          <span><b>ID:</b> {team.teamID}</span>
          {team.teamCode && <span><b>CODE:</b> {team.teamCode.toUpperCase()}</span>}
          {team.fileCode && <span><b>FILE:</b> {team.fileCode.toUpperCase()}</span>}
        </div>
        <h2 style={{ margin: '0.5rem 0 1rem 0', textAlign: 'left', width: '100%' }}>{team.clubFullName}</h2>
        <div className="branding-logos" style={{ flexWrap: 'wrap' }}>
          {capLogoVariants.map(variant => {
            const url = team.capLogos?.[variant.key];
            if (!url) return null;
            let imgUrl = url;
            if (variant.key.startsWith('raster')) {
              imgUrl = url.replace('{type}', 'png').replace('{width}', '200');
            }
            return (
              <div key={variant.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginRight: 16, marginBottom: 8 }}>
                <span style={{ fontSize: '0.85rem', color: '#555', marginBottom: 2 }}>{variant.label}</span>
                <img src={imgUrl} alt={variant.label} className="branding-logo" style={{ background: variant.key.includes('Dark') ? '#222' : '#fff', borderRadius: 4, width: 200 }} />
              </div>
            );
          })}
        </div>
        <div className="branding-logos">
          {team.wordmarks?.rasterLight && (
            <img src={team.wordmarks.rasterLight.replace('{type}', 'png').replace('{width}', '200')} alt="Wordmark Light" className="branding-wordmark" />
          )}
          {team.wordmarks?.rasterDark && (
            <img src={team.wordmarks.rasterDark.replace('{type}', 'png').replace('{width}', '200')} alt="Wordmark Dark" className="branding-wordmark" style={{ background: '#222', padding: '0.5rem', borderRadius: '4px' }} />
          )}
        </div>
        <div className="branding-colors" style={{ marginBottom: '0.5rem' }}>
          {mainColors.map(color => (
            <div key={color.name} className="branding-color">
              <div className="branding-color-swatch" style={{ background: color.value }}></div>
              <div className="branding-color-label">
                <span>{color.name}<br />{color.value}</span>
              </div>
            </div>
          ))}
        </div>
        {otherColors.length > 0 && (
          <div className="branding-colors">
            {otherColors.map(color => (
              <div key={color.name} className="branding-color">
                <div className="branding-color-swatch" style={{ background: color.value }}></div>
                <div className="branding-color-label">
                  <span>{color.name}<br />{color.value}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* MLB.TV image assets */}
        {team.mlbtv && (
          <div style={{ margin: '1rem 0', width: '100%' }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>MLB.TV Assets:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-start' }}>
              {team.mlbtv.defaultBackground?.imageUrl && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.85rem', color: '#555', marginBottom: 2 }}>Default Background</span>
                  <img src={team.mlbtv.defaultBackground.imageUrl} alt="Default Background" style={{ maxWidth: 200, borderRadius: 6, background: '#eee' }} />
                </div>
              )}
              {team.mlbtv.welcome?.browse?.imageUrl && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.85rem', color: '#555', marginBottom: 2 }}>Welcome Browse</span>
                  <img src={team.mlbtv.welcome.browse.imageUrl} alt="Welcome Browse" style={{ maxWidth: 200, borderRadius: 6, background: '#eee' }} />
                </div>
              )}
              {team.mlbtv.welcome?.create?.imageUrl && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.85rem', color: '#555', marginBottom: 2 }}>Welcome Create</span>
                  <img src={team.mlbtv.welcome.create.imageUrl} alt="Welcome Create" style={{ maxWidth: 200, borderRadius: 6, background: '#eee' }} />
                </div>
              )}
              {team.mlbtv.welcome?.explore?.imageUrl && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.85rem', color: '#555', marginBottom: 2 }}>Welcome Explore</span>
                  <img src={team.mlbtv.welcome.explore.imageUrl} alt="Welcome Explore" style={{ maxWidth: 200, borderRadius: 6, background: '#eee' }} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="App" style={{ padding: '2rem' }}>
      <h1 style={{ color: '#fff', fontWeight: 800, background: '#111', padding: '0.5em 1em', borderRadius: '8px', display: 'inline-block', textAlign: 'left' }}>MLB Team Branding + Player Cards</h1>
      <div className="branding-grid">
        {teams.map(renderTeamCard)}
      </div>
    </div>
  );
}

export default AppV3;
