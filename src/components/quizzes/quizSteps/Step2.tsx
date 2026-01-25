import React from 'react';
import {Question} from "../../../types/Question.ts";

interface Step2Props {
    showStep: (step: number) => void;
    questions: Question[];
}

const Step2: React.FC<Step2Props> = ({ showStep, questions }) => {
    const totalOptions = questions.reduce((sum, q) => sum + q.options.length, 0);
    const avgOptions = (totalOptions / questions.length).toFixed(1);
    const multipleAnswers = questions.filter(q => q.correctAnswers.length > 1).length;
    
    return (
        <div className="step-container step2-container">
            <div className="step-header">
                <h2>🔍 Prévisualisation du Quiz</h2>
                <p className="step-description">Vérifiez les questions avant de commencer</p>
            </div>

            <button className="primary-button" onClick={() => showStep(3)}>
                🎯 Commencer le quiz
            </button>

            <div className="quiz-stats">
                <div className="stat-box">
                    <div className="stat-value">{questions.length}</div>
                    <div className="stat-label">Questions</div>
                </div>
                <div className="stat-box">
                    <div className="stat-value">{avgOptions}</div>
                    <div className="stat-label">Options/Question</div>
                </div>
                <div className="stat-box">
                    <div className="stat-value">{multipleAnswers}</div>
                    <div className="stat-label">Réponses multiples</div>
                </div>
            </div>

            <div className="preview-table-wrapper">
                <table className="preview-table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Question</th>
                        <th>Options</th>
                        <th>Réponses correctes</th>
                    </tr>
                    </thead>
                    <tbody>
                    {questions.map((q, index) => (
                        <tr key={index}>
                            <td className="cell-number">{index + 1}</td>
                            <td className="cell-question">
                                <div className="question-preview">{q.question}</div>
                            </td>
                            <td className="cell-center">
                                <span className="badge badge-info">{q.options.length} options</span>
                            </td>
                            <td className="cell-center">
                                <span className="badge badge-success">{q.correctAnswers.length}</span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Step2;