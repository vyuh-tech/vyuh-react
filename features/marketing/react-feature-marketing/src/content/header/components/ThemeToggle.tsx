'use client';
import { cn } from '@/shared/utils';
import { Moon, Palette, Sun } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  showLabel = false,
}) => {
  // Available themes
  const themes = ['light', 'dracula', 'corporate', 'lofi', 'winter'];

  // Get the current theme from localStorage or default to 'light'
  const [theme, setTheme] = useState<string>('light');

  // Initialize theme from localStorage when component mounts
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    // Make sure the saved theme is in our list, otherwise default to light
    const validTheme = themes.includes(savedTheme) ? savedTheme : 'light';
    setTheme(validTheme);
    document.documentElement.setAttribute('data-theme', validTheme);
  }, []);

  // Cycle through available themes
  const toggleTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const newTheme = themes[nextIndex];

    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const Icon = theme === 'light' ? Sun : theme === 'dracula' ? Moon : Palette;

  return (
    <div className="tooltip tooltip-bottom" data-tip={`Theme: ${theme}`}>
      <button
        onClick={toggleTheme}
        className={cn(
          {
            'btn btn-ghost btn-circle': !showLabel,
            'flex flex-row items-center gap-2': showLabel,
          },
          'transition-colors duration-200',
          className,
        )}
        aria-label="Toggle theme"
      >
        <Icon className="h-5 w-5" />
        {showLabel && <span>Change Theme</span>}
      </button>
    </div>
  );
};
