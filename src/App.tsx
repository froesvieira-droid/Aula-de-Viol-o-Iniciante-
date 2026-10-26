/**
 * Violão Mestre - Aulas para Iniciantes, Braço Interativo e Ritmos Brasileiros
 * Suporte Offline Completo (PWA)
 */

import React, { useState } from 'react';
import { Fretboard } from './components/Fretboard';
import { RhythmPlayer } from './components/RhythmPlayer';
import { LessonsCourse } from './components/LessonsCourse';
import { GuitarTuner } from './components/GuitarTuner';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { DailyTipCard } from './components/DailyTipCard';
import { SongBook } from './components/SongBook';
import { RightHandVideoSimulator } from './components/RightHandVideoSimulator';
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
  Video
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'lessons' | 'videos' | 'songs' | 'fretboard' | 'rhythms' | 'tuner'>('lessons');
  const [selectedSongId, setSelectedSongId] = useState<string>('no-dia-em-que-eu-sai-de-casa');
  const [targetChordForFretboard, setTargetChordForFretboard] = useState<string>('c');
  const [targetRhythmId, setTargetRhythmId] = useState<string>('sertanejo-universitario');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

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
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 p-0.5 shadow-lg shadow-amber-600/30 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#1c120a] rounded-[14px] flex items-center justify-center">
                {/* Acoustic Guitar Headstock / Soundhole mini-icon */}
                <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  Violão <span className="text-amber-400">Mestre</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-950 border border-amber-700/50 text-amber-300">
                  Offline
                </span>
              </div>
              <p className="text-[11px] text-amber-300/70 hidden sm:block">
                Aulas, Braço & Ritmos: Pop, Sertanejo e Guarania
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
              <span>Braço e Acordes</span>
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

          {/* Right Header: Audio Mute & PWA Install Button */}
          <div className="flex items-center gap-2 sm:gap-3">
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-amber-950/50 via-[#1c120a] to-[#140c06] border border-amber-800/30 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-amber-100">
                    Curso de Violão para Iniciantes (100% Offline)
                  </h2>
                  <p className="text-xs text-amber-300/80">
                    Aulas estruturadas com teoria clara, exercícios práticos e músicas do zero.
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
          <div className="flex items-center gap-2 text-center md:text-left">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <p>
              <strong>Violão Mestre</strong> — Sintetizador físico Karplus-Strong & Aulas 100% Offline.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-amber-400/80">
            <span>Ritmos: Pop • Sertanejo • Guarania • Valsa • Moda de Viola</span>
            <span>•</span>
            <span>Sistema CAGED e Dicionário de Acordes</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
