import React, { useState } from 'react';
import Quiz from './Quiz.tsx';
import '../../App.css';
import Menu from "../Menu.tsx";

const QuizPage: React.FC = () => {
    const [step, setStep] = useState<number>(1);

    const showStep = (step: number) => {
        setStep(step);
    };

    return (
        <div className="App">
            <Menu />
            <h1>Quiz Runner</h1>
            <Quiz step={step} showStep={showStep} />
        </div>
    );
};

export default QuizPage;