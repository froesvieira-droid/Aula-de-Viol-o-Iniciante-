/**
 * Music Theory and Scale Engine for Acoustic Guitar
 * Supports Major, Natural Minor, Minor Pentatonic, Major Pentatonic, and Blues scales
 * Provides notes, intervals, shapes, and audio sequence generation
 */

import { CHROMATIC_NOTES, NOTE_PT_MAP, getNoteAtFret } from './guitarData';

export interface ScaleDefinition {
  id: string;
  name: string;
  shortName: string;
  type: 'maior' | 'menor' | 'pentatonica' | 'blues';
  semitones: number[]; // semitone offset from root [0, 2, 4, 5, 7, 9, 11]
  intervals: string[]; // ['1', '2', '3', '4', '5', '6', '7']
  formula: string; // T - T - ST - T - T - T - ST
  explanation: string;
  usageTips: string;
  mood: string;
}

export const SCALES_DATABASE: ScaleDefinition[] = [
  {
    id: 'major',
    name: 'Escala Maior (Natural / Jônica)',
    shortName: 'Maior Natural',
    type: 'maior',
    semitones: [0, 2, 4, 5, 7, 9, 11],
    intervals: ['1', '2', '3', '4', '5', '6', '7'],
    formula: 'Tom - Tom - Semitom - Tom - Tom - Tom - Semitom',
    explanation: 'A escala fundamental da teoria musical ocidental. Possui sensação harmônica estável, alegre, triunfante e conclusiva.',
    usageTips: 'Usada para solos no pop, MPB e introduções sertanejas românticas sobre acordes Maiores (C, D, G, etc.).',
    mood: 'Brilhante e Alegre',
  },
  {
    id: 'minor',
    name: 'Escala Menor Natural (Eólia)',
    shortName: 'Menor Natural',
    type: 'menor',
    semitones: [0, 2, 3, 5, 7, 8, 10],
    intervals: ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
    formula: 'Tom - Semitom - Tom - Tom - Semitom - Tom - Tom',
    explanation: 'A relativa menor da escala maior. Apresenta o 3º, 6º e 7º graus rebaixados, criando sua marcante expressividade melancólica.',
    usageTips: 'Fundamental para solos nostálgicos, sertanejo raiz, modas de viola e baladas sobre acordes menores (Am, Em, Dm).',
    mood: 'Melancólica e Profunda',
  },
  {
    id: 'penta-minor',
    name: 'Escala Pentatônica Menor',
    shortName: 'Pentatônica Menor',
    type: 'pentatonica',
    semitones: [0, 3, 5, 7, 10],
    intervals: ['1', 'b3', '4', '5', 'b7'],
    formula: '1½ Tom - Tom - Tom - 1½ Tom - Tom',
    explanation: 'A escala de 5 notas mais amada pelos violonistas e guitarristas. Sem semitons dissonantes, soa perfeita sobre qualquer base.',
    usageTips: 'A melhor escala para começar a improvisar solos. O Shape 1 é intuitivo e encaixa perfeitamente na mão.',
    mood: 'Marcante e Versátil',
  },
  {
    id: 'penta-major',
    name: 'Escala Pentatônica Maior',
    shortName: 'Pentatônica Maior',
    type: 'pentatonica',
    semitones: [0, 2, 4, 7, 9],
    intervals: ['1', '2', '3', '5', '6'],
    formula: 'Tom - Tom - 1½ Tom - Tom - 1½ Tom',
    explanation: 'Versão de 5 notas da escala maior, omitindo o 4º e o 7º graus. Produz uma sonoridade doce, suave e muito melódica.',
    usageTips: 'Muito empregada em licks e passagens no sertanejo moderno, country, vanera e dedilhados acústicos.',
    mood: 'Doce e Melódica',
  },
  {
    id: 'blues',
    name: 'Escala Blues (com Blue Note)',
    shortName: 'Pentatônica Blues',
    type: 'blues',
    semitones: [0, 3, 5, 6, 7, 10],
    intervals: ['1', 'b3', '4', 'b5', '5', 'b7'],
    formula: '1½ Tom - Tom - Semitom - Semitom - 1½ Tom - Tom',
    explanation: 'Pentatônica menor enriquecida com a Blue Note (b5 / quinta diminuta), nota de passagem com forte tensão emocional.',
    usageTips: 'Toque a Blue Note como nota de passagem para criar aquele fraseado com alma (bluesy) em modas e solos acústicos.',
    mood: 'Expressiva e Densa',
  },
];

export interface ScaleNoteItem {
  note: string;
  notePt: string;
  interval: string;
  isRoot: boolean;
  semitone: number;
}

/**
 * Get all the distinct notes in a scale for a given root note
 */
export function getScaleNotes(rootNote: string, scaleId: string): ScaleNoteItem[] {
  const scale = SCALES_DATABASE.find(s => s.id === scaleId) || SCALES_DATABASE[0];
  const rootIdx = CHROMATIC_NOTES.indexOf(rootNote);
  if (rootIdx === -1) return [];

  return scale.semitones.map((semitone, i) => {
    const noteIdx = (rootIdx + semitone) % 12;
    const note = CHROMATIC_NOTES[noteIdx];
    return {
      note,
      notePt: NOTE_PT_MAP[note] || note,
      interval: scale.intervals[i],
      isRoot: semitone === 0,
      semitone,
    };
  });
}

/**
 * Check if a note at (stringIndex, fret) belongs to the scale
 */
export function checkNoteInScale(
  stringIndex: number,
  fret: number,
  rootNote: string,
  scaleId: string
): { inScale: boolean; interval: string; isRoot: boolean; isBlueNote: boolean; note: string; notePt: string } {
  const noteInfo = getNoteAtFret(stringIndex, fret);
  const scaleNotes = getScaleNotes(rootNote, scaleId);

  const found = scaleNotes.find(item => item.note === noteInfo.note);
  if (!found) {
    return {
      inScale: false,
      interval: '',
      isRoot: false,
      isBlueNote: false,
      note: noteInfo.note,
      notePt: noteInfo.notePt,
    };
  }

  return {
    inScale: true,
    interval: found.interval,
    isRoot: found.isRoot,
    isBlueNote: found.interval === 'b5',
    note: noteInfo.note,
    notePt: noteInfo.notePt,
  };
}

export interface ScaleShapeDefinition {
  id: number; // 0 = all frets, 1..5 = shapes
  label: string;
  description: string;
}

export const SCALE_SHAPES: ScaleShapeDefinition[] = [
  { id: 0, label: 'Braço Completo', description: 'Visualiza todas as notas da escala ao longo de todo o braço' },
  { id: 1, label: 'Padrão / Shape 1', description: 'Posição 1: Digitação clássica com raiz na 6ª corda' },
  { id: 2, label: 'Padrão / Shape 2', description: 'Posição 2: Continuação subindo 2 a 3 casas' },
  { id: 3, label: 'Padrão / Shape 3', description: 'Posição 3: Região média com raiz na 5ª corda' },
  { id: 4, label: 'Padrão / Shape 4', description: 'Posição 4: Conexão intermediária para a oitava alta' },
  { id: 5, label: 'Padrão / Shape 5', description: 'Posição 5: Digitação que conecta de volta ao início' },
];

/**
 * Compute the fret range [minFret, maxFret] for a specific shape
 * Based on standard guitar CAGED box positions
 */
export function getShapeFretRange(
  rootNote: string,
  scaleId: string,
  shapeId: number,
  maxNeckFrets: number = 12
): { minFret: number; maxFret: number; shapeName: string } {
  if (shapeId === 0) {
    return { minFret: 0, maxFret: maxNeckFrets, shapeName: 'Braço Completo' };
  }

  const rootIdx = CHROMATIC_NOTES.indexOf(rootNote);
  // 6th string open is E (chromatic index 4).
  // Root fret on 6th string:
  const root6thFret = (rootIdx - 4 + 12) % 12;

  // Offsets for the 5 shapes (starting relative to root on 6th string)
  const isMinor = scaleId === 'minor' || scaleId === 'penta-minor' || scaleId === 'blues';
  
  // Standard Minor Box offsets vs Major Box offsets
  let startOffset = 0;
  let boxWidth = 3;

  if (isMinor) {
    switch (shapeId) {
      case 1: startOffset = 0; boxWidth = 3; break;
      case 2: startOffset = 2; boxWidth = 3; break;
      case 3: startOffset = 5; boxWidth = 3; break;
      case 4: startOffset = 7; boxWidth = 3; break;
      case 5: startOffset = 10; boxWidth = 3; break;
    }
  } else {
    // Major shapes
    switch (shapeId) {
      case 1: startOffset = -1; boxWidth = 3; break;
      case 2: startOffset = 2; boxWidth = 3; break;
      case 3: startOffset = 4; boxWidth = 3; break;
      case 4: startOffset = 7; boxWidth = 3; break;
      case 5: startOffset = 9; boxWidth = 3; break;
    }
  }

  let minFret = root6thFret + startOffset;
  while (minFret < 0) minFret += 12;
  minFret = minFret % 12;
  
  let maxFret = minFret + boxWidth;

  return {
    minFret,
    maxFret,
    shapeName: `Shape ${shapeId} (Casas ${minFret}ª a ${maxFret}ª)`
  };
}

/**
 * Returns an ordered array of notes from lowest to highest pitch
 * so the student can listen to the scale ascending and descending
 */
export function getOrderedScaleRun(
  rootNote: string,
  scaleId: string,
  minFret: number = 0,
  maxFret: number = 12
): Array<{ stringIndex: number; fret: number; note: string; interval: string; isRoot: boolean }> {
  const result: Array<{ stringIndex: number; fret: number; note: string; interval: string; isRoot: boolean; pitchValue: number }> = [];

  // 6 strings from 5 (6th string, lowest) down to 0 (1st string, highest)
  for (let s = 5; s >= 0; s--) {
    // Determine base semitone for open string: 6th E2=40, 5th A2=45, 4th D3=50, 3rd G3=55, 2nd B3=59, 1st E4=64
    const basePitches = [64, 59, 55, 50, 45, 40];
    const basePitch = basePitches[s];

    for (let f = minFret; f <= maxFret; f++) {
      const check = checkNoteInScale(s, f, rootNote, scaleId);
      if (check.inScale) {
        result.push({
          stringIndex: s,
          fret: f,
          note: check.note,
          interval: check.interval,
          isRoot: check.isRoot,
          pitchValue: basePitch + f,
        });
      }
    }
  }

  // Sort by pitch ascending
  result.sort((a, b) => a.pitchValue - b.pitchValue);

  // Remove immediate duplicate pitches to sound like a continuous melodic scale run
  const uniqueRun: Array<{ stringIndex: number; fret: number; note: string; interval: string; isRoot: boolean }> = [];
  let lastPitch = -1;

  for (const item of result) {
    if (item.pitchValue !== lastPitch) {
      uniqueRun.push({
        stringIndex: item.stringIndex,
        fret: item.fret,
        note: item.note,
        interval: item.interval,
        isRoot: item.isRoot,
      });
      lastPitch = item.pitchValue;
    }
  }

  return uniqueRun;
}
