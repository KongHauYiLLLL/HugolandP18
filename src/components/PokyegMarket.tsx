import React, { useState } from 'react';
import { Weapon, Armor } from '../types/game';
import { Skull, Coins, X, Sparkles, AlertTriangle } from 'lucide-react';
import { getRarityColor, getRarityBorder, getRarityGlow } from '../utils/gameUtils';

interface PokyegMarketProps {
  coins: number;
  onPurchaseMythical: () => { item: Weapon | Armor; type: 'weapon' | 'armor' } | null;
  onClose: () => void;
}

export const PokyegMarket: React.FC<PokyegMarketProps> = ({ 
  coins, 
  onPurchaseMythical, 
  onClose 
}) => {
  const [lastPurchase, setLastPurchase] = useState<{ item: Weapon | Armor; type: 'weapon' | 'armor' } | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const MYTHICAL_COST = 50000;

  const handlePurchase = async () => {
    if (coins < MYTHICAL_COST) return;
    
    setIsPurchasing(true);
    setLastPurchase(null);
    
    setTimeout(() => {
      const result = onPurchaseMythical();
      setLastPurchase(result);
      setIsPurchasing(false);
      if (result) {
        setShowPurchaseModal(true);
      }
    }, 2000);
  };

  const closePurchaseModal = () => {
    setShowPurchaseModal(false);
    setLastPurchase(null);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-red-900 via-black to-purple-900 p-4 sm:p-6 rounded-lg border-2 border-red-500/50 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl shadow-red-500/20">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Skull className="w-6 h-6 sm:w-8 sm:h-8 text-red-400 animate-pulse" />
              <div>
                <h2 className="text-white font-bold text-lg sm:text-xl">🏴‍☠️ Pokyeg Market</h2>
                <p className="text-red-300 text-sm">The Underground Black Market</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Warning Banner */}
          <div className="bg-red-900/50 border border-red-500/50 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-bold">⚠️ BLACK MARKET WARNING ⚠️</span>
            </div>
            <div className="text-red-300 text-sm space-y-1">
              <p>• Mythical items are EXTREMELY expensive</p>
              <p>• You cannot choose weapon or armor type</p>
              <p>• All sales are final - no refunds</p>
              <p>• Items are obtained through... questionable means</p>
            </div>
          </div>

          {/* Market Description */}
          <div className="bg-black/40 p-4 rounded-lg mb-6">
            <h3 className="text-white font-bold mb-2">Welcome to the Shadows...</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Greetings, adventurer. You've found your way to the Pokyeg Market, where the impossible becomes possible... 
              for a price. Here, we deal in the rarest of artifacts - Mythical items that cannot be found anywhere else 
              in Hugoland. These items have been... acquired through special channels.
            </p>
          </div>

          {/* Current Coins */}
          <div className="bg-black/30 p-3 rounded-lg mb-6">
            <div className="flex items-center justify-center gap-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-semibold">Your Coins: {coins.toLocaleString()}</span>
            </div>
          </div>

          {/* Mythical Item Offer */}
          <div className="bg-gradient-to-br from-red-900/30 to-purple-900/30 border-2 border-red-500/50 p-6 rounded-lg mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-8 h-8 text-red-400 animate-pulse" />
                <h3 className="text-red-400 font-bold text-xl">Mystery Mythical Item</h3>
                <Sparkles className="w-8 h-8 text-red-400 animate-pulse" />
              </div>
              
              <div className="bg-black/50 p-4 rounded-lg mb-4">
                <p className="text-white text-lg mb-2">🎲 Random Mythical Item</p>
                <p className="text-gray-300 text-sm mb-3">
                  Could be a weapon or armor piece. All mythical items are guaranteed to be extremely powerful.
                </p>
                <div className="flex items-center justify-center gap-2 text-red-400 font-bold text-xl">
                  <Coins className="w-6 h-6" />
                  <span>{MYTHICAL_COST.toLocaleString()} Coins</span>
                </div>
              </div>

              <button
                onClick={handlePurchase}
                disabled={coins < MYTHICAL_COST || isPurchasing}
                className={`px-6 py-3 rounded-lg font-bold transition-all duration-200 text-sm sm:text-base ${
                  coins >= MYTHICAL_COST && !isPurchasing
                    ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white hover:from-red-500 hover:to-purple-500 hover:scale-105 shadow-lg shadow-red-500/30'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isPurchasing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Acquiring Item...
                  </div>
                ) : coins >= MYTHICAL_COST ? (
                  'Purchase Mystery Mythical'
                ) : (
                  `Need ${(MYTHICAL_COST - coins).toLocaleString()} More Coins`
                )}
              </button>
            </div>
          </div>

          {/* Purchasing Animation */}
          {isPurchasing && (
            <div className="text-center py-6">
              <div className="animate-pulse text-red-400 text-lg font-bold mb-2">
                🔮 Contacting underground suppliers...
              </div>
              <div className="text-gray-300 text-sm">
                This may take a moment. Quality mythical items are hard to come by.
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 mt-4">
            <p>The Pokyeg Market operates in the shadows of Hugoland.</p>
            <p>What happens in the black market, stays in the black market.</p>
          </div>
        </div>
      </div>

      {/* Purchase Result Modal */}
      {showPurchaseModal && lastPurchase && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-60 p-4">
          <div className="bg-gradient-to-br from-red-900 to-purple-900 p-4 sm:p-6 rounded-lg border border-red-500/50 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-bold text-lg">🎉 Mythical Acquired!</h3>
              <button
                onClick={closePurchaseModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className={`p-4 rounded-lg border-2 ${getRarityBorder('mythical')} ${getRarityGlow('mythical')} bg-black/40 mb-4`}>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-6 h-6 text-red-400 animate-pulse" />
                  <p className={`font-bold text-lg ${getRarityColor('mythical')}`}>
                    MYTHICAL
                  </p>
                  <Sparkles className="w-6 h-6 text-red-400 animate-pulse" />
                </div>
                <p className="text-white font-semibold text-xl mb-2">{lastPurchase.item.name}</p>
                <p className="text-gray-300 text-sm mb-3">
                  {lastPurchase.type === 'weapon' 
                    ? `ATK: ${(lastPurchase.item as Weapon).baseAtk}` 
                    : `DEF: ${(lastPurchase.item as Armor).baseDef}`}
                </p>
                <div className="text-xs text-gray-400">
                  <p>This item has been added to your inventory</p>
                  <p className="text-red-400 mt-1">🏴‍☠️ Acquired through the black market</p>
                </div>
              </div>
            </div>

            <button
              onClick={closePurchaseModal}
              className="w-full py-2 bg-gradient-to-r from-red-600 to-purple-600 text-white font-semibold rounded-lg hover:from-red-500 hover:to-purple-500 transition-all"
            >
              Excellent!
            </button>
          </div>
        </div>
      )}
    </>
  );
};