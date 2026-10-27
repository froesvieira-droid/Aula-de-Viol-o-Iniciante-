import React, { useState, useEffect, useRef } from 'react';
import { SONGS_DATABASE, SongItem } from '../data/songsData';
import { CHORD_DATABASE, ChordDefinition, CHROMATIC_NOTES } from '../data/guitarData';
import { RHYTHM_PATTERNS } from '../data/rhythmData';
import { guitarAudio } from '../services/guitarAudio';
import { 
  Music, 
  Play, 
  Pause, 
  Sparkles, 
  Flame, 
  ArrowRight, 
  BookOpen, 
  Volume2, 
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Radio,
  FileText,
  ExternalLink
} from 'lucide-react';
import { RHYTHM_VIDEO_TUTORIALS } from '../data/rhythmVideoData';

interface SongBookProps {
  initialSongId?: string;
  onOpenFretboardWithChord: (chordId: string) => void;
  onOpenRhythm: (rhythmId: string) => void;
}

export const SongBook: React.FC<SongBookProps> = ({
  initialSongId = 'no-dia-em-que-eu-sai-de-casa',
  onOpenFretboardWithChord,
  onOpenRhythm,
}) => {
  const [selectedSongId, setSelectedSongId] = useState<string>(initialSongId);
  const [isPlayingRhythm, setIsPlayingRhythm] = useState<boolean>(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(1); // 1x, 1.5x, 2x
  const [fontSizeClass, setFontSizeClass] = useState<'text-sm' | 'text-base' | 'text-lg'>('text-base');

  const song = SONGS_DATABASE.find(s => s.id === selectedSongId) || SONGS_DATABASE[0];
  const associatedRhythm = RHYTHM_PATTERNS.find(r => r.id === song.rhythmId) || RHYTHM_PATTERNS[0];
  const associatedTutorial = RHYTHM_VIDEO_TUTORIALS[song.rhythmId];

  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollIntervalRef = useRef<number | null>(null);

  // Stop auto scroll and rhythm when song changes
  useEffect(() => {
    stopRhythm();
    stopAutoScroll();
  }, [selectedSongId]);

  // Handle chord sound click
  const handlePlayChord = (chordCipher: string) => {
    const cleanCipher = chordCipher.replace(/[[\]\s]/g, '').toLowerCase();
    const chord = CHORD_DATABASE.find(c => c.cipher.toLowerCase() === cleanCipher || c.id === cleanCipher);
    if (chord) {
      guitarAudio.playChord(chord.frets, 'down', 30, '6to1');
    }
  };

  // Rhythm Player synchronization loop
  const rhythmTimerRef = useRef<number | null>(null);
  const rhythmStepRef = useRef<number>(0);
  const [currentRhythmBeat, setCurrentRhythmBeat] = useState<number>(0);

  const startRhythm = () => {
    setIsPlayingRhythm(true);
    rhythmStepRef.current = 0;
    setCurrentRhythmBeat(0);

    const stepCount = associatedRhythm.steps.length;
    const intervalMs = (60000 / song.recommendedBpm) / 2;

    const tick = () => {
      const stepIdx = rhythmStepRef.current;
      const step = associatedRhythm.steps[stepIdx];

      // Audio trigger
      if (step.beat % 1 === 0 || stepIdx === 0) {
        guitarAudio.playClick(step.beat === 1);
      }
      if (step.action === 'mute') {
        guitarAudio.playMuteSlap(0.8);
      } else if (step.action === 'bass') {
        guitarAudio.playString(5, 0, 1.5, 0.9);
      } else if (step.action === 'down' || step.action === 'pluck') {
        const chordObj = CHORD_DATABASE.find(c => c.id === song.chords[0]) || CHORD_DATABASE[0];
        guitarAudio.playChord(chordObj.frets, 'down', 22, '6to1');
      }

      setCurrentRhythmBeat(stepIdx);
      rhythmStepRef.current = (stepIdx + 1) % stepCount;
      rhythmTimerRef.current = window.setTimeout(tick, intervalMs);
    };

    tick();
  };

  const stopRhythm = () => {
    setIsPlayingRhythm(false);
    if (rhythmTimerRef.current) {
      clearTimeout(rhythmTimerRef.current);
      rhythmTimerRef.current = null;
    }
    setCurrentRhythmBeat(0);
  };

  const toggleRhythm = () => {
    if (isPlayingRhythm) stopRhythm();
    else startRhythm();
  };

  // Auto-scroll handler
  const startAutoScroll = () => {
    setIsAutoScrolling(true);
    const speedInterval = Math.max(20, Math.round(50 / scrollSpeed));
    scrollIntervalRef.current = window.setInterval(() => {
      window.scrollBy({ top: 1, behavior: 'smooth' });
    }, speedInterval);
  };

  const stopAutoScroll = () => {
    setIsAutoScrolling(false);
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  const toggleAutoScroll = () => {
    if (isAutoScrolling) stopAutoScroll();
    else startAutoScroll();
  };

  useEffect(() => {
    return () => {
      stopRhythm();
      stopAutoScroll();
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Song Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {SONGS_DATABASE.map(item => {
          const isSelected = item.id === selectedSongId;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedSongId(item.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer shadow-sm ${
                isSelected
                  ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-300 shadow-amber-500/20'
                  : 'bg-[#1c120a] text-amber-200 hover:bg-amber-900/40 border border-amber-900/40'
              }`}
            >
              <Music className="w-4 h-4" />
              <span>{item.title}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${isSelected ? 'bg-stone-900 text-amber-300' : 'bg-amber-950 text-amber-400'}`}>
                {item.artist.split('&')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Song Header Console */}
      <div className="bg-gradient-to-b from-[#21150c] to-[#160d07] border border-amber-800/40 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6">
        {/* Title, Artist, and Key badges */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-amber-900/40">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-600/30 text-amber-300 font-bold text-xs border border-amber-500/40">
                {song.timeSignature}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-stone-900 text-amber-300 font-mono text-xs border border-amber-950">
                Tom Original: {song.key}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-300 font-bold text-[10px] border border-emerald-600/40">
                Nível: {song.difficulty}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-amber-100">{song.title}</h1>
            <p className="text-xs sm:text-sm text-amber-300/90 font-medium mt-0.5">
              {song.artist} {song.composer && `• Composição: ${song.composer}`}
            </p>
          </div>

          {/* Action buttons: Play Rhythm / Open Rhythm / Auto-scroll */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={toggleRhythm}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition cursor-pointer ${
                isPlayingRhythm
                  ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
                  : 'bg-amber-600 hover:bg-amber-500 text-white'
              }`}
              title="Tocar áudio da batida sincronizada"
            >
              {isPlayingRhythm ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlayingRhythm ? 'Pausar Batida' : 'Ouvir Ritmo'} ({song.recommendedBpm} BPM)</span>
            </button>

            <button
              onClick={() => onOpenRhythm(song.rhythmId)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-950 hover:bg-amber-900 border border-amber-700/50 text-amber-200 text-xs font-semibold transition cursor-pointer"
              title="Abrir o treinador rítmico completo desta música"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Ver Ritmo</span>
            </button>

            {associatedTutorial && (
              <a
                href={associatedTutorial.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-red-950/70 hover:bg-red-900 border border-red-700/60 text-red-200 hover:text-white text-xs font-bold transition hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
                title={`Assistir vídeo no YouTube de como tocar o ritmo ${associatedRhythm.name}`}
              >
                <svg className="w-3.5 h-3.5 fill-current text-red-500" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>Vídeo da Batida</span>
                <ExternalLink className="w-3 h-3 text-red-400" />
              </a>
            )}
          </div>
        </div>

        {/* Chords Used in This Song (Click to hear / view) */}
        <div className="space-y-2 bg-[#140b05] p-3.5 sm:p-4 rounded-xl border border-amber-950">
          <div className="flex items-center justify-between text-xs text-amber-300">
            <span className="font-bold flex items-center gap-1.5">
              <Music className="w-4 h-4 text-amber-400" />
              Acordes Usados Nesta Música (Clique para ouvir ou ver no braço):
            </span>
            <span className="text-[11px] text-amber-400/70 hidden sm:inline">
              Toque no acorde para ouvir o som
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {song.chords.map(chordId => {
              const chord = CHORD_DATABASE.find(c => c.id === chordId);
              if (!chord) return null;

              return (
                <div
                  key={chordId}
                  className="flex items-center gap-1.5 bg-[#20130a] border border-amber-700/40 hover:border-amber-400 p-1.5 sm:p-2 rounded-xl transition shadow-sm"
                >
                  <button
                    onClick={() => handlePlayChord(chord.cipher)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-600/30 hover:bg-amber-600 text-amber-200 hover:text-white font-extrabold text-xs transition cursor-pointer"
                    title={`Ouvir som do acorde ${chord.cipher}`}
                  >
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>{chord.cipher}</span>
                  </button>

                  <button
                    onClick={() => onOpenFretboardWithChord(chord.id)}
                    className="text-[10px] text-amber-400/80 hover:text-amber-200 underline px-1 cursor-pointer"
                    title="Ver no braço do violão"
                  >
                    Braço
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rhythm Pattern Summary Bar */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-950/30 border border-amber-700/30 text-xs text-amber-200">
          <Flame className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300">Batida Recomendada: </span>
            <span className="text-amber-100">{song.strumPatternSummary}</span>
          </div>
        </div>

        {/* Teaching Notes & Pro Tips */}
        <div className="bg-[#180f08] border border-amber-900/40 p-4 rounded-xl space-y-2">
          <h4 className="font-bold text-amber-300 text-xs sm:text-sm flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            Dicas Práticas para Tocar "{song.title}":
          </h4>
          <ul className="text-xs text-amber-200/90 space-y-1.5 list-disc pl-5 leading-relaxed">
            {song.teachingNotes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>

        {/* Floating Controls Bar: Auto-Scroll & Font Size */}
        <div className="sticky top-20 z-20 flex flex-wrap items-center justify-between gap-3 bg-[#160d07]/95 backdrop-blur-md border border-amber-700/50 p-3 rounded-xl shadow-lg">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-amber-300 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              Cifra Completa:
            </span>
            <span className="text-[11px] text-amber-400/70 hidden sm:inline">
              (Clique em qualquer acorde na letra para ouvi-lo)
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {/* Auto scroll toggle */}
            <button
              onClick={toggleAutoScroll}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                isAutoScrolling
                  ? 'bg-amber-500 text-stone-950 border-amber-300 font-bold animate-pulse'
                  : 'bg-[#1f130a] text-amber-200 border-amber-900/60 hover:bg-amber-900/40'
              }`}
            >
              {isAutoScrolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoScrolling ? 'Pausar Rolagem' : 'Rolar Letra'}</span>
            </button>

            {/* Font size switcher */}
            <div className="flex items-center bg-[#100a05] border border-amber-950 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setFontSizeClass('text-sm')}
                className={`px-2 py-1 rounded font-bold cursor-pointer ${
                  fontSizeClass === 'text-sm' ? 'bg-amber-700 text-white' : 'text-amber-400/60'
                }`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSizeClass('text-base')}
                className={`px-2 py-1 rounded font-bold cursor-pointer ${
                  fontSizeClass === 'text-base' ? 'bg-amber-700 text-white' : 'text-amber-400/60'
                }`}
              >
                A
              </button>
              <button
                onClick={() => setFontSizeClass('text-lg')}
                className={`px-2 py-1 rounded font-bold cursor-pointer ${
                  fontSizeClass === 'text-lg' ? 'bg-amber-700 text-white' : 'text-amber-400/60'
                }`}
              >
                A+
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================
            THE CIPHER & LYRICS SHEET (A CIFRA INTERATIVA)
            ======================================================== */}
        <div 
          ref={lyricsContainerRef}
          className="bg-[#0e0804] border border-amber-950 rounded-2xl p-5 sm:p-7 space-y-6 font-mono shadow-inner"
        >
          {song.sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-3 pb-4 border-b border-amber-950/60 last:border-0">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-amber-950 border border-amber-800/40 text-amber-300 text-xs font-sans font-bold uppercase tracking-wider">
                  {section.sectionName}
                </span>
              </div>

              <div className={`space-y-3 leading-relaxed ${fontSizeClass}`}>
                {section.lines.map((line, lIdx) => {
                  if (line.lyric === '') {
                    return <div key={lIdx} className="h-2" />;
                  }

                  return (
                    <div key={lIdx} className="flex flex-col group">
                      {line.chord && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePlayChord(line.chord!)}
                            className="text-amber-400 hover:text-amber-200 font-extrabold text-sm sm:text-base font-mono cursor-pointer transition flex items-center gap-1 group-hover:scale-105"
                            title="Tocar acorde"
                          >
                            <span>{line.chord}</span>
                          </button>
                        </div>
                      )}
                      <span className="text-amber-100 font-sans tracking-wide">
                        {line.lyric}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
