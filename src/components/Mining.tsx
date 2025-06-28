import React, { useState, useEffect } from 'react';
import { Mining as MiningType } from '../types/game';
import { Gem, Coins, Zap, Star, X, Sparkles } from 'lucide-react';

interface MiningProps {
  mining: MiningType;
  gems: number;
  shinyGems: number;
  onMineGem: (x: number, y: number) => { gems: number; shinyGems: number } | null;
  onExchangeShinyGems: (amount: number) => boolean;
}

interface GemNode {
  x: number;
  y: number;
  clicks: number;
  maxClicks: number;
  id: string;
  isShiny: boolean;
}

export const Mining: React.FC<MiningProps> = ({ 
  mining, 
  gems, 
  shinyGems, 
  onMineGem, 
  onExchangeShinyGems 
}) => {
  const [gemNodes, setGemNodes] = useState<GemNode[]>([]);
  const [showShop, setShowShop] = useState(false);
  const [lastMineTime, setLastMineTime] = useState(0);

  const GRID_SIZE = 5;
  const MINE_COOLDOWN = 0;

  // Generate new gem node
  const generateGemNode = () => {
    const isShiny = Math.random() < 0.3; // 30% chance for shiny gem
    const newNode: GemNode = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
      clicks: 0,
      maxClicks: 1,
      id: Math.random().toString(36).substr(2, 9),
      isShiny,
    };
    return newNode;
  };

  // Initialize with one gem node
  useEffect(() => {
    if (gemNodes.length === 0) {
      setGemNodes([generateGemNode()]);
    }
  }, [gemNodes.length]);

  const handleCellClick = (x: number, y: number) => {
    const now = Date.now();
    if (now - lastMineTime < MINE_COOLDOWN) return;

    const gemNode = gemNodes.find(node => node.x === x && node.y === y);
    if (!gemNode) return;

    setLastMineTime(now);

    const result = onMineGem(x, y);
    if (result) {
      setGemNodes(prev => {
        const updated = prev.filter(node => node.id !== gemNode.id);
        // Add new gem node immediately
        updated.push(generateGemNode());
        return updated;
      });
    }
  };

  const handleExchange = (amount: number) => {
    const success = onExchangeShinyGems(amount);
    if (!success) {
      alert('Not enough shiny gems!');
    }
  };

  const renderMiningGrid = () => {
    const cells = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const gemNode = gemNodes.find(node => node.x === x && node.y === y);
        const hasGem = !!gemNode;

        cells.push(
          <div
            key={`${x}-${y}`}
            onClick={() => handleCellClick(x, y)}
            className={`aspect-square border-2 rounded-lg cursor-pointer transition-all duration-200 relative overflow-hidden ${
              hasGem
                ? gemNode?.isShiny
                  ? 'border-yellow-400 bg-gradient-to-br from-yellow-900 to-orange-900 hover:from-yellow-800 hover:to-orange-800 shadow-lg shadow-yellow-500/50'
                  : 'border-purple-400 bg-gradient-to-br from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 shadow-lg shadow-purple-500/30'
                : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
            }`}
          >
            {hasGem && (
              <div className="absolute inset-0 flex items-center justify-center">
                {gemNode?.isShiny ? (
                  <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-400 animate-pulse" />
                ) : (
                  <Gem className="w-4 h-4 sm:w-6 sm:h-6 text-purple-400 animate-pulse" />
                )}
              </div>
            )}
          </div>
        );
      }
    }
    return cells;
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 p-4 sm:p-6 rounded-lg shadow-2xl">
      <div className="text-center mb-4 sm:mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Gem className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-white">Gem Mining</h2>
        </div>
        <p className="text-gray-300 text-sm sm:text-base">Click gem nodes to mine them instantly!</p>
        
        <div className="flex items-center justify-center gap-4 mt-3">
          <div className="flex items-center gap-2 text-purple-300">
            <Gem className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-semibold text-sm sm:text-base">{gems} Gems</span>
          </div>
          <div className="flex items-center gap-2 text-yellow-300">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-semibold text-sm sm:text-base">{shinyGems} Shiny</span>
          </div>
          <div className="flex items-center gap-2 text-orange-300">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-semibold text-sm sm:text-base">Efficiency: {mining.efficiency}</span>
          </div>
        </div>
      </div>

      {/* Mining Grid */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-white font-semibold mb-3 text-center text-sm sm:text-base">Mining Area (5x5)</h3>
        <div className="grid grid-cols-5 gap-1 sm:gap-2 max-w-sm mx-auto">
          {renderMiningGrid()}
        </div>
        <div className="text-center text-gray-400 text-xs sm:text-sm mt-3 space-y-1">
          <p>Purple gems = 1 gem each | Golden gems = 10 gems each (30% chance)</p>
          <p>Click once to mine instantly!</p>
        </div>
      </div>

      {/* Exchange Shop Button */}
      <div className="text-center">
        <button
          onClick={() => setShowShop(true)}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold rounded-lg hover:from-yellow-500 hover:to-orange-500 transition-all duration-200 flex items-center gap-2 mx-auto text-sm sm:text-base"
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          Shiny Exchange
        </button>
      </div>

      {/* Exchange Shop Modal */}
      {showShop && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-yellow-900 to-orange-900 p-4 sm:p-6 rounded-lg border border-yellow-500/50 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
                <div>
                  <h2 className="text-white font-bold text-lg sm:text-xl">Shiny Exchange</h2>
                  <p className="text-yellow-300 text-sm">Convert shiny gems to regular gems</p>
                </div>
              </div>
              <button
                onClick={() => setShowShop(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-black/30 p-4 rounded-lg">
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                    <span className="text-white font-bold text-lg">Exchange Rate</span>
                  </div>
                  <p className="text-yellow-300 text-xl font-bold">1 Shiny Gem = 10 Regular Gems</p>
                </div>
                
                <div className="text-center mb-4">
                  <p className="text-white">You have: <span className="font-bold text-yellow-400">{shinyGems}</span> shiny gems</p>
                </div>

                <div className="space-y-3">
                  {[1, 5, 10].map(amount => (
                    <button
                      key={amount}
                      onClick={() => handleExchange(amount)}
                      disabled={shinyGems < amount}
                      className={`w-full py-2 rounded-lg font-semibold transition-all text-sm ${
                        shinyGems >= amount
                          ? 'bg-yellow-600 text-white hover:bg-yellow-500'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Exchange {amount} Shiny → {amount * 10} Gems
                    </button>
                  ))}
                  
                  {shinyGems > 0 && (
                    <button
                      onClick={() => handleExchange(shinyGems)}
                      className="w-full py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold rounded-lg hover:from-yellow-500 hover:to-orange-500 transition-all text-sm"
                    >
                      Exchange All ({shinyGems} → {shinyGems * 10} Gems)
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-yellow-300 text-xs">
                Shiny gems are rare and valuable! Use them wisely.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};