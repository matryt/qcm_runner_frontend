import React, { useMemo, useState } from 'react';
import { Question } from "../../../types/Question.ts";
import MathText from '../../common/MathText.tsx';
import KeyboardShortcutsHelp from '../../common/KeyboardShortcutsHelp.tsx';
import { QuizConfig, QuizMode } from '../../../types/QuizMode.ts';
import './Step2.css';

interface Step2Props {
    showStep: (step: number) => void;
    questions: Question[];
    quizConfig: QuizConfig;
    setQuizConfig: React.Dispatch<React.SetStateAction<QuizConfig>>;
}

const Step2: React.FC<Step2Props> = ({ showStep, questions, quizConfig, setQuizConfig }) => {
    const [showAll, setShowAll] = useState(false);
    const [useTimer, setUseTimer] = useState(false);
    const previewLimit = 8;
    const totalOptions = questions.reduce((sum, q) => sum + q.options.length, 0);
    const avgOptions = questions.length > 0 ? (totalOptions / questions.length).toFixed(1) : '0.0';
    const multipleAnswers = questions.filter(q => q.correctAnswers.length > 1).length;
    
    const displayedQuestions = useMemo(
        () => (showAll ? questions : questions.slice(0, previewLimit)),
        [questions, showAll]
    );
    const hasMoreThanPreview = questions.length > previewLimit;

    const handleModeChange = (mode: QuizMode) => {
        setQuizConfig(prev => ({
            ...prev,
            mode,
            timeLimitMinutes: mode === 'exam' && useTimer ? (prev.timeLimitMinutes || 10) : null
        }));
    };

    const handleTimerToggle = (checked: boolean) => {
        setUseTimer(checked);
        setQuizConfig(prev => ({
            ...prev,
            timeLimitMinutes: checked ? 10 : null
        }));
    };

    return (
        <div className="step-container step2-container">
            <div className="step-header">
                <h2>🔍 Configuration & Prévisualisation</h2>
                <p className="step-description">Choisissez votre mode et vérifiez les questions</p>
            </div>

            {/* Sélecteur de Mode */}
            <div className="mode-selection-container">
                <div 
                    className={`mode-card ${quizConfig.mode === 'practice' ? 'active' : ''}`}
                    onClick={() => handleModeChange('practice')}
                >
                    <div className="mode-icon">🎯</div>
                    <div className="mode-title">Mode Entraînement</div>
                    <div className="mode-desc">Correction immédiate après chaque question et navigation libre.</div>
                </div>

                <div 
                    className={`mode-card ${quizConfig.mode === 'exam' ? 'active' : ''}`}
                    onClick={() => handleModeChange('exam')}
                >
                    <div className="mode-icon">📝</div>
                    <div className="mode-title">Mode Examen</div>
                    <div className="mode-desc">Aucun retour immédiat, retour en arrière interdit et résultats à la fin.</div>
                </div>
            </div>

            {/* Option Minuteur pour le mode Examen */}
            {quizConfig.mode === 'exam' && (
                <div className="timer-config-box">
                    <label className="timer-toggle-label">
                        <input 
                            type="checkbox" 
                            checked={useTimer} 
                            onChange={(e) => handleTimerToggle(e.target.checked)} 
                        />
                        <span>Activer un compte à rebours global</span>
                    </label>
                    {useTimer && (
                        <div className="timer-input-group">
                            <input 
                                type="number" 
                                min="1" 
                                max="180" 
                                value={quizConfig.timeLimitMinutes || 10} 
                                onChange={(e) => setQuizConfig(prev => ({ ...prev, timeLimitMinutes: Math.max(1, parseInt(e.target.value) || 1) }))} 
                            />
                            <span>minutes</span>
                        </div>
                    )}
                </div>
            )}

            <button className="primary-button" onClick={() => showStep(3)}>
                🚀 Démarrer le quiz
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

            {quizConfig.mode == "practice" && (
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
            )}

            <KeyboardShortcutsHelp />
        </div>
    );
};

export default Step2;