import React, { useEffect } from 'react';
import CodeBlock from '../../common/CodeBlock.tsx';
import { Question } from "../../../types/Question.ts";
import MathText from '../../common/MathText.tsx';
import './Step3.css';
import KeyboardShortcutsHelp from '../../common/KeyboardShortcutsHelp.tsx';

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
    correctResponses
}) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCurrentSubmitted = submittedStates[currentQuestionIndex] ?? false;
    const currentSelected = selectedOptions[currentQuestionIndex] ?? [];
    const isMultiple = currentQuestion.correctAnswers.length > 1;

    // Gestion des raccourcis clavier
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Ignorer si le focus est sur un champ de texte
            const target = event.target as HTMLElement;
            if (target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'text') return;
            if (target.tagName === 'TEXTAREA') return;

            // Touches numériques (gère le pavé numérique, le clavier standard et les caractères AZERTY &, é, ", ', etc.)
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

            // Navigation au clavier
            if (event.key === 'ArrowLeft' && currentQuestionIndex > 0) {
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
        submitAnswer
    ]);

    return (
        <div className="step-container step3-container">
            <div className="question-header">
                <div className="question-counter">
                    Question {currentQuestionIndex + 1} / {questions.length}
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
                
                {isMultiple && (
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
                                        type={isMultiple ? 'checkbox' : 'radio'} 
                                        name={`question-${currentQuestionIndex}`}
                                        value={option} 
                                        id={optionId} 
                                        disabled={isCurrentSubmitted} 
                                        checked={isChecked}
                                        onChange={() => onToggleOption(option)}
                                    />
                                    <label htmlFor={optionId} className="option-label">
                                        <span className={`option-checkbox ${!isMultiple ? 'radio-style' : ''}`} />
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
                <button 
                    type="button"
                    className="nav-button secondary-button" 
                    onClick={showPreviousQuestion} 
                    disabled={currentQuestionIndex === 0}
                >
                    ← Précédent
                </button>
                <button 
                    type="button"
                    className="nav-button primary-button" 
                    onClick={submitAnswer} 
                    disabled={isCurrentSubmitted || currentSelected.length === 0}
                >
                    ✓ Valider (Entrée)
                </button>
                <button 
                    type="button"
                    className="nav-button secondary-button" 
                    onClick={showNextQuestion} 
                    disabled={currentQuestionIndex === questions.length - 1}
                >
                    Suivant →
                </button>
                <button 
                    type="button" 
                    className="nav-button finish-button" 
                    onClick={finish}
                >
                    🏁 Résultats
                </button>
            </div>

            {feedback && (
                <div className={`feedback-box ${feedback === 'Correct!' ? 'feedback-correct' : feedback.includes('Partiel') ? 'feedback-partial' : 'feedback-incorrect'}`}>
                    <span className="feedback-icon">
                        {feedback === 'Correct!' ? '✓' : feedback.includes('Partiel') ? '~' : '✗'}
                    </span>
                    {feedback}
                </div>
            )}
            
            {correctResponses && correctResponses.length > 0 && (
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