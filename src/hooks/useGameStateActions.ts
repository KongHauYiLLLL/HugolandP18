import { useCallback } from 'react';
import { GameState, Weapon, Armor, ChestReward, RelicItem } from '../types/game';
import { 
  generateWeapon, 
  generateArmor, 
  generateEnemy, 
  generateMythicalWeapon, 
  generateMythicalArmor,
  calculateResearchCost,
  getChestRarityWeights,
  canRepairWithAnvil,
  repairWithAnvil,
  canResetItem,
  resetItem
} from '../utils/gameUtils';
import { STORAGE_KEY } from '../data/gameInitialState';
import AsyncStorage from '../utils/storage';

export const useGameStateActions = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  triggerVisualEffect: (type: 'text' | 'particles' | 'shake', data?: any) => void,
  checkAchievements: (gameState: GameState) => any[],
  checkPlayerTags: (gameState: GameState) => any[]
) => {
  const updateCollectionBook = useCallback((item: Weapon | Armor) => {
    setGameState(prev => {
      const isWeapon = 'baseAtk' in item;
      const collectionKey = isWeapon ? 'weapons' : 'armor';
      const countKey = isWeapon ? 'totalWeaponsFound' : 'totalArmorFound';
      
      if (prev.collectionBook[collectionKey][item.name]) {
        return prev;
      }

      return {
        ...prev,
        collectionBook: {
          ...prev.collectionBook,
          [collectionKey]: {
            ...prev.collectionBook[collectionKey],
            [item.name]: true,
          },
          [countKey]: prev.collectionBook[countKey] + 1,
          rarityStats: {
            ...prev.collectionBook.rarityStats,
            [item.rarity]: prev.collectionBook.rarityStats[item.rarity] + 1,
          },
        },
        statistics: {
          ...prev.statistics,
          itemsCollected: prev.statistics.itemsCollected + 1,
        },
      };
    });
  }, [setGameState]);

  const updateKnowledgeStreak = useCallback((correct: boolean) => {
    setGameState(prev => {
      const newCurrent = correct ? prev.knowledgeStreak.current + 1 : 0;
      const newBest = Math.max(prev.knowledgeStreak.best, newCurrent);
      const newMultiplier = Math.min(1 + Math.floor(newCurrent / 5) * 0.1, 2);

      if (correct && newCurrent > 0 && newCurrent % 5 === 0) {
        triggerVisualEffect('text', { 
          text: `${newCurrent} Streak! +${Math.round((newMultiplier - 1) * 100)}% Bonus!`, 
          color: 'text-yellow-400' 
        });
      }

      return {
        ...prev,
        knowledgeStreak: {
          current: newCurrent,
          best: newBest,
          multiplier: newMultiplier,
          lastCorrectTime: correct ? new Date() : prev.knowledgeStreak.lastCorrectTime,
        },
      };
    });
  }, [setGameState, triggerVisualEffect]);

  const updateStatistics = useCallback((category: string, correct: boolean) => {
    setGameState(prev => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        totalQuestionsAnswered: prev.statistics.totalQuestionsAnswered + 1,
        correctAnswers: prev.statistics.correctAnswers + (correct ? 1 : 0),
        accuracyByCategory: {
          ...prev.statistics.accuracyByCategory,
          [category]: {
            correct: (prev.statistics.accuracyByCategory[category]?.correct || 0) + (correct ? 1 : 0),
            total: (prev.statistics.accuracyByCategory[category]?.total || 0) + 1,
          },
        },
      },
    }));
  }, [setGameState]);

  const checkAndUnlockAchievements = useCallback(() => {
    setGameState(prev => {
      const newUnlocks = checkAchievements(prev);
      
      if (newUnlocks.length > 0) {
        let bonusCoins = 0;
        let bonusGems = 0;
        
        newUnlocks.forEach(achievement => {
          if (achievement.reward) {
            bonusCoins += achievement.reward.coins || 0;
            bonusGems += achievement.reward.gems || 0;
          }
        });

        if (bonusCoins > 0 || bonusGems > 0) {
          triggerVisualEffect('text', { 
            text: `Achievement Rewards: +${bonusCoins} coins, +${bonusGems} gems!`, 
            color: 'text-green-400' 
          });
        }

        const updatedAchievements = prev.achievements.map(existing => {
          const newUnlock = newUnlocks.find(nu => nu.id === existing.id);
          return newUnlock || existing;
        });

        return {
          ...prev,
          coins: prev.coins + bonusCoins,
          gems: prev.gems + bonusGems,
          achievements: updatedAchievements,
        };
      }

      return prev;
    });
  }, [setGameState, triggerVisualEffect, checkAchievements]);

  const checkAndUnlockPlayerTags = useCallback(() => {
    setGameState(prev => {
      const newUnlocks = checkPlayerTags(prev);
      
      if (newUnlocks.length > 0) {
        newUnlocks.forEach(tag => {
          triggerVisualEffect('text', { 
            text: `New Tag Unlocked: ${tag.name}!`, 
            color: tag.color 
          });
        });

        const updatedTags = prev.playerTags.map(existing => {
          const newUnlock = newUnlocks.find(nu => nu.id === existing.id);
          return newUnlock || existing;
        });

        return {
          ...prev,
          playerTags: updatedTags,
        };
      }

      return prev;
    });
  }, [setGameState, triggerVisualEffect, checkPlayerTags]);

  const resetGame = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    } catch (error) {
      console.error('Error resetting game:', error);
    }
  }, []);

  // Equipment actions
  const equipWeapon = useCallback((weapon: Weapon) => {
    setGameState(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        currentWeapon: weapon,
      },
    }));
  }, [setGameState]);

  const equipArmor = useCallback((armor: Armor) => {
    setGameState(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        currentArmor: armor,
      },
    }));
  }, [setGameState]);

  // Upgrade actions
  const upgradeWeapon = useCallback((weaponId: string) => {
    setGameState(prev => {
      const weapon = prev.inventory.weapons.find(w => w.id === weaponId);
      if (!weapon || (prev.gems < weapon.upgradeCost && !prev.cheats.infiniteGems)) return prev;

      const updatedWeapons = prev.inventory.weapons.map(w =>
        w.id === weaponId
          ? { ...w, level: w.level + 1, upgradeCost: Math.floor(w.upgradeCost * 1.5), sellPrice: Math.floor(w.sellPrice * 1.2) }
          : w
      );

      const updatedCurrentWeapon = prev.inventory.currentWeapon?.id === weaponId
        ? updatedWeapons.find(w => w.id === weaponId) || null
        : prev.inventory.currentWeapon;

      triggerVisualEffect('text', { text: 'Weapon Upgraded!', color: 'text-green-400' });

      return {
        ...prev,
        gems: prev.cheats.infiniteGems ? prev.gems : prev.gems - weapon.upgradeCost,
        inventory: {
          ...prev.inventory,
          weapons: updatedWeapons,
          currentWeapon: updatedCurrentWeapon,
        },
      };
    });
  }, [setGameState, triggerVisualEffect]);

  const upgradeArmor = useCallback((armorId: string) => {
    setGameState(prev => {
      const armor = prev.inventory.armor.find(a => a.id === armorId);
      if (!armor || (prev.gems < armor.upgradeCost && !prev.cheats.infiniteGems)) return prev;

      const updatedArmor = prev.inventory.armor.map(a =>
        a.id === armorId
          ? { ...a, level: a.level + 1, upgradeCost: Math.floor(a.upgradeCost * 1.5), sellPrice: Math.floor(a.sellPrice * 1.2) }
          : a
      );

      const updatedCurrentArmor = prev.inventory.currentArmor?.id === armorId
        ? updatedArmor.find(a => a.id === armorId) || null
        : prev.inventory.currentArmor;

      triggerVisualEffect('text', { text: 'Armor Upgraded!', color: 'text-blue-400' });

      return {
        ...prev,
        gems: prev.cheats.infiniteGems ? prev.gems : prev.gems - armor.upgradeCost,
        inventory: {
          ...prev.inventory,
          armor: updatedArmor,
          currentArmor: updatedCurrentArmor,
        },
      };
    });
  }, [setGameState, triggerVisualEffect]);

  // Sell actions
  const sellWeapon = useCallback((weaponId: string) => {
    setGameState(prev => {
      const weapon = prev.inventory.weapons.find(w => w.id === weaponId);
      if (!weapon || prev.inventory.currentWeapon?.id === weaponId) return prev;

      return {
        ...prev,
        coins: prev.coins + weapon.sellPrice,
        inventory: {
          ...prev.inventory,
          weapons: prev.inventory.weapons.filter(w => w.id !== weaponId),
        },
      };
    });
  }, [setGameState]);

  const sellArmor = useCallback((armorId: string) => {
    setGameState(prev => {
      const armor = prev.inventory.armor.find(a => a.id === armorId);
      if (!armor || prev.inventory.currentArmor?.id === armorId) return prev;

      return {
        ...prev,
        coins: prev.coins + armor.sellPrice,
        inventory: {
          ...prev.inventory,
          armor: prev.inventory.armor.filter(a => a.id !== armorId),
        },
      };
    });
  }, [setGameState]);

  // Research actions
  const upgradeResearch = useCallback((type: 'atk' | 'def' | 'hp') => {
    const researchCost = calculateResearchCost(gameState.research[type].level);
    setGameState(prev => {
      if (prev.coins < researchCost && !prev.cheats.infiniteCoins) return prev;

      const newLevel = prev.research[type].level + 1;
      
      triggerVisualEffect('text', { 
        text: `${type.toUpperCase()} Research Upgraded!`, 
        color: type === 'atk' ? 'text-orange-400' : type === 'def' ? 'text-blue-400' : 'text-red-400' 
      });

      return {
        ...prev,
        coins: prev.cheats.infiniteCoins ? prev.coins : prev.coins - researchCost,
        research: {
          ...prev.research,
          [type]: {
            level: newLevel,
            totalSpent: prev.research[type].totalSpent + researchCost,
          },
        },
      };
    });
    checkAndUnlockAchievements();
  }, [gameState.research, setGameState, triggerVisualEffect, checkAndUnlockAchievements]);

  // Relic actions
  const purchaseRelic = useCallback((relicId: string): boolean => {
    setGameState(prev => {
      const relic = prev.yojefMarket.items.find(r => r.id === relicId);
      if (!relic || prev.coins < relic.cost || prev.inventory.equippedRelics.length >= 5) {
        return prev;
      }

      triggerVisualEffect('text', { text: 'Relic Purchased!', color: 'text-indigo-400' });

      return {
        ...prev,
        coins: prev.coins - relic.cost,
        inventory: {
          ...prev.inventory,
          relics: [...prev.inventory.relics, relic],
          equippedRelics: [...prev.inventory.equippedRelics, relic],
        },
        yojefMarket: {
          ...prev.yojefMarket,
          items: prev.yojefMarket.items.filter(r => r.id !== relicId),
        },
      };
    });

    return true;
  }, [setGameState, triggerVisualEffect]);

  const upgradeRelic = useCallback((relicId: string) => {
    setGameState(prev => {
      const relic = prev.inventory.relics.find(r => r.id === relicId);
      if (!relic || prev.gems < relic.upgradeCost) return prev;

      const updatedRelics = prev.inventory.relics.map(r =>
        r.id === relicId
          ? { 
              ...r, 
              level: r.level + 1, 
              upgradeCost: Math.floor(r.upgradeCost * 1.5),
              baseAtk: r.baseAtk ? r.baseAtk + 15 : undefined,
              baseDef: r.baseDef ? r.baseDef + 10 : undefined,
            }
          : r
      );

      const updatedEquippedRelics = prev.inventory.equippedRelics.map(r =>
        r.id === relicId ? updatedRelics.find(ur => ur.id === relicId)! : r
      );

      triggerVisualEffect('text', { text: 'Relic Upgraded!', color: 'text-indigo-400' });

      return {
        ...prev,
        gems: prev.gems - relic.upgradeCost,
        inventory: {
          ...prev.inventory,
          relics: updatedRelics,
          equippedRelics: updatedEquippedRelics,
        },
      };
    });
  }, [setGameState, triggerVisualEffect]);

  const equipRelic = useCallback((relicId: string) => {
    setGameState(prev => {
      const relic = prev.inventory.relics.find(r => r.id === relicId);
      if (!relic || prev.inventory.equippedRelics.length >= 5 || 
          prev.inventory.equippedRelics.some(r => r.id === relicId)) {
        return prev;
      }

      return {
        ...prev,
        inventory: {
          ...prev.inventory,
          equippedRelics: [...prev.inventory.equippedRelics, relic],
        },
      };
    });
  }, [setGameState]);

  const unequipRelic = useCallback((relicId: string) => {
    setGameState(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        equippedRelics: prev.inventory.equippedRelics.filter(r => r.id !== relicId),
      },
    }));
  }, [setGameState]);

  const sellRelic = useCallback((relicId: string) => {
    setGameState(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        relics: prev.inventory.relics.filter(r => r.id !== relicId),
        equippedRelics: prev.inventory.equippedRelics.filter(r => r.id !== relicId),
      },
    }));
  }, [setGameState]);

  return {
    equipWeapon,
    equipArmor,
    upgradeWeapon,
    upgradeArmor,
    sellWeapon,
    sellArmor,
    upgradeResearch,
    resetGame,
    updateCollectionBook,
    updateKnowledgeStreak,
    updateStatistics,
    checkAndUnlockAchievements,
    checkAndUnlockPlayerTags,
    purchaseRelic,
    upgradeRelic,
    equipRelic,
    unequipRelic,
    sellRelic,
  };
};