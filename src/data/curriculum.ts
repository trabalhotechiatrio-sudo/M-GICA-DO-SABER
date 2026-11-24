export type GradeId = 1 | 2 | 3 | 4 | 5;
export type SubjectId = 'portugues' | 'matematica';
export type MiniGameId =
  | 'pt-quiz'
  | 'pt-builder'
  | 'pt-truefalse'
  | 'pt-match'
  | 'mat-quiz'
  | 'mat-match'
  | 'mat-missing'
  | 'mat-compare';

export interface QuizQuestion {
  id: string;
  prompt: string;
  visualEmoji?: string;
  visualCount?: { emoji: string; count: number };
  visualFraction?: { numerator: number; denominator: number };
  readingPassage?: string;
  options: string[];
  correctIndex: number;
  hint: string;
}

export interface WordBuilderChallenge {
  id: string;
  instruction: string;
  clueEmoji: string;
  mode: 'missing' | 'syllables';
  prefix?: string;
  suffix?: string;
  answer: string;
  targetSyllables?: string[];
  tiles: string[];
  hint: string;
}

export interface TrueFalseChallenge {
  id: string;
  statement: string;
  emoji: string;
  isTrue: boolean;
  explanation: string;
}

export interface MatchPair {
  id: string;
  left: string;
  right: string;
}

export interface MathMissingChallenge {
  id: string;
  instruction: string;
  emoji: string;
  parts: string[]; // Uses '?' for the missing slot
  answer: string;
  options: string[];
  hint: string;
}

export interface MathCompareChallenge {
  id: string;
  leftLabel: string;
  rightLabel: string;
  emoji: string;
  correctSymbol: '>' | '<' | '=';
  hint: string;
}

export interface GradeInfo {
  id: GradeId;
  title: string;
  subtitle: string;
  mascotName: string;
  cardBg: string;
  cardBorder: string;
  accentBg: string;
  accentText: string;
  ptTopics: string[];
  matTopics: string[];
  ptQuiz: QuizQuestion[]; // 10 perguntas
  ptBuilder: WordBuilderChallenge[]; // 10 desafios
  ptTrueFalse: TrueFalseChallenge[]; // 10 desafios
  ptMatchRounds: MatchPair[][]; // 2 rodadas de 5 pares = 10 desafios
  matQuiz: QuizQuestion[]; // 10 perguntas
  matMatchRounds: MatchPair[][]; // 2 rodadas de 5 pares = 10 desafios
  matMissing: MathMissingChallenge[]; // 10 desafios
  matCompare: MathCompareChallenge[]; // 10 desafios
}

export interface KawaiiReward {
  id: string;
  name: string;
  description: string;
  requiredStars: number;
  color: string;
  iconType: 'bow' | 'cupcake' | 'crown' | 'rainbow' | 'medal' | 'cloud';
}

export const KAWAII_REWARDS: KawaiiReward[] = [
  {
    id: 'lacinho-morango',
    name: 'Lacinho Morango',
    description: 'Ganhe suas primeiras 5 estrelinhas jogando qualquer desafio.',
    requiredStars: 5,
    color: '#FFD6E0',
    iconType: 'bow',
  },
  {
    id: 'nuvem-algodao',
    name: 'Nuvem Algodão-Doce',
    description: 'Alcance 15 estrelinhas acumuladas nas matérias.',
    requiredStars: 15,
    color: '#C2E7FF',
    iconType: 'cloud',
  },
  {
    id: 'cupcake-manteiga',
    name: 'Cupcake Dourado',
    description: 'Conquiste 30 estrelinhas com muita dedicação.',
    requiredStars: 30,
    color: '#FFF4BD',
    iconType: 'cupcake',
  },
  {
    id: 'coroa-menta',
    name: 'Coroa de Menta',
    description: 'Brilhe com 50 estrelinhas na Mágica do Saber.',
    requiredStars: 50,
    color: '#D4F8E8',
    iconType: 'crown',
  },
  {
    id: 'estrela-lilas',
    name: 'Estrela Arco-Íris',
    description: 'Colecione 75 estrelinhas explorando as séries.',
    requiredStars: 75,
    color: '#E5D4FF',
    iconType: 'rainbow',
  },
  {
    id: 'medalha-doce',
    name: 'Medalha Mágica do Saber',
    description: 'Grande mestre com 100 estrelinhas conquistadas!',
    requiredStars: 100,
    color: '#FFD6E0',
    iconType: 'medal',
  },
];

export const GRADES: GradeInfo[] = [
  /* =========================================================
     1º ANO
  ========================================================= */
  {
    id: 1,
    title: '1º Ano',
    subtitle: 'Alfabetização e Primeiros Números',
    mascotName: 'Mimi Morango',
    cardBg: '#FFA6C9',
    cardBorder: '#E84D8A',
    accentBg: '#FFF0F6',
    accentText: '#8A1143',
    ptTopics: ['Vogais e Consoantes', 'Sons Iniciais', 'Rimas Divertidas'],
    matTopics: ['Contagem até 20', 'Soma Simples', 'Maior e Menor'],
    ptQuiz: [
      { id: '1pt-q1', prompt: 'Qual vogal começa a palavra ABELHA?', visualEmoji: '🐝', options: ['A', 'E', 'I', 'O'], correctIndex: 0, hint: 'Fale bem devagar: A-be-lha!' },
      { id: '1pt-q2', prompt: 'Qual palavra rima com GATO?', visualEmoji: '🐱', options: ['BOLA', 'PATO', 'FLOR', 'SOL'], correctIndex: 1, hint: 'Procure a palavra que termina com "-ATO".' },
      { id: '1pt-q3', prompt: 'Com qual letra começa a palavra BOLO?', visualEmoji: '🍰', options: ['C', 'D', 'B', 'M'], correctIndex: 2, hint: 'Junte os lábios para fazer o som de BÔ-lo.' },
      { id: '1pt-q4', prompt: 'Quantas sílabas tem a palavra MA-ÇÃ?', visualEmoji: '🍎', options: ['1 sílaba', '2 sílabas', '3 sílabas', '4 sílabas'], correctIndex: 1, hint: 'Bata palmas: MA (palma) - ÇÃ (palma)!' },
      { id: '1pt-q5', prompt: 'Qual dessas frutas começa com a letra U?', visualEmoji: '🍇', options: ['MORANGO', 'BANANA', 'UVA', 'PERA'], correctIndex: 2, hint: 'Tem cachos roxinhos e começa com U!' },
      { id: '1pt-q6', prompt: 'Qual palavra começa com a letra E?', visualEmoji: '🐘', options: ['ELEFANTE', 'SAPO', 'URSO', 'TIGRE'], correctIndex: 0, hint: 'É um animal bem grandão com tromba!' },
      { id: '1pt-q7', prompt: 'Qual palavra rima com MÃO?', visualEmoji: '🍞', options: ['PÉ', 'PÃO', 'DEDO', 'CASA'], correctIndex: 1, hint: 'Termina com o mesmo som "-ÃO".' },
      { id: '1pt-q8', prompt: 'Qual é a primeira sílaba da palavra CA-SA?', visualEmoji: '🏠', options: ['SA', 'CA', 'CO', 'LA'], correctIndex: 1, hint: 'Diga bem forte o primeiro pedacinho: CA!' },
      { id: '1pt-q9', prompt: 'Qual animal começa com a letra L?', visualEmoji: '🦁', options: ['MACACO', 'LEÃO', 'PEIXE', 'VACA'], correctIndex: 1, hint: 'Tem uma juba dourada e faz rugido!' },
      { id: '1pt-q10', prompt: 'Quantas vogais existem na palavra LUA?', visualEmoji: '🌙', options: ['1 vogal', '2 vogais', '3 vogais', '0 vogais'], correctIndex: 1, hint: 'Olhe as letras: L (consoante), U (vogal), A (vogal).' },
    ],
    ptBuilder: [
      { id: '1pt-b1', instruction: 'Complete a letra que falta na palavra:', clueEmoji: '⚽', mode: 'missing', prefix: 'B', suffix: 'LA', answer: 'O', tiles: ['O', 'A', 'U', 'E'], hint: 'É redonda e rola: BO-LA!' },
      { id: '1pt-b2', instruction: 'Complete a vogal que falta:', clueEmoji: '🏠', mode: 'missing', prefix: 'C', suffix: 'SA', answer: 'A', tiles: ['I', 'A', 'O', 'U'], hint: 'Onde a gente mora: CA-SA!' },
      { id: '1pt-b3', instruction: 'Complete a letra inicial:', clueEmoji: '🦆', mode: 'missing', prefix: '', suffix: 'ATO', answer: 'P', tiles: ['M', 'P', 'L', 'V'], hint: 'Faz quá-quá: PA-TO!' },
      { id: '1pt-b4', instruction: 'Complete a vogal do meio:', clueEmoji: '☀️', mode: 'missing', prefix: 'S', suffix: 'L', answer: 'O', tiles: ['E', 'I', 'O', 'A'], hint: 'Brilha no céu: SOL!' },
      { id: '1pt-b5', instruction: 'Junte as sílabas na ordem certa:', clueEmoji: '🍼', mode: 'syllables', answer: 'BEBÊ', targetSyllables: ['BE', 'BÊ'], tiles: ['BÊ', 'BE', 'CA', 'DO'], hint: 'Primeiro BE, depois BÊ!' },
      { id: '1pt-b6', instruction: 'Complete a vogal que falta:', clueEmoji: '🌙', mode: 'missing', prefix: 'L', suffix: 'A', answer: 'U', tiles: ['A', 'E', 'U', 'O'], hint: 'Aparece de noite no céu: LU-A!' },
      { id: '1pt-b7', instruction: 'Complete a letra inicial:', clueEmoji: '🐸', mode: 'missing', prefix: '', suffix: 'APO', answer: 'S', tiles: ['S', 'T', 'B', 'D'], hint: 'Pula na lagoa: SA-PO!' },
      { id: '1pt-b8', instruction: 'Junte as sílabas na ordem certa:', clueEmoji: '🎈', mode: 'syllables', answer: 'BALÃO', targetSyllables: ['BA', 'LÃO'], tiles: ['LÃO', 'BA', 'PI', 'TU'], hint: 'Sobe no céu da festa: BA-LÃO!' },
      { id: '1pt-b9', instruction: 'Complete a vogal final:', clueEmoji: '🐱', mode: 'missing', prefix: 'GAT', suffix: '', answer: 'O', tiles: ['A', 'E', 'I', 'O'], hint: 'Faz miau: GA-TO!' },
      { id: '1pt-b10', instruction: 'Junte as sílabas da fruta:', clueEmoji: '🍐', mode: 'syllables', answer: 'PERA', targetSyllables: ['PE', 'RA'], tiles: ['RA', 'PE', 'MA', 'LO'], hint: 'Fruta verdinha e doce: PE-RA!' },
    ],
    ptTrueFalse: [
      { id: '1pt-tf1', statement: 'A palavra OVO começa com a vogal O.', emoji: '🥚', isTrue: true, explanation: 'Isso mesmo! O-VO começa com a letra O.' },
      { id: '1pt-tf2', statement: 'A palavra BOLA tem apenas 1 sílaba.', emoji: '⚽', isTrue: false, explanation: 'BO-LA tem 2 sílabas (2 pedacinhos).' },
      { id: '1pt-tf3', statement: 'PATO rima com GATO.', emoji: '🦆', isTrue: true, explanation: 'Sim! As duas terminam com -ATO.' },
      { id: '1pt-tf4', statement: 'A letra M é uma vogal.', emoji: '🔤', isTrue: false, explanation: 'As vogais são apenas A, E, I, O, U. M é consoante!' },
      { id: '1pt-tf5', statement: 'A palavra UVA começa com a letra U.', emoji: '🍇', isTrue: true, explanation: 'Certinho! U-VA começa com U.' },
      { id: '1pt-tf6', statement: 'SOL e LUA rimam entre si.', emoji: '☀️', isTrue: false, explanation: 'SOL termina com -OL e LUA termina com -UA.' },
      { id: '1pt-tf7', statement: 'A palavra DADO começa com a letra D.', emoji: '🎲', isTrue: true, explanation: 'Muito bem! DA-DO começa com D.' },
      { id: '1pt-tf8', statement: 'A palavra BANANA tem 3 sílabas: BA-NA-NA.', emoji: '🍌', isTrue: true, explanation: 'Sim! São 3 pedacinhos bem fáceis de contar.' },
      { id: '1pt-tf9', statement: 'A palavra PEIXE começa com a letra F.', emoji: '🐟', isTrue: false, explanation: 'PEIXE começa com a letra P!' },
      { id: '1pt-tf10', statement: 'A letra A está presente na palavra CASA.', emoji: '🏠', isTrue: true, explanation: 'Sim! A palavra C-A-S-A tem duas letras A.' },
    ],
    ptMatchRounds: [
      [
        { id: '1pm-1', left: '🐝 Abelha', right: 'Começa com A' },
        { id: '1pm-2', left: '🐘 Elefante', right: 'Começa com E' },
        { id: '1pm-3', left: '🏝️ Ilha', right: 'Começa com I' },
        { id: '1pm-4', left: '🐑 Ovelha', right: 'Começa com O' },
        { id: '1pm-5', left: '🍇 Uva', right: 'Começa com U' },
      ],
      [
        { id: '1pm-6', left: '🐱 Gato', right: 'Rima com Pato' },
        { id: '1pm-7', left: '🍞 Pão', right: 'Rima com Mão' },
        { id: '1pm-8', left: '⚽ Bola', right: 'Rima com Cola' },
        { id: '1pm-9', left: '🌻 Flor', right: 'Rima com Amor' },
        { id: '1pm-10', left: '💍 Anel', right: 'Rima com Mel' },
      ],
    ],
    matQuiz: [
      { id: '1mat-q1', prompt: 'Quantos morangos docinhos temos aqui?', visualCount: { emoji: '🍓', count: 5 }, options: ['3', '4', '5', '6'], correctIndex: 2, hint: 'Conte um por um apontando com o dedinho!' },
      { id: '1mat-q2', prompt: 'Se você tem 2 balas e ganha mais 3, com quantas fica?', visualEmoji: '🍬', options: ['4', '5', '6', '7'], correctIndex: 1, hint: 'Levante 2 dedinhos e depois mais 3 dedinhos!' },
      { id: '1mat-q3', prompt: 'Qual número vem logo depois do 9?', visualEmoji: '🎈', options: ['8', '10', '11', '7'], correctIndex: 1, hint: 'Conte: 7, 8, 9 e...' },
      { id: '1mat-q4', prompt: 'Quantos cupcakes há na bandeja?', visualCount: { emoji: '🧁', count: 7 }, options: ['6', '7', '8', '9'], correctIndex: 1, hint: 'Conte com calma cada cupcake!' },
      { id: '1mat-q5', prompt: 'Qual forma geométrica tem 3 pontinhas (lados)?', visualEmoji: '🔺', options: ['Círculo', 'Quadrado', 'Triângulo', 'Retângulo'], correctIndex: 2, hint: 'Tri lembra três! Parece uma fatia de pizza.' },
      { id: '1mat-q6', prompt: 'Quanto é 4 + 4?', visualEmoji: '🍒', options: ['6', '7', '8', '9'], correctIndex: 2, hint: '4 dedinhos em uma mão + 4 dedinhos na outra.' },
      { id: '1mat-q7', prompt: 'Qual número vem logo ANTES do 6?', visualEmoji: '🐣', options: ['4', '5', '7', '8'], correctIndex: 1, hint: 'Conte: 3, 4, ..., 6!' },
      { id: '1mat-q8', prompt: 'Você tinha 5 biscoitos e comeu 2. Quantos sobraram?', visualEmoji: '🍪', options: ['2', '3', '4', '5'], correctIndex: 1, hint: 'Mostre 5 dedos e abaixe 2!' },
      { id: '1mat-q9', prompt: 'Quantas estrelinhas aparecem aqui?', visualCount: { emoji: '⭐', count: 9 }, options: ['8', '9', '10', '7'], correctIndex: 1, hint: 'Conte devagarinho sem pular nenhuma!' },
      { id: '1mat-q10', prompt: 'Qual forma geométrica é bem redonda como uma bola?', visualEmoji: '🟠', options: ['Quadrado', 'Triângulo', 'Círculo', 'Estrela'], correctIndex: 2, hint: 'Não tem nenhuma ponta ou quina!' },
    ],
    matMatchRounds: [
      [
        { id: '1m-1', left: '1 + 1', right: '2' },
        { id: '1m-2', left: '2 + 2', right: '4' },
        { id: '1m-3', left: '3 + 2', right: '5' },
        { id: '1m-4', left: '5 + 1', right: '6' },
        { id: '1m-5', left: '4 + 3', right: '7' },
      ],
      [
        { id: '1m-6', left: '4 - 1', right: '3' },
        { id: '1m-7', left: '5 + 5', right: '10' },
        { id: '1m-8', left: '6 + 2', right: '8' },
        { id: '1m-9', left: '10 - 1', right: '9' },
        { id: '1m-10', left: '7 - 6', right: '1' },
      ],
    ],
    matMissing: [
      { id: '1mm-1', instruction: 'Complete a soma:', emoji: '🍓', parts: ['2', '+', '?', '=', '4'], answer: '2', options: ['1', '2', '3', '4'], hint: '2 mais quanto dá 4?' },
      { id: '1mm-2', instruction: 'Complete a sequência:', emoji: '🐥', parts: ['1,', '2,', '?', ',', '4'], answer: '3', options: ['3', '5', '0', '6'], hint: 'Qual número fica entre 2 e 4?' },
      { id: '1mm-3', instruction: 'Complete a soma:', emoji: '🍬', parts: ['3', '+', '?', '=', '5'], answer: '2', options: ['1', '2', '3', '4'], hint: 'De 3 até 5 faltam quantos?' },
      { id: '1mm-4', instruction: 'Complete a subtração:', emoji: '🍪', parts: ['5', '-', '?', '=', '3'], answer: '2', options: ['1', '2', '3', '4'], hint: 'Tinha 5, ficou com 3. Quantos tirou?' },
      { id: '1mm-5', instruction: 'Complete a sequência:', emoji: '🎈', parts: ['5,', '6,', '7,', '?'], answer: '8', options: ['7', '8', '9', '10'], hint: 'Vem logo depois do 7!' },
      { id: '1mm-6', instruction: 'Complete a soma:', emoji: '🌸', parts: ['?', '+', '4', '=', '6'], answer: '2', options: ['1', '2', '3', '4'], hint: '4 + 2 = 6!' },
      { id: '1mm-7', instruction: 'Complete a soma para dar 10:', emoji: '⭐', parts: ['5', '+', '?', '=', '10'], answer: '5', options: ['4', '5', '6', '7'], hint: 'Uma mão (5) mais a outra mão!' },
      { id: '1mm-8', instruction: 'Complete a sequência:', emoji: '🍎', parts: ['8,', '9,', '?'], answer: '10', options: ['7', '10', '11', '12'], hint: 'Depois do 9 vem a dezena...' },
      { id: '1mm-9', instruction: 'Complete a subtração:', emoji: '🧁', parts: ['6', '-', '1', '=', '?'], answer: '5', options: ['4', '5', '6', '7'], hint: 'Volte 1 número antes do 6!' },
      { id: '1mm-10', instruction: 'Complete a soma:', emoji: '🎀', parts: ['4', '+', '?', '=', '9'], answer: '5', options: ['3', '4', '5', '6'], hint: 'Conte de 4 até chegar ao 9!' },
    ],
    matCompare: [
      { id: '1mc-1', leftLabel: '8', rightLabel: '5', emoji: '🍓', correctSymbol: '>', hint: '8 é maior que 5!' },
      { id: '1mc-2', leftLabel: '3', rightLabel: '7', emoji: '🍬', correctSymbol: '<', hint: '3 é menor que 7!' },
      { id: '1mc-3', leftLabel: '4', rightLabel: '4', emoji: '⭐', correctSymbol: '=', hint: 'Os dois lados têm a mesma quantidade!' },
      { id: '1mc-4', leftLabel: '2 + 3', rightLabel: '5', emoji: '🧁', correctSymbol: '=', hint: '2 + 3 dá 5! Então são iguais.' },
      { id: '1mc-5', leftLabel: '10', rightLabel: '6', emoji: '🎈', correctSymbol: '>', hint: '10 tem mais que 6!' },
      { id: '1mc-6', leftLabel: '1 + 2', rightLabel: '6', emoji: '🍪', correctSymbol: '<', hint: '1 + 2 = 3, que é menor que 6.' },
      { id: '1mc-7', leftLabel: '9', rightLabel: '4', emoji: '🌸', correctSymbol: '>', hint: '9 é maior que 4!' },
      { id: '1mc-8', leftLabel: '5 - 1', rightLabel: '4', emoji: '🎀', correctSymbol: '=', hint: '5 - 1 é igual a 4!' },
      { id: '1mc-9', leftLabel: '2', rightLabel: '8', emoji: '🍒', correctSymbol: '<', hint: '2 é menor que 8!' },
      { id: '1mc-10', leftLabel: '7 + 1', rightLabel: '6', emoji: '🍭', correctSymbol: '>', hint: '7 + 1 = 8, que é maior que 6!' },
    ],
  },

  /* =========================================================
     2º ANO
  ========================================================= */
  {
    id: 2,
    title: '2º Ano',
    subtitle: 'Sílabas, Antônimos e Dezenas',
    mascotName: 'Lulu Nuvem',
    cardBg: '#8AD4FF',
    cardBorder: '#1F90E0',
    accentBg: '#EAF6FF',
    accentText: '#0D4A7A',
    ptTopics: ['Separação Silábica', 'Singular e Plural', 'Antônimos'],
    matTopics: ['Adição e Subtração', 'Dobro e Metade', 'Dezenas'],
    ptQuiz: [
      { id: '2pt-q1', prompt: 'Qual é o plural da palavra FLOR?', visualEmoji: '🌸', options: ['FLORES', 'FLORS', 'FLORZES', 'FLORA'], correctIndex: 0, hint: 'Palavras terminadas em R ganham -ES no final.' },
      { id: '2pt-q2', prompt: 'Qual é o antônimo (contrário) de QUENTE?', visualEmoji: '🍦', options: ['MORNO', 'FRIO', 'DOCE', 'GRANDE'], correctIndex: 1, hint: 'O sorvete não é quente, ele é bem...' },
      { id: '2pt-q3', prompt: 'Qual palavra está escrita corretamente com NH?', visualEmoji: '🐥', options: ['PASSARINO', 'PASSARINHO', 'PASARINHO', 'PASSARINIO'], correctIndex: 1, hint: 'Termina com "-inho" de pequenininho!' },
      { id: '2pt-q4', prompt: 'Quantas sílabas tem a palavra BOR-BO-LE-TA?', visualEmoji: '🦋', options: ['2 sílabas', '3 sílabas', '4 sílabas', '5 sílabas'], correctIndex: 2, hint: 'Conte: BOR - BO - LE - TA.' },
      { id: '2pt-q5', prompt: 'Qual palavra está no diminutivo?', visualEmoji: '🎀', options: ['LAÇO', 'LAÇÃO', 'LACINHO', 'LAÇOS'], correctIndex: 2, hint: 'Indica algo bem pequenininho e fofo!' },
      { id: '2pt-q6', prompt: 'Qual é o antônimo (contrário) de GRANDE?', visualEmoji: '🐭', options: ['ENORME', 'ALTO', 'PEQUENO', 'LARGO'], correctIndex: 2, hint: 'O contrário de um elefante grande é um ratinho...' },
      { id: '2pt-q7', prompt: 'Qual é o plural de BALÃO?', visualEmoji: '🎈', options: ['BALÃOS', 'BALÕES', 'BALÃES', 'BALÃOZES'], correctIndex: 1, hint: 'Muitos balões no céu da festa!' },
      { id: '2pt-q8', prompt: 'Qual palavra está no aumentativo?', visualEmoji: '🐶', options: ['CACHORRINHO', 'CACHORRO', 'CACHORRÃO', 'CACHORROS'], correctIndex: 2, hint: 'Termina com -ÃO para mostrar tamanho grande!' },
      { id: '2pt-q9', prompt: 'Qual palavra tem o dígrafo LH?', visualEmoji: '🐰', options: ['COELHO', 'GALINHA', 'CHAVE', 'CARRO'], correctIndex: 0, hint: 'Olhe bem para as letras L e H juntas!' },
      { id: '2pt-q10', prompt: 'Qual é o sinônimo (mesmo sentido) de ALEGRE?', visualEmoji: '😊', options: ['TRISTE', 'FELIZ', 'BRAVO', 'CANSADO'], correctIndex: 1, hint: 'Quem está alegre também está muito...' },
    ],
    ptBuilder: [
      { id: '2pt-b1', instruction: 'Monte a palavra com as sílabas certas:', clueEmoji: '🦋', mode: 'syllables', answer: 'BORBOLETA', targetSyllables: ['BOR', 'BO', 'LE', 'TA'], tiles: ['LE', 'BOR', 'TA', 'BO'], hint: 'Começa com BOR e termina com TA!' },
      { id: '2pt-b2', instruction: 'Complete o dígrafo que falta:', clueEmoji: '🐰', mode: 'missing', prefix: 'COE', suffix: 'O', answer: 'LH', tiles: ['LH', 'NH', 'CH', 'RR'], hint: 'O som é de LHO: COE-LHO!' },
      { id: '2pt-b3', instruction: 'Monte o nome deste doce:', clueEmoji: '🍫', mode: 'syllables', answer: 'CHOCOLATE', targetSyllables: ['CHO', 'CO', 'LA', 'TE'], tiles: ['LA', 'CHO', 'TE', 'CO'], hint: 'Começa com CHO-CO...' },
      { id: '2pt-b4', instruction: 'Complete a letra que falta:', clueEmoji: '🍓', mode: 'missing', prefix: 'MO', suffix: 'ANGO', answer: 'R', tiles: ['R', 'L', 'S', 'N'], hint: 'Frutinha vermelha: MO-RAN-GO!' },
      { id: '2pt-b5', instruction: 'Ordene as sílabas:', clueEmoji: '🌈', mode: 'syllables', answer: 'COLORIDO', targetSyllables: ['CO', 'LO', 'RI', 'DO'], tiles: ['RI', 'CO', 'DO', 'LO'], hint: 'Como um arco-íris!' },
      { id: '2pt-b6', instruction: 'Complete com NH ou LH:', clueEmoji: '🐔', mode: 'missing', prefix: 'GALI', suffix: 'A', answer: 'NH', tiles: ['NH', 'LH', 'CH', 'SS'], hint: 'Faz có-có-ri-có: GA-LI-NHA!' },
      { id: '2pt-b7', instruction: 'Ordene as sílabas:', clueEmoji: '🍍', mode: 'syllables', answer: 'ABACAXI', targetSyllables: ['A', 'BA', 'CA', 'XI'], tiles: ['CA', 'A', 'XI', 'BA'], hint: 'Fruta com coroa: A-BA-CA-XI!' },
      { id: '2pt-b8', instruction: 'Complete o plural:', clueEmoji: '🌸', mode: 'missing', prefix: 'FLOR', suffix: '', answer: 'ES', tiles: ['S', 'ES', 'IS', 'ÃOS'], hint: 'O plural de flor é FLOR-ES!' },
      { id: '2pt-b9', instruction: 'Ordene as sílabas:', clueEmoji: '🐢', mode: 'syllables', answer: 'TARTARUGA', targetSyllables: ['TAR', 'TA', 'RU', 'GA'], tiles: ['RU', 'TAR', 'GA', 'TA'], hint: 'Anda devagarinho com seu casco!' },
      { id: '2pt-b10', instruction: 'Complete com CH ou X:', clueEmoji: '☔', mode: 'missing', prefix: '', suffix: 'UVA', answer: 'CH', tiles: ['CH', 'X', 'S', 'Z'], hint: 'Cai das nuvens: CHU-VA!' },
    ],
    ptTrueFalse: [
      { id: '2pt-tf1', statement: 'O contrário de CLARO é ESCURO.', emoji: '🌙', isTrue: true, explanation: 'Isso mesmo! Claro e escuro são antônimos.' },
      { id: '2pt-tf2', statement: 'O plural de PÃO é PÃOS.', emoji: '🥖', isTrue: false, explanation: 'O plural correto é PÃES!' },
      { id: '2pt-tf3', statement: 'A palavra COZINHA tem o dígrafo NH.', emoji: '🍳', isTrue: true, explanation: 'Sim! CO-ZI-NHA se escreve com NH.' },
      { id: '2pt-tf4', statement: 'CASINHA está no aumentativo.', emoji: '🏡', isTrue: false, explanation: 'CASINHA está no diminutivo (casa pequena).' },
      { id: '2pt-tf5', statement: 'A palavra SORVETE tem 3 sílabas.', emoji: '🍨', isTrue: true, explanation: 'Certo: SOR-VE-TE tem 3 sílabas.' },
      { id: '2pt-tf6', statement: 'BONITO e LINDO são sinônimos.', emoji: '✨', isTrue: true, explanation: 'Sim! As duas palavras têm sentidos parecidos.' },
      { id: '2pt-tf7', statement: 'A palavra MENINA está no masculino.', emoji: '👧', isTrue: false, explanation: 'MENINA está no feminino; o masculino é MENINO.' },
      { id: '2pt-tf8', statement: 'CHOCOLATE começa com a sílaba CHO.', emoji: '🍫', isTrue: true, explanation: 'Perfeito! CHO-CO-LA-TE.' },
      { id: '2pt-tf9', statement: 'O contrário de RÁPIDO é VELOZ.', emoji: '🐇', isTrue: false, explanation: 'Rápido e veloz são sinônimos! O contrário é LENTO.' },
      { id: '2pt-tf10', statement: 'Nomes de pessoas começam com letra maiúscula.', emoji: '📝', isTrue: true, explanation: 'Sempre! Ex: Maria, João, Clara.' },
    ],
    ptMatchRounds: [
      [
        { id: '2pm-1', left: 'Quente', right: 'Frio' },
        { id: '2pm-2', left: 'Grande', right: 'Pequeno' },
        { id: '2pm-3', left: 'Alegre', right: 'Triste' },
        { id: '2pm-4', left: 'Dia', right: 'Noite' },
        { id: '2pm-5', left: 'Alto', right: 'Baixo' },
      ],
      [
        { id: '2pm-6', left: '1 Flor', right: 'Flores' },
        { id: '2pm-7', left: '1 Balão', right: 'Balões' },
        { id: '2pm-8', left: '1 Pão', right: 'Pães' },
        { id: '2pm-9', left: '1 Gato', right: 'Gatos' },
        { id: '2pm-10', left: '1 Peixe', right: 'Peixes' },
      ],
    ],
    matQuiz: [
      { id: '2mat-q1', prompt: 'Quanto é 12 + 7?', visualEmoji: '🍭', options: ['18', '19', '20', '17'], correctIndex: 1, hint: 'Some 2 + 7 nas unidades (= 9) e junte com 10!' },
      { id: '2mat-q2', prompt: 'Qual é o DOBRO de 6?', visualEmoji: '🍒', options: ['8', '10', '12', '14'], correctIndex: 2, hint: 'Dobro é somar o número com ele mesmo: 6 + 6!' },
      { id: '2mat-q3', prompt: 'Uma cesta tem 20 biscoitos. Se comermos 5, quantos sobram?', visualEmoji: '🍪', options: ['14', '15', '16', '13'], correctIndex: 1, hint: 'Conte de 20 voltando 5 passos.' },
      { id: '2mat-q4', prompt: 'Quantas unidades formam 2 dezenas?', visualEmoji: '🌟', options: ['10', '12', '20', '22'], correctIndex: 2, hint: '1 dezena = 10. Então 2 dezenas = 10 + 10!' },
      { id: '2mat-q5', prompt: 'Qual é a METADE de 14?', visualEmoji: '🧁', options: ['6', '7', '8', '9'], correctIndex: 1, hint: 'Divida 14 docinhos igualmente entre 2 amigos!' },
      { id: '2mat-q6', prompt: 'Quanto é 25 + 15?', visualEmoji: '🍬', options: ['30', '35', '40', '45'], correctIndex: 2, hint: '5 + 5 = 10. Junte com 20 + 10 = 30!' },
      { id: '2mat-q7', prompt: 'Qual é o DOBRO de 8?', visualEmoji: '🍓', options: ['14', '16', '18', '12'], correctIndex: 1, hint: 'Calcule 8 + 8!' },
      { id: '2mat-q8', prompt: 'Quantos dias tem 1 semana completa?', visualEmoji: '📅', options: ['5 dias', '6 dias', '7 dias', '10 dias'], correctIndex: 2, hint: 'Segunda, terça, quarta, quinta, sexta, sábado e domingo!' },
      { id: '2mat-q9', prompt: 'Quanto é 38 - 8?', visualEmoji: '🎈', options: ['28', '30', '32', '20'], correctIndex: 1, hint: 'Se tirarmos as 8 unidades de 38, sobram 3 dezenas!' },
      { id: '2mat-q10', prompt: 'Qual número tem 3 dezenas e 4 unidades?', visualEmoji: '🔢', options: ['43', '34', '304', '13'], correctIndex: 1, hint: '30 + 4 = ...' },
    ],
    matMatchRounds: [
      [
        { id: '2m-1', left: '10 + 5', right: '15' },
        { id: '2m-2', left: 'Dobro de 4', right: '8' },
        { id: '2m-3', left: '20 - 6', right: '14' },
        { id: '2m-4', left: 'Metade de 10', right: '5' },
        { id: '2m-5', left: '12 + 7', right: '19' },
      ],
      [
        { id: '2m-6', left: '1 dezena', right: '10' },
        { id: '2m-7', left: '18 + 2', right: '20' },
        { id: '2m-8', left: 'Dobro de 9', right: '18' },
        { id: '2m-9', left: '30 - 5', right: '25' },
        { id: '2m-10', left: 'Metade de 12', right: '6' },
      ],
    ],
    matMissing: [
      { id: '2mm-1', instruction: 'Complete a soma:', emoji: '🍭', parts: ['10', '+', '?', '=', '17'], answer: '7', options: ['5', '6', '7', '8'], hint: '10 + 7 = 17!' },
      { id: '2mm-2', instruction: 'Complete contando de 2 em 2:', emoji: '🐰', parts: ['2,', '4,', '6,', '?', ', 10'], answer: '8', options: ['7', '8', '9', '12'], hint: 'Some +2 ao número 6!' },
      { id: '2mm-3', instruction: 'Complete a subtração:', emoji: '🍪', parts: ['20', '-', '?', '=', '15'], answer: '5', options: ['3', '4', '5', '6'], hint: 'Quanto falta de 15 para 20?' },
      { id: '2mm-4', instruction: 'Complete contando de 5 em 5:', emoji: '⭐', parts: ['5,', '10,', '?', ', 20'], answer: '15', options: ['12', '14', '15', '18'], hint: '10 + 5 = ...' },
      { id: '2mm-5', instruction: 'Complete o dobro:', emoji: '🍒', parts: ['7', '+', '7', '=', '?'], answer: '14', options: ['12', '14', '15', '16'], hint: 'Dobro de 7!' },
      { id: '2mm-6', instruction: 'Complete a soma:', emoji: '🧁', parts: ['?', '+', '8', '=', '18'], answer: '10', options: ['8', '9', '10', '12'], hint: '1 dezena + 8 = 18!' },
      { id: '2mm-7', instruction: 'Complete contando de 10 em 10:', emoji: '🎈', parts: ['10,', '20,', '30,', '?'], answer: '40', options: ['35', '40', '45', '50'], hint: '4 dezenas!' },
      { id: '2mm-8', instruction: 'Complete a subtração:', emoji: '🍓', parts: ['16', '-', '?', '=', '10'], answer: '6', options: ['4', '5', '6', '7'], hint: 'Tire as 6 unidades!' },
      { id: '2mm-9', instruction: 'Complete a soma:', emoji: '🎀', parts: ['25', '+', '?', '=', '30'], answer: '5', options: ['4', '5', '6', '10'], hint: 'Conte de 25 até 30!' },
      { id: '2mm-10', instruction: 'Complete a metade:', emoji: '🍰', parts: ['10', '+', '10', '=', '?'], answer: '20', options: ['15', '20', '25', '30'], hint: '2 dezenas!' },
    ],
    matCompare: [
      { id: '2mc-1', leftLabel: '18', rightLabel: '12', emoji: '🍭', correctSymbol: '>', hint: '18 é maior que 12!' },
      { id: '2mc-2', leftLabel: '10 + 5', rightLabel: '15', emoji: '⭐', correctSymbol: '=', hint: '10 + 5 é igual a 15!' },
      { id: '2mc-3', leftLabel: '20 - 4', rightLabel: '19', emoji: '🍪', correctSymbol: '<', hint: '20 - 4 = 16, que é menor que 19.' },
      { id: '2mc-4', leftLabel: 'Dobro de 5', rightLabel: '8', emoji: '🍒', correctSymbol: '>', hint: 'Dobro de 5 é 10, maior que 8!' },
      { id: '2mc-5', leftLabel: '14', rightLabel: '24', emoji: '🧁', correctSymbol: '<', hint: '14 tem 1 dezena e 24 tem 2 dezenas.' },
      { id: '2mc-6', leftLabel: 'Metade de 16', rightLabel: '8', emoji: '🍓', correctSymbol: '=', hint: 'Metade de 16 é exatamente 8!' },
      { id: '2mc-7', leftLabel: '30', rightLabel: '29', emoji: '🎈', correctSymbol: '>', hint: '30 vem depois do 29!' },
      { id: '2mc-8', leftLabel: '12 + 3', rightLabel: '20', emoji: '🌸', correctSymbol: '<', hint: '12 + 3 = 15, menor que 20.' },
      { id: '2mc-9', leftLabel: '2 dezenas', rightLabel: '20', emoji: '🎀', correctSymbol: '=', hint: '2 dezenas valem 20 unidades!' },
      { id: '2mc-10', leftLabel: '25 - 5', rightLabel: '15', emoji: '🍬', correctSymbol: '>', hint: '25 - 5 = 20, que é maior que 15!' },
    ],
  },

  /* =========================================================
     3º ANO
  ========================================================= */
  {
    id: 3,
    title: '3º Ano',
    subtitle: 'Ortografia, Gramática e Tabuada',
    mascotName: 'Pudim Estrela',
    cardBg: '#FFE066',
    cardBorder: '#E59F00',
    accentBg: '#FFF8DA',
    accentText: '#6B4800',
    ptTopics: ['M antes de P/B', 'Substantivos e Adjetivos', 'SS e RR'],
    matTopics: ['Tabuada (2 a 5)', 'Centenas', 'Problemas e Horas'],
    ptQuiz: [
      { id: '3pt-q1', prompt: 'Qual palavra usa M antes de P e B corretamente?', visualEmoji: '🥁', options: ['TANBOR', 'TAMBOR', 'BOMBOM', 'TAMBOR e BOMBOM'], correctIndex: 3, hint: 'Antes de P e B, só se escreve M!' },
      { id: '3pt-q2', prompt: 'Na frase "O gatinho fofo dormiu", qual palavra é um ADJETIVO?', visualEmoji: '😺', options: ['gatinho', 'dormiu', 'fofo', 'O'], correctIndex: 2, hint: 'Adjetivo é a característica do gatinho!' },
      { id: '3pt-q3', prompt: 'Complete corretamente: "O ___ do jardim canta bem."', visualEmoji: '🐦', options: ['PÁSARO', 'PÁSSARO', 'PAÇARO', 'PÁZARO'], correctIndex: 1, hint: 'Entre duas vogais, som forte de S usa SS!' },
      { id: '3pt-q4', prompt: 'Qual dessas palavras é um SUBSTANTIVO PRÓPRIO?', visualEmoji: '🏙️', options: ['cidade', 'caderno', 'Brasil', 'nuvem'], correctIndex: 2, hint: 'Nomeia países, cidades ou pessoas com letra maiúscula!' },
      { id: '3pt-q5', prompt: 'Qual é o coletivo de PEIXES?', visualEmoji: '🐟', options: ['ENXAME', 'CARDUME', 'ALCATEIA', 'REBANHO'], correctIndex: 1, hint: 'Um grupo de peixes nadando juntos forma um...' },
      { id: '3pt-q6', prompt: 'Qual palavra é um VERBO (indica uma ação)?', visualEmoji: '🏃', options: ['mesa', 'correr', 'azul', 'estrela'], correctIndex: 1, hint: 'É algo que podemos fazer!' },
      { id: '3pt-q7', prompt: 'Qual palavra tem o som forte de RR entre vogais?', visualEmoji: '🐶', options: ['CACHORO', 'CACHORRO', 'CAXORRO', 'CACHORU'], correctIndex: 1, hint: 'Para ter som forte entre vogais usamos dois Rs!' },
      { id: '3pt-q8', prompt: 'Qual é o coletivo de ABELHAS?', visualEmoji: '🐝', options: ['BANDO', 'ENXAME', 'MATILHA', 'CONSTELAÇÃO'], correctIndex: 1, hint: 'Muitas abelhas voando juntas formam um...' },
      { id: '3pt-q9', prompt: 'Na frase "A flor cheirosa abriu", qual é o SUBSTANTIVO?', visualEmoji: '🌷', options: ['A', 'flor', 'cheirosa', 'abriu'], correctIndex: 1, hint: 'É o nome do ser/objeto da frase!' },
      { id: '3pt-q10', prompt: 'Qual palavra está escrita corretamente com N antes de T?', visualEmoji: '🐘', options: ['ELEFAMTE', 'ELEFANTE', 'ELEFANTI', 'ELEFAMTI'], correctIndex: 1, hint: 'Antes de T (não é P nem B), usamos N!' },
    ],
    ptBuilder: [
      { id: '3pt-b1', instruction: 'Escolha a letra certa antes do P:', clueEmoji: '⛺', mode: 'missing', prefix: 'CA', suffix: 'PO', answer: 'M', tiles: ['N', 'M', 'S', 'L'], hint: 'Antes de P e B sempre usamos M!' },
      { id: '3pt-b2', instruction: 'Complete com R ou RR:', clueEmoji: '🚗', mode: 'missing', prefix: 'CA', suffix: 'O', answer: 'RR', tiles: ['R', 'RR', 'S', 'SS'], hint: 'Com um R só fica "caro". Use dois!' },
      { id: '3pt-b3', instruction: 'Ordene as sílabas da palavra:', clueEmoji: '🌻', mode: 'syllables', answer: 'GIRASSOL', targetSyllables: ['GI', 'RAS', 'SOL'], tiles: ['SOL', 'GI', 'RAS', 'CA'], hint: 'A flor que segue o sol!' },
      { id: '3pt-b4', instruction: 'Complete com CH ou X:', clueEmoji: '🔑', mode: 'missing', prefix: '', suffix: 'AVE', answer: 'CH', tiles: ['X', 'CH', 'S', 'Z'], hint: 'Abre a porta: CHA-VE!' },
      { id: '3pt-b5', instruction: 'Monte a palavra:', clueEmoji: '📚', mode: 'syllables', answer: 'CADERNO', targetSyllables: ['CA', 'DER', 'NO'], tiles: ['NO', 'CA', 'DER', 'BO'], hint: 'Usamos para escrever na escola!' },
      { id: '3pt-b6', instruction: 'Complete com M ou N antes do B:', clueEmoji: '🍬', mode: 'missing', prefix: 'BO', suffix: 'BOM', answer: 'M', tiles: ['M', 'N', 'R', 'S'], hint: 'Antes de B usamos M!' },
      { id: '3pt-b7', instruction: 'Complete com S ou SS:', clueEmoji: '🦴', mode: 'missing', prefix: 'O', suffix: 'O', answer: 'SS', tiles: ['S', 'SS', 'Ç', 'Z'], hint: 'Som forte de S entre vogais: O-SSO!' },
      { id: '3pt-b8', instruction: 'Ordene as sílabas:', clueEmoji: '⭐', mode: 'syllables', answer: 'ESTRELA', targetSyllables: ['ES', 'TRE', 'LA'], tiles: ['LA', 'ES', 'TRE', 'SO'], hint: 'Brilha no céu à noite!' },
      { id: '3pt-b9', instruction: 'Complete com M ou N antes do D:', clueEmoji: '🌍', mode: 'missing', prefix: 'MU', suffix: 'DO', answer: 'N', tiles: ['M', 'N', 'L', 'R'], hint: 'Não é P nem B, então usamos N!' },
      { id: '3pt-b10', instruction: 'Ordene as sílabas do coletivo de estrelas:', clueEmoji: '🌌', mode: 'syllables', answer: 'CONSTELAÇÃO', targetSyllables: ['CONS', 'TE', 'LA', 'ÇÃO'], tiles: ['LA', 'CONS', 'ÇÃO', 'TE'], hint: 'Grupo de estrelas no céu!' },
    ],
    ptTrueFalse: [
      { id: '3pt-tf1', statement: 'Antes das letras P e B sempre escrevemos M.', emoji: '🥁', isTrue: true, explanation: 'Regra de ouro! Ex: tambor, campo, pomba.' },
      { id: '3pt-tf2', statement: 'A palavra "São Paulo" é um substantivo comum.', emoji: '🏙️', isTrue: false, explanation: 'É o nome de uma cidade específica, portanto é substantivo PRÓPRIO!' },
      { id: '3pt-tf3', statement: 'Na palavra "menino feliz", "feliz" é um adjetivo.', emoji: '😄', isTrue: true, explanation: 'Isso mesmo! Dá uma qualidade ao menino.' },
      { id: '3pt-tf4', statement: 'Um grupo de lobos se chama ALCATEIA.', emoji: '🐺', isTrue: true, explanation: 'Certinho! Alcateia é o coletivo de lobos.' },
      { id: '3pt-tf5', statement: 'A palavra PÁSSARO se escreve com apenas um S.', emoji: '🐦', isTrue: false, explanation: 'Escreve-se com dois S (SS) entre as vogais!' },
      { id: '3pt-tf6', statement: 'A palavra "pular" é um verbo.', emoji: '🤸', isTrue: true, explanation: 'Sim! Pular indica uma ação.' },
      { id: '3pt-tf7', statement: 'Nenhuma palavra em português começa com RR.', emoji: '🔤', isTrue: true, explanation: 'Verdade! No início da palavra usamos apenas um R (ex: Rato).' },
      { id: '3pt-tf8', statement: 'O coletivo de estrelas é CARDUME.', emoji: '⭐', isTrue: false, explanation: 'Cardume é de peixes! De estrelas é CONSTELAÇÃO.' },
      { id: '3pt-tf9', statement: 'A palavra DOCE tem 2 sílabas: DO-CE.', emoji: '🍬', isTrue: true, explanation: 'Sim! DO-CE é uma palavra dissílaba.' },
      { id: '3pt-tf10', statement: 'BOMBA se escreve com N: BONBA.', emoji: '💣', isTrue: false, explanation: 'Antes de B escrevemos M: BOMBA!' },
    ],
    ptMatchRounds: [
      [
        { id: '3pm-1', left: 'Peixes', right: 'Cardume' },
        { id: '3pm-2', left: 'Abelhas', right: 'Enxame' },
        { id: '3pm-3', left: 'Estrelas', right: 'Constelação' },
        { id: '3pm-4', left: 'Lobos', right: 'Alcateia' },
        { id: '3pm-5', left: 'Ovelhas', right: 'Rebanho' },
      ],
      [
        { id: '3pm-6', left: 'Correr', right: 'Verbo' },
        { id: '3pm-7', left: 'Carinhoso', right: 'Adjetivo' },
        { id: '3pm-8', left: 'Brasil', right: 'Subst. Próprio' },
        { id: '3pm-9', left: 'Caderno', right: 'Subst. Comum' },
        { id: '3pm-10', left: 'Gatinho', right: 'Diminutivo' },
      ],
    ],
    matQuiz: [
      { id: '3mat-q1', prompt: 'Quanto é 4 × 5?', visualEmoji: '🎀', options: ['15', '20', '25', '18'], correctIndex: 1, hint: 'Some 5 quatro vezes: 5 + 5 + 5 + 5!' },
      { id: '3mat-q2', prompt: 'Em uma caixa cabem 3 bombons. Quantos há em 6 caixas?', visualEmoji: '🍬', options: ['15', '16', '18', '21'], correctIndex: 2, hint: 'Calcule 6 × 3!' },
      { id: '3mat-q3', prompt: 'Qual número equivale a 1 centena + 2 dezenas + 4 unidades?', visualEmoji: '🔢', options: ['142', '214', '124', '104'], correctIndex: 2, hint: '100 + 20 + 4 = ...' },
      { id: '3mat-q4', prompt: 'Quanto é 250 + 150?', visualEmoji: '🧁', options: ['300', '350', '400', '450'], correctIndex: 2, hint: '200 + 100 = 300, e 50 + 50 = 100!' },
      { id: '3mat-q5', prompt: 'Quantos minutos tem 1 hora inteira?', visualEmoji: '⏰', options: ['30 min', '45 min', '60 min', '100 min'], correctIndex: 2, hint: 'Volta completa do ponteiro grande!' },
      { id: '3mat-q6', prompt: 'Quanto é 3 × 7?', visualEmoji: '🍓', options: ['18', '21', '24', '27'], correctIndex: 1, hint: '7 + 7 + 7!' },
      { id: '3mat-q7', prompt: 'Qual é o triplo de 5?', visualEmoji: '⭐', options: ['10', '15', '20', '25'], correctIndex: 1, hint: 'Triplo é multiplicar por 3: 3 × 5!' },
      { id: '3mat-q8', prompt: 'Quanto é 500 - 200?', visualEmoji: '🎈', options: ['200', '250', '300', '350'], correctIndex: 2, hint: '5 centenas menos 2 centenas!' },
      { id: '3mat-q9', prompt: 'Quanto é 2 × 9?', visualEmoji: '🌸', options: ['16', '18', '20', '14'], correctIndex: 1, hint: '9 + 9!' },
      { id: '3mat-q10', prompt: 'Quantos meses tem 1 ano completo?', visualEmoji: '📅', options: ['10', '12', '14', '6'], correctIndex: 1, hint: 'De janeiro até dezembro!' },
    ],
    matMatchRounds: [
      [
        { id: '3m-1', left: '3 × 4', right: '12' },
        { id: '3m-2', left: '5 × 5', right: '25' },
        { id: '3m-3', left: '2 × 9', right: '18' },
        { id: '3m-4', left: '4 × 7', right: '28' },
        { id: '3m-5', left: '3 × 9', right: '27' },
      ],
      [
        { id: '3m-6', left: '1 centena', right: '100' },
        { id: '3m-7', left: '3 × 8', right: '24' },
        { id: '3m-8', left: '150 + 50', right: '200' },
        { id: '3m-9', left: '5 × 6', right: '30' },
        { id: '3m-10', left: '4 × 9', right: '36' },
      ],
    ],
    matMissing: [
      { id: '3mm-1', instruction: 'Complete a tabuada:', emoji: '🎀', parts: ['3', '×', '?', '=', '15'], answer: '5', options: ['3', '4', '5', '6'], hint: '3 vezes quanto dá 15?' },
      { id: '3mm-2', instruction: 'Complete a soma de centenas:', emoji: '🧁', parts: ['100', '+', '?', '=', '300'], answer: '200', options: ['100', '150', '200', '250'], hint: '100 mais 2 centenas!' },
      { id: '3mm-3', instruction: 'Complete a tabuada:', emoji: '🍓', parts: ['4', '×', '?', '=', '24'], answer: '6', options: ['5', '6', '7', '8'], hint: '4 × 5 = 20, então 4 × 6 = ...' },
      { id: '3mm-4', instruction: 'Complete a sequência da tabuada do 3:', emoji: '⭐', parts: ['3,', '6,', '9,', '?', ', 15'], answer: '12', options: ['10', '11', '12', '13'], hint: '9 + 3 = ...' },
      { id: '3mm-5', instruction: 'Complete a tabuada do 5:', emoji: '🍬', parts: ['5', '×', '8', '=', '?'], answer: '40', options: ['35', '40', '45', '50'], hint: 'Conte de 5 em 5 oito vezes!' },
      { id: '3mm-6', instruction: 'Complete a subtração:', emoji: '🎈', parts: ['400', '-', '?', '=', '250'], answer: '150', options: ['100', '150', '200', '250'], hint: '250 + 150 = 400!' },
      { id: '3mm-7', instruction: 'Complete a tabuada:', emoji: '🌸', parts: ['?', '×', '7', '=', '14'], answer: '2', options: ['2', '3', '4', '5'], hint: 'Dobro de 7!' },
      { id: '3mm-8', instruction: 'Complete o triplo:', emoji: '🐣', parts: ['3', '×', '10', '=', '?'], answer: '30', options: ['20', '25', '30', '35'], hint: '10 + 10 + 10!' },
      { id: '3mm-9', instruction: 'Complete a sequência de 100 em 100:', emoji: '🔢', parts: ['200,', '300,', '?', ', 500'], answer: '400', options: ['350', '400', '450', '600'], hint: 'Entre 300 e 500!' },
      { id: '3mm-10', instruction: 'Complete a multiplicação:', emoji: '🍰', parts: ['4', '×', '8', '=', '?'], answer: '32', options: ['28', '30', '32', '36'], hint: '4 × 8 = 16 + 16!' },
    ],
    matCompare: [
      { id: '3mc-1', leftLabel: '3 × 5', rightLabel: '12', emoji: '🎀', correctSymbol: '>', hint: '3 × 5 = 15, que é maior que 12.' },
      { id: '3mc-2', leftLabel: '4 × 5', rightLabel: '20', emoji: '⭐', correctSymbol: '=', hint: '4 × 5 dá exatamente 20!' },
      { id: '3mc-3', leftLabel: '2 × 8', rightLabel: '20', emoji: '🍬', correctSymbol: '<', hint: '2 × 8 = 16, menor que 20.' },
      { id: '3mc-4', leftLabel: '150 + 150', rightLabel: '300', emoji: '🧁', correctSymbol: '=', hint: '150 + 150 = 300!' },
      { id: '3mc-5', leftLabel: '5 × 7', rightLabel: '30', emoji: '🍓', correctSymbol: '>', hint: '5 × 7 = 35, maior que 30!' },
      { id: '3mc-6', leftLabel: '1 centena', rightLabel: '99', emoji: '🔢', correctSymbol: '>', hint: '1 centena vale 100!' },
      { id: '3mc-7', leftLabel: '3 × 4', rightLabel: '2 × 6', emoji: '🎈', correctSymbol: '=', hint: 'Os dois valem 12!' },
      { id: '3mc-8', leftLabel: '4 × 4', rightLabel: '18', emoji: '🌸', correctSymbol: '<', hint: '4 × 4 = 16, menor que 18.' },
      { id: '3mc-9', leftLabel: '1 hora', rightLabel: '45 min', emoji: '⏰', correctSymbol: '>', hint: '1 hora tem 60 minutos!' },
      { id: '3mc-10', leftLabel: '500 - 100', rightLabel: '450', emoji: '🍰', correctSymbol: '<', hint: '500 - 100 = 400, menor que 450.' },
    ],
  },

  /* =========================================================
     4º ANO
  ========================================================= */
  {
    id: 4,
    title: '4º Ano',
    subtitle: 'Interpretação, Acentuação e Divisão',
    mascotName: 'Menta Sorriso',
    cardBg: '#8AEBC0',
    cardBorder: '#19A86A',
    accentBg: '#E9FFF4',
    accentText: '#0B5536',
    ptTopics: ['Interpretação', 'Acentuação Gráfica', 'Tempos Verbais'],
    matTopics: ['Tabuada Completa', 'Divisão Exata', 'Perímetro e Medidas'],
    ptQuiz: [
      { id: '4pt-q1', readingPassage: '"Todo sábado, Clara prepara panquecas de banana com mel e divide com sua irmãzinha no jardim."', prompt: 'Por que Clara vai ao jardim aos sábados?', visualEmoji: '🥞', options: ['Para comprar mel no mercado', 'Para dividir panquecas com sua irmã', 'Para plantar bananeiras', 'Para estudar sozinha'], correctIndex: 1, hint: 'Releia a última parte da frase com atenção!' },
      { id: '4pt-q2', prompt: 'Qual palavra leva acento agudo por ser proparoxítona (sempre acentuada)?', visualEmoji: '🎵', options: ['CADERNO', 'MÚSICA', 'JANELA', 'BONECA'], correctIndex: 1, hint: 'A sílaba mais forte é a antepenúltima: MÚ-si-ca!' },
      { id: '4pt-q3', prompt: 'Na frase "Ontem nós brincamos no parque", o verbo "brincamos" está no:', visualEmoji: '🎠', options: ['Presente', 'Futuro', 'Passado (Pretérito)', 'Imperativo'], correctIndex: 2, hint: '"Ontem" mostra que já aconteceu!' },
      { id: '4pt-q4', prompt: 'Qual pontuação usamos no final de uma pergunta direta?', visualEmoji: '❓', options: ['Ponto final (.)', 'Exclamação (!)', 'Interrogação (?)', 'Vírgula (,)'], correctIndex: 2, hint: 'Parece uma orelhinha curiosa!' },
      { id: '4pt-q5', prompt: 'Qual palavra é escrita com Ç (cedilha)?', visualEmoji: '💖', options: ['CORASÃO', 'CORAÇÃO', 'CORASSÃO', 'CORAZÃO'], correctIndex: 1, hint: 'A cedilha antes de A, O, U dá som de S!' },
      { id: '4pt-q6', prompt: 'Qual palavra é uma OXÍTONA (última sílaba mais forte)?', visualEmoji: '☕', options: ['CAFÉ', 'ÁRVORE', 'CADERNO', 'LÁPIS'], correctIndex: 0, hint: 'Falamos bem forte no final: ca-FÉ!' },
      { id: '4pt-q7', prompt: 'Qual pronome substitui corretamente "Eu e meus amigos"?', visualEmoji: '👧👦', options: ['Eles', 'Nós', 'Você', 'Ela'], correctIndex: 1, hint: 'Quando você faz parte do grupo, dizemos...' },
      { id: '4pt-q8', prompt: 'Em "Amanhã faremos um piquenique", o verbo está no:', visualEmoji: '🧺', options: ['Passado', 'Presente', 'Futuro', 'Infinitivo'], correctIndex: 2, hint: '"Amanhã" ainda vai acontecer!' },
      { id: '4pt-q9', prompt: 'Qual pontuação expressa alegria, susto ou admiração ("Que lindo!")?', visualEmoji: '🤩', options: ['Ponto final (.)', 'Exclamação (!)', 'Interrogação (?)', 'Dois pontos (:)'], correctIndex: 1, hint: 'É o tracinho com um ponto embaixo!' },
      { id: '4pt-q10', prompt: 'Qual palavra leva acento circunflexo (^) na sílaba tônica?', visualEmoji: '🚌', options: ['ÔNIBUS', 'SOFÁ', 'ÁGUA', 'CHÁ'], correctIndex: 0, hint: 'O acento que parece um chapeuzinho!' },
    ],
    ptBuilder: [
      { id: '4pt-b1', instruction: 'Complete a frase com o verbo no futuro:', clueEmoji: '🚀', mode: 'missing', prefix: 'Amanhã nós ', suffix: ' ao museu.', answer: 'iremos', tiles: ['fomos', 'iremos', 'fui', 'brincava'], hint: '"Amanhã" indica que ainda vai acontecer!' },
      { id: '4pt-b2', instruction: 'Escolha a grafia correta:', clueEmoji: '🍬', mode: 'missing', prefix: 'A', suffix: 'ÚCAR', answer: 'Ç', tiles: ['S', 'SS', 'Ç', 'Z'], hint: 'Antes da letra U usamos Ç!' },
      { id: '4pt-b3', instruction: 'Monte a palavra proparoxítona:', clueEmoji: '⚡', mode: 'syllables', answer: 'LÂMPADA', targetSyllables: ['LÂM', 'PA', 'DA'], tiles: ['DA', 'LÂM', 'PA', 'LA'], hint: 'LÂM-PA-DA!' },
      { id: '4pt-b4', instruction: 'Complete com o sinônimo de FELIZ:', clueEmoji: '😊', mode: 'missing', prefix: 'O coelhinho ficou muito ', suffix: '!', answer: 'alegre', tiles: ['triste', 'alegre', 'bravo', 'cansado'], hint: 'Sentido parecido com feliz!' },
      { id: '4pt-b5', instruction: 'Complete a sílaba correta:', clueEmoji: '✉️', mode: 'missing', prefix: 'MEN', suffix: 'GEM', answer: 'SA', tiles: ['SA', 'ZA', 'ÇA', 'SSA'], hint: 'Escrevemos MEN-SA-GEM com S!' },
      { id: '4pt-b6', instruction: 'Monte a palavra proparoxítona:', clueEmoji: '🌳', mode: 'syllables', answer: 'ÁRVORE', targetSyllables: ['ÁR', 'VO', 'RE'], tiles: ['RE', 'ÁR', 'VO', 'CA'], hint: 'Sílaba forte com acento agudo: ÁR!' },
      { id: '4pt-b7', instruction: 'Complete com o verbo no passado:', clueEmoji: '📖', mode: 'missing', prefix: 'Ontem eu ', suffix: ' um livro legal.', answer: 'li', tiles: ['li', 'lerei', 'vou ler', 'lê'], hint: 'Algo que você já fez ontem!' },
      { id: '4pt-b8', instruction: 'Complete com o pronome correto:', clueEmoji: '🎀', mode: 'missing', prefix: '', suffix: ' gostamos de aprender.', answer: 'Nós', tiles: ['Eu', 'Tu', 'Nós', 'Ele'], hint: 'O verbo "gostamos" combina com...' },
      { id: '4pt-b9', instruction: 'Monte o nome do sinal de pergunta:', clueEmoji: '❓', mode: 'syllables', answer: 'INTERROGAÇÃO', targetSyllables: ['IN', 'TER', 'RO', 'GA', 'ÇÃO'], tiles: ['GA', 'IN', 'ÇÃO', 'TER', 'RO'], hint: 'IN-TER-RO-GA-ÇÃO!' },
      { id: '4pt-b10', instruction: 'Complete a palavra:', clueEmoji: '🏥', mode: 'missing', prefix: 'HOSPI', suffix: 'L', answer: 'TA', tiles: ['TA', 'DA', 'CA', 'LA'], hint: 'HOS-PI-TAL!' },
    ],
    ptTrueFalse: [
      { id: '4pt-tf1', statement: 'Todas as palavras proparoxítonas são acentuadas.', emoji: '🎵', isTrue: true, explanation: 'Verdade! Exemplos: música, lâmpada, árvore.' },
      { id: '4pt-tf2', statement: 'O ponto de exclamação (?) serve para fazer perguntas.', emoji: '❓', isTrue: false, explanation: 'O ponto de pergunta é o de INTERROGAÇÃO (?).' },
      { id: '4pt-tf3', statement: 'Em "Nós estudaremos amanhã", o verbo está no futuro.', emoji: '🚀', isTrue: true, explanation: 'Isso mesmo! Estudaremos indica algo que ainda vai ocorrer.' },
      { id: '4pt-tf4', statement: 'Usamos Ç antes das vogais E e I.', emoji: '🔤', isTrue: false, explanation: 'Nunca! Ç só aparece antes de A, O e U.' },
      { id: '4pt-tf5', statement: 'A palavra CAFÉ é uma oxítona.', emoji: '☕', isTrue: true, explanation: 'Sim! A última sílaba (FÉ) é a mais forte.' },
      { id: '4pt-tf6', statement: 'Verbos no passado indicam ações que já aconteceram.', emoji: '⏳', isTrue: true, explanation: 'Certinho! Ex: brinquei, corri, li.' },
      { id: '4pt-tf7', statement: 'A palavra LÂMPADA leva acento agudo.', emoji: '💡', isTrue: false, explanation: 'Ela leva acento CIRCUNFLEXO (^) no Â.' },
      { id: '4pt-tf8', statement: '"Rápido" e "veloz" são palavras antônimas.', emoji: '⚡', isTrue: false, explanation: 'Elas têm o mesmo sentido, então são SINÔNIMAS.' },
      { id: '4pt-tf9', statement: 'O pronome "Elas" está no plural e no feminino.', emoji: '👧', isTrue: true, explanation: 'Muito bem! Refere-se a mais de uma menina/mulher.' },
      { id: '4pt-tf10', statement: 'Na palavra CORAÇÃO, o til (~) aparece sobre o A.', emoji: '💖', isTrue: true, explanation: 'Sim! Dá o som nasal "-ÃO".' },
    ],
    ptMatchRounds: [
      [
        { id: '4pm-1', left: 'Ontem brinquei', right: 'Passado' },
        { id: '4pm-2', left: 'Hoje brinco', right: 'Presente' },
        { id: '4pm-3', left: 'Amanhã brincarei', right: 'Futuro' },
        { id: '4pm-4', left: 'Que legal!', right: 'Exclamação' },
        { id: '4pm-5', left: 'Onde você vai?', right: 'Interrogação' },
      ],
      [
        { id: '4pm-6', left: 'MÚ-si-ca', right: 'Proparoxítona' },
        { id: '4pm-7', left: 'Ca-FÉ', right: 'Oxítona' },
        { id: '4pm-8', left: 'LÁ-pis', right: 'Paroxítona' },
        { id: '4pm-9', left: 'Alegre / Feliz', right: 'Sinônimos' },
        { id: '4pm-10', left: 'Claro / Escuro', right: 'Antônimos' },
      ],
    ],
    matQuiz: [
      { id: '4mat-q1', prompt: 'Quanto é 36 ÷ 4 (dividir 36 docinhos por 4 amigos)?', visualEmoji: '🍩', options: ['7', '8', '9', '10'], correctIndex: 2, hint: 'Na tabuada do 4, qual número × 4 dá 36?' },
      { id: '4mat-q2', prompt: 'Um quadrado tem cada lado medindo 5 cm. Qual é o seu perímetro?', visualEmoji: '🟦', options: ['10 cm', '15 cm', '20 cm', '25 cm'], correctIndex: 2, hint: 'Perímetro é a soma dos 4 lados: 5 + 5 + 5 + 5!' },
      { id: '4mat-q3', prompt: 'Quanto é 8 × 7?', visualEmoji: '🌟', options: ['54', '56', '58', '64'], correctIndex: 1, hint: '8 × 5 = 40 e 8 × 2 = 16. Some 40 + 16!' },
      { id: '4mat-q4', prompt: 'Quantos vértices (pontas) tem um pentágono?', visualEmoji: '⬠', options: ['4', '5', '6', '8'], correctIndex: 1, hint: '"Penta" significa cinco!' },
      { id: '4mat-q5', prompt: 'Se 1 litro tem 1.000 ml, quantos ml há em meio litro?', visualEmoji: '🧃', options: ['250 ml', '500 ml', '750 ml', '100 ml'], correctIndex: 1, hint: 'Calcule a metade de 1.000!' },
      { id: '4mat-q6', prompt: 'Quanto é 9 × 6?', visualEmoji: '🍓', options: ['48', '52', '54', '56'], correctIndex: 2, hint: '9 × 5 = 45, mais 9 = ...' },
      { id: '4mat-q7', prompt: 'Quanto é 48 ÷ 6?', visualEmoji: '🧁', options: ['6', '7', '8', '9'], correctIndex: 2, hint: 'Qual número vezes 6 dá 48?' },
      { id: '4mat-q8', prompt: 'Quantos metros existem em 2 quilômetros (1 km = 1.000 m)?', visualEmoji: '🛣️', options: ['200 m', '1.200 m', '2.000 m', '20.000 m'], correctIndex: 2, hint: '2 × 1.000 metros!' },
      { id: '4mat-q9', prompt: 'Quanto é 12 × 4?', visualEmoji: '🍬', options: ['36', '44', '48', '52'], correctIndex: 2, hint: '10 × 4 = 40 e 2 × 4 = 8!' },
      { id: '4mat-q10', prompt: 'Um triângulo com lados de 4 cm, 4 cm e 4 cm tem qual perímetro?', visualEmoji: '🔺', options: ['8 cm', '10 cm', '12 cm', '16 cm'], correctIndex: 2, hint: 'Some os 3 lados: 4 + 4 + 4!' },
    ],
    matMatchRounds: [
      [
        { id: '4m-1', left: '42 ÷ 6', right: '7' },
        { id: '4m-2', left: '7 × 9', right: '63' },
        { id: '4m-3', left: '81 ÷ 9', right: '9' },
        { id: '4m-4', left: '6 × 8', right: '48' },
        { id: '4m-5', left: '72 ÷ 8', right: '9 ' },
      ],
      [
        { id: '4m-6', left: 'Perímetro quad. 4cm', right: '16 cm' },
        { id: '4m-7', left: '1.000 ml', right: '1 litro' },
        { id: '4m-8', left: '56 ÷ 8', right: '7' },
        { id: '4m-9', left: '12 × 3', right: '36' },
        { id: '4m-10', left: '1 km', right: '1.000 m' },
      ],
    ],
    matMissing: [
      { id: '4mm-1', instruction: 'Complete a divisão:', emoji: '🍩', parts: ['45', '÷', '?', '=', '9'], answer: '5', options: ['4', '5', '6', '7'], hint: '5 × 9 = 45!' },
      { id: '4mm-2', instruction: 'Complete a multiplicação:', emoji: '🌟', parts: ['7', '×', '?', '=', '49'], answer: '7', options: ['6', '7', '8', '9'], hint: '7 vezes ele mesmo!' },
      { id: '4mm-3', instruction: 'Complete a divisão:', emoji: '🧁', parts: ['64', '÷', '8', '=', '?'], answer: '8', options: ['6', '7', '8', '9'], hint: '8 × 8 = 64!' },
      { id: '4mm-4', instruction: 'Complete a sequência:', emoji: '🟦', parts: ['8,', '16,', '24,', '?'], answer: '32', options: ['28', '30', '32', '36'], hint: 'Tabuada do 8: 24 + 8!' },
      { id: '4mm-5', instruction: 'Complete a multiplicação:', emoji: '🍓', parts: ['9', '×', '?', '=', '72'], answer: '8', options: ['7', '8', '9', '6'], hint: '8 × 9 = 72!' },
      { id: '4mm-6', instruction: 'Complete a divisão:', emoji: '🧃', parts: ['1.000', '÷', '2', '=', '?'], answer: '500', options: ['250', '500', '750', '200'], hint: 'Metade de 1.000!' },
      { id: '4mm-7', instruction: 'Complete o perímetro do quadrado de lado 6:', emoji: '📐', parts: ['6', '×', '4', '=', '?'], answer: '24', options: ['18', '20', '24', '28'], hint: '6 + 6 + 6 + 6!' },
      { id: '4mm-8', instruction: 'Complete a divisão:', emoji: '🍬', parts: ['?', '÷', '5', '=', '10'], answer: '50', options: ['40', '45', '50', '55'], hint: '5 × 10 = 50!' },
      { id: '4mm-9', instruction: 'Complete a multiplicação:', emoji: '🎀', parts: ['6', '×', '7', '=', '?'], answer: '42', options: ['36', '42', '48', '49'], hint: '6 × 7 = 42!' },
      { id: '4mm-10', instruction: 'Complete a soma grande:', emoji: '🔢', parts: ['1.200', '+', '?', '=', '2.000'], answer: '800', options: ['600', '700', '800', '900'], hint: '12 + 8 = 20!' },
    ],
    matCompare: [
      { id: '4mc-1', leftLabel: '8 × 7', rightLabel: '50', emoji: '🌟', correctSymbol: '>', hint: '8 × 7 = 56, maior que 50!' },
      { id: '4mc-2', leftLabel: '36 ÷ 4', rightLabel: '9', emoji: '🍩', correctSymbol: '=', hint: '36 ÷ 4 é igual a 9!' },
      { id: '4mc-3', leftLabel: '6 × 6', rightLabel: '40', emoji: '🟦', correctSymbol: '<', hint: '6 × 6 = 36, menor que 40.' },
      { id: '4mc-4', leftLabel: '1 litro', rightLabel: '1.000 ml', emoji: '🧃', correctSymbol: '=', hint: '1 litro tem exatamente 1.000 ml!' },
      { id: '4mc-5', leftLabel: '9 × 9', rightLabel: '80', emoji: '🍓', correctSymbol: '>', hint: '9 × 9 = 81!' },
      { id: '4mc-6', leftLabel: '48 ÷ 8', rightLabel: '7', emoji: '🧁', correctSymbol: '<', hint: '48 ÷ 8 = 6, menor que 7.' },
      { id: '4mc-7', leftLabel: 'Perímetro quad. 5cm', rightLabel: '20 cm', emoji: '📐', correctSymbol: '=', hint: '4 × 5 = 20 cm!' },
      { id: '4mc-8', leftLabel: '2 km', rightLabel: '1.500 m', emoji: '🛣️', correctSymbol: '>', hint: '2 km = 2.000 m!' },
      { id: '4mc-9', leftLabel: '7 × 4', rightLabel: '30', emoji: '🍬', correctSymbol: '<', hint: '7 × 4 = 28, menor que 30.' },
      { id: '4mc-10', leftLabel: '63 ÷ 7', rightLabel: '3 × 3', emoji: '🎀', correctSymbol: '=', hint: 'Os dois lados valem 9!' },
    ],
  },

  /* =========================================================
     5º ANO
  ========================================================= */
  {
    id: 5,
    title: '5º Ano',
    subtitle: 'Produção Textual, Frações e Porcentagem',
    mascotName: 'Lilás Celestial',
    cardBg: '#C4A1FF',
    cardBorder: '#8548E8',
    accentBg: '#F4EDFF',
    accentText: '#3F1780',
    ptTopics: ['Interpretação', 'Mas vs Mais', 'Concordância Verbal'],
    matTopics: ['Frações Visuais', 'Porcentagem Básica', 'Área e Lógica'],
    ptQuiz: [
      { id: '5pt-q1', readingPassage: '"Embora estivesse chovendo bastante, os alunos montaram a feira de ciências no pátio coberto e receberam todas as famílias com alegria."', prompt: 'Qual palavra expressa uma ideia de contraste/concessão no início do texto?', visualEmoji: '📖', options: ['bastante', 'Embora', 'coberto', 'alegria'], correctIndex: 1, hint: 'Indica que algo aconteceu mesmo com a chuva!' },
      { id: '5pt-q2', prompt: 'Qual frase usa "MAS" (ideia de oposição, igual a "porém") corretamente?', visualEmoji: '🎀', options: ['Quero mas doces no pote.', 'Estudei muito, mas fiquei com sono.', 'Ela correu mas rápido hoje.', 'Temos mas livros na estante.'], correctIndex: 1, hint: 'Tente trocar por "porém". Se combinar, é MAS!' },
      { id: '5pt-q3', prompt: 'Assinale a frase com concordância verbal correta:', visualEmoji: '🎶', options: ['As estrelas brilha no céu.', 'Os passarinhos cantam de manhã.', 'As meninas chegou cedo.', 'Nós vai jogar agora.'], correctIndex: 1, hint: 'Sujeito no plural pede verbo no plural!' },
      { id: '5pt-q4', prompt: 'Na frase "O bolo estava delicioso!", a palavra "delicioso" é:', visualEmoji: '🎂', options: ['Verbo', 'Advérbio', 'Adjetivo', 'Pronome'], correctIndex: 2, hint: 'Descreve uma característica do bolo!' },
      { id: '5pt-q5', prompt: 'Qual é o antônimo de GENEROSO?', visualEmoji: '💝', options: ['BONDOSO', 'EGOÍSTA', 'CARINHOSO', 'ALEGRE'], correctIndex: 1, hint: 'Quem não gosta de compartilhar com os outros!' },
      { id: '5pt-q6', prompt: 'Quando usamos "MAIS" (com a letra I)?', visualEmoji: '➕', options: ['Para indicar oposição (porém)', 'Para indicar quantidade ou intensidade', 'Somente no início de perguntas', 'Para substituir nomes'], correctIndex: 1, hint: 'Pense no sinal de + (mais quantidade)!' },
      { id: '5pt-q7', prompt: 'Em "Ela falou calmamente", a palavra "calmamente" é um:', visualEmoji: '🕊️', options: ['Substantivo', 'Advérbio de modo', 'Pronome', 'Numeral'], correctIndex: 1, hint: 'Indica O MODO como ela falou!' },
      { id: '5pt-q8', prompt: 'Qual frase usa o "porquê / porque" corretamente em uma resposta?', visualEmoji: '💬', options: ['Acertei por que estudei.', 'Acertei porque estudei.', 'Acertei porquê estudei.', 'Acertei por quê estudei.'], correctIndex: 1, hint: 'Em respostas e explicações usamos junto e sem acento!' },
      { id: '5pt-q9', prompt: 'Qual alternativa apresenta apenas palavras escritas corretamente?', visualEmoji: '✨', options: ['Exceção e Pesquisa', 'Esceção e Pesquiza', 'Exessão e Pesquisa', 'Exceção e Pesquiza'], correctIndex: 0, hint: 'Exceção com XC e Ç; Pesquisa com S!' },
      { id: '5pt-q10', prompt: 'Na frase "As flores perfumadas enfeitam o jardim", o núcleo do sujeito é:', visualEmoji: '💐', options: ['perfumadas', 'flores', 'enfeitam', 'jardim'], correctIndex: 1, hint: 'De quem estamos falando que enfeita o jardim?' },
    ],
    ptBuilder: [
      { id: '5pt-b1', instruction: 'Complete com "mas" (porém) ou "mais" (quantidade):', clueEmoji: '🍓', mode: 'missing', prefix: 'Eu gosto de morango, ', suffix: ' hoje escolhi uva.', answer: 'mas', tiles: ['mas', 'mais', 'más', 'mal'], hint: 'Pode trocar por "porém"!' },
      { id: '5pt-b2', instruction: 'Substitua "Lucas e Bia":', clueEmoji: '👧👦', mode: 'missing', prefix: '', suffix: ' adoram jogos educativos.', answer: 'Eles', tiles: ['Ele', 'Ela', 'Eles', 'Eu'], hint: 'São duas pessoas no plural!' },
      { id: '5pt-b3', instruction: 'Monte a palavra com a grafia correta:', clueEmoji: '✨', mode: 'syllables', answer: 'EXCEÇÃO', targetSyllables: ['EX', 'CE', 'ÇÃO'], tiles: ['ÇÃO', 'EX', 'CE', 'SÃO'], hint: 'Começa com EX e termina com ÇÃO!' },
      { id: '5pt-b4', instruction: 'Complete a explicação:', clueEmoji: '💬', mode: 'missing', prefix: 'Acertei o desafio ', suffix: ' li com atenção!', answer: 'porque', tiles: ['porque', 'por que', 'por quê', 'porquê'], hint: 'Resposta junto e sem acento!' },
      { id: '5pt-b5', instruction: 'Complete a concordância:', clueEmoji: '🌟', mode: 'missing', prefix: 'Todas as crianças ', suffix: ' o troféu.', answer: 'ganharam', tiles: ['ganhou', 'ganharam', 'ganha', 'ganharei'], hint: '"Todas as crianças" pede verbo no plural!' },
      { id: '5pt-b6', instruction: 'Complete com "mais" (quantidade) ou "mas" (porém):', clueEmoji: '📚', mode: 'missing', prefix: 'Quero ler ', suffix: ' livros este ano!', answer: 'mais', tiles: ['mas', 'mais', 'más', 'mal'], hint: 'Indica maior quantidade!' },
      { id: '5pt-b7', instruction: 'Complete a pergunta inicial:', clueEmoji: '❓', mode: 'missing', prefix: '', suffix: ' o céu é azul?', answer: 'Por que', tiles: ['Porque', 'Por que', 'Porquê', 'Por quê'], hint: 'Pergunta no início da frase: separado e sem acento!' },
      { id: '5pt-b8', instruction: 'Monte o advérbio de modo:', clueEmoji: '🐢', mode: 'syllables', answer: 'DEVAGAR', targetSyllables: ['DE', 'VA', 'GAR'], tiles: ['GAR', 'DE', 'VA', 'RO'], hint: 'Como a tartaruga anda!' },
      { id: '5pt-b9', instruction: 'Complete a concordância:', clueEmoji: '🐦', mode: 'missing', prefix: 'Os pássaros ', suffix: ' bem alto.', answer: 'voam', tiles: ['voa', 'voam', 'voei', 'voava'], hint: '"Os pássaros" está no plural!' },
      { id: '5pt-b10', instruction: 'Complete com a grafia correta:', clueEmoji: '🔍', mode: 'missing', prefix: 'PESQUI', suffix: 'A', answer: 'S', tiles: ['S', 'Z', 'Ç', 'SS'], hint: 'PES-QUI-SA se escreve com S!' },
    ],
    ptTrueFalse: [
      { id: '5pt-tf1', statement: '"Mas" sem a letra I tem o mesmo sentido de "porém".', emoji: '🎀', isTrue: true, explanation: 'Certinho! Ex: Quero brincar, mas preciso estudar.' },
      { id: '5pt-tf2', statement: 'Em perguntas no início da frase, escrevemos "porque" tudo junto.', emoji: '❓', isTrue: false, explanation: 'No início de perguntas é separado: "Por que".' },
      { id: '5pt-tf3', statement: '"As meninas chegaram cedo" está com concordância correta.', emoji: '👧', isTrue: true, explanation: 'Sim! Sujeito plural e verbo no plural.' },
      { id: '5pt-tf4', statement: 'A palavra "mal" com L é o contrário de "bom".', emoji: '⚖️', isTrue: false, explanation: 'Mal (com L) é o contrário de BEM; mau (com U) é o contrário de BOM!' },
      { id: '5pt-tf5', statement: 'A palavra "felizmente" é um advérbio.', emoji: '✨', isTrue: true, explanation: 'Isso mesmo! Modifica o sentido da frase ou verbo.' },
      { id: '5pt-tf6', statement: 'A expressão "mais" indica soma ou quantidade.', emoji: '➕', isTrue: true, explanation: 'Sim! Ex: Quero mais frutas.' },
      { id: '5pt-tf7', statement: 'A frase "Nós vai ao cinema" está na norma padrão.', emoji: '🎬', isTrue: false, explanation: 'O correto é "Nós vamos ao cinema".' },
      { id: '5pt-tf8', statement: 'Exceção se escreve com XC e Ç.', emoji: '📝', isTrue: true, explanation: 'Correto! EX-CE-ÇÃO.' },
      { id: '5pt-tf9', statement: 'O antônimo de GENEROSO é BONDOSO.', emoji: '💝', isTrue: false, explanation: 'São sinônimos! O antônimo é EGOÍSTA.' },
      { id: '5pt-tf10', statement: 'Pronomes servem para substituir ou acompanhar substantivos.', emoji: '💬', isTrue: true, explanation: 'Exatamente! Ex: Eu, nós, ela, meu.' },
    ],
    ptMatchRounds: [
      [
        { id: '5pm-1', left: 'Mas (sem i)', right: 'Porém' },
        { id: '5pm-2', left: 'Mais (com i)', right: 'Quantidade' },
        { id: '5pm-3', left: 'Bem', right: 'Contrário de Mal' },
        { id: '5pm-4', left: 'Bom', right: 'Contrário de Mau' },
        { id: '5pm-5', left: 'Porque (junto)', right: 'Resposta' },
      ],
      [
        { id: '5pm-6', left: 'Por que (separado)', right: 'Pergunta' },
        { id: '5pm-7', left: 'Calmamente', right: 'Advérbio' },
        { id: '5pm-8', left: 'Delicioso', right: 'Adjetivo' },
        { id: '5pm-9', left: 'Estudar', right: 'Verbo' },
        { id: '5pm-10', left: 'Nós', right: 'Pronome' },
      ],
    ],
    matQuiz: [
      { id: '5mat-q1', prompt: 'Qual fração representa a parte colorida desta barrinha?', visualFraction: { numerator: 1, denominator: 4 }, options: ['1/2', '1/4', '2/4', '3/4'], correctIndex: 1, hint: 'Conte quantas partes estão pintadas (em cima) e o total (embaixo).' },
      { id: '5mat-q2', prompt: 'Quanto é 50% de 80 figurinhas?', visualEmoji: '🏷️', options: ['20', '30', '40', '50'], correctIndex: 2, hint: '50% é sempre a metade do total!' },
      { id: '5mat-q3', prompt: 'Um retângulo mede 6 cm de comprimento por 3 cm de largura. Qual é sua ÁREA?', visualEmoji: '📐', options: ['9 cm²', '12 cm²', '18 cm²', '24 cm²'], correctIndex: 2, hint: 'Multiplique comprimento × largura!' },
      { id: '5mat-q4', prompt: 'Qual fração colorida aparece abaixo?', visualFraction: { numerator: 3, denominator: 4 }, options: ['1/4', '2/3', '3/4', '4/3'], correctIndex: 2, hint: 'São 3 pedacinhos pintados de 4 no total!' },
      { id: '5mat-q5', prompt: 'Quanto é 25% de 100 estrelas?', visualEmoji: '⭐', options: ['20', '25', '50', '75'], correctIndex: 1, hint: '25% significa 25 partes de cada 100!' },
      { id: '5mat-q6', prompt: 'Qual fração representa a metade de uma barra?', visualFraction: { numerator: 1, denominator: 2 }, options: ['1/2', '1/3', '1/4', '2/4'], correctIndex: 0, hint: '1 parte pintada de 2 partes iguais!' },
      { id: '5mat-q7', prompt: 'Quanto é 10% de 200?', visualEmoji: '🍬', options: ['10', '20', '30', '40'], correctIndex: 1, hint: '10% é dividir o número por 10!' },
      { id: '5mat-q8', prompt: 'Qual é a área de um quadrado de lado 5 cm?', visualEmoji: '🟦', options: ['10 cm²', '20 cm²', '25 cm²', '30 cm²'], correctIndex: 2, hint: 'Área do quadrado: 5 × 5!' },
      { id: '5mat-q9', prompt: 'Quanto é 1,5 + 2,5?', visualEmoji: '🍰', options: ['3,0', '3,5', '4,0', '4,5'], correctIndex: 2, hint: '1 + 2 = 3, e meio + meio = 1 inteiro!' },
      { id: '5mat-q10', prompt: 'Quanto é 144 ÷ 12?', visualEmoji: '🔢', options: ['10', '11', '12', '13'], correctIndex: 2, hint: '12 × 12 = 144!' },
    ],
    matMatchRounds: [
      [
        { id: '5m-1', left: '1/2', right: '50%' },
        { id: '5m-2', left: '1/4', right: '25%' },
        { id: '5m-3', left: '3/4', right: '75%' },
        { id: '5m-4', left: '1 inteiro', right: '100%' },
        { id: '5m-5', left: '1/10', right: '10%' },
      ],
      [
        { id: '5m-6', left: 'Área 5×4', right: '20 cm²' },
        { id: '5m-7', left: '144 ÷ 12', right: '12' },
        { id: '5m-8', left: '50% de 60', right: '30' },
        { id: '5m-9', left: '2,5 + 2,5', right: '5,0' },
        { id: '5m-10', left: '25% de 40', right: '10' },
      ],
    ],
    matMissing: [
      { id: '5mm-1', instruction: 'Complete a porcentagem:', emoji: '⭐', parts: ['50%', 'de', '100', '=', '?'], answer: '50', options: ['25', '50', '75', '100'], hint: 'Metade de 100!' },
      { id: '5mm-2', instruction: 'Complete a soma decimal:', emoji: '🍰', parts: ['1,5', '+', '?', '=', '3,0'], answer: '1,5', options: ['0,5', '1,0', '1,5', '2,0'], hint: '1,5 + 1,5 = 3!' },
      { id: '5mm-3', instruction: 'Complete a área do retângulo:', emoji: '📐', parts: ['8', '×', '?', '=', '40'], answer: '5', options: ['4', '5', '6', '8'], hint: '8 vezes quanto dá 40?' },
      { id: '5mm-4', instruction: 'Complete a fração equivalente a 1 inteiro:', emoji: '🍫', parts: ['3/4', '+', '?', '=', '4/4'], answer: '1/4', options: ['1/4', '2/4', '3/4', '1/2'], hint: 'De 3 quartos para 4 quartos falta...' },
      { id: '5mm-5', instruction: 'Complete a porcentagem:', emoji: '🏷️', parts: ['10%', 'de', '300', '=', '?'], answer: '30', options: ['10', '20', '30', '50'], hint: 'Divida 300 por 10!' },
      { id: '5mm-6', instruction: 'Complete a divisão:', emoji: '🔢', parts: ['120', '÷', '?', '=', '12'], answer: '10', options: ['10', '12', '15', '20'], hint: '10 × 12 = 120!' },
      { id: '5mm-7', instruction: 'Complete a porcentagem:', emoji: '🍬', parts: ['25%', 'de', '40', '=', '?'], answer: '10', options: ['5', '10', '15', '20'], hint: '25% é dividir por 4 (40 ÷ 4)!' },
      { id: '5mm-8', instruction: 'Complete a sequência decimal:', emoji: '🎈', parts: ['0,5,', '1,0,', '1,5,', '?'], answer: '2,0', options: ['1,8', '2,0', '2,5', '3,0'], hint: 'Somando de meio em meio (0,5)!' },
      { id: '5mm-9', instruction: 'Complete a multiplicação:', emoji: '🧁', parts: ['15', '×', '4', '=', '?'], answer: '60', options: ['45', '50', '60', '75'], hint: '15 + 15 = 30, e 30 + 30 = ...' },
      { id: '5mm-10', instruction: 'Complete a fração:', emoji: '🎀', parts: ['1/2', '+', '1/2', '=', '?'], answer: '1', options: ['1/4', '1/2', '1', '2'], hint: 'Duas metades formam 1 inteiro!' },
    ],
    matCompare: [
      { id: '5mc-1', leftLabel: '1/2', rightLabel: '50%', emoji: '🍰', correctSymbol: '=', hint: '1/2 é exatamente a metade, igual a 50%!' },
      { id: '5mc-2', leftLabel: '3/4', rightLabel: '1/4', emoji: '🍫', correctSymbol: '>', hint: '3 pedaços é maior que 1 pedaço!' },
      { id: '5mc-3', leftLabel: '25% de 100', rightLabel: '40', emoji: '⭐', correctSymbol: '<', hint: '25% de 100 é 25, menor que 40.' },
      { id: '5mc-4', leftLabel: '2,5 + 2,5', rightLabel: '5', emoji: '🧁', correctSymbol: '=', hint: '2,5 + 2,5 = 5,0!' },
      { id: '5mc-5', leftLabel: 'Área 6×4', rightLabel: '20 cm²', emoji: '📐', correctSymbol: '>', hint: '6 × 4 = 24 cm², maior que 20 cm²!' },
      { id: '5mc-6', leftLabel: '10% de 80', rightLabel: '12', emoji: '🏷️', correctSymbol: '<', hint: '10% de 80 é 8, menor que 12.' },
      { id: '5mc-7', leftLabel: '50% de 90', rightLabel: '45', emoji: '🍬', correctSymbol: '=', hint: 'Metade de 90 é exatamente 45!' },
      { id: '5mc-8', leftLabel: '3,8', rightLabel: '3,2', emoji: '🎈', correctSymbol: '>', hint: '3,8 é maior que 3,2!' },
      { id: '5mc-9', leftLabel: '1/4', rightLabel: '1/2', emoji: '🍓', correctSymbol: '<', hint: 'Um quarto (25%) é menor que a metade (50%)!' },
      { id: '5mc-10', leftLabel: '100 ÷ 4', rightLabel: '25', emoji: '🎀', correctSymbol: '=', hint: '100 dividido por 4 dá 25!' },
    ],
  },
];
