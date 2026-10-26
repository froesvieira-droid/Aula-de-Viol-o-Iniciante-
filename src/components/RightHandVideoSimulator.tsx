import React, { useState, useEffect, useRef } from 'react';
import { RHYTHM_VIDEO_TUTORIALS, RhythmVideoTutorial, HandStepFrame } from '../data/rhythmVideoData';
import { RHYTHM_PATTERNS } from '../data/rhythmData';
import { guitarAudio } from '../services/guitarAudio';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Video, 
  Eye, 
  Gauge, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Lightbulb,
  Layers,
  Volume2,
  VolumeX,
  Flame,
  ShieldCheck
} from 'lucide-react';

interface RightHandVideoSimulatorProps {
  currentRhythmId?: string;
  onSelectRhythm?: (rhythmId: string) => void;
  onOpenFullRhythmPlayer?: (rhythmId: string) => void;
}

export const RightHandVideoSimulator: React.FC<RightHandVideoSimulatorProps> = ({
  currentRhythmId = 'sertanejo-universitario',
  onSelectRhythm,
  onOpenFullRhythmPlayer,
}) => {
  const [selectedRhythmId, setSelectedRhythmId] = useState<string>(currentRhythmId);
  const [viewMode, setViewMode] = useState<'simulator' | 'video'>('simulator');
  const [cameraAngle, setCameraAngle] = useState<'pov' | 'frontal'>('pov');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.5);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentFrameIdx, setCurrentFrameIdx] = useState<number>(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);

  useEffect(() => {
    setSelectedRhythmId(currentRhythmId);
  }, [currentRhythmId]);

  const tutorial = RHYTHM_VIDEO_TUTORIALS[selectedRhythmId] || RHYTHM_VIDEO_TUTORIALS['sertanejo-universitario'];
  const rhythmPattern = RHYTHM_PATTERNS.find(r => r.id === selectedRhythmId) || RHYTHM_PATTERNS[0];
  const frames = tutorial.frames;
  const currentFrame: HandStepFrame = frames[currentFrameIdx] || frames[0];

  const timerRef = useRef<number | null>(null);
  const frameIdxRef = useRef<number>(currentFrameIdx);
  frameIdxRef.current = currentFrameIdx;

  const playStepAudio = (frame: HandStepFrame) => {
    if (!isAudioEnabled) return;
    if (frame.action === 'mute') {
      guitarAudio.playMuteSlap(0.85);
    } else if (frame.action === 'bass') {
      guitarAudio.playString(frame.handPosition.pluckingStrings[0] ?? 5, 0, 1.8, 0.95);
    } else if (frame.action === 'pluck') {
      [0, 1, 2].forEach(s => guitarAudio.playString(s, 0, 1.5, 0.8));
    } else if (frame.action === 'down') {
      guitarAudio.playChord([0, 0, 0, 2, 3, 2], 'down', 25, '6to1');
    } else if (frame.action === 'up') {
      guitarAudio.playChord([0, 0, 0, 2, 3, 2], 'up', 25, '6to1');
    }
  };

  const startAnimation = () => {
    setIsPlaying(true);
    const stepDurationMs = ((60000 / rhythmPattern.defaultBpm) / 2) / playbackSpeed;
    const tick = () => {
      const nextIdx = (frameIdxRef.current + 1) % frames.length;
      setCurrentFrameIdx(nextIdx);
      playStepAudio(frames[nextIdx]);
      timerRef.current = window.setTimeout(tick, stepDurationMs);
    };
    playStepAudio(frames[currentFrameIdx]);
    timerRef.current = window.setTimeout(tick, stepDurationMs);
  };

  const stopAnimation = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const togglePlayback = () => {
    if (isPlaying) stopAnimation();
    else startAnimation();
  };

  useEffect(() => {
    if (isPlaying) {
      stopAnimation();
      startAnimation();
    }
  }, [playbackSpeed, selectedRhythmId]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleManualStep = (direction: 'prev' | 'next') => {
    stopAnimation();
    const newIdx = direction === 'next'
      ? (currentFrameIdx + 1) % frames.length
      : (currentFrameIdx - 1 + frames.length) % frames.length;
    setCurrentFrameIdx(newIdx);
    playStepAudio(frames[newIdx]);
  };

  const handleSelectRhythmTab = (id: string) => {
    stopAnimation();
    setSelectedRhythmId(id);
    setCurrentFrameIdx(0);
    if (onSelectRhythm) onSelectRhythm(id);
  };

  const handPos = currentFrame.handPosition;
  const isPOV = cameraAngle === 'pov';
  const handTranslateY = handPos.yOffset;
  const handRotation = isPOV ? handPos.rotation : -handPos.rotation;
  const thumbOffset = handPos.thumbAngle;
  const fingersCurl = handPos.fingersCurl;
  const isMuting = handPos.palmContact;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-amber-950/70 via-[#1c120a] to-[#140c06] border-2 border-amber-600/40 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-900/40">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-md">
                <Video className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Vídeos & Movimentos da Mão Direita
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                <ShieldCheck className="w-3 h-3" />
                Offline
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Demonstração em Vídeo dos Ritmos Mais Comuns
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/80">
              Assista ao movimento real dos dedos (P, I, M, A) e da palma nas 6 cordas com câmera lenta e visão do aluno.
            </p>
          </div>

          <div className="flex items-center bg-[#100a05] p-1 rounded-xl border border-amber-950 flex-shrink-0">
            <button
              onClick={() => setViewMode('simulator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'simulator' ? 'bg-amber-600 text-white shadow' : 'text-amber-300/70 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Simulador 60 FPS</span>
            </button>
            <button
              onClick={() => setViewMode('video')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'video' ? 'bg-amber-600 text-white shadow' : 'text-amber-300/70 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Vídeo Real</span>
            </button>
          </div>
        </div>

        {/* Rhythm Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {Object.keys(RHYTHM_VIDEO_TUTORIALS).map(id => {
            const isSelected = id === selectedRhythmId;
            const rItem = RHYTHM_PATTERNS.find(r => r.id === id);
            return (
              <button
                key={id}
                onClick={() => handleSelectRhythmTab(id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-300 font-extrabold shadow-amber-500/20'
                    : 'bg-[#20130a] text-amber-200 hover:bg-amber-900/40 border border-amber-900/40'
                }`}
              >
                <span>{rItem?.name.split('/')[0] || id}</span>
                <span className={`text-[10px] px-1 py-0.2 rounded ${isSelected ? 'bg-stone-950/20 text-stone-900' : 'bg-amber-950 text-amber-400'}`}>
                  {rItem?.timeSignature}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Simulator Mode */}
      {viewMode === 'simulator' && (
        <div className="bg-gradient-to-b from-[#22150c] to-[#140b05] border border-amber-800/40 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-amber-900/40">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-amber-300 flex items-center gap-1">
                <Layers className="w-4 h-4 text-amber-400" />
                Câmera:
              </span>
              <div className="flex items-center bg-[#100a05] border border-amber-950 rounded-lg p-0.5">
                <button
                  onClick={() => setCameraAngle('pov')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition ${
                    cameraAngle === 'pov' ? 'bg-amber-700 text-white' : 'text-amber-400/70 hover:text-amber-200'
                  }`}
                >
                  Visão do Aluno (POV)
                </button>
                <button
                  onClick={() => setCameraAngle('frontal')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition ${
                    cameraAngle === 'frontal' ? 'bg-amber-700 text-white' : 'text-amber-400/70 hover:text-amber-200'
                  }`}
                >
                  Visão Frontal
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-amber-300 flex items-center gap-1">
                <Gauge className="w-4 h-4 text-amber-400" />
                Câmera Lenta:
              </span>
              <div className="flex items-center bg-[#100a05] border border-amber-950 rounded-lg p-0.5">
                {[0.25, 0.5, 0.75, 1.0].map(speed => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2 py-1 rounded text-xs font-bold transition cursor-pointer ${
                      playbackSpeed === speed ? 'bg-amber-500 text-stone-950' : 'text-amber-400/70 hover:text-white'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                className={`p-1.5 rounded-lg border text-xs cursor-pointer ml-2 transition ${
                  isAudioEnabled ? 'bg-amber-700/60 text-white border-amber-500' : 'bg-stone-900 text-stone-500 border-stone-800'
                }`}
                title="Som das cordas"
              >
                {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* SVG Canvas Area */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-amber-800/60 bg-gradient-to-br from-[#1d1007] via-[#2c170a] to-[#120803] p-4 sm:p-6 shadow-2xl flex flex-col items-center select-none">
            {/* Action HUD */}
            <div className="w-full flex items-center justify-between gap-2 mb-3 bg-[#100703]/90 border border-amber-600/30 p-3 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 font-black text-xl flex items-center justify-center shadow-md">
                  {currentFrame.action === 'mute' ? '✕' : currentFrame.action === 'bass' ? '𝄢' : currentFrame.action === 'pluck' ? '↗' : currentFrame.action === 'down' ? '↓' : '↑'}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm sm:text-base text-amber-100">
                      {currentFrame.fingerCallout}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 font-mono border border-amber-800">
                      Tempo {currentFrame.beat}
                    </span>
                  </div>
                  <p className="text-xs text-amber-300/80">
                    {currentFrame.narrativeDescription}
                  </p>
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <span className="text-[10px] text-amber-400 font-mono block">Passo {currentFrameIdx + 1} de {frames.length}</span>
                <span className="text-xs text-emerald-400 font-bold">{currentFrame.keyRule}</span>
              </div>
            </div>

            {/* SVG Visualizer */}
            <div className="relative w-full max-w-2xl h-[280px] sm:h-[320px] bg-[#221208] rounded-2xl border border-amber-950 overflow-hidden shadow-inner flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <radialGradient id="rosetteRing" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#080402" />
                    <stop offset="65%" stopColor="#140a05" />
                    <stop offset="78%" stopColor="#e5a659" />
                    <stop offset="84%" stopColor="#633211" />
                    <stop offset="90%" stopColor="#f5d69f" />
                    <stop offset="100%" stopColor="#2b1509" />
                  </radialGradient>
                  <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f4c29d" />
                    <stop offset="50%" stopColor="#df9c74" />
                    <stop offset="100%" stopColor="#b46e48" />
                  </linearGradient>
                </defs>

                <rect width="600" height="300" fill="#2d170b" />
                <circle cx="280" cy="150" r="110" fill="url(#rosetteRing)" stroke="#a15822" strokeWidth="4" />
                <circle cx="280" cy="150" r="88" fill="#0c0603" />

                <rect x="520" y="35" width="28" height="230" rx="6" fill="#1b0e07" stroke="#4a250e" strokeWidth="2" />
                <rect x="526" y="45" width="6" height="210" rx="3" fill="#faf2e6" />

                {[
                  { num: 6, name: '6ª Mi', y: 50, gauge: 3.4, color: '#d89c56' },
                  { num: 5, name: '5ª Lá', y: 72, gauge: 3.0, color: '#e0ab6c' },
                  { num: 4, name: '4ª Ré', y: 94, gauge: 2.6, color: '#eec289' },
                  { num: 3, name: '3ª Sol', y: 116, gauge: 2.0, color: '#f3e1cc' },
                  { num: 2, name: '2ª Si', y: 138, gauge: 1.6, color: '#ffffff' },
                  { num: 1, name: '1ª Mi', y: 160, gauge: 1.2, color: '#ffffff' },
                ].map((str, sIdx) => {
                  const isVibrating = currentFrame.handPosition.pluckingStrings.includes(5 - sIdx);
                  return (
                    <g key={str.num}>
                      <text x="30" y={str.y + 4} fill="#fde68a" fontSize="10" fontFamily="monospace" fontWeight="bold" opacity="0.8">
                        {str.num}ª {str.name.split(' ')[1]}
                      </text>
                      {isVibrating ? (
                        <path d={`M 90,${str.y} Q 280,${str.y - 6} 470,${str.y} T 526,${str.y}`} fill="none" stroke="#fbbf24" strokeWidth={str.gauge + 1.5} className="animate-pulse" />
                      ) : (
                        <line x1="90" y1={str.y} x2="526" y2={str.y} stroke={str.color} strokeWidth={str.gauge} strokeOpacity={isMuting ? 0.35 : 0.9} />
                      )}
                    </g>
                  );
                })}

                {/* Slap banner */}
                {isMuting && (
                  <g>
                    <ellipse cx="360" cy="115" rx="45" ry="70" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="6,4" className="animate-ping" />
                    <text x="360" y="120" textAnchor="middle" fill="#fef08a" fontSize="16" fontWeight="bold" fontFamily="sans-serif">
                      ✕ SLAP!
                    </text>
                  </g>
                )}

                {/* Hand Graphic */}
                <g transform={`translate(340, ${110 + handTranslateY}) rotate(${handRotation}, 0, 0)`} className="transition-transform duration-150 ease-out">
                  <path d="M 160,-20 L 70,-10 C 50,-5 40,5 20,10 L 20,70 C 40,75 55,85 160,95 Z" fill="url(#skinGrad)" stroke="#8c4722" strokeWidth="2" opacity="0.9" />
                  <path d="M 40,12 C 45,35 45,55 40,68" fill="none" stroke="#aa5e34" strokeWidth="1.5" />
                  <path d="M 20,10 C 0,5 -20,15 -35,35 C -45,50 -40,70 -25,85 C -5,95 10,85 20,70 Z" fill="url(#skinGrad)" stroke="#8c4722" strokeWidth="2.5" />

                  {/* Thumb */}
                  <g transform={`rotate(${thumbOffset}, -10, 20)`} className="transition-transform duration-100">
                    <path d="M -15,20 C -25,0 -40,-20 -55,-25 C -65,-28 -72,-20 -65,-10 C -55,5 -40,25 -25,35 Z" fill="url(#skinGrad)" stroke="#8c4722" strokeWidth="2" />
                    <text x="-62" y="-30" fill="#fef3c7" fontSize="11" fontWeight="bold" fontFamily="monospace">P</text>
                  </g>

                  {/* Index */}
                  <g transform={`translate(-35, 30) rotate(${fingersCurl * -25}, 0, 0)`} className="transition-transform duration-100">
                    <path d="M 0,0 C -25,0 -50,5 -65,10 C -72,12 -72,20 -64,22 C -50,22 -25,18 0,14 Z" fill="url(#skinGrad)" stroke="#8c4722" strokeWidth="2" />
                    <text x="-70" y="6" fill="#fef3c7" fontSize="10" fontWeight="bold" fontFamily="monospace">I</text>
                  </g>

                  {/* Middle */}
                  <g transform={`translate(-32, 45) rotate(${fingersCurl * -20}, 0, 0)`} className="transition-transform duration-100">
                    <path d="M 0,0 C -25,2 -55,8 -70,14 C -78,17 -78,24 -68,26 C -55,26 -25,20 0,14 Z" fill="url(#skinGrad)" stroke="#8c4722" strokeWidth="2" />
                    <text x="-75" y="11" fill="#fef3c7" fontSize="10" fontWeight="bold" fontFamily="monospace">M</text>
                  </g>

                  {/* Ring */}
                  <g transform={`translate(-28, 60) rotate(${fingersCurl * -15}, 0, 0)`} className="transition-transform duration-100">
                    <path d="M 0,0 C -22,2 -48,8 -62,14 C -68,17 -68,23 -60,25 C -48,25 -22,18 0,12 Z" fill="url(#skinGrad)" stroke="#8c4722" strokeWidth="2" />
                    <text x="-67" y="12" fill="#fef3c7" fontSize="10" fontWeight="bold" fontFamily="monospace">A</text>
                  </g>
                </g>
              </svg>
            </div>

            {/* Timeline pills */}
            <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2 mt-4 overflow-x-auto pb-1">
              {frames.map((f, fIdx) => {
                const isCurrent = fIdx === currentFrameIdx;
                return (
                  <button
                    key={fIdx}
                    onClick={() => {
                      stopAnimation();
                      setCurrentFrameIdx(fIdx);
                      playStepAudio(f);
                    }}
                    className={`flex flex-col items-center px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-amber-500 text-stone-950 font-extrabold border-white scale-105 shadow-md shadow-amber-500/40'
                        : 'bg-[#150a04] text-amber-200/80 border-amber-950 hover:bg-amber-900/40'
                    }`}
                  >
                    <span className="text-[10px] font-mono">T{f.beat}</span>
                    <span className="text-base font-black">
                      {f.action === 'mute' ? '✕' : f.action === 'bass' ? '𝄢' : f.action === 'pluck' ? '↗' : f.action === 'down' ? '↓' : '↑'}
                    </span>
                    <span className="text-[9px] truncate max-w-[55px]">{f.fingerCallout.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-amber-950 w-full">
              <button
                onClick={() => handleManualStep('prev')}
                className="p-2.5 rounded-xl bg-amber-950/70 hover:bg-amber-900 border border-amber-800/50 text-amber-200 transition cursor-pointer active:scale-95"
                title="Movimento anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={togglePlayback}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm sm:text-base shadow-xl transition-all cursor-pointer transform hover:scale-105 ${
                  isPlaying
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/40'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-amber-600/40'
                }`}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                <span>{isPlaying ? 'Pausar' : 'Reproduzir Movimento'}</span>
              </button>

              <button
                onClick={() => handleManualStep('next')}
                className="p-2.5 rounded-xl bg-amber-950/70 hover:bg-amber-900 border border-amber-800/50 text-amber-200 transition cursor-pointer active:scale-95"
                title="Próximo movimento"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  stopAnimation();
                  setCurrentFrameIdx(0);
                }}
                className="p-2.5 rounded-xl bg-[#140b05] hover:bg-amber-950 border border-amber-950 text-amber-400/80 transition cursor-pointer"
                title="Reiniciar"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* POV & Wrist Mechanics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#150a04] rounded-xl border border-amber-900/40 space-y-2">
              <h4 className="font-bold text-amber-300 text-xs sm:text-sm flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-400" />
                Visão do Aluno (Como Você Vê sua Mão)
              </h4>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                {tutorial.povDescription}
              </p>
            </div>

            <div className="p-4 bg-[#150a04] rounded-xl border border-amber-900/40 space-y-2">
              <h4 className="font-bold text-amber-300 text-xs sm:text-sm flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Mecânica do Pulso e Antebraço
              </h4>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                {tutorial.wristMechanics}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Video Mode */}
      {viewMode === 'video' && (
        <div className="bg-gradient-to-b from-[#22150c] to-[#140b05] border border-amber-800/40 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6">
          <div className="space-y-1 pb-3 border-b border-amber-900/40">
            <h3 className="text-lg sm:text-xl font-black text-amber-100 flex items-center gap-2">
              <Video className="w-5 h-5 text-amber-400" />
              {tutorial.title}
            </h3>
            <p className="text-xs text-amber-300/80">
              Demonstração detalhada em vídeo com foco exclusivo na mão direita nas cordas do violão.
            </p>
          </div>

          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-amber-700/50 bg-black shadow-2xl">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${tutorial.embedVideoId}?autoplay=0&rel=0&modestbranding=1`}
              title={tutorial.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#150a04] rounded-xl border border-amber-900/40 space-y-2">
              <h4 className="font-bold text-amber-300 text-xs sm:text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Checklist do Movimento Correto:
              </h4>
              <ul className="text-xs text-amber-200/90 space-y-1.5 list-disc pl-5">
                {tutorial.practiceChecklist.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-[#150a04] rounded-xl border border-red-950/60 space-y-2">
              <h4 className="font-bold text-red-300 text-xs sm:text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                Erros Mais Comuns de Mão Direita:
              </h4>
              <ul className="text-xs text-red-200/90 space-y-1.5 list-disc pl-5">
                {tutorial.commonMistakes.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Button to practice on full player */}
      {onOpenFullRhythmPlayer && (
        <div className="flex items-center justify-between p-4 bg-[#180f08] border border-amber-900/40 rounded-xl">
          <div className="flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-amber-400" />
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-amber-100">
                Pronto para treinar este ritmo com progressões de acordes?
              </h4>
              <p className="text-[11px] text-amber-300/70">
                Abra o reprodutor com metrônomo sonoro, Tap Tempo e batida com violão acústico.
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenFullRhythmPlayer(selectedRhythmId)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition cursor-pointer shadow-md flex-shrink-0"
          >
            <span>Praticar com Metrônomo</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
