import { useState, useEffect } from 'react';
import App from './App.jsx';
import AppV2 from './appv2/AppV2.jsx';
import './App.css';

function VersionSelector() {
  const [version, setVersion] = useState(() => {
    // Default to V2 on first load, or use last used version from localStorage
    return localStorage.getItem('selectedAppVersion') || '2';
  });

  useEffect(() => {
    // Always default to V2 on first load
    if (!localStorage.getItem('selectedAppVersion')) {
      setVersion('2');
      localStorage.setItem('selectedAppVersion', '2');
    }
  }, []);

  function handleSelect(e) {
    setVersion(e.target.value);
    localStorage.setItem('selectedAppVersion', e.target.value);
  }

  return (
    <div>
      {version === '1' ? <App /> : <AppV2 />}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
        <label style={{ fontWeight: 600, marginRight: '1rem' }}>Select App Version:</label>
        <select value={version} onChange={handleSelect} style={{ fontSize: '1rem', padding: '0.5rem 1rem', borderRadius: 6 }}>
          <option value="1">App 1: BIGPAPI</option>
          <option value="2">App 2: MLB Branding Guide (V2)</option>
        </select>
      </div>
      <div style={{ textAlign: 'center', color: '#bfa76a', fontSize: 15, fontWeight: 600, marginBottom: 2 }}>
        v1.01 &nbsp;|&nbsp; Created by MLB VR and Gaming &nbsp;|&nbsp; <span style={{ color: '#e74c3c', fontWeight: 700 }}>INTERNAL USE ONLY</span>
      </div>
      <footer style={{ textAlign: 'center', color: '#888', fontSize: 14, margin: '2rem 0 1rem 0' }}>
        © {new Date().getFullYear()} MLB Advanced Media, LP. All rights reserved.
      </footer>
    </div>
  );
}

export default VersionSelector;
