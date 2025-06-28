import { Weapon, Armor, Enemy } from '../types/game';

const weaponNames = {
  common: ['Rusty Sword', 'Wooden Club', 'Stone Axe', 'Iron Dagger'],
  rare: ['Steel Blade', 'Silver Mace', 'Enchanted Bow', 'Crystal Staff'],
  epic: ['Flamebrand', 'Frostbite', 'Thunder Strike', 'Shadow Cleaver'],
  legendary: ['Excalibur', 'Mjolnir', 'Gungnir', 'Durandal'],
  mythical: ['Void Reaper', 'Cosmic Blade', 'Reality Slicer', 'Dimension Cutter', 'Soul Harvester', 'Infinity Edge', 'Chaos Bringer', 'Eternal Destroyer'],
};

const armorNames = {
  common: ['Leather Vest', 'Cloth Robe', 'Wooden Shield', 'Iron Helm'],
  rare: ['Chainmail', 'Steel Plate', 'Mystic Cloak', 'Silver Guard'],
  epic: ['Dragon Scale', 'Phoenix Mail', 'Void Armor', 'Crystal Guard'],
  legendary: ['Divine Aegis', 'Eternal Plate', 'Shadowweave', 'Celestial Ward'],
  mythical: ['Abyssal Aegis', 'Stellar Fortress', 'Quantum Shield', 'Infinity Guard', 'Void Mantle', 'Cosmic Barrier', 'Reality Armor', 'Dimensional Cloak'],
};

const enemyNames = [
  'Goblin Warrior', 'Shadow Wolf', 'Stone Golem', 'Fire Imp',
  'Ice Troll', 'Dark Mage', 'Lightning Drake', 'Void Wraith',
  'Crystal Beast', 'Ancient Dragon', 'Chaos Lord', 'Nightmare King',
  'Abyssal Terror', 'Cosmic Horror', 'Reality Bender', 'Dimension Lord'
];

const getDurabilityByRarity = (rarity: string): number => {
  const durabilityMap = {
    common: 50,
    rare: 75,
    epic: 100,
    legendary: 150,
    mythical: 200
  };
  return durabilityMap[rarity as keyof typeof durabilityMap] || 50;
};

export const generateWeapon = (forceChroma = false, forceRarity?: string): Weapon => {
  let rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythical';
  
  if (forceRarity) {
    rarity = forceRarity as any;
  } else {
    const rarities = ['common', 'rare', 'epic', 'legendary', 'mythical'] as const;
    const weights = [40, 30, 20, 8, 2];
    const random = Math.random() * 100;
    
    rarity = 'common';
    let cumulative = 0;
    
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        rarity = rarities[i];
        break;
      }
    }
  }

  const names = weaponNames[rarity];
  const name = names[Math.floor(Math.random() * names.length)];
  
  const baseAtkMap = { common: 15, rare: 25, epic: 40, legendary: 60, mythical: 100 };
  const upgradeCostMap = { common: 5, rare: 10, epic: 20, legendary: 40, mythical: 50 };
  const baseAtk = baseAtkMap[rarity] + Math.floor(Math.random() * 10);
  const sellPrice = Math.floor(baseAtk * 2);
  const maxDurability = getDurabilityByRarity(rarity);

  return {
    id: Math.random().toString(36).substr(2, 9),
    name,
    rarity,
    baseAtk,
    level: 1,
    upgradeCost: upgradeCostMap[rarity],
    sellPrice,
    isChroma: false,
    durability: maxDurability,
    maxDurability,
  };
};

export const generateMythicalWeapon = (): Weapon => {
  const names = weaponNames.mythical;
  const name = names[Math.floor(Math.random() * names.length)];
  
  const baseAtk = 100 + Math.floor(Math.random() * 75);
  const sellPrice = Math.floor(baseAtk * 15);
  const maxDurability = getDurabilityByRarity('mythical');

  return {
    id: Math.random().toString(36).substr(2, 9),
    name,
    rarity: 'mythical',
    baseAtk,
    level: 1,
    upgradeCost: 50,
    sellPrice,
    isChroma: false,
    durability: maxDurability,
    maxDurability,
  };
};

export const generateArmor = (forceChroma = false, forceRarity?: string): Armor => {
  let rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythical';
  
  if (forceRarity) {
    rarity = forceRarity as any;
  } else {
    const rarities = ['common', 'rare', 'epic', 'legendary', 'mythical'] as const;
    const weights = [40, 30, 20, 8, 2];
    const random = Math.random() * 100;
    
    rarity = 'common';
    let cumulative = 0;
    
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        rarity = rarities[i];
        break;
      }
    }
  }

  const names = armorNames[rarity];
  const name = names[Math.floor(Math.random() * names.length)];
  
  const baseDefMap = { common: 8, rare: 15, epic: 25, legendary: 40, mythical: 70 };
  const upgradeCostMap = { common: 5, rare: 10, epic: 20, legendary: 40, mythical: 50 };
  const baseDef = baseDefMap[rarity] + Math.floor(Math.random() * 5);
  const sellPrice = Math.floor(baseDef * 3);
  const maxDurability = getDurabilityByRarity(rarity);

  return {
    id: Math.random().toString(36).substr(2, 9),
    name,
    rarity,
    baseDef,
    level: 1,
    upgradeCost: upgradeCostMap[rarity],
    sellPrice,
    isChroma: false,
    durability: maxDurability,
    maxDurability,
  };
};

export const generateMythicalArmor = (): Armor => {
  const names = armorNames.mythical;
  const name = names[Math.floor(Math.random() * names.length)];
  
  const baseDef = 70 + Math.floor(Math.random() * 45);
  const sellPrice = Math.floor(baseDef * 10);
  const maxDurability = getDurabilityByRarity('mythical');

  return {
    id: Math.random().toString(36).substr(2, 9),
    name,
    rarity: 'mythical',
    baseDef,
    level: 1,
    upgradeCost: 50,
    sellPrice,
    isChroma: false,
    durability: maxDurability,
    maxDurability,
  };
};

export const generateEnemy = (zone: number): Enemy => {
  const name = enemyNames[Math.min(zone - 1, enemyNames.length - 1)];
  
  let hp = 200 + (zone * 15);
  let atk = 20 + (zone * 8);
  let def = Math.floor(zone * 2);
  
  if (zone >= 10) {
    hp *= 2;
  }
  
  if (zone >= 30) {
    atk *= 2;
    def *= 2;
  }
  
  return {
    name,
    hp,
    maxHp: hp,
    atk,
    def,
    zone,
    isPoisoned: false,
    poisonTurns: 0,
  };
};

export const getChestRarityWeights = (chestCost: number): number[] => {
  // Returns weights for [common, rare, epic, legendary, mythical]
  if (chestCost >= 1000) {
    // Legendary chest - guaranteed legendary or mythical
    return [0, 0, 0, 70, 30];
  } else if (chestCost >= 400) {
    // Epic chest - guaranteed epic or better
    return [0, 0, 60, 30, 10];
  } else if (chestCost >= 150) {
    // Rare chest - guaranteed rare or better
    return [0, 50, 35, 13, 2];
  } else {
    // Basic chest - mostly common/rare
    return [60, 30, 8, 2, 0];
  }
};

export const getRarityColor = (rarity: string): string => {
  switch (rarity) {
    case 'common': return 'text-gray-400';
    case 'rare': return 'text-blue-400';
    case 'epic': return 'text-purple-400';
    case 'legendary': return 'text-yellow-400';
    case 'mythical': return 'text-red-600';
    default: return 'text-gray-400';
  }
};

export const getRarityBorder = (rarity: string): string => {
  switch (rarity) {
    case 'common': return 'border-gray-400';
    case 'rare': return 'border-blue-400';
    case 'epic': return 'border-purple-400';
    case 'legendary': return 'border-yellow-400';
    case 'mythical': return 'border-red-600';
    default: return 'border-gray-400';
  }
};

export const getRarityGlow = (rarity: string): string => {
  switch (rarity) {
    case 'common': return 'shadow-gray-500/20';
    case 'rare': return 'shadow-blue-500/30';
    case 'epic': return 'shadow-purple-500/40';
    case 'legendary': return 'shadow-yellow-500/50';
    case 'mythical': return 'shadow-red-600/60';
    default: return 'shadow-gray-500/20';
  }
};

export const calculateResearchBonus = (level: number, tier: number): number => {
  const baseBonus = level * 5;
  const tierBonus = tier * 15;
  return baseBonus + tierBonus;
};

export const calculateResearchCost = (level: number, tier: number): number => {
  const levelInTier = level % 10;
  return 150 + (levelInTier * 50);
};

export const repairItem = (item: Weapon | Armor, gemCost: number): Weapon | Armor => {
  return {
    ...item,
    durability: item.maxDurability
  };
};

export const getRepairCost = (item: Weapon | Armor): number => {
  const durabilityPercent = item.durability / item.maxDurability;
  const baseCost = Math.floor((1 - durabilityPercent) * 20);
  
  const rarityMultiplier = {
    common: 1,
    rare: 1.5,
    epic: 2,
    legendary: 3,
    mythical: 5
  };
  
  return Math.ceil(baseCost * rarityMultiplier[item.rarity]);
};