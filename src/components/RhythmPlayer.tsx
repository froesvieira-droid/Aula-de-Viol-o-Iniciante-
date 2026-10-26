import React, { useState, useEffect, useRef } from 'react';
import { RHYTHM_PATTERNS, RhythmPattern, StrumStep } from '../data/rhythmData';
import { CHORD_DATABASE, ChordDefinition } from '../data/guitarData';
import { guitarAudio } from '../services/guitarAudio';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Music, 
  Disc, 
  Lightbulb, 
  Flame, 
  Timer,
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface RhythmPlayerProps {
  initialRhythmId?: string;
  onSelectChordToView?: (chordId: string) => void;
}

export const RhythmPlayer: React.FC<RhythmPlayerProps> = ({ 
  initialRhythmId = 'sertanejo-universitario',
  onSelectChordToView 
}) => {
  const [selectedRhythmId, setSelectedRhythmId] = useState<string>(initialRhythmId);
  const rhythm = RHYTHM_PATTERNS.find(r => r.id === selectedRhythmId) || RHYTHM_PATTERNS[0];

  const [bpm, setBpm] = useState<number>(rhythm.defaultBpm);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(-1);
  const [currentChordIndex, setCurrentChordIndex] = useState<number>(0);
  const [enableMetronome, setEnableMetronome] = useState<boolean>(true);
  const [enableGuitarAudio, setEnableGuitarAudio] = useState<boolean>(true);
  
  // Custom chord progression
  const [customProgression, setCustomProgression] = useState<string[]>(rhythm.demoChords);

  // Sync default progression when rhythm changes
  useEffect(() => {
    setBpm(rhythm.defaultBpm);
    setCustomProgression(rhythm.demoChords);
    setCurrentChordIndex(0);
    setCurrentStepIdx(-1);
    if (isPlaying) {
      stopPlayback();
    }
  }, [selectedRhythmId]);

  // Tap tempo tracking
  const tapTimesRef = useRef<number[]>([]);
  const handleTapTempo = () => {
    const now = performance.now();
    const taps = tapTimesRef.current.filter(t => now - t < 3000);
    taps.push(now);
    tapTimesRef.current = taps;

    if (taps.length >= 2) {
      const intervals = [];
      for (let i = 1; i < taps.length; i++) {
        intervals.push(taps[i] - taps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      if (calculatedBpm >= rhythm.minBpm && calculatedBpm <= rhythm.maxBpm) {
        setBpm(calculatedBpm);
      }
    }
  };

  // Playback timer loop
  const timerRef = useRef<number | null>(null);
  const activeStepRef = useRef<number>(0);
  const activeChordRef = useRef<number>(0);

  const startPlayback = () => {
    setIsPlaying(true);
    activeStepRef.current = 0;
    activeChordRef.current = 0;
    setCurrentStepIdx(0);
    setCurrentChordIndex(0);

    const stepCount = rhythm.steps.length;
    // Calculate interval between 16th or 8th notes based on rhythm time signature
    // In 4/4 with 8 steps, each step is an 8th note: (60 / bpm / 2) seconds
    const intervalMs = (60000 / bpm) / 2;

    const playNextStep = () => {
      const stepIdx = activeStepRef.current;
      const step = rhythm.steps[stepIdx];
      const chordId = customProgression[activeChordRef.current] || 'g';
      const chordObj = CHORD_DATABASE.find(c => c.id === chordId) || CHORD_DATABASE[0];

      // Audio trigger
      if (enableMetronome && (step.beat % 1 === 0 || stepIdx === 0)) {
        guitarAudio.playClick(step.beat === 1);
      }

      if (enableGuitarAudio) {
        if (step.action === 'mute') {
          guitarAudio.playMuteSlap(0.85);
        } else if (step.action === 'bass') {
          // Play just the bass string
          const bassStringIdx = 6 - chordObj.bassString; // e.g. 6 - 5 = 1 (A2)
          const bassFret = chordObj.frets[5 - bassStringIdx];
          guitarAudio.playString(bassStringIdx, bassFret >= 0 ? bassFret : 0, 1.8, 0.95);
        } else if (step.action === 'pluck') {
          // Pluck top 3 strings together for Guarania / Xote
          [0, 1, 2].forEach(sIdx => {
            const fret = chordObj.frets[5 - sIdx];
            if (fret >= 0) guitarAudio.playString(sIdx, fret, 1.6, 0.75);
          });
        } else if (step.action === 'down') {
          guitarAudio.playChord(chordObj.frets, 'down', 22, '6to1');
        } else if (step.action === 'up') {
          guitarAudio.playChord(chordObj.frets, 'up', 20, '6to1');
        }
      }

      setCurrentStepIdx(stepIdx);

      // Advance step
      let nextStep = stepIdx + 1;
      if (nextStep >= stepCount) {
        nextStep = 0;
        // Advance chord progression
        const nextChordIdx = (activeChordRef.current + 1) % customProgression.length;
        activeChordRef.current = nextChordIdx;
        setCurrentChordIndex(nextChordIdx);
      }
      activeStepRef.current = nextStep;

      timerRef.current = window.setTimeout(playNextStep, intervalMs);
    };

    playNextStep();
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setCurrentStepIdx(-1);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // When BPM updates while playing, restart loop with new tempo
  useEffect(() => {
    if (isPlaying) {
      stopPlayback();
      startPlayback();
    }
  }, [bpm]);

  return (
    <div className="space-y-6">
      {/* Category & Rhythm Picker Tabs */}
      <div className="flex flex-wrap gap-2">
        {RHYTHM_PATTERNS.map(p => {
          const isSelected = p.id === selectedRhythmId;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedRhythmId(p.id)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer shadow-sm ${
                isSelected
                  ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-300 shadow-amber-500/20'
                  : 'bg-[#1c120a] text-amber-200 hover:bg-amber-900/40 border border-amber-900/40'
              }`}
            >
              <span>{p.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${isSelected ? 'bg-stone-950/20 text-stone-900' : 'bg-amber-950 text-amber-400'}`}>
                {p.timeSignature}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Rhythm Control Console */}
      <div className="bg-gradient-to-b from-[#21150c] to-[#160d07] border border-amber-800/40 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6">
        {/* Header: Name, description & Time Signature */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-amber-900/40">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-amber-600/30 text-amber-300 font-bold text-xs uppercase tracking-wider border border-amber-500/30">
                {rhythm.category.toUpperCase()}
              </span>
              <span className="text-amber-400 font-mono text-xs font-semibold">
                Compasso {rhythm.timeSignature}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-amber-100">{rhythm.name}</h2>
            <p className="text-xs sm:text-sm text-amber-200/80 mt-1 max-w-2xl">{rhythm.description}</p>
          </div>

          {/* Quick Play & Metronome Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlayback}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-extrabold text-sm sm:text-base shadow-xl transition-all cursor-pointer transform hover:scale-105 ${
                isPlaying
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/40'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-amber-600/40'
              }`}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              <span>{isPlaying ? 'Pausar Batida' : 'Ouvir Batida'}</span>
            </button>
          </div>
        </div>

        {/* BPM & Metronome Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-[#130b06] p-4 rounded-xl border border-amber-950">
          {/* BPM Slider */}
          <div className="sm:col-span-2 space-y-2">
            <div className="flex items-center justify-between text-xs text-amber-200">
              <span className="flex items-center gap-1.5 font-bold text-amber-300">
                <Timer className="w-4 h-4 text-amber-400" />
                Andamento (BPM):
              </span>
              <span className="font-mono text-base font-extrabold text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-800/40">
                {bpm} BPM
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-amber-400/60 font-mono">{rhythm.minBpm}</span>
              <input
                type="range"
                min={rhythm.minBpm}
                max={rhythm.maxBpm}
                value={bpm}
                onChange={e => setBpm(Number(e.target.value))}
                className="w-full accent-amber-500 h-2 bg-stone-900 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] text-amber-400/60 font-mono">{rhythm.maxBpm}</span>
            </div>
          </div>

          {/* Tap Tempo & Toggles */}
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleTapTempo}
              className="px-3 py-2 rounded-xl bg-amber-950 border border-amber-700/50 hover:bg-amber-900 text-amber-200 text-xs font-semibold transition cursor-pointer active:scale-95"
              title="Toque repetidamente no ritmo que você deseja para ajustar o BPM"
            >
              Tap Tempo
            </button>
            <button
              onClick={() => setEnableMetronome(!enableMetronome)}
              className={`p-2 rounded-xl border text-xs transition cursor-pointer ${
                enableMetronome
                  ? 'bg-amber-700/60 text-amber-100 border-amber-500'
                  : 'bg-stone-900 text-stone-500 border-stone-800'
              }`}
              title="Ativar/desativar clique do metrônomo"
            >
              <Disc className="w-4 h-4" />
            </button>
            <button
              onClick={() => setEnableGuitarAudio(!enableGuitarAudio)}
              className={`p-2 rounded-xl border text-xs transition cursor-pointer ${
                enableGuitarAudio
                  ? 'bg-amber-700/60 text-amber-100 border-amber-500'
                  : 'bg-stone-900 text-stone-500 border-stone-800'
              }`}
              title="Ativar/desativar som de violão"
            >
              {enableGuitarAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ========================================================
            INTERACTIVE RHYTHM TRACK (AS SETAS E MOVIMENTOS)
            ======================================================== */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-amber-300">
            <span className="font-bold flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              Movimento Rítmico da Mão Direita:
            </span>
            <span className="text-[11px] text-amber-400/80">
              {isPlaying ? 'Acompanhe as setas iluminadas no tempo!' : 'Pressione "Ouvir Batida" para iniciar'}
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 overflow-x-auto pb-1">
            {rhythm.steps.map((step, idx) => {
              const isCurrent = isPlaying && currentStepIdx === idx;
              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-100 transform ${
                    isCurrent
                      ? 'bg-gradient-to-b from-amber-400 to-amber-500 border-white text-stone-950 scale-105 shadow-xl shadow-amber-500/50'
                      : step.isAccent
                      ? 'bg-[#2a1a0f] border-amber-600/60 text-amber-100'
                      : 'bg-[#180f08] border-amber-900/30 text-amber-200/80'
                  }`}
                >
                  {/* Step beat label */}
                  <span className={`text-[10px] font-mono font-bold mb-1 ${isCurrent ? 'text-stone-900' : 'text-amber-400/70'}`}>
                    Tempo {step.beat}
                  </span>

                  {/* Main Action Symbol (Arrow / Slap / Bass) */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl font-black mb-1 ${
                    isCurrent 
                      ? 'bg-stone-950 text-amber-400' 
                      : step.action === 'mute'
                      ? 'bg-red-950/70 text-red-400 border border-red-800/40'
                      : step.action === 'bass'
                      ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40'
                      : 'bg-[#120a05] text-amber-200'
                  }`}>
                    {step.symbol}
                  </div>

                  {/* Label: Desce / Sobe / Abafa */}
                  <span className={`text-xs font-bold ${isCurrent ? 'text-stone-950' : 'text-amber-200'}`}>
                    {step.label}
                  </span>

                  {/* Finger recommendation: P, I, Palma */}
                  <span className={`text-[10px] ${isCurrent ? 'text-stone-800 font-semibold' : 'text-amber-400/70'}`}>
                    {step.finger}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chord Progression Synchronizer */}
        <div className="bg-[#170e08] border border-amber-900/40 p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <Music className="w-4 h-4 text-amber-400" />
              Sequência de Acordes para Praticar:
            </span>
            <span className="text-[11px] text-amber-400/70">
              O acorde muda automaticamente a cada compasso
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {customProgression.map((chordId, idx) => {
              const chord = CHORD_DATABASE.find(c => c.id === chordId) || CHORD_DATABASE[0];
              const isCurrentChord = isPlaying && currentChordIndex === idx;

              return (
                <div
                  key={`${chordId}-${idx}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                    isCurrentChord
                      ? 'bg-amber-500 text-stone-950 border-white ring-2 ring-amber-300 font-extrabold shadow-lg scale-105'
                      : 'bg-[#22150c] text-amber-200 border-amber-800/40'
                  }`}
                >
                  <span className="text-sm font-bold">{chord.cipher}</span>
                  <span className={`text-[11px] ${isCurrentChord ? 'text-stone-900 font-semibold' : 'text-amber-400/80'}`}>
                    ({chord.name.replace(' Maior', '')})
                  </span>
                  {onSelectChordToView && (
                    <button
                      onClick={() => onSelectChordToView(chord.id)}
                      className="ml-1 text-[10px] underline text-amber-300 hover:text-white cursor-pointer"
                      title="Ver posição no braço"
                    >
                      Ver
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mão Direita Didactic Guide & Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Technique box */}
          <div className="p-4 bg-[#140c06] rounded-xl border border-amber-900/30 space-y-2">
            <h4 className="font-bold text-amber-300 text-xs sm:text-sm flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              Técnica da Mão Direita ({rhythm.name})
            </h4>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              {rhythm.rightHandTechnique}
            </p>
            <ul className="text-xs text-amber-300/80 space-y-1.5 list-disc pl-4 pt-1">
              {rhythm.didacticTips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>

          {/* Famous Songs Box */}
          <div className="p-4 bg-[#140c06] rounded-xl border border-amber-900/30 space-y-2">
            <h4 className="font-bold text-amber-300 text-xs sm:text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              Músicas Clássicas Neste Ritmo
            </h4>
            <div className="space-y-1.5 pt-1">
              {rhythm.famousSongs.map((song, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#1c120a] border border-amber-950 text-xs"
                >
                  <div>
                    <span className="font-bold text-amber-100">{song.title}</span>
                    <span className="text-amber-400/70 text-[11px] block">{song.artist}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-900/50 text-amber-300 font-mono text-[11px] border border-amber-800/40">
                    Tom: {song.key}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
