export interface LessonSection {
  title: string;
  content: string; // Markdown / formatted explanation
  highlightBox?: {
    type: 'dica' | 'atencao' | 'exercicio';
    title: string;
    text: string;
  };
}

export interface LessonSong {
  title: string;
  artist: string;
  rhythmId: string;
  chords: string[];
  lyricsAndChords: { chord?: string; lyric: string }[];
}

export interface Lesson {
  id: string;
  order: number;
  module: string;
  title: string;
  summary: string;
  durationMinutes: number;
  level: 'Iniciante Zero' | 'Básico 1' | 'Básico 2' | 'Intermediário';
  sections: LessonSection[];
  targetChords: string[]; // Chord IDs from CHORD_DATABASE
  targetRhythmId?: string; // Rhythm ID
  practiceTasks: string[];
  featuredSong?: LessonSong;
}

export const BEGINNER_LESSONS: Lesson[] = [
  {
    id: 'aula-1-anatomia-e-postura',
    order: 1,
    module: 'Módulo 1: O Ponto de Partida',
    title: 'Anatomia do Violão, Postura e Mão Direita vs Mão Esquerda',
    summary: 'Aprenda como segurar o violão sem cansaço, a numeração universal dos dedos e o papel de cada mão.',
    durationMinutes: 15,
    level: 'Iniciante Zero',
    sections: [
      {
        title: '1. O Violão e Suas Partes Essenciais',
        content: `O violão acústico (clássico ou folk) é composto por três partes principais:\n\n• **Corpo (Caixa Acústica)**: Amplifica o som produzido pelas cordas. Possui o tampo, laterais, fundo e o bocal (soundhole).\n• **Braço (Escala)**: Onde ficam os trastes (barrinhas de metal) e as casas. É onde sua mão esquerda (ou direita se canhoto) vai apertar as notas.\n• **Mão / Headstock (Cravelhame)**: Onde ficam as 6 tarraxas responsáveis por esticar ou afrouxar as cordas para afinar.`,
        highlightBox: {
          type: 'dica',
          title: 'Regra da Casa',
          text: 'Quando uma cifra diz "aperte na 2ª casa", você não aperta em cima do ferrinho (traste), e sim logo atrás dele, perto do metal. Isso produz um som limpo e sem trastejar!',
        },
      },
      {
        title: '2. Numeração dos Dedos',
        content: `Na música para violão, as mãos têm convenções diferentes:\n\n• **Mão Esquerda (que monta os acordes)**:  \n  1 = Indicador  \n  2 = Médio  \n  3 = Anelar  \n  4 = Dedo Mínimo (mindinho)  \n  (O polegar fica atrás do braço como apoio)\n\n• **Mão Direita (que toca o ritmo / dedilhado)**:  \n  P = Polegar (cuida dos bordões mais graves: cordas 6, 5 e 4)  \n  I = Indicador (corda 3)  \n  M = Médio (corda 2)  \n  A = Anelar (corda 1)`,
      },
      {
        title: '3. Postura Correta para Evitar Dores',
        content: `1. Sente-se na ponta da cadeira com a coluna reta e os ombros relaxados.\n2. O violão deve descansar na perna direita (postura popular) ou entre as pernas (postura clássica).\n3. O polegar da mão esquerda deve ficar na metade de trás do braço, reto e apontado para cima. **Nunca aperte o braço com a mão em formato de taco de beisebol!**\n4. Mantenha os dedos arqueados como garras de gato sobre as cordas.`,
      },
    ],
    targetChords: ['em'],
    practiceTasks: [
      'Identificar o corpo, braço, boca e as 6 tarraxas no seu violão.',
      'Posicionar o violão no colo com coluna relaxada e polegar no meio do braço.',
      'Testar tocar as cordas soltas com o polegar (P) de cima para baixo.',
    ],
  },
  {
    id: 'aula-2-afinacao-e-cordas',
    order: 2,
    module: 'Módulo 1: O Ponto de Partida',
    title: 'As 6 Cordas do Violão e Como Afinar Perfeitamente',
    summary: 'Domine a ordem das cordas (da mais fina para a mais grossa) e aprenda a usar o afinador integrado.',
    durationMinutes: 15,
    level: 'Iniciante Zero',
    sections: [
      {
        title: '1. Ordem das Cordas: Da 1ª à 6ª',
        content: `As cordas do violão são contadas de **baixo para cima** (da mais fina para a mais grossa):\n\n• **1ª Corda (Mais fininha)**: Mi agudo (E4)  \n• **2ª Corda**: Si (B3)  \n• **3ª Corda**: Sol (G3)  \n• **4ª Corda**: Ré (D3)  \n• **5ª Corda**: Lá (A2)  \n• **6ª Corda (Mais grossa)**: Mi grave (E2)\n\nMacete brasileiro para memorizar: **"MI - SI - SOL - RÉ - LÁ - MI"**!`,
        highlightBox: {
          type: 'dica',
          title: 'Dica do Afinador',
          text: 'Abra a aba "Afinador" deste app. Toque cada corda solta e compare o som com o gerador de notas, ou ative o microfone para conferir se o ponteiro fica no centro verde!',
        },
      },
      {
        title: '2. Como Ler Diagramas de Acordes',
        content: `Um diagrama de acorde representa o braço do violão em pé:\n\n• As 6 linhas verticais são as cordas (a da esquerda é a 6ª corda Mi grave, a da direita é a 1ª corda Mi agudo).\n• As linhas horizontais são os trastes (casas 1, 2, 3, etc.).\n• As bolinhas indicam onde você coloca os dedos.\n• O símbolo **O** no topo significa que a corda é tocada solta.\n• O símbolo **X** significa que a corda NÃO deve ser tocada.`,
      },
    ],
    targetChords: ['em', 'e'],
    practiceTasks: [
      'Memorizar de cabeça o nome das 6 cordas: Mi, Si, Sol, Ré, Lá, Mi.',
      'Usar a ferramenta Afinador deste aplicativo para conferir as 6 cordas do seu violão.',
      'Tocar cada corda solta 4 vezes consecutivas com som límpido.',
    ],
  },
  {
    id: 'aula-3-primeiros-acordes-em-a7',
    order: 3,
    module: 'Módulo 1: O Ponto de Partida',
    title: 'Seus Primeiros Acordes: Mi Menor (Em) e Lá com Sétima (A7)',
    summary: 'A dupla de ouro para começar a tocar sua primeira sequência musical hoje mesmo.',
    durationMinutes: 20,
    level: 'Básico 1',
    sections: [
      {
        title: '1. O Acorde de Mi Menor (Em)',
        content: `O Mi Menor (Em) é o melhor primeiro acorde porque só utiliza dois dedos:\n\n• **Dedo 2 (Médio)**: 5ª corda, 2ª casa  \n• **Dedo 3 (Anelar)**: 4ª corda, 2ª casa  \n• Todas as outras cordas são tocadas soltas!\n\nToque as 6 cordas uma por uma. Se alguma estiver com som abafado ou "choca", levante a ponta dos dedos para não esbarrar nas cordas vizinhas.`,
      },
      {
        title: '2. O Acorde de Lá com Sétima (A7)',
        content: `O Lá com Sétima (A7) combina perfeitamente com o Mi Menor:\n\n• **Dedo 1 (Indicador)**: 4ª corda, 2ª casa  \n• **Dedo 2 (Médio)**: 2ª corda, 2ª casa  \n• A 5ª corda (Lá) é a nota mais grave (baixo).\n• A 6ª corda não deve ser tocada (ou deve ser levemente abafada com o polegar).`,
        highlightBox: {
          type: 'exercicio',
          title: 'Exercício de Transição Limpa',
          text: 'Monte o Em e conte 4 batidas para baixo. Depois mude para o A7 e conte 4 batidas para baixo. Repita sem parar o ritmo da mão direita, mesmo que o acorde soe imperfeito no início!',
        },
      },
    ],
    targetChords: ['em', 'a7'],
    targetRhythmId: 'valsa-sertaneja',
    practiceTasks: [
      'Montar o Mi Menor (Em) e tocar todas as cordas sem chiar.',
      'Montar o Lá com Sétima (A7) com a ponta dos dedos 1 e 2.',
      'Praticar 10 transições seguidas entre Em e A7 mantendo o tempo.',
    ],
  },
  {
    id: 'aula-4-ritmo-pop-universal',
    order: 4,
    module: 'Módulo 2: Dominando os Ritmos',
    title: 'A Batida Pop Rock Universal (↓ ↓↑ ↑↓↑)',
    summary: 'A batida mais importante do violão mundial: toque Legião Urbana, Capital Inicial, Coldplay e centenas de hits.',
    durationMinutes: 25,
    level: 'Básico 1',
    sections: [
      {
        title: '1. A Fórmula Mágica da Mão Direita',
        content: `A batida pop universal é dividida em duas metades:\n\n**1ª Parte**: ↓ (tempo 1) e depois ↓↑ (tempo 2 e contratempo)  \n**2ª Parte**: ↑ (contratempo do 3) e depois ↓↑ (tempo 4 e contratempo)\n\nJuntando tudo:\n### **↓ ↓↑ | ↑↓↑**\n*(Desce | Desce-Sobe | Sobe-Desce-Sobe)*`,
        highlightBox: {
          type: 'dica',
          title: 'O Segredo do Pêndulo',
          text: 'No tempo 3, sua mão DESCE NO AR sem encostar nas cordas. Essa descida fantasma garante que você suba no tempo exato (contratempo). É o que separa um iniciante travado de um violonista fluido!',
        },
      },
      {
        title: '2. Treinando a Batida com Som Abafado',
        content: `Antes de colocar acordes difíceis:\n1. Coloque os 4 dedos da mão esquerda suavemente deitados sobre as cordas (sem apertar até o metal), para deixar o som apenas percussivo ("tuc-tuc").\n2. Ligue o metrônomo deste app em 80 BPM na aba "Ritmos".\n3. Execute o movimento ↓ ↓↑ | ↑↓↑ acompanhando as setas visuais na tela.`,
      },
    ],
    targetChords: ['g', 'd', 'em', 'c'],
    targetRhythmId: 'pop-rock-universal',
    practiceTasks: [
      'Executar a batida ↓ ↓↑ ↑↓↑ 10 vezes seguidas com as cordas abafadas.',
      'Tocar a progressão G - D - Em - C com 1 ciclo da batida pop em cada acorde.',
      'Tocar junto com o reprodutor de ritmo em 85 BPM na aba Ritmos.',
    ],
    featuredSong: {
      title: 'Tempo Perdido',
      artist: 'Legião Urbana',
      rhythmId: 'pop-rock-universal',
      chords: ['C', 'Am', 'Bm', 'Em'],
      lyricsAndChords: [
        { chord: 'C', lyric: 'Todos os dias quando acordo' },
        { chord: 'Am', lyric: 'Não tenho mais o tempo que passou' },
        { chord: 'Em', lyric: 'Mas tenho muito tempo' },
        { chord: 'Em', lyric: 'Temos todo o tempo do mundo...' },
      ],
    },
  },
  {
    id: 'aula-5-ritmo-sertanejo',
    order: 5,
    module: 'Módulo 2: Dominando os Ritmos',
    title: 'A Batida Sertaneja: O Balanço do Baixo e o Abafado na Palma',
    summary: 'Aprenda o ritmo característico do Sertanejo Universitário e Balada Sertaneja com troca de baixo e slap.',
    durationMinutes: 25,
    level: 'Básico 2',
    sections: [
      {
        title: '1. O Papel do Polegar no Sertanejo',
        content: `No sertanejo, o baixo do violão comanda a música. Em vez de descer todas as cordas de uma vez no tempo 1, o **polegar (P)** toca isoladamente o bordão principal:\n\n• Se o acorde for **Sol (G)** ou **Mi (E)**: o polegar toca a **6ª corda**.\n• Se o acorde for **Dó (C)** ou **Lá (A)**: o polegar toca a **5ª corda**.\n• Se o acorde for **Ré (D)**: o polegar toca a **4ª corda**.`,
      },
      {
        title: '2. A Batida Completa do Sertanejo Universitário',
        content: `O ciclo sertanejo tem 4 tempos:\n\n• **Tempo 1**: Polegar no Baixo (𝄢) + Indicador sobe (↑)  \n• **Tempo 2**: Dedos descem (↓) + Indicador sobe (↑)  \n• **Tempo 3**: **Abafado com a palma da mão (✕)** + Indicador sobe (↑)  \n• **Tempo 4**: Dedos descem (↓) + Indicador sobe (↑)`,
        highlightBox: {
          type: 'atencao',
          title: 'Como Fazer o Abafamento (Slap)',
          text: 'No tempo 3, apoie a lateral da palma da mão direita sobre as cordas perto do cavalete no exato momento que os dedos batem nas cordas. O som deve ser seco e percussivo, como um estalo de caixa de bateria!',
        },
      },
    ],
    targetChords: ['d', 'a', 'g'],
    targetRhythmId: 'sertanejo-universitario',
    practiceTasks: [
      'Identificar o bordão correto para os acordes D (4ª corda), A (5ª corda) e G (6ª corda).',
      'Treinar o abafamento na palma até produzir um som percussivo seco sem ressonância.',
      'Executar a sequência sertaneja completa D -> A -> G -> D com áudio guiado.',
    ],
    featuredSong: {
      title: 'Pra Não Pensar em Você',
      artist: 'Zezé Di Camargo & Luciano',
      rhythmId: 'sertanejo-universitario',
      chords: ['G', 'D', 'Em', 'C'],
      lyricsAndChords: [
        { chord: 'G', lyric: 'Quando a saudade doer' },
        { chord: 'D', lyric: 'E a solidão machucar' },
        { chord: 'Em', lyric: 'Pra não pensar em você' },
        { chord: 'C', lyric: 'Nem ver o tempo passar...' },
        { chord: 'G', lyric: 'Eu ligo o rádio e finjo que está tudo bem!' },
      ],
    },
  },
  {
    id: 'aula-6-ritmo-guarania',
    order: 6,
    module: 'Módulo 2: Dominando os Ritmos',
    title: 'A Alma da Guarania: O Ritmo Clássico Sertanejo em 3/4 e 6/8',
    summary: 'Domine a levada pantaneira e caipira de "Chalana", "Boate Azul" e clássicos do cancioneiro nacional.',
    durationMinutes: 30,
    level: 'Básico 2',
    sections: [
      {
        title: '1. O que é a Guarania?',
        content: `Criada pelo maestro José Asunción Flores no Paraguai e adotada pelo coração do Brasil no Centro-Oeste e interior paulista/mineiro, a Guarania é um ritmo ternário (3/4) de andamento lento a moderado, marcado por um lirismo profundo e um balanço fluido que lembra as águas dos rios pantaneiros.`,
      },
      {
        title: '2. O Movimento da Mão Direita na Guarania',
        content: `A levada tradicional de violão na Guarania sertaneja é feita em 3 movimentos principais:\n\n1. **Tempo 1 (Baixo marcado)**: Polegar (P) ataca o bordão com firmeza para baixo.\n2. **Tempo 2 (Puxada melódica)**: Os dedos Indicador (I), Médio (M) e Anelar (A) puxam as cordas 3, 2 e 1 juntas para cima.\n3. **Tempo 3 (Descida e corte)**: Os dedos descem suavemente raspando as cordas e a mão faz um corte rítmico aveludado.`,
        highlightBox: {
          type: 'dica',
          title: 'Balanço da Guarania',
          text: 'Pense no ritmo como o embalo de uma rede: "DUM - tá-tá - DUM - tá-tá". O bordão no tempo 1 sustenta o peso, enquanto a puxada dá a elegância.',
        },
      },
    ],
    targetChords: ['d', 'a7', 'g'],
    targetRhythmId: 'guarania-sertaneja',
    practiceTasks: [
      'Praticar o movimento de puxada simultânea dos dedos I, M, A nas 3 primeiras cordas.',
      'Tocar a levada de Guarania na progressão D - A7 - G - D a 70 BPM.',
      'Acompanhar a canção "Chalana" usando a Guarania da aba Ritmos.',
    ],
    featuredSong: {
      title: 'No Dia em que Eu Saí de Casa',
      artist: 'Zezé Di Camargo & Luciano',
      rhythmId: 'guarania-sertaneja',
      chords: ['D', 'A7', 'G'],
      lyricsAndChords: [
        { chord: 'D', lyric: 'No dia em que eu saí de casa' },
        { chord: 'A7', lyric: 'Minha mãe me disse: filho, vem cá' },
        { chord: 'G', lyric: 'Passou a mão em meus cabelos' },
        { chord: 'A7', lyric: 'Olhou em meus olhos' },
        { chord: 'D', lyric: 'Começou falar...' },
      ],
    },
  },
  {
    id: 'aula-7-pestana-sem-dor',
    order: 7,
    module: 'Módulo 3: Avançando na Prática',
    title: 'O Segredo da Pestana sem Dor: Fá Maior (F) e Si Menor (Bm)',
    summary: 'Aprenda a biomecânica correta do dedo indicador para fazer pestanas sem cansar a mão e sem chiar.',
    durationMinutes: 25,
    level: 'Intermediário',
    sections: [
      {
        title: '1. O Mito da "Força Bruta"',
        content: `O erro número 1 de 99% dos iniciantes é tentar apertar a pestana com força excessiva do polegar contra a palma. Isso causa dor no músculo da mão e lesões.\n\nA pestana NÃO funciona por força de pinça! Ela funciona por **peso do braço** e alinhamento anatômico.`,
      },
      {
        title: '2. Os 3 Segredos da Pestana Perfeita',
        content: `1. **Gire o Dedo 1 Levemente de Lado**: A lateral do dedo indicador (lado do polegar) é óssea e dura, enquanto a parte da frente é macia e fofa. Ao girar uns 15° de lado, a parte óssea prensa as cordas contra o traste com metade do esforço.\n2. **Cole o Dedo Rente ao Traste de Metal**: Quanto mais colado no ferrinho da casa, menos pressão é necessária.\n3. **Puxe o Braço para Trás Suavemente**: Use a musculatura das costas e do ombro para apoiar o violão contra o corpo, em vez de apertar apenas com os dedos.`,
        highlightBox: {
          type: 'dica',
          title: 'Comece na 5ª Casa!',
          text: 'A 1ª casa (Fá) é a mais pesada do violão. Para treinar, comece montando a mesma pestana na 5ª casa (Lá Maior), onde a tensão é bem mais macia, e vá descendo casa por casa.',
        },
      },
    ],
    targetChords: ['f', 'bm'],
    practiceTasks: [
      'Girar o dedo indicador 15° para usar a lateral óssea sobre a escala.',
      'Montar o Fá Maior (F) na 1ª casa e conferir o som límpido das cordas 1 e 2.',
      'Praticar a transição suave entre Dó (C) e Fá (F) 10 vezes.',
    ],
  },
  {
    id: 'aula-8-repertorio-iniciante',
    order: 8,
    module: 'Módulo 3: Avançando na Prática',
    title: 'Repertório Completo para Tocar na Roda de Amigos',
    summary: 'Como juntar acordes, ritmo e voz para tocar canções completas do começo ao fim sem errar.',
    durationMinutes: 30,
    level: 'Intermediário',
    sections: [
      {
        title: '1. A Regra de Ouro da Roda de Violão',
        content: `Em uma apresentação ou roda com amigos, se você errar uma nota mas mantiver o ritmo no tempo certo, ninguém percebe! Mas se você parar a batida para procurar onde põe o dedo, a música morre.\n\nPortanto: **a mão direita (ritmo) NUNCA PARA.** Se atrasar para colocar o acorde novo, deixe a mão direita continuar batendo no tempo!`,
      },
      {
        title: '2. Como Cantar e Tocar ao Mesmo Tempo',
        content: `1. Primeiro domine a batida até que ela fique no piloto automático (você consiga conversar ou olhar para o lado enquanto bate).\n2. Fale a letra no ritmo da música sem cantar as notas.\n3. Cante as primeiras palavras devagar sincronizando com a primeira batida para baixo do acorde.`,
      },
    ],
    targetChords: ['c', 'g', 'am', 'f', 'd', 'a7'],
    targetRhythmId: 'pop-rock-universal',
    practiceTasks: [
      'Tocar uma música inteira sem interromper o andamento da mão direita.',
      'Cantar o refrão de uma música praticada acompanhando a cifra.',
      'Completar todas as 8 aulas do aplicativo no modo offline!',
    ],
  },
];
