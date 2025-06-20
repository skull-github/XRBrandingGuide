import { useState, useEffect } from 'react'
import './App.css'
import { getTeamIdByName } from './teamIdUtils';
import teamExtras from './appv2/team-extras.json';

function App() {
  // Use the team-extras.json as the only data source
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const teamIds = Object.keys(teamExtras);

  useEffect(() => {
    setSelectedPlayers(Array(teamIds.length).fill(''));
  }, [teamIds.length]);

  // SpotColorWithHex: displays the spot color image and its hex value
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
        // Sample center pixel
        const x = Math.floor(img.width / 2);
        const y = Math.floor(img.height / 2);
        const data = ctx.getImageData(x, y, 1, 1).data;
        const hexColor = `#${((1 << 24) + (data[0] << 16) + (data[1] << 8) + data[2]).toString(16).slice(1)}`;
        setHex(hexColor);
      };
      img.onerror = function () {
        setHex('');
      };
    }, [teamID, url]);

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <img
          src={url}
          alt={`Spot color for team ${teamID}`}
          style={{ maxWidth: 80, maxHeight: 80, objectFit: 'contain', background: '#fff' }}
        />
        {hex && <span style={{ fontFamily: 'monospace' }}>{hex}</span>}
      </div>
    );
  }

  // RosterDropdown: fetches and displays the roster for a teamID in a dropdown
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
          <select style={{ minWidth: 180 }} value={value} onChange={onChange}>
            <option value="">Select Player</option>
            {roster.map(player => (
              <option key={player.person.id} value={player.person.id}>
                {player.person.fullName}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  }

  // PlayerImageGallery: displays a gallery of player images with modal viewer
  function PlayerImageGallery({ playerID }) {
    const [modal, setModal] = useState({ open: false, src: '', alt: '' });
    if (!playerID) return null;
    const headshotUrl = `https://img.mlbstatic.com/mlb-photos/image/upload/w_400,q_auto/v1/people/${playerID}/headshot/silo/current`;
    const heroUrl = `https://img.mlbstatic.com/mlb-photos/image/upload/w_1200,f_png,q_auto/v1/people/${playerID}/action/hero/current`;
    const verticalUrl = `https://img.mlbstatic.com/mlb-photos/image/upload/w_720,f_png,q_auto/v1/people/${playerID}/action/vertical/current`;
    const pressboxUrl = `https://img.mlbstatic.com/mlb-photos/image/upload/w_720,f_png,q_auto/v1/people/${playerID}/pressbox/current`;
    return (
      <>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <img
            src={headshotUrl}
            alt={`Headshot for player ${playerID}`}
            style={{ maxWidth: 60, maxHeight: 60, objectFit: 'contain', background: '#fff', cursor: 'pointer', borderRadius: 6 }}
            onClick={() => setModal({ open: true, src: headshotUrl, alt: `Headshot for player ${playerID}` })}
          />
          <img
            src={heroUrl}
            alt={`Hero action for player ${playerID}`}
            style={{ maxWidth: 100, maxHeight: 60, objectFit: 'contain', background: '#fff', borderRadius: 6, cursor: 'pointer' }}
            onClick={() => setModal({ open: true, src: heroUrl, alt: `Hero action for player ${playerID}` })}
          />
          <img
            src={verticalUrl}
            alt={`Vertical action for player ${playerID}`}
            style={{ maxWidth: 40, maxHeight: 60, objectFit: 'contain', background: '#fff', borderRadius: 6, cursor: 'pointer' }}
            onClick={() => setModal({ open: true, src: verticalUrl, alt: `Vertical action for player ${playerID}` })}
          />
          <img
            src={pressboxUrl}
            alt={`Pressbox for player ${playerID}`}
            style={{ maxWidth: 40, maxHeight: 60, objectFit: 'contain', background: '#fff', borderRadius: 6, cursor: 'pointer' }}
            onClick={() => setModal({ open: true, src: pressboxUrl, alt: `Pressbox for player ${playerID}` })}
          />
        </div>
        {modal.open && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }} onClick={() => setModal({ open: false, src: '', alt: '' })}>
            <img src={modal.src} alt={modal.alt} style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 12, boxShadow: '0 8px 32px #000a' }} />
          </div>
        )}
      </>
    );
  }

  // Utility for copy-to-clipboard with tooltip
  function CopyButton({ url }) {
    const [copied, setCopied] = useState(false);
    return (
      <span style={{ position: 'relative' }}>
        <button
          style={{ marginLeft: 0 }}
          onClick={() => {
            navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          }}
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

  function AssetOverlay({ src, alt, url, width = 120, padding = 0, center = false, title }) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: center ? 'center' : 'flex-start',
            justifyContent: center ? 'center' : undefined,
            height: center ? width + 2 * padding : undefined,
          }}
        >
          <img
            src={src}
            alt={alt}
            style={{
              maxWidth: width,
              maxHeight: 80,
              objectFit: 'contain',
              cursor: 'pointer',
              borderRadius: 6,
              boxShadow: open ? '0 0 0 2px #4fd1c5' : undefined,
              padding: padding,
              display: 'block',
              margin: center ? 'auto' : undefined,
              background: '#fff',
            }}
            onClick={() => setOpen(true)}
          />
          {title && (
            <div style={{ textAlign: 'left', fontSize: 13, color: '#888', marginTop: 4, width: width, wordBreak: 'break-all' }}>{title}</div>
          )}
        </div>
        {open && (
          <div
            style={{
              position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
              background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}
            onClick={() => setOpen(false)}
          >
            <img src={src} alt={alt} style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: 12, boxShadow: '0 8px 32px #000a', marginBottom: 16 }} />
            <div style={{ color: '#fff', fontSize: 16, marginBottom: 8, wordBreak: 'break-all', textAlign: 'center' }}>{url}</div>
            <CopyButton url={url} />
          </div>
        )}
      </>
    );
  }

  return (
    <div className="container">
      <h1>BIGPAPI Team Index</h1>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Team</th>
            <th>Team ID</th>
            <th>Reg Stats Venue ID</th>
            <th>Team Logo Default ™</th>
            <th>Logo Spot</th>
            <th>Spot Color</th>
            <th>Team Wordmark Logo - Light</th>
            <th>Team Wordmark Logo - Dark</th>
          </tr>
        </thead>
        <tbody>
          {teamIds.map((teamId) => {
            const team = teamExtras[teamId];
            return (
              <tr key={teamId}>
                <td>{team.teamUrl.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
                <td>{teamId}</td>
                <td>{team.regStatsVenueId}</td>
                <td>
                  <AssetOverlay
                    src={`https://img.mlbstatic.com/mlb-photos/image/upload/w_200,f_png,q_auto/v1/team/${teamId}/logo/cap/current`}
                    alt={`Default cap logo for team ${teamId}`}
                    url={`https://img.mlbstatic.com/mlb-photos/image/upload/w_200,f_png,q_auto/v1/team/${teamId}/logo/cap/current`}
                    title="Cap Logo"
                  />
                </td>
                <td>
                  <AssetOverlay
                    src={`https://img.mlbstatic.com/mlb-photos/image/upload/w_200,f_png,q_auto/v1/team/${teamId}/logo/spot/current`}
                    alt={`Logo for team ${teamId}`}
                    url={`https://img.mlbstatic.com/mlb-photos/image/upload/w_200,f_png,q_auto/v1/team/${teamId}/logo/spot/current`}
                    title="Spot Logo"
                  />
                </td>
                <td>
                  <SpotColorWithHex teamID={teamId} />
                </td>
                <td>
                  <AssetOverlay
                    src={`https://img.mlbstatic.com/mlb-photos/image/upload/w_200,f_png,q_auto/v1/team/${teamId}/logo/wordmark/light/current`}
                    alt={`Wordmark logo (light) for team ${teamId}`}
                    url={`https://img.mlbstatic.com/mlb-photos/image/upload/w_200,f_png,q_auto/v1/team/${teamId}/logo/wordmark/light/current`}
                    width={200}
                    padding={10}
                    center={true}
                    title="Wordmark Light"
                  />
                </td>
                <td>
                  <AssetOverlay
                    src={`https://img.mlbstatic.com/mlb-photos/image/upload/w_200,f_png,q_auto/v1/team/${teamId}/logo/wordmark/dark/current`}
                    alt={`Wordmark logo (dark) for team ${teamId}`}
                    url={`https://img.mlbstatic.com/mlb-photos/image/upload/w_200,f_png,q_auto/v1/team/${teamId}/logo/wordmark/dark/current`}
                    width={200}
                    padding={10}
                    center={true}
                    title="Wordmark Dark"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App
