// src/components/Loader.js
import React from 'react';

export default function Loader({ size = 40, label }) {
  const style = {
    width: size,
    height: size,
    borderRadius: '50%',
    borderTop: `${Math.max(3, Math.floor(size / 10))}px solid rgba(0,0,0,0.15)`,
    borderRight: `${Math.max(3, Math.floor(size / 10))}px solid rgba(0,0,0,0.15)`,
    borderBottom: `${Math.max(3, Math.floor(size / 10))}px solid rgba(0,0,0,0.15)`,
    borderLeft: `${Math.max(3, Math.floor(size / 10))}px solid #007bff`,
    animation: 'spin 0.9s linear infinite',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={style}></div>
      {label && <div style={{ fontSize: 14, color: '#444' }}>{label}</div>}
    </div>
  );
}
