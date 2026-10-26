export interface GuitarDailyTip {
  id: string;
  category: 'Postura' | 'Mão Direita & Ritmo' | 'Troca de Acordes' | 'Pestana' | 'Técnica & Som' | 'Iniciante';
  title: string;
  technique: string;
  proTip: string;
  quickAction?: {
    type: 'chord' | 'rhythm';
    targetId: string;
    label: string;
  };
}

export const GUITAR_DAILY_TIPS: GuitarDailyTip[] = [
  {
    id: 'tip-polegar-braco',
    category: 'Postura',
    title: 'O Segredo do Polegar de Apoio',
    technique: 'Nunca "abrace" o braço do violão como se fosse um cabo de vassoura. O polegar da mão esquerda deve ficar no meio das costas do braço, em linha reta com o dedo médio. Isso libera espaço para seus dedos arquearem em forma de pinça sobre as cordas.',
    proTip: 'Se sua palma estiver encostando por baixo da escala, os acordes vão chiar!',
    quickAction: {
      type: 'chord',
      targetId: 'c',
      label: 'Ver Dó (C) no Braço',
    },
  },
  {
    id: 'tip-pestana-lateral',
    category: 'Pestana',
    title: 'Pestana sem Dor: Use o Osso Lateral',
    technique: 'Em vez de usar a parte fofa da frente do indicador, incline o dedo indicador cerca de 15 graus na direção da mão do violão (lado do polegar). A lateral do dedo é muito mais rígida e óssea, exigindo 50% menos força para prender todas as cordas.',
    proTip: 'Cole o indicador bem rente ao traste de metal para o som sair limpo sem forçar a mão.',
    quickAction: {
      type: 'chord',
      targetId: 'f',
      label: 'Ver Fá (F) com Pestana',
    },
  },
  {
    id: 'tip-pendulo-pop',
    category: 'Mão Direita & Ritmo',
    title: 'O Efeito Pêndulo no Ritmo Pop (↓ ↓↑ ↑↓↑)',
    technique: 'O braço da sua mão direita deve funcionar como um relógio de pêndulo constante. No tempo 3, sua mão DESCE NO AR sem tocar as cordas. Esse "movimento fantasma" garante que você suba no contratempo exato sem perder o ritmo.',
    proTip: 'Ritmo perfeito não é bater rápido, é manter a mão balançando no tempo certo.',
    quickAction: {
      type: 'rhythm',
      targetId: 'pop-rock-universal',
      label: 'Praticar Batida Pop',
    },
  },
  {
    id: 'tip-bordao-sertanejo',
    category: 'Mão Direita & Ritmo',
    title: 'O Bordão que Dá o Peso Sertanejo',
    technique: 'No sertanejo universitário e modas de viola, a primeira batida é sempre isolada no polegar (o bordão mais grave). Para Sol (G) e Mi (E), toque a 6ª corda; para Dó (C) e Lá (A), a 5ª corda; para Ré (D), a 4ª corda.',
    proTip: 'Bater em todas as cordas de uma vez tira o suingue característico sertanejo!',
    quickAction: {
      type: 'rhythm',
      targetId: 'sertanejo-universitario',
      label: 'Testar Ritmo Sertanejo',
    },
  },
  {
    id: 'tip-balanco-guarania',
    category: 'Mão Direita & Ritmo',
    title: 'A Alma da Guarania: Puxada em Bloco',
    technique: 'Na guarania, após o ataque firme do polegar no tempo 1, junte as pontas dos dedos Indicador (I), Médio (M) e Anelar (A) nas três primeiras cordas e puxe-as simultaneamente para cima no tempo 2, antes do corte.',
    proTip: 'Pense no movimento de vai e vem da água de uma canoa no pantanal.',
    quickAction: {
      type: 'rhythm',
      targetId: 'guarania-sertaneja',
      label: 'Ouvir Batida de Guarania',
    },
  },
  {
    id: 'tip-evite-trastejar',
    category: 'Técnica & Som',
    title: 'Como Eliminar o Zumbido (Trastejamento)',
    technique: 'Aperte a corda sempre a 2 milímetros de distância do ferrinho do traste (lado direito da casa para destros). Apertar no meio da casa ou longe do traste exige o dobro de pressão e faz a corda vibrar contra o metal.',
    proTip: 'Não precisa de força bruta, precisa de posicionamento inteligente!',
    quickAction: {
      type: 'chord',
      targetId: 'em',
      label: 'Treinar com Mi Menor (Em)',
    },
  },
  {
    id: 'tip-dedo-guia',
    category: 'Troca de Acordes',
    title: 'Técnica do Dedo Guia na Troca de Acordes',
    technique: 'Ao mudar de um acorde para outro, identifique se algum dedo pode ficar no lugar ou deslizar pela mesma corda. Por exemplo: na troca de Dó (C) para Lá Menor (Am), os dedos 1 e 2 ficam exatamente onde estão, você só move o dedo 3!',
    proTip: 'Economizar movimento é o caminho mais rápido para tocar fluidamente.',
    quickAction: {
      type: 'chord',
      targetId: 'am',
      label: 'Ver Lá Menor (Am)',
    },
  },
  {
    id: 'tip-slap-palma',
    category: 'Mão Direita & Ritmo',
    title: 'O Golpe Abafado (Slap na Palma)',
    technique: 'Para conseguir aquele estalo seco e percussivo no sertanejo e no pop, pouse a parte gordinha da palma da mão sobre as cordas rente ao cavalete no exato milissegundo em que os dedos tocam.',
    proTip: 'O som deve soar como uma caixa de bateria acústica, sem ressonância!',
    quickAction: {
      type: 'rhythm',
      targetId: 'sertanejo-universitario',
      label: 'Praticar o Slap Sertanejo',
    },
  },
  {
    id: 'tip-calos-iniciante',
    category: 'Iniciante',
    title: 'Dor nos Dedos nos Primeiros Dias',
    technique: 'É normal sentir ardência na ponta dos dedos nos primeiros 7 a 10 dias de prática. Para criar calos protetores sem machucar a pele, pratique de 15 a 25 minutos todos os dias em vez de 3 horas em um único dia da semana.',
    proTip: 'A consistência diária fortalece os dedos sem causar bolhas.',
  },
  {
    id: 'tip-regra-da-mao-direita',
    category: 'Mão Direita & Ritmo',
    title: 'A Mão Direita Nunca Para!',
    technique: 'Se você estiver tocando para alguém ou cantando junto e errar a posição de um acorde, NÃO pare o ritmo da mão direita. Continue batendo no tempo e ajeite os dedos da mão esquerda. No ritmo, o cérebro do ouvinte perdoa a nota, mas percebe a pausa.',
    proTip: 'O tempo é soberano na música popular!',
    quickAction: {
      type: 'rhythm',
      targetId: 'pop-rock-universal',
      label: 'Treinar com Metrônomo',
    },
  },
  {
    id: 'tip-estudo-lento',
    category: 'Técnica & Som',
    title: 'Toque Devagar para Tocar Rápido',
    technique: 'A velocidade é apenas um subproduto da precisão motora. Se você tentar tocar uma batida rápida e tropeçar, seu cérebro memoriza o erro. Reduza o metrônomo para 60 BPM e treine até ficar perfeito antes de aumentar.',
    proTip: 'Quem toca limpo devagar, toca limpo em qualquer velocidade.',
    quickAction: {
      type: 'rhythm',
      targetId: 'valsa-sertaneja',
      label: 'Experimentar Valsa a 60 BPM',
    },
  },
  {
    id: 'tip-puxada-xote',
    category: 'Mão Direita & Ritmo',
    title: 'O Toque Cortado do Xote e Forró',
    technique: 'No xote, o balanço vem do contraste entre o som grave do polegar e o corte rápido das cordas agudas. Assim que os dedos puxarem as cordas 1, 2 e 3, alivie suavemente a pressão na mão esquerda para silenciar as notas imediatamente.',
    proTip: 'O "staccato" dá o suingue do forró pé de serra no violão!',
    quickAction: {
      type: 'rhythm',
      targetId: 'xote-violao',
      label: 'Ver Batida de Xote',
    },
  },
];
