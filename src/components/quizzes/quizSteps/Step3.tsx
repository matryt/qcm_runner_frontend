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
        <div>
            <div id="quizContent">
                <h3>{currentQuestion.question}</h3>
                {currentQuestion.correctAnswers.length > 1 && <div>Il y a plusieurs réponses correctes.</div>}
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
                    <ul>
                        {currentQuestion.options.map((option: string, index: number) => (
                            <li key={index}>
                                <input type="checkbox" name="option" value={option} id={`option${index}`} disabled={isCurrentSubmitted} defaultChecked={currentSelectedOptions.includes(option)} />
                                <label htmlFor={`option${index}`}>{option}</label>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <button onClick={showPreviousQuestion} disabled={currentQuestionIndex == 0}>Précédent</button>
            <button onClick={submitAnswer} disabled={isCurrentSubmitted}>Envoyer</button>
            <button onClick={showNextQuestion} disabled={currentQuestionIndex == questions.length - 1}>Suivant</button>
            <button onClick={finish}>Résultats</button>
            <div id="feedback" className={feedback === 'Correct!' ? 'correct' : feedback === 'Partially correct.' ? 'partial' : 'incorrect'}>{feedback || ''}</div>
            {correctResponsesText && <div id="correctResponses">{correctResponsesText}</div>}
        </div>
    );
}

export default Step3;