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
import { GameModeSelector } from './components/GameModeSelector';
import { PokyegMarket } from './components/PokyegMarket';
import { Tutorial } from './components/Tutorial';
import { CheatPanel } from './components/CheatPanel';
import { Mining } from './components/Mining';
import { PromoCode } from './components/PromoCode';
import { FloatingIcons } from './components/FloatingIcons';
import { FloatingText, ScreenShake } from './components/VisualEffects';
import { Shield, Package, User, Play, RotateCcw, Brain, Crown, Trophy, Book, BarChart3, Settings, Pickaxe, Gift } from 'lucide-react';

type GameView = 'stats' | 'shop' | 'inventory' | 'research' | 'mining' | 'promo';
type ModalView = 'achievements' | 'collection' | 'statistics' | 'gameMode' | 'pokyegMarket' | 'tutorial' | 'cheats' | 'resetConfirm' | null;

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
    purchaseMiningTool,
    redeemPromoCode,
    discardItem,
  } = useGameState();

  const [currentView, setCurrentView] = useState<GameView>('stats');
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
                <li>• Mine gems and upgrade your equipment</li>
                <li>• Unlock achievements and build knowledge streaks</li>
                <li>• Explore multiple game modes and challenges</li>
                <li>• Progress through endless zones of adventure</li>
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

  const handleFooterClick = (type: 'tutorial' | 'cheats') => {
    console.log('Footer clicked:', type);
    setCurrentModal(type);
  };

  const handleResetGame = () => {
    setCurrentModal('resetConfirm');
  };

  const confirmReset = () => {
    resetGame();
    setCurrentModal(null);
  };

  const renderCurrentView = () => {
    if (gameState.inCombat && gameState.currentEnemy) {
      return (
        <Combat
          enemy={gameState.currentEnemy}
          playerStats={gameState.playerStats}
          onAttack={attack}
          combatLog={gameState.combatLog}
          gameMode={gameState.gameMode}
          knowledgeStreak={gameState.knowledgeStreak}
          powerSkills={gameState.powerSkills}
        />
      );
    }

    switch (currentView) {
      case 'stats':
        return (
          <div className="space-y-4 sm:space-y-6">
            <PlayerStats
              playerStats={gameState.playerStats}
              zone={gameState.zone}
              coins={gameState.coins}
              gems={gameState.gems}
            />
            
            {/* Power Skills Display */}
            {gameState.powerSkills.length > 0 && (
              <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-3 sm:p-4 rounded-lg border border-indigo-500/50">
                <h3 className="text-white font-bold mb-3 text-sm sm:text-lg flex items-center gap-2">
                  ⚡ Active Power Skills
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {gameState.powerSkills.map((skill) => (
                    <div key={skill.id} className="bg-black/30 p-2 rounded border border-purple-500/30">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold ${
                          skill.rarity === 'mythical' ? 'text-red-400' :
                          skill.rarity === 'legendary' ? 'text-yellow-400' :
                          skill.rarity === 'epic' ? 'text-purple-400' :
                          skill.rarity === 'rare' ? 'text-blue-400' : 'text-gray-400'
                        }`}>
                          {skill.rarity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-white font-semibold text-xs">{skill.name}</p>
                      <p className="text-gray-300 text-xs">{skill.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Knowledge Streak Display */}
            {gameState.knowledgeStreak.current > 0 && (
              <div className="bg-gradient-to-r from-yellow-900 to-orange-900 p-3 sm:p-4 rounded-lg border border-yellow-500/50">
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

            <div className="text-center space-y-3 sm:space-y-4">
              <button
                onClick={startCombat}
                disabled={gameState.playerStats.hp <= 0}
                className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-white transition-all duration-200 transform flex items-center gap-3 justify-center text-sm sm:text-base ${
                  gameState.playerStats.hp > 0
                    ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 hover:scale-105 shadow-lg hover:shadow-green-500/25'
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                {gameState.playerStats.hp <= 0 ? 'You are defeated!' : 'Start Adventure'}
              </button>
              
              {gameState.playerStats.hp <= 0 && (
                <p className="text-red-400 mt-2 text-xs sm:text-sm">
                  Visit the shop to get better equipment and try again!
                </p>
              )}
              
              {gameState.isPremium && (
                <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 p-3 rounded-lg">
                  <div className="flex items-center justify-center gap-2">
                    <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    <span className="text-white font-bold text-xs sm:text-sm">🎉 PREMIUM MEMBER UNLOCKED! 🎉</span>
                  </div>
                  <p className="text-yellow-100 text-xs mt-1">
                    You've reached Zone 50! Enjoy exclusive rewards and special features!
                  </p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
                <button
                  onClick={() => setCurrentModal('gameMode')}
                  className="px-3 sm:px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 transition-all duration-200 flex items-center gap-2 justify-center text-xs sm:text-sm"
                >
                  <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                  Game Mode
                </button>
                
                <button
                  onClick={handleResetGame}
                  className="px-3 sm:px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 transition-all duration-200 flex items-center gap-2 justify-center text-xs sm:text-sm"
                >
                  <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                  Reset Game
                </button>
              </div>
            </div>
          </div>
        );
      case 'shop':
        return <Shop coins={gameState.coins} onOpenChest={openChest} onDiscardItem={discardItem} isPremium={gameState.isPremium} />;
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
          />
        );
      case 'research':
        return (
          <Research
            research={gameState.research}
            coins={gameState.coins}
            onUpgradeResearch={upgradeResearch}
            isPremium={gameState.isPremium}
            powerSkills={gameState.powerSkills}
          />
        );
      case 'mining':
        return (
          <Mining
            mining={gameState.mining}
            gems={gameState.gems}
            onMineGem={mineGem}
            onPurchaseTool={purchaseMiningTool}
          />
        );
      case 'promo':
        return (
          <PromoCode
            promoCodes={gameState.promoCodes}
            onRedeemCode={redeemPromoCode}
          />
        );
      default:
        return null;
    }
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
      case 'gameMode':
        return (
          <GameModeSelector
            currentMode={gameState.gameMode}
            onSelectMode={setGameMode}
            onClose={() => setCurrentModal(null)}
          />
        );
      case 'pokyegMarket':
        return (
          <PokyegMarket
            coins={gameState.coins}
            onPurchaseMythical={purchaseMythical}
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
                    <li>• All coins and gems</li>
                    <li>• All weapons and armor</li>
                    <li>• Zone progress and achievements</li>
                    <li>• Research levels and statistics</li>
                    <li>• Collection book progress</li>
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

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 via-violet-800 to-purple-800 shadow-2xl relative z-10">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-6">
          <div className="flex items-center justify-between mb-3 sm:mb-6">
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
              <span>{gameState.collectionBook.totalWeaponsFound + gameState.collectionBook.totalArmorFound}</span>
            </button>
            
            <button
              onClick={() => setCurrentModal('statistics')}
              className="flex items-center gap-1 text-blue-300 hover:text-blue-200 transition-colors"
            >
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{Math.round((gameState.statistics.correctAnswers / Math.max(gameState.statistics.totalQuestionsAnswered, 1)) * 100)}%</span>
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex justify-center space-x-1 sm:space-x-2 overflow-x-auto pb-2">
            {[
              { id: 'stats', label: 'Hero', icon: User },
              { id: 'research', label: 'Research', icon: Brain },
              { id: 'shop', label: 'Shop', icon: Package },
              { id: 'inventory', label: 'Inventory', icon: Shield },
              { id: 'mining', label: 'Mining', icon: Pickaxe },
              { id: 'promo', label: 'Promo', icon: Gift },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentView(id as GameView)}
                disabled={gameState.inCombat}
                className={`px-2 sm:px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap ${
                  currentView === id
                    ? 'bg-white text-purple-800 shadow-lg'
                    : gameState.inCombat
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-700 text-white hover:bg-purple-600 hover:scale-105'
                }`}
              >
                <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {renderCurrentView()}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-3 sm:py-4 text-gray-400 text-xs sm:text-sm px-4 relative z-10">
        Welcome to{' '}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleFooterClick('tutorial');
          }}
          className="text-gray-400 hover:text-purple-400 transition-colors cursor-pointer underline decoration-dotted font-semibold"
        >
          Hugoland
        </button>
        {' '}- Where knowledge meets{' '}
        <button
          onClick={() => setCurrentModal('pokyegMarket')}
          className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer underline decoration-dotted"
        >
          power
        </button>
        ! 
        {gameState.isPremium && <span className="text-yellow-400 ml-2">👑 Premium Member</span>}
        {gameState.knowledgeStreak.current > 0 && (
          <span className="text-yellow-400 ml-2">🔥 {gameState.knowledgeStreak.current} Streak</span>
        )}
        <span className="text-purple-400 ml-2">Mode: {gameState.gameMode.current.toUpperCase()}</span>
      </div>

      {/* Modals */}
      {renderModal()}
    </div>
  );
}

export default App;