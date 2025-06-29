import React, { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { Combat } from './components/Combat';
import { Shop } from './components/Shop';
import { Inventory } from './components/Inventory';
import { PlayerStats } from './components/PlayerStats';
import { Research } from './components/Research';
import { Achievements } from './components/Achievements';
import { CollectionBook } from './components/CollectionBook';
import { Statistics } from './components/Statistics';
import { SettingsModal } from './components/SettingsModal';
import { PokyegMarket } from './components/PokyegMarket';
import { Tutorial } from './components/Tutorial';
import { CheatPanel } from './components/CheatPanel';
import { Mining } from './components/Mining';
import { PromoCode } from './components/PromoCode';
import { YojefMarket } from './components/YojefMarket';
import { FloatingIcons } from './components/FloatingIcons';
import { FloatingText, ScreenShake } from './components/VisualEffects';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { 
  Shield, Package, User, Play, RotateCcw, Brain, Crown, Trophy, Book, BarChart3, 
  Settings, Pickaxe, Gift, Skull, Coins, Gem, Sparkles, Zap, Star, TrendingUp 
} from 'lucide-react';

type ModalView = 'achievements' | 'collection' | 'statistics' | 'settings' | 'pokyegMarket' | 'tutorial' | 'cheats' | 'resetConfirm' | 'yojefMarket' | 'shop' | 'inventory' | 'research' | 'mining' | 'promo' | null;

function App() {
  const {
    gameState,
    isLoading,
    visualEffects,
    clearVisualEffect,
    equipWeapon,
    equipArmor,
    upgradeWeapon,
    upgradeArmor,
    sellWeapon,
    sellArmor,
    upgradeResearch,
    openChest,
    purchaseMythical,
    startCombat,
    attack,
    resetGame,
    setGameMode,
    toggleCheat,
    generateCheatItem,
    mineGem,
    exchangeShinyGems,
    redeemPromoCode,
    discardItem,
    repairWithAnvil,
    resetItemWithSacrifice,
    purchaseRelic,
    upgradeRelic,
    equipRelic,
    unequipRelic,
    sellRelic,
    purchaseMultiplier,
  } = useGameState();

  const [currentModal, setCurrentModal] = useState<ModalView>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 sm:w-12 sm:h-12 border-4 border-purple-400 border-t-transparent rounded-full mb-4"></div>
          <p className="text-white text-lg sm:text-xl font-semibold">Loading Hugoland...</p>
        </div>
      </div>
    );
  }

  // Show welcome screen for new players
  if (showWelcome && gameState.zone === 1 && gameState.coins === 100) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <FloatingIcons />
        <div className="text-center max-w-md mx-auto relative z-10">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">🏰 Welcome to Hugoland! 🗡️</h1>
            <p className="text-purple-300 text-base sm:text-lg mb-4 sm:mb-6">
              The ultimate fantasy adventure game where knowledge is your greatest weapon!
            </p>
            <div className="bg-black/30 p-3 sm:p-4 rounded-lg border border-purple-500/50 mb-4 sm:mb-6">
              <h3 className="text-white font-bold mb-2 text-sm sm:text-base">🎮 What awaits you:</h3>
              <ul className="text-purple-200 text-xs sm:text-sm space-y-1">
                <li>• Answer trivia questions to defeat enemies</li>
                <li>• Collect powerful weapons and armor</li>
                <li>• Mine gems and find rare shiny gems</li>
                <li>• Unlock achievements and build knowledge streaks</li>
                <li>• Explore multiple game modes and challenges</li>
                <li>• Progress through infinite zones of adventure</li>
                <li>• Discover ancient relics in the Yojef Market</li>
              </ul>
            </div>
          </div>
          
          <button
            onClick={() => setShowWelcome(false)}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg hover:from-purple-500 hover:to-indigo-500 transition-all duration-200 flex items-center gap-3 justify-center text-base sm:text-lg"
          >
            <Play className="w-5 h-5 sm:w-6 sm:h-6" />
            Start Your Adventure
          </button>
          
          <p className="text-gray-400 text-xs sm:text-sm mt-4">
            Begin your journey in the magical world of Hugoland
          </p>
        </div>
      </div>
    );
  }

  const handleResetGame = () => {
    setCurrentModal('resetConfirm');
  };

  const confirmReset = () => {
    resetGame();
    setCurrentModal(null);
  };

  const renderModal = () => {
    switch (currentModal) {
      case 'achievements':
        return (
          <Achievements
            achievements={gameState.achievements}
            onClose={() => setCurrentModal(null)}
          />
        );
      case 'collection':
        return (
          <CollectionBook
            collectionBook={gameState.collectionBook}
            allWeapons={gameState.inventory.weapons}
            allArmor={gameState.inventory.armor}
            onClose={() => setCurrentModal(null)}
          />
        );
      case 'statistics':
        return (
          <Statistics
            statistics={gameState.statistics}
            onClose={() => setCurrentModal(null)}
          />
        );
      case 'settings':
        return (
          <SettingsModal
            currentMode={gameState.gameMode}
            onSelectMode={setGameMode}
            onResetGame={handleResetGame}
            onClose={() => setCurrentModal(null)}
          />
        );
      case 'pokyegMarket':
        return (
          <PokyegMarket
            coins={gameState.coins}
            gems={gameState.gems}
            multipliers={gameState.multipliers}
            onPurchaseMultiplier={purchaseMultiplier}
            onClose={() => setCurrentModal(null)}
          />
        );
      case 'tutorial':
        return (
          <Tutorial
            onClose={() => setCurrentModal(null)}
          />
        );
      case 'cheats':
        return (
          <CheatPanel
            cheats={gameState.cheats}
            onToggleCheat={toggleCheat}
            onGenerateItem={generateCheatItem}
            onClose={() => setCurrentModal(null)}
          />
        );
      case 'yojefMarket':
        return (
          <YojefMarket
            relicItems={gameState.yojefMarket.items}
            gems={gameState.gems}
            equippedRelicsCount={gameState.inventory.equippedRelics.length}
            onPurchaseRelic={purchaseRelic}
            onClose={() => setCurrentModal(null)}
            nextRefresh={gameState.yojefMarket.nextRefresh}
          />
        );
      case 'shop':
        return (
          <Shop
            coins={gameState.coins}
            onOpenChest={openChest}
            onDiscardItem={discardItem}
            isPremium={gameState.isPremium}
            onClose={() => setCurrentModal(null)}
          />
        );
      case 'inventory':
        return (
          <Inventory
            inventory={gameState.inventory}
            gems={gameState.gems}
            onEquipWeapon={equipWeapon}
            onEquipArmor={equipArmor}
            onUpgradeWeapon={upgradeWeapon}
            onUpgradeArmor={upgradeArmor}
            onSellWeapon={sellWeapon}
            onSellArmor={sellArmor}
            onRepairWithAnvil={repairWithAnvil}
            onResetItem={resetItemWithSacrifice}
            onUpgradeRelic={upgradeRelic}
            onEquipRelic={equipRelic}
            onUnequipRelic={unequipRelic}
            onSellRelic={sellRelic}
            onOpenYojefMarket={() => setCurrentModal('yojefMarket')}
            onClose={() => setCurrentModal(null)}
          />
        );
      case 'research':
        return (
          <Research
            research={gameState.research}
            coins={gameState.coins}
            onUpgradeResearch={upgradeResearch}
            isPremium={gameState.isPremium}
            onClose={() => setCurrentModal(null)}
          />
        );
      case 'mining':
        return (
          <Mining
            mining={gameState.mining}
            gems={gameState.gems}
            shinyGems={gameState.shinyGems}
            onMineGem={mineGem}
            onExchangeShinyGems={exchangeShinyGems}
            onClose={() => setCurrentModal(null)}
          />
        );
      case 'promo':
        return (
          <PromoCode
            promoCodes={gameState.promoCodes}
            onRedeemCode={redeemPromoCode}
            onClose={() => setCurrentModal(null)}
          />
        );
      case 'resetConfirm':
        return (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-red-900 to-gray-900 p-6 rounded-lg border border-red-500/50 max-w-md w-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RotateCcw className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-white font-bold text-xl mb-4">Reset Game?</h2>
                <p className="text-gray-300 text-sm mb-6">
                  Are you sure you want to reset your game? This will permanently delete all your progress, including:
                </p>
                <div className="bg-black/30 p-3 rounded-lg mb-6 text-left">
                  <ul className="text-red-300 text-sm space-y-1">
                    <li>• All coins, gems, and shiny gems</li>
                    <li>• All weapons, armor, and relics</li>
                    <li>• Zone progress and achievements</li>
                    <li>• Research levels and statistics</li>
                    <li>• Collection book progress</li>
                    <li>• Player tags and streaks</li>
                  </ul>
                </div>
                <p className="text-red-400 font-bold text-sm mb-6">
                  This action cannot be undone!
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentModal(null)}
                    className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmReset}
                    className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors font-bold"
                  >
                    Reset Game
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const unlockedAchievements = gameState.achievements.filter(a => a.unlocked).length;

  // Combat overlay with highest z-index
  if (gameState.inCombat && gameState.currentEnemy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
        <FloatingIcons />
        
        {/* Visual Effects */}
        {visualEffects.showFloatingText && (
          <FloatingText
            text={visualEffects.floatingText}
            color={visualEffects.floatingTextColor}
            onComplete={() => clearVisualEffect('text')}
          />
        )}
        {visualEffects.showScreenShake && (
          <ScreenShake
            trigger={visualEffects.showScreenShake}
            onComplete={() => clearVisualEffect('shake')}
          />
        )}

        <div className="fixed inset-0 z-50 p-4">
          <div className="container mx-auto max-w-4xl h-full flex items-center justify-center">
            <Combat
              enemy={gameState.currentEnemy}
              playerStats={gameState.playerStats}
              onAttack={attack}
              combatLog={gameState.combatLog}
              gameMode={gameState.gameMode}
              knowledgeStreak={gameState.knowledgeStreak}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      <FloatingIcons />
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
      
      {/* Visual Effects */}
      {visualEffects.showFloatingText && (
        <FloatingText
          text={visualEffects.floatingText}
          color={visualEffects.floatingTextColor}
          onComplete={() => clearVisualEffect('text')}
        />
      )}
      {visualEffects.showScreenShake && (
        <ScreenShake
          trigger={visualEffects.showScreenShake}
          onComplete={() => clearVisualEffect('shake')}
        />
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 via-violet-800 to-purple-800 shadow-2xl relative z-10">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-6">
          <div className="flex items-center justify-center mb-3 sm:mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white">
                🏰 Hugoland 🗡️
              </h1>
              {gameState.isPremium && (
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-yellow-400 animate-pulse" />
              )}
            </div>
          </div>
          
          {/* Quick Stats Bar */}
          <div className="flex justify-center items-center gap-2 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm">
            <button
              onClick={() => setCurrentModal('achievements')}
              className="flex items-center gap-1 text-yellow-300 hover:text-yellow-200 transition-colors"
            >
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{unlockedAchievements}/{gameState.achievements.length}</span>
            </button>
            
            <button
              onClick={() => setCurrentModal('collection')}
              className="flex items-center gap-1 text-indigo-300 hover:text-indigo-200 transition-colors"
            >
              <Book className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Collect</span>
            </button>
            
            <button
              onClick={() => setCurrentModal('statistics')}
              className="flex items-center gap-1 text-blue-300 hover:text-blue-200 transition-colors"
            >
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{Math.round((gameState.statistics.correctAnswers / Math.max(gameState.statistics.totalQuestionsAnswered, 1)) * 100)}%</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Player Stats - Always Visible */}
          <div className="mb-6">
            <PlayerStats
              playerStats={gameState.playerStats}
              zone={gameState.zone}
              coins={gameState.coins}
              gems={gameState.gems}
              shinyGems={gameState.shinyGems}
              playerTags={gameState.playerTags}
            />
          </div>
          
          {/* Knowledge Streak Display */}
          {gameState.knowledgeStreak.current > 0 && (
            <div className="bg-gradient-to-r from-yellow-900 to-orange-900 p-3 sm:p-4 rounded-lg border border-yellow-500/50 mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-xl sm:text-2xl">🔥</span>
                  <h3 className="text-yellow-400 font-bold text-sm sm:text-lg">Knowledge Streak!</h3>
                </div>
                <p className="text-white text-xs sm:text-sm">
                  {gameState.knowledgeStreak.current} correct answers in a row
                </p>
                <p className="text-yellow-300 text-xs sm:text-sm">
                  +{Math.round((gameState.knowledgeStreak.multiplier - 1) * 100)}% reward bonus
                </p>
              </div>
            </div>
          )}

          {/* Start Adventure Button */}
          <div className="text-center mb-8">
            <button
              onClick={startCombat}
              disabled={gameState.playerStats.hp <= 0}
              className={`px-8 py-4 rounded-lg font-bold text-white transition-all duration-200 transform flex items-center gap-3 justify-center text-lg mx-auto ${
                gameState.playerStats.hp > 0
                  ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 hover:scale-105 shadow-lg hover:shadow-green-500/25'
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              <Play className="w-6 h-6" />
              {gameState.playerStats.hp <= 0 ? 'You are defeated!' : 'Start Adventure'}
            </button>
            
            {gameState.playerStats.hp <= 0 && (
              <p className="text-red-400 mt-2 text-sm">
                Visit the shop to get better equipment and try again!
              </p>
            )}
          </div>

          {/* Premium Status */}
          {gameState.isPremium && (
            <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 p-4 rounded-lg mb-8">
              <div className="flex items-center justify-center gap-2">
                <Crown className="w-6 h-6 text-white" />
                <span className="text-white font-bold text-lg">🎉 PREMIUM MEMBER UNLOCKED! 🎉</span>
              </div>
              <p className="text-yellow-100 text-sm text-center mt-1">
                You've reached Zone 50! Enjoy exclusive rewards and special features!
              </p>
            </div>
          )}

          {/* Action Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Shop */}
            <button
              onClick={() => setCurrentModal('shop')}
              className="bg-gradient-to-br from-yellow-600 to-orange-600 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-yellow-500/25 transition-all duration-200 hover:scale-105 group"
            >
              <Package className="w-8 h-8 sm:w-12 sm:h-12 text-white mx-auto mb-2 group-hover:animate-bounce" />
              <h3 className="text-white font-bold text-sm sm:text-base">Treasure Shop</h3>
              <p className="text-yellow-100 text-xs mt-1">Open chests for loot</p>
            </button>

            {/* Inventory */}
            <button
              onClick={() => setCurrentModal('inventory')}
              className="bg-gradient-to-br from-blue-600 to-indigo-600 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all duration-200 hover:scale-105 group"
            >
              <Shield className="w-8 h-8 sm:w-12 sm:h-12 text-white mx-auto mb-2 group-hover:animate-bounce" />
              <h3 className="text-white font-bold text-sm sm:text-base">Inventory</h3>
              <p className="text-blue-100 text-xs mt-1">Manage equipment</p>
            </button>

            {/* Research */}
            <button
              onClick={() => setCurrentModal('research')}
              className="bg-gradient-to-br from-purple-600 to-violet-600 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-200 hover:scale-105 group"
            >
              <Brain className="w-8 h-8 sm:w-12 sm:h-12 text-white mx-auto mb-2 group-hover:animate-bounce" />
              <h3 className="text-white font-bold text-sm sm:text-base">Research</h3>
              <p className="text-purple-100 text-xs mt-1">Upgrade abilities</p>
            </button>

            {/* Mining */}
            <button
              onClick={() => setCurrentModal('mining')}
              className="bg-gradient-to-br from-gray-600 to-slate-600 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-gray-500/25 transition-all duration-200 hover:scale-105 group"
            >
              <Pickaxe className="w-8 h-8 sm:w-12 sm:h-12 text-white mx-auto mb-2 group-hover:animate-bounce" />
              <h3 className="text-white font-bold text-sm sm:text-base">Mining</h3>
              <p className="text-gray-100 text-xs mt-1">Mine gems</p>
            </button>

            {/* Promo Codes */}
            <button
              onClick={() => setCurrentModal('promo')}
              className="bg-gradient-to-br from-green-600 to-emerald-600 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-green-500/25 transition-all duration-200 hover:scale-105 group"
            >
              <Gift className="w-8 h-8 sm:w-12 sm:h-12 text-white mx-auto mb-2 group-hover:animate-bounce" />
              <h3 className="text-white font-bold text-sm sm:text-base">Promo Codes</h3>
              <p className="text-green-100 text-xs mt-1">Redeem rewards</p>
            </button>

            {/* Pokyeg Market */}
            <button
              onClick={() => setCurrentModal('pokyegMarket')}
              className="bg-gradient-to-br from-red-600 to-red-700 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-red-500/25 transition-all duration-200 hover:scale-105 group"
            >
              <Skull className="w-8 h-8 sm:w-12 sm:h-12 text-white mx-auto mb-2 group-hover:animate-bounce" />
              <h3 className="text-white font-bold text-sm sm:text-base">Pokyeg Market</h3>
              <p className="text-red-100 text-xs mt-1">Permanent upgrades</p>
            </button>

            {/* Settings */}
            <button
              onClick={() => setCurrentModal('settings')}
              className="bg-gradient-to-br from-slate-600 to-gray-600 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-slate-500/25 transition-all duration-200 hover:scale-105 group"
            >
              <Settings className="w-8 h-8 sm:w-12 sm:h-12 text-white mx-auto mb-2 group-hover:animate-bounce" />
              <h3 className="text-white font-bold text-sm sm:text-base">Settings</h3>
              <p className="text-slate-100 text-xs mt-1">Game options</p>
            </button>

            {/* Tutorial */}
            <button
              onClick={() => setCurrentModal('tutorial')}
              className="bg-gradient-to-br from-cyan-600 to-teal-600 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 hover:scale-105 group"
            >
              <Book className="w-8 h-8 sm:w-12 sm:h-12 text-white mx-auto mb-2 group-hover:animate-bounce" />
              <h3 className="text-white font-bold text-sm sm:text-base">Tutorial</h3>
              <p className="text-cyan-100 text-xs mt-1">Learn to play</p>
            </button>
          </div>

          {/* Secret Cheat Access */}
          <div className="text-center mt-8">
            <button
              onClick={() => setCurrentModal('cheats')}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              🔓
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {renderModal()}
    </div>
  );
}

export default App;