export interface Question {
    question: string;
    options: string[];
    correctAnswers: string[];
    imageUrl?: string | null;
    imageWidth?: number | null; // en pourcentage (0-100)
    code?: string | null; // contenu de code brut
    codeLanguage?: string | null; // ex: 'ts', 'js', 'python'
}