import React from 'react';
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
}

const Step3: React.FC<Step3Props> = ({ showPreviousQuestion, showNextQuestion, submitAnswer, finish, questions, currentQuestionIndex, feedback, submittedStates, selectedOptions }) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCurrentSubmitted = submittedStates[currentQuestionIndex];
    const currentSelectedOptions = selectedOptions[currentQuestionIndex] || [];

    return (
        <div>
            <div id="quizContent">
                <h3>{currentQuestion.question}</h3>
                <ul>
                    {currentQuestion.options.map((option: string, index: number) => (
                        <li key={index}>
                            <input type="checkbox" name="option" value={option} id={`option${index}`} disabled={isCurrentSubmitted} defaultChecked={currentSelectedOptions.includes(option)} />
                            <label htmlFor={`option${index}`}>{option}</label>
                        </li>
                    ))}
                </ul>
            </div>
            <button onClick={showPreviousQuestion} disabled={isCurrentSubmitted}>Previous</button>
            <button onClick={submitAnswer} disabled={isCurrentSubmitted}>Submit</button>
            <button onClick={showNextQuestion} disabled={!isCurrentSubmitted}>Next</button>
            <button onClick={finish}>Finish</button>
            <div id="feedback" className={feedback === 'Correct!' ? 'correct' : feedback === 'Partially correct.' ? 'partial' : 'incorrect'}>{feedback || ''}</div>
        </div>
    );
}

export default Step3;