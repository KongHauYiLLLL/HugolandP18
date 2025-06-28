import { PlayerTag, GameState } from '../types/game';

export const tagDefinitions: Omit<PlayerTag, 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'gem_collector',
    name: 'Gem Collector',
    description: 'Collect 5000 gems total',
    icon: '💎',
    color: 'text-purple-400'
  },
  {
    id: 'zone_master',
    name: 'Zone Master',
    description: 'Reach Zone 100',
    icon: '🏔️',
    color: 'text-green-400'
  },
  {
    id: 'shiny_hunter',
    name: 'Shiny Hunter',
    description: 'Find 100 shiny gems',
    icon: '✨',
    color: 'text-yellow-400'
  },
  {
    id: 'relic_seeker',
    name: 'Relic Seeker',
    description: 'Own 5 relic items',
    icon: '🏺',
    color: 'text-orange-400'
  },
  {
    id: 'knowledge_master',
    name: 'Knowledge Master',
    description: 'Answer 1000 questions correctly',
    icon: '🧠',
    color: 'text-blue-400'
  },
  {
    id: 'enchanted_finder',
    name: 'Enchanted Finder',
    description: 'Find 10 enchanted items',
    icon: '🌟',
    color: 'text-cyan-400'
  }
];

export const checkPlayerTags = (gameState: GameState): PlayerTag[] => {
  const newUnlocks: PlayerTag[] = [];
  
  tagDefinitions.forEach(def => {
    const existing = gameState.playerTags.find(t => t.id === def.id);
    if (existing?.unlocked) return;

    let shouldUnlock = false;

    switch (def.id) {
      case 'gem_collector':
        shouldUnlock = gameState.statistics.gemsEarned >= 5000;
        break;
      case 'zone_master':
        shouldUnlock = gameState.zone >= 100;
        break;
      case 'shiny_hunter':
        shouldUnlock = gameState.statistics.shinyGemsEarned >= 100;
        break;
      case 'relic_seeker':
        shouldUnlock = gameState.inventory.relics.length >= 5;
        break;
      case 'knowledge_master':
        shouldUnlock = gameState.statistics.correctAnswers >= 1000;
        break;
      case 'enchanted_finder':
        const enchantedCount = [...gameState.inventory.weapons, ...gameState.inventory.armor]
          .filter(item => item.isEnchanted).length;
        shouldUnlock = enchantedCount >= 10;
        break;
    }

    if (shouldUnlock && !existing?.unlocked) {
      newUnlocks.push({
        ...def,
        unlocked: true,
        unlockedAt: new Date()
      });
    }
  });

  return newUnlocks;
};

export const initializePlayerTags = (): PlayerTag[] => {
  return tagDefinitions.map(def => ({
    ...def,
    unlocked: false
  }));
};