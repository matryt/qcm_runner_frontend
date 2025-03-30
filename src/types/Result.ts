export interface Result {
    question: string;
    correct: boolean;
    partial?: boolean;
    selectedOptions: string[];
    correctAnswers: string[];
}