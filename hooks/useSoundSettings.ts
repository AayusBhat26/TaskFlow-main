import { useState, useEffect } from 'react';

interface SoundSettings {
  soundsEnabled: boolean;
  soundVolume: number;
  taskCompletionSound: string;
  questionCompletionSound: string;
}

const defaultSettings: SoundSettings = {
  soundsEnabled: true,
  soundVolume: 0.5,
  taskCompletionSound: 'TASK_COMPLETE',
  questionCompletionSound: 'QUESTION_COMPLETE',
};

export function useSoundSettings() {
  const [settings, setSettings] = useState<SoundSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('soundSettings');
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load sound settings from localStorage:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save settings to localStorage
  const updateSettings = (newSettings: Partial<SoundSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      localStorage.setItem('soundSettings', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save sound settings to localStorage:', error);
    }
  };

  return {
    settings,
    updateSettings,
    isLoaded,
  };
}
