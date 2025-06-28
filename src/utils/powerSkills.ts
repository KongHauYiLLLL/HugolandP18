import { PowerSkill } from '../types/game';

export const getPowerSkillForTier = (tier: number): PowerSkill | null => {
  const powerSkills: { [key: number]: PowerSkill } = {
    1: {
      id: 'healing_touch',
      name: 'Healing Touch',
      description: 'Restore 10% HP every 3 rounds',
      rarity: 'common',
      tier: 1,
      isActive: true,
      effect: {
        type: 'heal',
        value: 0.1,
        duration: 3
      }
    },
    2: {
      id: 'life_steal',
      name: 'Life Steal',
      description: 'Heal for 20% of damage dealt',
      rarity: 'rare',
      tier: 2,
      isActive: true,
      effect: {
        type: 'vampire',
        value: 0.2
      }
    },
    3: {
      id: 'poison_dart_frog',
      name: 'Poison Dart Frog',
      description: 'Deals 5% of ATK to enemy every round',
      rarity: 'epic',
      tier: 3,
      isActive: true,
      effect: {
        type: 'poison',
        value: 0.05
      }
    },
    4: {
      id: 'guardian_angel',
      name: 'Guardian Angel',
      description: 'All damage dealt to player is reflected back to enemy every 5 rounds',
      rarity: 'legendary',
      tier: 4,
      isActive: true,
      effect: {
        type: 'guardian',
        duration: 5
      }
    },
    5: {
      id: 'royal_crown',
      name: 'Royal Crown',
      description: 'All stats +50%',
      rarity: 'mythical',
      tier: 5,
      isActive: true,
      effect: {
        type: 'crown',
        value: 50
      }
    }
  };

  return powerSkills[tier] || null;
};