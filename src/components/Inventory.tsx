import React from 'react';
import { Inventory as InventoryType, Weapon, Armor } from '../types/game';
import { Sword, Shield, Gem, Star, Coins, Sparkles, Wrench } from 'lucide-react';
import { getRarityColor, getRarityBorder, getRarityGlow, getRepairCost } from '../utils/gameUtils';

interface InventoryProps {
  inventory: InventoryType;
  gems: number;
  onEquipWeapon: (weapon: Weapon) => void;
  onEquipArmor: (armor: Armor) => void;
  onUpgradeWeapon: (weaponId: string) => void;
  onUpgradeArmor: (armorId: string) => void;
  onSellWeapon: (weaponId: string) => void;
  onSellArmor: (armorId: string) => void;
}

export const Inventory: React.FC<InventoryProps> = ({
  inventory,
  gems,
  onEquipWeapon,
  onEquipArmor,
  onUpgradeWeapon,
  onUpgradeArmor,
  onSellWeapon,
  onSellArmor,
}) => {
  const getDurabilityColor = (durability: number, maxDurability: number) => {
    const percentage = durability / maxDurability;
    if (percentage > 0.7) return 'text-green-400';
    if (percentage > 0.3) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getDurabilityBarColor = (durability: number, maxDurability: number) => {
    const percentage = durability / maxDurability;
    if (percentage > 0.7) return 'bg-green-500';
    if (percentage > 0.3) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 sm:p-6 rounded-lg shadow-2xl">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Inventory</h2>
        <div className="flex items-center justify-center gap-2 text-purple-300">
          <Gem className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-semibold text-sm sm:text-base">{gems} Gems</span>
        </div>
      </div>

      {/* Currently Equipped */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-black/30 p-3 sm:p-4 rounded-lg border border-orange-500/50">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
            <Sword className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
            Equipped Weapon
          </h3>
          {inventory.currentWeapon ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <p className={`font-semibold text-sm sm:text-base ${getRarityColor(inventory.currentWeapon.rarity)}`}>
                  {inventory.currentWeapon.name}
                </p>
                {inventory.currentWeapon.isChroma && (
                  <Sparkles className="w-4 h-4 text-red-400 animate-pulse" />
                )}
              </div>
              <p className="text-white text-sm sm:text-base">ATK: {inventory.currentWeapon.baseAtk + (inventory.currentWeapon.level - 1) * 10}</p>
              <p className="text-gray-300 text-xs sm:text-sm">Level {inventory.currentWeapon.level}</p>
              
              {/* Durability */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300">Durability</span>
                  <span className={getDurabilityColor(inventory.currentWeapon.durability, inventory.currentWeapon.maxDurability)}>
                    {inventory.currentWeapon.durability}/{inventory.currentWeapon.maxDurability}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getDurabilityBarColor(inventory.currentWeapon.durability, inventory.currentWeapon.maxDurability)}`}
                    style={{ width: `${(inventory.currentWeapon.durability / inventory.currentWeapon.maxDurability) * 100}%` }}
                  />
                </div>
                {inventory.currentWeapon.durability < inventory.currentWeapon.maxDurability && (
                  <p className="text-xs text-yellow-400 mt-1">
                    <Wrench className="w-3 h-3 inline mr-1" />
                    Repair cost: {getRepairCost(inventory.currentWeapon)} gems
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No weapon equipped</p>
          )}
        </div>

        <div className="bg-black/30 p-3 sm:p-4 rounded-lg border border-blue-500/50">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            Equipped Armor
          </h3>
          {inventory.currentArmor ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <p className={`font-semibold text-sm sm:text-base ${getRarityColor(inventory.currentArmor.rarity)}`}>
                  {inventory.currentArmor.name}
                </p>
                {inventory.currentArmor.isChroma && (
                  <Sparkles className="w-4 h-4 text-red-400 animate-pulse" />
                )}
              </div>
              <p className="text-white text-sm sm:text-base">DEF: {inventory.currentArmor.baseDef + (inventory.currentArmor.level - 1) * 5}</p>
              <p className="text-gray-300 text-xs sm:text-sm">Level {inventory.currentArmor.level}</p>
              
              {/* Durability */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300">Durability</span>
                  <span className={getDurabilityColor(inventory.currentArmor.durability, inventory.currentArmor.maxDurability)}>
                    {inventory.currentArmor.durability}/{inventory.currentArmor.maxDurability}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getDurabilityBarColor(inventory.currentArmor.durability, inventory.currentArmor.maxDurability)}`}
                    style={{ width: `${(inventory.currentArmor.durability / inventory.currentArmor.maxDurability) * 100}%` }}
                  />
                </div>
                {inventory.currentArmor.durability < inventory.currentArmor.maxDurability && (
                  <p className="text-xs text-yellow-400 mt-1">
                    <Wrench className="w-3 h-3 inline mr-1" />
                    Repair cost: {getRepairCost(inventory.currentArmor)} gems
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No armor equipped</p>
          )}
        </div>
      </div>

      {/* Weapons */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
          <Sword className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
          Weapons ({inventory.weapons.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 max-h-64 sm:max-h-80 overflow-y-auto">
          {inventory.weapons.map((weapon) => (
            <div 
              key={weapon.id} 
              className={`bg-black/40 p-3 sm:p-4 rounded-lg border-2 ${getRarityBorder(weapon.rarity)} ${getRarityGlow(weapon.rarity)} ${weapon.isChroma ? 'animate-pulse' : ''}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`font-semibold text-sm sm:text-base truncate ${getRarityColor(weapon.rarity)}`}>
                      {weapon.name}
                    </p>
                    {weapon.isChroma && (
                      <Sparkles className="w-4 h-4 text-red-400 animate-pulse" />
                    )}
                  </div>
                  <p className="text-white text-sm sm:text-base mb-1">
                    ATK: {weapon.baseAtk + (weapon.level - 1) * 10}
                  </p>
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-300 mb-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                    Level {weapon.level}
                  </div>
                  
                  {/* Durability */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">Durability</span>
                      <span className={getDurabilityColor(weapon.durability, weapon.maxDurability)}>
                        {weapon.durability}/{weapon.maxDurability}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full transition-all duration-300 ${getDurabilityBarColor(weapon.durability, weapon.maxDurability)}`}
                        style={{ width: `${(weapon.durability / weapon.maxDurability) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-yellow-400">
                    <Coins className="w-3 h-3 sm:w-4 sm:h-4" />
                    Sell: {weapon.sellPrice}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => onEquipWeapon(weapon)}
                  disabled={inventory.currentWeapon?.id === weapon.id}
                  className={`px-3 py-2 text-sm rounded font-semibold transition-all ${
                    inventory.currentWeapon?.id === weapon.id
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-orange-600 text-white hover:bg-orange-500'
                  }`}
                >
                  {inventory.currentWeapon?.id === weapon.id ? 'Equipped' : 'Equip'}
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => onUpgradeWeapon(weapon.id)}
                    disabled={gems < weapon.upgradeCost}
                    className={`flex-1 px-2 py-1 text-xs rounded font-semibold transition-all flex items-center gap-1 justify-center ${
                      gems >= weapon.upgradeCost
                        ? 'bg-purple-600 text-white hover:bg-purple-500'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Gem className="w-3 h-3" />
                    {weapon.upgradeCost}
                  </button>
                  <button
                    onClick={() => onSellWeapon(weapon.id)}
                    disabled={inventory.currentWeapon?.id === weapon.id}
                    className={`flex-1 px-2 py-1 text-xs rounded font-semibold transition-all ${
                      inventory.currentWeapon?.id === weapon.id
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-500'
                    }`}
                  >
                    Sell
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Armor */}
      <div>
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
          Armor ({inventory.armor.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 max-h-64 sm:max-h-80 overflow-y-auto">
          {inventory.armor.map((armor) => (
            <div 
              key={armor.id} 
              className={`bg-black/40 p-3 sm:p-4 rounded-lg border-2 ${getRarityBorder(armor.rarity)} ${getRarityGlow(armor.rarity)} ${armor.isChroma ? 'animate-pulse' : ''}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`font-semibold text-sm sm:text-base truncate ${getRarityColor(armor.rarity)}`}>
                      {armor.name}
                    </p>
                    {armor.isChroma && (
                      <Sparkles className="w-4 h-4 text-red-400 animate-pulse" />
                    )}
                  </div>
                  <p className="text-white text-sm sm:text-base mb-1">
                    DEF: {armor.baseDef + (armor.level - 1) * 5}
                  </p>
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-300 mb-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                    Level {armor.level}
                  </div>
                  
                  {/* Durability */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">Durability</span>
                      <span className={getDurabilityColor(armor.durability, armor.maxDurability)}>
                        {armor.durability}/{armor.maxDurability}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full transition-all duration-300 ${getDurabilityBarColor(armor.durability, armor.maxDurability)}`}
                        style={{ width: `${(armor.durability / armor.maxDurability) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-yellow-400">
                    <Coins className="w-3 h-3 sm:w-4 sm:h-4" />
                    Sell: {armor.sellPrice}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => onEquipArmor(armor)}
                  disabled={inventory.currentArmor?.id === armor.id}
                  className={`px-3 py-2 text-sm rounded font-semibold transition-all ${
                    inventory.currentArmor?.id === armor.id
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-500'
                  }`}
                >
                  {inventory.currentArmor?.id === armor.id ? 'Equipped' : 'Equip'}
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => onUpgradeArmor(armor.id)}
                    disabled={gems < armor.upgradeCost}
                    className={`flex-1 px-2 py-1 text-xs rounded font-semibold transition-all flex items-center gap-1 justify-center ${
                      gems >= armor.upgradeCost
                        ? 'bg-purple-600 text-white hover:bg-purple-500'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Gem className="w-3 h-3" />
                    {armor.upgradeCost}
                  </button>
                  <button
                    onClick={() => onSellArmor(armor.id)}
                    disabled={inventory.currentArmor?.id === armor.id}
                    className={`flex-1 px-2 py-1 text-xs rounded font-semibold transition-all ${
                      inventory.currentArmor?.id === armor.id
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-500'
                    }`}
                  >
                    Sell
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};