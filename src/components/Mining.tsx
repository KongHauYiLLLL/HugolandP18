import React, { useState, useEffect } from 'react';
import { Mining as MiningType, MiningTool } from '../types/game';
import { Pickaxe, Gem, Coins, Zap, Star, X } from 'lucide-react';

interface MiningProps {
  mining: MiningType;
  gems: number;
  onMineGem: (x: number, y: number) => boolean;
  onPurchaseTool: (toolId: string) => boolean;
}

interface GemNode {
  x: number;
  y: number;
  clicks: number;
  maxClicks: number;
  id: string;
}

export const Mining: React.FC<MiningProps> = ({ mining, gems, onMineGem, onPurchaseTool }) => {
  const [gemNodes, setGemNodes] = useState<GemNode[]>([]);
  const [showShop, setShowShop] = useState(false);
  const [lastMineTime, setLastMineTime] = useState(0);

  const GRID_SIZE = 5; // Changed from 8 to 5
  const MINE_COOLDOWN = 0; 

  // Generate new gem node
  const generateGemNode = () => {
    const newNode: GemNode = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
      clicks: 0,
      maxClicks: 1, // Changed to 1 click = 1 gem
      id: Math.random().toString(36).substr(2, 9),
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

    const success = onMineGem(x, y);
    if (success) {
      setGemNodes(prev => {
        const updated = prev.filter(node => node.id !== gemNode.id);
        // Add new gem node immediately
        updated.push(generateGemNode());
        return updated;
      });
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
                ? 'border-purple-400 bg-gradient-to-br from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 shadow-lg shadow-purple-500/30'
                : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
            }`}
          >
            {hasGem && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Gem className="w-4 h-4 sm:w-6 sm:h-6 text-purple-400 animate-pulse" />
              </div>
            )}
          </div>
        );
      }
    }
    return cells;
  };

  const miningTools: MiningTool[] = [
    {
      id: 'basic_pickaxe',
      name: 'Iron Pickaxe',
      description: '+1 mining efficiency',
      cost: 50,
      efficiency: 1,
      owned: mining.tools.basic_pickaxe || false,
    },
    {
      id: 'steel_pickaxe',
      name: 'Steel Pickaxe',
      description: '+2 mining efficiency',
      cost: 200,
      efficiency: 2,
      owned: mining.tools.steel_pickaxe || false,
    },
    {
      id: 'diamond_pickaxe',
      name: 'Diamond Pickaxe',
      description: '+3 mining efficiency',
      cost: 500,
      efficiency: 3,
      owned: mining.tools.diamond_pickaxe || false,
    },
    {
      id: 'mythical_pickaxe',
      name: 'Mythical Pickaxe',
      description: '+5 mining efficiency',
      cost: 1000,
      efficiency: 5,
      owned: mining.tools.mythical_pickaxe || false,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 p-4 sm:p-6 rounded-lg shadow-2xl">
      <div className="text-center mb-4 sm:mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Pickaxe className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-white">Gem Mining</h2>
        </div>
        <p className="text-gray-300 text-sm sm:text-base">Click gem nodes to mine them instantly!</p>
        
        <div className="flex items-center justify-center gap-4 mt-3">
          <div className="flex items-center gap-2 text-purple-300">
            <Gem className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-semibold text-sm sm:text-base">{gems} Gems</span>
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
        <p className="text-center text-gray-400 text-xs sm:text-sm mt-3">
          Purple gems appear randomly. Click once to mine 1 gem!
        </p>
      </div>

      {/* Mining Shop Button */}
      <div className="text-center">
        <button
          onClick={() => setShowShop(true)}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-bold rounded-lg hover:from-orange-500 hover:to-yellow-500 transition-all duration-200 flex items-center gap-2 mx-auto text-sm sm:text-base"
        >
          <Pickaxe className="w-4 h-4 sm:w-5 sm:h-5" />
          Mining Shop
        </button>
      </div>

      {/* Mining Shop Modal */}
      {showShop && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-orange-900 to-yellow-900 p-4 sm:p-6 rounded-lg border border-orange-500/50 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Pickaxe className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400" />
                <div>
                  <h2 className="text-white font-bold text-lg sm:text-xl">Mining Shop</h2>
                  <p className="text-orange-300 text-sm">Upgrade your mining tools</p>
                </div>
              </div>
              <button
                onClick={() => setShowShop(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {miningTools.map((tool) => (
                <div
                  key={tool.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    tool.owned
                      ? 'border-green-500 bg-green-900/30'
                      : 'border-orange-500/50 bg-black/30'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Pickaxe className="w-5 h-5 text-orange-400" />
                    <h3 className="text-white font-semibold text-sm sm:text-base">{tool.name}</h3>
                    {tool.owned && <Star className="w-4 h-4 text-green-400" />}
                  </div>
                  
                  <p className="text-gray-300 text-xs sm:text-sm mb-3">{tool.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-purple-300">
                      <Gem className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="font-semibold text-xs sm:text-sm">{tool.cost}</span>
                    </div>
                    
                    <button
                      onClick={() => onPurchaseTool(tool.id)}
                      disabled={tool.owned || gems < tool.cost}
                      className={`px-3 py-1 rounded font-semibold transition-all text-xs sm:text-sm ${
                        tool.owned
                          ? 'bg-green-600 text-white cursor-not-allowed'
                          : gems >= tool.cost
                          ? 'bg-orange-600 text-white hover:bg-orange-500'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {tool.owned ? 'Owned' : gems >= tool.cost ? 'Buy' : 'Need More Gems'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <p className="text-orange-300 text-xs sm:text-sm">
                Higher efficiency tools give you more gems per click!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};