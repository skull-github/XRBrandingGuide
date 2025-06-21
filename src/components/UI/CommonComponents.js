import React from 'react';

export function ColorSwatch({ color }) {
  if (!color || typeof color !== 'string' || !color.startsWith('#')) {
    return null;
  }

  return (
    <div
      style={{
        width: '30px',
        height: '30px',
        backgroundColor: color,
        border: '2px solid #fff',
        borderRadius: '6px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        display: 'inline-block',
        marginRight: '8px',
        cursor: 'pointer',
      }}
      title={color}
      onClick={() => {
        navigator.clipboard.writeText(color);
      }}
    />
  );
}

export function CopyButton({ url, style }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(url);
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        padding: '4px 8px',
        fontSize: '12px',
        cursor: 'pointer',
        opacity: 0,
        transition: 'opacity 0.2s',
        zIndex: 10,
        ...style
      }}
    >
      Copy URL
    </button>
  );
}

export function Tooltip({ children, text, visible, position }) {
  if (!visible) return children;

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {children}
      <div
        style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: '#fff',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          zIndex: 1000,
          marginBottom: '4px',
          ...position
        }}
      >
        {text}
      </div>
    </div>
  );
}
