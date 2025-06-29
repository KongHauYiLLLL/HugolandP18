import { useState, useCallback, useEffect } from 'react';
import { GameState, PlayerStats, Inventory, Enemy, Weapon, Armor, ChestReward, Research, Achievement, CollectionBook, KnowledgeStreak, GameMode, Statistics, CheatSettings, Mining, RelicItem, PlayerTag } from '../types/game';
import { generateWeapon, generateArmor, generateEnemy, generateMythicalWeapon, generateMythicalArmor, calculateResearchBonus, calculateResearchCost, getChestRarityWeights, generateRelicItem, canRepairWithAnvil, repairWithAnvil, canResetItem, resetItem } from '../utils/gameUtils';
import { checkAchievements, initializeAchievements } from '../utils/achievements';
import { checkPlayerTags, initializePlayerTags } from '../utils/playerTags';
import { initialGameState, STORAGE_KEY } from '../data/gameInitialState';
import { useGameStateActions } from './useGameStateActions';
import { useGameStateEffects } from './useGameStateEffects';
import { useVisualEffects } from './useVisualEffects';
import AsyncStorage from '../utils/storage';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [isLoading, setIsLoading] = useState(true);
  
  const { visualEffects, triggerVisualEffect, clearVisualEffect } = useVisualEffects();
  
  // Load game state from storage
  useEffect(() => {
    const loadGameState = async () => {
      setIsLoading(true);
      
      try {
        const savedState = await AsyncStorage.getItem(STORAGE_KEY);
        
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          
          // Ensure research object is properly initialized
          const research = {
            atk: {
              level: parsedState.research?.atk?.level || 0,
              totalSpent: parsedState.research?.atk?.totalSpent || 0,
            },
            def: {
              level: parsedState.research?.def?.level || 0,
              totalSpent: parsedState.research?.def?.totalSpent || 0,
            },
            hp: {
              level: parsedState.research?.hp?.level || 0,
              totalSpent: parsedState.research?.hp?.totalSpent || 0,
            },
          };
          
          setGameState({
            ...initialGameState,
            ...parsedState,
            currentEnemy: null,
            inCombat: false,
            combatLog: [],
            achievements: parsedState.achievements || initializeAchievements(),
            collectionBook: parsedState.collectionBook || initialGameState.collectionBook,
            knowledgeStreak: parsedState.knowledgeStreak || initialGameState.knowledgeStreak,
            gameMode: parsedState.gameMode || initialGameState.gameMode,
            statistics: {
              ...initialGameState.statistics,
              ...parsedState.statistics,
              sessionStartTime: new Date(),
            },
            research: research,
            isPremium: parsedState.isPremium || parsedState.zone >= 50,
            cheats: parsedState.cheats || initialGameState.cheats,
            mining: parsedState.mining || initialGameState.mining,
            promoCodes: parsedState.promoCodes || initialGameState.promoCodes,
            yojefMarket: parsedState.yojefMarket || initialGameState.yojefMarket,
            playerTags: parsedState.playerTags || initializePlayerTags(),
            shinyGems: parsedState.shinyGems || 0,
            inventory: {
              ...initialGameState.inventory,
              ...parsedState.inventory,
              weapons: parsedState.inventory?.weapons || [],
              armor: parsedState.inventory?.armor || [],
              relics: parsedState.inventory?.relics || [],
              equippedRelics: parsedState.inventory?.equippedRelics || [],
            },
          });
        } else {
          setGameState({
            ...initialGameState,
            achievements: initializeAchievements(),
            statistics: {
              ...initialGameState.statistics,
              sessionStartTime: new Date(),
            },
            playerTags: initializePlayerTags(),
          });
        }
      } catch (error) {
        console.error('Error loading game state:', error);
        setGameState({
          ...initialGameState,
          achievements: initializeAchievements(),
          statistics: {
            ...initialGameState.statistics,
            sessionStartTime: new Date(),
          },
          playerTags: initializePlayerTags(),
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

  // Use effects hook for timers and intervals
  useGameStateEffects(setGameState);

  // Use actions hook for all game actions
  const actions = useGameStateActions(
    gameState,
    setGameState,
    triggerVisualEffect,
    checkAchievements,
    checkPlayerTags
  );

  return {
    gameState,
    isLoading,
    visualEffects,
    clearVisualEffect,
    ...actions,
  };
};