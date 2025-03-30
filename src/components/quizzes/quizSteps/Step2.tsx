import React from 'react';
import {Question} from "../../../types/Question.ts";

interface Step2Props {
    showStep: (step: number) => void;
    questions: Question[];
}

const Step2: React.FC<Step2Props> = ({ showStep, questions }) => {
    return (
        <div>
            <h2>Prévisualisation</h2>
            <div>
                <table>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Question</th>
                        <th>Options</th>
                    </tr>
                    </thead>
                    <tbody>
                    {questions.map((q, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{q.question}</td>
                            <td>{q.options.length}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <button onClick={() => showStep(3)}>Commencer le quiz</button>
        </div>
    );
}

export default Step2;