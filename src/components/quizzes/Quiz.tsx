import React, { useState, useEffect } from 'react';
import { validateCSVFormat } from '../../utils/csvHandler.ts';
import { parseQuestionsAuto } from '../../utils/quizParsers.ts';
import Step1 from "./quizSteps/Step1.tsx";
import Step2 from "./quizSteps/Step2.tsx";
import Step3 from "./quizSteps/Step3.tsx";
import Step4 from "./quizSteps/Step4.tsx";
import './Quiz.css';
import { Question } from "../../types/Question.ts";
import { Result } from '../../types/Result.ts';
import { QuizConfig } from '../../types/QuizMode.ts';
import QuestionNavToggle from './QuestionNavToggle.tsx';

interface QuizProps {
    step: number;
    showStep: (step: number) => void;
    importedQuestions?: Question[] | null;
}

const shuffleArray = <T,>(items: T[]): T[] => {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const shuffleQuestionOptions = (questions: Question[]): Question[] => {
    return questions.map((question) => ({
        ...question,
        options: shuffleArray(question.options),
    }));
};

const Quiz: React.FC<QuizProps> = ({ step, showStep, importedQuestions }) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [results, setResults] = useState<Result[]>([]);
    const [fileStatus, setFileStatus] = useState<string>('');
    const [errors, setErrors] = useState<string>('');
    const [feedback, setFeedback] = useState<string>('');
    const [score, setScore] = useState<number>(0);
    const [submittedStates, setSubmittedStates] = useState<boolean[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<string[][]>([]);
    const [correctResponses, setCorrectResponses] = useState<string[]>([]);
    
    // Configuration du mode
    const [quizConfig, setQuizConfig] = useState<QuizConfig>({
        mode: 'practice',
        timeLimitMinutes: null
    });

    useEffect(() => {
        if (importedQuestions && importedQuestions.length > 0) {
            const shuffled = shuffleQuestionOptions(importedQuestions);
            setQuestions(shuffled);
            setSubmittedStates(Array(shuffled.length).fill(false));
            setSelectedOptions(Array(shuffled.length).fill([]));
        }
    }, [importedQuestions]);

    const resetState = () => {
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setResults([]);
        setFileStatus('');
        setErrors('');
        setFeedback('');
        setScore(0);
        setSubmittedStates([]);
        setSelectedOptions([]);
        setCorrectResponses([]);
    };

    const handleFileImport = (file: File): boolean => {
        setFileStatus('');
        setErrors('');
        if (!file) {
            alert('Veuillez sélectionner un fichier');
            return false;
        }

        const reader = new FileReader();
        reader.onload = async function (event) {
            try {
                const text = event.target!.result as string;
                let parsed: Question[];
                const lower = file.name.toLowerCase();
                
                if (lower.endsWith('.csv')) {
                    parsed = validateCSVFormat(text);
                } else if (lower.endsWith('.json') || lower.endsWith('.yaml') || lower.endsWith('.yml')) {
                    parsed = await parseQuestionsAuto(text, file.name);
                } else {
                    setFileStatus('✗ Extension de fichier incorrecte');
                    return;
                }

                const shuffled = shuffleQuestionOptions(parsed);
                setQuestions(shuffled);
                setSubmittedStates(Array(shuffled.length).fill(false));
                setSelectedOptions(Array(shuffled.length).fill([]));
                showStep(2);
            } catch (error) {
                setErrors(`✗ ${(error as Error).message}`);
            }
        };

        reader.onerror = function () {
            setErrors('✗ Erreur lors de la lecture du fichier');
        };

        resetState();
        reader.readAsText(file);
        return true;
    };

    const handleToggleOption = (option: string) => {
        const currentQuestion = questions[currentQuestionIndex];
        const isMultiple = currentQuestion.correctAnswers.length > 1;
        const currentList = selectedOptions[currentQuestionIndex] || [];

        let updatedList: string[];
        if (isMultiple || quizConfig.mode === 'exam') {
            updatedList = currentList.includes(option)
                ? currentList.filter(o => o !== option)
                : [...currentList, option];
        } else {
            updatedList = [option];
        }

        setSelectedOptions(prev => {
            const next = [...prev];
            next[currentQuestionIndex] = updatedList;
            return next;
        });
    };

    // Fonction pour extraire et rejouer uniquement les questions ratées ou partielles
    const handleRetryErrors = () => {
        const errorQuestions: Question[] = [];

        results.forEach((res, index) => {
            if (!res.correct && questions[index]) {
                errorQuestions.push(questions[index]);
            }
        });

        if (errorQuestions.length === 0) return;

        // Réinitialise avec seulement les questions échouées
        const shuffled = shuffleQuestionOptions(errorQuestions);
        setQuestions(shuffled);
        setCurrentQuestionIndex(0);
        setResults([]);
        setFeedback('');
        setScore(0);
        setSubmittedStates(Array(shuffled.length).fill(false));
        setSelectedOptions(Array(shuffled.length).fill([]));
        setCorrectResponses([]);
        
        // Repasse automatiquement en mode entraînement pour la révision
        setQuizConfig(prev => ({ ...prev, mode: 'practice', timeLimitMinutes: null }));
        
        // Relance directement à l'étape du quiz
        showStep(3);
    };

    const showPreviousQuestion = () => {
        if (quizConfig.mode === 'exam') return; // Bloqué en mode examen
        setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        setFeedback('');
        setCorrectResponses([]);
    };

    const showNextQuestion = () => {
        setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
        setFeedback('');
        setCorrectResponses([]);
    };

    const submitAnswer = () => {
        const currentSelected = selectedOptions[currentQuestionIndex] || [];
        if (currentSelected.length === 0) return;

        const currentQuestion = questions[currentQuestionIndex];
        const correctAnswers = currentQuestion.correctAnswers;
        const isCorrect = currentSelected.every(opt => correctAnswers.includes(opt)) && currentSelected.length === correctAnswers.length;
        const isPartial = currentSelected.some(opt => correctAnswers.includes(opt)) && !isCorrect;

        setResults(prevResults => {
            const newResults = [...prevResults];
            newResults[currentQuestionIndex] = { 
                question: currentQuestion.question, 
                correct: isCorrect, 
                partial: isPartial, 
                selectedOptions: currentSelected, 
                correctAnswers 
            };
            return newResults;
        });

        let questionScore = 0;
        if (isCorrect) {
            questionScore = 1;
            setFeedback('Correct!');
            setCorrectResponses([]);
        } else if (isPartial) {
            const correctCount = currentSelected.filter(opt => correctAnswers.includes(opt)).length;
            const incorrectCount = currentSelected.filter(opt => !correctAnswers.includes(opt)).length;
            questionScore = (correctCount / correctAnswers.length) - (incorrectCount * 0.25);
            setFeedback('Partiellement correct');
            setCorrectResponses(correctAnswers);
        } else {
            questionScore = -0.5 * currentSelected.length;
            setFeedback('Faux');
            setCorrectResponses(correctAnswers);
        }

        setScore(prev => prev + Math.max(questionScore, 0));
        setSubmittedStates(prev => {
            const next = [...prev];
            next[currentQuestionIndex] = true;
            return next;
        });

        // En mode examen, avancer directement à la question suivante
        if (quizConfig.mode === 'exam') {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                finish();
            }
        }
    };

    const finish = () => {
        // En mode examen, calculer les résultats des questions non répondues si le temps a expiré
        if (quizConfig.mode === 'exam') {
            setResults(prevResults => {
                const finalResults = [...prevResults];
                questions.forEach((q, idx) => {
                    if (!finalResults[idx]) {
                        finalResults[idx] = {
                            question: q.question,
                            correct: false,
                            partial: false,
                            selectedOptions: selectedOptions[idx] || [],
                            correctAnswers: q.correctAnswers
                        };
                    }
                });
                return finalResults;
            });
        }
        showStep(4);
    };

    return (
        <div className="quiz-page">
            {step === 1 && (
                <Step1 
                    handleFileUpload={handleFileImport} 
                    fileStatus={fileStatus} 
                    showStep={showStep} 
                    errors={errors} 
                />
            )}
            {step === 2 && (
                <Step2 
                    showStep={showStep} 
                    questions={questions} 
                    quizConfig={quizConfig} 
                    setQuizConfig={setQuizConfig} 
                />
            )}
            {step === 3 && (
                <>
                    <Step3 
                        showPreviousQuestion={showPreviousQuestion} 
                        showNextQuestion={showNextQuestion}
                        submitAnswer={submitAnswer} 
                        finish={finish} 
                        questions={questions}
                        currentQuestionIndex={currentQuestionIndex} 
                        feedback={feedback}
                        submittedStates={submittedStates} 
                        selectedOptions={selectedOptions}
                        correctResponses={correctResponses} 
                        onToggleOption={handleToggleOption}
                        quizConfig={quizConfig}
                    />
                    {quizConfig.mode === 'practice' && (
                        <div className="score">Score : {score}/{questions.length}</div>
                    )}
                    {quizConfig.mode === 'practice' && (
                        <QuestionNavToggle
                            questions={questions}
                            setCurrentQuestionIndex={setCurrentQuestionIndex}
                            results={results}
                            currentQuestionIndex={currentQuestionIndex}
                        />
                    )}
                </>
            )}
            {step === 4 && (
                <Step4 
                    showStep={showStep} 
                    results={results} 
                    nb={questions.length} 
                    score={score} 
                    onRetryErrors={handleRetryErrors}
                />
            )}
        </div>
    );
};

export default Quiz;