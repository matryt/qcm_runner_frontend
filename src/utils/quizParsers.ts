import { Question } from "../types/Question.ts";

type ResponseItem = { text: string; isCorrect: boolean };

type QuestionAuthoringV1 = {
    question: string;
    options: string[];
    correctAnswers: string[];
    imageUrl?: string | null;
    imageWidth?: number | null;
    code?: string | null;
    codeLanguage?: string | null;
};

type QuestionAuthoringV2 = {
    question: string;
    responses: ResponseItem[];
    imageUrl?: string | null;
    imageWidth?: number | null;
    code?: string | null;
    codeLanguage?: string | null;
};

type AuthoringQuestion = QuestionAuthoringV1 | QuestionAuthoringV2;

function normalizeAuthoringQuestion(q: AuthoringQuestion): Question {
    if ((q as QuestionAuthoringV2).responses) {
        const v2 = q as QuestionAuthoringV2;
        const options = v2.responses.map(r => r.text);
        const correctAnswers = v2.responses.filter(r => r.isCorrect).map(r => r.text);
        return {
            question: v2.question,
            options,
            correctAnswers,
            imageUrl: v2.imageUrl ?? null,
            imageWidth: v2.imageWidth ?? null,
            code: v2.code ?? null,
            codeLanguage: v2.codeLanguage ?? null
        };
    }
    const v1 = q as QuestionAuthoringV1;
    return {
        question: v1.question,
        options: v1.options,
        correctAnswers: v1.correctAnswers,
        imageUrl: v1.imageUrl ?? null,
        imageWidth: v1.imageWidth ?? null,
        code: v1.code ?? null,
        codeLanguage: v1.codeLanguage ?? null
    };
}

function validateQuestions(questions: Question[]): void {
    const errors: string[] = [];
    questions.forEach((q, index) => {
        if (!q.question || q.question.trim().length < 3) {
            errors.push(`Question ${index + 1}: Question trop courte`);
        }
        if (!Array.isArray(q.options) || q.options.length < 2) {
            errors.push(`Question ${index + 1}: Il faut au moins 2 options de réponse`);
        }
        const uniqueOptions = new Set(q.options);
        if (uniqueOptions.size !== q.options.length) {
            errors.push(`Question ${index + 1}: Options en double détectées`);
        }
        if (!Array.isArray(q.correctAnswers) || q.correctAnswers.length < 1) {
            errors.push(`Question ${index + 1}: Aucune réponse correcte spécifiée`);
        }
        q.correctAnswers.forEach(ans => {
            if (!q.options.includes(ans)) {
                errors.push(`Question ${index + 1}: La réponse correcte "${ans}" ne correspond à aucune option`);
            }
        });
        if (q.imageWidth != null) {
            if (typeof q.imageWidth !== 'number' || isNaN(q.imageWidth) || q.imageWidth < 0 || q.imageWidth > 100) {
                errors.push(`Question ${index + 1}: imageWidth doit être un nombre entre 0 et 100`);
            }
        }
        if (q.code && q.imageUrl) {
            errors.push(`Question ${index + 1}: 'code' et 'imageUrl' ne doivent pas être utilisés en même temps`);
        }
    });
    if (errors.length > 0) {
        throw new Error('Erreurs de format détectées:\n' + errors.join('\n'));
    }
}

export function parseQuestionsFromJson(text: string): Question[] {
    let data: unknown;
    try {
        data = JSON.parse(text);
    } catch (e) {
        throw new Error("JSON invalide");
    }
    if (!Array.isArray(data)) {
        throw new Error("Le fichier JSON doit contenir un tableau de questions");
    }
    const normalized = (data as AuthoringQuestion[]).map(normalizeAuthoringQuestion);
    validateQuestions(normalized);
    return normalized;
}

export async function parseQuestionsFromYaml(text: string): Promise<Question[]> {
    // Import dynamique pour éviter d'ajouter le poids si non utilisé au runtime
    const { load } = await import('js-yaml');
    let data: unknown;
    try {
        data = load(text);
    } catch (e) {
        throw new Error("YAML invalide");
    }
    if (!Array.isArray(data)) {
        throw new Error("Le fichier YAML doit contenir un tableau de questions");
    }
    const normalized = (data as AuthoringQuestion[]).map(normalizeAuthoringQuestion);
    validateQuestions(normalized);
    return normalized;
}

export async function parseQuestionsAuto(text: string, filename: string): Promise<Question[]> {
    const lower = filename.toLowerCase();
    if (lower.endsWith('.json')) {
        return parseQuestionsFromJson(text);
    }
    if (lower.endsWith('.yaml') || lower.endsWith('.yml')) {
        return parseQuestionsFromYaml(text);
    }
    throw new Error('Extension de fichier non supportée');
}


