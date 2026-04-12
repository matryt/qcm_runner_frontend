import React, { useMemo, useState } from 'react';
import {Question} from "../../../types/Question.ts";
import MathText from '../../common/MathText.tsx';

interface Step2Props {
    showStep: (step: number) => void;
    questions: Question[];
}

const Step2: React.FC<Step2Props> = ({ showStep, questions }) => {
    const [showAll, setShowAll] = useState(false);
    const previewLimit = 8;
    const totalOptions = questions.reduce((sum, q) => sum + q.options.length, 0);
    const avgOptions = questions.length > 0 ? (totalOptions / questions.length).toFixed(1) : '0.0';
    const multipleAnswers = questions.filter(q => q.correctAnswers.length > 1).length;
    const displayedQuestions = useMemo(
        () => (showAll ? questions : questions.slice(0, previewLimit)),
        [questions, showAll]
    );
    const hasMoreThanPreview = questions.length > previewLimit;
    
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
                <div className="preview-controls">
                    <span className="preview-count">
                        Aperçu: {displayedQuestions.length} / {questions.length}
                    </span>
                    {hasMoreThanPreview && (
                        <button
                            className="secondary-button preview-toggle"
                            onClick={() => setShowAll((prev) => !prev)}
                        >
                            {showAll ? 'Voir moins' : 'Voir tout'}
                        </button>
                    )}
                </div>
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
                    {displayedQuestions.map((q, index) => (
                        <tr key={index}>
                            <td className="cell-number">{index + 1}</td>
                            <td className="cell-question">
                                <div className="question-preview"><MathText text={q.question} /></div>
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