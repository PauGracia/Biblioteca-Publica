// ThemeToggle.jsx
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Detección inicial del modo (no forzamos nada, solo leemos la preferencia)
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
    document.documentElement.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
  }, []);

  const handleToggle = () => {
    const next = !isDark;
    document.documentElement.classList.replace(
      isDark ? 'theme-dark' : 'theme-light',
      next   ? 'theme-dark' : 'theme-light'
    );
    setIsDark(next);
  };

  return (
    <button onClick={handleToggle} className="theme-toggle-btn">
      {isDark ? '🌞 Pantalla Clara' : '🌙 Pantalla Fosca'}
    </button>
  );
}
