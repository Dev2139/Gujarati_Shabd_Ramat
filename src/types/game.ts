export interface Word {
  id: string;
  text: string;
  team: 'A' | 'B';
  isValid: boolean;
  isDuplicate: boolean;
  timestamp: number;
}

export interface Team {
  id: 'A' | 'B';
  name: string;
  letter: string;
  score: number;
  words: Word[];
}

export interface GameState {
  isPlaying: boolean;
  currentTeam: 'A' | 'B' | null;
  teams: {
    A: Team;
    B: Team;
  };
  winner: 'A' | 'B' | 'tie' | null;
  isListening: boolean;
  speakingTeam: 'A' | 'B' | null;
}

export type GameMode = 'single' | 'multiplayer';

export interface GameSetup {
  letterA: string;
  letterB: string;
}
