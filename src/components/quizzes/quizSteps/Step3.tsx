import React, { useEffect, useState } from 'react';
import CodeBlock from '../../common/CodeBlock.tsx';
import { Question } from "../../../types/Question.ts";
import MathText from '../../common/MathText.tsx';
import KeyboardShortcutsHelp from '../../common/KeyboardShortcutsHelp.tsx';
import { QuizConfig } from '../../../types/QuizMode.ts';
import './Step3.css';

interface Step3Props {
    showPreviousQuestion: () => void;
    showNextQuestion: () => void;
    submitAnswer: () => void;
    finish: () => void;
    questions: Question[];
    currentQuestionIndex: number;
    feedback: string;
    submittedStates: boolean[];
    selectedOptions: string[][];
    onToggleOption: (option: string) => void;
    correctResponses?: string[];
    quizConfig: QuizConfig;
}

const Step3: React.FC<Step3Props> = ({
    showPreviousQuestion,
    showNextQuestion,
    submitAnswer,
    finish,
    questions,
    currentQuestionIndex,
    feedback,
    submittedStates,
    selectedOptions,
    onToggleOption,
    correctResponses,
    quizConfig
}) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCurrentSubmitted = submittedStates[currentQuestionIndex] ?? false;
    const currentSelected = selectedOptions[currentQuestionIndex] ?? [];
    const isMultiple = currentQuestion.correctAnswers.length > 1;
    const isExam = quizConfig.mode === 'exam';

    // Gestion du compte à rebours
    const [timeLeft, setTimeLeft] = useState<number | null>(() => 
        quizConfig.timeLimitMinutes ? quizConfig.timeLimitMinutes * 60 : null
    );

    useEffect(() => {
        if (timeLeft === null) return;
        if (timeLeft <= 0) {
            finish();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => (prev !== null ? prev - 1 : null));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, finish]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Raccourcis clavier
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement;
            if (target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'text') return;
            if (target.tagName === 'TEXTAREA') return;

            const keyToNumber: Record<string, number> = {
                '1': 0, '&': 0,
                '2': 1, 'é': 1,
                '3': 2, '"': 2,
                '4': 3, '\'': 3,
                '5': 4, '(': 4,
                '6': 5, '-': 5,
                '7': 6, 'è': 6,
                '8': 7, '_': 7,
                '9': 8, 'ç': 8,
            };

            if (event.key in keyToNumber && !isCurrentSubmitted) {
                const optionIndex = keyToNumber[event.key];
                if (optionIndex < currentQuestion.options.length) {
                    event.preventDefault();
                    onToggleOption(currentQuestion.options[optionIndex]);
                }
                return;
            }

            if (!isExam && event.key === 'ArrowLeft' && currentQuestionIndex > 0) {
                event.preventDefault();
                showPreviousQuestion();
            } else if (event.key === 'ArrowRight' && currentQuestionIndex < questions.length - 1) {
                event.preventDefault();
                showNextQuestion();
            } else if (event.key === 'Enter' && !isCurrentSubmitted && currentSelected.length > 0) {
                event.preventDefault();
                submitAnswer();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [
        currentQuestion, 
        currentQuestionIndex, 
        isCurrentSubmitted, 
        currentSelected, 
        questions.length, 
        onToggleOption, 
        showPreviousQuestion, 
        showNextQuestion, 
        submitAnswer,
        isExam
    ]);

    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    return (
        <div className="step-container step3-container">
            <div className="question-header">
                <div className="question-header-top">
                    <div className="question-counter">
                        Question {currentQuestionIndex + 1} / {questions.length}
                    </div>
                    {timeLeft !== null && (
                        <div className={`quiz-timer ${timeLeft < 60 ? 'timer-warning' : ''}`}>
                            ⏱️ {formatTime(timeLeft)}
                        </div>
                    )}
                </div>
                <div className="question-progress-bar">
                    <div 
                        className="question-progress-fill"
                        style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>
            </div>

            <div className="question-content">
                <h3 className="question-title">
                    <MathText text={currentQuestion.question} />
                </h3>
                
                {!isExam && isMultiple && (
                    <div className="info-badge">
                        <span className="info-icon">ℹ️</span>
                        Plusieurs réponses correctes possibles
                    </div>
                )}
                
                <div id="imageAndAnswers">
                    {currentQuestion.code ? (
                        <div style={{ maxWidth: '550px' }}>
                            <CodeBlock 
                                code={currentQuestion.code} 
                                language={currentQuestion.codeLanguage || 'tsx'} 
                            />
                        </div>
                    ) : currentQuestion.imageUrl && (
                        <img
                            src={currentQuestion.imageUrl}
                            alt="Question"
                            id="imgQuestion"
                            style={currentQuestion.imageWidth != null ? { width: `${currentQuestion.imageWidth}%` } : undefined}
                        />
                    )}

                    <ul className="options-list">
                        {currentQuestion.options.map((option: string, index: number) => {
                            const isChecked = currentSelected.includes(option);
                            const optionId = `q${currentQuestionIndex}-opt-${index}`;

                            return (
                                <li 
                                    key={option} 
                                    className={`option-item ${isChecked ? 'selected' : ''} ${isCurrentSubmitted ? 'disabled' : ''}`}
                                >
                                    <input 
                                        type={isExam || isMultiple ? 'checkbox' : 'radio'} 
                                        name={`question-${currentQuestionIndex}`}
                                        value={option} 
                                        id={optionId} 
                                        disabled={isCurrentSubmitted} 
                                        checked={isChecked}
                                        onChange={() => onToggleOption(option)}
                                    />
                                    <label htmlFor={optionId} className="option-label">
                                        <span className={`option-checkbox ${!isMultiple && !isExam ? 'radio-style' : ''}`} />
                                        <span className="option-text">
                                            <MathText text={option} />
                                        </span>
                                        <span className="shortcut-hint">{index + 1}</span>
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            <div className="navigation-buttons">
                {!isExam && (
                    <button 
                        type="button"
                        className="nav-button secondary-button" 
                        onClick={showPreviousQuestion} 
                        disabled={currentQuestionIndex === 0}
                    >
                        ← Précédent
                    </button>
                )}

                {/* En mode Examen, valider passe automatiquement à la question suivante */}
                <button 
                    type="button"
                    className="nav-button primary-button" 
                    onClick={submitAnswer} 
                    disabled={isCurrentSubmitted || currentSelected.length === 0}
                >
                    {isExam 
                        ? (isLastQuestion ? '✓ Terminer l\'examen' : '✓ Valider et Suivant →')
                        : '✓ Valider (Entrée)'
                    }
                </button>

                {!isExam && (
                    <button 
                        type="button"
                        className="nav-button secondary-button" 
                        onClick={showNextQuestion} 
                        disabled={currentQuestionIndex === questions.length - 1}
                    >
                        Suivant →
                    </button>
                )}

                {!isExam && (
                    <button 
                        type="button" 
                        className="nav-button finish-button" 
                        onClick={finish}
                    >
                        🏁 Résultats
                    </button>
                )}
            </div>

            {/* Feedbacks affichés UNIQUEMENT en mode Entraînement */}
            {!isExam && feedback && (
                <div className={`feedback-box ${feedback === 'Correct!' ? 'feedback-correct' : feedback.includes('Partiel') ? 'feedback-partial' : 'feedback-incorrect'}`}>
                    <span className="feedback-icon">
                        {feedback === 'Correct!' ? '✓' : feedback.includes('Partiel') ? '~' : '✗'}
                    </span>
                    {feedback}
                </div>
            )}
            
            {!isExam && correctResponses && correctResponses.length > 0 && (
                <div className="correct-responses-box">
                    <span className="correct-icon">💡</span>
                    <div>
                        <div className="correct-responses-title">Réponses correctes :</div>
                        <ul className="correct-responses-list">
                            {correctResponses.map((answer, idx) => (
                                <li key={idx}>
                                    <MathText text={answer} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            <KeyboardShortcutsHelp />
        </div>
    );
};

export default Step3;