import { useState, useEffect, useRef } from 'react'
import './App.css'
import teamExtras from './team-extras.json'
import Papa from 'papaparse';
// import SpotColorWithHex from "./AppV3.jsx";
const SpotColorWithHex = () => null; // Placeholder to prevent import error

const capLogoVariants = [
  { key: 'rasterDarkActive', label: 'Raster Dark Active' },
  { key: 'rasterDarkInactive', label: 'Raster Dark Inactive' },
  { key: 'rasterLightActive', label: 'Raster Light Active' },
  { key: 'rasterLightInactive', label: 'Raster Light Inactive' },
  { key: 'svgDarkActive', label: 'SVG Dark Active' },
  { key: 'svgDarkInactive', label: 'SVG Dark Inactive' },
  { key: 'svgLightActive', label: 'SVG Light Active' },
  { key: 'svgLightInactive', label: 'SVG Light Inactive' },
];

// Baseball-themed sound utility functions
function playHoverSound() {
  try {
    // Create a subtle "baseball glove catch" sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Simulate the "thunk" of a ball hitting leather
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.05);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.08);
  } catch (e) {
    // Fallback - no sound if Web Audio API not supported
  }
}

function playClickSound() {
  try {
    // Create a "bat hitting ball" crack sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create white noise for the "crack"
    const bufferSize = audioContext.sampleRate * 0.2; // 0.2 seconds
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = buffer.getChannelData(0);
    
    // Generate white noise with envelope
    for (let i = 0; i < bufferSize; i++) {
      const envelope = Math.exp(-i / (audioContext.sampleRate * 0.05)); // Decay
      output[i] = (Math.random() * 2 - 1) * envelope * 0.3;
    }
    
    const whiteNoise = audioContext.createBufferSource();
    whiteNoise.buffer = buffer;
    
    // High-pass filter for the "crack" effect
    const filter = audioContext.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1000, audioContext.currentTime);
    filter.Q.setValueAtTime(15, audioContext.currentTime);
    
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    
    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    whiteNoise.start(audioContext.currentTime);
    whiteNoise.stop(audioContext.currentTime + 0.15);
  } catch (e) {
    // Fallback - no sound if Web Audio API not supported
  }
}

// Helper hook to get spot color for a team
function useTeamSpotColor(teamID) {
  const [hex, setHex] = useState('#fff');
  useEffect(() => {
    const imgUrl = `https://img.mlbstatic.com/mlb-photos/image/upload/w_200,f_png,q_auto/v1/team/${teamID}/fill/spot`;
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = imgUrl;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const data = ctx.getImageData(0, 0, img.width, img.height).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] > 200) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
          }
        }
        if (count > 0) {
          r = Math.round(r / count);
          g = Math.round(g / count);
          b = Math.round(b / count);
          const hexColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
          setHex(hexColor);
        } else {
          setHex('#fff');
        }
      } catch (e) {
        setHex('#fff');
      }
    };
  }, [teamID]);
  return hex;
}

// --- Player Roster and Card logic from AppV3 ---
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
    <div style={{ textAlign: 'left', width: '100%' }}>
      {loading ? 'Loading...' : error ? error : (
        <select style={{ minWidth: 440, width: '100%', maxWidth: 440, textAlign: 'left' }} value={value} onChange={onChange}>
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

function PlayerImageGallery({ playerID }) {
  const [modal, setModal] = useState({ open: false, src: '', alt: '' });
  const [copied, setCopied] = useState(false);
  if (!playerID) return null;
  const headshotUrl = `https://img.mlbstatic.com/mlb-photos/image/upload/w_400,q_auto/v1/people/${playerID}/headshot/silo/current`;
  const heroUrl = `https://img.mlbstatic.com/mlb-photos/image/upload/w_1200,f_png,q_auto/v1/people/${playerID}/action/hero/current`;
  const verticalUrl = `https://img.mlbstatic.com/mlb-photos/image/upload/w_720,f_png,q_auto/v1/people/${playerID}/action/vertical/current`;
  const pressboxUrl = `https://img.mlbstatic.com/mlb-photos/image/upload/w_720,f_png,q_auto/v1/people/${playerID}/pressbox/current`;
  function handleCopy() {
    navigator.clipboard.writeText(modal.src);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }
  return (
    <>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'nowrap', marginBottom: 12, justifyContent: 'flex-start' }}>
        <img
          src={headshotUrl}
          alt={`Headshot for player ${playerID}`}
          style={{ maxWidth: 120, maxHeight: 120, objectFit: 'contain', background: '#fff', cursor: 'pointer', borderRadius: 10 }}
          onClick={() => setModal({ open: true, src: headshotUrl, alt: `Headshot for player ${playerID}` })}
        />
        <img
          src={heroUrl}
          alt={`Hero action for player ${playerID}`}
          style={{ maxWidth: 180, maxHeight: 120, objectFit: 'contain', background: '#fff', borderRadius: 10, cursor: 'pointer' }}
          onClick={() => setModal({ open: true, src: heroUrl, alt: `Hero action for player ${playerID}` })}
        />
        <img
          src={verticalUrl}
          alt={`Vertical action for player ${playerID}`}
          style={{ maxWidth: 80, maxHeight: 120, objectFit: 'contain', background: '#fff', borderRadius: 10, cursor: 'pointer' }}
          onClick={() => setModal({ open: true, src: verticalUrl, alt: `Vertical action for player ${playerID}` })}
        />
        <img
          src={pressboxUrl}
          alt={`Pressbox for player ${playerID}`}
          style={{ maxWidth: 80, maxHeight: 120, objectFit: 'contain', background: '#fff', borderRadius: 10, cursor: 'pointer' }}
          onClick={() => setModal({ open: true, src: pressboxUrl, alt: `Pressbox for player ${playerID}` })}
        />
      </div>
      {modal.open && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }} onClick={() => setModal({ open: false, src: '', alt: '' })}>
          <img src={modal.src} alt={modal.alt} style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: 12, boxShadow: '0 8px 32px #000a', marginBottom: 16 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={e => { e.stopPropagation(); handleCopy(); }} style={{ padding: '6px 10px', borderRadius: 6, border: 'none', background: '#4fd1c5', color: '#222', fontWeight: 600, cursor: 'pointer' }}>{copied ? 'Copied!' : 'Copy link'}</button>
            <a href={modal.src} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', background: '#222', padding: '6px 14px', borderRadius: 6, fontSize: 15, textDecoration: 'underline' }}>{modal.src}</a>
          </div>
        </div>
      )}
    </>
  );
}

function PlayerImageSilo({ playerID, bgColor }) {
  if (!playerID) return null;
  const url = `https://img.mlbstatic.com/mlb-photos/image/upload/w_400,q_auto/v1/people/${playerID}/headshot/silo/current`;
  return (
    <div style={{
      width: 108, height: 108, borderRadius: '50%', background: bgColor || '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, boxShadow: '0 2px 8px #0008',
    }}>
      <img
        src={url}
        alt={`Headshot for player ${playerID}`}
        style={{ width: 108, height: 108, objectFit: 'cover', borderRadius: '50%' }}
      />
    </div>
  );
}

function PlayerCard({ player, teamColor }) {
  if (!player) return null;
  return (
    <div style={{
      background: '#142030',
      borderRadius: 16,
      boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)',
      padding: '32px 36px',
      width: '100%',
      minWidth: 320,
      margin: '1.5rem 0',
      fontFamily: 'Inter, sans-serif',
      border: '1.5px solid #292929',
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
    }}>
      {/* Row 1: Player spot and info */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 32 }}>
        {/* Player spot */}
        <div style={{ flex: '0 0 108px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {/* Use spot color for PlayerImageSilo background */}
          <TeamSpotWithColor
            teamID={player.parentTeamId}
            size={108}
            logoUrl={null}
            fallbackColor={teamColor}
          />
        </div>
        {/* Player info */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left', justifyContent: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, fontFamily: 'inherit', color: '#fff', letterSpacing: 0.5, lineHeight: 1.2 }}>{player.person.fullName}</h2>
          <div style={{ fontSize: 16, fontWeight: 500, color: '#fff', margin: 0 }}>
            <b>{player.position.abbreviation}</b> <span style={{ color: '#aaa' }}>({player.position.name})</span>
          </div>
          <div style={{ fontSize: 15, color: '#e2e2e2', margin: 0 }}>
            <b>Status:</b> {player.status.description}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, margin: '8px 0 0 0', fontSize: 14, color: '#aaa' }}>
            <span><b>Jersey:</b> #{player.jerseyNumber}</span>
            <span><b>Player ID:</b> {player.person.id}</span>
            <span><b>Position Type:</b> {player.position.type}</span>
            <span><b>Position Code:</b> {player.position.code}</span>
            <span><b>Team ID:</b> {player.parentTeamId}</span>
          </div>
          <div style={{ fontSize: 14, color: '#4fd1c5', margin: '8px 0 0 0' }}>
            <b>API Link:</b> <a href={`https://www.mlb.com/player/${player.person.id}`} target="_blank" rel="noopener noreferrer" style={{ color: '#4fd1c5', textDecoration: 'underline' }}>MLB Profile</a>
          </div>
        </div>
      </div>
      {/* Row 2: Player image assets */}
      <div style={{ marginTop: 12 }}>
        <PlayerImageGallery playerID={player.person.id} />
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

function GoogleSheetTable() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  function getSheetIdAndGid(sheetUrl) {
    // Handles both full and shortened URLs
    const match = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    const gidMatch = sheetUrl.match(/[?&]gid=(\d+)/);
    if (!match) return null;
    return {
      sheetId: match[1],
      gid: gidMatch ? gidMatch[1] : '0',
    };
  }

  async function handleFetch(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setData([]);
    const ids = getSheetIdAndGid(url);
    if (!ids) {
      setError('Invalid Google Sheets URL');
      setLoading(false);
      return;
    }
    const csvUrl = `https://docs.google.com/spreadsheets/d/${ids.sheetId}/export?format=csv&gid=${ids.gid}`;
    try {
      const res = await fetch(csvUrl);
      if (!res.ok) throw new Error('Failed to fetch sheet');
      const text = await res.text();
      const parsed = Papa.parse(text, { header: true });
      setData(parsed.data);
    } catch (err) {
      setError('Could not fetch or parse the sheet.');
    } finally {
      setLoading(false);
    }
  }

  // Find the columns (case-insensitive)
  function getCol(row, col) {
    if (!row) return '';
    const key = Object.keys(row).find(k => k.trim().toLowerCase() === col.toLowerCase());
    return key ? row[key] : '';
  }

  return (
    <div style={{ margin: '2rem 0', padding: '1.5rem', background: '#f8f8f8', borderRadius: 12, boxShadow: '0 2px 8px #0001' }}>
      <h2 style={{ marginTop: 0 }}>Import Teams from Google Sheets</h2>
      <form onSubmit={handleFetch} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <input
          ref={inputRef}
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="Paste Google Sheets URL here"
          style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #bbb', fontSize: 16 }}
        />
        <button type="submit" style={{ padding: '8px 18px', borderRadius: 6, background: '#4fd1c5', color: '#222', fontWeight: 600, border: 'none', fontSize: 16 }} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch'}
        </button>
      </form>
      {error && <div style={{ color: '#e74c3c', marginBottom: 10 }}>{error}</div>}
      {data && data.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px #0001' }}>
            <thead>
              <tr style={{ background: '#eaeaea' }}>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Team</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Team ID</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Reg Stats Venue ID</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  <td style={{ padding: 8, border: '1px solid #eee' }}>{getCol(row, 'Team')}</td>
                  <td style={{ padding: 8, border: '1px solid #eee' }}>{getCol(row, 'Team ID')}</td>
                  <td style={{ padding: 8, border: '1px solid #eee' }}>{getCol(row, 'Reg Stats Venue ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AppV2() {
  const [teams, setTeams] = useState([])
  const [alAllStars, setAlAllStars] = useState([])
  const [nlAllStars, setNlAllStars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPlayers, setSelectedPlayers] = useState({});

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

  try {
    return (
      <div className="App" style={{ padding: '2.5rem', maxWidth: 1200, margin: '0 auto', alignItems: 'flex-start', justifyContent: 'flex-start', background: '#1a1a1a', minHeight: '100vh' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', margin: '0 0 2.5rem 0', letterSpacing: 1, textAlign: 'center', width: '100%' }}>MLB XR Branding Guide</h1>
        {/* Anchor menu below site title */}
        {teams.length > 0 && (
          <AnchorMenu teams={teams} />
        )}
        {/* Each team in its own section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%', marginBottom: '3rem', alignItems: 'flex-start' }}>
          {teams.map(team => (
            <section key={team.teamID || team.clubFullName} style={{ width: '100%', marginBottom: 0, padding: '32px 0', alignItems: 'flex-start', display: 'flex', flexDirection: 'column' }}>
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
        {/* All-Star teams remain below, unchanged */}
        <div style={{ marginTop: '3rem', width: '100%', alignItems: 'flex-start' }}>
          <div id="al-allstars" style={{ minWidth: 320, marginBottom: '2.5rem' }}>
            <h3 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.5rem', textAlign: 'left' }}>American League All-Stars</h3>
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
            <h3 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.5rem', textAlign: 'left' }}>National League All-Stars</h3>
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
        {/* JSON Index Section */}
        <div style={{ marginTop: '3rem', padding: '2rem', background: '#18181b', borderRadius: 12, color: '#fff', maxWidth: 900, marginLeft: 'auto', marginRight: 'auto', textAlign: 'left' }}>
          <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 12, textAlign: 'left' }}>JSON Index</h2>
          <ul style={{ fontSize: 16, lineHeight: 1.7, textAlign: 'left', paddingLeft: 0, listStylePosition: 'inside' }}>
            <li>
              <a href="https://storage.mobile.mlbinfra.com/atbatconfig/branding.json" target="_blank" rel="noopener noreferrer" style={{ color: '#4fd1c5', textDecoration: 'underline' }}>
                MLB Branding JSON
              </a>
              : Team branding, colors, logos, wordmarks, MLB.TV assets, and All-Star teams.
            </li>
            <li>
              <a href="https://statsapi.mlb.com/api/v1/teams/[TEAM_ID]/roster/Active" target="_blank" rel="noopener noreferrer" style={{ color: '#4fd1c5', textDecoration: 'underline' }}>
                MLB Roster JSON
              </a>
              : Active player roster for each team (replace <code>[TEAM_ID]</code> with the team ID).
            </li>
            <li>
              <a href="https://img.mlbstatic.com/mlb-photos/image/upload/" target="_blank" rel="noopener noreferrer" style={{ color: '#4fd1c5', textDecoration: 'underline' }}>
                MLB Image CDN
              </a>
              : Player and team image assets (see code for URL patterns).
            </li>
            <li>
              <a href="./README.md" target="_blank" rel="noopener noreferrer" style={{ color: '#4fd1c5', textDecoration: 'underline' }}>
                Project README
              </a>
              : App usage, features, and internal notes.
            </li>
          </ul>
        </div>
        {/* Footer with version and legal line */}
        <footer style={{ marginTop: '3rem', padding: '2rem', textAlign: 'center', color: '#888', fontSize: 14, borderTop: '1px solid #333' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600 }}>MLB XR Branding Guide v1.6</p>
          <p style={{ margin: 0, lineHeight: 1.5 }}>
            This application is for internal use only. All MLB trademarks, logos, and content are property of Major League Baseball.
            Player images and team assets are sourced from MLB's official APIs and CDN.
          </p>
        </footer>
      </div>
    );
  } catch (renderError) {
    console.error('Render error in AppV2:', renderError);
    return (
      <div className="App" style={{ background: '#fff', color: '#e74c3c', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <h2 style={{ color: '#e74c3c', marginBottom: 16 }}>Render Error in App 2</h2>
        <p style={{ color: '#e74c3c', fontSize: 18, fontWeight: 600 }}>{String(renderError)}</p>
      </div>
    );
  }
}

// Get the BigPapi spot color for use as a background for logo assets
function useBigpapiSpotColor(teamID) {
  const [hex, setHex] = useState('#888888');
  useEffect(() => {
    const imgUrl = `https://img.mlbstatic.com/mlb-photos/image/upload/w_200,f_png,q_auto/v1/team/${teamID}/fill/spot`;
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = imgUrl;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const data = ctx.getImageData(0, 0, img.width, img.height).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] > 200) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
          }
        }
        if (count > 0) {
          r = Math.round(r / count);
          g = Math.round(g / count);
          b = Math.round(b / count);
          const hexColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
          setHex(hexColor);
        } else {
          setHex('#888888');
        }
      } catch (e) {
        setHex('#888888');
      }
    };
  }, [teamID]);
  return hex;
}

export default AppV2

function MLBTVGallery({ mlbtv }) {
  const [modal, setModal] = useState({ open: false, src: '', alt: '' });
  const [copied, setCopied] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0 });
  
  if (!mlbtv) return null;
  // Support both all-star and regular team mlbtv JSON structure
  const assets = [];
  if (mlbtv.defaultBackground?.imageUrl) assets.push({ label: 'Default Background', url: mlbtv.defaultBackground.imageUrl });
  if (mlbtv.gettingStarted?.imageUrl) assets.push({ label: 'Getting Started', url: mlbtv.gettingStarted.imageUrl });
  if (mlbtv.welcome?.browse?.imageUrl) assets.push({ label: 'Welcome Browse', url: mlbtv.welcome.browse.imageUrl });
  if (mlbtv.welcome?.create?.imageUrl) assets.push({ label: 'Welcome Create', url: mlbtv.welcome.create.imageUrl });
  if (mlbtv.welcome?.explore?.imageUrl) assets.push({ label: 'Welcome Explore', url: mlbtv.welcome.explore.imageUrl });
  if (mlbtv.welcome?.imageUrl) assets.push({ label: 'Welcome', url: mlbtv.welcome.imageUrl });
  // Add any other top-level keys with imageUrl
  Object.entries(mlbtv).forEach(([key, value]) => {
    if (key !== 'defaultBackground' && key !== 'gettingStarted' && key !== 'welcome' && value?.imageUrl) {
      assets.push({ label: key.charAt(0).toUpperCase() + key.slice(1), url: value.imageUrl });
    }
  });
  if (assets.length === 0) return null;
  
  const handleMouseEnter = (e, assetLabel) => {
    playHoverSound();
    e.target.style.transform = 'scale(1.1)';
    setTooltip({ visible: true, x: e.clientX, y: e.clientY, label: assetLabel });
  };
  
  const handleMouseLeave = (e) => {
    e.target.style.transform = 'scale(1)';
    setTooltip({ visible: false, x: 0, y: 0, label: '' });
  };
  
  return (
    <>
      <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: 8 }}>
        {assets.map(asset => (
          <Tooltip 
            key={asset.label}
            text={`Click to view ${asset.label}`} 
            visible={tooltip.visible && tooltip.label === asset.label} 
            position={{ x: tooltip.x, y: tooltip.y }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 180 }}>
              <img
                src={asset.url}
                alt={asset.label}
                style={{ maxWidth: 180, width: '100%', height: 'auto', borderRadius: 6, background: '#eee', marginBottom: 0, objectFit: 'contain', cursor: 'pointer', transition: 'transform 0.2s ease' }}
                onMouseEnter={e => handleMouseEnter(e, asset.label)}
                onMouseLeave={handleMouseLeave}
                onClick={() => { 
                  playClickSound(); 
                  setModal({ open: true, src: asset.url, alt: asset.label }); 
                }}
              />
              <span style={{ fontSize: '0.85rem', color: '#555', marginTop: 10, textAlign: 'left', width: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', boxSizing: 'border-box', paddingLeft: 10 }} title={asset.label}>{asset.label}</span>
            </div>
          </Tooltip>
        ))}
      </div>
      {modal.open && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }} onClick={() => setModal({ open: false, src: '', alt: '' })}>
          <img src={modal.src} alt={modal.alt} style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: 12, boxShadow: '0 8px 32px #000a', marginBottom: 16 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(modal.src); setCopied(true); setTimeout(() => setCopied(false), 1200); }} style={{ padding: '6px 10px', borderRadius: 6, border: 'none', background: '#4fd1c5', color: '#222', fontWeight: 600, cursor: 'pointer' }}>{copied ? 'Copied!' : 'Copy link'}</button>
            <a href={modal.src} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', background: '#222', padding: '6px 14px', borderRadius: 6, fontSize: 15, textDecoration: 'underline' }}>{modal.src}</a>
          </div>
        </div>
      )}
    </>
  );
}

function getLogoBgColor({ teamID, variantKey, colors }) {
  // Exemptions for background logo colors
  if (variantKey === 'rasterLightActive' || variantKey === 'svgLightActive') {
    if (teamID === 110) return '#000';
    if (teamID === 112) return colors.secondary || '#eee';
    if (teamID === 113) return colors.tertiary || '#eee';
    if (teamID === 137) return '#000';
    if (teamID === 120) return colors.secondary || '#eee';
  }
  if (variantKey === 'rasterDarkActive' || variantKey === 'svgDarkActive') {
    if (teamID === 143) return colors.secondary || '#eee';
    if (teamID === 137) return '#000';
  }
  // Default logic
  if (variantKey === 'rasterDarkActive' || variantKey === 'svgDarkActive') return colors.primaryLight || '#fff';
  if (variantKey === 'rasterLightActive' || variantKey === 'svgLightActive') return colors.primaryDark || '#222';
  return '#eee';
}

function LogoImageGallery({ assets, teamColor, darkActiveKey, lightActiveKey, teamPrimaryDark, teamID, colors }) {
  const [modal, setModal] = useState({ open: false, src: '', alt: '' });
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(modal.src);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }
  if (!assets || assets.length === 0) return null;
  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${assets.length}, 120px)`,
        gap: 24,
        alignItems: 'start',
        marginBottom: 8,
        width: '100%',
        justifyContent: 'flex-start',
      }}>
        {assets.map(asset => {
          const isDarkActive = darkActiveKey && asset.key === darkActiveKey;
          const isLightActive = lightActiveKey && asset.key === lightActiveKey;
          const bgColor = getLogoBgColor({ teamID, variantKey: asset.key, colors });
          return (
            <div key={asset.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', width: 120 }}>
              <span style={{ fontSize: '0.95rem', color: '#fff', marginBottom: 8, textAlign: 'center', minHeight: 22 }}>{asset.label}</span>
              <img
                src={asset.url}
                alt={asset.label}
                style={{ width: 100, height: 100, objectFit: 'contain', borderRadius: 8, background: bgColor, marginBottom: 2, boxShadow: '0 1px 6px #0002' }}
                onClick={() => setModal({ open: true, src: asset.url, alt: asset.label })}
              />
              <span style={{ fontSize: 13, color: '#fff', marginTop: 2, letterSpacing: 0.5 }}>BG: {bgColor}</span>
            </div>
          );
        })}
      </div>
      {modal.open && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }} onClick={() => setModal({ open: false, src: '', alt: '' })}>
          <img src={modal.src} alt={modal.alt} style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: 12, boxShadow: '0 8px 32px #000a', marginBottom: 16 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={e => { e.stopPropagation(); handleCopy(); }} style={{ padding: '6px 10px', borderRadius: 6, border: 'none', background: '#4fd1c5', color: '#222', fontWeight: 600, cursor: 'pointer' }}>{copied ? 'Copied!' : 'Copy link'}</button>
            <a href={modal.src} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', background: '#222', padding: '6px 14px', borderRadius: 6, fontSize: 15, textDecoration: 'underline' }}>{modal.src}</a>
          </div>
        </div>
      )}
    </>
  );
}

// Wrapper for TeamSpot that safely uses useTeamSpotColor
function TeamSpotWithColor({ teamID, size, logoUrl, fallbackColor }) {
  const spotColor = useTeamSpotColor(teamID);
  return (
    <TeamSpot
      teamID={teamID}
      size={size}
      color={fallbackColor}
      logoUrl={logoUrl}
      spotColor={spotColor}
    />
  );
}

function TeamSpot({ teamID, size = 80, color, logoUrl, spotColor }) {
  const bgColor = spotColor || color || '#fff';
  return (
    <div style={{ width: size, height: size, background: bgColor, borderRadius: '50%', padding: size * 0.1875, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #0003' }}>
      <img
        src={logoUrl || `https://img.mlbstatic.com/mlb-photos/image/upload/w_${size},f_png,q_auto/v1/team/${teamID}/logo/spot/current`}
        alt={`Default logo for team ${teamID}`}
        style={{ width: size * 0.8, height: size * 0.8, objectFit: 'contain', background: 'transparent', display: 'block', margin: 'auto', pointerEvents: 'none' }}
      />
    </div>
  );
}

function TeamCard({ team, opts, selectedPlayerId, setSelectedPlayers, colorPriority }) {
  const [revealed, setRevealed] = useState(false); // Default to hidden
  const [logoModal, setLogoModal] = useState({ open: false, src: '', alt: '' });
  const bigpapiSpotColor = useBigpapiSpotColor(team.teamID);
  if (team.teamID === 0) return null;
  const colors = team.teamColors || {};
  const mainColors = colorPriority
    .filter(key => colors[key] && typeof colors[key] === 'string' && colors[key].startsWith('#'))
    .map(key => ({ name: key, value: colors[key] }));
  const otherColors = Object.entries(colors)
    .filter(([name, value]) =>
      typeof value === 'string' && value.startsWith('#') && !colorPriority.includes(name)
    )
    .map(([name, value]) => ({ name, value }));
  // Use the actual background color for the dark active logo
  const darkActiveBg = getLogoBgColor({ teamID: team.teamID, variantKey: 'rasterDarkActive', colors });
  const teamColor = colors.primaryLight || '#fff';
  const showPlayer = opts && opts.showPlayer;

  // Collect all extra name/code fields (excluding those already shown)
  const extraNameFields = Object.entries(team)
    .filter(([key, value]) => {
      const lower = key.toLowerCase();
      if (['teamid', 'clubfullname', 'teamcode', 'filecode'].includes(lower)) return false;
      return (
        (lower.includes('name') || lower.includes('code')) &&
        typeof value === 'string' && value.trim() !== ''
      );
    });

  return (
    <div className="branding-card" key={team.teamID || team.clubFullName} id={`team-card-${team.teamID}`}
      style={{
        background: '#23272f',
        borderRadius: 18,
        boxShadow: '0 4px 32px 0 rgba(0,0,0,0.32)',
        padding: '32px 36px',
        margin: '0 auto',
        marginBottom: 0,
        width: 900,
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        alignItems: 'flex-start',
        boxSizing: 'border-box',
      }}
    >
      {/* Baseball card top stripe */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 18, background: teamColor, opacity: 0.18, zIndex: 1 }} />
      {/* Always show the button row, even when revealed */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 28, minHeight: 80, marginBottom: 18, width: '100%', zIndex: 2 }}>
        {/* Use spot color for TeamSpot background */}
        <TeamSpotWithColor
          teamID={team.teamID}
          size={80}
          logoUrl={`https://img.mlbstatic.com/mlb-photos/image/upload/w_80,f_png,q_auto/v1/team/${team.teamID}/logo/spot/current`}
          fallbackColor={team.teamColors?.primaryLight || '#fff'}
        />
        <div style={{ textAlign: 'left', width: '100%' }}>
          <h1 style={{ fontWeight: 800, fontSize: 28, color: '#fff', marginBottom: 6, letterSpacing: 1, textAlign: 'left' }}>{team.clubFullName}</h1>
          <div style={{ fontSize: 15, color: '#fff', marginTop: 2, textAlign: 'left' }}>
            Team ID: {team.teamID} &nbsp;|&nbsp; Code: {team.teamCode}
            {teamExtras[team.teamID] && (
              <>
                &nbsp;|&nbsp; Venue ID: {teamExtras[team.teamID].regStatsVenueId} &nbsp;|&nbsp; Venue: {teamExtras[team.teamID].regVenue}
              </>
            )}
          </div>
          <button
            onClick={() => setRevealed(r => !r)}
            style={{
              margin: '1rem 0 0 0',
              padding: '10px 20px',
              borderRadius: 6,
              border: 'none',
              background: revealed ? '#e74c3c' : '#4fd1c5',
              color: '#fff',
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
              alignSelf: 'flex-start',
              width: 'auto',
              maxWidth: '100%',
              textAlign: 'left',
              boxSizing: 'border-box',
              boxShadow: '0 2px 8px #0002',
            }}
          >
            {revealed ? 'Hide Team' : 'Reveal Team'}
          </button>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <img
            src={`https://img.mlbstatic.com/mlb-photos/image/upload/w_1280,f_png,q_auto/v1/team/${team.teamID}/action/hero/current`}
            alt={`${team.clubFullName} Hero`}
            style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 10, marginLeft: 24, background: '#222', cursor: 'pointer', boxShadow: '0 2px 12px #0002' }}
            onClick={() => setLogoModal({ open: true, src: `https://img.mlbstatic.com/mlb-photos/image/upload/w_1280,f_png,q_auto/v1/team/${team.teamID}/action/hero/current`, alt: `${team.clubFullName} Hero` })}
          />
        </div>
        {logoModal.open && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
          }} onClick={() => setLogoModal({ open: false, src: '', alt: '' })}>
            <img src={logoModal.src} alt={logoModal.alt} style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: 12, boxShadow: '0 8px 32px #000a', marginBottom: 16 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(logoModal.src); }} style={{ padding: '6px 10px', borderRadius: 6, border: 'none', background: '#4fd1c5', color: '#222', fontWeight: 600, cursor: 'pointer' }}>Copy link</button>
              <a href={logoModal.src} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', background: '#222', padding: '6px 14px', borderRadius: 6, fontSize: 15, textDecoration: 'underline' }}>{logoModal.src}</a>
            </div>
          </div>
        )}
      </div>
      {revealed && (
        <div style={{ marginTop: 18, width: '100%' }}>
          {/* Roster Section */}
          <h2 style={{ fontWeight: 800, fontSize: 24, margin: '1.5rem 0 0.5rem 0', color: '#4fd1c5', letterSpacing: 1, textAlign: 'left' }}>Team Roster</h2>
          {/* Player dropdown and card (only for regular teams, now below team name) */}
          {showPlayer && (
            <div style={{ margin: '0 0 2rem 0', width: '100%', textAlign: 'left' }}>
              <RosterDropdown
                teamID={team.teamID}
                value={selectedPlayerId}
                onChange={e => setSelectedPlayers(sp => ({ ...sp, [team.teamID]: e.target.value }))}
                autoSelectFirst={false}
              />
            </div>
          )}
          <SelectedPlayerCard teamID={team.teamID} playerID={selectedPlayerId} teamColor={teamColor} />
          {/* BIGPAPI Section */}
          <h2 style={{ fontWeight: 800, fontSize: 24, margin: '2.5rem 0 0.5rem 0', color: '#fff', letterSpacing: 1, textAlign: 'left' }}>BIGPAPI</h2>
          {/* Logos subtitle above BIGPAPI logos */}
          <h4 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 1.5rem 0', letterSpacing: 1, textAlign: 'left' }}>Logos</h4>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 40, flexWrap: 'wrap', marginBottom: 40 }}>
            {/* Team Logo Spot (replaces Team Logo Default) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 120 }}>
              <WordmarkOverlay
                src={`https://img.mlbstatic.com/mlb-photos/image/upload/w_512,f_png,q_auto/v1/team/${team.teamID}/logo/spot/current`}
                alt="Team Logo Spot"
                url={`https://img.mlbstatic.com/mlb-photos/image/upload/w_512,f_png,q_auto/v1/team/${team.teamID}/logo/spot/current`}
                title={null}
                enableModal={true}
                bgColor={bigpapiSpotColor}
              />
              <div style={{ textAlign: 'left', fontSize: 13, color: '#888', marginTop: 10, width: 100, whiteSpace: 'normal', overflow: 'visible', textOverflow: 'unset', boxSizing: 'border-box', paddingLeft: 10 }} title="Team Logo Spot">Team Logo Spot</div>
            </div>
            {/* Team Cap Logo - Light */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 120 }}>
              <WordmarkOverlay
                src={`https://img.mlbstatic.com/mlb-photos/image/upload/w_512,f_png,q_auto/v1/team/${team.teamID}/logo/cap/light/current`}
                alt="Team Cap Logo - Light"
                url={`https://img.mlbstatic.com/mlb-photos/image/upload/w_512,f_png,q_auto/v1/team/${team.teamID}/logo/cap/light/current`}
                title={null}
                enableModal={true}
                bgColor={'#888888'}
              />
              <div style={{ textAlign: 'left', fontSize: 13, color: '#888', marginTop: 10, width: 100, whiteSpace: 'normal', overflow: 'visible', textOverflow: 'unset', boxSizing: 'border-box', paddingLeft: 10 }} title="Team Cap Logo - Light">Team Cap Logo - Light</div>
            </div>
            {/* Team Cap Logo - Dark */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 120 }}>
              <WordmarkOverlay
                src={`https://img.mlbstatic.com/mlb-photos/image/upload/w_512,f_png,q_auto/v1/team/${team.teamID}/logo/cap/dark/current`}
                alt="Team Cap Logo - Dark"
                url={`https://img.mlbstatic.com/mlb-photos/image/upload/w_512,f_png,q_auto/v1/team/${team.teamID}/logo/cap/dark/current`}
                title={null}
                enableModal={true}
                bgColor={bigpapiSpotColor}
              />
              <div style={{ textAlign: 'left', fontSize: 13, color: '#888', marginTop: 10, width: 100, whiteSpace: 'normal', overflow: 'visible', textOverflow: 'unset', boxSizing: 'border-box', paddingLeft: 10 }} title="Team Cap Logo - Dark">Team Cap Logo - Dark</div>
            </div>
          </div>
          {/* BIGPAPI Color Swatch Section */}
          <h4 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 1.5rem 0', letterSpacing: 1, textAlign: 'left' }}>Color Swatch</h4>
          <div className="branding-colors" style={{ marginBottom: '1.5rem', gap: 16, display: 'flex', flexWrap: 'wrap' }}>
            <BigpapiColorSwatch teamID={team.teamID} />
          </div>
          {/* MLB APP Branding Section */}
          <h2 style={{ fontWeight: 800, fontSize: 24, margin: '2.5rem 0 0.5rem 0', color: '#fff', letterSpacing: 1, textAlign: 'left' }}>MLB APP Branding</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginBottom: 40 }}>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 1.5rem 0', letterSpacing: 1, textAlign: 'left' }}>Logos & Marks</h4>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 40, flexWrap: 'wrap', marginBottom: 40 }}>
              {/* Primary PNG */}
              {team.capLogos?.rasterDarkActive && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 120 }}>
                  <WordmarkOverlay
                    src={team.capLogos.rasterDarkActive.replace('{type}', 'png').replace('{width}', '100')}
                    alt="Primary PNG"
                    url={team.capLogos.rasterDarkActive.replace('{type}', 'png').replace('{width}', '100')}
                    title={null}
                    enableModal={true}
                    bgColor={team.teamColors?.primaryLight || '#fff'}
                  />
                  <div style={{ textAlign: 'left', fontSize: 13, color: '#888', marginTop: 10, width: 100, whiteSpace: 'normal', overflow: 'visible', textOverflow: 'unset', boxSizing: 'border-box', paddingLeft: 10 }} title="Primary PNG">Primary PNG</div>
                </div>
              )}
              {/* Alternate PNG */}
              {team.capLogos?.rasterLightActive && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 120 }}>
                  <WordmarkOverlay
                    src={team.capLogos.rasterLightActive.replace('{type}', 'png').replace('{width}', '100')}
                    alt="Alternate PNG"
                    url={team.capLogos.rasterLightActive.replace('{type}', 'png').replace('{width}', '100')}
                    title={null}
                    enableModal={true}
                    bgColor={'#888888'}
                  />
                  <div style={{ textAlign: 'left', fontSize: 13, color: '#888', marginTop: 10, width: 100, whiteSpace: 'normal', overflow: 'visible', textOverflow: 'unset', boxSizing: 'border-box', paddingLeft: 10 }} title="Alternate PNG">Alternate PNG</div>
                </div>
              )}
              {/* Primary SVG */}
              {team.capLogos?.svgDarkActive && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 120 }}>
                  <WordmarkOverlay
                    src={team.capLogos.svgDarkActive.replace('{type}', 'png').replace('{width}', '100')}
                    alt="Primary SVG"
                    url={team.capLogos.svgDarkActive.replace('{type}', 'png').replace('{width}', '100')}
                    title={null}
                    enableModal={true}
                    bgColor={team.teamColors?.primaryLight || '#fff'}
                  />
                  <div style={{ textAlign: 'left', fontSize: 13, color: '#888', marginTop: 10, width: 120, whiteSpace: 'normal', overflow: 'visible', textOverflow: 'unset', boxSizing: 'border-box', paddingLeft: 10 }} title="Primary SVG">Primary SVG</div>
                </div>
              )}
              {/* App Icon SVG */}
              {team.capLogos?.svgLightActive && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 120 }}>
                  <WordmarkOverlay
                    src={team.capLogos.svgLightActive.replace('{type}', 'png').replace('{width}', '100')}
                    alt="App Icon SVG"
                    url={team.capLogos.svgLightActive.replace('{type}', 'png').replace('{width}', '100')}
                    title={null}
                    enableModal={true}
                    bgColor={'#888888'}
                  />
                  <div style={{ textAlign: 'left', fontSize: 13, color: '#888', marginTop: 10, width: 100, whiteSpace: 'normal', overflow: 'visible', textOverflow: 'unset', boxSizing: 'border-box', paddingLeft: 10 }} title="App Icon SVG">App Icon SVG</div>
                </div>
              )}
            </div>
            {/* Wordmarks on their own row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 40, flexWrap: 'wrap', marginBottom: 40, marginTop: 0 }}>
              {/* Wordmark Light PNG */}
              {team.wordmarks?.rasterLight && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 120 }}>
                  <WordmarkOverlay
                    src={team.wordmarks.rasterLight.replace('{type}', 'png').replace('{width}', '120')}
                    alt="Wordmark Light PNG"
                    url={team.wordmarks.rasterLight.replace('{type}', 'png').replace('{width}', '120')}
                    title={null}
                    enableModal={true}
                    bgColor={'#888888'}
                  />
                  <div style={{ textAlign: 'left', fontSize: 13, color: '#888', marginTop: 10, width: 120, whiteSpace: 'normal', overflow: 'visible', textOverflow: 'unset', boxSizing: 'border-box', paddingLeft: 10 }} title="Wordmark Light PNG">Wordmark Light PNG</div>
                </div>
              )}
              {/* Wordmark Dark PNG */}
              {team.wordmarks?.rasterDark && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 120 }}>
                  <WordmarkOverlay
                    src={team.wordmarks.rasterDark.replace('{type}', 'png').replace('{width}', '120')}
                    alt="Wordmark Dark PNG"
                    url={team.wordmarks.rasterDark.replace('{type}', 'png').replace('{width}', '120')}
                    title={null}
                    enableModal={true}
                    bgColor={'#888888'}
                  />
                  <div style={{ textAlign: 'left', fontSize: 13, color: '#888', marginTop: 10, width: 120, whiteSpace: 'normal', overflow: 'visible', textOverflow: 'unset', boxSizing: 'border-box', paddingLeft: 10 }} title="Wordmark Dark PNG">Wordmark Dark PNG</div>
                </div>
              )}
            </div>
            {/* Color Swatch subtitle above color swatches */}
            {team.teamColors && (
              <>
                <h4 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 1rem 0', letterSpacing: 1, textAlign: 'left' }}>Color Swatch</h4>
                <div className="branding-colors" style={{ margin: '0 0 1.5rem 0', gap: 16, display: 'flex', flexWrap: 'wrap' }}>
                  {['primaryLight', 'primaryDark', 'secondary', 'tertiary', 'quaternary']
                    .filter(key => team.teamColors[key])
                    .map(key => (
                      <ColorSwatch key={key} color={{ name: key, value: team.teamColors[key] }} />
                    ))}
                  {Object.entries(team.teamColors)
                    .filter(([name]) => !['primaryLight', 'primaryDark', 'secondary', 'tertiary', 'quaternary'].includes(name))
                    .map(([name, value]) => (
                      <ColorSwatch key={name} color={{ name, value }} />
                    ))}
                </div>
              </>
            )}
            {/* MLB.TV Assets directly below color swatches */}
            {team.mlbtv && Object.keys(team.mlbtv).length > 0 && (
              <div style={{ margin: '2.5rem 0 0 0', width: '100%' }}>
                <h4 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 1rem 0', letterSpacing: 1, textAlign: 'left' }}>MLB.TV Assets</h4>
                <MLBTVGallery mlbtv={team.mlbtv} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ColorSwatch({ color }) {
  const [copied, setCopied] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0 });
  
  const handleMouseEnter = (e) => {
    playHoverSound();
    setTooltip({ visible: true, x: e.clientX, y: e.clientY });
  };
  
  const handleMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0 });
  };
  
  return (
    <Tooltip 
      text={`Click to copy ${color.name}: ${color.value}`} 
      visible={tooltip.visible} 
      position={{ x: tooltip.x, y: tooltip.y }}
    >
      <div className="branding-color" style={{ position: 'relative' }}>
        <div
          className="branding-color-swatch"
          style={{ background: color.value, cursor: 'pointer' }}
          title="Click to copy hex"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => {
            playClickSound();
            navigator.clipboard.writeText(color.value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          }}
        ></div>
        {copied && (
          <div style={{
            position: 'absolute',
            top: -30,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#222',
            color: '#fff',
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 500,
            zIndex: 10,
            boxShadow: '0 2px 8px #0005',
            pointerEvents: 'none',
          }}>
            Copied to clipboard!
          </div>
        )}
        <div className="branding-color-label">
          <span>{color.name}<br />{color.value}</span>
        </div>
      </div>
    </Tooltip>
  );
}

// ColorSwatch for BIGPAPI section that extracts color from image using browser canvas
function BigpapiColorSwatch({ teamID }) {
  const [hex, setHex] = useState('#888888');
  const [copied, setCopied] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0 });
  const imgUrl = `https://img.mlbstatic.com/mlb-photos/image/upload/w_200,f_png,q_auto/v1/team/${teamID}/fill/spot`;
  
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = imgUrl;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const data = ctx.getImageData(0, 0, img.width, img.height).data;
        // Simple average color extraction
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          // Ignore transparent pixels
          if (data[i + 3] > 200) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
          }
        }
        if (count > 0) {
          r = Math.round(r / count);
          g = Math.round(g / count);
          b = Math.round(b / count);
          const hexColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
          setHex(hexColor);
        } else {
          setHex('#888888');
        }
      } catch (e) {
        setHex('#888888');
      }
    };
  }, [imgUrl, teamID]);

  function handleCopy() {
    playClickSound();
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }
  
  const handleMouseEnter = (e) => {
    playHoverSound();
    setTooltip({ visible: true, x: e.clientX, y: e.clientY });
  };
  
  const handleMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0 });
  };

  return (
    <Tooltip 
      text={`Click to copy spot color: ${hex}`} 
      visible={tooltip.visible} 
      position={{ x: tooltip.x, y: tooltip.y }}
    >
      <div className="branding-color" style={{ position: 'relative' }}>
        <div
          className="branding-color-swatch"
          style={{ background: hex, cursor: 'pointer' }}
          title="Click to copy hex"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleCopy}
        >
          {copied && (
            <div style={{
              position: 'absolute',
              top: -30,
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#222',
              color: '#fff',
              padding: '4px 10px',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
              zIndex: 10,
              boxShadow: '0 2px 8px #0005',
              pointerEvents: 'none',
            }}>
              Copied to clipboard!
            </div>
          )}
        </div>
        <div className="branding-color-label">
          <span>Spot<br />{hex}</span>
        </div>
      </div>
    </Tooltip>
  );
}

// Utility for copy-to-clipboard with tooltip
function CopyButton({ url, style }) {
  const [copied, setCopied] = useState(false);
  return (
    <span style={{ position: 'relative', ...style }}>
      <button
        onClick={e => {
          e.stopPropagation();
          navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }}
        style={{ padding: '2px 8px', fontSize: 12, borderRadius: 4, border: 'none', background: '#4fd1c5', color: '#222', fontWeight: 600, cursor: 'pointer' }}
      >
        Copy URL
      </button>
      {copied && (
        <span style={{
          position: 'absolute', left: '100%', top: '50%', transform: 'translateY(-50%)',
          background: '#222', color: '#fff', padding: '2px 10px', borderRadius: 4, fontSize: 13, marginLeft: 8, zIndex: 10
        }}>
          Copied!
        </span>
      )}
    </span>
  );
}

function WordmarkOverlay({ src, alt, url, title, enableModal, bgColor }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0 });
  
  function handleCopy() {
    navigator.clipboard.writeText(url || src);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }
  
  const handleMouseEnter = (e) => {
    playHoverSound();
    e.target.style.transform = 'scale(1.1)';
    setTooltip({ visible: true, x: e.clientX, y: e.clientY });
  };
  
  const handleMouseLeave = (e) => {
    e.target.style.transform = 'scale(1)';
    setTooltip({ visible: false, x: 0, y: 0 });
  };
  
  return (
    <>
      <Tooltip 
        text={enableModal ? `Click to view ${alt}` : alt} 
        visible={tooltip.visible} 
        position={{ x: tooltip.x, y: tooltip.y }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            height: 120,
          }}
        >
          <img
            src={src}
            alt={alt}
            style={{
              width: 120,
              height: 120,
              objectFit: 'contain',
              cursor: enableModal ? 'pointer' : 'default',
              borderRadius: 6,
              padding: 10,
              background: bgColor || '#fff',
              display: 'block',
              margin: 'auto',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={enableModal ? () => { playClickSound(); setOpen(true); } : undefined}
          />
          {title && (
            <div style={{ textAlign: 'left', fontSize: 13, color: '#888', marginTop: 10, width: 120, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', boxSizing: 'border-box' }}>{title}</div>
          )}
        </div>
      </Tooltip>
      {enableModal && open && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
          }}
          onClick={() => setOpen(false)}
        >
          <img src={src} alt={alt} style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: 12, boxShadow: '0 8px 32px #000a', marginBottom: 16, background: bgColor || '#fff' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={e => { e.stopPropagation(); handleCopy(); }} style={{ padding: '6px 10px', borderRadius: 6, border: 'none', background: '#4fd1c5', color: '#222', fontWeight: 600, cursor: 'pointer' }}>{copied ? 'Copied!' : 'Copy link'}</button>
            <a href={src} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', background: '#222', padding: '6px 14px', borderRadius: 6, fontSize: 15, textDecoration: 'underline' }}>{src}</a>
          </div>
        </div>
      )}
    </>
  );
}

// Enhanced Anchor Menu component with animations, sounds, and tooltips
function AnchorMenu({ teams }) {
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, text: '' });

  const handleTeamHover = (e, teamName) => {
    playHoverSound();
    e.target.style.transform = 'scale(1.2)';
    setTooltip({ 
      visible: true, 
      x: e.clientX, 
      y: e.clientY, 
      text: `Jump to ${teamName}` 
    });
  };

  const handleTeamLeave = (e) => {
    e.target.style.transform = 'scale(1)';
    setTooltip({ visible: false, x: 0, y: 0, text: '' });
  };

  const handleTeamClick = (e) => {
    playClickSound();
    // Add a brief "jump" animation
    e.target.style.transform = 'scale(0.9)';
    setTimeout(() => {
      e.target.style.transform = 'scale(1)';
    }, 100);
  };

  const handleAllStarHover = (e, leagueName) => {
    playHoverSound();
    e.target.style.transform = 'scale(1.2)';
    e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
    setTooltip({ 
      visible: true, 
      x: e.clientX, 
      y: e.clientY, 
      text: `Jump to ${leagueName} All-Stars` 
    });
  };

  const handleAllStarLeave = (e) => {
    e.target.style.transform = 'scale(1)';
    e.target.style.boxShadow = '0 2px 8px #0003';
    setTooltip({ visible: false, x: 0, y: 0, text: '' });
  };

  const handleAllStarClick = (e) => {
    playClickSound();
    e.target.style.transform = 'scale(0.9)';
    setTimeout(() => {
      e.target.style.transform = 'scale(1)';
    }, 100);
  };

  return (
    <>
      <Tooltip 
        text={tooltip.text} 
        visible={tooltip.visible} 
        position={{ x: tooltip.x, y: tooltip.y }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 40, alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: 900, marginLeft: 'auto', marginRight: 'auto' }}>
          {teams.map(team => (
            <a
              key={team.teamID}
              href={`#team-card-${team.teamID}`}
              style={{ textDecoration: 'none', border: 'none', background: 'none', cursor: 'pointer', padding: 0, display: 'inline-block' }}
              onClick={handleTeamClick}
            >
              <div
                style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
                onMouseEnter={e => handleTeamHover(e, team.clubFullName)}
                onMouseLeave={handleTeamLeave}
              >
                <TeamSpotWithColor
                  teamID={team.teamID}
                  size={40}
                  logoUrl={`https://img.mlbstatic.com/mlb-photos/image/upload/w_40,f_png,q_auto/v1/team/${team.teamID}/logo/spot/current`}
                  fallbackColor={team.teamColors?.primaryLight || '#fff'}
                />
              </div>
            </a>
          ))}
          {/* AL All-Star anchor button */}
          <a
            href="#al-allstars"
            style={{ textDecoration: 'none', border: 'none', background: 'none', cursor: 'pointer', padding: 0, display: 'inline-block' }}
            onClick={handleAllStarClick}
          >
            <div 
              style={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%', 
                background: '#003263', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                boxShadow: '0 2px 8px #0003', 
                fontWeight: 700, 
                color: '#fff', 
                fontSize: 18,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={e => handleAllStarHover(e, 'American League')}
              onMouseLeave={handleAllStarLeave}
            >
              AL
            </div>
          </a>
          {/* NL All-Star anchor button */}
          <a
            href="#nl-allstars"
            style={{ textDecoration: 'none', border: 'none', background: 'none', cursor: 'pointer', padding: 0, display: 'inline-block' }}
            onClick={handleAllStarClick}
          >
            <div 
              style={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%', 
                background: '#c41e3a', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                boxShadow: '0 2px 8px #0003', 
                fontWeight: 700, 
                color: '#fff', 
                fontSize: 18,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={e => handleAllStarHover(e, 'National League')}
              onMouseLeave={handleAllStarLeave}
            >
              NL
            </div>
          </a>
        </div>
      </Tooltip>
    </>
  );
}

// Tooltip component for enhanced hover interactions
function Tooltip({ children, text, visible, position = { x: 0, y: 0 } }) {
  if (!visible || !text) return children;
  
  return (
    <>
      {children}
      <div
        style={{
          position: 'fixed',
          left: position.x + 10,
          top: position.y - 30,
          background: '#222',
          color: '#fff',
          padding: '6px 12px',
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 500,
          zIndex: 10000,
          pointerEvents: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          whiteSpace: 'nowrap',
          maxWidth: '200px',
          wordWrap: 'break-word',
        }}
      >
        {text}
      </div>
    </>
  );
}
