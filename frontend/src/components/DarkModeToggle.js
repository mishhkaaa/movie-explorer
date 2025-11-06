// src/components/DarkModeToggle.js
import React, { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const [dark, setDark] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      style={{
        backgroundColor: dark ? '#333' : '#f0f0f0',
        color: dark ? '#fff' : '#000',
        border: '1px solid #888',
        borderRadius: 4,
        padding: '6px 10px',
        marginLeft: 8,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
    >
      {dark ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
