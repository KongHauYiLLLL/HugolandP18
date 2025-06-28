import { useState, useCallback, useEffect } from 'react';
import { GameState, PlayerStats, Inventory, Enemy, Weapon, Armor, ChestReward, Research, Achievement, CollectionBook, KnowledgeStreak, GameMode, Statistics, CheatSettings, Mining, PowerSkill } from '../types/game';
import { generateWeapon, generateArmor, generateEnemy, generateMythicalWeapon, generateMythicalArmor, calculateResearchBonus, calculateResearchCost, getChestRarityWeights } from '../utils/gameUtils';
import { checkAchievements, initializeAchievements } from '../utils/achievements';
import { getPowerSkillForTier } from '../utils/powerSkills';
import AsyncStorage from '../utils/storage';

const STORAGE_KEY = 'hugoland_game_state';

const initialPlayerStats: PlayerStats = {
  hp: 200,
  maxHp: 200,
  atk: 50,
  def: 0,
  baseAtk: 50,
  baseDef: 0,
  baseHp: 200,
};

const initialInventory: Inventory = {
  weapons: [],
  armor: [],
  currentWeapon: null,
  currentArmor: null,
};

const initialResearch: Research = {
  level: 0,
  tier: 0,
  totalSpent: 0,
};

const initialCollectionBook: CollectionBook = {
  weapons: {},
  armor: {},
  totalWeaponsFound: 0,
  totalArmorFound: 0,
  rarityStats: {
    common: 0,
    rare: 0,
    epic: 0,
    legendary: 0,
    mythical: 0,
  },
};

const initialKnowledgeStreak: KnowledgeStreak = {
  current: 0,
  best: 0,
  multiplier: 1,
};

const initialGameMode: GameMode = {
  current: 'normal',
  speedModeActive: false,
  survivalLives: 3,
  maxSurvivalLives: 3,
};

const initialStatistics: Statistics = {
  totalQuestionsAnswered: 0,
  correctAnswers: 0,
  totalPlayTime: 0,
  zonesReached: 1,
  itemsCollected: 0,
  coinsEarned: 0,
  gemsEarned: 0,
  chestsOpened: 0,
  accuracyByCategory: {},
  sessionStartTime: new Date(),
};

const initialCheats: CheatSettings = {
  infiniteCoins: false,
  infiniteGems: false,
  obtainAnyItem: false,
};

const initialMining: Mining = {
  efficiency: 1,
  tools: {
    basic_pickaxe: false,
    steel_pickaxe: false,
    diamond_pickaxe: false,
    mythical_pickaxe: false,
  },
  totalGemsMined: 0,
};

const initialPromoCodes: PromoCodeState = {
  usedCodes: [],
  availableCodes: [
    {
      code: 'TNT',
      name: 'Explosive Start',
      description: 'Get a head start with bonus resources!',
      rewards: {
        coins: 500,
        gems: 50,
      },
      isUsed: false,
    },
  ],
};

const initialGameState: GameState = {
  coins: 100,
  gems: 0,
  zone: 1,
  playerStats: initialPlayerStats,
  inventory: initialInventory,
  currentEnemy: null,
  inCombat: false,
  combatLog: [],
  research: initialResearch,
  isPremium: false,
  achievements: initializeAchievements(),
  collectionBook: initialCollectionBook,
  knowledgeStreak: initialKnowledgeStreak,
  gameMode: initialGameMode,
  statistics: initialStatistics,
  powerSkills: [],
  cheats: initialCheats,
  mining: initialMining,
  promoCodes: initialPromoCodes,
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [isLoading, setIsLoading] = useState(true);
  const [visualEffects, setVisualEffects] = useState({
    showFloatingText: false,
    floatingText: '',
    floatingTextColor: '',
    showParticles: false,
    showScreenShake: false,
  });

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
  }, []);

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
  }, []);

  // Load game state from storage
  useEffect(() => {
    const loadGameState = async () => {
      setIsLoading(true);
      
      try {
        const savedState = await AsyncStorage.getItem(STORAGE_KEY);
        
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          setGameState({
            ...initialGameState,
            ...parsedState,
            currentEnemy: null,
            inCombat: false,
            combatLog: [],
            achievements: parsedState.achievements || initializeAchievements(),
            collectionBook: parsedState.collectionBook || initialCollectionBook,
            knowledgeStreak: parsedState.knowledgeStreak || initialKnowledgeStreak,
            gameMode: parsedState.gameMode || initialGameMode,
            statistics: {
              ...initialStatistics,
              ...parsedState.statistics,
              sessionStartTime: new Date(),
            },
            research: parsedState.research || initialResearch,
            isPremium: parsedState.isPremium || parsedState.zone >= 50,
            powerSkills: parsedState.powerSkills || [],
            cheats: parsedState.cheats || initialCheats,
            mining: parsedState.mining || initialMining,
            promoCodes: parsedState.promoCodes || initialPromoCodes,
          });
        } else {
          setGameState({
            ...initialGameState,
            achievements: initializeAchievements(),
            statistics: {
              ...initialStatistics,
              sessionStartTime: new Date(),
            },
          });
        }
      } catch (error) {
        console.error('Error loading game state:', error);
        setGameState({
          ...initialGameState,
          achievements: initializeAchievements(),
          statistics: {
            ...initialStatistics,
            sessionStartTime: new Date(),
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadGameState();
  }, []);

  // Save game state to storage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      const saveGameState = async () => {
        try {
          const stateToSave = {
            ...gameState,
            currentEnemy: null,
            inCombat: false,
            combatLog: [],
          };
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
        } catch (error) {
          console.error('Error saving game state:', error);
        }
      };

      saveGameState();
    }
  }, [gameState, isLoading]);

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
  }, []);

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
  }, [triggerVisualEffect]);

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
  }, []);

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
  }, [triggerVisualEffect]);

  const updatePlayerStats = useCallback(() => {
    setGameState(prev => {
      const weaponAtk = prev.inventory.currentWeapon 
        ? prev.inventory.currentWeapon.baseAtk + (prev.inventory.currentWeapon.level - 1) * 10
        : 0;
      const armorDef = prev.inventory.currentArmor 
        ? prev.inventory.currentArmor.baseDef + (prev.inventory.currentArmor.level - 1) * 5
        : 0;

      const researchBonus = calculateResearchBonus(prev.research.level, prev.research.tier);
      let bonusMultiplier = 1 + (researchBonus / 100);

      // Apply power skill bonuses
      let powerSkillAtkBonus = 0;
      let powerSkillDefBonus = 0;
      let powerSkillHpMultiplier = 1;

      prev.powerSkills.forEach(skill => {
        if (!skill.isActive) return;
        
        switch (skill.effect.type) {
          case 'crown':
            powerSkillAtkBonus += skill.effect.value!;
            powerSkillDefBonus += skill.effect.value!;
            break;
          case 'hp_boost':
            powerSkillHpMultiplier *= skill.effect.value!;
            break;
        }
      });

      // Apply game mode modifiers
      let atkMultiplier = 1;
      let defMultiplier = 1;
      let hpMultiplier = 1;

      switch (prev.gameMode.current) {
        case 'bloodlust':
          atkMultiplier = 2;
          defMultiplier = 0.5;
          hpMultiplier = 0.5;
          break;
        case 'crazy':
          atkMultiplier = 0.5;
          defMultiplier = 0.5;
          hpMultiplier = 0.5;
          break;
      }

      const finalAtk = Math.floor(((prev.playerStats.baseAtk + weaponAtk) * bonusMultiplier + powerSkillAtkBonus) * atkMultiplier);
      const finalDef = Math.floor(((prev.playerStats.baseDef + armorDef) * bonusMultiplier + powerSkillDefBonus) * defMultiplier);
      const finalMaxHp = Math.floor(prev.playerStats.baseHp * bonusMultiplier * hpMultiplier * powerSkillHpMultiplier);

      return {
        ...prev,
        playerStats: {
          ...prev.playerStats,
          atk: finalAtk,
          def: finalDef,
          maxHp: finalMaxHp,
          hp: Math.min(prev.playerStats.hp, finalMaxHp),
        },
      };
    });
  }, []);

  const setGameMode = useCallback((mode: 'normal' | 'blitz' | 'bloodlust' | 'crazy') => {
    setGameState(prev => ({
      ...prev,
      gameMode: {
        ...prev.gameMode,
        current: mode,
        speedModeActive: mode === 'blitz' || mode === 'bloodlust',
      },
    }));
    updatePlayerStats();
  }, [updatePlayerStats]);

  const toggleCheat = useCallback((cheat: keyof CheatSettings) => {
    setGameState(prev => ({
      ...prev,
      cheats: {
        ...prev.cheats,
        [cheat]: !prev.cheats[cheat],
      },
    }));
  }, []);

  const generateCheatItem = useCallback(() => {
    console.log('Generate cheat item functionality not implemented yet');
  }, []);

  const mineGem = useCallback((x: number, y: number): boolean => {
    setGameState(prev => ({
      ...prev,
      gems: prev.gems + prev.mining.efficiency,
      mining: {
        ...prev.mining,
        totalGemsMined: prev.mining.totalGemsMined + prev.mining.efficiency,
      },
      statistics: {
        ...prev.statistics,
        gemsEarned: prev.statistics.gemsEarned + prev.mining.efficiency,
      },
    }));

    triggerVisualEffect('text', { text: `+${gameState.mining.efficiency} Gem${gameState.mining.efficiency > 1 ? 's' : ''}!`, color: 'text-purple-400' });
    return true;
  }, [triggerVisualEffect, gameState.mining.efficiency]);

  const purchaseMiningTool = useCallback((toolId: string): boolean => {
    const toolCosts = {
      basic_pickaxe: 50,
      steel_pickaxe: 200,
      diamond_pickaxe: 500,
      mythical_pickaxe: 1000,
    };

    const toolEfficiency = {
      basic_pickaxe: 1,
      steel_pickaxe: 2,
      diamond_pickaxe: 3,
      mythical_pickaxe: 5,
    };

    const cost = toolCosts[toolId as keyof typeof toolCosts];
    const efficiency = toolEfficiency[toolId as keyof typeof toolEfficiency];

    setGameState(prev => {
      if (prev.gems < cost || prev.mining.tools[toolId as keyof typeof prev.mining.tools]) {
        return prev;
      }

      return {
        ...prev,
        gems: prev.gems - cost,
        mining: {
          ...prev.mining,
          efficiency: prev.mining.efficiency + efficiency,
          tools: {
            ...prev.mining.tools,
            [toolId]: true,
          },
        },
      };
    });

    triggerVisualEffect('text', { text: 'Mining Tool Purchased!', color: 'text-orange-400' });
    return true;
  }, [triggerVisualEffect]);

  const redeemPromoCode = useCallback((code: string): boolean => {
    setGameState(prev => {
      if (prev.promoCodes.usedCodes.includes(code)) {
        return prev;
      }

      const promoCode = prev.promoCodes.availableCodes.find(pc => pc.code === code);
      if (!promoCode) {
        return prev;
      }

      const updatedPromoCodes = {
        ...prev.promoCodes,
        usedCodes: [...prev.promoCodes.usedCodes, code],
        availableCodes: prev.promoCodes.availableCodes.map(pc => 
          pc.code === code ? { ...pc, isUsed: true } : pc
        ),
      };

      let newCoins = prev.coins;
      let newGems = prev.gems;
      let newWeapons = [...prev.inventory.weapons];
      let newArmor = [...prev.inventory.armor];

      if (promoCode.rewards.coins) {
        newCoins += promoCode.rewards.coins;
      }
      if (promoCode.rewards.gems) {
        newGems += promoCode.rewards.gems;
      }
      if (promoCode.rewards.items) {
        promoCode.rewards.items.forEach(item => {
          if ('baseAtk' in item) {
            newWeapons.push(item as Weapon);
          } else {
            newArmor.push(item as Armor);
          }
        });
      }

      triggerVisualEffect('text', { 
        text: `Promo Code Redeemed! +${promoCode.rewards.coins || 0} coins, +${promoCode.rewards.gems || 0} gems`, 
        color: 'text-green-400' 
      });

      return {
        ...prev,
        coins: newCoins,
        gems: newGems,
        inventory: {
          ...prev.inventory,
          weapons: newWeapons,
          armor: newArmor,
        },
        promoCodes: updatedPromoCodes,
      };
    });

    return true;
  }, [triggerVisualEffect]);

  const discardItem = useCallback((itemId: string, type: 'weapon' | 'armor') => {
    setGameState(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        weapons: type === 'weapon' 
          ? prev.inventory.weapons.filter(w => w.id !== itemId)
          : prev.inventory.weapons,
        armor: type === 'armor'
          ? prev.inventory.armor.filter(a => a.id !== itemId)
          : prev.inventory.armor,
      },
    }));
  }, []);

  const equipWeapon = useCallback((weapon: Weapon) => {
    setGameState(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        currentWeapon: weapon,
      },
    }));
    updatePlayerStats();
  }, [updatePlayerStats]);

  const equipArmor = useCallback((armor: Armor) => {
    setGameState(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        currentArmor: armor,
      },
    }));
    updatePlayerStats();
  }, [updatePlayerStats]);

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
    updatePlayerStats();
  }, [updatePlayerStats, triggerVisualEffect]);

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
    updatePlayerStats();
  }, [updatePlayerStats, triggerVisualEffect]);

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
  }, []);

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
  }, []);

  const upgradeResearch = useCallback(() => {
    const researchCost = calculateResearchCost(gameState.research.level, gameState.research.tier);
    setGameState(prev => {
      if (prev.coins < researchCost && !prev.cheats.infiniteCoins) return prev;

      const newLevel = prev.research.level + 1;
      const newTier = Math.floor(newLevel / 10);
      
      let newPowerSkills = [...prev.powerSkills];
      
      if (newTier > prev.research.tier) {
        triggerVisualEffect('text', { text: `Research Tier ${newTier + 1} Unlocked!`, color: 'text-purple-400' });
        
        // Unlock new power skill for this tier
        const newPowerSkill = getPowerSkillForTier(newTier + 1);
        if (newPowerSkill) {
          newPowerSkills.push(newPowerSkill);
          triggerVisualEffect('text', { text: `New Power Skill: ${newPowerSkill.name}!`, color: 'text-yellow-400' });
        }
      }

      return {
        ...prev,
        coins: prev.cheats.infiniteCoins ? prev.coins : prev.coins - researchCost,
        research: {
          level: newLevel,
          tier: newTier,
          totalSpent: prev.research.totalSpent + researchCost,
        },
        powerSkills: newPowerSkills,
      };
    });
    updatePlayerStats();
    checkAndUnlockAchievements();
  }, [gameState.research.level, gameState.research.tier, updatePlayerStats, triggerVisualEffect, checkAndUnlockAchievements]);

  const openChest = useCallback((chestCost: number): ChestReward | null => {
    if (gameState.coins < chestCost && !gameState.cheats.infiniteCoins) return null;

    const numItems = Math.floor(Math.random() * 3) + 2;
    const bonusGems = Math.floor(Math.random() * 15) + 10;
    const items: (Weapon | Armor)[] = [];

    // Get rarity weights based on chest cost
    const rarityWeights = getChestRarityWeights(chestCost);
    const rarities = ['common', 'rare', 'epic', 'legendary', 'mythical'];

    for (let i = 0; i < numItems; i++) {
      const isWeapon = Math.random() < 0.5;
      
      // Select rarity based on weights
      const random = Math.random() * 100;
      let cumulative = 0;
      let selectedRarity = 'common';
      
      for (let j = 0; j < rarityWeights.length; j++) {
        cumulative += rarityWeights[j];
        if (random <= cumulative) {
          selectedRarity = rarities[j];
          break;
        }
      }
      
      const item = isWeapon ? generateWeapon(false, selectedRarity) : generateArmor(false, selectedRarity);
      items.push(item);
      updateCollectionBook(item);
    }

    const chestReward: ChestReward = {
      type: Math.random() < 0.5 ? 'weapon' : 'armor',
      items,
    };

    const streakMultiplier = gameState.knowledgeStreak.multiplier;
    const finalBonusGems = Math.floor(bonusGems * streakMultiplier);

    setGameState(prev => ({
      ...prev,
      coins: prev.cheats.infiniteCoins ? prev.coins : prev.coins - chestCost,
      gems: prev.gems + finalBonusGems,
      inventory: {
        ...prev.inventory,
        weapons: [...prev.inventory.weapons, ...items.filter(item => 'baseAtk' in item) as Weapon[]],
        armor: [...prev.inventory.armor, ...items.filter(item => 'baseDef' in item) as Armor[]],
      },
      statistics: {
        ...prev.statistics,
        chestsOpened: prev.statistics.chestsOpened + 1,
        gemsEarned: prev.statistics.gemsEarned + finalBonusGems,
      },
    }));

    checkAndUnlockAchievements();

    return chestReward;
  }, [gameState.coins, gameState.knowledgeStreak.multiplier, gameState.cheats.infiniteCoins, updateCollectionBook, checkAndUnlockAchievements]);

  const purchaseMythical = useCallback((): { item: Weapon | Armor; type: 'weapon' | 'armor' } | null => {
    const MYTHICAL_COST = 50000;
    if (gameState.coins < MYTHICAL_COST && !gameState.cheats.infiniteCoins) return null;

    const isWeapon = Math.random() < 0.5;
    const item = isWeapon ? generateMythicalWeapon() : generateMythicalArmor();
    const type = isWeapon ? 'weapon' : 'armor';

    updateCollectionBook(item);

    setGameState(prev => ({
      ...prev,
      coins: prev.cheats.infiniteCoins ? prev.coins : prev.coins - MYTHICAL_COST,
      inventory: {
        ...prev.inventory,
        weapons: isWeapon ? [...prev.inventory.weapons, item as Weapon] : prev.inventory.weapons,
        armor: !isWeapon ? [...prev.inventory.armor, item as Armor] : prev.inventory.armor,
      },
      statistics: {
        ...prev.statistics,
        itemsCollected: prev.statistics.itemsCollected + 1,
      },
    }));

    triggerVisualEffect('text', { text: 'Mythical Item Acquired!', color: 'text-red-400' });
    checkAndUnlockAchievements();

    return { item, type };
  }, [gameState.coins, gameState.cheats.infiniteCoins, updateCollectionBook, triggerVisualEffect, checkAndUnlockAchievements]);

  const startCombat = useCallback(() => {
    let enemy = generateEnemy(gameState.zone);
    
    if (gameState.gameMode.current === 'crazy') {
      enemy = {
        ...enemy,
        hp: enemy.hp * 3,
        maxHp: enemy.maxHp * 3,
        atk: enemy.atk * 3,
        def: enemy.def * 2,
      };
    }
    
    setGameState(prev => ({
      ...prev,
      currentEnemy: enemy,
      inCombat: true,
      playerStats: { 
        ...prev.playerStats, 
        hp: prev.playerStats.maxHp
      },
      combatLog: [`You encounter a ${enemy.name} in Zone ${enemy.zone}!`],
    }));
  }, [gameState.zone, gameState.gameMode.current]);

  const attack = useCallback((hit: boolean, category?: string) => {
    setGameState(prev => {
      if (!prev.currentEnemy || !prev.inCombat) return prev;

      if (category) {
        updateStatistics(category, hit);
      }
      updateKnowledgeStreak(hit);

      let newCombatLog = [...prev.combatLog];
      let newPlayerHp = prev.playerStats.hp;
      let newEnemyHp = prev.currentEnemy.hp;
      let combatEnded = false;
      let playerWon = false;

      if (hit) {
        let baseDamage = Math.max(1, prev.playerStats.atk - prev.currentEnemy.def);
        let finalDamage = baseDamage;

        // Reduce durability of equipped items
        const updatedInventory = { ...prev.inventory };
        if (updatedInventory.currentWeapon && updatedInventory.currentWeapon.durability > 0) {
          updatedInventory.currentWeapon = {
            ...updatedInventory.currentWeapon,
            durability: Math.max(0, updatedInventory.currentWeapon.durability - 1)
          };
          updatedInventory.weapons = updatedInventory.weapons.map(w => 
            w.id === updatedInventory.currentWeapon?.id ? updatedInventory.currentWeapon : w
          );
        }
        if (updatedInventory.currentArmor && updatedInventory.currentArmor.durability > 0) {
          updatedInventory.currentArmor = {
            ...updatedInventory.currentArmor,
            durability: Math.max(0, updatedInventory.currentArmor.durability - 1)
          };
          updatedInventory.armor = updatedInventory.armor.map(a => 
            a.id === updatedInventory.currentArmor?.id ? updatedInventory.currentArmor : a
          );
        }

        newEnemyHp = Math.max(0, prev.currentEnemy.hp - finalDamage);
        newCombatLog.push(`You deal ${finalDamage} damage to the ${prev.currentEnemy.name}!`);
        
        triggerVisualEffect('text', { text: `-${finalDamage}`, color: 'text-red-400' });
        
        // FIXED: Check if enemy is defeated immediately after taking damage
        if (newEnemyHp <= 0) {
          combatEnded = true;
          playerWon = true;
          newCombatLog.push(`You defeated the ${prev.currentEnemy.name}!`);
          
          // Handle victory rewards immediately
          let coinMultiplier = 1;
          let gemMultiplier = 1;
          
          switch (prev.gameMode.current) {
            case 'blitz':
              coinMultiplier = 1.25;
              gemMultiplier = 1.1;
              break;
            case 'crazy':
              coinMultiplier = 6;
              gemMultiplier = 6;
              break;
          }

          coinMultiplier *= prev.knowledgeStreak.multiplier;
          gemMultiplier *= prev.knowledgeStreak.multiplier;

          const baseCoins = prev.zone * 8 + Math.floor(Math.random() * 15);
          const baseGems = Math.floor(Math.random() * 3) + 1;
          
          const coinsEarned = Math.floor(baseCoins * coinMultiplier);
          const gemsEarned = Math.floor(baseGems * gemMultiplier);
          
          newCombatLog.push(`You earned ${coinsEarned} coins and ${gemsEarned} gems!`);
          
          const newZone = prev.zone + 1;
          const newIsPremium = newZone >= 50;
          
          return {
            ...prev,
            coins: prev.coins + coinsEarned,
            gems: prev.gems + gemsEarned,
            zone: newZone,
            isPremium: newIsPremium,
            currentEnemy: null,
            inCombat: false,
            combatLog: newCombatLog,
            inventory: updatedInventory,
            statistics: {
              ...prev.statistics,
              zonesReached: Math.max(prev.statistics.zonesReached, newZone),
              coinsEarned: prev.statistics.coinsEarned + coinsEarned,
              gemsEarned: prev.statistics.gemsEarned + gemsEarned,
            },
          };
        }

        return {
          ...prev,
          currentEnemy: { ...prev.currentEnemy, hp: newEnemyHp },
          playerStats: { ...prev.playerStats, hp: newPlayerHp },
          combatLog: newCombatLog,
          inventory: updatedInventory,
        };
      } else {
        const damage = Math.max(1, prev.currentEnemy.atk - prev.playerStats.def);
        newPlayerHp = Math.max(0, prev.playerStats.hp - damage);
        newCombatLog.push(`You missed! The ${prev.currentEnemy.name} deals ${damage} damage to you!`);
        
        triggerVisualEffect('shake');
        
        if (newPlayerHp <= 0) {
          combatEnded = true;
          playerWon = false;
          newCombatLog.push(`You were defeated by the ${prev.currentEnemy.name}...`);
          
          return {
            ...prev,
            currentEnemy: null,
            inCombat: false,
            combatLog: newCombatLog,
            playerStats: { ...prev.playerStats, hp: newPlayerHp },
          };
        }

        return {
          ...prev,
          currentEnemy: { ...prev.currentEnemy, hp: newEnemyHp },
          playerStats: { ...prev.playerStats, hp: newPlayerHp },
          combatLog: newCombatLog,
        };
      }
    });

    setTimeout(checkAndUnlockAchievements, 100);
  }, [updateStatistics, updateKnowledgeStreak, triggerVisualEffect, checkAndUnlockAchievements]);

  const resetGame = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      
      setGameState({
        ...initialGameState,
        achievements: initializeAchievements(),
        statistics: {
          ...initialStatistics,
          sessionStartTime: new Date(),
        },
      });
    } catch (error) {
      console.error('Error resetting game:', error);
    }
  }, []);

  return {
    gameState,
    isLoading,
    visualEffects,
    clearVisualEffect,
    equipWeapon,
    equipArmor,
    upgradeWeapon,
    upgradeArmor,
    sellWeapon,
    sellArmor,
    upgradeResearch,
    openChest,
    purchaseMythical,
    startCombat,
    attack,
    resetGame,
    setGameMode,
    toggleCheat,
    generateCheatItem,
    checkAndUnlockAchievements,
    mineGem,
    purchaseMiningTool,
    redeemPromoCode,
    discardItem,
  };
};