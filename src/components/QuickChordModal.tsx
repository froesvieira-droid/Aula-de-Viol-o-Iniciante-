import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CHORD_DATABASE, ChordDefinition, GUITAR_STRINGS } from '../data/guitarData';
import { guitarAudio } from '../services/guitarAudio';
import { 
  Search, 
  X, 
  Volume2, 
  Play, 
  ArrowRight, 
  Sparkles, 
  Music, 
  Layers, 
  HelpCircle,
  Check
} from 'lucide-react';

interface QuickChordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChordOnFretboard?: (chordId: string) => void;
  initialChordId?: string;
}

export const QuickChordModal: React.FC<QuickChordModalProps> = ({
  isOpen,
  onClose,
  onSelectChordOnFretboard,
  initialChordId = 'c',
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedChordId, setSelectedChordId] = useState<string>(initialChordId);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'maior' | 'menor' | 'com sétima' | 'pestana'>('all');
  const [isPlayingStrum, setIsPlayingStrum] = useState<boolean>(false);
  const [lastPluckedString, setLastPluckedString] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter chords based on search query and category
  const filteredChords = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return CHORD_DATABASE.filter(chord => {
      // Category filter
      if (categoryFilter !== 'all') {
        if (categoryFilter === 'pestana') {
          if (!chord.barreFret && chord.category !== 'pestana' && chord.type !== 'pestana') return false;
        } else if (chord.type !== categoryFilter) {
          return false;
        }
      }

      // Query filter
      if (!q) return true;
      const matchCipher = chord.cipher.toLowerCase().includes(q);
      const matchName = chord.name.toLowerCase().includes(q);
      const matchTips = chord.tips.toLowerCase().includes(q);
      return matchCipher || matchName || matchTips;
    });
  }, [searchQuery, categoryFilter]);

  // Ensure a valid selected chord
  useEffect(() => {
    if (filteredChords.length > 0) {
      const stillExists = filteredChords.some(c => c.id === selectedChordId);
      if (!stillExists) {
        setSelectedChordId(filteredChords[0].id);
      }
    }
  }, [filteredChords, selectedChordId]);

  const selectedChord = CHORD_DATABASE.find(c => c.id === selectedChordId) || CHORD_DATABASE[0];

  const handlePlayStrum = (direction: 'down' | 'up' | 'arpeggio' = 'down') => {
    setIsPlayingStrum(true);
    guitarAudio.playChord(selectedChord.frets, direction, direction === 'arpeggio' ? 120 : 35, '6to1');
    setTimeout(() => {
      setIsPlayingStrum(false);
    }, direction === 'arpeggio' ? 800 : 350);
  };

  const handlePluckString = (stringIndex: number) => {
    // stringIndex 0 = 1st string (E4), stringIndex 5 = 6th string (E2)
    const arrayIdx = 5 - stringIndex;
    const fret = selectedChord.frets[arrayIdx];
    if (fret >= 0) {
      setLastPluckedString(stringIndex);
      guitarAudio.playString(stringIndex, fret, 2.0, 0.9);
      setTimeout(() => setLastPluckedString(null), 400);
    }
  };

  const handleViewInFullFretboard = () => {
    if (onSelectChordOnFretboard) {
      onSelectChordOnFretboard(selectedChord.id);
    }
    onClose();
  };

  if (!isOpen) return null;

  // Frets to render for mini chord box (find max fret in chord to adjust box)
  const validFrets = selectedChord.frets.filter(f => f > 0) as number[];
  const minFret = validFrets.length > 0 ? Math.min(...validFrets) : 1;
  const maxFret = validFrets.length > 0 ? Math.max(...validFrets) : 3;
  
  // If chord is played high up the neck (e.g. fret 5), start the box from minFret
  const boxStartFret = maxFret <= 4 ? 1 : Math.max(1, minFret);
  const boxFretCount = 4; // Display 4 frets

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      {/* Modal Dialog Card */}
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-gradient-to-b from-[#22140b] via-[#1a0f07] to-[#120904] border-2 border-amber-600/50 shadow-2xl overflow-hidden text-amber-50"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-amber-900/40 bg-[#160d07]">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/aistudio/file_000000006aa0820ebd707cd51330b5fb_c34dcf50.png" 
              alt="Vieira Logo" 
              className="w-9 h-9 rounded-xl object-cover border border-amber-500/50 shadow-md ring-1 ring-amber-400/20 shrink-0"
            />
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                Busca de Acordes Vieira
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-950 border border-amber-700/60 text-amber-300">
                  Dicionário Instantâneo
                </span>
              </h3>
              <p className="text-[11px] text-amber-300/70 hidden sm:block">
                Digite o nome da cifra ou nota em português para ver a digitação e ouvir o som
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-[11px] font-mono text-amber-400/60 bg-stone-900/80 px-2 py-1 rounded-lg border border-amber-950">
              ESC para fechar
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-amber-300 hover:text-white hover:bg-amber-900/40 transition cursor-pointer"
              title="Fechar (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Input & Category Filter Chips */}
        <div className="p-4 sm:p-5 bg-[#140b05] border-b border-amber-950 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/70 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar acorde (ex: D, C9, Em, F#m, Sol com sétima, Pestana...)"
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-[#1d1108] border-2 border-amber-800/40 focus:border-amber-500 focus:outline-none text-white placeholder-amber-400/40 text-sm sm:text-base font-semibold shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-amber-400/60 hover:text-amber-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category filter pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] text-amber-400/70 font-semibold mr-1">Filtrar:</span>
            {[
              { id: 'all', label: 'Todos os Acordes' },
              { id: 'maior', label: 'Maiores' },
              { id: 'menor', label: 'Menores' },
              { id: 'com sétima', label: 'Com Sétima (7ª)' },
              { id: 'pestana', label: 'Pestanas' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer text-xs ${
                  categoryFilter === cat.id
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'bg-[#1b1008] text-amber-300/80 hover:text-white border border-amber-950 hover:bg-amber-900/30'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Main Content: Split View (List of Matching Chords + Instant Chord Diagram) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left / Search Results Column (5 cols) */}
          <div className="md:col-span-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-amber-300/80 pb-1">
              <span className="font-bold">
                {filteredChords.length} {filteredChords.length === 1 ? 'acorde encontrado' : 'acordes encontrados'}
              </span>
              <span className="text-[11px] text-amber-400/60">Clique para inspecionar</span>
            </div>

            {filteredChords.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#160d07] border border-amber-950 text-center space-y-2">
                <Music className="w-8 h-8 text-amber-500/50 mx-auto" />
                <p className="text-sm font-bold text-amber-200">Nenhum acorde encontrado</p>
                <p className="text-xs text-amber-400/70">
                  Tente buscar pela cifra (ex: C, D, Em, G7) ou pelo nome (ex: Mi menor, Sol).
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                {filteredChords.map(chord => {
                  const isSelected = chord.id === selectedChordId;
                  return (
                    <button
                      key={chord.id}
                      onClick={() => {
                        setSelectedChordId(chord.id);
                        guitarAudio.playChord(chord.frets, 'down', 30, '6to1');
                      }}
                      className={`w-full p-2.5 sm:p-3 rounded-xl transition flex items-center justify-between border cursor-pointer ${
                        isSelected
                          ? 'bg-amber-600/30 border-amber-400 text-white shadow-md ring-1 ring-amber-400/40'
                          : 'bg-[#180f08] border-amber-950 text-amber-200/90 hover:bg-amber-900/30 hover:border-amber-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-base shadow ${
                          isSelected ? 'bg-amber-500 text-stone-950 font-black' : 'bg-amber-950/80 text-amber-300 border border-amber-800/40'
                        }`}>
                          {chord.cipher}
                        </span>
                        <div className="text-left">
                          <h4 className="text-xs sm:text-sm font-bold text-white">{chord.name}</h4>
                          <span className="text-[10px] text-amber-400/70 capitalize block">
                            {chord.type} {chord.barreFret ? '• Pestana' : ''}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right / Instant Chord Visualizer & Diagram Box (7 cols) */}
          <div className="md:col-span-7 bg-[#170e07] border-2 border-amber-700/40 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4 flex flex-col justify-between">
            {/* Chord Header */}
            <div>
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-amber-900/40">
                <div className="flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-amber-300">
                    {selectedChord.cipher}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-white">
                      {selectedChord.name}
                    </h3>
                    <span className="text-xs text-amber-400/80">
                      Baixo no bordão: {selectedChord.bassString}ª corda
                    </span>
                  </div>
                </div>

                {/* Strum Play Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePlayStrum('down')}
                    disabled={isPlayingStrum}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition cursor-pointer shadow disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Tocar (↓)</span>
                  </button>
                  <button
                    onClick={() => handlePlayStrum('arpeggio')}
                    disabled={isPlayingStrum}
                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-amber-950 hover:bg-amber-900 border border-amber-700/50 text-amber-200 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Dedilhar</span>
                  </button>
                </div>
              </div>

              {/* Instant Diagram Box (Vertical Classical Guitar Chart) */}
              <div className="my-4 p-4 bg-[#100703] border border-amber-950 rounded-2xl flex flex-col items-center justify-center">
                {/* Top nut indicators: 𝄢 / O / X */}
                <div className="grid grid-cols-6 gap-3 sm:gap-5 mb-2 text-center text-xs font-bold">
                  {[5, 4, 3, 2, 1, 0].map(stringIdx => {
                    const fret = selectedChord.frets[5 - stringIdx];
                    const isBass = (6 - stringIdx) === selectedChord.bassString;
                    return (
                      <div key={stringIdx} className="flex flex-col items-center">
                        <span className="text-[10px] text-amber-400/60 font-mono mb-0.5">
                          {6 - stringIdx}ª
                        </span>
                        {fret === -1 ? (
                          <span className="w-5 h-5 rounded-full bg-red-950 text-red-400 border border-red-700/60 flex items-center justify-center text-xs font-bold">
                            ✕
                          </span>
                        ) : fret === 0 ? (
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border ${
                            isBass 
                              ? 'bg-amber-500 text-stone-950 border-amber-300 font-extrabold shadow' 
                              : 'bg-emerald-950 text-emerald-300 border-emerald-500/70'
                          }`}>
                            {isBass ? '𝄢' : 'O'}
                          </span>
                        ) : isBass ? (
                          <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 border border-amber-300 flex items-center justify-center text-[10px] font-extrabold">
                            𝄢
                          </span>
                        ) : (
                          <span className="w-5 h-5" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* The Fretboard Grid Chart */}
                <div className="relative w-full max-w-[280px] sm:max-w-[340px] bg-[#221309] rounded-xl border-t-4 border-[#eae0d2] border-x border-b border-amber-950 p-2 shadow-inner">
                  {/* Position label if high up the neck */}
                  {boxStartFret > 1 && (
                    <div className="absolute -left-8 top-4 text-xs font-mono font-bold text-amber-300 bg-stone-950 px-1 py-0.5 rounded border border-amber-900">
                      {boxStartFret}ª
                    </div>
                  )}

                  {/* Barre indicator visual band */}
                  {selectedChord.barreFret && (
                    <div 
                      className="absolute rounded-full bg-amber-400/40 border-2 border-amber-300 shadow-md z-10 pointer-events-none flex items-center justify-center text-[10px] font-bold text-stone-950"
                      style={{
                        top: `${((selectedChord.barreFret - boxStartFret) * 44) + 12}px`,
                        left: '12px',
                        right: '12px',
                        height: '24px',
                      }}
                    >
                      <span className="bg-amber-400 px-2 py-0.5 rounded-full text-[9px] font-extrabold shadow">
                        Pestana {selectedChord.barreFret}ª casa
                      </span>
                    </div>
                  )}

                  {/* 4 Frets with 6 Strings */}
                  <div className="space-y-0">
                    {Array.from({ length: boxFretCount }, (_, fIdx) => {
                      const currentFretNumber = boxStartFret + fIdx;
                      return (
                        <div 
                          key={fIdx}
                          className="h-11 border-b border-[#5c402b] last:border-b-0 grid grid-cols-6 relative items-center"
                        >
                          {/* 6 String vertical lines */}
                          {[5, 4, 3, 2, 1, 0].map(stringIdx => {
                            const fretInChord = selectedChord.frets[5 - stringIdx];
                            const finger = selectedChord.fingers[5 - stringIdx];
                            const isFingerHere = fretInChord === currentFretNumber;
                            const isPlucked = lastPluckedString === stringIdx;

                            return (
                              <button
                                key={stringIdx}
                                onClick={() => handlePluckString(stringIdx)}
                                className={`relative h-full flex items-center justify-center hover:bg-amber-500/10 cursor-pointer ${
                                  isPlucked ? 'bg-amber-500/20' : ''
                                }`}
                                title={`Tocar corda ${6 - stringIdx}`}
                              >
                                {/* Vertical string line */}
                                <div 
                                  className="absolute top-0 bottom-0 pointer-events-none"
                                  style={{
                                    width: `${1 + (stringIdx * 0.4)}px`,
                                    backgroundColor: stringIdx >= 3 ? '#d89c56' : '#f0f0f0',
                                  }}
                                />

                                {/* Finger circle */}
                                {isFingerHere && (
                                  <div className="relative z-20 w-7 h-7 rounded-full bg-amber-500 text-stone-950 font-black text-xs flex items-center justify-center shadow-lg ring-2 ring-white transform hover:scale-110 transition-transform">
                                    {finger > 0 ? finger : '●'}
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Finger Legend Bar */}
                <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-amber-300/80">
                  <span><strong>1</strong>: Indicador</span>
                  <span><strong>2</strong>: Médio</span>
                  <span><strong>3</strong>: Anelar</span>
                  <span><strong>4</strong>: Mínimo</span>
                </div>
              </div>

              {/* Didactic tip */}
              <div className="p-3 bg-[#130904] rounded-xl border border-amber-900/40 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p>
                  <strong className="text-amber-300">Dica de Postura:</strong> {selectedChord.tips}
                </p>
              </div>
            </div>

            {/* Bottom action: Open in Full Fretboard */}
            <div className="pt-3 border-t border-amber-900/40 flex items-center justify-between gap-3">
              <span className="text-[11px] text-amber-400/60 hidden sm:inline">
                Toque nas cordas no diagrama para ouvir individualmente
              </span>

              <button
                onClick={handleViewInFullFretboard}
                className="w-full sm:w-auto ml-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
              >
                <span>Ver no Braço Completo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
