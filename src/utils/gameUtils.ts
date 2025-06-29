import { Weapon, Armor, Enemy, RelicItem } from '../types/game';

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

const relicNames = {
  weapons: [
    'Ancient Blade of Yojef',
    'Primordial Sword',
    'Relic of the First War',
    'Eternal Flame Sword',
    'Void Touched Blade',
    'Starfall Weapon',
    'Temporal Slicer',
    'Reality Breaker'
  ],
  armor: [
    'Guardian\'s Ancient Shield',
    'Primordial Armor',
    'Relic of Protection',
    'Eternal Barrier',
    'Void Touched Guard',
    'Starfall Aegis',
    'Temporal Ward',
    'Reality Defender'
  ]
};

const enemyNames = [
  'Goblin Warrior', 'Shadow Wolf', 'Stone Golem', 'Fire Imp',
  'Ice Troll', 'Dark Mage', 'Lightning Drake', 'Void Wraith',
  'Crystal Beast', 'Ancient Dragon', 'Chaos Lord', 'Nightmare King',
  'Abyssal Terror', 'Cosmic Horror', 'Reality Bender', 'Dimension Lord',
  'Eternal Guardian', 'Void Emperor', 'Chaos Incarnate', 'Reality Destroyer'
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

export const generateWeapon = (forceChroma = false, forceRarity?: string, forceEnchanted = false): Weapon => {
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
  let baseAtk = baseAtkMap[rarity] + Math.floor(Math.random() * 10);
  
  // Check for enchantment (5% chance or forced)
  const isEnchanted = forceEnchanted || Math.random() < 0.05;
  let enchantmentMultiplier = 1;
  
  if (isEnchanted) {
    enchantmentMultiplier = 2;
    baseAtk *= 2;
  }
  
  const sellPrice = Math.floor(baseAtk * 0.5); // 25% of original cost calculation
  const maxDurability = getDurabilityByRarity(rarity);

  return {
    id: Math.random().toString(36).substr(2, 9),
    name: isEnchanted ? `Enchanted ${name}` : name,
    rarity,
    baseAtk,
    level: 1,
    upgradeCost: upgradeCostMap[rarity],
    sellPrice,
    isChroma: false,
    durability: maxDurability,
    maxDurability,
    isEnchanted,
    enchantmentMultiplier,
  };
};

export const generateArmor = (forceChroma = false, forceRarity?: string, forceEnchanted = false): Armor => {
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
  let baseDef = baseDefMap[rarity] + Math.floor(Math.random() * 5);
  
  // Check for enchantment (5% chance or forced)
  const isEnchanted = forceEnchanted || Math.random() < 0.05;
  let enchantmentMultiplier = 1;
  
  if (isEnchanted) {
    enchantmentMultiplier = 2;
    baseDef *= 2;
  }
  
  const sellPrice = Math.floor(baseDef * 0.75); // 25% of original cost calculation
  const maxDurability = getDurabilityByRarity(rarity);

  return {
    id: Math.random().toString(36).substr(2, 9),
    name: isEnchanted ? `Enchanted ${name}` : name,
    rarity,
    baseDef,
    level: 1,
    upgradeCost: upgradeCostMap[rarity],
    sellPrice,
    isChroma: false,
    durability: maxDurability,
    maxDurability,
    isEnchanted,
    enchantmentMultiplier,
  };
};

export const generateRelicItem = (): RelicItem => {
  const isWeapon = Math.random() < 0.5;
  const names = isWeapon ? relicNames.weapons : relicNames.armor;
  const name = names[Math.floor(Math.random() * names.length)];
  
  if (isWeapon) {
    const baseAtk = 80 + Math.floor(Math.random() * 40); // 80-120 ATK
    return {
      id: Math.random().toString(36).substr(2, 9),
      name,
      type: 'weapon',
      baseAtk,
      level: 1,
      upgradeCost: 25,
      cost: baseAtk * 5,
      description: 'A powerful relic weapon from ancient times'
    };
  } else {
    const baseDef = 60 + Math.floor(Math.random() * 30); // 60-90 DEF
    return {
      id: Math.random().toString(36).substr(2, 9),
      name,
      type: 'armor',
      baseDef,
      level: 1,
      upgradeCost: 25,
      cost: baseDef * 5,
      description: 'A powerful relic armor from ancient times'
    };
  }
};

export const generateMythicalWeapon = (): Weapon => {
  return generateWeapon(false, 'mythical');
};

export const generateMythicalArmor = (): Armor => {
  return generateArmor(false, 'mythical');
};

export const generateEnemy = (zone: number): Enemy => {
  const nameIndex = Math.min(Math.floor((zone - 1) / 5), enemyNames.length - 1);
  const name = enemyNames[nameIndex];
  
  // Infinite scaling formula
  let hp = 200 + (zone * 15);
  let atk = 20 + (zone * 8);
  let def = Math.floor(zone * 2);
  
  // Exponential scaling for higher zones
  if (zone >= 10) {
    hp = Math.floor(hp * Math.pow(1.1, zone - 10));
    atk = Math.floor(atk * Math.pow(1.08, zone - 10));
    def = Math.floor(def * Math.pow(1.05, zone - 10));
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
    canDropItems: zone >= 10,
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

export const calculateResearchBonus = (level: number): number => {
  return level * 10; // 10% per level
};

export const calculateResearchCost = (level: number): number => {
  return 100 + (level * 25); // Increasing cost
};

export const canRepairWithAnvil = (item1: Weapon | Armor, item2: Weapon | Armor): boolean => {
  return item1.name === item2.name && 
         item1.rarity === item2.rarity && 
         item1.id !== item2.id;
};

export const repairWithAnvil = (item1: Weapon | Armor, item2: Weapon | Armor): Weapon | Armor => {
  const repairedItem = { ...item1 };
  repairedItem.durability = Math.min(
    repairedItem.maxDurability,
    item1.durability + item2.durability
  );
  return repairedItem;
};

export const canResetItem = (items: (Weapon | Armor)[], targetItem: Weapon | Armor): boolean => {
  const sameTypeAndRarity = items.filter(item => 
    item.rarity === targetItem.rarity &&
    ('baseAtk' in item) === ('baseAtk' in targetItem) &&
    item.id !== targetItem.id
  );
  return sameTypeAndRarity.length >= 2;
};

export const resetItem = (targetItem: Weapon | Armor): Weapon | Armor => {
  const resetItem = { ...targetItem };
  resetItem.durability = resetItem.maxDurability;
  resetItem.level = 1;
  resetItem.upgradeCost = ('baseAtk' in resetItem) ? 
    { common: 5, rare: 10, epic: 20, legendary: 40, mythical: 50 }[resetItem.rarity] :
    { common: 5, rare: 10, epic: 20, legendary: 40, mythical: 50 }[resetItem.rarity];
  return resetItem;
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