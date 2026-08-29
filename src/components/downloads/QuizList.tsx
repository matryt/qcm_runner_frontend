import React, { useEffect, useState, useMemo } from 'react';
import { get_quizzes_by_subject_id, get_all_quizzes } from '../../services/apiFetcher';
import { useAuth } from '../../utils/AuthContext';
import { useNavigate } from 'react-router';
import { parseQuestionsAuto } from '../../utils/quizParsers';
import { validateCSVFormat } from '../../utils/csvHandler';

interface QuizListProps {
    subjectId: string;
    subjects: Subject[];
    searchTerm: string;
}

interface Quiz {
    id: string;
    subject_id: string;
    name: string;
    url: string;
    creation_time: string;
}

interface Subject {
    id: string;
    name: string;
}

const QuizList: React.FC<QuizListProps> = ({ subjectId, subjects, searchTerm }) => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [importingId, setImportingId] = useState<string | null>(null);
    const { token } = useAuth();
    const navigate = useNavigate();

    const handleDirectImport = async (quiz: Quiz) => {
        try {
            setImportingId(quiz.id);
            const response = await fetch(quiz.url);
            if (!response.ok) {
                throw new Error('Erreur lors du téléchargement du fichier distant');
            }
            const text = await response.text();
            const fileName = quiz.url.split('/').pop() || '';
            const lower = fileName.toLowerCase();
            
            let questions;
            if (lower.endsWith('.csv')) {
                questions = validateCSVFormat(text);
            } else if (lower.endsWith('.json') || lower.endsWith('.yaml') || lower.endsWith('.yml')) {
                questions = await parseQuestionsAuto(text, fileName);
            } else {
                throw new Error('Format de fichier non supporté');
            }
            
            localStorage.setItem('importedQuestions', JSON.stringify(questions));
            navigate('/quiz?step=2');
        } catch (error) {
            alert(`Erreur lors du lancement : ${(error as Error).message}`);
        } finally {
            setImportingId(null);
        }
    };

    useEffect(() => {
        const fetchQuizzes = async () => {
            if (!token) return;
            setLoading(true);
            try {
                let data;
                if (subjectId) {
                    data = await get_quizzes_by_subject_id(token, subjectId);
                } else {
                    data = await get_all_quizzes(token);
                }
                setQuizzes(data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, [subjectId, token]);

    const filteredQuizzes = useMemo(() => {
        return quizzes.filter(q => 
            q.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [quizzes, searchTerm]);

    const getFileFormatBadge = (url: string) => {
        const ext = url.split('.').pop()?.toUpperCase() || 'FILE';
        return ext;
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner" />
                <p>Chargement des quiz disponibles...</p>
            </div>
        );
    }

    if (filteredQuizzes.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">📂</div>
                <h3>Aucun quiz trouvé</h3>
                <p>Essayez de modifier vos critères de recherche ou de matière.</p>
            </div>
        );
    }

    return (
        <div className="quizzes-grid">
            {filteredQuizzes.map((quiz) => {
                const subjectName = subjects.find(s => s.id === quiz.subject_id)?.name || 'Général';
                const format = getFileFormatBadge(quiz.url);
                const isImporting = importingId === quiz.id;

                return (
                    <div key={quiz.id} className="quiz-card">
                        <div className="quiz-card-header">
                            <span className="quiz-subject-badge">{subjectName}</span>
                            <span className="quiz-format-badge">{format}</span>
                        </div>

                        <h3 className="quiz-card-title">{quiz.name}</h3>

                        <div className="quiz-card-footer">
                            <button 
                                type="button"
                                className="launch-quiz-button"
                                onClick={() => handleDirectImport(quiz)}
                                disabled={isImporting}
                            >
                                {isImporting ? 'Chargement...' : 'Commencer →'}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default QuizList;