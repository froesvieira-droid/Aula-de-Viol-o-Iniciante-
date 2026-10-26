import React, { useState, useEffect } from 'react';
import { GUITAR_DAILY_TIPS, GuitarDailyTip } from '../data/dailyTipsData';
import { guitarAudio } from '../services/guitarAudio';
import { 
  Lightbulb, 
  Dices, 
  Sparkles, 
  ArrowRight, 
  Flame, 
  Music,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface DailyTipCardProps {
  onOpenFretboardWithChord?: (chordId: string) => void;
  onOpenRhythm?: (rhythmId: string) => void;
}

export const DailyTipCard: React.FC<DailyTipCardProps> = ({
  onOpenFretboardWithChord,
  onOpenRhythm,
}) => {
  const [currentTip, setCurrentTip] = useState<GuitarDailyTip>(() => {
    // Pick an initial random tip on first render
    const randomIndex = Math.floor(Math.random() * GUITAR_DAILY_TIPS.length);
    return GUITAR_DAILY_TIPS[randomIndex];
  });
  const [isRotating, setIsRotating] = useState(false);

  // Helper to get another random tip (different from current)
  const handleShuffleTip = () => {
    setIsRotating(true);
    guitarAudio.playMuteSlap(0.3); // Subtle acoustic wood feedback
    
    setTimeout(() => {
      let nextIndex = Math.floor(Math.random() * GUITAR_DAILY_TIPS.length);
      if (GUITAR_DAILY_TIPS.length > 1 && GUITAR_DAILY_TIPS[nextIndex].id === currentTip.id) {
        nextIndex = (nextIndex + 1) % GUITAR_DAILY_DAILY_TIPS_LENGTH;
      }
      setCurrentTip(GUITAR_DAILY_TIPS[nextIndex]);
      setIsRotating(false);
    }, 150);
  };

  const GUITAR_DAILY_DAILY_TIPS_LENGTH = GUITAR_DAILY_TIPS.length;

  const getCategoryColor = (category: GuitarDailyTip['category']) => {
    switch (category) {
      case 'Mão Direita & Ritmo':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Pestana':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'Postura':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Troca de Acordes':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      case 'Técnica & Som':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      default:
        return 'bg-amber-600/20 text-amber-300 border-amber-600/40';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2a170b] via-[#201208] to-[#160d07] border-2 border-amber-600/40 shadow-xl p-4 sm:p-5 transition-all">
      {/* Decorative ambient glow background */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      
      {/* Top Bar: Badge, Title & Shuffle Button */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-amber-900/40 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 shadow-md shadow-amber-500/30">
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-extrabold text-white tracking-tight flex items-center gap-1.5">
                Dica do Dia
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryColor(currentTip.category)}`}>
                {currentTip.category}
              </span>
            </div>
            <p className="text-[11px] text-amber-300/70 hidden sm:block">
              Técnica rápida sorteada para acelerar seu aprendizado no violão
            </p>
          </div>
        </div>

        {/* Shuffle / Nova Dica Button */}
        <button
          onClick={handleShuffleTip}
          disabled={isRotating}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#130a05] hover:bg-amber-900/40 border border-amber-700/50 text-amber-200 hover:text-white text-xs font-semibold shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-50"
          title="Sortear outra dica rápida de violão"
        >
          <Dices className={`w-3.5 h-3.5 text-amber-400 ${isRotating ? 'animate-spin' : ''}`} />
          <span>Outra Dica</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="mt-3.5 space-y-2.5 relative z-10">
        <h4 className="text-base sm:text-lg font-bold text-amber-100 flex items-center gap-2">
          {currentTip.title}
        </h4>

        <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
          {currentTip.technique}
        </p>

        {/* Pro Tip Highlight Box */}
        <div className="flex items-start gap-2 bg-[#140b05]/90 border border-amber-500/30 p-2.5 sm:p-3 rounded-xl text-xs text-amber-300">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] sm:text-xs leading-normal">
            <strong className="text-amber-200">Dica de Ouro:</strong> {currentTip.proTip}
          </p>
        </div>

        {/* Quick Action Button if available */}
        {currentTip.quickAction && (
          <div className="pt-1 flex items-center justify-end">
            {currentTip.quickAction.type === 'chord' && onOpenFretboardWithChord && (
              <button
                onClick={() => onOpenFretboardWithChord(currentTip.quickAction!.targetId)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow-md cursor-pointer"
              >
                <Music className="w-3.5 h-3.5" />
                <span>{currentTip.quickAction.label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {currentTip.quickAction.type === 'rhythm' && onOpenRhythm && (
              <button
                onClick={() => onOpenRhythm(currentTip.quickAction!.targetId)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold transition shadow-md cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>{currentTip.quickAction.label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
