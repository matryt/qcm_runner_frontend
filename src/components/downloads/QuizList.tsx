import React, { useEffect, useState } from 'react';
import { get_quizzes_by_subject_id, get_all_quizzes } from '../../services/apiFetcher';
import { useAuth } from "../../utils/AuthContext";
import { useNavigate } from 'react-router';
import { parseQuestionsAuto } from '../../utils/quizParsers';
import { validateCSVFormat } from '../../utils/csvHandler';

interface QuizListProps {
    subjectId: string;
    subjects: Subject[];
}

interface Quiz {
    id: string,
    subject_id: string,
    name: string,
    url: string,
    creation_time: string
}

interface Subject {
    id: string,
    name: string
}

const QuizList: React.FC<QuizListProps> = ({ subjectId, subjects }) => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const { token } = useAuth();
    const navigate = useNavigate();

    const handleDirectImport = async (quizUrl: string) => {
        try {
            const response = await fetch(quizUrl);
            if (!response.ok) {
                throw new Error('Erreur lors du téléchargement du fichier');
            }
            const text = await response.text();
            const fileName = quizUrl.split('/').pop() || '';
            const lower = fileName.toLowerCase();
            
            let questions;
            if (lower.endsWith('.csv')) {
                questions = validateCSVFormat(text);
            } else if (lower.endsWith('.json') || lower.endsWith('.yaml') || lower.endsWith('.yml')) {
                questions = await parseQuestionsAuto(text, fileName);
            } else {
                throw new Error('Format de fichier non supporté');
            }
            
            // Stocker les questions dans le localStorage pour les récupérer dans QuizPage
            localStorage.setItem('importedQuestions', JSON.stringify(questions));
            // Naviguer vers la page de quiz avec un paramètre pour indiquer l'étape 2
            navigate('/quiz?step=2');
        } catch (error) {
            alert(`Erreur lors de l'import: ${(error as Error).message}`);
        }
    };

    useEffect(() => {
        const fetchQuizzes = async () => {
            if (token) {
                let quizzes;
                if (subjectId) {
                    quizzes = await get_quizzes_by_subject_id(token, subjectId);
                } else {
                    quizzes = await get_all_quizzes(token);
                }
                setQuizzes(quizzes);
            }
        };
        fetchQuizzes();
    }, [subjectId, token]);

    return (
        <table>
            <thead>
            <tr>
                <th>Nom</th>
                <th>Matière</th>
                <th>Import</th>
            </tr>
            </thead>
            <tbody>
            {quizzes.map((quiz) => (
                <tr key={quiz.id}>
                    <td>{quiz.name}</td>
                    <td>{subjects.find(subject => subject.id === quiz.subject_id)?.name}</td>
                    <td><button onClick={() => handleDirectImport(quiz.url)}>Importer</button></td>
                </tr>
            ))}
            {quizzes.length === 0 && (
                <tr>
                    <td colSpan={3}>Aucun quiz trouvé</td>
                </tr>)
            }
            </tbody>
        </table>
    );
};

export default QuizList;