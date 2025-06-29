import { GameState, PlayerStats, Inventory, Research, CollectionBook, KnowledgeStreak, GameMode, Statistics, CheatSettings, Mining } from '../types/game';
import { initializeAchievements } from '../utils/achievements';
import { initializePlayerTags } from '../utils/playerTags';
import { generateYojefMarketItems } from '../utils/gameUtils';

export const STORAGE_KEY = 'hugoland_game_state';

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
  relics: [],
  currentWeapon: null,
  currentArmor: null,
  equippedRelics: [],
};

const initialResearch: Research = {
  atk: { level: 0, totalSpent: 0 },
  def: { level: 0, totalSpent: 0 },
  hp: { level: 0, totalSpent: 0 },
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
  shinyGemsEarned: 0,
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
  totalShinyGemsMined: 0,
};

const initialPromoCodes = {
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

export const initialGameState: GameState = {
  coins: 100,
  gems: 0,
  shinyGems: 0,
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
  cheats: initialCheats,
  mining: initialMining,
  promoCodes: initialPromoCodes,
  yojefMarket: {
    items: generateYojefMarketItems(),
    lastRefresh: new Date(),
    nextRefresh: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
  },
  playerTags: initializePlayerTags(),
};