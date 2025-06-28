import React from 'react';
import { Research as ResearchType, PowerSkill } from '../types/game';
import { Brain, TrendingUp, Star, Crown, Coins, Zap } from 'lucide-react';
import { calculateResearchBonus, calculateResearchCost } from '../utils/gameUtils';

interface ResearchProps {
  research: ResearchType;
  coins: number;
  onUpgradeResearch: () => void;
  isPremium: boolean;
  powerSkills: PowerSkill[];
}

export const Research: React.FC<ResearchProps> = ({ research, coins, onUpgradeResearch, isPremium, powerSkills }) => {
  const researchCost = calculateResearchCost(research.level, research.tier);
  const currentBonus = calculateResearchBonus(research.level, research.tier);
  const nextBonus = calculateResearchBonus(research.level + 1, research.tier);
  const progressInTier = research.level % 10;
  const nextTierAt = (research.tier + 1) * 10;

  const renderResearchTree = () => {
    const nodes = [];
    const currentTierStart = research.tier * 10;
    
    for (let i = 0; i < 10; i++) {
      const nodeLevel = currentTierStart + i + 1;
      const isUnlocked = research.level >= nodeLevel;
      const isCurrent = research.level === nodeLevel - 1;
      
      nodes.push(
        <div
          key={i}
          className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
            isUnlocked
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 border-blue-400 shadow-lg shadow-blue-500/30'
              : isCurrent
              ? 'bg-gradient-to-br from-yellow-500 to-orange-500 border-yellow-400 shadow-lg shadow-yellow-500/30 animate-pulse'
              : 'bg-gray-700 border-gray-600'
          }`}
        >
          <span className={`font-bold text-xs sm:text-sm ${
            isUnlocked || isCurrent ? 'text-white' : 'text-gray-400'
          }`}>
            {i + 1}
          </span>
          
          {/* Connection lines */}
          {i < 9 && (
            <div className={`absolute left-full top-1/2 w-4 sm:w-6 h-0.5 -translate-y-1/2 ${
              research.level > nodeLevel ? 'bg-blue-400' : 'bg-gray-600'
            }`} />
          )}
        </div>
      );
    }
    
    return (
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 p-4 bg-black/20 rounded-lg">
        {nodes}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-4 sm:p-6 rounded-lg shadow-2xl">
      <div className="text-center mb-4 sm:mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-white">Research Laboratory</h2>
          {isPremium && <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />}
        </div>
        <p className="text-blue-300 text-sm sm:text-base">Unlock the power of knowledge and gain Power Skills</p>
      </div>

      {/* Research Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-black/30 p-3 sm:p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
            <span className="text-white font-semibold text-sm sm:text-base">Research Level</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-green-400">{research.level}</p>
        </div>

        <div className="bg-black/30 p-3 sm:p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
            <span className="text-white font-semibold text-sm sm:text-base">Current Tier</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-purple-400">{research.tier + 1}</p>
        </div>

        <div className="bg-black/30 p-3 sm:p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
            <span className="text-white font-semibold text-sm sm:text-base">Total Bonus</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-yellow-400">+{currentBonus}%</p>
        </div>
      </div>

      {/* Power Skills Display */}
      {powerSkills.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <h3 className="text-white font-semibold mb-3 text-center text-sm sm:text-base flex items-center justify-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Unlocked Power Skills
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {powerSkills.map((skill) => (
              <div
                key={skill.id}
                className={`p-3 rounded-lg border-2 ${
                  skill.rarity === 'mythical' ? 'border-red-500 bg-red-900/20' :
                  skill.rarity === 'legendary' ? 'border-yellow-500 bg-yellow-900/20' :
                  skill.rarity === 'epic' ? 'border-purple-500 bg-purple-900/20' :
                  skill.rarity === 'rare' ? 'border-blue-500 bg-blue-900/20' :
                  'border-gray-500 bg-gray-900/20'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    skill.rarity === 'mythical' ? 'bg-red-600 text-white' :
                    skill.rarity === 'legendary' ? 'bg-yellow-600 text-white' :
                    skill.rarity === 'epic' ? 'bg-purple-600 text-white' :
                    skill.rarity === 'rare' ? 'bg-blue-600 text-white' :
                    'bg-gray-600 text-white'
                  }`}>
                    {skill.rarity.toUpperCase()}
                  </span>
                  <span className="text-gray-400 text-xs">Tier {skill.tier}</span>
                </div>
                <h4 className="text-white font-semibold text-sm mb-1">{skill.name}</h4>
                <p className="text-gray-300 text-xs">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Research Tree */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-white font-semibold mb-3 text-center text-sm sm:text-base">
          Tier {research.tier + 1} Research Tree
        </h3>
        {renderResearchTree()}
        
        {progressInTier === 9 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-purple-900 to-pink-900 rounded-lg border border-purple-500">
            <p className="text-center text-purple-300 font-semibold text-sm sm:text-base">
              🎉 Next upgrade unlocks Tier {research.tier + 2} with +15% bonus and a new Power Skill!
            </p>
          </div>
        )}
      </div>

      {/* Upgrade Section */}
      <div className="bg-black/40 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-white font-semibold text-sm sm:text-base">Next Research Level</p>
            <p className="text-gray-300 text-xs sm:text-sm">
              Bonus: +{currentBonus}% → +{nextBonus}%
            </p>
            <p className="text-blue-300 text-xs">
              Cost resets to 150 at new tier
            </p>
            {progressInTier === 9 && (
              <p className="text-yellow-300 text-xs font-bold">
                ⚡ New Power Skill at next tier!
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 text-yellow-300">
            <Coins className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-semibold text-sm sm:text-base">{researchCost}</span>
          </div>
        </div>

        <button
          onClick={onUpgradeResearch}
          disabled={coins < researchCost}
          className={`w-full py-2 sm:py-3 rounded-lg font-bold transition-all duration-200 text-sm sm:text-base ${
            coins >= researchCost
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 hover:scale-105 shadow-lg'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {coins >= researchCost ? 'Upgrade Research' : 'Insufficient Coins'}
        </button>

        <div className="mt-3 text-center">
          <p className="text-xs sm:text-sm text-gray-300">
            Research boosts ATK, DEF, and HP by the bonus percentage
          </p>
          <p className="text-xs text-gray-400">
            Every 10 levels grants an additional 15% bonus and unlocks a new Power Skill
          </p>
        </div>
      </div>
    </div>
  );
};