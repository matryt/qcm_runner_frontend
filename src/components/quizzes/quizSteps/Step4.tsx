import React from 'react';
import { Result } from '../../../types/Result.ts';
import MathText from '../../common/MathText.tsx';

interface Step4Props {
    showStep: (step: number) => void;
    results: Result[];
    nb: number;
    score: number;
}

const Step4: React.FC<Step4Props> = ({ showStep, results, nb, score }) => {
    const correctCount = results.filter(r => r.correct).length;
    const partialCount = results.filter(r => r.partial).length;
    const incorrectCount = results.filter(r => !r.correct && !r.partial).length;
    const percentage = Math.round((score / nb) * 100);
    
    // Déterminer la couleur et le message selon le score
    let scoreClass = 'score-low';
    let scoreMessage = 'Continuez à vous entraîner !';
    
    if (percentage >= 80) {
        scoreClass = 'score-high';
        scoreMessage = 'Excellent travail ! 🎉';
    } else if (percentage >= 60) {
        scoreClass = 'score-medium';
        scoreMessage = 'Bon travail ! Continuez comme ça !';
    }
    
    return (
        <div className="results-container">
            <h2>🎯 Résultats du Quiz</h2>
            
            {/* Score principal */}
            <div className={`score-card ${scoreClass}`}>
                <div className="score-main">
                    <span className="score-value">{score.toFixed(2)}</span>
                    <span className="score-total">/ {nb}</span>
                </div>
                <div className="score-percentage">{percentage}%</div>
                <div className="score-message">{scoreMessage}</div>
                
                {/* Barre de progression */}
                <div className="progress-bar">
                    <div 
                        className={`progress-fill ${scoreClass}`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>
            
            {/* Statistiques */}
            <div className="stats-container">
                <div className="stat-card stat-correct">
                    <div className="stat-icon">✓</div>
                    <div className="stat-value">{correctCount}</div>
                    <div className="stat-label">Correctes</div>
                </div>
                <div className="stat-card stat-partial">
                    <div className="stat-icon">~</div>
                    <div className="stat-value">{partialCount}</div>
                    <div className="stat-label">Partielles</div>
                </div>
                <div className="stat-card stat-incorrect">
                    <div className="stat-icon">✗</div>
                    <div className="stat-value">{incorrectCount}</div>
                    <div className="stat-label">Incorrectes</div>
                </div>
            </div>
            
            {/* Détail des réponses */}
            <div className="results-details">
                <h3>Détail de vos réponses</h3>
                <div className="table-wrapper">
                    <table className="results-table">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Question</th>
                            <th>Statut</th>
                            <th>Score</th>
                            <th>Vos réponses</th>
                            <th>Réponses correctes</th>
                        </tr>
                        </thead>
                        <tbody>
                        {results.map((result, index) => {
                            // Calculer le score pour cette question
                            let questionScore = 0;
                            if (result.correct) {
                                questionScore = 1;
                            } else if (result.partial) {
                                const correctCount = result.selectedOptions.filter(opt => result.correctAnswers.includes(opt)).length;
                                const incorrectCount = result.selectedOptions.filter(opt => !result.correctAnswers.includes(opt)).length;
                                questionScore = Math.max((correctCount / result.correctAnswers.length) - (incorrectCount * 0.25), 0);
                            }
                            
                            return (
                            <tr key={index} className={result.correct ? 'row-correct' : result.partial ? 'row-partial' : 'row-incorrect'}>
                                <td className="cell-number">{index + 1}</td>
                                <td className="cell-question">
                                    <div className="question-text"><MathText text={result.question} /></div>
                                </td>
                                <td className="cell-status">
                                    {result.correct && <span className="status-badge status-correct"><span className="badge-icon">✓</span> Correct</span>}
                                    {result.partial && <span className="status-badge status-partial"><span className="badge-icon">~</span> Partiel</span>}
                                    {!result.correct && !result.partial && <span className="status-badge status-incorrect"><span className="badge-icon">✗</span> Incorrect</span>}
                                </td>
                                <td className="cell-score">
                                    <span className="score-display">{questionScore.toFixed(2)}</span>
                                </td>
                                <td className="cell-answers">
                                    <ul className="answer-list">
                                        {result.selectedOptions.map((opt, i) => (
                                            <li key={i} className={result.correctAnswers.includes(opt) ? 'answer-correct' : 'answer-incorrect'}>
                                                <span className="answer-bullet">{result.correctAnswers.includes(opt) ? '✓' : '✗'}</span>
                                                <MathText text={opt} />
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="cell-correct-answers">
                                    <ul className="answer-list correct-list">
                                        {result.correctAnswers.map((opt, i) => (
                                            <li key={i}><span className="answer-bullet">✓</span><MathText text={opt} /></li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        )})}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <button className="restart-button" onClick={() => showStep(1)}>🔄 Recommencer un quiz</button>
        </div>
    );
}

export default Step4;