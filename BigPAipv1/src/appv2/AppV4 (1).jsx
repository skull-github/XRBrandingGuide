import { useState, useEffect } from 'react';
import '../App.css';
import teamExtras from './team-extras.json';

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const sortedRoster = roster.slice().sort((a, b) => {
    if (!a.person || !b.person) return 0;
    return a.person.fullName.localeCompare(b.person.fullName);
  });

  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc', width: '100%' }}
    >
      {autoSelectFirst && sortedRoster.length > 0 && (
        <option value={sortedRoster[0].person.id}>{sortedRoster[0].person.fullName}</option>
      )}
      {sortedRoster.map(player => (
        <option key={player.person.id} value={player.person.id}>
          {player.person.fullName}
        </option>
      ))}
    </select>
  );
}

function PlayerImageGallery({ playerID }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchImages() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://img.mlbstatic.com/mlb-photos/image/upload/${playerID}`);
        if (!res.ok) throw new Error('Failed to fetch player images');
        const data = await res.json();
        setImages(data.images || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, [playerID]);

  if (loading) return <p>Loading images...</p>;
  if (error) {
    console.error('Image fetch error:', error);
    return <p>Error loading images</p>;
  }

  return (
    <div className="image-gallery">
      {images.map((image, index) => (
        <img key={index} src={image.url} alt={`Player ${playerID}`} />
      ))}
    </div>
  );
}

function PlayerImageSilo({ playerID, bgColor }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchImage() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://img.mlbstatic.com/mlb-photos/image/upload/${playerID}`);
        if (!res.ok) throw new Error('Failed to fetch player image');
        const data = await res.json();
        setImage(data.images?.[0]?.url || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchImage();
  }, [playerID]);

  if (loading) return <div style={{ height: 200, width: 200, backgroundColor: '#f0f0f0' }} />;
  if (error) {
    console.error('Image fetch error:', error);
    return <div style={{ height: 200, width: 200, backgroundColor: '#f0f0f0' }} />;
  }

  return (
    <div
      style={{
        height: 200,
        width: 200,
        backgroundColor: bgColor || '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {image ? (
        <img
          src={image}
          alt={`Player ${playerID}`}
          style={{ height: '100%', width: '100%', objectFit: 'cover', borderRadius: 8 }}
        />
      ) : (
        <span style={{ color: '#999', fontSize: 14 }}>No image available</span>
      )}
    </div>
  );
}

function PlayerCard({ player, teamColor }) {
  return (
    <div
      style={{
        backgroundColor: teamColor?.primaryLight || '#fff',
        borderRadius: 8,
        padding: '1rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s',
        position: 'relative',
      }}
      className="player-card"
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
        <PlayerImageSilo playerID={player.playerID} bgColor={teamColor?.primaryLight} />
        <div style={{ marginLeft: '0.5rem', flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 16, color: teamColor?.primaryDark }}>{player.fullName}</div>
          <div style={{ fontSize: 14, color: teamColor?.secondary }}>{player.position || 'N/A'}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <a
          href={`https://www.mlb.com/player/${player.playerID}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1,
            padding: '0.5rem',
            borderRadius: 4,
            backgroundColor: teamColor?.secondary,
            color: '#fff',
            textAlign: 'center',
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'background-color 0.2s',
          }}
        >
          View Profile
        </a>
        <a
          href={`https://www.mlb.com/team/${player.teamID}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1,
            padding: '0.5rem',
            borderRadius: 4,
            backgroundColor: teamColor?.tertiary,
            color: '#fff',
            textAlign: 'center',
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'background-color 0.2s',
          }}
        >
          Team Page
        </a>
      </div>
    </div>
  );
}

function SelectedPlayerCard({ teamID, playerID, teamColor }) {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPlayer() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://statsapi.mlb.com/api/v1/people/${playerID}`);
        if (!res.ok) throw new Error('Failed to fetch player data');
        const data = await res.json();
        setPlayer(data.people?.[0] || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (playerID) fetchPlayer();
  }, [playerID]);

  if (loading) return <div style={{ height: 200, width: 200, backgroundColor: '#f0f0f0' }} />;
  if (error || !player) {
    console.error('Player fetch error:', error);
    return <div style={{ height: 200, width: 200, backgroundColor: '#f0f0f0' }} />;
  }

  return (
    <div
      style={{
        backgroundColor: teamColor?.primaryLight || '#fff',
        borderRadius: 8,
        padding: '1rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        position: 'relative',
      }}
      className="selected-player-card"
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
        <PlayerImageSilo playerID={player.playerID} bgColor={teamColor?.primaryLight} />
        <div style={{ marginLeft: '0.5rem', flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 16, color: teamColor?.primaryDark }}>{player.fullName}</div>
          <div style={{ fontSize: 14, color: teamColor?.secondary }}>{player.position || 'N/A'}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <a
          href={`https://www.mlb.com/player/${player.playerID}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1,
            padding: '0.5rem',
            borderRadius: 4,
            backgroundColor: teamColor?.secondary,
            color: '#fff',
            textAlign: 'center',
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'background-color 0.2s',
          }}
        >
          View Profile
        </a>
        <a
          href={`https://www.mlb.com/team/${teamID}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1,
            padding: '0.5rem',
            borderRadius: 4,
            backgroundColor: teamColor?.tertiary,
            color: '#fff',
            textAlign: 'center',
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'background-color 0.2s',
          }}
        >
          Team Page
        </a>
      </div>
    </div>
  );
}

function MLBTVGallery({ mlbtv }) {
  if (!mlbtv || mlbtv.length === 0) return null;

  return (
    <div className="mlbtv-gallery" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {mlbtv.map((item, index) => (
        <div
          key={index}
          style={{
            padding: '1rem',
            borderRadius: 8,
            backgroundColor: '#18181b',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            position: 'relative',
          }}
        >
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#4fd1c5',
              textDecoration: 'none',
              fontWeight: 500,
              display: 'block',
              marginBottom: '0.5rem',
            }}
          >
            {item.title}
          </a>
          <span style={{ fontSize: 14, color: '#ccc' }}>{item.description}</span>
        </div>
      ))}
    </div>
  );
}

function TeamCard({ team, opts = {}, selectedPlayerId, setSelectedPlayers, colorPriority }) {
  const teamColor = team.teamColors || {};
  const logoUrl = team.capLogos?.rasterDarkActive?.replace('{type}', 'png').replace('{width}', '42') || '';

  return (
    <div
      id={`team-card-${team.teamID}`}
      style={{
        backgroundColor: teamColor.primaryLight,
        borderRadius: 12,
        padding: '1.5rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        position: 'relative',
      }}
      className="team-card"
    >
      {/* Team Logo and Name */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <img
          src={logoUrl}
          alt={team.clubFullName}
          style={{ width: 42, height: 42, borderRadius: 6, marginRight: '0.5rem' }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: teamColor.primaryDark }}>{team.clubFullName}</div>
          <div style={{ fontSize: 14, color: teamColor.secondary }}>{team.league} - {team.division}</div>
        </div>
      </div>
      {/* Player Selector Dropdown */}
      {opts.showPlayer && (
        <div style={{ marginBottom: '1rem' }}>
          <RosterDropdown
            teamID={team.teamID}
            value={selectedPlayerId}
            onChange={playerId => setSelectedPlayers(prev => ({ ...prev, [team.teamID]: playerId }))}
            autoSelectFirst
          />
        </div>
      )}
      {/* Selected Player Card */}
      {opts.showPlayer && selectedPlayerId && (
        <div style={{ marginBottom: '1rem' }}>
          <SelectedPlayerCard teamID={team.teamID} playerID={selectedPlayerId} teamColor={teamColor} />
        </div>
      )}
      {/* MLB.TV Gallery */}
      {opts.showPlayer && team.mlbtv && team.mlbtv.length > 0 && (
        <MLBTVGallery mlbtv={team.mlbtv} />
      )}
      {/* Color Swatches */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        {colorPriority.map((colorKey, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: 4,
              backgroundColor: teamColor[colorKey],
              border: `2px solid ${teamColor[colorKey] ? '#fff' : 'transparent'}`,
              transition: 'transform 0.2s',
              position: 'relative',
            }}
            className="color-swatch"
          >
            {teamColor[colorKey] && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#fff',
                  textAlign: 'center',
                  pointerEvents: 'none',
                }}
              >
                {colorKey.replace('primary', 'P').replace('secondary', 'S').replace('tertiary', 'T').toUpperCase()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AppV4() {
  const [teams, setTeams] = useState([]);
  const [alAllStars, setAlAllStars] = useState([]);
  const [nlAllStars, setNlAllStars] = useState([]);
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
        const mergedTeams = data.teams
          .filter(team => String(team.teamID) !== '0')
          .map(team => {
            const extras = teamExtras[String(team.teamID)] || {};
            return { ...team, ...extras };
          });
        setTeams(mergedTeams);
        setAlAllStars(data.allstarTeams.filter(t => t.club === 'al').map(team => ({ ...team, ...(teamExtras[String(team.teamID)] || {}) })));
        setNlAllStars(data.allstarTeams.filter(t => t.club === 'nl').map(team => ({ ...team, ...(teamExtras[String(team.teamID)] || {}) })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBranding();
  }, []);

  if (loading) return <div className="App"><p>Loading branding data...</p></div>;
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

  return (
    <div className="App" style={{ padding: '2rem' }}>
      {/* Header with title only */}
      <div style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid #333', paddingBottom: 12, marginBottom: 32 }}>
        <h2 style={{ fontWeight: 800, fontSize: 28, letterSpacing: 1, margin: 0, color: '#fff' }}>MLB APP Branding Guide</h2>
      </div>
      {/* Team Icon Anchor Navigation */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, margin: '18px 0 32px 0', alignItems: 'center', justifyContent: 'center' }}>
        {teams.map(team => (
          team.capLogos?.rasterDarkActive && (
            <a
              key={team.teamID}
              href={`#team-card-${team.teamID}`}
              title={team.clubFullName}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                background: team.teamColors?.primaryLight || '#fff',
                boxShadow: '0 1px 4px #0002',
                padding: 2,
                transition: 'box-shadow 0.2s',
                border: '2px solid #222',
                width: 48,
                height: 48,
                lineHeight: 0
              }}
            >
              <img
                src={team.capLogos.rasterDarkActive.replace('{type}', 'png').replace('{width}', '42')}
                alt={team.clubFullName}
                style={{ maxWidth: 42, maxHeight: 42, objectFit: 'contain', borderRadius: 6, background: team.teamColors?.primaryLight || '#fff', display: 'block', margin: 'auto' }}
              />
            </a>
          )
        ))}
        {/* Add AL and NL All-Star icons at the end */}
        {alAllStars[0]?.capLogos?.rasterDarkActive && (
          <a
            key="al-allstars"
            href={`#team-card-${alAllStars[0].teamID}`}
            title="AL All-Stars"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              background: alAllStars[0].teamColors?.primaryLight || '#fff',
              boxShadow: '0 1px 4px #0002',
              padding: 2,
              transition: 'box-shadow 0.2s',
              border: '2px solid #222',
              width: 48,
              height: 48,
              lineHeight: 0
            }}
          >
            <img
              src={alAllStars[0].capLogos.rasterDarkActive.replace('{type}', 'png').replace('{width}', '42')}
              alt="AL All-Stars"
              style={{ maxWidth: 42, maxHeight: 42, objectFit: 'contain', borderRadius: 6, background: alAllStars[0].teamColors?.primaryLight || '#fff', display: 'block', margin: 'auto' }}
            />
          </a>
        )}
        {nlAllStars[0]?.capLogos?.rasterDarkActive && (
          <a
            key="nl-allstars"
            href={`#team-card-${nlAllStars[0].teamID}`}
            title="NL All-Stars"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              background: nlAllStars[0].teamColors?.primaryLight || '#fff',
              boxShadow: '0 1px 4px #0002',
              padding: 2,
              transition: 'box-shadow 0.2s',
              border: '2px solid #222',
              width: 48,
              height: 48,
              lineHeight: 0
            }}
          >
            <img
              src={nlAllStars[0].capLogos.rasterDarkActive.replace('{type}', 'png').replace('{width}', '42')}
              alt="NL All-Stars"
              style={{ maxWidth: 42, maxHeight: 42, objectFit: 'contain', borderRadius: 6, background: nlAllStars[0].teamColors?.primaryLight || '#fff', display: 'block', margin: 'auto' }}
            />
          </a>
        )}
      </div>
      {/* Each team in its own section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', marginBottom: '2.5rem' }}>
        {teams.map(team => (
          <section key={team.teamID || team.clubFullName} style={{ width: '100%' }}>
            <TeamCard
              team={team}
              opts={{ showPlayer: true }}
              selectedPlayerId={selectedPlayers[team.teamID] || ''}
              setSelectedPlayers={setSelectedPlayers}
              colorPriority={capLogoVariants.map(v => v.key)}
            />
          </section>
        ))}
      </div>
      {/* All-Star teams remain below, unchanged */}
      <div style={{ marginTop: '2.5rem', width: '100%' }}>
        <div style={{ minWidth: 320, marginBottom: '2rem' }}>
          <h3 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.5rem', textAlign: 'left' }}>American League All-Stars</h3>
          <div className="branding-grid">
            {alAllStars.map(team => (
              <TeamCard
                key={team.teamID || team.clubFullName}
                team={team}
                opts={{ showPlayer: false }}
                selectedPlayerId={selectedPlayers[team.teamID] || ''}
                setSelectedPlayers={setSelectedPlayers}
                colorPriority={capLogoVariants.map(v => v.key)}
              />
            ))}
          </div>
        </div>
        <div style={{ minWidth: 320 }}>
          <h3 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.5rem', textAlign: 'left' }}>National League All-Stars</h3>
          <div className="branding-grid">
            {nlAllStars.map(team => (
              <TeamCard
                key={team.teamID || team.clubFullName}
                team={team}
                opts={{ showPlayer: false }}
                selectedPlayerId={selectedPlayers[team.teamID] || ''}
                setSelectedPlayers={setSelectedPlayers}
                colorPriority={capLogoVariants.map(v => v.key)}
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
    </div>
  );
}
