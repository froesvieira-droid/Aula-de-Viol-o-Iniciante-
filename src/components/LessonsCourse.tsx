import React, { useState, useEffect } from 'react';
import { BEGINNER_LESSONS, Lesson } from '../data/lessonsData';
import { CHORD_DATABASE } from '../data/guitarData';
import { RHYTHM_PATTERNS } from '../data/rhythmData';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  GraduationCap, 
  Play, 
  Sparkles, 
  Flame, 
  Music, 
  ArrowRight, 
  ArrowLeft,
  BookOpen,
  AlertCircle,
  Lightbulb
} from 'lucide-react';

interface LessonsCourseProps {
  onOpenFretboardWithChord: (chordId: string) => void;
  onOpenRhythm: (rhythmId: string) => void;
}

const STORAGE_KEY_PROGRESS = 'violao_mestre_completed_tasks';
const STORAGE_KEY_LESSONS = 'violao_mestre_completed_lessons';

export const LessonsCourse: React.FC<LessonsCourseProps> = ({
  onOpenFretboardWithChord,
  onOpenRhythm,
}) => {
  const [selectedLessonId, setSelectedLessonId] = useState<string>(BEGINNER_LESSONS[0].id);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});

  // Load progress from localStorage
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (savedTasks) setCompletedTasks(JSON.parse(savedTasks));

      const savedLessons = localStorage.getItem(STORAGE_KEY_LESSONS);
      if (savedLessons) setCompletedLessons(JSON.parse(savedLessons));
    } catch {
      // Ignore storage errors in private mode
    }
  }, []);

  const toggleTask = (taskKey: string, lessonId: string) => {
    const updatedTasks = {
      ...completedTasks,
      [taskKey]: !completedTasks[taskKey],
    };
    setCompletedTasks(updatedTasks);
    try {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(updatedTasks));
    } catch {
      // ignore
    }

    // Check if all tasks for this lesson are complete
    const lesson = BEGINNER_LESSONS.find(l => l.id === lessonId);
    if (lesson) {
      const allDone = lesson.practiceTasks.every((_, idx) => updatedTasks[`${lessonId}-${idx}`]);
      const updatedLessons = {
        ...completedLessons,
        [lessonId]: allDone,
      };
      setCompletedLessons(updatedLessons);
      try {
        localStorage.setItem(STORAGE_KEY_LESSONS, JSON.stringify(updatedLessons));
      } catch {
        // ignore
      }
    }
  };

  const selectedLesson = BEGINNER_LESSONS.find(l => l.id === selectedLessonId) || BEGINNER_LESSONS[0];
  const currentIndex = BEGINNER_LESSONS.findIndex(l => l.id === selectedLessonId);

  // Calculate course completion
  const totalTasks = BEGINNER_LESSONS.reduce((acc, l) => acc + l.practiceTasks.length, 0);
  const finishedTasksCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercentage = Math.round((finishedTasksCount / Math.max(1, totalTasks)) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Sidebar: Lessons List & Progress */}
      <div className="lg:col-span-4 space-y-4">
        {/* Progress Card */}
        <div className="bg-[#1c120a] border border-amber-900/40 rounded-2xl p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              Seu Progresso no Curso:
            </span>
            <span className="font-mono font-bold text-amber-400">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-[#100a05] h-2 rounded-full overflow-hidden border border-amber-950">
            <div
              className="bg-gradient-to-r from-amber-600 to-amber-400 h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-[11px] text-amber-300/70">
            {finishedTasksCount} de {totalTasks} metas concluídas. Todo o progresso fica salvo neste dispositivo sem precisar de internet!
          </p>
        </div>

        {/* Lessons Navigation Accordion/List */}
        <div className="bg-[#180f08] border border-amber-900/30 rounded-2xl p-3 space-y-2">
          <h3 className="text-xs uppercase tracking-wider font-extrabold text-amber-400/80 px-2 py-1">
            Grade de Aulas (Passo a Passo)
          </h3>

          <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
            {BEGINNER_LESSONS.map(lesson => {
              const isSelected = lesson.id === selectedLessonId;
              const isDone = completedLessons[lesson.id];
              const lessonTasksDone = lesson.practiceTasks.filter((_, idx) => completedTasks[`${lesson.id}-${idx}`]).length;

              return (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedLessonId(lesson.id)}
                  className={`w-full text-left p-3 rounded-xl transition cursor-pointer flex items-start gap-3 border ${
                    isSelected
                      ? 'bg-amber-600/20 border-amber-500/70 text-amber-100 shadow-md ring-1 ring-amber-400/30'
                      : 'bg-[#1e130a] hover:bg-amber-950/40 border-amber-950/70 text-amber-200/80'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950" />
                    ) : (
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold border ${
                        isSelected ? 'border-amber-400 text-amber-300 bg-amber-950' : 'border-amber-800 text-amber-400/70'
                      }`}>
                        {lesson.order}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-[10px] text-amber-400/80 font-medium truncate">
                        {lesson.module.split(':')[0]}
                      </span>
                      <span className="text-[10px] text-amber-400/60 font-mono flex items-center gap-1 flex-shrink-0">
                        <Clock className="w-3 h-3" />
                        {lesson.durationMinutes}m
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-amber-100 line-clamp-1">{lesson.title}</h4>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-amber-300/70">
                      <span>{lesson.level}</span>
                      <span>•</span>
                      <span>{lessonTasksDone}/{lesson.practiceTasks.length} tarefas</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area: Selected Lesson */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-gradient-to-b from-[#21150c] to-[#160d07] border border-amber-800/40 rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
          {/* Lesson Header */}
          <div className="pb-5 border-b border-amber-900/40 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-600/30 border border-amber-500/40 text-amber-300 text-xs font-bold">
                Aula {selectedLesson.order} de {BEGINNER_LESSONS.length}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-stone-900 border border-amber-950 text-amber-300 text-xs font-medium">
                {selectedLesson.module}
              </span>
              <span className="text-xs text-amber-400/80 flex items-center gap-1 ml-auto">
                <Clock className="w-3.5 h-3.5" />
                Duração estimada: {selectedLesson.durationMinutes} minutos
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-amber-100 leading-tight">
              {selectedLesson.title}
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
              {selectedLesson.summary}
            </p>
          </div>

          {/* Quick Practice Shortcuts Bar */}
          <div className="flex flex-wrap items-center gap-3 p-3.5 bg-[#140c06] rounded-xl border border-amber-950">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Recursos desta aula:
            </span>

            {/* Target chords buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {selectedLesson.targetChords.map(chordId => {
                const chord = CHORD_DATABASE.find(c => c.id === chordId);
                if (!chord) return null;
                return (
                  <button
                    key={chordId}
                    onClick={() => onOpenFretboardWithChord(chordId)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/70 hover:bg-amber-800 border border-amber-700/50 text-amber-200 text-xs font-bold transition cursor-pointer"
                    title="Ver no braço do violão"
                  >
                    <Music className="w-3 h-3 text-amber-400" />
                    <span>Ver {chord.cipher} no Braço</span>
                  </button>
                );
              })}
            </div>

            {/* Target rhythm button */}
            {selectedLesson.targetRhythmId && (
              <button
                onClick={() => onOpenRhythm(selectedLesson.targetRhythmId!)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold transition cursor-pointer ml-auto shadow-sm"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Praticar Batida</span>
              </button>
            )}
          </div>

          {/* Lesson Content Sections */}
          <div className="space-y-6">
            {selectedLesson.sections.map((section, idx) => (
              <div key={idx} className="space-y-3">
                <h3 className="text-base sm:text-lg font-bold text-amber-200 border-l-4 border-amber-500 pl-3">
                  {section.title}
                </h3>
                
                {/* Formatted Text Content */}
                <div className="text-xs sm:text-sm text-amber-100/90 leading-relaxed space-y-2 whitespace-pre-line font-normal">
                  {section.content}
                </div>

                {/* Highlight boxes */}
                {section.highlightBox && (
                  <div className={`p-4 rounded-xl border text-xs sm:text-sm space-y-1 ${
                    section.highlightBox.type === 'dica'
                      ? 'bg-amber-950/40 border-amber-600/50 text-amber-200'
                      : section.highlightBox.type === 'atencao'
                      ? 'bg-red-950/40 border-red-700/50 text-red-200'
                      : 'bg-emerald-950/40 border-emerald-600/50 text-emerald-200'
                  }`}>
                    <div className="font-bold flex items-center gap-1.5 mb-1">
                      {section.highlightBox.type === 'dica' && <Lightbulb className="w-4 h-4 text-amber-400" />}
                      {section.highlightBox.type === 'atencao' && <AlertCircle className="w-4 h-4 text-red-400" />}
                      {section.highlightBox.type === 'exercicio' && <Flame className="w-4 h-4 text-emerald-400" />}
                      <span>{section.highlightBox.title}</span>
                    </div>
                    <p className="leading-relaxed opacity-95">{section.highlightBox.text}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Featured Song / Cifra if available */}
          {selectedLesson.featuredSong && (
            <div className="p-4 bg-[#140c06] rounded-xl border border-amber-900/40 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-amber-950">
                <div>
                  <span className="text-[10px] text-amber-400/80 font-bold uppercase tracking-wider block">
                    Música para Aplicar na Prática:
                  </span>
                  <h4 className="text-sm font-bold text-amber-100">
                    {selectedLesson.featuredSong.title} — {selectedLesson.featuredSong.artist}
                  </h4>
                </div>
                <div className="flex items-center gap-1.5">
                  {selectedLesson.featuredSong.chords.map(c => (
                    <span key={c} className="px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 font-bold text-xs border border-amber-800/40">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Lyrics with chords */}
              <div className="font-mono text-xs sm:text-sm space-y-2 bg-[#0d0704] p-3 rounded-lg border border-amber-950 text-amber-200">
                {selectedLesson.featuredSong.lyricsAndChords.map((line, idx) => (
                  <div key={idx} className="flex flex-col">
                    {line.chord && (
                      <span className="font-bold text-amber-400 text-xs">{line.chord}</span>
                    )}
                    <span>{line.lyric}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Practice Tasks Checklist */}
          <div className="p-4 bg-[#180f08] rounded-xl border border-amber-800/40 space-y-3">
            <h4 className="font-bold text-amber-200 text-xs sm:text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Metas Práticas desta Aula (Marque ao Dominar):
            </h4>

            <div className="space-y-2">
              {selectedLesson.practiceTasks.map((task, idx) => {
                const taskKey = `${selectedLesson.id}-${idx}`;
                const isChecked = !!completedTasks[taskKey];

                return (
                  <button
                    key={idx}
                    onClick={() => toggleTask(taskKey, selectedLesson.id)}
                    className={`w-full text-left p-2.5 rounded-lg border transition flex items-center gap-3 cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-950/30 border-emerald-600/40 text-emerald-200 line-through opacity-85'
                        : 'bg-[#21150c] border-amber-900/30 text-amber-100 hover:bg-amber-900/30'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-950" />
                      ) : (
                        <Circle className="w-4 h-4 text-amber-400/60" />
                      )}
                    </div>
                    <span className="text-xs">{task}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons: Previous / Next Lesson */}
          <div className="flex items-center justify-between pt-4 border-t border-amber-900/40">
            <button
              onClick={() => setSelectedLessonId(BEGINNER_LESSONS[currentIndex - 1].id)}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1c120a] border border-amber-900/40 text-amber-300 text-xs font-semibold hover:bg-amber-900/30 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Aula Anterior</span>
            </button>

            <button
              onClick={() => setSelectedLessonId(BEGINNER_LESSONS[currentIndex + 1].id)}
              disabled={currentIndex === BEGINNER_LESSONS.length - 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow"
            >
              <span>Próxima Aula</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
