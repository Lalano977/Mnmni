export type GameType = 'butterfly' | 'grasshopper';

export type InteractionType =
  | 'observation'
  | 'feeding'
  | 'molting'
  | 'physical'
  | 'weaving'
  | 'protection'
  | 'symmetry_drawing'
  | 'puzzle'
  | 'anatomy'
  | 'music'
  | 'comparison';

export interface PageDefinition {
  pageNumber: number; // 1 to 20
  game: GameType;
  title: string;
  stageName: string;
  subtitle: string;
  learningGoal: string;
  interactionType: InteractionType;
  physicalChallenge?: {
    actionName: string;
    instructions: string;
    targetRepetitions: number;
  };
  scientificFact: string;
}

export interface StudentProgress {
  studentName: string;
  completedPages: number[];
  stars: number;
  score: number;
  badges: string[];
  drawings: { [pageNumber: number]: string };
  startTime: number;
}
