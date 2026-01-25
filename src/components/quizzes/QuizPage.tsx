import React, { useState, useEffect } from 'react';
import Quiz from './Quiz.tsx';
import '../../App.css';
import Menu from "../Menu.tsx";
import { useLocation } from 'react-router';
import { Question } from '../../types/Question.ts';

const QuizPage: React.FC = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialStep = searchParams.get('step') ? parseInt(searchParams.get('step')!) : 1;
    const [step, setStep] = useState<number>(initialStep);
    const [importedQuestions, setImportedQuestions] = useState<Question[] | null>(null);

    useEffect(() => {
        // Vérifier si des questions ont été importées
        const stored = localStorage.getItem('importedQuestions');
        if (stored) {
            try {
                const questions = JSON.parse(stored);
                setImportedQuestions(questions);
                localStorage.removeItem('importedQuestions'); // Nettoyer après récupération
            } catch (error) {
                console.error('Erreur lors du chargement des questions importées:', error);
            }
        }
    }, []);

    const showStep = (step: number) => {
        setStep(step);
    };

    return (
        <div className="App">
            <Menu />
            <h1>Quiz Runner</h1>
            <Quiz step={step} showStep={showStep} importedQuestions={importedQuestions} />
        </div>
    );
};

export default QuizPage;