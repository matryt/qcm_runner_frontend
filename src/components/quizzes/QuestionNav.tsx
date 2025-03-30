import React from 'react';
import { Result } from '../../types/Result.ts';
import { Question } from '../../types/Question.ts';

interface QuestionNavProps {
    questions: Question[];
    setCurrentQuestionIndex: (index: number) => void;
    results: Result[];
    currentQuestionIndex: number;
}

const QuestionNav: React.FC<QuestionNavProps> = ({ questions, setCurrentQuestionIndex, results, currentQuestionIndex }) => {
    const getButtonClass = (index: number) => {
        if (index === currentQuestionIndex) return 'current';
        const result = results[index];
        if (!result) return '';
        if (result.correct) return 'correct';
        if (!result.correct && result.partial) return 'partial';
        return 'incorrect';
    };

    return (
        <div className="question-nav">
            {questions.map((_, index) => (
                <button
                    key={index}
                    className={`question-button ${getButtonClass(index)}`}
                    onClick={() => setCurrentQuestionIndex(index)}
                >
                    {index + 1}
                </button>
            ))}
        </div>
    );
};

export default QuestionNav;