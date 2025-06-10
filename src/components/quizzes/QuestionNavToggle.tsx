import React, { useState } from 'react';
import QuestionNav from './QuestionNav';
import { Result } from '../../types/Result.ts';
import { Question } from '../../types/Question.ts';
import './QuestionNavToggle.css';

interface QuestionNavToggleProps {
	questions: Question[];
	setCurrentQuestionIndex: (index: number) => void;
	results: Result[];
	currentQuestionIndex: number;
}

const QuestionNavToggle: React.FC<QuestionNavToggleProps> = ({ questions, setCurrentQuestionIndex, results, currentQuestionIndex }) => {
	const [isVisible, setIsVisible] = useState<boolean>(false);

	return (
		<>
			<div className="question-nav-toggle">
				<button onClick={() => setIsVisible(!isVisible)}>
					<span className={"menuIcon"}>
						{(isVisible ? '✖' : '☰')}
					</span>
					<span>
						Naviguer aux questions
					</span>
				</button>
			</div>
			{isVisible && (
				<div className="question-nav-container">
					<QuestionNav
						questions={questions}
						setCurrentQuestionIndex={setCurrentQuestionIndex}
						results={results}
						currentQuestionIndex={currentQuestionIndex}
					/>
				</div>
			)}
		</>
	);
};

export default QuestionNavToggle;