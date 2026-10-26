import React, { useState } from 'react';
import { 
  GUITAR_STRINGS, 
  CHORD_DATABASE, 
  CAGED_SYSTEM_MODELS, 
  getNoteAtFret, 
  ChordDefinition,
  CHROMATIC_NOTES,
  NOTE_PT_MAP 
} from '../data/guitarData';
import { guitarAudio } from '../services/guitarAudio';
import { Volume2, Play, Sparkles, HelpCircle, Layers, Music, Eye } from 'lucide-react';

interface FretboardProps {
  initialChordId?: string;
  onSelectChord?: (chord: ChordDefinition) => void;
}

export const Fretboard: React.FC<FretboardProps> = ({ initialChordId = 'c', onSelectChord }) => {
  const [activeTab, setActiveTab] = useState<'chords' | 'notes' | 'caged'>('chords');
  const [selectedChordId, setSelectedChordId] = useState<string>(initialChordId);
  const [notationMode, setNotationMode] = useState<'cipher' | 'solfege'>('cipher'); // C vs Dó
  const [noteFilter, setNoteFilter] = useState<string>('ALL'); // 'ALL', 'NATURALS', or specific note like 'C'
  const [fretCount, setFretCount] = useState<number>(12); // 12 or 15 frets
  const [isLeftHanded, setIsLeftHanded] = useState<boolean>(false);
  const [lastPlayedString, setLastPlayedString] = useState<{ stringIdx: number; fret: number } | null>(null);
  const [isPlayingStrum, setIsPlayingStrum] = useState<boolean>(false);

  const selectedChord = CHORD_DATABASE.find(c => c.id === selectedChordId) || CHORD_DATABASE[0];

  const handleSelectChord = (chord: ChordDefinition) => {
    setSelectedChordId(chord.id);
    if (onSelectChord) onSelectChord(chord);
    // Play sound of chord
    guitarAudio.playChord(chord.frets, 'down', 30, '6to1');
  };

  const handlePlayChordStrum = (direction: 'down' | 'up' | 'arpeggio' = 'down') => {
    setIsPlayingStrum(true);
    guitarAudio.playChord(selectedChord.frets, direction, direction === 'arpeggio' ? 120 : 35, '6to1');
    setTimeout(() => {
      setIsPlayingStrum(false);
    }, direction === 'arpeggio' ? 800 : 350);
  };

  const handleFretClick = (stringIdx: number, fret: number) => {
    setLastPlayedString({ stringIdx, fret });
    guitarAudio.playString(stringIdx, fret, 2.5, 0.9);
    setTimeout(() => {
      setLastPlayedString(prev => (prev?.stringIdx === stringIdx && prev?.fret === fret ? null : prev));
    }, 600);
  };

  // String order according to orientation:
  // String 0 is 1st string (E4 / thin). String 5 is 6th string (E2 / thick).
  const displayedStrings = isLeftHanded 
    ? [...GUITAR_STRINGS].reverse() 
    : [...GUITAR_STRINGS];

  // Helper to determine if a fret marker dot should appear
  const getFretDotType = (fretNum: number): 'single' | 'double' | null => {
    if (fretNum === 12) return 'double';
    if ([3, 5, 7, 9, 15].includes(fretNum)) return 'single';
    return null;
  };

  // Helper to get chord position for a specific string
  // selectedChord.frets is ordered [6th, 5th, 4th, 3rd, 2nd, 1st]
  const getChordFretForString = (stringIndex: number): { fret: number; finger: number; isBass: boolean } => {
    // stringIndex 0 = 1st string (last element in frets array)
    // stringIndex 5 = 6th string (first element in frets array)
    const arrayIdx = 5 - stringIndex;
    const fret = selectedChord.frets[arrayIdx];
    const finger = selectedChord.fingers[arrayIdx];
    const isBass = (6 - stringIndex) === selectedChord.bassString;
    return { fret, finger, isBass };
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#180f08] border border-amber-900/40 p-3 sm:p-4 rounded-2xl shadow-lg">
        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#100a05] rounded-xl border border-amber-950">
          <button
            onClick={() => setActiveTab('chords')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'chords'
                ? 'bg-amber-600 text-white shadow'
                : 'text-amber-200/70 hover:text-amber-100 hover:bg-amber-950/40'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Modelos de Acordes</span>
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-amber-600 text-white shadow'
                : 'text-amber-200/70 hover:text-amber-100 hover:bg-amber-950/40'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Notas no Braço</span>
          </button>
          <button
            onClick={() => setActiveTab('caged')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'caged'
                ? 'bg-amber-600 text-white shadow'
                : 'text-amber-200/70 hover:text-amber-100 hover:bg-amber-950/40'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Sistema CAGED</span>
          </button>
        </div>

        {/* Notation & Left Handed Controls */}
        <div className="flex items-center gap-2">
          {/* Notation switcher */}
          <div className="flex items-center bg-[#100a05] border border-amber-950 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setNotationMode('cipher')}
              className={`px-2.5 py-1.5 rounded font-medium transition cursor-pointer ${
                notationMode === 'cipher' ? 'bg-amber-700/80 text-white' : 'text-amber-300/60 hover:text-amber-200'
              }`}
              title="Cifras Anglo-saxônicas (C, D, E...)"
            >
              C D E
            </button>
            <button
              onClick={() => setNotationMode('solfege')}
              className={`px-2.5 py-1.5 rounded font-medium transition cursor-pointer ${
                notationMode === 'solfege' ? 'bg-amber-700/80 text-white' : 'text-amber-300/60 hover:text-amber-200'
              }`}
              title="Nomes em Português (Dó, Ré, Mi...)"
            >
              Dó Ré Mi
            </button>
          </div>

          {/* Left-handed toggle */}
          <button
            onClick={() => setIsLeftHanded(!isLeftHanded)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
              isLeftHanded 
                ? 'bg-amber-700 text-white border-amber-500' 
                : 'bg-[#100a05] border-amber-900/40 text-amber-300/70 hover:text-amber-200'
            }`}
            title="Inverter orientação para canhoto"
          >
            {isLeftHanded ? 'Canhoto' : 'Destro'}
          </button>
        </div>
      </div>

      {/* Mode 1: Chord selector pills when chords tab is active */}
      {activeTab === 'chords' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-amber-300/80">
            <span>Selecione um acorde para visualizar a digitação e ouvir:</span>
            <span className="text-[11px] text-amber-400">Pressione qualquer casa para tocar individualmente</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {CHORD_DATABASE.map(chord => {
              const isSelected = chord.id === selectedChordId;
              return (
                <button
                  key={chord.id}
                  onClick={() => handleSelectChord(chord)}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-300 shadow-amber-500/30'
                      : 'bg-[#21150c] text-amber-100 hover:bg-amber-900/50 border border-amber-800/30'
                  }`}
                >
                  <span>{chord.cipher}</span>
                  <span className={`text-[11px] font-normal ${isSelected ? 'text-stone-900' : 'text-amber-400/70'}`}>
                    {chord.name.replace(' Maior', '')}
                  </span>
                  {chord.barreFret && (
                    <span className="text-[9px] px-1 rounded bg-amber-800/60 text-amber-200">
                      Pestana
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Strum action bar for selected chord */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-[#21150c] to-[#170e07] border border-amber-700/30 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600/30 border border-amber-500/40 flex items-center justify-center font-extrabold text-amber-300 text-lg">
                {selectedChord.cipher}
              </div>
              <div>
                <h4 className="font-bold text-amber-100 text-sm">{selectedChord.name}</h4>
                <p className="text-xs text-amber-300/80">{selectedChord.tips}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePlayChordStrum('down')}
                disabled={isPlayingStrum}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition cursor-pointer shadow-md disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Tocar Acorde (↓)</span>
              </button>
              <button
                onClick={() => handlePlayChordStrum('arpeggio')}
                disabled={isPlayingStrum}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-900/50 hover:bg-amber-900/80 border border-amber-700/50 text-amber-200 font-semibold text-xs transition cursor-pointer disabled:opacity-50"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Dedilhar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Notes Explorer controls when notes tab is active */}
      {activeTab === 'notes' && (
        <div className="space-y-3 bg-[#180f08] p-4 rounded-xl border border-amber-900/30">
          <div className="flex items-center justify-between text-xs text-amber-200">
            <span className="font-semibold text-amber-300">Filtrar notas no braço:</span>
            <span>Clique nas notas para ouvir o som exato</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setNoteFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                noteFilter === 'ALL'
                  ? 'bg-amber-500 text-stone-950'
                  : 'bg-[#24170d] text-amber-200 hover:bg-amber-900/40 border border-amber-800/30'
              }`}
            >
              Todas as Notas
            </button>
            <button
              onClick={() => setNoteFilter('NATURALS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                noteFilter === 'NATURALS'
                  ? 'bg-amber-500 text-stone-950'
                  : 'bg-[#24170d] text-amber-200 hover:bg-amber-900/40 border border-amber-800/30'
              }`}
            >
              Naturais (Sem #)
            </button>
            {CHROMATIC_NOTES.map(note => {
              const label = notationMode === 'solfege' ? NOTE_PT_MAP[note] : note;
              const isSelected = noteFilter === note;
              return (
                <button
                  key={note}
                  onClick={() => setNoteFilter(note)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-stone-950 ring-2 ring-amber-200'
                      : 'bg-[#24170d] text-amber-200 hover:bg-amber-900/40 border border-amber-800/30'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode 3: CAGED overview when caged tab is active */}
      {activeTab === 'caged' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
          {CAGED_SYSTEM_MODELS.map(model => (
            <div 
              key={model.shape}
              className="p-3 bg-[#191009] border border-amber-900/40 rounded-xl hover:border-amber-600/60 transition"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-7 h-7 rounded-lg bg-amber-600 text-white font-extrabold flex items-center justify-center text-sm">
                  {model.shape}
                </span>
                <span className="font-bold text-xs text-amber-200">{model.name}</span>
              </div>
              <p className="text-[11px] text-amber-400/90 font-medium mb-1">Raiz: {model.rootString}</p>
              <p className="text-[11px] text-amber-200/70 leading-relaxed">{model.explanation}</p>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================
          THE INTERACTIVE FRETBOARD (BRAÇO DO VIOLÃO)
          ======================================================== */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-amber-800/50 bg-[#28180e] shadow-2xl p-2 sm:p-4">
        {/* Subtle wood grain background styling */}
        <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-amber-700 scrollbar-track-stone-900">
          <div className="min-w-[780px]">
            {/* Header: Fret numbers & Top String Indicators */}
            <div className="grid grid-cols-[80px_repeat(12,1fr)] gap-0 text-center text-xs font-mono mb-2">
              <div className="text-amber-400/70 text-[11px] uppercase tracking-wider font-sans font-bold flex items-center justify-center">
                Cordas
              </div>
              {Array.from({ length: fretCount }, (_, i) => i + 1).map(fretNum => (
                <div key={fretNum} className="text-amber-400/80 font-bold text-xs flex flex-col items-center">
                  <span>{fretNum}ª</span>
                  {/* Fret marker dot preview */}
                  <span className="h-2">
                    {getFretDotType(fretNum) === 'single' && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-300/40" />
                    )}
                    {getFretDotType(fretNum) === 'double' && (
                      <span className="inline-flex gap-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-300/60" />
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-300/60" />
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>

            {/* The Guitar Neck Canvas Area */}
            <div className="relative rounded-xl border border-amber-950/80 bg-gradient-to-b from-[#2a170b] via-[#3d2212] to-[#251409] shadow-inner py-1">
              {/* Mother-of-pearl fret markers embedded in the neck wood */}
              {Array.from({ length: fretCount }, (_, i) => i + 1).map(fretNum => {
                const dotType = getFretDotType(fretNum);
                if (!dotType) return null;
                // Compute column positioning percentage
                const leftPercent = ((fretNum - 0.5) / fretCount) * 100;
                return (
                  <div
                    key={`dot-${fretNum}`}
                    className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                    style={{
                      left: `calc(80px + (100% - 80px) * ${((fretNum - 0.5) / fretCount)})`,
                      top: '50%',
                    }}
                  >
                    {dotType === 'single' ? (
                      <div className="w-3.5 h-3.5 rounded-full bg-amber-100/30 border border-amber-200/40 shadow-inner" />
                    ) : (
                      <div className="flex flex-col gap-8">
                        <div className="w-3 h-3 rounded-full bg-amber-100/40 border border-amber-200/50 shadow-inner" />
                        <div className="w-3 h-3 rounded-full bg-amber-100/40 border border-amber-200/50 shadow-inner" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Barre indicator visual band if applicable */}
              {activeTab === 'chords' && selectedChord.barreFret && (
                <div
                  className="absolute pointer-events-none rounded-full bg-amber-400/25 border-2 border-amber-300/60 z-10 transition-all duration-300"
                  style={{
                    left: `calc(80px + (100% - 80px) * ${((selectedChord.barreFret - 0.72) / fretCount)})`,
                    width: `calc((100% - 80px) / ${fretCount} * 0.44)`,
                    top: '8px',
                    bottom: '8px',
                  }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-amber-200 bg-stone-950/80 px-1 py-0.5 rounded shadow">
                    Pestana
                  </div>
                </div>
              )}

              {/* 6 Guitar Strings Rows */}
              {displayedStrings.map((stringInfo, visualRowIndex) => {
                const realStringIndex = stringInfo.index; // 0 (1ª) to 5 (6ª)
                const chordState = getChordFretForString(realStringIndex);
                
                // String visual gauge thickness: 6ª is 3.5px, 1ª is 1.2px
                const stringThickness = 1.2 + (5 - realStringIndex) * 0.45;
                const isBassRoot = chordState.isBass && activeTab === 'chords';

                return (
                  <div
                    key={stringInfo.name}
                    className="grid grid-cols-[80px_repeat(12,1fr)] gap-0 relative items-center group h-11"
                  >
                    {/* The Metallic Guitar String Line running horizontally across the neck */}
                    <div
                      className="absolute left-[80px] right-0 pointer-events-none z-0 transition-all duration-150"
                      style={{
                        height: `${stringThickness}px`,
                        backgroundColor: realStringIndex >= 3 ? '#e6b880' : '#f0f0f0',
                        boxShadow: lastPlayedString?.stringIdx === realStringIndex 
                          ? '0 0 10px #f59e0b, 0 0 4px #fbbf24' 
                          : '0 1px 2px rgba(0,0,0,0.8)',
                      }}
                    />

                    {/* Column 0: Nut / Open String / Mute Indicator */}
                    <div className="flex items-center justify-between pr-2 border-r-4 border-[#e2d5c3] bg-[#1a0f07] h-full z-10 select-none px-2 shadow">
                      {/* String indicator (e.g. "6ª Mi") */}
                      <button
                        onClick={() => handleFretClick(realStringIndex, 0)}
                        className="text-[11px] font-bold text-amber-200 hover:text-white text-left transition flex flex-col cursor-pointer"
                        title="Tocar corda solta"
                      >
                        <span className="text-[10px] text-amber-400/80 font-normal">{stringInfo.number}ª</span>
                        <span>{stringInfo.cipher}</span>
                      </button>

                      {/* In Chord Mode: Show X (mute), O (open), or Bass indicator */}
                      {activeTab === 'chords' && (
                        <div className="flex items-center">
                          {chordState.fret === -1 && (
                            <span className="w-5 h-5 rounded-full bg-red-950 border border-red-500/70 text-red-400 text-xs font-bold flex items-center justify-center">
                              ✕
                            </span>
                          )}
                          {chordState.fret === 0 && (
                            <span className={`w-5 h-5 rounded-full border text-xs font-bold flex items-center justify-center ${
                              isBassRoot 
                                ? 'bg-amber-500 text-stone-950 border-amber-300 font-extrabold shadow-sm ring-1 ring-amber-300' 
                                : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/70'
                            }`}>
                              {isBassRoot ? '𝄢' : 'O'}
                            </span>
                          )}
                          {chordState.fret > 0 && isBassRoot && (
                            <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 border border-amber-200 text-xs font-bold flex items-center justify-center" title="Baixo principal do acorde">
                              𝄢
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Columns 1 to 12: Frets */}
                    {Array.from({ length: fretCount }, (_, fretIdx) => {
                      const fretNum = fretIdx + 1;
                      const noteInfo = getNoteAtFret(realStringIndex, fretNum);
                      const isPlayedHere = lastPlayedString?.stringIdx === realStringIndex && lastPlayedString?.fret === fretNum;
                      
                      // Chord mode logic:
                      const isChordFingerHere = activeTab === 'chords' && chordState.fret === fretNum;
                      
                      // Notes mode logic:
                      let shouldHighlightNote = false;
                      if (activeTab === 'notes') {
                        if (noteFilter === 'ALL') {
                          shouldHighlightNote = true;
                        } else if (noteFilter === 'NATURALS') {
                          shouldHighlightNote = noteInfo.isNatural;
                        } else if (noteFilter === noteInfo.note) {
                          shouldHighlightNote = true;
                        }
                      }

                      const noteDisplay = notationMode === 'solfege' ? noteInfo.notePt : noteInfo.note;

                      return (
                        <button
                          key={fretNum}
                          onClick={() => handleFretClick(realStringIndex, fretNum)}
                          className={`relative h-full border-r border-[#6f5643] hover:bg-amber-500/20 transition-colors flex items-center justify-center z-10 cursor-pointer ${
                            isPlayedHere ? 'bg-amber-500/40 ring-1 ring-amber-300' : ''
                          }`}
                          title={`${stringInfo.number}ª corda, ${fretNum}ª casa: ${noteDisplay}`}
                        >
                          {/* Chord Mode Finger Circle */}
                          {isChordFingerHere && (
                            <div className={`relative z-20 w-7 h-7 rounded-full shadow-lg flex items-center justify-center font-bold text-xs transform transition-transform hover:scale-110 ${
                              isBassRoot 
                                ? 'bg-amber-400 text-stone-950 ring-2 ring-amber-200 shadow-amber-400/50' 
                                : 'bg-amber-600 text-white ring-2 ring-amber-300 shadow-amber-700/60'
                            }`}>
                              {chordState.finger > 0 ? chordState.finger : '●'}
                            </div>
                          )}

                          {/* Notes Mode Marker */}
                          {activeTab === 'notes' && shouldHighlightNote && (
                            <div className={`relative z-20 px-1.5 py-0.5 rounded-md text-[11px] font-bold shadow-sm transition ${
                              noteFilter === noteInfo.note
                                ? 'bg-amber-400 text-stone-950 ring-2 ring-amber-200'
                                : noteInfo.isNatural
                                ? 'bg-stone-900/90 text-amber-200 border border-amber-500/40'
                                : 'bg-stone-950/70 text-amber-400/80 border border-amber-900/40'
                            }`}>
                              {noteDisplay}
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
        </div>

        {/* Legend / Guide Bar */}
        <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-amber-300/80 pt-2 border-t border-amber-900/40">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center">1-4</span>
              <span>Dedo (1=Indicador, 2=Médio, 3=Anelar, 4=Mínimo)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-amber-500 text-stone-950 text-[10px] font-extrabold flex items-center justify-center">𝄢</span>
              <span>Baixo do Acorde (Bordão principal)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-950 border border-emerald-500/60 text-emerald-300 text-[10px] font-bold flex items-center justify-center">O</span>
              <span>Corda Solta</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-red-950 border border-red-500/60 text-red-400 text-[10px] font-bold flex items-center justify-center">✕</span>
              <span>Não tocar</span>
            </span>
          </div>

          <div className="text-[11px] text-amber-400/70 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Sintetizador acústico ativo sem internet</span>
          </div>
        </div>
      </div>
    </div>
  );
};
