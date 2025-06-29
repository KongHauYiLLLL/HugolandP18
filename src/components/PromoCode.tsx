import React, { useState } from 'react';
import { PromoCodeState } from '../types/game';
import { Gift, Check, AlertCircle, X } from 'lucide-react';

interface PromoCodeProps {
  promoCodes: PromoCodeState;
  onRedeemCode: (code: string) => boolean;
  onClose: () => void;
}

export const PromoCode: React.FC<PromoCodeProps> = ({ promoCodes, onRedeemCode, onClose }) => {
  const [inputCode, setInputCode] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleRedeem = () => {
    if (!inputCode.trim()) {
      setMessage({ text: 'Please enter a promo code', type: 'error' });
      return;
    }

    const success = onRedeemCode(inputCode.toUpperCase());
    
    if (success) {
      setMessage({ text: "Promo code redeemed successfully! The server won't tell me if you're capping so just bear with me.", type: 'success' });
      setInputCode('');
    } else {
      setMessage({ text: 'Wrong code', type: 'error' }); // Changed this message
    }
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-40 p-4">
      <div className="bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 p-4 sm:p-6 rounded-lg shadow-2xl max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Promo Codes</h2>
              <p className="text-green-300 text-sm sm:text-base">Redeem special codes for exclusive rewards!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Redeem Section */}
        <div className="bg-black/30 p-4 sm:p-6 rounded-lg mb-4 sm:mb-6">
          <h3 className="text-white font-semibold mb-3 text-sm sm:text-base">Enter Promo Code</h3>
          
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="Enter code here..."
              className="flex-1 px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none text-sm sm:text-base"
              maxLength={20}
            />
            <button
              onClick={handleRedeem}
              className="px-4 sm:px-6 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-lg hover:from-green-500 hover:to-green-400 transition-all duration-200 text-sm sm:text-base"
            >
              Redeem
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-900/50 border border-green-500/50 text-green-300' 
                : 'bg-red-900/50 border border-red-500/50 text-red-300'
            }`}>
              {message.type === 'success' ? (
                <Check className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-gray-400 text-xs sm:text-sm">
            Promo codes can only be used once. Keep an eye out for new codes!
          </p>
        </div>
      </div>
    </div>
  );
};