import { useEffect } from 'react';
import { GameState } from '../types/game';
import { generateYojefMarketItems } from '../utils/gameUtils';

export const useGameStateEffects = (
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
) => {
  // Update play time
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        statistics: {
          ...prev.statistics,
          totalPlayTime: prev.statistics.totalPlayTime + 1,
        },
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [setGameState]);

  // AFK gem mining - 2 gems per minute
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        gems: prev.gems + 2,
        statistics: {
          ...prev.statistics,
          gemsEarned: prev.statistics.gemsEarned + 2,
        },
      }));
    }, 60000);

    return () => clearInterval(interval);
  }, [setGameState]);

  // Yojef Market refresh timer
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        const now = new Date();
        if (now >= prev.yojefMarket.nextRefresh) {
          return {
            ...prev,
            yojefMarket: {
              items: generateYojefMarketItems(),
              lastRefresh: now,
              nextRefresh: new Date(now.getTime() + 5 * 60 * 1000),
            },
          };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [setGameState]);
};