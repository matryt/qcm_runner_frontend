import React from 'react';
import CodeBlock from '../../common/CodeBlock.tsx';
import { Question } from "../../../types/Question.ts";

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
    correctResponsesText?: string;
}

const Step3: React.FC<Step3Props> = ({ showPreviousQuestion, showNextQuestion, submitAnswer, finish, questions,
                                         currentQuestionIndex, feedback, submittedStates, selectedOptions, correctResponsesText }) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCurrentSubmitted = submittedStates[currentQuestionIndex];
    const currentSelectedOptions = selectedOptions[currentQuestionIndex] || [];

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
                    ></div>
                </div>
            </div>

            <div className="question-content">
                <h3 className="question-title">{currentQuestion.question}</h3>
                {currentQuestion.correctAnswers.length > 1 && (
                    <div className="info-badge">
                        <span className="info-icon">ℹ️</span>
                        Il y a plusieurs réponses correctes
                    </div>
                )}
                
                <div id="imageAndAnswers">
                    {currentQuestion.code ? (
                        <div style={{ maxWidth: '550px' }}>
                            <CodeBlock code={currentQuestion.code} language={currentQuestion.codeLanguage || 'tsx'} />
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
                        {currentQuestion.options.map((option: string, index: number) => (
                            <li key={index} className={`option-item ${currentSelectedOptions.includes(option) ? 'selected' : ''} ${isCurrentSubmitted ? 'disabled' : ''}`}>
                                <input 
                                    type="checkbox" 
                                    name="option" 
                                    value={option} 
                                    id={`option${index}`} 
                                    disabled={isCurrentSubmitted} 
                                    defaultChecked={currentSelectedOptions.includes(option)} 
                                />
                                <label htmlFor={`option${index}`} className="option-label">
                                    <span className="option-checkbox"></span>
                                    <span className="option-text">{option}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="navigation-buttons">
                <button 
                    className="nav-button secondary-button" 
                    onClick={showPreviousQuestion} 
                    disabled={currentQuestionIndex == 0}
                >
                    ← Précédent
                </button>
                <button 
                    className="nav-button primary-button" 
                    onClick={submitAnswer} 
                    disabled={isCurrentSubmitted}
                >
                    ✓ Envoyer
                </button>
                <button 
                    className="nav-button secondary-button" 
                    onClick={showNextQuestion} 
                    disabled={currentQuestionIndex == questions.length - 1}
                >
                    Suivant →
                </button>
                <button className="nav-button finish-button" onClick={finish}>
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
            
            {correctResponsesText && (
                <div className="correct-responses-box">
                    <span className="correct-icon">💡</span>
                    {correctResponsesText}
                </div>
            )}
        </div>
    );
}

export default Step3;