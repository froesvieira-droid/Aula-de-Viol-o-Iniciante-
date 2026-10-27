/**
 * Violão Mestre - Aulas para Iniciantes, Braço Interativo e Ritmos Brasileiros
 * Suporte Offline Completo (PWA)
 */

import React, { useState, useEffect } from 'react';
import { Fretboard } from './components/Fretboard';
import { RhythmPlayer } from './components/RhythmPlayer';
import { LessonsCourse } from './components/LessonsCourse';
import { GuitarTuner } from './components/GuitarTuner';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { DailyTipCard } from './components/DailyTipCard';
import { SongBook } from './components/SongBook';
import { RightHandVideoSimulator } from './components/RightHandVideoSimulator';
import { QuickChordModal } from './components/QuickChordModal';
import { guitarAudio } from './services/guitarAudio';
import { 
  GraduationCap, 
  Music, 
  Flame, 
  Radio, 
  Volume2, 
  VolumeX, 
  Download,
  Info,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  BookOpen,
  Video,
  Search
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'lessons' | 'videos' | 'songs' | 'fretboard' | 'rhythms' | 'tuner'>('lessons');
  const [selectedSongId, setSelectedSongId] = useState<string>('no-dia-em-que-eu-sai-de-casa');
  const [targetChordForFretboard, setTargetChordForFretboard] = useState<string>('c');
  const [targetRhythmId, setTargetRhythmId] = useState<string>('sertanejo-universitario');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isQuickChordModalOpen, setIsQuickChordModalOpen] = useState<boolean>(false);

  // Global keyboard shortcut: Ctrl+K / Cmd+K opens quick chord modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsQuickChordModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenSong = (songId: string) => {
    setSelectedSongId(songId);
    setActiveTab('songs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleMasterMute = () => {
    const nextMute = !isAudioMuted;
    setIsAudioMuted(nextMute);
    guitarAudio.setMuted(nextMute);
  };

  const handleOpenFretboardWithChord = (chordId: string) => {
    setTargetChordForFretboard(chordId);
    setActiveTab('fretboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenRhythm = (rhythmId: string) => {
    setTargetRhythmId(rhythmId);
    setActiveTab('rhythms');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenVideo = (rhythmId: string) => {
    setTargetRhythmId(rhythmId);
    setActiveTab('videos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0d0805] text-amber-50 flex flex-col font-sans selection:bg-amber-600 selection:text-white">
      {/* Offline Status Float */}
      <OfflineIndicator />

      {/* Top Header / Navigation */}
      <header className="sticky top-0 z-40 bg-[#160d07]/90 backdrop-blur-md border-b border-amber-900/40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('lessons')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative group-hover:scale-105 transition-transform duration-200">
              <img 
                src="/assets/aistudio/file_000000006aa0820ebd707cd51330b5fb_c34dcf50.png" 
                alt="Vieira Violão Mestre" 
                className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl object-cover shadow-lg shadow-amber-950/80 border-2 border-amber-500/60 ring-1 ring-amber-400/30"
              />
              <span className="absolute -bottom-1 -right-1 text-[8px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-600 text-stone-950 px-1.5 py-0.2 rounded-full shadow-md font-sans border border-amber-300">
                Vieira
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  Vieira <span className="text-amber-400">Violão Mestre</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-950 border border-amber-700/50 text-amber-300">
                  Offline
                </span>
              </div>
              <p className="text-[11px] text-amber-300/70 hidden sm:block">
                Aulas, Braço, Escalas & Ritmos Sertanejos e Pop
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-[#120a05] rounded-2xl border border-amber-950">
            <button
              onClick={() => setActiveTab('lessons')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'lessons'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-amber-200/70 hover:text-amber-100 hover:bg-amber-950/40'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Aulas do Zero</span>
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'videos'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-amber-200/70 hover:text-amber-100 hover:bg-amber-950/40'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Vídeos da Mão</span>
            </button>
            <button
              onClick={() => setActiveTab('rhythms')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'rhythms'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-amber-200/70 hover:text-amber-100 hover:bg-amber-950/40'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Modelos de Ritmos</span>
            </button>
            <button
              onClick={() => setActiveTab('songs')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'songs'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-amber-200/70 hover:text-amber-100 hover:bg-amber-950/40'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Músicas & Cifras</span>
            </button>
            <button
              onClick={() => setActiveTab('fretboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'fretboard'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-amber-200/70 hover:text-amber-100 hover:bg-amber-950/40'
              }`}
            >
              <Music className="w-4 h-4" />
              <span>Braço & Escalas</span>
            </button>
            <button
              onClick={() => setActiveTab('tuner')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'tuner'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-amber-200/70 hover:text-amber-100 hover:bg-amber-950/40'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>Afinador</span>
            </button>
          </nav>

          {/* Right Header: Quick Chord Search, Audio Mute & PWA Install Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsQuickChordModalOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-600/30 to-amber-700/20 hover:from-amber-600/50 hover:to-amber-700/40 border border-amber-600/40 hover:border-amber-500 text-amber-200 hover:text-white text-xs font-bold transition shadow-sm cursor-pointer group"
              title="Buscar qualquer acorde e digitação (Ctrl + K)"
            >
              <Search className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Buscar Acorde</span>
              <kbd className="hidden lg:inline-block text-[9px] px-1.5 py-0.5 rounded bg-black/40 border border-amber-900/60 font-mono text-amber-300/80">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={toggleMasterMute}
              className={`p-2 rounded-xl border text-xs transition cursor-pointer ${
                isAudioMuted
                  ? 'bg-red-950/60 border-red-700/60 text-red-400'
                  : 'bg-[#1e130a] border-amber-900/40 text-amber-300 hover:text-white hover:bg-amber-950'
              }`}
              title={isAudioMuted ? 'Desmutar áudio' : 'Mutar som de violão'}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* PWA in-app installation button */}
            <PWAInstallButton />
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-amber-950/60 bg-[#120a05]">
          <button
            onClick={() => setActiveTab('lessons')}
            className={`flex flex-col items-center gap-1 py-1 px-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
              activeTab === 'lessons' ? 'text-amber-400 font-extrabold' : 'text-amber-300/60'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Aulas</span>
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex flex-col items-center gap-1 py-1 px-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
              activeTab === 'videos' ? 'text-amber-400 font-extrabold' : 'text-amber-300/60'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Vídeos</span>
          </button>
          <button
            onClick={() => setActiveTab('rhythms')}
            className={`flex flex-col items-center gap-1 py-1 px-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
              activeTab === 'rhythms' ? 'text-amber-400 font-extrabold' : 'text-amber-300/60'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Ritmos</span>
          </button>
          <button
            onClick={() => setActiveTab('songs')}
            className={`flex flex-col items-center gap-1 py-1 px-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
              activeTab === 'songs' ? 'text-amber-400 font-extrabold' : 'text-amber-300/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Cifras</span>
          </button>
          <button
            onClick={() => setActiveTab('fretboard')}
            className={`flex flex-col items-center gap-1 py-1 px-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
              activeTab === 'fretboard' ? 'text-amber-400 font-extrabold' : 'text-amber-300/60'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Braço</span>
          </button>
          <button
            onClick={() => setActiveTab('tuner')}
            className={`flex flex-col items-center gap-1 py-1 px-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
              activeTab === 'tuner' ? 'text-amber-400 font-extrabold' : 'text-amber-300/60'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Afinador</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'lessons' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-950/60 via-[#1c120a] to-[#140c06] border border-amber-800/40 p-4 sm:p-5 rounded-2xl shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-3 sm:gap-4">
                <img 
                  src="/assets/aistudio/file_000000006aa0820ebd707cd51330b5fb_c34dcf50.png" 
                  alt="Vieira Violão Mestre" 
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover shadow-lg border-2 border-amber-500/60 ring-2 ring-amber-400/20 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                      Método Vieira
                    </span>
                    <span className="text-[11px] text-amber-400/80 font-medium">100% Offline</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-amber-100">
                    Curso de Violão para Iniciantes
                  </h2>
                  <p className="text-xs text-amber-300/80">
                    Aulas estruturadas com teoria clara, exercícios práticos, braço interativo e cifras do zero.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedSongId('no-dia-em-que-eu-sai-de-casa');
                    setActiveTab('songs');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition cursor-pointer shadow"
                >
                  Tocar Zezé Di Camargo →
                </button>
                <button
                  onClick={() => setActiveTab('rhythms')}
                  className="px-3 py-1.5 rounded-xl bg-amber-900/40 hover:bg-amber-900/60 border border-amber-700/40 text-amber-200 text-xs font-semibold transition cursor-pointer"
                >
                  Ver Ritmos →
                </button>
              </div>
            </div>

            {/* Dica do Dia: Técnica Rápida de Violão */}
            <DailyTipCard
              onOpenFretboardWithChord={handleOpenFretboardWithChord}
              onOpenRhythm={handleOpenRhythm}
            />

            <LessonsCourse
              onOpenFretboardWithChord={handleOpenFretboardWithChord}
              onOpenRhythm={handleOpenRhythm}
            />
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="space-y-6">
            <RightHandVideoSimulator
              currentRhythmId={targetRhythmId}
              onSelectRhythm={(rhythmId) => setTargetRhythmId(rhythmId)}
              onOpenFullRhythmPlayer={(rhythmId) => {
                setTargetRhythmId(rhythmId);
                setActiveTab('rhythms');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {activeTab === 'songs' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-amber-950/50 via-[#1c120a] to-[#140c06] border border-amber-800/30 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-amber-100">
                    Repertório Sertanejo: Zezé Di Camargo & Luciano
                  </h2>
                  <p className="text-xs text-amber-300/80">
                    Treine "No Dia em que Eu Saí de Casa" (Guarania) e "Pra Não Pensar em Você" (Balada Sertaneja) com áudio de ritmo e cifras interativas.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('rhythms')}
                  className="px-3 py-1.5 rounded-xl bg-amber-900/40 hover:bg-amber-900/60 border border-amber-700/40 text-amber-200 text-xs font-semibold transition cursor-pointer"
                >
                  Ver Ritmos Sertanejo & Guarania →
                </button>
              </div>
            </div>

            <SongBook
              initialSongId={selectedSongId}
              onOpenFretboardWithChord={handleOpenFretboardWithChord}
              onOpenRhythm={handleOpenRhythm}
            />
          </div>
        )}

        {activeTab === 'fretboard' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-amber-950/50 via-[#1c120a] to-[#140c06] border border-amber-800/30 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-amber-100">
                    Braço do Violão Interativo & Modelos de Notas e Acordes
                  </h2>
                  <p className="text-xs text-amber-300/80">
                    Explore todas as notas nas 6 cordas, modelos de acordes abertos, pestanas e o sistema CAGED com áudio acústico real.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('rhythms')}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition cursor-pointer shadow"
                >
                  Praticar com Ritmos →
                </button>
              </div>
            </div>

            <Fretboard
              initialChordId={targetChordForFretboard}
              onSelectChord={(chord) => setTargetChordForFretboard(chord.id)}
            />
          </div>
        )}

        {activeTab === 'rhythms' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-amber-950/50 via-[#1c120a] to-[#140c06] border border-amber-800/30 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-amber-100">
                    Modelos de Ritmos: Pop, Sertanejo e Guarania
                  </h2>
                  <p className="text-xs text-amber-300/80">
                    Aprenda o balanço da mão direita com setas sincronizadas, metrônomo sonoro, abafamentos e progressões reais de acordes.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveTab('videos')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition cursor-pointer shadow"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Ver Vídeo da Mão Direita →</span>
                </button>
                <button
                  onClick={() => setActiveTab('fretboard')}
                  className="px-3 py-1.5 rounded-xl bg-amber-900/40 hover:bg-amber-900/60 border border-amber-700/40 text-amber-200 text-xs font-semibold transition cursor-pointer"
                >
                  Consultar Acordes →
                </button>
              </div>
            </div>

            <RhythmPlayer
              initialRhythmId={targetRhythmId}
              onSelectChordToView={(chordId) => handleOpenFretboardWithChord(chordId)}
              onOpenVideo={(rhythmId) => handleOpenVideo(rhythmId)}
            />
          </div>
        )}

        {activeTab === 'tuner' && (
          <div className="space-y-6">
            <GuitarTuner />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-amber-950 bg-[#120a05] py-8 text-amber-300/60 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <img 
              src="/assets/aistudio/file_000000006aa0820ebd707cd51330b5fb_c34dcf50.png" 
              alt="Vieira Violão Mestre Logo" 
              className="w-10 h-10 rounded-xl object-cover border border-amber-500/50 shadow-md shrink-0 ring-1 ring-amber-400/20"
            />
            <div>
              <p className="text-amber-100 font-bold text-sm">
                Vieira Violão Mestre
              </p>
              <p className="text-[11px] text-amber-300/70">
                Sintetizador acústico Karplus-Strong, ritmos brasileiros & aulas 100% offline.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-amber-400/80">
            <span>Ritmos: Pop • Sertanejo • Guarania • Valsa • Moda de Viola</span>
            <span>•</span>
            <span>Sistema CAGED, Acordes e Escalas Musicais</span>
          </div>
        </div>
      </footer>

      {/* Floating Quick Chord Search Button (Accessible from every tab) */}
      <button
        onClick={() => setIsQuickChordModalOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-black/60 border border-amber-400/40 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
        aria-label="Abrir busca rápida de acordes"
        title="Buscar qualquer acorde e digitação (Ctrl + K)"
      >
        <Search className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform" />
        <span className="tracking-wide">Acordes</span>
        <span className="hidden sm:inline-block text-[10px] bg-black/40 border border-amber-500/30 px-1.5 py-0.5 rounded-full font-mono text-amber-200">
          Ctrl+K
        </span>
      </button>

      {/* Quick Chord Modal (Global across all tabs) */}
      <QuickChordModal
        isOpen={isQuickChordModalOpen}
        onClose={() => setIsQuickChordModalOpen(false)}
        onSelectChordOnFretboard={handleOpenFretboardWithChord}
        initialChordId={targetChordForFretboard}
      />
    </div>
  );
}
