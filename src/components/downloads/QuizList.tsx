import React, { useEffect, useState } from 'react';
import { get_quizzes_by_subject_id, get_all_quizzes } from '../../services/apiFetcher';
import { useAuth } from "../../utils/AuthContext";

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
                <th>URL</th>
            </tr>
            </thead>
            <tbody>
            {quizzes.map((quiz) => (
                <tr key={quiz.id}>
                    <td>{quiz.name}</td>
                    <td>{subjects.find(subject => subject.id === quiz.subject_id)?.name}</td>
                    <td><a href={quiz.url} target="_blank" rel="noreferrer noopener"><button>Aller au fichier</button></a></td>
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