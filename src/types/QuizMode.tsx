export type QuizMode = 'practice' | 'exam';

export interface QuizConfig {
    mode: QuizMode;
    timeLimitMinutes: number | null; // null = pas de limite
}