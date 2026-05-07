export enum GameStage {
  INTRO = 'INTRO',
  INVESTIGATION = 'INVESTIGATION',
  VERDICT = 'VERDICT',
  FINALE = 'FINALE'
}

export interface Clue {
  id: string;
  title: string;
  description: string;
  category: 'PHYSICAL' | 'DOCUMENT' | 'WITNESS';
  found: boolean;
  content: string;
  ethicsViolation?: string; // 关联的伦理违规项描述
}

export interface EthicalPrinciple {
  id: string;
  title: string;
  description: string;
}

export interface Party {
  id: string;
  name: string;
  role: string;
  description: string;
  faultLevel: 0 | 1 | 2 | 3;
  ethicsAnalysis: string; // 伦理层面的具体分析
}

export interface GameState {
  stage: GameStage;
  foundClues: string[];
  currentScene: string;
  messages: Array<{ role: 'user' | 'assistant', content: string }>;
}
