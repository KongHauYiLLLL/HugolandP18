import { useState, useCallback } from 'react';

interface VisualEffects {
  showFloatingText: boolean;
  floatingText: string;
  floatingTextColor: string;
  showParticles: boolean;
  showScreenShake: boolean;
}

export const useVisualEffects = () => {
  const [visualEffects, setVisualEffects] = useState<VisualEffects>({
    showFloatingText: false,
    floatingText: '',
    floatingTextColor: '',
    showParticles: false,
    showScreenShake: false,
  });

  const triggerVisualEffect = useCallback((type: 'text' | 'particles' | 'shake', data?: any) => {
    switch (type) {
      case 'text':
        setVisualEffects(prev => ({
          ...prev,
          showFloatingText: true,
          floatingText: data.text,
          floatingTextColor: data.color,
        }));
        break;
      case 'particles':
        setVisualEffects(prev => ({ ...prev, showParticles: true }));
        break;
      case 'shake':
        setVisualEffects(prev => ({ ...prev, showScreenShake: true }));
        break;
    }
  }, []);

  const clearVisualEffect = useCallback((type: 'text' | 'particles' | 'shake') => {
    setVisualEffects(prev => ({
      ...prev,
      [`show${type.charAt(0).toUpperCase() + type.slice(1)}`]: false,
    }));
  }, []);

  return {
    visualEffects,
    triggerVisualEffect,
    clearVisualEffect,
  };
};