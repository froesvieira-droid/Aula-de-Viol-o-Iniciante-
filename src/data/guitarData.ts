export interface GuitarStringInfo {
  index: number; // 0 = 1ª corda (E4/Mi agudo), 5 = 6ª corda (E2/Mi grave)
  number: number; // 1 to 6
  name: string; // "Mi (E)", "Si (B)", etc.
  cipher: string; // "E", "B", "G", "D", "A", "E"
  noteNamePt: string; // "Mi", "Si", "Sol", "Ré", "Lá", "Mi"
  octave: number;
  freq: number;
}

export const GUITAR_STRINGS: GuitarStringInfo[] = [
  { index: 0, number: 1, name: '1ª Corda - Mi (E4)', cipher: 'E', noteNamePt: 'Mi', octave: 4, freq: 329.63 },
  { index: 1, number: 2, name: '2ª Corda - Si (B3)', cipher: 'B', noteNamePt: 'Si', octave: 3, freq: 246.94 },
  { index: 2, number: 3, name: '3ª Corda - Sol (G3)', cipher: 'G', noteNamePt: 'Sol', octave: 3, freq: 196.00 },
  { index: 3, number: 4, name: '4ª Corda - Ré (D3)', cipher: 'D', noteNamePt: 'Ré', octave: 3, freq: 146.83 },
  { index: 4, number: 5, name: '5ª Corda - Lá (A2)', cipher: 'A', noteNamePt: 'Lá', octave: 2, freq: 110.00 },
  { index: 5, number: 6, name: '6ª Corda - Mi (E2)', cipher: 'E', noteNamePt: 'Mi', octave: 2, freq: 82.41 },
];

export const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const NOTE_PT_MAP: Record<string, string> = {
  'C': 'Dó',
  'C#': 'Dó#',
  'Db': 'Réb',
  'D': 'Ré',
  'D#': 'Ré#',
  'Eb': 'Mib',
  'E': 'Mi',
  'F': 'Fá',
  'F#': 'Fá#',
  'Gb': 'Solb',
  'G': 'Sol',
  'G#': 'Sol#',
  'Ab': 'Láb',
  'A': 'Lá',
  'A#': 'Lá#',
  'Bb': 'Sib',
  'B': 'Si',
};

// Open string base chromatic index for 6 strings (from string 1 (E4) to string 6 (E2)):
// E: 4, B: 11, G: 7, D: 2, A: 9, E: 4
const STRING_ROOT_SEMITONES = [4, 11, 7, 2, 9, 4]; // [1ª corda E, 2ª B, 3ª G, 4ª D, 5ª A, 6ª E]

export function getNoteAtFret(stringIndex: number, fret: number): { note: string; notePt: string; isNatural: boolean } {
  const rootIdx = STRING_ROOT_SEMITONES[stringIndex];
  const noteIdx = (rootIdx + fret) % 12;
  const note = CHROMATIC_NOTES[noteIdx];
  const isNatural = !note.includes('#');
  return {
    note,
    notePt: NOTE_PT_MAP[note] || note,
    isNatural,
  };
}

export interface ChordDefinition {
  id: string;
  name: string; // Ex: "Dó Maior"
  cipher: string; // Ex: "C"
  type: 'maior' | 'menor' | 'com sétima' | 'pestana' | 'aberto';
  category: 'básico' | 'intermediário' | 'pestana';
  // Frets for strings [6, 5, 4, 3, 2, 1]. -1 means muted (X), 0 means open (O)
  frets: [number, number, number, number, number, number];
  // Finger indicators for strings [6, 5, 4, 3, 2, 1]: 0 = none/open, 1 = Indicador, 2 = Médio, 3 = Anelar, 4 = Mínimo
  fingers: [number, number, number, number, number, number];
  barreFret?: number; // If barre chord, which fret
  barreStartString?: number; // 6 down to 1
  bassString: number; // which string is the root bass note (e.g. 5 for C, 6 for G, 4 for D)
  tips: string;
}

export const CHORD_DATABASE: ChordDefinition[] = [
  {
    id: 'c',
    name: 'Dó Maior',
    cipher: 'C',
    type: 'maior',
    category: 'básico',
    frets: [-1, 3, 2, 0, 1, 0],
    fingers: [0, 3, 2, 0, 1, 0],
    bassString: 5,
    tips: 'Deixe a 1ª corda solta vibrar bem. O polegar toca o baixo na 5ª corda (Lá).',
  },
  {
    id: 'd',
    name: 'Ré Maior',
    cipher: 'D',
    type: 'maior',
    category: 'básico',
    frets: [-1, -1, 0, 2, 3, 2],
    fingers: [0, 0, 0, 1, 3, 2],
    bassString: 4,
    tips: 'Toque a partir da 4ª corda solta (Ré). Curvar os dedos para não esbarrar na 1ª corda.',
  },
  {
    id: 'e',
    name: 'Mi Maior',
    cipher: 'E',
    type: 'maior',
    category: 'básico',
    frets: [0, 2, 2, 1, 0, 0],
    fingers: [0, 2, 3, 1, 0, 0],
    bassString: 6,
    tips: 'Todas as 6 cordas podem soar! O baixo mais encorpado e potente do violão.',
  },
  {
    id: 'g',
    name: 'Sol Maior',
    cipher: 'G',
    type: 'maior',
    category: 'básico',
    frets: [3, 2, 0, 0, 0, 3],
    fingers: [2, 1, 0, 0, 0, 3],
    bassString: 6,
    tips: 'Acorde rei do Sertanejo e do Pop. Também pode ser feito com dedo 4 na 1ª e dedo 3 na 2ª corda.',
  },
  {
    id: 'a',
    name: 'Lá Maior',
    cipher: 'A',
    type: 'maior',
    category: 'básico',
    frets: [-1, 0, 2, 2, 2, 0],
    fingers: [0, 0, 1, 2, 3, 0],
    bassString: 5,
    tips: 'Dedos bem alinhados e juntinhos dentro da 2ª casa. Baixo na 5ª corda.',
  },
  {
    id: 'em',
    name: 'Mi Menor',
    cipher: 'Em',
    type: 'menor',
    category: 'básico',
    frets: [0, 2, 2, 0, 0, 0],
    fingers: [0, 2, 3, 0, 0, 0],
    bassString: 6,
    tips: 'O acorde mais fácil para iniciantes! Apenas dois dedos na 2ª casa.',
  },
  {
    id: 'am',
    name: 'Lá Menor',
    cipher: 'Am',
    type: 'menor',
    category: 'básico',
    frets: [-1, 0, 2, 2, 1, 0],
    fingers: [0, 0, 2, 3, 1, 0],
    bassString: 5,
    tips: 'Mesmo desenho do Mi Maior (E), só que descendo uma corda para cada dedo.',
  },
  {
    id: 'dm',
    name: 'Ré Menor',
    cipher: 'Dm',
    type: 'menor',
    category: 'básico',
    frets: [-1, -1, 0, 2, 3, 1],
    fingers: [0, 0, 0, 2, 3, 1],
    bassString: 4,
    tips: 'Dedo 1 vai na 1ª casa da 1ª corda. O polegar toca a 4ª corda solta.',
  },
  {
    id: 'c7',
    name: 'Dó com Sétima',
    cipher: 'C7',
    type: 'com sétima',
    category: 'intermediário',
    frets: [-1, 3, 2, 3, 1, 0],
    fingers: [0, 3, 2, 4, 1, 0],
    bassString: 5,
    tips: 'Adiciona o dedo 4 (mínimo) na 3ª casa da 3ª corda. Cria a preparação sertaneja perfeita para Fá.',
  },
  {
    id: 'd7',
    name: 'Ré com Sétima',
    cipher: 'D7',
    type: 'com sétima',
    category: 'básico',
    frets: [-1, -1, 0, 2, 1, 2],
    fingers: [0, 0, 0, 2, 1, 3],
    bassString: 4,
    tips: 'Triângulo invertido em relação ao D. Muito comum em introduções de modas sertanejas e guaranias.',
  },
  {
    id: 'e7',
    name: 'Mi com Sétima',
    cipher: 'E7',
    type: 'com sétima',
    category: 'básico',
    frets: [0, 2, 0, 1, 0, 0],
    fingers: [0, 2, 0, 1, 0, 0],
    bassString: 6,
    tips: 'Basta tirar o dedo 3 do Mi Maior! Prepara para o Lá Menor (Am).',
  },
  {
    id: 'a7',
    name: 'Lá com Sétima',
    cipher: 'A7',
    type: 'com sétima',
    category: 'básico',
    frets: [-1, 0, 2, 0, 2, 0],
    fingers: [0, 0, 1, 0, 2, 0],
    bassString: 5,
    tips: 'Apenas dois dedos abertos na 2ª casa. Deixa a 3ª corda solta soar.',
  },
  {
    id: 'b7',
    name: 'Si com Sétima',
    cipher: 'B7',
    type: 'com sétima',
    category: 'intermediário',
    frets: [-1, 2, 1, 2, 0, 2],
    fingers: [0, 2, 1, 3, 0, 4],
    bassString: 5,
    tips: 'Excelente alternativa sem pestana para o Si. Abre a mão e usa os 4 dedos com precisão.',
  },
  {
    id: 'f',
    name: 'Fá Maior',
    cipher: 'F',
    type: 'pestana',
    category: 'pestana',
    frets: [1, 3, 3, 2, 1, 1],
    fingers: [1, 3, 4, 2, 1, 1],
    barreFret: 1,
    barreStartString: 6,
    bassString: 6,
    tips: 'A clássica pestana na 1ª casa! Dica de ouro: incline o indicador ligeiramente de lado para usar a parte óssea.',
  },
  {
    id: 'bm',
    name: 'Si Menor',
    cipher: 'Bm',
    type: 'pestana',
    category: 'pestana',
    frets: [-1, 2, 4, 4, 3, 2],
    fingers: [0, 1, 3, 4, 2, 1],
    barreFret: 2,
    barreStartString: 5,
    bassString: 5,
    tips: 'Pestana na 2ª casa a partir da 5ª corda. Desenho similar ao Lá Menor (Am) com pestana.',
  },
];

export interface CagedModel {
  name: string;
  shape: 'C' | 'A' | 'G' | 'E' | 'D';
  description: string;
  explanation: string;
  rootString: string;
}

export const CAGED_SYSTEM_MODELS: CagedModel[] = [
  {
    name: 'Modelo de Dó (Shape C)',
    shape: 'C',
    description: 'Fundamental na 5ª corda',
    explanation: 'Ao mover o desenho do C aberto pelo braço com pestana, você consegue tocar qualquer acorde maior mantendo o baixo na 5ª corda.',
    rootString: '5ª corda (Lá)',
  },
  {
    name: 'Modelo de Lá (Shape A)',
    shape: 'A',
    description: 'Fundamental na 5ª corda',
    explanation: 'O modelo mais usado para acordes com pestana aguda (ex: Si Maior na 2ª casa, Dó Maior na 3ª casa). Muito confortável e melódico.',
    rootString: '5ª corda (Lá)',
  },
  {
    name: 'Modelo de Sol (Shape G)',
    shape: 'G',
    description: 'Fundamental na 6ª corda',
    explanation: 'Conecta o modelo A ao modelo E. Possui aberturas ricas usadas em violão fingerstyle e solos sertanejos.',
    rootString: '6ª corda (Mi)',
  },
  {
    name: 'Modelo de Mi (Shape E)',
    shape: 'E',
    description: 'Fundamental na 6ª corda',
    explanation: 'O formato do Fá (F), Sol (G) na 3ª casa e Lá (A) na 5ª casa. É a base mais sólida e encorpada de acordes com pestana no violão.',
    rootString: '6ª corda (Mi)',
  },
  {
    name: 'Modelo de Ré (Shape D)',
    shape: 'D',
    description: 'Fundamental na 4ª corda',
    explanation: 'Desenho agudo formado nas cordas 1, 2 e 3 com o baixo na 4ª corda. Excelente para dedilhados finos e solos em dueto.',
    rootString: '4ª corda (Ré)',
  },
];
