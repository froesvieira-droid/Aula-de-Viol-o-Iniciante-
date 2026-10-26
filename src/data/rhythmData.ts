export type StrumAction = 'down' | 'up' | 'bass' | 'mute' | 'pluck';

export interface StrumStep {
  beat: number; // e.g., 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5
  action: StrumAction;
  symbol: string; // "↓", "↑", "𝄢", "✕", "↗"
  label: string; // "Baixo", "Desce", "Sobe", "Abafa"
  finger: string; // "P", "I/M", "Palma", "I"
  isAccent?: boolean;
}

export interface RhythmPattern {
  id: string;
  name: string;
  category: 'sertanejo' | 'guarania' | 'pop' | 'tradicional';
  timeSignature: string; // "4/4", "3/4", "6/8", "2/4"
  defaultBpm: number;
  minBpm: number;
  maxBpm: number;
  description: string;
  rightHandTechnique: string;
  steps: StrumStep[];
  demoChords: string[]; // Chord IDs from CHORD_DATABASE
  famousSongs: { title: string; artist: string; key: string }[];
  didacticTips: string[];
}

export const RHYTHM_PATTERNS: RhythmPattern[] = [
  {
    id: 'sertanejo-universitario',
    name: 'Sertanejo Universitário / Balada',
    category: 'sertanejo',
    timeSignature: '4/4',
    defaultBpm: 88,
    minBpm: 60,
    maxBpm: 125,
    description: 'A batida mais tocada no Brasil! O segredo é o contraste entre o toque do polegar no baixo, o rasgueado descendente e o abafamento seco (mute) na palma.',
    rightHandTechnique: 'Mão direita solta. O polegar (P) comanda a corda mais grave do acorde. No tempo 3, apoie a lateral da palma da mão nas cordas ao mesmo tempo que desce os dedos para abafar (slap).',
    steps: [
      { beat: 1, action: 'bass', symbol: '𝄢', label: 'Baixo', finger: 'P (Polegar)', isAccent: true },
      { beat: 1.5, action: 'up', symbol: '↑', label: 'Sobe', finger: 'I (Indicador)' },
      { beat: 2, action: 'down', symbol: '↓', label: 'Desce', finger: 'I/M' },
      { beat: 2.5, action: 'up', symbol: '↑', label: 'Sobe', finger: 'I' },
      { beat: 3, action: 'mute', symbol: '✕', label: 'Abafa', finger: 'Palma / Slap', isAccent: true },
      { beat: 3.5, action: 'up', symbol: '↑', label: 'Sobe', finger: 'I' },
      { beat: 4, action: 'down', symbol: '↓', label: 'Desce', finger: 'I/M' },
      { beat: 4.5, action: 'up', symbol: '↑', label: 'Sobe', finger: 'I' },
    ],
    demoChords: ['g', 'd', 'em', 'c'],
    famousSongs: [
      { title: 'Pra Não Pensar em Você', artist: 'Zezé Di Camargo & Luciano', key: 'G' },
      { title: 'Evidências (Versão Balada)', artist: 'Chitãozinho & Xororó', key: 'E' },
      { title: 'Ai Se Eu Te Pego', artist: 'Michel Teló', key: 'G' },
      { title: 'Flor e o Beija-Flor', artist: 'Henrique & Juliano', key: 'D' },
    ],
    didacticTips: [
      'Não bata com força excessiva: o balanço sertanejo vem do pulso relaxado, como se estivesse sacudindo água dos dedos.',
      'No tempo "Abafa", silencie todas as cordas usando a parte gordinha da mão direita rente ao cavalete.',
      'Sempre identifique o bordão (baixo principal) de cada acorde: Mi para G e E, Lá para C e A, Ré para D.',
    ],
  },
  {
    id: 'guarania-sertaneja',
    name: 'Guarania Sertaneja',
    category: 'guarania',
    timeSignature: '3/4',
    defaultBpm: 72,
    minBpm: 50,
    maxBpm: 95,
    description: 'O ritmo mais clássico, poético e emocionante da música sertaneja caipira e pantaneira. Caracterizado pelo compasso ternário balançado com puxadas expressivas de dedos.',
    rightHandTechnique: 'Utiliza técnica clássica de violão caipira: o polegar toca o baixo no tempo 1, seguido de puxada conjunta (dedos I, M, A) e corte suave no tempo 3.',
    steps: [
      { beat: 1, action: 'bass', symbol: '𝄢', label: 'Baixo', finger: 'P (Polegar)', isAccent: true },
      { beat: 1.5, action: 'down', symbol: '↓', label: 'Rasqueado', finger: 'Dedos I/M' },
      { beat: 2, action: 'pluck', symbol: '↗', label: 'Puxa', finger: 'I + M + A', isAccent: true },
      { beat: 2.5, action: 'mute', symbol: '✕', label: 'Abafa', finger: 'Palma suave' },
      { beat: 3, action: 'down', symbol: '↓', label: 'Desce', finger: 'I/M' },
      { beat: 3.5, action: 'up', symbol: '↑', label: 'Sobe', finger: 'Polegar suave' },
    ],
    demoChords: ['d', 'a7', 'g', 'd'],
    famousSongs: [
      { title: 'No Dia em que Eu Saí de Casa', artist: 'Zezé Di Camargo & Luciano', key: 'D' },
      { title: 'Chalana', artist: 'Mário Zan / Almir Sater', key: 'D' },
      { title: 'Boate Azul', artist: 'Benedito Seviero / Joaquim R. Filho', key: 'Am' },
      { title: 'Índia', artist: 'Cascatinha & Inhana', key: 'D' },
    ],
    didacticTips: [
      'A guarania respira! Dê espaço entre o toque do polegar no baixo e a entrada suave dos agudos.',
      'Na canção sertaneja, alterne o baixo entre o tempo 1 e o próximo compasso (ex: em D, toque Ré depois Lá).',
      'Ouça o clássico "Chalana": sinta o movimento de vai e vem da água de um barco.',
    ],
  },
  {
    id: 'pop-rock-universal',
    name: 'Pop / Pop Rock (A Batida Universal)',
    category: 'pop',
    timeSignature: '4/4',
    defaultBpm: 96,
    minBpm: 65,
    maxBpm: 140,
    description: 'A batida mais famosa do mundo para violão: ↓ ↓↑ ↑↓↑. Se você aprender este ritmo, conseguirá tocar mais de 70% das músicas do rádio nacional e internacional!',
    rightHandTechnique: 'O braço da mão direita deve funcionar como um pêndulo constante (subindo e descendo). Mesmo quando não toca a corda, a mão continua o movimento no ar.',
    steps: [
      { beat: 1, action: 'down', symbol: '↓', label: 'Desce', finger: 'Dedos I/M', isAccent: true },
      { beat: 2, action: 'down', symbol: '↓', label: 'Desce', finger: 'Dedos I/M' },
      { beat: 2.5, action: 'up', symbol: '↑', label: 'Sobe', finger: 'Polegar / I' },
      { beat: 3.5, action: 'up', symbol: '↑', label: 'Sobe', finger: 'Polegar / I', isAccent: true },
      { beat: 4, action: 'down', symbol: '↓', label: 'Desce', finger: 'Dedos I/M' },
      { beat: 4.5, action: 'up', symbol: '↑', label: 'Sobe', finger: 'Polegar / I' },
    ],
    demoChords: ['c', 'g', 'am', 'f'],
    famousSongs: [
      { title: 'Pais e Filhos', artist: 'Legião Urbana', key: 'C' },
      { title: 'Tempo Perdido', artist: 'Legião Urbana', key: 'C' },
      { title: 'Knockin’ on Heaven’s Door', artist: 'Bob Dylan', key: 'G' },
      { title: 'More Than Words (Base)', artist: 'Extreme', key: 'G' },
    ],
    didacticTips: [
      'A regra de ouro: ↓ ↓↑ | ↑↓↑ (Desce | Desce-Sobe | Sobe-Desce-Sobe).',
      'Atenção ao tempo 3: a mão desce no ar SEM tocar nas cordas, e toca apenas na subida (o "e" do 3).',
      'Treine primeiro com a mão esquerda abafando as cordas soltas para focar só no ritmo da mão direita.',
    ],
  },
  {
    id: 'moda-de-viola',
    name: 'Toada / Moda de Viola Caipira',
    category: 'sertanejo',
    timeSignature: '2/4',
    defaultBpm: 80,
    minBpm: 60,
    maxBpm: 110,
    description: 'Ritmo tradicional do homem do campo brasileiro. Batida rústica com marcação forte de bordão e batimento estalado nas primas.',
    rightHandTechnique: 'Ataque decidido: o polegar toca forte no baixo, seguido de um toque rasgado para baixo e uma puxada de resposta.',
    steps: [
      { beat: 1, action: 'bass', symbol: '𝄢', label: 'Baixo', finger: 'P (Bordão)', isAccent: true },
      { beat: 1.5, action: 'down', symbol: '↓', label: 'Rasqueia', finger: 'I/M/A' },
      { beat: 2, action: 'mute', symbol: '✕', label: 'Abafa', finger: 'Palma', isAccent: true },
      { beat: 2.5, action: 'up', symbol: '↑', label: 'Sobe', finger: 'Polegar' },
    ],
    demoChords: ['e', 'b7', 'a', 'e'],
    famousSongs: [
      { title: 'Menino da Porteira', artist: 'Sérgio Reis / Teddy Vieira', key: 'E' },
      { title: 'Chico Mineiro', artist: 'Tonico & Tinoco', key: 'A' },
      { title: 'O Ipê e a Flor', artist: 'Goiano & Paranaense', key: 'E' },
    ],
    didacticTips: [
      'Alterne o baixo do acorde a cada compasso: em Mi Maior, toque na 6ª corda, depois na 5ª corda.',
      'Esse ritmo dá a sustentação rítmica perfeita quando outro violão ou viola caipira está solando.',
    ],
  },
  {
    id: 'valsa-sertaneja',
    name: 'Valsa / Canção Sertaneja',
    category: 'tradicional',
    timeSignature: '3/4',
    defaultBpm: 90,
    minBpm: 60,
    maxBpm: 120,
    description: 'O clássico 1 - 2 - 3 do violão acústico. Uma das primeiras batidas que todo aluno aprende pela simplicidade e beleza melódica.',
    rightHandTechnique: 'No tempo 1: polegar no baixo. No tempo 2: dedos I, M, A tocam para baixo nas 3 primeiras cordas. No tempo 3: repete o toque descendente.',
    steps: [
      { beat: 1, action: 'bass', symbol: '𝄢', label: 'Baixo (1)', finger: 'P (Polegar)', isAccent: true },
      { beat: 2, action: 'down', symbol: '↓', label: 'Acorde (2)', finger: 'Dedos I/M' },
      { beat: 3, action: 'down', symbol: '↓', label: 'Acorde (3)', finger: 'Dedos I/M' },
    ],
    demoChords: ['c', 'g', 'f', 'c'],
    famousSongs: [
      { title: 'Fuscão Preto', artist: 'Almir Rogério', key: 'Am' },
      { title: 'As Andorinhas', artist: 'Trio Parada Dura', key: 'C' },
      { title: 'No Rancho Fundo', artist: 'Ary Barroso / Chitãozinho & Xororó', key: 'D' },
    ],
    didacticTips: [
      'Marque bem o primeiro tempo (baixo) mais forte, e os tempos 2 e 3 mais aveludados e suaves.',
      'Excelente ritmo para quem está começando e ainda demora para trocar de acordes.',
    ],
  },
  {
    id: 'xote-violao',
    name: 'Xote / Forró Pé de Serra',
    category: 'tradicional',
    timeSignature: '4/4',
    defaultBpm: 84,
    minBpm: 60,
    maxBpm: 105,
    description: 'Balanço sincopado irresistível da cultura brasileira. Combina o som gordo do zabumba no polegar com a resposta rápida nas cordas agudas.',
    rightHandTechnique: 'O polegar toca o baixo bem apoiado no tempo 1, e no contra-tempo os dedos puxam com um toque abafadinho curto (staccato).',
    steps: [
      { beat: 1, action: 'bass', symbol: '𝄢', label: 'Baixo (Dum)', finger: 'P', isAccent: true },
      { beat: 1.5, action: 'pluck', symbol: '↗', label: 'Puxa (Tchá)', finger: 'I+M+A' },
      { beat: 2, action: 'mute', symbol: '✕', label: 'Corta', finger: 'Dedos' },
      { beat: 2.5, action: 'bass', symbol: '𝄢', label: 'Baixo Secundário', finger: 'P' },
      { beat: 3, action: 'pluck', symbol: '↗', label: 'Puxa', finger: 'I+M+A', isAccent: true },
      { beat: 3.5, action: 'mute', symbol: '✕', label: 'Corta', finger: 'Dedos' },
      { beat: 4, action: 'pluck', symbol: '↗', label: 'Puxa', finger: 'I+M+A' },
    ],
    demoChords: ['d', 'a', 'g', 'd'],
    famousSongs: [
      { title: 'Esperando na Janela', artist: 'Gilberto Gil', key: 'G' },
      { title: 'Xote das Meninas', artist: 'Luiz Gonzaga', key: 'A' },
      { title: 'Rindo à Toa', artist: 'Falamansa', key: 'C' },
    ],
    didacticTips: [
      'Deixe as puxadas curtas: assim que os dedos I, M, A puxarem, solte levemente a pressão dos dedos da mão esquerda para cortar a nota.',
      'Sinta o balanço: não acelere!',
    ],
  },
];
