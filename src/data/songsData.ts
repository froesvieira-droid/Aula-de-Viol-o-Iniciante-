export interface SongLine {
  chord?: string;
  lyric: string;
}

export interface SongSection {
  sectionName: string; // "Introdução", "Primeira Parte", "Refrão", "Segunda Parte"
  lines: SongLine[];
}

export interface SongItem {
  id: string;
  title: string;
  artist: string;
  composer?: string;
  key: string;
  timeSignature: string;
  recommendedBpm: number;
  rhythmId: string; // Maps to RHYTHM_PATTERNS
  difficulty: 'Fácil' | 'Médio' | 'Iniciante' | 'Fácil a Médio';
  chords: string[]; // Chord IDs from CHORD_DATABASE
  strumPatternSummary: string;
  teachingNotes: string[];
  sections: SongSection[];
}

export const SONGS_DATABASE: SongItem[] = [
  {
    id: 'no-dia-em-que-eu-sai-de-casa',
    title: 'No Dia em que Eu Saí de Casa',
    artist: 'Zezé Di Camargo & Luciano',
    composer: 'Joel Marques',
    key: 'D (Ré Maior)',
    timeSignature: '3/4 (Guarania / Canção Sertaneja)',
    recommendedBpm: 72,
    rhythmId: 'guarania-sertaneja',
    difficulty: 'Fácil',
    chords: ['d', 'a7', 'g', 'd7'],
    strumPatternSummary: 'Guarania: 𝄢 (Baixo no tempo 1) + ↓ (Rasqueio leve) + ↗ (Puxada I+M+A no tempo 2) + ✕ (Abafamento suave) + ↓↑',
    teachingNotes: [
      'Esta canção imortalizada no filme "2 Filhos de Francisco" é o modelo perfeito para dominar a Guarania sertaneja.',
      'A música inteira é tocada com apenas 4 acordes abertos fáceis: Ré (D), Lá com Sétima (A7), Sol (G) e a preparação Ré com Sétima (D7).',
      'No refrão, antes de mudar para Sol (G), faça o Ré com Sétima (D7) por 1 compasso para dar aquela transição sertaneja clássica!',
      'Mantenha o tempo 1 bem marcado com o polegar no bordão: corda 4 para Ré (D), corda 5 para Lá com Sétima (A7) e corda 6 para Sol (G).'
    ],
    sections: [
      {
        sectionName: 'Introdução',
        lines: [
          { chord: 'D', lyric: '[ D ]  [ A7 ]  [ G ]  [ D ]' },
          { chord: 'A7', lyric: '(Dedilhados ou levada suave de guarania sustentando o Ré)' },
        ],
      },
      {
        sectionName: 'Primeira Parte',
        lines: [
          { chord: 'D', lyric: 'No dia em que eu saí de casa' },
          { chord: 'A7', lyric: 'Minha mãe me disse: filho, vem cá' },
          { chord: 'G', lyric: 'Passou a mão em meus cabelos' },
          { chord: 'A7', lyric: 'Olhou em meus olhos' },
          { chord: 'D', lyric: 'Começou falar...' },
          { lyric: '' },
          { chord: 'D', lyric: 'Por onde você for eu rezo' },
          { chord: 'A7', lyric: 'E peço a Deus para te guiar' },
          { chord: 'G', lyric: 'Lhe abençoe e dê juízo' },
          { chord: 'A7', lyric: 'Para um dia você poder' },
          { chord: 'D', lyric: 'Voltar...' },
        ],
      },
      {
        sectionName: 'Preparação para o Refrão',
        lines: [
          { chord: 'D7', lyric: 'Olhe bem por onde pisa, meu filho...' },
        ],
      },
      {
        sectionName: 'Refrão',
        lines: [
          { chord: 'G', lyric: 'Hoje eu sei que aquela mãe querida' },
          { chord: 'A7', lyric: 'Tinha razão no que me dizia' },
          { chord: 'D', lyric: 'O mundo é grande e cheio de espinhos' },
          { chord: 'A7', lyric: 'E a gente sofre na vida...' },
          { lyric: '' },
          { chord: 'G', lyric: 'Mas as palavras da minha mãe' },
          { chord: 'A7', lyric: 'Eu guardei no coração' },
          { chord: 'D', lyric: 'E quando a tristeza invade o peito' },
          { chord: 'A7', lyric: 'Eu busco a força em uma' },
          { chord: 'D', lyric: 'Oração...' },
        ],
      },
      {
        sectionName: 'Segunda Parte',
        lines: [
          { chord: 'D', lyric: 'A mala que eu levei nos braços' },
          { chord: 'A7', lyric: 'Tinha pouca roupa, mas muita esperança' },
          { chord: 'G', lyric: 'No bolso um retrato de família' },
          { chord: 'A7', lyric: 'Onde eu ainda era' },
          { chord: 'D', lyric: 'Criança...' },
          { lyric: '' },
          { chord: 'D7', lyric: 'E na despedida com lágrimas nos olhos...' },
        ],
      },
      {
        sectionName: 'Refrão Final',
        lines: [
          { chord: 'G', lyric: 'Hoje eu sei que aquela mãe querida' },
          { chord: 'A7', lyric: 'Tinha razão no que me dizia' },
          { chord: 'D', lyric: 'O mundo é grande e cheio de espinhos' },
          { chord: 'A7', lyric: 'E a gente sofre na vida...' },
          { lyric: '' },
          { chord: 'G', lyric: 'Mas as palavras da minha mãe' },
          { chord: 'A7', lyric: 'Eu guardei no coração' },
          { chord: 'A7', lyric: 'Minha mãe, minha santa mãe...' },
          { chord: 'D', lyric: 'Minha oração!' },
        ],
      },
    ],
  },
  {
    id: 'pra-nao-pensar-em-voce',
    title: 'Pra Não Pensar em Você',
    artist: 'Zezé Di Camargo & Luciano',
    composer: 'César Augusto / Pouso Alto',
    key: 'G (Sol Maior)',
    timeSignature: '4/4 (Balada Sertaneja / Sertanejo Universitário)',
    recommendedBpm: 84,
    rhythmId: 'sertanejo-universitario',
    difficulty: 'Fácil a Médio',
    chords: ['g', 'd', 'em', 'c', 'am', 'd7'],
    strumPatternSummary: 'Balada Sertaneja: 𝄢 (Baixo) + ↑ (Sobe) + ↓ (Desce) + ↑ (Sobe) + ✕ (Slap na Palma) + ↑ (Sobe) + ↓↑',
    teachingNotes: [
      'Um dos maiores hinos românticos de Zezé Di Camargo & Luciano, perfeito para treinar a batida sertaneja 4/4.',
      'O segredo desta música está no contraste: estrofes com levada suave (quase dedilhada ou com baixo bem definido) e refrão com o slap marcante na palma da mão.',
      'A progressão G -> D -> Em -> C é a famosa "progressão dos 4 acordes mágicos", que serve para centenas de canções populares.',
      'Preste atenção no acorde Lá Menor (Am) que aparece na transição antes do refrão: ele prepara a descida para o Ré (D)!'
    ],
    sections: [
      {
        sectionName: 'Introdução',
        lines: [
          { chord: 'G', lyric: '[ G ]  [ D ]  [ Em ]  [ C ]' },
          { chord: 'G', lyric: '[ G ]  [ D ]  [ C ]  [ G ]' },
        ],
      },
      {
        sectionName: 'Primeira Parte',
        lines: [
          { chord: 'G', lyric: 'Quando a saudade doer' },
          { chord: 'D', lyric: 'E a solidão machucar' },
          { chord: 'Em', lyric: 'Pra não pensar em você' },
          { chord: 'C', lyric: 'Nem ver o tempo passar...' },
          { lyric: '' },
          { chord: 'G', lyric: 'Eu ligo o rádio e finjo' },
          { chord: 'D', lyric: 'Que está tudo bem' },
          { chord: 'C', lyric: 'Mas cada canção que toca' },
          { chord: 'D', lyric: 'Lembra alguém...' },
        ],
      },
      {
        sectionName: 'Pré-Refrão',
        lines: [
          { chord: 'Am', lyric: 'Eu tento disfarçar' },
          { chord: 'C', lyric: 'E me enganar...' },
          { chord: 'Am', lyric: 'Mas o meu coração' },
          { chord: 'D7', lyric: 'Só quer te chamar!' },
        ],
      },
      {
        sectionName: 'Refrão (Com energia e slap)',
        lines: [
          { chord: 'G', lyric: 'Pra não pensar em você' },
          { chord: 'D', lyric: 'Eu mudo a estação do rádio' },
          { chord: 'Em', lyric: 'Pra não pensar em você' },
          { chord: 'C', lyric: 'Eu saio pra qualquer lugar...' },
          { lyric: '' },
          { chord: 'G', lyric: 'Mas onde quer que eu vá' },
          { chord: 'D', lyric: 'O seu olhar me segue' },
          { chord: 'C', lyric: 'Não tem jeito de esquecer' },
          { chord: 'D', lyric: 'Meu amor, não tem como...' },
          { chord: 'G', lyric: 'Pra não pensar em você!' },
        ],
      },
      {
        sectionName: 'Segunda Parte',
        lines: [
          { chord: 'G', lyric: 'Olho nos olhos de alguém' },
          { chord: 'D', lyric: 'Tentando te reencontrar' },
          { chord: 'Em', lyric: 'Mas o perfume que sinto' },
          { chord: 'C', lyric: 'Só você pode deixar...' },
          { lyric: '' },
          { chord: 'Am', lyric: 'Vou pela contramão' },
          { chord: 'C', lyric: 'Sem rumo e sem chão' },
          { chord: 'Am', lyric: 'Vivendo nessa ilusão' },
          { chord: 'D7', lyric: 'De ter o seu perdão...' },
        ],
      },
      {
        sectionName: 'Refrão Final',
        lines: [
          { chord: 'G', lyric: 'Pra não pensar em você' },
          { chord: 'D', lyric: 'Eu mudo a estação do rádio' },
          { chord: 'Em', lyric: 'Pra não pensar em você' },
          { chord: 'C', lyric: 'Eu saio pra qualquer lugar...' },
          { lyric: '' },
          { chord: 'G', lyric: 'Mas onde quer que eu vá' },
          { chord: 'D', lyric: 'O seu olhar me segue' },
          { chord: 'C', lyric: 'Não tem jeito de esquecer' },
          { chord: 'D', lyric: 'Meu amor, não tem como...' },
          { chord: 'G', lyric: 'Pra não pensar em você!' },
        ],
      },
    ],
  },
  {
    id: 'chalana-pantaneira',
    title: 'Chalana',
    artist: 'Almir Sater / Sérgio Reis',
    composer: 'Mário Zan / Arlindo Pinto',
    key: 'D (Ré Maior)',
    timeSignature: '3/4 (Guarania Pantaneira)',
    recommendedBpm: 68,
    rhythmId: 'guarania-sertaneja',
    difficulty: 'Iniciante',
    chords: ['d', 'a7', 'g'],
    strumPatternSummary: 'Guarania: Baixo no tempo 1 + Rasqueio + Puxada suave',
    teachingNotes: [
      'A canção símbolo do pantanal brasileiro.',
      'Utiliza apenas 3 acordes abertos: D, A7 e G.',
    ],
    sections: [
      {
        sectionName: 'Refrão Principal',
        lines: [
          { chord: 'D', lyric: 'Lá vai a chalana' },
          { chord: 'A7', lyric: 'Bem longe se vai' },
          { chord: 'G', lyric: 'Navegando no remanso' },
          { chord: 'D', lyric: 'Do Rio Paraguai...' },
        ],
      },
    ],
  },
];
